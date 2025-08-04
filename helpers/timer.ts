import { randString } from "./rand";
import { global } from '../helpers/global';

const timers: Record<string, any> = global.m4kTimers || (global.m4kTimers = {});

const timer = (id: null|string, ms: number, cb: null|(() => void)) => {
    if (!id) id = randString(10) + Date.now();
    if (timers[id]) {
        clearInterval(timers[id]);
        delete timers[id];
    }
    if (ms > 0 && cb) {
        timers[id] = setInterval(cb, ms);
    }
}

export default timer;