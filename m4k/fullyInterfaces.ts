export interface FileInfo {
  type: "folder" | "file";
  name: string;
  size: number;
  lastModified: number;
  canRead: boolean;
  canWrite: boolean;
  isHidden: boolean;
  path: string;
}

export interface Fully {
  ////// Get device info
  getCurrentLocale(): string;
  getIp4Address(): string;
  getIp6Address(): string;
  getHostname(): string;
  getHostname6(): string;
  getMacAddress(): string;
  getMacAddressForInterface(interfaceName: string): string;
  getWifiSsid(): string;
  getWifiBssid(): string; // ver. 1.44+
  getWifiSignalLevel(): string; // ver. 1.30+
  getSerialNumber(): string;
  getAndroidId(): string;
  getDeviceId(): string;
  getDeviceName(): string;
  getImei(): string;
  getSimSerialNumber(): string;
  getBatteryLevel(): number;
  getScreenBrightness(): number;
  getScreenOrientation(): number; // ver. 1.40.2+
  getDisplayWidth(): number;
  getDisplayHeight(): number;
  getScreenOn(): boolean;
  isPlugged(): boolean;
  isKeyboardVisible(): boolean;
  isWifiEnabled(): boolean;
  isWifiConnected(): boolean; // ver. 1.44+
  isNetworkConnected(): boolean; // ver. 1.44+
  isBluetoothEnabled(): boolean;
  isScreenRotationLocked(): boolean; // ver. 1.40.2+
  getFullyVersion(): string;
  getFullyVersionCode(): number;
  getWebviewVersion(): string;
  getAndroidVersion(): string;
  getAndroidSdk(): number;
  getDeviceModel(): string;

  // Get storage info (ver. 1.33+)
  getInternalStorageTotalSpace(): number;
  getInternalStorageFreeSpace(): number;
  getExternalStorageTotalSpace(): number;
  getExternalStorageFreeSpace(): number;

  // Get environment sensor info (ver. 1.40+)
  getSensorInfo(): string;
  getSensorValue(type: number): number;
  getSensorValues(type: number): string;

  // Get data usage (ver. 1.44+, Android 6+)
  getAllRxBytesMobile(): number;
  getAllTxBytesMobile(): number;
  getAllRxBytesWifi(): number;
  getAllTxBytesWifi(): number;

  ////// Control device, show notification, send network data etc.
  turnScreenOn(): void;
  turnScreenOff(keepAlive?: boolean): void;
  forceSleep(): void;
  showToast(text: string): void;
  setScreenBrightness(level: number): void;
  enableWifi(): void; // In Android 10+ only with provisioned devices
  disableWifi(): void; // In Android 10+ only with provisioned devices
  enableBluetooth(): void;
  disableBluetooth(): void;
  showKeyboard(): void;
  hideKeyboard(): void;
  openWifiSettings(): void;
  openBluetoothSettings(): void;
  vibrate(millis: number): void;
  sendHexDataToTcpPort(hexData: string, host: string, port: number): void;
  showNotification(
    title: string,
    text: string,
    url: string,
    highPriority: boolean
  ): void; // ver. 1.33+
  log(type: number, tag: string, message: string): void; // ver. 1.41+

  // Access clipboard (ver. 1.40+)
  // No access with Android 10+ if Fully is in background
  copyTextToClipboard(text: string): void;
  getClipboardText(): string;
  getClipboardHtmlText(): string;

  ////// Download and manage files
  // Note that write access to external SD card is not supported
  deleteFile(path: string): void;
  readFile(path: string): string;
  writeFile(path: string, content: string): void;
  deleteFolder(path: string): void; // recursive!
  emptyFolder(path: string): void; // recursive, ver. 1.30+
  createFolder(path: string): void; // ver. 1.42+
  getFileList(folder: string): string; // get JSON array, ver. 1.31+
  downloadFile(url: string, dirName: string): void;
  unzipFile(fileName: string): void; // ver. 1.40.2+
  downloadAndUnzipFile(url: string, dirName: string): void;

