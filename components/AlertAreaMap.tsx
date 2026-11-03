import React, { JSX, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map as MapLibreMap,
  Marker,
  RasterSource,
  type LngLatBounds,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native';
import type { Feature, FeatureCollection, Polygon as GeoJSONPolygon } from 'geojson';
import { booleanValid, kinks } from '@turf/turf';
import { useTranslation } from 'react-i18next';

import { useLocationStore } from '@/lib/store/location.store';
import { OSM_TILE_URL } from '@/config';
import { ThemeColors, Fonts, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type AlertAreaMapProps = {
  // The alert's raw CAP area polygon(s) — deliberately untrusted, since
  // this comes straight from an external XML feed. Anything that doesn't
  // parse into well-formed, finite lat/lng rings is dropped rather than
  // rendered, per the "don't show a broken/misleading map" requirement.
  polygon: Feature<GeoJSONPolygon>[] | undefined;
  // The alert's severity band color (e.g. WARNING_COLORS[level]), reused
  // for the polygon outline/fill so the map reads consistently with the
  // rest of the card rather than always defaulting to one color.
  color: string;
  // Off by default in the shareable card (AlertShareCard passes false):
  // the dot marks the viewer's own current GPS location, which is fine to
  // show privately in-app but must not be baked into an image the user
  // can forward on to other people.
  showUserLocation?: boolean;
  // Fired exactly once — either once the map has finished rendering tiles
  // (so a caller doing an off-screen snapshot, e.g. AlertShareCard, knows
  // it's safe to capture), or immediately if no map will render at all
  // (invalid/missing polygon). Optional since the on-screen alert detail
  // usage doesn't need to know.
  onMapLoaded?: () => void;
};

const MAP_HEIGHT = 160;
// A bit of breathing room around the polygon so it doesn't touch the edges
// of the preview, applied on top of the 50km minimum below.
const BOUNDS_PADDING_RATIO = 0.35;
// The map's initial view should show at least ~50km across, even for a
// small/precise alert polygon — otherwise a tiny hazard area zooms in so
// close there's no surrounding geography for context. Large polygons that
// already span more than this are unaffected (never zoomed OUT past their
// own padded extent).
const MIN_SPAN_KM = 50;
const KM_PER_DEGREE_LAT = 111.32;

// No base style — no vector basemap, no API key/account needed. The OSM
// raster tiles and the alert polygon are both added declaratively as
// children below instead of being baked into a remote style.json.
const BLANK_STYLE: StyleSpecification = { version: 8, sources: {}, layers: [] };

function isFiniteLatLng(longitude: number, latitude: number): boolean {
  return (
    Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

// Only well-formed features survive. In order: every vertex must be a
// finite, in-range coordinate; turf.booleanValid() catches structurally
// degenerate rings (too few points, not closed, a vertex touching a
// non-adjacent edge); turf.kinks() separately catches self-intersecting/
// "bowtie" rings, which booleanValid does NOT reliably detect on its own
// (verified: a classic bowtie polygon passes booleanValid since the
// crossing point isn't a vertex). Each feature is checked in isolation and
// defensively try/caught, since malformed external XML data could hand
// turf something it doesn't expect at all.
function getValidFeatures(polygon: Feature<GeoJSONPolygon>[] | undefined): Feature<GeoJSONPolygon>[] {
  if (!polygon || polygon.length === 0) return [];

  const valid: Feature<GeoJSONPolygon>[] = [];
  for (const feature of polygon) {
    try {
      if (!feature?.geometry || feature.geometry.type !== 'Polygon') continue;
      const hasOnlyFiniteCoords = feature.geometry.coordinates.every(
        ring => ring && ring.length >= 4 && ring.every(([lng, lat]) => isFiniteLatLng(lng, lat))
      );

      if (!hasOnlyFiniteCoords) continue;

      if (!booleanValid(feature)) continue;

      if (kinks(feature).features.length > 0) continue;

      valid.push(feature);
    } catch {
      continue;
    }
  }
  return valid;
}

function computeBounds(features: Feature<GeoJSONPolygon>[]): LngLatBounds | null {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const feature of features) {
    for (const ring of feature.geometry.coordinates) {
      for (const [lng, lat] of ring) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      }
    }
  }

  if (![minLat, maxLat, minLng, maxLng].every(Number.isFinite)) {
    return null;
  }

  // Longitude degrees shrink in real-world distance as latitude moves away
  // from the equator (111.32km per degree of latitude everywhere, but only
  // 111.32*cos(lat)km per degree of longitude) — convert the 50km target
  // using the polygon's own center latitude so it's an accurate ~50km in
  // both directions, not just along the latitude axis.
  const centerLat = (minLat + maxLat) / 2;
  const kmPerDegreeLng = KM_PER_DEGREE_LAT * Math.cos((centerLat * Math.PI) / 180);
  const minLatSpan = MIN_SPAN_KM / KM_PER_DEGREE_LAT;
  const minLngSpan = MIN_SPAN_KM / kmPerDegreeLng;

  const paddedLatSpan = (maxLat - minLat) * (1 + BOUNDS_PADDING_RATIO);
  const paddedLngSpan = (maxLng - minLng) * (1 + BOUNDS_PADDING_RATIO);

  // The 50km floor applies to the final (padded) view — small polygons get
  // expanded up to it; polygons already larger than that keep their own
  // natural padded extent, never zoomed out past their real size.
  const latSpan = Math.max(paddedLatSpan, minLatSpan);
  const lngSpan = Math.max(paddedLngSpan, minLngSpan);

  const centerLng = (minLng + maxLng) / 2;

  return [
    centerLng - lngSpan / 2,
    centerLat - latSpan / 2,
    centerLng + lngSpan / 2,
    centerLat + latSpan / 2,
  ];
}

function hexToRgba(hex: string, alpha: number): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return hex;
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Small inset map showing just the alert's affected area(s), so "is this
// near me" reads at a glance instead of requiring parsing place names.
// Renders OpenStreetMap-compatible raster tiles (URL configurable via
// EXPO_PUBLIC_OSM_TILE_URL — defaults to the public OSM server for
// development; production deployments should point this at their own OSM
// tile server) via MapLibre, not a Google/Apple/Mapbox-hosted basemap.
function AlertAreaMap({ polygon, color, showUserLocation = true, onMapLoaded }: AlertAreaMapProps): JSX.Element | null {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const userLat = useLocationStore(s => s.lat);
  const userLon = useLocationStore(s => s.lon);

  const features = useMemo(() => getValidFeatures(polygon), [polygon]);
  const bounds = useMemo(() => computeBounds(features), [features]);
  const featureCollection = useMemo<FeatureCollection<GeoJSONPolygon>>(
    () => ({ type: 'FeatureCollection', features }),
    [features]
  );
  const hasMap = features.length > 0 && !!bounds;

  // Signal "loaded" (nothing more to wait for) when there's no map to
  // render at all — the MapLibreMap below reports its own load via
  // onDidFinishRenderingMapFully when hasMap is true.
  const notifiedNoMapRef = useRef(false);
  useEffect(() => {
    if (!hasMap && !notifiedNoMapRef.current) {
      notifiedNoMapRef.current = true;
      onMapLoaded?.();
    }
  }, [hasMap, onMapLoaded]);

  if (!hasMap) {
    return null;
  }

  const hasUserLocation = showUserLocation && typeof userLat === 'number' && typeof userLon === 'number' && isFiniteLatLng(userLon, userLat);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('alert.affectedArea')}</Text>
      <View style={styles.mapWrapper}>
        <MapLibreMap
          style={styles.map}
          mapStyle={BLANK_STYLE}
          dragPan={true}
          touchZoom={true}
          doubleTapZoom={true}
          doubleTapHoldZoom={false}
          touchRotate={false}
          touchPitch={false}
          attribution={false}
          logo={false}
          compass={true}
          scaleBar={true}
          onDidFinishRenderingMapFully={onMapLoaded}
        >
          <Camera initialViewState={{ bounds, padding: { top: 16, left: 16, right: 16, bottom: 16 } }} />

          <RasterSource id="osmTiles" tiles={[OSM_TILE_URL]} tileSize={256} minzoom={0} maxzoom={19}>
            <Layer id="osmTilesLayer" type="raster" />
          </RasterSource>

          <GeoJSONSource id="alertArea" data={featureCollection}>
            <Layer id="alertAreaFill" type="fill" paint={{ 'fill-color': hexToRgba(color, 0.25) }} />
            <Layer id="alertAreaOutline" type="line" paint={{ 'line-color': color, 'line-width': 2 }} />
          </GeoJSONSource>

          {hasUserLocation && (
            <Marker lngLat={[userLon as number, userLat as number]}>
              <View style={styles.userDot} />
            </Marker>
          )}
        </MapLibreMap>
      </View>
      <Text style={styles.attribution}>{t('alert.map.attribution')}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    marginBottom: Spacing.md,
  },
  mapWrapper: {
    height: MAP_HEIGHT,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.extraLarge,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  attribution: {
    fontSize: 11,
    fontFamily: Fonts.sans.regular,
    color: colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
});

export default AlertAreaMap;
