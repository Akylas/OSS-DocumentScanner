import { isSimulator } from '@nativescript-community/extendedinfo';
import { Application, Color, Observable, Screen, Utils } from '@nativescript/core';
import { get, writable } from 'svelte/store';
// import CSSModule from '~/variables.module.scss';
import { onDestroy } from 'svelte';
import { getRealThemeAndUpdateColors } from './helpers/theme';
// const locals = CSSModule.locals;

export const globalObservable = new Observable();

const callbacks = {};
export function createGlobalEventListener(eventName: string) {
    return function (callback: Function, once = false) {
        callbacks[eventName] = callbacks[eventName] || {};
        let cleaned = false;

        function clean() {
            if (!cleaned) {
                cleaned = true;
                delete callbacks[eventName][callback];
                globalObservable.off(eventName, eventCallack);
            }
        }
        const eventCallack = (event) => {
            if (once) {
                clean();
            }
            if (Array.isArray(event.data)) {
                event.result = callback(...event.data);
            } else {
                event.result = callback(event.data);
            }
        };
        callbacks[eventName][callback] = eventCallack;
        globalObservable.on(eventName, eventCallack);

        onDestroy(() => {
            clean();
        });
        return clean;
    };
}
export function createUnregisterGlobalEventListener(eventName: string) {
    return function (callback: Function) {
        if (callbacks[eventName] && callbacks[eventName][callback]) {
            globalObservable.off(eventName, callbacks[eventName][callback]);
            delete callbacks[eventName][callback];
        }
    };
}

export const colors = writable({
    colorPrimary: '',
    colorOnPrimary: '',
    colorPrimaryContainer: '',
    colorOnPrimaryContainer: '',
    colorSecondary: '',
    colorOnSecondary: '',
    colorSecondaryContainer: '',
    colorOnSecondaryContainer: '',
    colorTertiary: '',
    colorOnTertiary: '',
    colorTertiaryContainer: '',
    colorOnTertiaryContainer: '',
    colorError: '',
    colorOnError: '',
    colorErrorContainer: '',
    colorOnErrorContainer: '',
    colorOutline: '',
    colorOutlineVariant: '',
    colorBackground: '',
    colorOnBackground: '',
    colorSurface: '',
    colorOnSurface: '',
    colorOnSurfaceVariant: '',
    colorSurfaceInverse: '',
    colorOnSurfaceInverse: '',
    colorPrimaryInverse: '',
    colorSurfaceContainer: '',
    colorSurfaceBright: '',
    colorSurfaceDim: '',
    colorSurfaceContainerLow: '',
    colorSurfaceContainerLowest: '',
    colorSurfaceContainerHigh: '',
    colorSurfaceContainerHighest: '',
    colorOnSurfaceDisabled: '',
    popupMenuBackground: ''
});
export const fonts = writable({
    mdi: ''
});
let innerStatusBarHeight = 20;
export const statusBarHeight = writable(innerStatusBarHeight);
export const actionBarButtonHeight = writable(0);
export const actionBarHeight = writable(0);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export const navigationBarHeight = writable(0);

export let globalMarginTop = 0;

const onInitRootView = function () {
    // we need a timeout to read rootView css variable. not 100% sure why yet
    setTimeout(() => {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        // DEV_LOG && console.log('initRootView', rootView);
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        // DEV_LOG && console.log('fonts', get(fonts));
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        if (__IOS__) {
            navigationBarHeight.set(Application.ios.window.safeAreaInsets.bottom);
        }
        if (__ANDROID__) {
            const activity = Application.android.startActivity;
            const nUtils = com.akylas.documentscanner.Utils;
            const nActionBarHeight = nUtils.getDimensionFromInt(activity, 16843499);
            if (nActionBarHeight > 0) {
                actionBarHeight.set(nActionBarHeight);
            }
            const resources = Utils.android.getApplicationContext().getResources();
            const id = resources.getIdentifier('config_showNavigationBar', 'bool', 'android');
            let resourceId = resources.getIdentifier('navigation_bar_height', 'dimen', 'android');
            if (id > 0 && resourceId > 0 && (resources.getBoolean(id) || (!PRODUCTION && isSimulator()))) {
                navigationBarHeight.set(Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId)));
            }
            resourceId = resources.getIdentifier('status_bar_height', 'dimen', 'android');
            if (id > 0 && resourceId > 0) {
                innerStatusBarHeight = Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId));
                statusBarHeight.set(innerStatusBarHeight);
            }
            globalMarginTop = innerStatusBarHeight;
        }
        // DEV_LOG && console.log('initRootView', get(navigationBarHeight), get(statusBarHeight), get(actionBarHeight), get(actionBarButtonHeight), get(fonts));
        Application.off('initRootView', onInitRootView);
        DEV_LOG && console.log('initRootView');
        // getRealThemeAndUpdateColors();
    }, 0);
};
Application.on('initRootView', onInitRootView);

export function updateThemeColors(theme: string, force = false) {
    try {
        if (!force) {
            theme = Application.systemAppearance();
            console.log('systemAppearance', theme);
        }
    } catch (err) {
        console.error('updateThemeColors', err);
    }

    if (__ANDROID__) {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        const nUtils = com.akylas.documentscanner.Utils;
        const activity = Application.android.startActivity;
        const currentColors = get(colors);
        Object.keys(currentColors).forEach((c) => {
            if (c.endsWith('Disabled')) {
                return;
            }
            if (c === 'colorBackground') {
                currentColors.colorBackground = new Color(nUtils.getColorFromInt(activity, 16842801)).hex;
            } else if (c === 'popupMenuBackground') {
                currentColors.popupMenuBackground = new Color(nUtils.getColorFromInt(activity, 16843126)).hex;
            } else {
                currentColors[c] = new Color(nUtils.getColorFromName(activity, c)).hex;
            }
            rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
        });
        currentColors.colorOnSurfaceDisabled = new Color(currentColors.colorOnSurface).setAlpha(50).hex;
        rootViewStyle?.setUnscopedCssVariable('--colorOnSurfaceDisabled', currentColors.colorOnSurfaceDisabled);
        console.log('colors', currentColors.colorSurfaceContainerHigh, currentColors);
        colors.set(currentColors);
        rootView?._onCssStateChange();
    } else {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        const currentColors = get(colors);
        if (theme === 'dark') {
            currentColors.colorBackground = '#1c1c1e';
            currentColors.colorOnSurface = 'white';
            currentColors.colorOutline = '#cccccc55';
            currentColors.colorOnSurfaceVariant = '#aaaaaa';
            currentColors.colorSurfaceContainer = '#000000aa';
        } else {
            currentColors.colorBackground = '#1c1c1e';
            currentColors.colorOnSurface = 'black';
            currentColors.colorOutline = '#cccccc55';
            currentColors.colorOnSurfaceVariant = '#888888';
            currentColors.colorSurfaceContainer = '#ffffff';
        }
        currentColors.colorOnSurfaceDisabled = new Color(currentColors.colorOnSurface).setAlpha(50).hex;
        Object.keys(currentColors).forEach((c) => {
            rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
        });

        colors.set(currentColors);
        rootView?._onCssStateChange();
    }
}
