import { toDate } from './cast';
import { floor } from './nbr';
import { pad } from './str';

/** Format time: hours > 0: "5h30", minutes > 0: "05:30 min", seconds only: "5 sec" */
export const formatMs = (ms: number): string => {
  if (ms === 0) return '00.000';

  const totalSeconds = floor(Math.abs(ms) / 1000);
  const hours = floor(totalSeconds / 3600);
  const minutes = floor((totalSeconds % 3600) / 60);
  const seconds = floor(totalSeconds % 60);

  const sign = ms < 0 ? '-' : '';

  if (hours > 0) {
    return `${sign}${hours}h${pad(minutes, 2)}`;
  }

  if (minutes > 0) {
    return `${sign}${pad(minutes, 2)}:${pad(seconds, 2)} min`;
  }

  return `${sign}${seconds} sec`;
};

/** Format date as DD/MM/YYYY */
export const formatDate = (date?: any): string => {
  const d = toDate(date) || new Date();
  const day = pad(d.getDate(), 2);
  const month = pad(d.getMonth() + 1, 2);
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Format time as HH:MM:SS */
export const formatTime = (date?: any): string => {
  const d = toDate(date) || new Date();
  const hours = pad(d.getHours(), 2);
  const minutes = pad(d.getMinutes(), 2);
  const secondes = pad(d.getSeconds(), 2);
  return secondes === '00' ? `${hours}:${minutes}` : `${hours}:${minutes}:${secondes}`;
};

/** Format date and time as DD/MM/YYYY HH:MM:SS */
export const formatDateTime = (date: any): string => `${formatDate(date)} ${formatTime(date)}`;

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
    h = parseInt(timeMatch[1], 10);
    m = parseInt(timeMatch[2], 10);
    s = parseInt(timeMatch[3] || '0', 10);
  }

  const dateMatch = str.match(/(\d{2})\/(\d{2})(?:\/(\d{2,4}))?/);
  if (dateMatch) {
    day = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10);
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

/** Parse time string or number to seconds since midnight */
export const parseToSeconds = (value: string | number): number | null => {
  if (typeof value === 'number') {
    return value >= 0 && value <= 86400 ? value : null;
  }

  if (typeof value === 'string') {
    const parsedDate = parseDate(value);
    if (parsedDate) {
      return dateToSeconds(parsedDate);
    }

    const timeMatch = value.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!timeMatch) return null;

    const h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const s = parseInt(timeMatch[3] || '0', 10);

    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
      return null;
    }

    return h * 3600 + m * 60 + s;
  }

  return null;
};

/** Check if date is expired (date + delay < now) */
export const isExpired = (date: any, delayMs: number = 0): boolean => {
  const d = toDate(date);
  if (!d) return true;
  return d.getTime() + delayMs < Date.now();
};

