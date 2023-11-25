/// <reference path="../node_modules/@nativescript/types-android/lib/android-30.d.ts" />
/// <reference path="../node_modules/@nativescript/types-android/lib/android/android-declarations.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!UIKit.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!Foundation.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!CoreGraphics.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!ObjectiveC.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!Photos.d.ts" />
/// <reference path="../node_modules/@nativescript/core/global-types.d.ts" />

// declare module '*.vue' {
//     import Vue from 'nativescript-vue';
//     export default Vue;
// }

declare module '*.scss' {
    // const content: any;

    // export default content;
    // export function toString(): string
    export const locals;
    // export const i
}

declare const gVars: {
    sentry: boolean;
    platform: string;
};

declare const TNS_ENV: string;
declare const DEV_LOG: boolean;
declare const START_ON_CAM: boolean;
declare const NO_CONSOLE: boolean;
declare const TEST_LOGS: boolean;
declare const PRODUCTION: boolean;
declare const SENTRY_ENABLED: boolean;
declare const SENTRY_DSN: string;
declare const SENTRY_PREFIX: string;
declare const SUPPORTED_LOCALES: string[];
declare const DEFAULT_LOCALE: string;
declare const DEFAULT_THEME: string;
declare const GIT_URL: string;
declare const STORE_LINK: string;
declare const STORE_REVIEW_LINK: string;
declare const __APP_ID__: string;
declare const __APP_VERSION__: string;
declare const __APP_BUILD_NUMBER__: string;
// declare const process: { env: any };

// eslint-disable-next-line @typescript-eslint/no-unnecessary-qualifier
namespace svelteNative.JSX {
    interface ViewAttributes {
        rippleColor?: string;
        verticalAlignment?: string;
        dynamicElevationOffset?: string | number;
        elevation?: string | number;
    }
    export interface ButtonAttributes {
        variant?: string;
        shape?: string;
    }
    export interface SliderAttributes {
        stepSize?: number;
    }
    export interface ImageAttributes {
        noCache?: boolean;
        imageRotation?: number;
        colorMatrix?: number[];
    }
    export interface LabelAttributes {
        autoFontSize?: boolean;
        verticalTextAlignment?: string;
        maxLines?: number;
        minFontSize?: number;
        maxFontSize?: number;
        lineBreak?: string;
        html?: string;
    }
}

