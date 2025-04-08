import { M4Kiosk } from "./interface"

const createM4k = (): M4Kiosk => {
    const notImplemented = (...args: any[]) => {
        throw new Error("not implemented");
    }
    
    return {
        global: window as any,
        
        pressKey: notImplemented,
        tap: notImplemented,
        swipe: notImplemented,
        move: notImplemented,
        down: notImplemented,
        up: notImplemented,
        inputText: notImplemented,
    
        loadJs: notImplemented,
        eval: notImplemented,
        js: notImplemented,
        su: notImplemented,
        sh: notImplemented,
    
        save: notImplemented,
        load: notImplemented,
        data: notImplemented,
        get: notImplemented,
        set: notImplemented,
        keys: notImplemented,
        merge: notImplemented,
        replace: notImplemented,
        clear: notImplemented,
    
        fileInfo: notImplemented,
        absolutePath: notImplemented,
        mkdir: notImplemented,
        ls: notImplemented,
        cp: notImplemented,
        mv: notImplemented,
        rm: notImplemented,
        zip: notImplemented,
        unzip: notImplemented,
    
        download: notImplemented,
    
        pdfToImages: notImplemented,
        resize: notImplemented,
        capture: notImplemented,
    
        readAsset: notImplemented,
        read: notImplemented,
        write: notImplemented,
        reboot: notImplemented,
        restart: notImplemented,
        reload: notImplemented,
        exit: notImplemented,
        deviceInfo: notImplemented,
        
        log: notImplemented,
        // popLogs(count?: number): Promise<M4kLog[]>;
        
        // wvKey(): Promise<string>;
        // wvList(): Promise<Record<string, M4kWebViewConfig>>;
        // wvConfig(options: { reset?: boolean, [key: string]: M4kWebViewConfig|boolean|undefined }): Promise<void>;
    
        installedPackages: notImplemented,
        packageInfo: notImplemented,
        startIntent: notImplemented,
    
        installApk: notImplemented,
    
        openAutoStart: notImplemented,
    
        showMessage: notImplemented,
    
        subscribe: notImplemented,
        signal: notImplemented,
    }
}

export default (): M4Kiosk => {
    const g = window as any
    const m4k = g.m4k
    if (m4k) return m4k
    return (g.m4k = createM4k())
}