  runCommand(command: string): void;

  // ver. 1.36+ respond to download/unzip events
  bind(name: "onDownloadSuccess", cb: string): void; // "$url","$dir","$code","$fileLength","$lastModified","$mimetype"
  bind(name: "onDownloadFailure", cb: string): void; // "$url","$dir","$code"
  bind(name: "onUnzipSuccess", cb: string): void; // "$url","$dir"
  bind(name: "onUnzipFailure", cb: string): void; // "$url","$dir","$message"

  ////// Use TTS, multimedia and PDF
  textToSpeech(text: string): void;
  textToSpeech(text: string, locale: string): void;
  textToSpeech(text: string, locale: string, engine: string): void;
  textToSpeech(
    text: string,
    locale: string,
    engine: string,
    queue: boolean
  ): void; // ver. 1.38+
  stopTextToSpeech(): void; // ver. 1.38+

  playVideo(
    url: string,
    loop: boolean,
    showControls: boolean,
    exitOnTouch: boolean,
    exitOnCompletion: boolean
  ): void;
  stopVideo(): void; // ver. 1.42+

  // stream :
  //   VoiceCall = 0,
  //   System = 1,
  //   Ring = 2,
  //   Music = 3,
  //   Alarm = 4,
  //   Notification = 5,
  //   Bluetooth = 6,
  //   DTMF = 8,
  //   TTS = 9,
  //   Accessibility = 10,
  setAudioVolume(level: number, stream: number): void;
  playSound(url: string, loop: boolean): void;
  playSound(url: string, loop: boolean, stream: number): void;
  stopSound(): void;
  showPdf(url: string): void;
  getAudioVolume(stream: number): number;
  isWiredHeadsetOn(): boolean; // ver. 1.43+
  isMusicActive(): boolean; // ver. 1.43+

  ////// Control Fully and Browsing
  loadStartUrl(): void;
  setActionBarTitle(text: string): void;
  startScreensaver(): void;
  stopScreensaver(): void;
  startDaydream(): void;
  stopDaydream(): void;
  addToHomeScreen(): void;
  print(): void; // window.print() doesn't work
  exit(): void;
  restartApp(): void;
  getScreenshotPngBase64(): string;
  loadStatsCSV(): string;
  clearCache(): void;
  clearFormData(): void;
  clearHistory(): void;
  clearCookies(): void;
  clearCookiesForUrl(url: string): void; // ver. 1.43.5+
  clearWebstorage(): void;
  focusNextTab(): void;
  focusPrevTab(): void;
  focusTabByIndex(index: number): void;
  getCurrentTabIndex(): number;
  shareUrl(): void;
  // 1.35+
  closeTabByIndex(index: number): void;
  closeThisTab(): void;
  getTabList(): string; // returns a JSON array
  loadUrlInTabByIndex(index: number, url: string): void;
  loadUrlInNewTab(url: string, focus: boolean): void;
  getThisTabIndex(): number;
  getCurrentTabIndex(): number;
  focusThisTab(): void;
  focusTabByIndex(index: number): void;

  ////// Barcode Scanner
  // Use $code placeholder in the resultUrl, see example below
  scanQrCode(prompt: string, resultUrl: string): void;

  // Ver. 1.31+, enhanced interface
  // Use -1 for cameraId and timeout (in seconds) for defaults
  scanQrCode(
    prompt: string,
    resultUrl: string,
    cameraId: number,
    timeout: number,
    beepEnabled: boolean,
    showCancelButton: boolean
  ): void;

  // Ver. 1.43.4+, activate flashlight if needed
  scanQrCode(
    prompt: string,
    resultUrl: string,
    cameraId: number,
    timeout: number,
    beepEnabled: boolean,
    showCancelButton: boolean,
    useFlashlight: boolean
  ): void;

