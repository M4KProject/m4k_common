import { toErr } from "../helpers/err";
import { parse, stringify } from "../helpers/json";
import { M4K_METHODS } from "./m4kBridge";
import { M4Kiosk } from "./m4kInterface";

export const m4kBrowser = (m4k: M4Kiosk) => {
    const m = m4k as any;

    for (const key in M4K_METHODS) {
        m[key] = () => Promise.resolve(null);
    }

    let _data: any = {};
    let _updated = false;
    const _load = () => {
        const json = localStorage.getItem('m4kData');
        _data = json ? parse(json) || {} : {};
        _updated = false;
    }
    const _save = () => {
        localStorage.setItem('m4kData', stringify(_data));
        _load();
    }

    setInterval(() => _updated && _save(), 5000);

    _load();

    m4k.save = async () => _save();
    m4k.load = async () => _load();
    m4k.data = async () => _data;
    m4k.get = async (key) => _data[key];
    m4k.set = async (key, value) => {
        _data[key] = value;
        _updated = true;
    }
    m4k.keys = async () => Object.keys(_data) as any;
    m4k.merge = async (changes) => {
        Object.assign(_data, changes);
        _updated = true;
    };
    m4k.replace = async (values) => {
        _data = values;
        _updated = true;
    };
    m4k.clear = () => m4k.replace({});

    m4k.js = async (script: string) => {
        try {
            const result = await m4k.global.eval(script);
            return { success: true, value: result };
        }
        catch (e) {
            return { success: false, error: String(toErr(e)) };
        }
    }

    m4k.info = () => Promise.resolve({
        type: 'm4kBrowser',
        width: screen.width,
        height: screen.height,
    });
};