/// <reference path="../node_modules/@nativescript/types-android/lib/android-30.d.ts" />
/// <reference path="../node_modules/@nativescript/types-android/lib/android/android-declarations.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!UIKit.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!Foundation.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!ObjectiveC.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!UniformTypeIdentifiers.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!LinkPresentation.d.ts" />
/// <reference path="../node_modules/@nativescript/core/global-types.d.ts" />

// for nativeprocessor
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!CoreGraphics.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!Photos.d.ts" />
/// <reference path="../node_modules/@nativescript/types-ios/lib/ios/objc-x86_64/objc!CoreImage.d.ts" />
/// <reference path="../node_modules/@nativescript-community/ui-cameraview/typings/androidx.camera.d.ts" />
/// <reference path="../node_modules/@nativescript-community/ui-cameraview/typings/android.d.ts" />
/// <reference path="../node_modules/@nativescript-community/ui-document-picker/typings/android.d.ts" />

// declare module '*.vue' {
//     import Vue from 'nativescript-vue';
//     export default Vue;
// }

declare module 'svelte/internal' {
    export function get_current_component();
}

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
declare const TEST_LOG: boolean;
declare const PRODUCTION: boolean;
declare const CARD_APP: boolean;
declare const SENTRY_ENABLED: boolean;
declare const SENTRY_DSN: string;
declare const SENTRY_PREFIX: string;
declare const SUPPORTED_LOCALES: string[];
declare const DEFAULT_LOCALE: string;
declare const DEFAULT_THEME: string;
declare const GIT_URL: string;
declare const STORE_LINK: string;
declare const PLAY_STORE_BUILD: boolean;
declare const STORE_REVIEW_LINK: string;
declare const SPONSOR_URL: string;
declare const __APP_ID__: string;
declare const __APP_VERSION__: string;
declare const __APP_BUILD_NUMBER__: string;
// declare const process: { env: any };

// eslint-disable-next-line @typescript-eslint/no-unnecessary-qualifier
declare namespace svelteNative.JSX {
    type Override<What, With> = Omit<What, keyof With> & With;
    type ViewKeys = keyof TViewAttributes;
    type TViewAugmentedAttributes = Override<
        TViewAttributes,
        {
            disableCss?: boolean;
            rippleColor?: string;
            sharedTransitionTag?: string;
            verticalAlignment?: string;
            dynamicElevationOffset?: string | number;
            elevation?: string | number;
        }
    >;
    type ViewAndroidAttributes = {
        [K in keyof TViewAugmentedAttributes as `android:${K}`]: TViewAugmentedAttributes[k];
    };
    type ViewIOSAttributes = {
        [K in keyof TViewAugmentedAttributes as `ios:${K}`]: TViewAugmentedAttributes[k];
    };
    type ViewAttributes = TViewAugmentedAttributes & ViewAndroidAttributes & ViewIOSAttributes;

    interface ButtonAttributes {
        variant?: string;
        shape?: string;
    }
    interface ImageAttributes {
        noCache?: boolean;
        imageRotation?: number;
        colorMatrix?: number[];
        blurRadius?: number;
        fadeDuration?: number;
        'on:rotateAnimated'?: (args: EventData) => void;
    }
    interface SpanAttributes {
        verticalAlignment?: string;
        verticalTextAlignment?: string;
    }
    interface SliderAttributes {
        stepSize?: number;
        trackBackgroundColor?: string;
    }
    interface PageAttributes {
        statusBarColor?: string;
        screenOrientation?: string;
        keepScreenAwake?: boolean;
        screenBrightness?: number;
        'on:closingModally'?: (args: ShownModallyData) => void;
        // "on:shownModally"?: (args: ShownModallyData) => void;
    }
    interface LabelAttributes {
        autoFontSize?: boolean;
        verticalTextAlignment?: string;
        maxLines?: number;
        minFontSize?: number;
        maxFontSize?: number;
        lineBreak?: string;
        html?: string;
        selectable?: boolean;
        'ios:selectable'?: boolean;
        onlinkTap?;
        'on:linkTap'?;
    }
}
