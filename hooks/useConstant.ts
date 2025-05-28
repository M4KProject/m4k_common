import { useRef } from "react";

export const useConstant = <T>(fn: () => T): T => {
  const c = useRef<T[]>([]).current;
  if (c.length === 0) c.push(fn());
  return c[0];
};
