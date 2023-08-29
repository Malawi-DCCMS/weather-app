export interface CAPFeed {
  '?xml': string;
  rss: RSS;
}

export interface RSS {
  channel: Channel;
}

export interface Channel {
  link: string[];
  title: string;
  description: string;
  language: string;
  copyright: string;
  pubDate: string;
  lastBuildDate: string;
  docs: string;
  image: Image;
  item: Item[] | Item;
}

export interface Image {
  title: string;
  url: string;
  link: string;
}

export interface Item {
  title: string;
  link: string;
  description: string;
  category: Category;
  pubDate: string;
  guid: string;
  creator: string;
  date: string;
}

export enum Category {
  Met = 'Met',
}

export interface CAPAlert {
  alert: Alert;
}

export interface Alert {
  identifier: string;
  sender: string;
  sent: string;
  status: string;
  msgType: string;
  scope: string;
  info: Info;
  Signature: Signature;
}

export interface Signature {
  SignedInfo: SignedInfo;
  SignatureValue: string;
  KeyInfo: KeyInfo;
}

export interface KeyInfo {
  X509Data: X509Data;
}

export interface X509Data {
  X509Certificate: string;
}

export interface SignedInfo {
  CanonicalizationMethod: string;
  SignatureMethod: string;
  Reference: Reference;
}

export interface Reference {
  Transforms: Transforms;
  DigestMethod: string;
  DigestValue: string;
}

export interface Transforms {
  Transform: string;
}

export interface Info {
  language: string;
  category: string;
  event: string;
  responseType: string;
  urgency: string;
  severity: string;
  certainty: string;
  onset: string;
  expires: string;
  senderName: string;
  headline: string;
  description: string;
  instruction: string;
  web: string;
  contact: string;
  area: Area;
}

export interface Area {
  areaDesc: string;
  polygon: string;
}
