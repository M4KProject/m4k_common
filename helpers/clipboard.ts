import { stringify, parse } from './json';

export const clipboardCopy = async (value: any): Promise<void> => {
  console.debug('clipboardCopy');
  localStorage.setItem('__copy', value);
  try {
    await navigator.clipboard.writeText(stringify(value) || '');
  }
  catch (error) {
    console.warn('clipboardCopy error', error);
  }
};

export const clipboardPaste = async () => {
  try {
    console.debug('clipboardPaste');
    const json = await navigator.clipboard.readText();
    if (typeof json === 'string') return parse(json) || json;
    return json;
  }
  catch (error) {
    console.warn('clipboardPaste error', error);
    return Promise.resolve(localStorage.getItem('__copy'));
  }
};