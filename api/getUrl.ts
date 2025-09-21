import { pathJoin } from "@common/utils/pathJoin";
import { getApiUrl } from "./messages";
import { Models } from "./models";

export const getUrl = (coll: keyof Models, id?: string, filename?: any, thumb?: [number, number]) => {
    if (!id || !filename) return '';
    const url = pathJoin(getApiUrl(), `files/${coll}/${id}/${filename}`);
    if (thumb) {
        const [w, h] = thumb || [200, 200];
        return `${url}?thumb=${w}x${h}`;
    }
    return url;
}