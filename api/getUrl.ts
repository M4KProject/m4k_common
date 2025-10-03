import { pathJoin } from '@common/utils/pathJoin';
import { getApiUrl } from './apiReq';

export type Thumb = 24 | 48 | 100 | 200 | 360 | 720 | 1920 | 4096;

export const getUrl = (coll: string, id?: string, filename?: any, thumb?: Thumb) => {
  if (!id || !filename) return '';
  const url = pathJoin(getApiUrl(), `files/${coll}/${id}/${filename}`);
  return thumb ? `${url}?thumb=${thumb}x${thumb}` : url;
};
