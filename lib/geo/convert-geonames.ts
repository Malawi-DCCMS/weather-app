#!/usr/bin/env node
/**
 * Converts a GeoNames country dump file (e.g. ET.txt) to the JSON format
 * used by assets/geonames.json.
 *
 * Defaults to Ethiopia (ET.txt, admin1CodesASCII.txt, admin2Codes.txt) bundled
 * alongside this script. Run with --help for all options.
 *
 * Always writes a simplified {id, title, region} dataset and a serialized
 * trie-search root to lib/autocomplete/dataset.json and trie.json.
 *
 * Example (Ethiopia, default):
 *   npx tsx lib/geo/convert-geonames.ts --feature-class P
 *
 * Example (another country):
 *   npx tsx lib/geo/convert-geonames.ts MW.txt \
 *     --admin1 admin1CodesASCII.txt \
 *     --admin2 admin2Codes.txt \
 *     --feature-class P
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
// @ts-ignore — trie-search has no bundled types
const TrieSearch = require('trie-search');

// Column indices in the tab-delimited dump
const COL = {
  name: 1,
  latitude: 4,
  longitude: 5,
  featureClass: 6,
  featureCode: 7,
  countryCode: 8,
  admin1Code: 10,
  admin2Code: 11,
  elevation: 15,
} as const;

// GeoNames feature class+code -> human-readable description
const FEATURE_CODE_MAP: Record<string, string> = {
  // A – Administrative divisions
  'A.ADM1':  'first-order administrative division',
  'A.ADM1H': 'historical first-order administrative division',
  'A.ADM2':  'second-order administrative division',
  'A.ADM2H': 'historical second-order administrative division',
  'A.ADM3':  'third-order administrative division',
  'A.ADM4':  'fourth-order administrative division',
  'A.ADM5':  'fifth-order administrative division',
  'A.ADMD':  'administrative division',
  'A.ADMF':  'administrative facility',
  'A.PCLD':  'dependent political entity',
  'A.PCLF':  'freely associated state',
  'A.PCLI':  'independent political entity',
  'A.PCLIX': 'section of independent political entity',
  // H – Streams, lakes, water bodies
  'H.BAY':   'bay',
  'H.BAYS':  'bays',
  'H.BGHT':  'bight(s)',
  'H.CNL':   'canal',
  'H.CNLA':  'aqueduct',
  'H.CNLB':  'navigation canal(s)',
  'H.CNLD':  'drainage canal',
  'H.CNLI':  'irrigation canal',
  'H.CNLN':  'navigation canal(s)',
  'H.CNLQ':  'abandoned canal',
  'H.CNLSB': 'underground irrigation canal',
  'H.CNLX':  'section of canal',
  'H.FLLS':  'waterfall(s)',
  'H.FLTM':  'mud flat(s)',
  'H.INLT':  'inlet',
  'H.INLTQ': 'former inlet',
  'H.LGN':   'lagoon',
  'H.LK':    'lake',
  'H.LKC':   'lake channel(s)',
  'H.LKI':   'intermittent lake',
  'H.LKN':   'salt lake',
  'H.LKNI':  'intermittent salt lake',
  'H.LKO':   'oxbow lake',
  'H.LKOI':  'intermittent oxbow lake',
  'H.LKS':   'lakes',
  'H.LKSB':  'underground lake',
  'H.LKSC':  'crater lake',
  'H.MRSH':  'marsh(es)',
  'H.MRSHN': 'salt marsh',
  'H.MRSHT': 'tidal flat(s)',
  'H.OVF':   'overfalls',
  'H.PND':   'pond',
  'H.PNDI':  'intermittent pond',
  'H.PNDS':  'ponds',
  'H.POOL':  'pool(s)',
  'H.RSV':   'reservoir(s)',
  'H.RSVT':  'water tank',
  'H.RVN':   'ravine(s)',
  'H.SPNG':  'spring(s)',
  'H.SPNS':  'sulphur spring(s)',
  'H.SPNT':  'hot spring(s)',
  'H.STM':   'stream',
  'H.STMI':  'intermittent stream',
  'H.STMIX': 'section of intermittent stream',
  'H.STMX':  'section of stream',
  'H.SWMP':  'swamp',
  'H.SYSI':  'irrigation system',
  'H.WAD':   'wadi',
  'H.WADI':  'intermittent wetland',
  'H.WLL':   'well',
  'H.WLLQ':  'abandoned well',
  'H.WLLS':  'wells',
  'H.WTRH':  'waterhole(s)',
  'H.WTRC':  'watercourse',
  // L – Parks, areas, regions
  'L.AREA':  'area',
  'L.BSND':  'drainage basin',
  'L.FRST':  'forest reserve',
  'L.INDS':  'industrial area',
  'L.LCTY':  'locality',
  'L.PRK':   'park',
  'L.RES':   'reserve',
  'L.RESV':  'reservation',
  'L.RESW':  'wildlife reserve',
  'L.RGN':   'region',
  'L.RGNE':  'economic region',
  'L.RGNH':  'historical region',
  'L.RGNL':  'lake region',
  // P – Populated places
  'P.PPL':   'populated place',
  'P.PPLA':  'seat of a first-order administrative division',
  'P.PPLA2': 'seat of a second-order administrative division',
  'P.PPLA3': 'seat of a third-order administrative division',
  'P.PPLA4': 'seat of a fourth-order administrative division',
  'P.PPLC':  'capital of a political entity',
  'P.PPLCL': 'locality',
  'P.PPLF':  'farm village',
  'P.PPLL':  'populated locality',
  'P.PPLQ':  'abandoned populated place',
  'P.PPLS':  'populated places',
  'P.PPLW':  'destroyed populated place',
  'P.PPLX':  'section of populated place',
  // R – Roads, railroads
  'R.RD':    'road',
  'R.RDJ':   'road junction',
  'R.RDST':  'roadstead',
  'R.RR':    'railroad',
  'R.TRL':   'trail',
  // S – Spots, buildings, farms
  'S.ADMF':  'administrative facility',
  'S.AGRC':  'agricultural colony',
  'S.AGRF':  'agricultural facility',
  'S.AIRF':  'airfield',
  'S.AIRP':  'airport',
  'S.AIRQ':  'abandoned airfield',
  'S.ARCH':  'arch',
  'S.BANK':  'bank',
  'S.BCN':   'beacon',
  'S.BLDG':  'building(s)',
  'S.BLDO':  'office building',
  'S.BP':    'boundary marker',
  'S.BRKS':  'barracks',
  'S.BRKW':  'breakwater',
  'S.CAVE':  'cave(s)',
  'S.CH':    'church',
  'S.CMP':   'camp(s)',
  'S.CMPL':  'logging camp',
  'S.CMPLA': 'labor camp',
  'S.CMPMN': 'mining camp',
  'S.CMPO':  'oil camp',
  'S.CMPQ':  'abandoned camp(s)',
  'S.CMPRF': 'refugee camp',
  'S.CMTY':  'cemetery',
  'S.COMC':  'communication center',
  'S.CSTM':  'customs post',
  'S.CTHSE': 'courthouse',
  'S.CTRM':  'medical center',
  'S.CTRR':  'religious center',
  'S.DAM':   'dam',
  'S.DAMQ':  'ruined dam',
  'S.DIP':   'diplomatic facility',
  'S.EST':   'estate(s)',
  'S.ESTB':  'banana plantation',
  'S.ESTC':  'cotton plantation',
  'S.ESTE':  'estate(s)',
  'S.ESTG':  'tea plantation',
  'S.ESTM':  'mango plantation',
  'S.ESTR':  'rubber plantation',
  'S.ESTRSG':'rice paddy',
  'S.ESTU':  'sugar plantation',
  'S.ESTSG': 'sugar plantation',
  'S.ESTX':  'section of estate',
  'S.FCL':   'facility',
  'S.FRM':   'farm',
  'S.FRMT':  'farm',
  'S.FT':    'fort',
  'S.HSP':   'hospital',
  'S.HSPC':  'clinic',
  'S.HSPD':  'dispensary',
  'S.HSPL':  'leprosarium',
  'S.HTL':   'hotel',
  'S.HTEL':  'hotel',
  'S.INSM':  'military installation',
  'S.ITTR':  'research institution',
  'S.LEPC':  'leprosarium',
  'S.LIBR':  'library',
  'S.MALL':  'mall',
  'S.MFG':   'factory',
  'S.MFGQ':  'abandoned factory',
  'S.MKT':   'market',
  'S.MLSW':  'sawmill',
  'S.MLWND': 'windmill',
  'S.MLWTR': 'watermill',
  'S.MN':    'mine(s)',
  'S.MNAU':  'gold mine(s)',
  'S.MNC':   'coal mine(s)',
  'S.MNFE':  'iron mine(s)',
  'S.MNMT':  'monument',
  'S.MNQ':   'abandoned mine(s)',
  'S.MNQR':  'quarry(-ies)',
  'S.MSQE':  'mosque',
  'S.MSSN':  'mission',
  'S.MSTY':  'monastery',
  'S.NOV':   'novitiate',
  'S.PAL':   'palace',
  'S.PO':    'post office',
  'S.PMPW':  'water pumping station',
  'S.PP':    'police post',
  'S.PRN':   'prison',
  'S.PS':    'power station',
  'S.PSH':   'hydroelectric power station',
  'S.PSTB':  'border post',
  'S.PSTC':  'customs post',
  'S.PSTP':  'patrol post',
  'S.RDCR':  'traffic circle',
  'S.RDIN':  'road junction',
  'S.REST':  'restaurant',
  'S.RHSE':  'resthouse',
  'S.RSRT':  'resort',
  'S.RSTN':  'railroad station',
  'S.RSTNQ': 'abandoned railroad station',
  'S.RSTP':  'railroad siding',
  'S.RSTPQ': 'abandoned railroad stop',
  'S.RUIN':  'ruin(s)',
  'S.SCH':   'school',
  'S.SCHA':  'agricultural school',
  'S.SCHC':  'college',
  'S.SCHL':  'language school',
  'S.SCHM':  'military school',
  'S.SCHN':  'maritime school',
  'S.SCHT':  'technical school',
  'S.SHSE':  'storehouse',
  'S.SQR':   'square',
  'S.STDM':  'stadium',
  'S.STNM':  'meteorological station',
  'S.SWML':  'sawmill',
  'S.TMB':   'tomb(s)',
  'S.TOWR':  'tower',
  'S.TRANT': 'transit terminal',
  'S.TRIG':  'triangulation station',
  'S.UNIV':  'university',
  // T – Mountains, hills, rocks, terrain
  'T.BUTE':  'butte(s)',
  'T.CAPE':  'cape',
  'T.CLDA':  'caldera',
  'T.CLF':   'cliff(s)',
  'T.CRTR':  'crater(s)',
  'T.DLTA':  'delta',
  'T.DPR':   'depression(s)',
  'T.DSRT':  'desert',
  'T.DUNE':  'dune(s)',
  'T.FORD':  'ford',
  'T.GRGE':  'gorge(s)',
  'T.HLL':   'hill',
  'T.HLLS':  'hills',
  'T.HMCK':  'hammock(s)',
  'T.ISL':   'island',
  'T.ISLS':  'islands',
  'T.LAVA':  'lava area',
  'T.MESA':  'mesa(s)',
  'T.MND':   'mound(s)',
  'T.MT':    'mountain',
  'T.MTS':   'mountains',
  'T.PAN':   'pan',
  'T.PASS':  'pass',
  'T.PEN':   'peninsula',
  'T.PK':    'peak',
  'T.PKS':   'peaks',
  'T.PLAT':  'plateau',
  'T.PLN':   'plain(s)',
  'T.PT':    'point',
  'T.RDGE':  'ridge(s)',
  'T.RK':    'rock',
  'T.RKS':   'rocks',
  'T.SAND':  'sand area',
  'T.SCRP':  'escarpment',
  'T.SLP':   'slope(s)',
  'T.SPUR':  'spur(s)',
  'T.VAL':   'valley',
  'T.VALS':  'valleys',
  'T.VALX':  'section of valley',
  'T.VLC':   'volcano',
  // V – Vegetation
  'V.FRST':  'forest(s)',
  'V.FRSTF': 'fossilized forest',
  'V.GRSLD': 'grassland',
  'V.MOOR':  'moor(s)',
  'V.SCRB':  'scrubland',
};

type Place = {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  admin1: string | null;
  admin2: string | null;
  feature: string | null;
};

function loadAdmin1Codes(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length >= 2) {
      map.set(parts[0].trim(), parts[1].trim());
    }
  }
  return map;
}

function loadAdmin2Codes(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length >= 2) {
      map.set(parts[0].trim(), parts[1].trim());
    }
  }
  return map;
}

async function convert(): Promise<void> {
  const program = new Command()
    .name('convert-geonames')
    .description('Converts a GeoNames country dump file to assets/geonames.json')
    .argument('[input]', 'GeoNames country dump .txt file', path.join(__dirname, 'ET.txt'))
    .option('--admin1 <file>', 'path to admin1CodesASCII.txt', path.join(__dirname, 'admin1CodesASCII.txt'))
    .option('--admin2 <file>', 'path to admin2Codes.txt', path.join(__dirname, 'admin2Codes.txt'))
    .option('--feature-class <list>', 'comma-separated feature classes to include, e.g. P,T,H')
    .option('--output <file>', 'output file', path.join(__dirname, '../../assets/geonames.json'))
    .parse(process.argv);

  const [inputFile] = program.processedArgs as [string];
  const opts = program.opts<{ admin1: string; admin2: string; featureClass?: string; output: string }>();
  const admin1File = opts.admin1;
  const admin2File = opts.admin2;
  const featureClasses: Set<string> | null = opts.featureClass
    ? new Set(opts.featureClass.split(',').map((c) => c.trim().toUpperCase()))
    : null;
  const outputFile = opts.output;

  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const admin1Map = loadAdmin1Codes(admin1File);
  const admin2Map = loadAdmin2Codes(admin2File);

  const places: Place[] = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;

    const cols = line.split('\t');
    if (cols.length < 19) continue;

    const featureClass = cols[COL.featureClass];
    if (featureClasses && !featureClasses.has(featureClass)) continue;

    const featureCode = cols[COL.featureCode];
    const featureKey = `${featureClass}.${featureCode}`;
    const feature = FEATURE_CODE_MAP[featureKey] ?? null;

    const elevationRaw = cols[COL.elevation];
    const elevation =
      elevationRaw && elevationRaw.trim() !== '' ? parseInt(elevationRaw, 10) : null;

    const countryCode = cols[COL.countryCode];
    const admin1Code = cols[COL.admin1Code];
    const admin2Code = cols[COL.admin2Code];

    const admin1LookupKey = `${countryCode}.${admin1Code}`;
    const admin2LookupKey = `${countryCode}.${admin1Code}.${admin2Code}`;

    const admin1 = admin1Map.get(admin1LookupKey) ?? null;
    const admin2 = admin2Map.get(admin2LookupKey) ?? null;

    places.push({
      name: cols[COL.name],
      latitude: parseFloat(cols[COL.latitude]),
      longitude: parseFloat(cols[COL.longitude]),
      elevation: Number.isNaN(elevation) ? null : elevation,
      admin1,
      admin2,
      feature,
    });
  }

  const json = JSON.stringify(places, null, 2);

  fs.writeFileSync(outputFile, json, 'utf-8');
  console.error(`Wrote ${places.length} places to ${outputFile}`);

  const dataset = places.map((place, idx) => ({
    id: idx,
    title: place.name,
    region: place.admin2,
  }));

  const datasetPath = path.join(__dirname, '../autocomplete/dataset.json');
  fs.writeFileSync(datasetPath, JSON.stringify(dataset), 'utf-8');
  console.error(`Wrote ${dataset.length} dataset entries to ${datasetPath}`);

  const trie = new TrieSearch('title');
  trie.addAll(dataset);
  const triePath = path.join(__dirname, '../autocomplete/trie.json');
  fs.writeFileSync(triePath, JSON.stringify(trie.root), 'utf-8');
  console.error(`Wrote trie to ${triePath}`);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
