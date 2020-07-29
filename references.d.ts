/* eslint-disable spaced-comment */
/// <reference path="./node_modules/@nativescript/types/ios.d.ts" />
/// <reference path="./node_modules/@nativescript/types/android-28.d.ts" />
/// <reference path="./typings/android.d.ts" />

declare const TNS_ENV: string;
declare const LOG_LEVEL: string;
declare const TEST_LOGS: boolean;
declare const PRODUCTION: boolean;
declare const SENTRY_DSN: string;
declare const SENTRY_PREFIX: string;
declare const GIT_URL: string;
declare const STORE_LINK: string;
declare const STORE_REVIEW_LINK: string;
// declare const process: { env: any };

// Augment the NodeJS global type with our own extensions

declare const gVars: {
    sentry: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    platform: string;
};

declare module '*.scss';
// declare module '*.svelte' {
//     type test = SvelteComponent;
//     export default test;
// }
declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class NightModeApplication extends android.app.Application {}
            export class WorkersContext {
                public static getValue(key): any;
                public static setValue(key: string, value);
            }
        }
    }
}
declare module 'nativescript-worker-loader!*' {
    const content: any;
    export = content;
}

declare interface NativeClassOptions {
    nativeClassName?: string; // for @JavaProxy and
    protocols?: any[];
    interfaces?: any[];
}

/**
 * Decorates class that extends a native class(iOS or Android)
 */
declare function NativeClass<T extends new (...args: any[]) => {}>(constructor: T);
declare function NativeClass<T extends new (...args: any[]) => {}>(options?: NativeClassOptions);