  // Ver. 1.31+, respond to QR events
  bind(name: "onQrScanSuccess", cb: string): void; // $code
  bind(name: "onQrScanCancelled", cb: string): void;

  ////// Bluetooth Interface
  // Open BT connection
  // These functions are async, use events below to get results
  btOpenByMac(mac: string): boolean;
  btOpenByUuid(uuid: string): boolean;
  btOpenByName(name: string): boolean;

  // Get info and close connection
  btIsConnected(): boolean;
  btGetDeviceInfoJson(): string;
  btGetDeviceListJson(): string;
  btClose(): void;

  // Send data
  btSendStringData(stringData: string): boolean;
  btSendHexData(hexData: string): boolean;
  btSendByteData(data: number[]): boolean;

  // Respond to events
  bind(name: "onBtConnectSuccess", cb: string): void; // $device
  bind(name: "onBtConnectFailure", cb: string): void;
  bind(name: "onBtDataRead", cb: string): void; // $data

  ////// Read NFC Tags (ver. 1.45+)
  nfcScanStart(): boolean;
  nfcScanStart(flags: number, debounceMs: number): boolean;
  nfcScanStop(): boolean;
  bind(name: "onNdefDiscovered", cb: string): void; // $serial, $message, $data
  bind(name: "onNfcTagDiscovered", cb: string): void; // $serial, $type, $message, $data
  bind(name: "onNfcTagRemoved", cb: string): void; // $serial // Android 7+

  ////// Respond to Events
  // The second parameter is a containing: string JavaScript code to perform
  bind(name: "screenOn", cb: string): void;
  bind(name: "screenOff", cb: string): void;
  bind(name: "showKeyboard", cb: string): void;
  bind(name: "hideKeyboard", cb: string): void;
  bind(name: "networkDisconnect", cb: string): void;
  bind(name: "networkReconnect", cb: string): void;
  bind(name: "internetDisconnect", cb: string): void;
  bind(name: "internetReconnect", cb: string): void;
  bind(name: "unplugged", cb: string): void;
  bind(name: "pluggedAC", cb: string): void;
  bind(name: "pluggedUSB", cb: string): void;
  bind(name: "pluggedWireless", cb: string): void;
  bind(name: "onScreensaverStart", cb: string): void;
  bind(name: "onScreensaverStop", cb: string): void;
  bind(name: "onDaydreamStart", cb: string): void; // ver. 1.39+
  bind(name: "onDaydreamStop", cb: string): void; // ver. 1.39+
  bind(name: "onBatteryLevelChanged", cb: string): void;
  bind(name: "volumeUp", cb: string): void;
  bind(name: "volumeDown", cb: string): void;
  bind(name: "onMotion", cb: string): void; // Max. one per second
  bind(name: "facesDetected", cb: string): void; // $number // 1.48+
  bind(name: "onDarkness", cb: string): void; // Requires screen off on darkness
  bind(name: "onMovement", cb: string): void;
  bind(name: "onIBeacon", cb: string): void; // $id1, $id2, $id3, $distance
  bind(name: "broadcastReceived", cb: string): void; // $action, $extras // 1.40.2+
  bind(name: "onQrScanSuccess", cb: string): void; // $code, $extras

  ////// Manage Apps, Activities, Intents etc.
  startApplication(packageName: string): void;
  startApplication(packageName: string, action: string, url: string): void; // Can put null to omit the parameter in ver. 1.33+
  startIntent(url: string): void;
  broadcastIntent(url: string): void; // ver. 1.31+
  isInForeground(): boolean;
  bringToForeground(): void;
  bringToForeground(millis: number): void; // Delay in ms
  bringToBackground(): void; // ver. 1.31+
  installApkFile(url: string): void; // ver. 1.36+
  enableMaintenanceMode(): void; // ver. 1.39+
  disableMaintenanceMode(): void; // ver. 1.39+
  setMessageOverlay(text: string): void; // ver. 1.39+
  registerBroadcastReceiver(action: string): void; // ver. 1.40.2+
  unregisterBroadcastReceiver(action: string): void; // ver. 1.40.2+

