import { M4Kiosk } from "./m4kInterface";

export const M4K_METHODS: Partial<Record<keyof M4Kiosk, string[]>> = {
    pressKey: ['key'],
    tap: ['x', 'y'],
    swipe: ['x', 'y', 'xEnd', 'yEnd', 'ms'],
    move: ['x', 'y'],
    down: ['x', 'y'],
    up: ['x', 'y'],
    inputText: ['text'],

    loadJs: ['path'],
    eval: ['script'],
    js: ['script'],
    su: ['cmd'],
    sh: ['cmd'],

    save: [],
    load: [],
    data: [],
    get: ['key'],
    set: ['key', 'value'],
    keys: [],
    merge: ['changes'],
    replace: ['values'],
    clear: [],

    fileInfo: ['path'],
    absolutePath: ['path'],
    mkdir: ['path'],
    ls: ['path', 'recursive'],
    cp: ['path', 'dest'],
    mv: ['path', 'dest'],
    rm: ['path'],
    zip: ['path', 'dest', 'uncompressed'],
    unzip: ['path', 'dest'],

    download: ['url', 'dest'],
    
    pdfToImages: ['path', 'options'],
    resize: ['path', 'options'],
    capture: ['options'],
    
    read: ['path', 'encoding'],
    write: ['path', 'content', 'encoding', 'append'],
    url: ['path'],
    reboot: [],
    restart: [],
    reload: [],
    exit: [],
    info: [],

    log: ['level', 'message', 'data', 'source', 'line'],
    // popLogs: ['count'],

    // wvKey: [],
    // wvList: [],
    // wvConfig: ['options'],

    installedPackages: [],
    packageInfo: ['name'],
    startIntent: ['options'],

    installApk: ['path'],

    openAutoStart: [],

    showMessage: ['message'],
}

export const m4kBridge = (m4k: M4Kiosk) => {
    const m = m4k as any;
    const g = m4k.global;

    let count = 0
    const newCb = (name: string) => 'cb_' + name + (count++)
    
    Object.entries(M4K_METHODS).map(([method, argKeys]) => {
        // logDebug('add method', method, argKeys)
        m[method] = (...args: any[]) => new Promise<any>((resolve, reject) => {
            const cb = newCb(method)
            try {
                g[cb] = (error: any, result: any) => {
                    delete g[cb]
                    if (error) {
                        reject(error)
                        return
                    }
                    resolve(result)
                }
                const o: any = { cb, method }
                const l = args.length
                for (let i=0;i<l;i++) {
                    const value = args[i]
                    const key = argKeys[i]
                    if (!key) continue
                    if (typeof value === 'function') {
                        const listenerCb = newCb(method + '_' + key)
                        g[listenerCb] = value
                        o[key] = listenerCb
                        continue
                    }
                    o[key] = value
                }
                g._m4k.run(JSON.stringify(o))
            }
            catch (err) {
                delete g[cb]
                reject(err)
            }
        })
    })
};