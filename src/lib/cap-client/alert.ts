import { DateTime } from 'luxon';
import { parseString } from 'xml2js';
import { Feature, Polygon, booleanPointInPolygon, polygon } from '@turf/turf';
import * as turf from '@turf/turf';
import { stripPrefix } from 'xml2js/lib/processors';


/**
 * The area part of a CAP message.
 */
export class CAPArea {
  public areaDesc: string
  public polygon?: Feature<Polygon>[]

  constructor(areaDesc: string) {
    this.areaDesc = areaDesc
  }

  public isValidFor(location: { latitude: number, longitude: number }): boolean {
    if (this.polygon !== undefined) {
      const point = turf.point([location.longitude, location.latitude])
      for (const polygon of this.polygon)
        if (booleanPointInPolygon(point, polygon))
          return true
    }
    return false
  }

  addPolygon(p: string) {
    if (this.polygon === undefined)
      this.polygon = []
    const points = p.
      split(/\s+/).
      filter(val => val != '').
      map((point): number[] =>
        point.split(',').
          map((val): number => global.parseFloat(val)).
          reverse() // We need to reverse lat/lon pairs, since turf (and most geo libraries) use longitude/latitude.
      )
    if (points[0] != points[points.length - 1])
      points.push(points[0])
    this.polygon.push(polygon([points]))
  }
}

export type UrgencyType = 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown'
function toUrgencyType(s: string): UrgencyType {
  const validTypes: UrgencyType[] = ['Immediate', 'Expected', 'Future', 'Past', 'Unknown']
  for (const t of validTypes)
    if (t as string == s)
      return t
  throw new Error(`invalid entry in document: <${s}>`)
}

export type SeverityType = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
function toSeverityType(s: string): SeverityType {
  const validTypes: SeverityType[] = ['Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown']
  for (const t of validTypes)
    if (t as string == s)
      return t
  throw new Error(`invalid entry in document: <${s}>`)
}

export type CertaintyType = 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown'
function toCertaintyType(s: string): CertaintyType {
  const validTypes: CertaintyType[] = ['Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown']
  for (const t of validTypes)
    if (t as string == s)
      return t
  throw new Error(`invalid entry in document: <${s}>`)
}


export class CAPInfo {
  public language?: string;
  public category: string;
  public event: string;
  public responseType?: string;
  public urgency: UrgencyType;
  public severity: SeverityType;
  public certainty: CertaintyType;
  public audience?: string;
  public eventCode?: { valueName: string; value: string }[];
  public effective?: DateTime;
  public onset?: DateTime;
  public expires?: DateTime;
  public senderName?: string;
  public headline?: string;
  public description?: string;
  public instruction?: string;
  public web?: string;
  public contact?: string;
  public parameter?: { valueName: string; value: string }[];
  public area?: CAPArea;

  constructor(category: string, event: string, urgency: string, severity: string, certainty: string) {
    this.category = category;
    this.event = event;
    this.urgency = toUrgencyType(urgency);
    this.severity = toSeverityType(severity);
    this.certainty = toCertaintyType(certainty);
  }

  // TODO: Verify values
  public warningColor(): 'Green' | 'Yellow' | 'Orange' | 'Red' {
    switch (this.certainty) {
      case 'Observed':
        switch (this.severity) {
          case 'Extreme':
            return 'Red'
          case 'Severe':
            return 'Red'
          case 'Moderate':
            return 'Orange'
          case 'Minor':
            return 'Yellow'
        }
      case 'Likely':
        switch (this.severity) {
          case 'Extreme':
            return 'Orange'
          case 'Severe':
            return 'Orange'
          case 'Moderate':
            return 'Yellow'
          case 'Minor':
            return 'Yellow'
        }
      case 'Possible':
        switch (this.severity) {
          case 'Extreme':
            return 'Yellow'
          case 'Severe':
            return 'Yellow'
        }
      // case 'Unlikely':
      // case 'Unknown':
    }
    return 'Green'
  }
}

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

export class CAPAlert {
  private xmlns: string;
  public identifier: string;
  public sender: string;
  public sent: string;
  public status: StatusType
  public msgType: MsgType
  public source?: string;
  public scope: ScopeType;
  public restriction?: string;
  public addresses?: string[];
  public code?: string[];
  public note?: string;
  public references?: Reference[];
  public incidents?: string[];
  public info?: CAPInfo[];

