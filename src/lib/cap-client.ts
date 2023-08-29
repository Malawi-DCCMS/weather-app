import Axios from 'axios';
import {XMLParser} from 'fast-xml-parser';
import {pointInPolygon, Polygon} from 'geometric';
import {CAP_FEED_URL} from '@env';

import {LOGGER} from './';
import {CAPAlert, CAPFeed} from '../types/cap-feed.type';

function xml2JSON<T>(feed: string): T {
  const parser = new XMLParser({removeNSPrefix: true});
  return parser.parse(feed) as T;
}

export function parsePolygon(polygon: string): Polygon {
  const regex = /^(?:-?\d+\.\d+,-?\d+\.\d+)(?: -?\d+\.\d+,-?\d+\.\d+)+$/;
  if (!regex.test(polygon)) {
    throw new Error('Malformed polygon string!');
  }

  return polygon.split(' ').map(p => {
    const [x, y] = p.split(',');
    return [parseFloat(x), parseFloat(y)];
  });
}

function isWithinArea(point: [number, number], polygon: string): boolean {
  return pointInPolygon(point, parsePolygon(polygon));
}

export const CAPClient = {
  async getAlerts(lat: number, lon: number): Promise<Array<CAPAlert>> {
    LOGGER.info(`Getting CAP alerts for ${lat},${lon} from ${CAP_FEED_URL}...`);
    const feed = xml2JSON<CAPFeed>((await Axios.get(CAP_FEED_URL)).data);
    const items = feed.rss.channel.item;
    const links = items instanceof Array ? items.map(v => v.link) : [items.link];
    const alerts = await Promise.all(links.map(ln => Axios.get(ln)));
    const parsed = alerts.map(val => xml2JSON<CAPAlert>(val.data));
    return parsed.filter(v => {
      return isWithinArea([lat, lon], v.alert.info.area.polygon);
    });
  },
};
