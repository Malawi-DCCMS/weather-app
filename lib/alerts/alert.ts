import { DateTime } from 'luxon';
import { parseString } from 'xml2js';
import { Feature, Polygon, booleanPointInPolygon, polygon } from '@turf/turf';
import * as turf from '@turf/turf';
import { stripPrefix } from 'xml2js/lib/processors';


/**
 * The area part of a CAP message.
 */
export interface CAPArea {
  areaDesc: string;
  polygon?: Feature<Polygon>[];
}

export const createCAPArea = (areaDesc: string): CAPArea => ({
  areaDesc,
});

export const isValidFor = (area: CAPArea, location: { latitude: number; longitude: number }): boolean => {
  if (area.polygon !== undefined) {
    const point = turf.point([location.longitude, location.latitude]);
    for (const polygon of area.polygon) {
      if (booleanPointInPolygon(point, polygon)) {
        return true;
      }
    }
  }
  return false;
};

export const addPolygon = (area: CAPArea, p: string): CAPArea => {
  if (area.polygon === undefined) {
    area.polygon = [];
  }
  const points = p
    .split(/\s+/)
    .filter((val) => val != '')
    .map((point): number[] =>
      point
        .split(',')
        .map((val): number => global.parseFloat(val))
        .reverse() // We need to reverse lat/lon pairs, since turf (and most geo libraries) use longitude/latitude.
    );
  if (points[0] != points[points.length - 1]) {
    points.push(points[0]);
  }
  area.polygon.push(polygon([points]));
  return area;
};

export type UrgencyType = 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
function toUrgencyType(s: string): UrgencyType {
  const validTypes: UrgencyType[] = ['Immediate', 'Expected', 'Future', 'Past', 'Unknown'];
  for (const t of validTypes) {
    if (t as string == s) {
      return t;
    }
  }
  throw new Error(`invalid entry in document: <${s}>`);
}

export type SeverityType = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
function toSeverityType(s: string): SeverityType {
  const validTypes: SeverityType[] = ['Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown'];
  for (const t of validTypes) {
    if (t as string == s) {
      return t;
    }
  }
  throw new Error(`invalid entry in document: <${s}>`);
}

export type CertaintyType = 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';
function toCertaintyType(s: string): CertaintyType {
  const validTypes: CertaintyType[] = ['Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown'];
  for (const t of validTypes) {
    if (t as string == s) {
      return t;
    }
  }
  throw new Error(`invalid entry in document: <${s}>`);
}

export interface CAPInfo {
  language?: string;
  category: string;
  event: string;
  responseType?: string;
  urgency: UrgencyType;
  severity: SeverityType;
  certainty: CertaintyType;
  audience?: string;
  eventCode?: { valueName: string; value: string }[];
  effective?: string;
  onset?: string;
  expires?: string;
  senderName?: string;
  headline?: string;
  description?: string;
  instruction?: string;
  web?: string;
  contact?: string;
  parameter?: { valueName: string; value: string }[];
  area?: CAPArea;
}

export const createCAPInfo = (
  category: string,
  event: string,
  urgency: string,
  severity: string,
  certainty: string
): CAPInfo => ({
  category,
  event,
  urgency: toUrgencyType(urgency),
  severity: toSeverityType(severity),
  certainty: toCertaintyType(certainty),
});

export const alertLevel = (info: CAPInfo): 'Red' | 'Orange' | 'Yellow' | 'Cyan' | 'Blue' => {
  switch (info.certainty) {
    case 'Observed':
    case 'Likely':
    case 'Possible':
    case 'Unlikely':
    case 'Unknown':
      switch (info.severity) {
        case 'Extreme':
          return 'Red';
        case 'Severe':
          return 'Orange';
        case 'Moderate':
          return 'Yellow';
        case 'Minor':
          return 'Cyan';
        case 'Unknown':
          return 'Blue';
        default:
          return 'Blue';
      }
    default:
      return 'Blue';
  }
};

export type StatusType = 'Actual' | 'Exercise' | 'System' | 'Test' | 'Draft'
function toStatusType(s: string): StatusType {
  const validTypes: StatusType[] = ['Actual', 'Exercise', 'System', 'Test', 'Draft']
  for (const t of validTypes)
    if (t as string == s)
      return t
  throw new Error(`invalid entry in document: <${s}>`)
}

export type MsgType = 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error'
function toMsgType(s: string): MsgType {
  const validTypes: MsgType[] = ['Alert', 'Update', 'Cancel', 'Ack', 'Error']
  for (const msgType of validTypes)
    if (msgType as string == s)
      return msgType
  throw new Error(`invalid entry in document: <${s}>`)
}

export type ScopeType = 'Public' | 'Restricted' | 'Private'
function toScopeType(s: string): ScopeType {
  const validTypes: ScopeType[] = ['Public', 'Restricted', 'Private']
  for (const msgType of validTypes)
    if (msgType as string == s)
      return msgType
  throw new Error(`invalid entry in document: <${s}>`)
}

/**
 * The references part of a cap message
 */
export interface Reference {
  sender: string
  identifier: string
  sent: string
}

export interface CAPAlert {
  xmlns: string;
  identifier: string;
  sender: string;
  sent: string;
  status: StatusType;
  msgType: MsgType;
  source?: string;
  scope: ScopeType;
  restriction?: string;
  addresses?: string[];
  code?: string[];
  note?: string;
  references?: Reference[];
  incidents?: string[];
  info?: CAPInfo[];
}