  ////// Motion Detection
  startMotionDetection(): void;
  stopMotionDetection(): void;
  isMotionDetectionRunning(): boolean;
  getCamshotJpgBase64(): string;
  getFaceNumber(): number; // 1.48+
  triggerMotion(): void;
  bind(name: "onMotion", cb: string): void; // Triggered max. once per second

  ////// Manage all Fully settings
  getStartUrl(): string;
  setStartUrl(url: string): void;

  // Look in Remote Admin settings for the settings keys
  getBooleanSetting(key: FullyBooleanSettings): "true" | "false";
  getStringSetting(key: FullyStringSettings|FullyNumberStringSettings): string;
  // getStringSetting(key: FullyNumberSettings): number;

  // Changes apply immediately
  setBooleanSetting(key: FullyBooleanSettings, value: boolean): void;
  setStringSetting(key: FullyStringSettings|FullyNumberStringSettings, value: string): void;
  // setStringSetting(key: FullyNumberSettings, value: number): void;
  importSettingsFile(url: string): void; // ver. 1.36+

  ////// Private
  btOpenByMacAndUuid: () => void;
  btOpenByNameAndUuid: () => void;
  canResolveIntent: () => void;
  crashMe: () => void;
  getBatteryTemperature: () => void;
  getSerialNumberDeviceOwner: () => void;
  getWebviewProvider: () => void;
  getWebviewUa: () => void;
  initTts: () => void;
  isInDaydream: () => void;
  isInScreensaver: () => void;
  isMobileDataEnabled: () => void;
  isWssConnected: () => void;
  killBackgroundProcesses: () => void;
  lockKiosk: () => void;
  playerNext: () => void;
  playerPause: () => void;
  playerResume: () => void;
  playerStart: () => void;
  playerStop: () => void;
  reboot: () => void;
  rebootRecovery: () => void;
  requestFocus: () => void;
  restoreScreenBrightness: () => void;
  resume: () => void;
  sendWssMessage: () => void;
  setOverlayMessage: (message: string) => void;
  shutdown: () => void;
  triggerPendingEvents: () => void;
  unlockKiosk: () => void;
  getBooleanRawSetting: () => void;
  getStringRawSetting: () => void;
  getSettingsGlobalInt: () => void;
  getSettingsGlobalLong: () => void;
  getSettingsGlobalString: () => void;
  getRawSettingKeys: () => void;
  setStringRawSetting: () => void;
  setBooleanRawSetting: () => void;
  removeRawSetting: () => void;
  putSettingsGlobalInt: () => void;
  putSettingsGlobalLong: () => void;
  putSettingsGlobalString: () => void;
}

