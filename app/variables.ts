import { isSimulator } from '@nativescript-community/extendedinfo';
import { themer } from '@nativescript-community/ui-material-core';
import { Application, Color, Screen, Utils } from '@nativescript/core';
import { getCurrentFontScale } from '@nativescript/core/accessibility/font-scale';
import { get, writable } from 'svelte/store';
import { getRealTheme, theme } from './helpers/theme';

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
export const screenRatio = screenWidthDips / screenHeightDips;
export const navigationBarHeight = writable(0);

export let globalMarginTop = 0;
export const fontScale = writable(1);
export const isRTL = writable(false);

function updateSystemFontScale(value) {
    fontScale.set(value);
}

const onInitRootView = function () {
    // we need a timeout to read rootView css variable. not 100% sure why yet
    if (__ANDROID__) {
        // setTimeout(() => {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        const activity = Application.android.startActivity;
        const nUtils = com.akylas.documentscanner.Utils.Companion;
        const nActionBarHeight = nUtils.getDimensionFromInt(activity, 16843499);
        if (nActionBarHeight > 0) {
            actionBarHeight.set(Utils.layout.toDeviceIndependentPixels(nActionBarHeight));
        }
        const resources = Utils.android.getApplicationContext().getResources();
        updateSystemFontScale(resources.getConfiguration().fontScale);
        const id = resources.getIdentifier('config_showNavigationBar', 'bool', 'android');
        let resourceId = resources.getIdentifier('navigation_bar_height', 'dimen', 'android');
        if (id > 0 && resourceId > 0 && (resources.getBoolean(id) || (!PRODUCTION && isSimulator()))) {
            navigationBarHeight.set(Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId)));
        }
        isRTL.set(resources.getConfiguration().getLayoutDirection() === 1);

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

        const currentColors = get(colors);
        Object.keys(currentColors).forEach((c) => {
            currentColors[c] = rootViewStyle.getCssVariable('--' + c);
        });
        colors.set(currentColors);
        updateSystemFontScale(getCurrentFontScale());
        Application.on(Application.fontScaleChangedEvent, (event) => updateSystemFontScale(event.newValue));
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        navigationBarHeight.set(Application.ios.window.safeAreaInsets.bottom);
    }
    updateThemeColors(getRealTheme(theme));
    // DEV_LOG && console.log('initRootView', get(navigationBarHeight), get(statusBarHeight), get(actionBarHeight), get(actionBarButtonHeight), get(fonts));
    Application.off(Application.initRootViewEvent, onInitRootView);
    // getRealThemeAndUpdateColors();
};
Application.on(Application.initRootViewEvent, onInitRootView);
Application.on('activity_started', () => {
    if (__ANDROID__) {
        const resources = Utils.android.getApplicationContext().getResources();
        isRTL.set(resources.getConfiguration().getLayoutDirection() === 1);
    }
});

export function updateThemeColors(theme: string) {
    DEV_LOG && console.log('updateThemeColors', theme);
    const currentColors = get(colors);
    let rootView = Application.getRootView();
    if (rootView?.parent) {
        rootView = rootView.parent as any;
    }
    const rootViewStyle = rootView?.style;
    if (!rootViewStyle) {
        return;
    }
    // rootViewStyle?.setUnscopedCssVariable('--fontScale', fontScale + '');
    if (__ANDROID__) {
        const nUtils = com.akylas.documentscanner.Utils.Companion;
        const activity = Application.android.startActivity;
        // we also update system font scale so that our UI updates correcly
        fontScale.set(Utils.android.getApplicationContext().getResources().getConfiguration().fontScale);
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
        });
    } else {
        if (theme === 'dark' || theme === 'black') {
            currentColors.colorPrimary = '#7DDB82';
            currentColors.colorOnPrimary = '#00390F';
            currentColors.colorPrimaryContainer = '#00531A';
            currentColors.colorOnPrimaryContainer = '#98F89C';
            currentColors.colorSecondary = '#B9CCB4';
            currentColors.colorOnSecondary = '#243424';
            currentColors.colorSecondaryContainer = '#3A4B39';
            currentColors.colorOnSecondaryContainer = '#D5E8D0';
            currentColors.colorBackground = '#1A1C19';
            currentColors.colorOnBackground = '#E2E3DD';
            currentColors.colorSurface = '#121411';
            currentColors.colorOnSurface = '#C6C7C1';
            currentColors.colorSurfaceInverse = '#F9FAF4';
            currentColors.colorOnSurfaceInverse = '#121411';
            currentColors.colorOutline = '#8C9388';
            currentColors.colorSurfaceVariant = '#424940';
            currentColors.colorOnSurfaceVariant = '#C2C9BD';
            currentColors.colorSurfaceContainer = '#121411';
            currentColors.colorError = '#FFB4AB';
            currentColors.colorOnError = '#690005';
        } else {
            currentColors.colorPrimary = '#006E25';
            currentColors.colorOnPrimary = '#FFFFFF';
            currentColors.colorPrimaryContainer = '#98F89C';
            currentColors.colorOnPrimaryContainer = '#002106';
            currentColors.colorSecondary = '#526350';
            currentColors.colorOnSecondary = '#FFFFFF';
            currentColors.colorSecondaryContainer = '#D5E8D0';
            currentColors.colorOnSecondaryContainer = '#101F10';
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
            currentColors.colorError = '#BA1A1A';
            currentColors.colorOnError = '#FFFFFF';
        }

        themer.setPrimaryColor(currentColors.colorPrimary);
        themer.setOnPrimaryColor(currentColors.colorOnPrimary);
        themer.setAccentColor(currentColors.colorPrimary);
        themer.setSecondaryColor(currentColors.colorSecondary);
        themer.setSurfaceColor(currentColors.colorSurface);
        themer.setOnSurfaceColor(currentColors.colorOnSurface);
    }
    if (theme === 'black') {
        currentColors.colorBackground = '#000000';
    }
    if (theme === 'dark') {
        currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).lighten(10).hex;
        currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).lighten(20).hex;
    } else {
        currentColors.colorSurfaceContainerHigh = new Color(currentColors.colorSurfaceContainer).darken(10).hex;
        currentColors.colorSurfaceContainerHighest = new Color(currentColors.colorSurfaceContainer).darken(20).hex;
    }
    currentColors.colorOnSurfaceVariant2 = new Color(currentColors.colorOnSurfaceVariant).setAlpha(170).hex;
    currentColors.colorOnSurfaceDisabled = new Color(currentColors.colorOnSurface).setAlpha(50).hex;
    Object.keys(currentColors).forEach((c) => {
        rootViewStyle?.setUnscopedCssVariable('--' + c, currentColors[c]);
    });
    colors.set(currentColors);
    Application.notify({ eventName: 'colorsChange', colors: currentColors });
    // DEV_LOG && console.log('changed colors', theme, rootView, [...rootView?.cssClasses], theme, JSON.stringify(currentColors));
    rootView?._onCssStateChange();
    const rootModalViews = rootView?._getRootModalViews();
    rootModalViews.forEach((rootModalView) => rootModalView._onCssStateChange());
}
