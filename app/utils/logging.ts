import { getAppId } from 'nativescript-extendedinfo';
// import { crashlytics } from 'nativescript-plugin-firebase'; // and do: firebaseCrashlytics.sendCrashLogexport const DEV_LOG = TNS_ENV === 'development';
export const DEV_LOG = LOG_LEVEL === 'full';

let appId: string;
getAppId().then(r => (appId = r));
// let chalk: Chalk;

// function getChalk() {
//     if (!chalk) {
//         chalk = require('chalk');
//     }
//     return chalk;
// }

export function log(target: any, k?, desc?: PropertyDescriptor): any;
export function log(always: boolean): (target: any, k?, desc?: PropertyDescriptor) => any;
export function log(alwaysOrTarget: boolean | any, k?, desc?: PropertyDescriptor) {
    // console.log('test log dec', alwaysOrTarget, typeof alwaysOrTarget, k, desc, Object.getOwnPropertyNames(alwaysOrTarget));
    if (typeof alwaysOrTarget !== 'boolean') {
        // console.log(nameOrTarget.name, ' is now decorated');
        return timelineProfileFunctionFactory(alwaysOrTarget, true, k, desc);
    } else {
        // factory
        return function(target: any, key?: string, descriptor?: PropertyDescriptor) {
            // const name = nameOrTarget || target.name;
            return timelineProfileFunctionFactory(target, alwaysOrTarget, key, descriptor);
            // console.log(name, ' is now decorated');
        };
    }
}

// const enum MemberType {
//     Static,
//     Instance
// }
// export const time = Date.now;
function timelineProfileFunctionFactory(target: any, always: boolean, key?, descriptor?: PropertyDescriptor) {
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    if (!always && !DEV_LOG) {
        return descriptor;
    }
    const originalMethod = descriptor.value;

    let className = '';
    if (target && target.constructor && target.constructor.name) {
        className = target.constructor.name + '.';
    }

    const name = className + key;

    // editing the descriptor/value parameter
    descriptor.value = function() {
        // const start = time();
        clog(name);
        try {
            return originalMethod.apply(this, arguments);
        } finally {
            // const end = time();
            // console.log(`Timeline: Modules: ${name}  (${start}ms. - ${end}ms.)`);
        }
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}

// export function clog(...args) {
//     return console.log.apply(this, [appId].concat(args));
// }
// const origConsole: { [k: string]: Function } = {
//     log: console.log,
//     error: console.error,
//     warn: console.warn
// };
import * as SentryType from '@nativescript-community/sentry';

let Sentry: typeof SentryType;
if (gVars.sentry) {
    Sentry = require('@nativescript-community/sentry');
}

function actualLog(level: 'info' | 'log' | 'error' | 'warn', ...args) {
    if (gVars.sentry) {
        // console.log('addBreadcrumb', level, args, args.join(' '));
        Sentry.addBreadcrumb({
            category: 'console',
            message: args.join(' '),
            level: level as any
        });
    }
    if (TEST_LOGS) {
        console[level].apply(this, args);
    }
}

export const clog = (...args) => actualLog('log', ...args);
export const cerror = (...args) => actualLog('error', ...args);
export const cwarn = (...args) => actualLog('warn', ...args);
