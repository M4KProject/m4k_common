import { Msg, IMsgReadonly } from '@common/utils/Msg';
import { useEffect, useState } from 'preact/hooks';

type NMsgReadonly<T> = IMsgReadonly<T> | null | undefined;
type NMsg<T> = Msg<T> | null | undefined;

interface UseMsg {
  <T = any>(msg: IMsgReadonly<T>): T;
  <T = any>(msg: NMsgReadonly<T>): T | undefined;
}

interface UseMsgState {
  <T = any>(msg: Msg<T>): [T, (next: T) => void];
  <T = any, U = any>(msg: Msg<T>, get: (msg: Msg<T>) => U): [U, (next: T) => void];
  <T = any, U = any>(msg: Msg<T>, get: (v: Msg<T>) => U, set: (msg: Msg<T>, next: U) => void): [U, (next: T) => void];

  <T = any>(msg: NMsg<T>): [T | undefined, (next: T) => void];
  <T = any, U = any>(msg: NMsg<T>, get: (msg: Msg<T>) => U): [U | undefined, (next: T) => void];
  <T = any, U = any>(msg: NMsg<T>, get: (v: Msg<T>) => U, set: (msg: Msg<T>, next: U) => void): [U | undefined, (next: T) => void];
}

export const useMsg = (<T = any>(msg: IMsgReadonly<T> | null | undefined): T | undefined => {
  const [state, setState] = useState(msg && msg.v);
  useEffect(() => {
    setState(msg && msg.v);
    return msg && msg.on(setState);
  }, [msg]);
  return state;
}) as UseMsg;

const _get = (msg: Msg) => msg.get();
const _set = (msg: Msg, next: any) => msg.set(next);

export const useMsgState = (<T>(
  msg: Msg<T>,
  get: (msg: Msg<T>) => T = _get,
  set: (msg: Msg<T>, next: T) => void = _set,
): [T, (next: T) => void] => {
  const [state, setState] = useState(msg && get(msg));
  useEffect(() => {
    setState(msg && get(msg));
    return msg && msg.on(() => {
      setState(msg && get(msg));
    });
  }, [msg]);
  return [state, (next) => msg && set(msg, next)];
}) as UseMsgState;
