import { Coll, CollWhere } from "@common/api/Coll";
import { ModelBase } from "@common/api/models";

export const useSyncQuery = <T extends ModelBase>(coll: Coll<T>, where?: CollWhere<T>) => {
    // const byId$ = useMemo(() => )

    // const list = useMemo(() => {
    //     coll.find(where);
    // }, [coll, where]);

    // return useMsg(byId$);
}