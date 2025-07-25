import { removeItem } from "../helpers/array.ts";
import { m4kBridge } from "./m4kBridge.ts";
import { m4kBrowser } from "./m4kBrowser.ts";
import type { M4Kiosk, M4kEvent, M4kSignalEvent } from "./m4kInterface.ts"
import { global } from '../helpers/global.ts';

export const m4k = (() => {
    const w = global;
    const _m4k = w._m4k;
    
    console.debug('init m4k', typeof _m4k);
    
    const m: any = { global: w }
    const m4k: M4Kiosk = m
    w.m4k = m4k

    _m4k ? m4kBridge(m4k) : m4kBrowser(m4k);
    
    const listeners: ((event: M4kEvent) => void)[] = []
    
    m4k.subscribe = (listener: (event: M4kEvent) => void) => {
        listeners.push(listener)
        return () => removeItem(listeners, listener)
    }
    
    let eventCount = 0
    m4k.signal = (event: M4kSignalEvent) => {
        eventCount++
        if (!event.id) event.id = String(eventCount)
        for (const listener of listeners) {
            try {
                listener(event as M4kEvent)
            }
            catch (error) {
                console.error('listener', event, error)
            }
        }
    }
    
    const onM4k = w.onM4k
    if (onM4k) onM4k(m4k)
    
    m4k.log('info', 'm4k ready')

    // setTimeout(() => {
    //     document.querySelectorAll('meta[name="viewport"]').forEach(meta => meta.remove())
    //     const meta = document.createElement('meta')
    //     meta.name = 'viewport'
    //     meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    //     document.head.appendChild(meta)
    // }, 10)

    return m4k;
})()