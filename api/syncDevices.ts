import { DeviceModel } from './models';
import { SyncColl } from './SyncColl';

export const syncDevices = new SyncColl<DeviceModel>('devices');
