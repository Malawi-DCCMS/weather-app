import { DateTime } from 'luxon';

import { CAPAlert, CAPInfo } from './alert';

type Translate = (key: string, options?: Record<string, unknown>) => string;

// Splits the raw CAP `instruction` text into a checklist of short imperative
// sentences. Returns [] (not a fabricated fallback) when there's nothing to
// show — this is safety guidance, so it must come from the CAP feed itself.
export function getWhatToDo(info: CAPInfo | undefined): string[] {
  const instruction = info?.instruction?.trim();
  if (!instruction) return [];

  return instruction
    .split(/\r?\n+|(?<=[.!?])\s+/)
    .map(s => s.trim().replace(/[.!?]+$/, ''))
    .filter(s => s.length > 3)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));
}

function timeOfDayKey(hour: number): string {
  if (hour < 6) return 'time.night';
  if (hour < 12) return 'time.morning';
  if (hour < 18) return 'time.afternoon';
  return 'time.evening';
}

function describeMoment(t: Translate, iso: string | undefined, now: DateTime): string | undefined {
  if (!iso) return undefined;
  const dt = DateTime.fromISO(iso);
  if (!dt.isValid) return undefined;
  if (dt <= now) return t('alert.when.now');

  const sameDay = dt.hasSame(now, 'day');
  const period = t(timeOfDayKey(dt.hour));
  return sameDay ? period : `${dt.toFormat('cccc')} ${period}`;
}

// "From now until Wednesday evening." — built from onset/effective/expires,
// falling back gracefully when only one end of the window is known.
export function getWhenText(t: Translate, info: CAPInfo | undefined, now: DateTime = DateTime.now()): string | undefined {
  if (!info) return undefined;
  const start = describeMoment(t, info.onset ?? info.effective, now);
  const end = describeMoment(t, info.expires, now);

  if (start && end) return t('alert.when.range', { start, end });
  if (start) return t('alert.when.fromOnly', { start });
  if (end) return t('alert.when.untilOnly', { end });
  return undefined;
}

export function getWhereText(info: CAPInfo | undefined): string | undefined {
  return info?.area?.areaDesc;
}

// "Ethiopian Meteorology and Hydrology Institute · ethiomet.gov.et" — built
// from the CAP feed's own data (senderName, sender address) rather than a
// hardcoded org name, since this app is deployed per-country against
// whichever feed EXPO_PUBLIC_APP_ALERTS_SENDER_ID points to (see
// docs/CONFIGURATION.md).
export function getShareSourceLine(alert: CAPAlert, info: CAPInfo | undefined): string | undefined {
  const name = info?.senderName?.trim() || undefined;
  const atIndex = alert.sender?.indexOf('@') ?? -1;
  const domain = atIndex > -1 ? alert.sender.slice(atIndex + 1).trim() : undefined;

  if (name && domain) return `${name} · ${domain}`;
  return name ?? domain;
}

// Finds the first alert (already filtered to relevant ones by the caller)
// whose effective window overlaps the given calendar day — used to show an
// inline warning chip under a day in the 5-day list.
export function getAlertForDay(alerts: CAPAlert[], day: DateTime): CAPAlert | undefined {
  const dayStart = day.startOf('day');
  const dayEnd = day.endOf('day');

  return alerts.find(alert => {
    const info = alert.info?.[0];
    if (!info) return false;

    const start = DateTime.fromISO(info.onset ?? info.effective ?? alert.sent);
    if (!start.isValid) return false;

    const end = info.expires ? DateTime.fromISO(info.expires) : start;
    const effectiveEnd = end.isValid ? end : start;

    return start <= dayEnd && effectiveEnd >= dayStart;
  });
}
