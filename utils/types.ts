export type Dictionary<T = any> = Record<string, T>;
export type List<T = any> = T[];
export type Item = Dictionary<any>;
export type Obj = Item | List;
export type Fun = (...args: any[]) => any;