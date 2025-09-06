import { M4Kiosk } from './m4kInterface';

export const m4kMethods: Record<keyof M4Kiosk, string[]> = {
  global: [],

  pressKey: ['key'],
  tap: ['x', 'y'],
  swipe: ['x', 'y', 'xEnd', 'yEnd', 'ms'],
  move: ['x', 'y'],
  down: ['x', 'y'],
  up: ['x', 'y'],
  inputText: ['text'],

  loadJs: ['path'],
  eval: ['script'],
  js: ['script'],
  su: ['cmd'],
  sh: ['cmd'],

  // setStorage: ['json'],
  // getStorage: [],
  setConfig: [],
  getConfig: [],
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

  readAsset: ['path', 'encoding'],
  read: ['path', 'encoding'],
  write: ['path', 'content', 'encoding', 'append'],
  url: ['path'],
  reboot: [],
  restart: [],
  reload: [],
  exit: [],
  info: [],

  log: ['level', 'message', 'data', 'source', 'line'],

  installedPackages: [],
  packageInfo: ['name'],
  startIntent: ['options'],

  installApk: ['path'],

  openAutoStart: [],

  showMessage: ['message'],

  subscribe: ['listener'],
  signal: ['event'],

  setKioskOn: ['on'],
  setScreenOn: ['on'],
};