export type FullyBooleanSettings =
  | "mdmDisableVolumeButtons" // false,
  | "playMedia" // false,
  | "deleteHistoryOnReload" // false,
  | "mdmDisableADB" // true,
  | "movementWhenUnplugged" // false,
  | "showActionBar" // false,
  | "mdmDisableScreenCapture" // false,
  | "restartOnCrash" // true,
  | "deleteWebstorageOnReload" // false,
  | "forceDeviceAdmin" // false,
  | "kioskMode" // false,
  | "showStatusBar" // false,
  | "knoxDisableAndroidBeam" // false,
  | "removeNavigationBar" // false,
  | "softKeyboard" // true,
  | "knoxDisableSettingsChanges" // false,
  | "kioskHomeStartURL" // false,
  | "knoxDisableSDCardWrite" // false,
  | "launchOnBoot" // false,
  | "movementStopsSleepOnPowerDisconnect" // false,
  | "knoxDisableUsbHostStorage" // false,
  | "inUseWhileAudioPlaying" // false,
  | "resendFormData" // false,
  | "clearCacheEach" // false,
  | "sleepOnPowerConnect" // false,
  | "knoxDisableWiFi" // false,
  | "knoxDisableAirViewMode" // false,
  | "pauseMotionInBackground" // false,
  | "rootEnable" // false,
  | "resetZoomEach" // false,
  | "showHomeButton" // true,
  | "waitInternetOnReload" // true,
  | "knoxDisableWifiTethering" // false,
  | "knoxDisableBluetooth" // false,
  | "inUseWhileAnotherAppInForeground" // false,
  | "knoxDisableGoogleCrashReport" // false,
  | "geoLocationAccess" // false,
  | "knoxDisableVideoRecord" // false,
  | "enableUrlOtherApps" // false,
  | "showNavigationBar" // false,
  | "loadCurrentPageOnReload" // false,
  | "killOtherApps" // false,
  | "loadOverview" // false,
  | "remoteAdminScreenshot" // true,
  | "screenOnOnMotion" // true,
  | "useWideViewport" // true,
  | "enableTapSound" // false,
  | "movementDetection" // false,
  | "formAutoComplete" // true,
  | "webHostFilter" // false,
  | "screenOffOnPowerConnect" // false,
  | "advancedKioskProtection" // true,
  | "mdmLockTaskGlobalActions" // true,
  | "swipeTabs" // false,
  | "webcamAccess" // false,
  | "enableQrScan" // false,
  | "knoxDisableClipboard" // false,
  | "cloudService" // false,
  | "motionDetection" // false,
  | "resumeVideoAudio" // true,
  | "inUseWhileKeyboardVisible" // false,
  | "remoteAdminCamshot" // true,
  | "reloadOnScreensaverStop" // false,
  | "forceSleepIfUnplugged" // false,
  | "actionBarInSettings" // false,
  | "enablePopups" // false,
  | "screensaverOtherApp" // false,
  | "recreateTabsOnReload" // false,
  | "mdmDisableKeyguard" // false,
  | "forceScreenOrientationGlobal" // false,
  | "knoxHideStatusBar" // false,
  | "knoxDisableDeveloperMode" // false,
  | "showAddressBar" // false,
  | "remoteAdminLan" // true,
  | "knoxDisableTaskManager" // false,
  | "knoxEnabled" // false,
  | "knoxDisableBackup" // false,
  | "mdmLockTaskOverviewButton" // false,
  | "disableIncomingCalls" // false,
  | "knoxDisableEdgeScreen" // false,
  | "forceHideKeyboard" // false,
  | "disableNotifications" // false,
  | "disableOtherApps" // true,
  | "mdmDisableSafeModeBoot" // true,
  | "remoteAdminFileManagement" // false,
  | "knoxDisableMtp" // false,
  | "textSelection" // false,
  | "websiteIntegration" // true,
  | "knoxDisableCellularData" // false,
  | "proximityScreenOff" // false,
  | "videoCaptureUploads" // false,
  | "reloadOnInternet" // false,
  | "enableLocalhost" // false,
  | "usageStatistics" // false,
  | "isRunning" // true,
  | "resetWifiOnDisconnection" // false,
  | "fileUploads" // false,
  | "detectMotionOnlyWithFaces" // false,
  | "singleAppMode" // false,
  | "forceImmersive" // false,
  | "knoxDisableScreenCapture" // false,
  | "removeStatusBar" // false,
  | "knoxDisableWifiDirect" // false,
  | "knoxHideNavigationBar" // false,
  | "mdmDisableStatusBar" // false,
  | "showShareButton" // false,
  | "knoxDisableMultiUser" // false,
  | "redirectBlocked" // false,
  | "forceSwipeUnlock" // false,
  | "jsAlerts" // true,
  | "detectFaces" // false,
  | "screensaverDaydream" // false,
  | "mdmDisableUsbStorage" // false,
  | "knoxDisableFactoryReset" // false,
  | "lockSafeMode" // false,
  | "keepOnWhileFullscreen" // true,
  | "reloadOnScreenOn" // false,
  | "safeBrowsing" // false,
  | "deleteCookiesOnReload" // false,
  | "sleepOnPowerDisconnect" // false,
  | "knoxDisableFirmwareRecovery" // false,
  | "knoxDisableVpn" // false,
  | "runInForeground" // true,
  | "screenOnOnMovement" // true,
  | "barcodeScanInsertInputField" // false,
  | "knoxDisableHomeButton" // false,
  | "knoxDisableStatusBar" // false,
  | "knoxDisableHeadphoneState" // false,
  | "protectedContent" // false,
  | "knoxSetForceAutoStartUpState" // false,
  | "enableZoom" // true,
  | "playerCacheImages" // true,
  | "detectIBeacons" // false,
  | "mdmDisableAppsFromUnknownSources" // true,
  | "barcodeScanListenKeys" // false,
  | "deleteCacheOnReload" // false,
  | "stopScreensaverOnMovement" // true,
  | "knoxDisableOtaUpgrades" // false,
  | "showQrScanButton" // false,
  | "motionDetectionAcoustic" // false,
  | "stopScreensaverOnMotion" // true,
  | "audioRecordUploads" // false,
  | "showAppLauncherOnStart" // false,
  | "mdmLockTaskNotifications" // false,
  | "disableScreenshots" // false,
  | "knoxDisableSafeMode" // false,
  | "ignoreMotionWhenScreensaverOnOff" // false,
  | "knoxDisableGoogleAccountsAutoSync" // false,
  | "knoxDisableAudioRecord" // false,
  | "showRefreshButton" // false,
  | "knoxDisableVolumeButtons" // false,
  | "autoImportSettings" // true,
  | "showForwardButton" // true,
  | "mqttEnabled" // false,
  | "knoxDisablePowerSavingMode" // false,
  | "keepSleepingIfUnplugged" // false,
  | "knoxDisableUsbDebugging" // false,
  | "disableVolumeButtons" // true,
  | "environmentSensorsEnabled" // false,
  | "showNewTabButton" // false,
  | "showBackButton" // true,
  | "stopIdleReloadOnMotion" // false,
  | "enableBackButton" // true,
  | "ignoreSSLerrors" // false,
  | "webviewDebugging" // false,
  | "disableStatusBar" // true,
  | "confirmExit" // true,
  | "showProgressBar" // true,
  | "knoxDisableRecentTaskButton" // false,
  | "knoxDisableClipboardShare" // false,
  | "knoxDisableBluetoothTethering" // false,
  | "phoneSpeaker" // false,
  | "setWifiWakelock" // false,
  | "disableOutgoingCalls" // false,
  | "screenOffInDarkness" // false,
  | "knoxDisableAirplaneMode" // false,
  | "enablePullToRefresh" // false,
  | "touchInteraction" // true,
  | "enableFullscreenVideos" // true,
  | "showTabCloseButtons" // true,
  | "showMenuHint" // true,
  | "keepScreenOnAdvanced" // false,
  | "disableHomeButton" // true,
  | "renderInCutoutArea" // true,
  | "pauseWebviewOnPause" // false,
  | "touchesOtherAppsBreakIdle" // false,
  | "thirdPartyCookies" // true,
  | "showPrintButton" // false,
  | "mdmLockTaskSystemInfo" // false,
  | "keepScreenOn" // true,
  | "knoxDisableMultiWindowMode" // false,
  | "forceShowKeyboard" // false,
  | "disableCamera" // false,
  | "showCamPreview" // false,
  | "addXffHeader" // false,
  | "remoteAdmin" // false,
  | "mdmLockTaskHomeButton" // false,
  | "webviewDragging" // true,
  | "forceScreenUnlock" // true,
  | "enableVersionInfo" // true,
  | "knoxDisableMicrophoneState" // false,
  | "knoxDisableUsbTethering" // false,
  | "knoxDisableAirCommandMode" // false,
  | "reloadOnWifiOn" // false,
  | "webviewScrolling" // true,
  | "knoxDisableBackButton" // false,
  | "knoxActiveByKiosk" // false,
  | "playAlarmSoundOnMovement" // false,
  | "barcodeScanSubmitInputField" // false,
  | "addRefererHeader" // true,
  | "remoteAdminSingleAppExit" // false,
  | "disablePowerButton" // true,
  | "showTabs" // false,
  | "microphoneAccess" // false,
  | "pageTransitions" // false,
  | "restartAfterUpdate" // true,
  | "swipeNavigation" // false,
  | "skipReloadIfStartUrlShowing" // false,
  | "knoxDisablePowerOff" // false,
  | "setRemoveSystemUI" // false,
  | "ignoreMotionWhenMoving" // false,
  | "setCpuWakelock" // false,
  | "playAlarmSoundUntilPin" // false,
  | "knoxDisableCamera" // false,
  | "desktopMode" // true,
  | "cameraCaptureUploads" // false,
  | "wakeupOnPowerConnect" // false,
  | "autoplayAudio" // false,
  | "autoplayVideos" // true,
  | "knoxDisableNonMarketApps" // false,
  | "unlockAndroidTvPrefs" // false,
  | "preventSleepWhileScreenOff" // false,
  | "mdmLockTask" // false,
  | "knoxDisablePowerButton" // false,
  | "readNfcTag"; // false,

