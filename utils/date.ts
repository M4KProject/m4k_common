import { floor, isDate, isNumber, isStringValid, padStart, toDate } from "fluxio";

export const formatSeconds = (seconds: number): string => {
  const t = Math.abs(seconds);
  const h = floor(t / 3600);
  const m = floor((t % 3600) / 60);
  const s = floor(t % 60);
  const r = `${padStart(h, 2)}:${padStart(m, 2)}:${padStart(s, 2)}`;
  console.debug('formatSeconds', seconds, r);
  return seconds < 0 ? `-${r}` : r;
};

export const parseSeconds = (value: string | number): number | null => {
  if (isStringValid(value)) {
    let [h, m, s] = value
      .replace(/[^\d]+/g, ' ')
      .split(' ')
      .map(Number);
    if (h !== undefined) {
      if (!m && h > 99) {
        m = h % 100;
        h = (h - m) / 100;
      }
      const result = h * 3600 + (m || 0) * 60 + (s || 0);
      console.debug('parseSeconds', value, h, m, s, result);
      return result;
    }
  }
  console.debug('parseSeconds', value);
  return isFloat(value) ? value : 0;
};

/** Format time: hours > 0: "5h30", minutes > 0: "05:30 min", seconds only: "5 sec" */
export const formatMs = (ms: number): string => {
  if (ms === 0) return '00.000';

  const totalSeconds = floor(Math.abs(ms) / 1000);
  const hours = floor(totalSeconds / 3600);
  const minutes = floor((totalSeconds % 3600) / 60);
  const seconds = floor(totalSeconds % 60);

  const sign = ms < 0 ? '-' : '';

  if (hours > 0) {
    return `${sign}${hours}h${padStart(minutes, 2)}`;
  }

  if (minutes > 0) {
    return `${sign}${padStart(minutes, 2)}:${padStart(seconds, 2)} min`;
  }

  return `${sign}${seconds} sec`;
};

/** Format date as DD/MM/YYYY */
export const formatDate = (date?: any): string => {
  const d = toDate(date);
  if (!isDate(d)) return '';
  const day = padStart(d.getDate(), 2);
  const month = padStart(d.getMonth() + 1, 2);
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Format time as HH:MM:SS */
export const formatTime = (date?: any): string => {
  const d = toDate(date);
  if (!isDate(d)) return '';
  const hours = padStart(d.getHours(), 2);
  const minutes = padStart(d.getMinutes(), 2);
  const secondes = padStart(d.getSeconds(), 2);
  return secondes === '00' ? `${hours}:${minutes}` : `${hours}:${minutes}:${secondes}`;
};

/** Format date and time as DD/MM/YYYY HH:MM:SS */
export const formatDateTime = (date: any): string => {
  const d = toDate(date);
  if (!isDate(d)) return '';
  return `${formatDate(d)} ${formatTime(d)}`;
};

/** Parse flexible date/time string: DD/MM, DD/MM/YY, DD/MM/YYYY HH:MM:SS, HH:MM, etc. */
export const parseDate = (str: string): Date | null => {
  const now = new Date();

  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  let h = 0,
    m = 0,
    s = 0;

  const timeMatch = str.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (timeMatch) {
    h = parseInt(timeMatch[1]!, 10);
    m = parseInt(timeMatch[2]!, 10);
    s = parseInt(timeMatch[3] || '0', 10);
  }

  const dateMatch = str.match(/(\d{2})\/(\d{2})(?:\/(\d{2,4}))?/);
  if (dateMatch) {
    day = parseInt(dateMatch[1]!, 10);
    month = parseInt(dateMatch[2]!, 10);
    const y = dateMatch[3];
    if (y) {
      year = parseInt(y, 10);
      if (y.length === 2) {
        year += year > 40 ? 1900 : 2000;
      }
    }
  }

  const result = new Date(year, month - 1, day, h, m, s);

  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) {
    return null;
  }

  return result;
};

/** Convert date to seconds since midnight */
export const dateToSeconds = (date?: any): number => {
  const d = toDate(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return hours * 3600 + minutes * 60 + seconds;
};

/** Convert seconds since midnight to HH:MM:SS format */
export const secondsToTimeString = (seconds: number): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setSeconds(seconds);
  return formatTime(today);
};

/** Check if date is expired (date + delay < now) */
export const isExpired = (date: any, delayMs: number = 0): boolean => {
  const d = toDate(date);
  if (!d) return true;
  return d.getTime() + delayMs < Date.now();
};
