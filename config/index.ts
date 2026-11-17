export const PRIMARY_API_URL= 'https://api.metmalawi.gov.mw';
export const FALLBACK_API_URL= 'https://aa057bsnsvkzwdeb6.api.met.no/weatherapi/locationforecast/2.0';
export const PRIMARY_ALERTS_URL= 'https://www.metmalawi.gov.mw/api/cap/rss.xml';
export const FALLBACK_ALERTS_URL= 'https://severeweather.wmo.int/v2/cap-alerts/mw-met-en/rss.xml';
export const APP_USER_AGENT= 'DCCMS - Zanyengo v1';
// The CAP feed is inconsistent about how it identifies the issuing office:
// some messages use the sender's email, others use the organization's
// display name. Accept any of the known variants.
export const APP_ALERTS_SENDER_IDS = [
  'nationalmetcentre@gmail.com',
  'Department of Climate Change and Meteorological Services',
];