  constructor(identifier: string, sender: string, sent: string, status: string, msgType: string, scope: string) {
    this.xmlns = 'urn:oasis:names:tc:emergency:cap:1.2';
    this.identifier = identifier;
    this.sender = sender;
    this.sent = sent;
    this.status = toStatusType(status);
    this.msgType = toMsgType(msgType);
    this.scope = toScopeType(scope);
  }

  public setSource(source: string | undefined): void {
    if (source !== undefined)
      this.source = source[0];
  }

  public setRestriction(restriction: string | undefined): void {
    if (restriction !== undefined)
      this.restriction = restriction[0];
  }

  public setAddresses(addresses: string[] | undefined): void {
    this.addresses = addresses;
  }

  public setCode(code: string[] | undefined): void {
    if (code !== undefined)
      this.code = code;
  }

  public setNote(note: string | undefined): void {
    if (note !== undefined)
      this.note = note[0];
  }

  public setReferences(references: string[] | undefined): void {
    if (references === undefined)
      return;
    let refs: Reference[] = []
    for (const r of references) {
      for (const refString of r.split(/\s/)) {
        if (refString == '')
          continue
        const elements = refString.split(',')
        if (elements.length != 3) {
          console.log(`unable to parse reference element <${refString}>`)
          continue
        }
        refs.push({ sender: elements[0], identifier: elements[1], sent: elements[2] })
      }
    }

    this.references = refs;
  }

  public setIncidents(incidents: string[]): void {
    // TODO: Split by whitespace
    this.incidents = incidents;
  }

  public addInfo(info: CAPInfo): void {
    if (!this.info) {
      this.info = [];
    }
    this.info.push(info);
  }

  /**
   * Fetch a CAPAlert.
   */
  public static async fetch(url: string): Promise<CAPAlert> {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error('unable to download cap alert')
    return this.parseFromXML(await response.text())
  }

  static async parseFromXML(xmlString: string): Promise<CAPAlert> {
    return new Promise((resolve, reject) => {
      parseString(xmlString, { tagNameProcessors: [stripPrefix] }, (err: any, result: any) => {
        if (err) {
          reject(err);
          return
        }
        if (!result.alert) {
          reject('invalid cap message')
          return
        }
        const alertData = result.alert;
        const alert = new CAPAlert(
          alertData.identifier[0],
          alertData.sender[0],
          alertData.sent[0],
          alertData.status[0],
          alertData.msgType[0],
          alertData.scope[0]
        );

        alert.setSource(alertData.source);
        alert.setRestriction(alertData.restriction);
        alert.setAddresses(alertData.addresses);
        alert.setCode(alertData.code);
        alert.setNote(alertData.note);
        alert.setReferences(alertData.references);
        alert.setIncidents(alertData.incidents);

        // Parse info blocks
        if (alertData.info) {
          const infoArray = Array.isArray(alertData.info) ? alertData.info : [alertData.info];
          infoArray.forEach((infoData: any) => {
            const info = new CAPInfo(
              infoData.category[0],
              infoData.event[0],
              infoData.urgency[0],
              infoData.severity[0],
              infoData.certainty[0]
            );

            info.language = infoData.language ? infoData.language[0] : undefined
            info.responseType = infoData.responseType ? infoData.responseType[0] : undefined
            info.audience = infoData.audience ? infoData.audience[0] : undefined
            if (info.eventCode) {
              info.eventCode = infoData.eventCode.map((code: any) => ({
                valueName: code.valueName,
                value: code.value,
              }));
            }
            info.effective = infoData.effective ? DateTime.fromISO(infoData.effective[0]) : undefined;
            info.onset = infoData.onset ? DateTime.fromISO(infoData.onset[0]) : undefined;
            info.expires = infoData.expires ? DateTime.fromISO(infoData.expires[0]) : undefined;
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
              const area = infoData.area[0]
              info.area = new CAPArea(area.areaDesc[0])
              if (area.polygon)
                for (const polygon of area.polygon)
                  info.area.addPolygon(polygon)
            }

            alert.addInfo(info);
          });
        }
        resolve(alert);
      });
    });
  }
}