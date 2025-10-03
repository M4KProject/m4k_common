import { timeoutError } from './error';

export const withTimeout = <T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(timeoutError('promise')), timeoutMs);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(t));
  });
};