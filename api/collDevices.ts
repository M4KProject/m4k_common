import { coll } from './Coll';
import { DeviceModel } from './models';

export const collDevices = coll<DeviceModel>('devices');