export type FullyStringSettings =
  | "_isDev"
  | "_custom"
  | "_injectJsModified"
  | "wifiSSID" // "",
  | "actionBarBgUrl" // "",
  | "mdmApkToInstall" // "",
  | "mqttDeviceInfoTopic" // "$appId/deviceInfo/$deviceId",
  | "screensaverBrightness" // "",
  | "mqttBrokerUrl" // "",
  | "kioskAppWhitelist" // "",
  | "authPassword" // "",
  | "mqttBrokerPassword" // "",
  | "motionCameraId" // "",
  | "mqttClientId" // "",
  | "barcodeScanTargetUrl" // "",
  | "lastVersionInfo" // "1.48.1-play",
  | "clientCaPassword" // "",
  | "screensaverPlaylist" // "",
  | "screenBrightness" // "",
  | "urlWhitelist" // "",
  | "launcherInjectCode" // "",
  | "wssServiceUrl" // "",
  | "barcodeScanIntent" // "",
  | "deviceName" // "",
  | "wifiEnterprisePassword" // "",
  | "screensaverWallpaperURL" // "fully://color#000000",
  | "alarmSoundFileUrl" // "",
  | "mqttEventTopic" // "$appId/event/$event/$deviceId",
  | "folderCleanupTime" // "",
  | "launcherApps" // "",
  | "mdmSystemAppsToEnable" // "",
  | "folderCleanupList" // "",
  | "kioskWifiPin" // "",
  | "kioskAppBlacklist" // "",
  | "wifiKey" // "",
  | "barcodeScanBroadcastExtra" // "",
  | "loadContentZipFileUrl" // "",
  | "mqttBrokerUsername" // "",
  | "knoxApnConfig" // "",
  | "mainWebAutomation" // "",
  | "screensaverOtherAppIntent" // "",
  | "clientCaUrl" // "",
  | "forceOpenByAppUrl" // "",
  | "mdmAppLockTaskWhitelist" // "",
  | "volumeLevels" // "",
  | "appToRunOnStart" // "",
  | "killAppsBeforeStartingList" // "",
  | "injectJsCode" // "",
  | "errorURL" // "",
  | "authUsername" // "",
  | "volumeLimits" // "",
  | "singleAppIntent" // "",
  | "urlBlacklist" // "",
  | "remoteAdminPassword" // "",
  | "customUserAgent" // "",
  | "actionBarCustomButtonUrl" // "",
  | "appBlockReturnIntent" // "",
  | "movementBeaconList" // "",
  | "mdmApnConfig" // "",
  | "mdmProxyConfig" // "",
  | "volumeLicenseKey" // "",
  | "barcodeScanBroadcastAction" // "",
  | "mdmAppsToDisable" // "",
  | "appToRunInForegroundOnStart" // "",
  | "sleepSchedule" // "",
  | "rebootTime" // "",
  | "actionBarTitle" // "Fully Kiosk Browser",
  | "actionBarIconUrl" // "",
  | "wifiEnterpriseIdentity" // "",
  | "kioskWifiPinCustomIntent" // "",
  | "startURL" // "https://kiosk-viewer.web.app",
  | "sebExamKey" // "",
  | "launcherBgUrl" // "",
  | "searchProviderUrl" // "https://www.google.com/search?q=",
  | "sebConfigKey" // "",
  | "wifiType" // "WPA_PSK",
  | "kioskPinEnc"; // : "enc_g97sIMNsKiqcokN6+7AgR0o9wp7LSc9lGDaDQyZURDU="

