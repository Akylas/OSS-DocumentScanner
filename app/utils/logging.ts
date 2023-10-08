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
    if (type === 'undefined') {
        return 'undefined';
    } else if (arg === null) {
        return 'null';
    }
    if (Array.isArray(arg)) {
        // one issue with JSON.stringify is that undefined will become null
        return JSON.stringify(arg);
    } else if (type === 'object') {
        const str = arg.toString();
        if (str === '[object Object]') {
            return JSON.stringify(arg);
        } else {
            return str;
        }
    }
    return arg;
}
function actualLog(level: 'info' | 'log' | 'error' | 'warn' | 'debug', ...args) {
    if (SENTRY_ENABLED && Sentry) {
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
    if (NO_CONSOLE !== true && SENTRY_ENABLED) {
        console.log = (...args) => actualLog('log', ...args);
        console.info = (...args) => actualLog('info', ...args);
        console.error = (...args) => actualLog('error', ...args);
        console.warn = (...args) => actualLog('warn', ...args);
        console.debug = (...args) => actualLog('debug', ...args);
    }
}
