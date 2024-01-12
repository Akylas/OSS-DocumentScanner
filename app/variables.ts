import { isSimulator } from '@nativescript-community/extendedinfo';
import { Application, Color, Observable, Screen, Utils } from '@nativescript/core';
import { get, writable } from 'svelte/store';
// import CSSModule from '~/variables.module.scss';
import { onDestroy } from 'svelte';
import { getRealTheme, getRealThemeAndUpdateColors, theme } from './helpers/theme';
import { themer } from '@nativescript-community/ui-material-core';
// const locals = CSSModule.locals;

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
    colorSurfaceVariant: '',
    colorOnSurfaceVariant: '',
    colorOnSurfaceVariant2: '',
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
export const systemFontScale = writable(1);

const onInitRootView = function () {
    // we need a timeout to read rootView css variable. not 100% sure why yet
    if (__ANDROID__) {
        // setTimeout(() => {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        // DEV_LOG && console.log('initRootView', rootView);
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        // DEV_LOG && console.log('fonts', get(fonts));
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        const activity = Application.android.startActivity;
        const nUtils = com.akylas.documentscanner.Utils;
        const nActionBarHeight = nUtils.getDimensionFromInt(activity, 16843499);
        if (nActionBarHeight > 0) {
            actionBarHeight.set(Utils.layout.toDeviceIndependentPixels(nActionBarHeight));
        }
        const resources = Utils.android.getApplicationContext().getResources();
        systemFontScale.set(resources.getConfiguration().fontScale);
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
        // }, 0);
    }

    if (__IOS__) {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        DEV_LOG && console.log('initRootView', rootView);
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        // DEV_LOG && console.log('fonts', get(fonts));
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        navigationBarHeight.set(Application.ios.window.safeAreaInsets.bottom);
        updateThemeColors(theme);
    }
    // DEV_LOG && console.log('initRootView', get(navigationBarHeight), get(statusBarHeight), get(actionBarHeight), get(actionBarButtonHeight), get(fonts));
    Application.off('initRootView', onInitRootView);
    // getRealThemeAndUpdateColors();
};
Application.on('initRootView', onInitRootView);

export function updateThemeColors(theme: string) {
    const currentColors = get(colors);
    let rootView = Application.getRootView();
    if (rootView?.parent) {
        rootView = rootView.parent as any;
    }
    const rootViewStyle = rootView?.style;
    if (!rootViewStyle) {
        return;
    }
    // rootViewStyle?.setUnscopedCssVariable('--systemFontScale', systemFontScale + '');
    if (__ANDROID__) {
        const nUtils = com.akylas.documentscanner.Utils;
        const activity = Application.android.startActivity;
        Utils.android.getApplicationContext().getResources();
        // we also update system font scale so that our UI updates correcly
        systemFontScale.set(Utils.android.getApplicationContext().getResources().getConfiguration().fontScale);
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
            // rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
        });
        if (theme === 'dark') {
            currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).lighten(3).hex;
            currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).lighten(6).hex;
        } else {
            currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).darken(3).hex;
            currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).darken(6).hex;
        }
        currentColors.colorOnSurfaceDisabled = new Color(currentColors.colorOnSurface).setAlpha(50).hex;
        Object.keys(currentColors).forEach((c) => {
            rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
        });
    } else {
        Object.keys(currentColors).forEach((c) => {
            currentColors[c] = rootViewStyle.getCssVariable('--' + c);
        });
        if (theme === 'dark' || theme === 'black') {
            currentColors.colorPrimary = '#7DDB82';
            currentColors.colorOnPrimary = '#00390F';
            currentColors.colorPrimaryContainer = '#00531A';
            currentColors.colorOnPrimaryContainer = '#98F89C';
            currentColors.colorSecondary = '#B9CCB4';
            currentColors.colorOnSecondary = '#243424';
            currentColors.colorBackground = '#1A1C19';
            currentColors.colorOnBackground = '#E2E3DD';
            currentColors.colorSurface = '#121411';
            currentColors.colorOnSurface = '#C6C7C1';
            currentColors.colorSurfaceInverse = '#F9FAF4';
            currentColors.colorOnSurfaceInverse = '#121411';
            currentColors.colorOutline = '#8C9388';
            currentColors.colorSurfaceVariant = '#424940';
            currentColors.colorOnSurfaceVariant = '#C2C9BD';
            currentColors.colorSurfaceContainer = '#424940';

            currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).lighten(3).hex;
            currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).lighten(6).hex;
        } else {
            currentColors.colorPrimary = '#006E25';
            currentColors.colorOnPrimary = '#FFFFFF';
            currentColors.colorPrimaryContainer = '#98F89C';
            currentColors.colorOnPrimaryContainer = '#002106';
            currentColors.colorSecondary = '#526350';
            currentColors.colorOnSecondary = '#FFFFFF';
            currentColors.colorBackground = '#FCFDF7';
            currentColors.colorOnBackground = '#1A1C19';
            currentColors.colorSurface = '#F9FAF4';
            currentColors.colorOnSurface = '#1A1C19';
            currentColors.colorSurfaceInverse = '#121411';
            currentColors.colorOnSurfaceInverse = '#C6C7C1';
            currentColors.colorOutline = '#72796F';
            currentColors.colorSurfaceVariant = '#DEE5D9';
            currentColors.colorOnSurfaceVariant = '#424940';
            currentColors.colorSurfaceContainer = '#DEE5D9';

            currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).darken(3).hex;
            currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).darken(6).hex;
        }
        currentColors.colorOnSurfaceDisabled = new Color(currentColors.colorOnSurface).setAlpha(50).hex;
        Object.keys(currentColors).forEach((c) => {
            rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
        });

        themer.setPrimaryColor(currentColors.colorPrimary);
        themer.setOnPrimaryColor(currentColors.colorOnPrimary);
        themer.setAccentColor(currentColors.colorPrimary);
        themer.setSecondaryColor(currentColors.colorSecondary);
        themer.setSurfaceColor(currentColors.colorSurface);
        themer.setOnSurfaceColor(currentColors.colorOnSurface);
    }
    currentColors.colorOnSurfaceVariant2 = new Color(currentColors.colorOnSurfaceVariant).setAlpha(170).hex;
    colors.set(currentColors);
    // DEV_LOG && console.log('changed colors', rootView, JSON.stringify(currentColors));
    rootView?._onCssStateChange();
}
