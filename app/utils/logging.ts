import { Sentry } from './sentry';

const originalConsole = {
    log: console.log,
    info: console.info,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
    dir: console.dir
};

function convertArg(arg) {
    const type = typeof arg;
    if (!arg) {
        return;
    }
    if (type === 'function' || typeof arg.getClass === 'function' || typeof arg.class === 'function') {
        return (arg as Function).toString();
    } else if (Array.isArray(arg)) {
        return arg.map(convertArg);
    } else if (type === 'object') {
        const str = arg.toString();
        if (str === '[object Object]') {
            return JSON.stringify(arg);
        } else {
            return str;
        }
    } else {
        return arg.toString();
    }
}
function actualLog(level: 'info' | 'log' | 'error' | 'warn' | 'debug', ...args) {
    if (gVars.sentry && Sentry) {
        Sentry.addBreadcrumb({
            category: 'console',
            message: args.map(convertArg).join(' '),
            level: level as any
        });
    }
    // we do it this way allow terser to "drop" it
    if (NO_CONSOLE !== true) {
        originalConsole[level](...args);
    }
}
let installed = false;
export function install() {
    if (installed) {
        return;
    }
    installed = true;
    if (NO_CONSOLE !== true && gVars.sentry) {
        console.log = (...args) => actualLog('log', ...args);
        console.info = (...args) => actualLog('info', ...args);
        console.error = (...args) => actualLog('error', ...args);
        console.warn = (...args) => actualLog('warn', ...args);
        console.debug = (...args) => actualLog('debug', ...args);
    }
}
