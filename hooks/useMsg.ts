import { MsgDict } from '@common/utils';
import { Msg, IMsgReadonly } from '@common/utils/Msg';
import { useEffect, useState } from 'preact/hooks';

type NMsgReadonly<T> = IMsgReadonly<T> | null | undefined;
type NMsg<T> = Msg<T> | null | undefined;
type NMsgDict<T> = MsgDict<T> | null | undefined;

interface UseMsg {
  <T = any>(msg: IMsgReadonly<T>): T;
  <T = any>(msg: NMsgReadonly<T>): T | undefined;
}

interface UseMsgState {
  <T = any>(msg: Msg<T>): [T, (next: T) => void];
  <T = any>(msg: NMsg<T>): [T | undefined, (next: T) => void];
}

export const useMsg = (<T = any>(msg: IMsgReadonly<T> | null | undefined): T | undefined => {
  const [state, setState] = useState(msg ? msg.v : undefined);
  useEffect(() => {
    if (!msg) {
      setState(undefined);
      return;
    }
    setState(msg.v);
    return msg.on((v) => setState(v));
  }, [msg]);
  return state;
}) as UseMsg;

export const useMsgState = (<T = any>(msg: Msg<T>): [T, (next: T) => void] => {
  const [state, setState] = useState(msg && msg.v);
  useEffect(() => {
    setState(msg && msg.v);
    return msg && msg.on(setState);
  }, [msg]);
  return [state, (next) => msg && msg.set(next)];
}) as UseMsgState;

export const useMsgItem = <T = any>(
  msg: NMsgDict<T>,
  key: string
): [T | undefined, (next: T) => void] => {
  const [state, setState] = useState(msg && msg.getItem(key));
  useEffect(() => {
    setState(msg && msg.getItem(key));
    return (
      msg &&
      msg.on(() => {
        setState(msg && msg.getItem(key));
      })
    );
  }, [msg, key]);
  return [state, (next) => msg && msg.setItem(key, next)];
};
