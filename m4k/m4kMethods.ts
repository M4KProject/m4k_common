import { M4Kiosk } from './m4kInterface';

export const m4kMethods: Record<keyof Omit<M4Kiosk, 'isInterface'>, string[]> = {
  global: [],

  getSetting: ['key'],
  setSetting: ['key', 'value'],
  clearSettings: [],

  pressKey: ['key'],
  tap: ['x', 'y'],
  swipe: ['x', 'y', 'xEnd', 'yEnd', 'ms'],
  move: ['x', 'y'],
  down: ['x', 'y'],
  up: ['x', 'y'],
  inputText: ['text'],

  loadJs: ['path'],
  evalJs: ['script'],
  su: ['cmd'],
  sh: ['cmd'],

  fileInfo: ['path'],
  absolutePath: ['path'],
  mkdir: ['path'],
  ls: ['path', 'recursive'],
  cp: ['path', 'dest'],
  mv: ['path', 'dest'],
  rm: ['path'],
  zip: ['path', 'dest', 'uncompressed'],
  unzip: ['path', 'dest'],

  download: ['url', 'dest'],

  pdfToImages: ['path', 'options'],
  resize: ['path', 'options'],
  capture: ['options'],

  read: ['path', 'encoding'],
  write: ['path', 'content', 'encoding', 'append'],
  url: ['path'],
  reboot: [],
  restart: [],
  reload: [],
  exit: [],
  info: [],

  installedPackages: [],
  packageInfo: ['name'],
  startIntent: ['options'],
  installApk: ['path'],

  subscribe: ['listener'],
  signal: ['event'],

  setKioskOn: ['on'],
  setScreenOn: ['on'],
};