export type FullyNumberStringSettings =
  | "errorUrlOnDisconnection" // "0",
  | "imageScaleType" // "3",
  | "kioskWifiPinAction" // "0",
  | "mdmPasswordQuality" // "0",
  | "wifiMode" // "0",
  | "timeToScreenOffV2" // "0",
  | "forceScreenOrientation" // "0",
  | "timeToRegainFocus" // "0",
  | "initialScale" // "0",
  | "kioskExitGesture" // "0",
  | "bluetoothMode" // "0",
  | "timeToGoBackground" // "0",
  | "timeToClearSingleAppData" // "0",
  | "timeToShutdownOnPowerDisconnect" // "0",
  | "reloadPageFailure" // "0",
  | "cacheMode" // "-1",
  | "compassSensitivity" // "50",
  | "motionFps" // "5",
  | "sleepOnPowerDisconnectDelay" // "0",
  | "reloadEachSeconds" // "0",
  | "webviewDarkMode" // "1",
  | "batteryWarning" // "0",
  | "graphicsAccelerationMode" // "2",
  | "appLauncherScaling" // "100",
  | "motionSensitivity" // "90",
  | "accelerometerSensitivity" // "80",
  | "remoteFileMode" // "0",
  | "mdmMinimumPasswordLength" // "5",
  | "mdmApkToInstallInterval" // "0",
  | "fontSize" // "100",
  | "timeToClearLauncherAppData" // "0",
  | "actionBarSize" // "100",
  | "motionSensitivityAcoustic" // "90",
  | "userAgent" // "0",
  | "webviewMixedContent" // "2",
  | "remotePdfFileMode" // "0",
  | "mdmSystemUpdatePolicy" // "0",
  | "localPdfFileMode" // "0",
  | "mdmRuntimePermissionPolicy" // "0",
  | "fadeInOutDuration" // "200",
  | "displayMode" // "0",
  | "tapsToPinDialogInSingleAppMode" // "7",
  | "timeToScreensaverV2" // "0",
  | "movementBeaconDistance" // "5",
  | "darknessLevel"; // "10",

export type FullyNumberSettings =
  | "actionBarFgColor" // -1
  | "tabsBgColor" // -2236963
  | "progressBarColor" // -13611010
  | "addressBarBgColor" // -2236963
  | "statusBarColor" // 0
  | "appLauncherBackgroundColor" // -1
  | "defaultWebviewBackgroundColor" // -1
  | "inactiveTabsBgColor" // -4144960
  | "navigationBarColor" // 0
  | "appLauncherTextColor" // -16777216
  | "actionBarBgColor" // -15906911
  | "tabsFgColor"; // -16777216