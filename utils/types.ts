export type List<T = any> = T[];
export type Item = Record<string, any>;
export type TMap<T = any> = Record<string, T>;
export type ItemMap<T extends Item = any> = TMap<T>;
export type Obj = Item | List;
export type Fun = (...args: any[]) => any;
