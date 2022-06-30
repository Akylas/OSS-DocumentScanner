import { isSimulator } from '@nativescript-community/extendedinfo';
import { Application, Color, Observable, Screen, Utils } from '@nativescript/core';
import { ad } from '@nativescript/core/utils/utils';
import { writable } from 'svelte/store';
import CSSModule from '~/variables.module.scss';
import { get_current_component } from 'svelte/internal';
const locals = CSSModule.locals;

export const globalObservable = new Observable();

const callbacks = {};

export function createGlobalEventListener(eventName: string) {
    return function (callback: Function) {
        callbacks[eventName] = callbacks[eventName] || {};
        const eventCallack = (event) => {
            if (Array.isArray(event.data)) {
                event.result = callback(...event.data);
            } else {
                event.result = callback(event.data);
            }
        };
        callbacks[eventName][callback] = eventCallack;
        globalObservable.on(eventName, eventCallack);
        const component = get_current_component();
        if (component) {
            component.$$.on_destroy.push(() => {
                delete callbacks[eventName][callback];
                globalObservable.off(eventName, eventCallack);
            });
        }
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

export const primaryColor = new Color(locals.primaryColor);
export const accentColor = new Color(locals.accentColor);
export const darkColor = new Color(locals.darkColor);
export const textColorDark = locals.textColorDark;
export const textColorLight = locals.textColorLight;
export const backgroundColor = new Color(locals.backgroundColor);
export const mdiFontFamily: string = locals.mdiFontFamily;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const statusBarHeight: number = parseFloat(locals.statusBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export const navigationBarHeight = writable(parseFloat(locals.navigationBarHeight));

export let globalMarginTop = 0;

if (__ANDROID__) {
    const resources = (ad.getApplicationContext() as android.content.Context).getResources();
    const id = resources.getIdentifier('config_showNavigationBar', 'bool', 'android');
    const resourceId = resources.getIdentifier('navigation_bar_height', 'dimen', 'android');
    // wont work on emulator though!
    if (id > 0 && resourceId > 0 && (resources.getBoolean(id) || (!PRODUCTION && isSimulator()))) {
        navigationBarHeight.set(Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId)));
        // navigationBarHeight/ = Utils.layout.toDeviceIndependentPixels(48);
    }
    globalMarginTop = statusBarHeight;
} else {
    const onAppLaunch = function () {
        navigationBarHeight.set(Application.ios.window.safeAreaInsets.bottom);
        console.log('navigationBarHeight', Application.ios.window.safeAreaInsets.bottomonBarHeight);
        Application.off(Application.launchEvent, onAppLaunch);
    };
    Application.on(Application.launchEvent, onAppLaunch);
}

export const textColor = writable('');
export const borderColor = writable('');
export const textLightColor = writable('');

export const subtitleColor = writable('');
export const iconColor = writable('');
export const widgetBackgroundColor = writable('');

export function updateThemeColors(theme: string, force = false) {
    try {
        if (!force) {
            theme = Application.systemAppearance();
            // console.log('systemAppearance', theme);
        }
    } catch (err) {
        console.error('updateThemeColors', err);
    }
    // currentTheme.set(theme);
    if (theme === 'dark') {
        textColor.set(textColorDark);
        textLightColor.set('#aaaaaa');
        borderColor.set('#cccccc55');
        subtitleColor.set('#aaaaaa');
        iconColor.set('#aaaaaa');
        widgetBackgroundColor.set('#000000aa');
    } else {
        textColor.set(textColorLight);
        textLightColor.set('#444444');
        borderColor.set('#cccccc55');
        subtitleColor.set('#888888');
        iconColor.set('#444444');
        widgetBackgroundColor.set('#ffffff');
    }
}
