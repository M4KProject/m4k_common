import { collSync } from "@common/api";
import { CollWhere } from "@common/api/Coll";
import { Models } from "@common/api/models";
import { stringify } from "@common/utils";
import { useEffect, useMemo, useState } from "preact/hooks";

export const useQuery = <K extends keyof Models>(name: K, where?: CollWhere<Models[K]>) => {
    const [state, setState] = useState([] as Models[K][]);
    
    const coll = collSync(name);
    
    useEffect(() => {
        const refresh = () => {
            setState(coll.findCache(where));
        }

        refresh();
        coll.find(where).then(refresh);
        
        const off = coll.on();
        const off2 = coll.cache.throttle(50).on(refresh);

        return () => {
            off();
            off2();
        }
    }, [name, stringify(where)]);

    return state;
}