export const createCAPAlert = (
  identifier: string,
  sender: string,
  sent: string,
  status: string,
  msgType: string,
  scope: string
): CAPAlert => ({
  xmlns: 'urn:oasis:names:tc:emergency:cap:1.2',
  identifier,
  sender,
  sent,
  status: toStatusType(status),
  msgType: toMsgType(msgType),
  scope: toScopeType(scope),
});

export const setSource = (alert: CAPAlert, source: string | undefined): CAPAlert => ({
  ...alert,
  source: source ? source[0] : undefined,
});

export const setRestriction = (alert: CAPAlert, restriction: string | undefined): CAPAlert => ({
  ...alert,
  restriction: restriction ? restriction[0] : undefined,
});

export const setAddresses = (alert: CAPAlert, addresses: string[] | undefined): CAPAlert => ({
  ...alert,
  addresses,
});

export const setCode = (alert: CAPAlert, code: string[] | undefined): CAPAlert => ({
  ...alert,
  code,
});

export const setNote = (alert: CAPAlert, note: string | undefined): CAPAlert => ({
  ...alert,
  note: note ? note[0] : undefined,
});

/**
 * Update a CAPAlert with a list of references to previous CAPAlert messages linked to this one. 
 * Each reference string must be on the format: "sender,identifier,sent".
 */
export const setReferences = (alert: CAPAlert, references: string[] | undefined): CAPAlert => {
  if (!references) return alert;
  const refs: Reference[] = references.flatMap((r) =>
    r.split(/\s/).map((refString) => {
      const elements = refString.split(',');
      if (elements.length !== 3) {
        console.log(`unable to parse reference element <${refString}>`);
        return null;
      }
      return { sender: elements[0], identifier: elements[1], sent: elements[2] };
    }).filter(v => v != null).filter(Boolean)
  );
  return { ...alert, references: refs };
};

export const setIncidents = (alert: CAPAlert, incidents: string[]): CAPAlert => ({
  ...alert,
  incidents,
});

export const addInfo = (alert: CAPAlert, info: CAPInfo): CAPAlert => ({
  ...alert,
  info: alert.info ? [...alert.info, info] : [info],
});

export const fetchCAPAlert = async (url: string): Promise<CAPAlert> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('unable to download cap alert');
  return parseFromXML(await response.text());
};

export const parseFromXML = async (xmlString: string): Promise<CAPAlert> => {
  return new Promise((resolve, reject) => {
    parseString(xmlString, { tagNameProcessors: [stripPrefix] }, (err: any, result: any) => {
      if (err) {
        reject(err);
        return;
      }
      if (!result.alert) {
        reject('invalid cap message');
        return;
      }
      const alertData = result.alert;
      let alert = createCAPAlert(
        alertData.identifier[0],
        alertData.sender[0],
        alertData.sent[0],
        alertData.status[0],
        alertData.msgType[0],
        alertData.scope[0]
      );

      alert = setSource(alert, alertData.source);
      alert = setRestriction(alert, alertData.restriction);
      alert = setAddresses(alert, alertData.addresses);
      alert = setCode(alert, alertData.code);
      alert = setNote(alert, alertData.note);
      alert = setReferences(alert, alertData.references);
      alert = setIncidents(alert, alertData.incidents);

      if (alertData.info) {
        const infoArray = Array.isArray(alertData.info) ? alertData.info : [alertData.info];
        infoArray.forEach((infoData: any) => {
          const info: CAPInfo = createCAPInfo(
            infoData.category[0],
            infoData.event[0],
            infoData.urgency[0],
            infoData.severity[0],
            infoData.certainty[0]
          );

          info.language = infoData.language ? infoData.language[0] : undefined;
          info.responseType = infoData.responseType ? infoData.responseType[0] : undefined;
          info.audience = infoData.audience ? infoData.audience[0] : undefined;
          if (info.eventCode) {
            info.eventCode = infoData.eventCode.map((code: any) => ({
              valueName: code.valueName,
              value: code.value,
            }));
          }
          info.effective = infoData.effective && DateTime.fromISO(infoData.effective[0]).isValid ? infoData.effective[0] : undefined;
          info.onset = infoData.onset && DateTime.fromISO(infoData.onset[0]).isValid ? infoData.onset[0] : undefined;
          info.expires = infoData.expires && DateTime.fromISO(infoData.expires[0]).isValid ? infoData.expires[0] : undefined;

          info.senderName = infoData.senderName ? infoData.senderName[0] : undefined;
          info.headline = infoData.headline ? infoData.headline[0] : undefined;
          info.description = infoData.description ? infoData.description[0] : undefined;
          info.instruction = infoData.instruction ? infoData.instruction[0] : undefined;
          info.web = infoData.web ? infoData.web[0].trim() : undefined;
          info.contact = infoData.contact ? infoData.contact[0] : undefined;
          info.parameter = infoData.parameter?.map((code: any) => ({
            valueName: code.valueName,
            value: code.value[0],
          }));

          if (infoData.area) {
            const area = infoData.area[0];
            info.area = createCAPArea(area.areaDesc[0]);
            if (area.polygon) {
              for (const polygon of area.polygon) {
                addPolygon(info.area, polygon);
              }
            }
          }

          alert = addInfo(alert, info);
        });
      }
      resolve(alert);
    });
  });
};


/**
 * Determines if a given alert is relevant for a specific location.
 *
 * @param alert - The CAPAlert object containing alert information.
 * @param location - An object containing the latitude and longitude of the location to check.
 * @returns A boolean indicating whether the alert is relevant for the specified location.
 */
export function alertInLocation(alert: CAPAlert, location: { latitude: number, longitude: number }): boolean {
  if (!alert.info)
      return false

  const info = alert.info[0]
  if (!info.area || !isValidFor(info.area, location))
      return false
  
  return true
}
