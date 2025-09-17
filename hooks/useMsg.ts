import { Msg, IMsgReadonly } from '../utils/Msg';
import { useEffect, useState } from 'preact/hooks';

interface UseMsg {
  <T = any>(msg: IMsgReadonly<T>): T;
  <T = any>(msg: IMsgReadonly<T> | null | undefined): T | undefined;
}

interface UseMsgState {
  <T = any>(msg: IMsgReadonly<T>): [T, (next: T) => void];
  <T = any>(
    msg: IMsgReadonly<T> | null | undefined
  ): [T | undefined, (next: T | undefined) => void];
}

let i = 0;

export const useMsg = (<T = any>(msg: IMsgReadonly<T> | null | undefined): T | undefined => {
  const setState = useState(0)[1];
  useEffect(() => {
    setState(i++);
    return msg?.on(() => setState(i++));
  }, [msg]);
  return msg ? msg.get() : undefined;
}) as UseMsg;

export const useMsgState = (<T = any>(
  msg: Msg<T> | null | undefined
): [T | undefined, (value: T | undefined) => void] => {
  return [useMsg(msg), msg.setter()];
}) as UseMsgState;
