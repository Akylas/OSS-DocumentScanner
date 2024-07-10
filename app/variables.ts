import { themer } from '@nativescript-community/ui-material-core';
import { Application, Color, Screen, Utils } from '@nativescript/core';
import { getCurrentFontScale } from '@nativescript/core/accessibility/font-scale';
import { get, writable } from 'svelte/store';
import { getRealTheme, theme } from './helpers/theme';
import { SDK_VERSION } from '@nativescript/core/utils';
import { deviceHasCamera } from '@nativescript-community/ui-cameraview';

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
export const windowInset = writable({ top: 0, left: 0, right: 0, bottom: 0 });
export const actionBarButtonHeight = writable(0);
export const actionBarHeight = writable(0);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export const screenRatio = screenWidthDips / screenHeightDips;

export const fontScale = writable(1);
export const isRTL = writable(false);
export const hasCamera = writable(true);

function updateSystemFontScale(value) {
    fontScale.set(value);
}

const onInitRootView = function () {
    // we need a timeout to read rootView css variable. not 100% sure why yet
    if (__ANDROID__) {
        // setTimeout(() => {
        const rootView = Application.getRootView();
        if (rootView) {
            (rootView.nativeViewProtected as android.view.View).setOnApplyWindowInsetsListener(
                new android.view.View.OnApplyWindowInsetsListener({
                    onApplyWindowInsets(view, insets) {
                        if (SDK_VERSION >= 29) {
                            const inset = insets.getSystemWindowInsets();
                            windowInset.set({
                                top: Utils.layout.toDeviceIndependentPixels(inset.top),
                                bottom: Utils.layout.toDeviceIndependentPixels(inset.bottom),
                                left: Utils.layout.toDeviceIndependentPixels(inset.left),
                                right: Utils.layout.toDeviceIndependentPixels(inset.right)
                            });
                        } else {
                            windowInset.set({
                                top: Utils.layout.toDeviceIndependentPixels(insets.getSystemWindowInsetTop()),
                                bottom: Utils.layout.toDeviceIndependentPixels(insets.getSystemWindowInsetBottom()),
                                left: Utils.layout.toDeviceIndependentPixels(insets.getSystemWindowInsetLeft()),
                                right: Utils.layout.toDeviceIndependentPixels(insets.getSystemWindowInsetRight())
                            });
                        }
                        return insets;
                    }
                })
            );
        }
        const rootViewStyle = rootView?.style;
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        const context = Utils.android.getApplicationContext();
        const nUtils = com.akylas.documentscanner.Utils.Companion;
        hasCamera.set(deviceHasCamera());
        DEV_LOG && console.log('hasCamera', get(hasCamera));

        const resources = Utils.android.getApplicationContext().getResources();
        updateSystemFontScale(resources.getConfiguration().fontScale);
        isRTL.set(resources.getConfiguration().getLayoutDirection() === 1);

        // ActionBar
        // resourceId = resources.getIdentifier('status_bar_height', 'dimen', 'android');
        let nActionBarHeight = Utils.layout.toDeviceIndependentPixels(nUtils.getDimensionFromInt(context, 16843499 /* actionBarSize */));
        // let nActionBarHeight = 0;
        // if (resourceId > 0) {
        //     nActionBarHeight = Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId));
        // }
        if (nActionBarHeight > 0) {
            actionBarHeight.set(nActionBarHeight);
            rootViewStyle?.setUnscopedCssVariable('--actionBarHeight', nActionBarHeight + '');
        } else {
            nActionBarHeight = parseFloat(rootViewStyle.getCssVariable('--actionBarHeight'));
            actionBarHeight.set(nActionBarHeight);
        }
        const nActionBarButtonHeight = nActionBarHeight - 10;
        actionBarButtonHeight.set(nActionBarButtonHeight);
        rootViewStyle?.setUnscopedCssVariable('--actionBarButtonHeight', nActionBarButtonHeight + '');
        DEV_LOG && console.log('actionBarHeight', nActionBarHeight);
        // }, 0);
    }

    if (__IOS__) {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
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
        if (CARD_APP) {
            if (theme === 'dark' || theme === 'black') {
                currentColors.colorPrimary = '#FFB2B9';
                currentColors.colorOnPrimary = '#67001F';
                currentColors.colorPrimaryContainer = '#91002F';
                currentColors.colorOnPrimaryContainer = '#FFDADC';
                currentColors.colorSecondary = '#E5BDBF';
                currentColors.colorOnSecondary = '#44292C';
                currentColors.colorSecondaryContainer = '#5C3F42';
                currentColors.colorOnSecondaryContainer = '#FFDADC';
                currentColors.colorBackground = '#201A1A';
                currentColors.colorOnBackground = '#ECE0E0';
                currentColors.colorSurface = '#201A1A';
                currentColors.colorOnSurface = '#ECE0E0';
                currentColors.colorSurfaceInverse = '#ECE0E0';
                currentColors.colorOnSurfaceInverse = '#201A1A';
                currentColors.colorOutline = '#9F8C8D';
                currentColors.colorSurfaceVariant = '#524344';
                currentColors.colorOnSurfaceVariant = '#D7C1C2';
                currentColors.colorSurfaceContainer = '#121411';
                currentColors.colorError = '#FFB4AB';
                currentColors.colorOnError = '#690005';
            } else {
                currentColors.colorPrimary = '#B61E44';
                currentColors.colorOnPrimary = '#FFFFFF';
                currentColors.colorPrimaryContainer = '#FFDADC';
                currentColors.colorOnPrimaryContainer = '#400010';
                currentColors.colorSecondary = '#765659';
                currentColors.colorOnSecondary = '#FFFFFF';
                currentColors.colorSecondaryContainer = '#FFDADC';
                currentColors.colorOnSecondaryContainer = '#2C1517';
                currentColors.colorBackground = '#FFFBFF';
                currentColors.colorOnBackground = '#201A1A';
                currentColors.colorSurface = '#FFFBFF';
                currentColors.colorOnSurface = '#201A1A';
                currentColors.colorSurfaceInverse = '#201A1A';
                currentColors.colorOnSurfaceInverse = '#FFFBFF';
                currentColors.colorOutline = '#857374';
                currentColors.colorSurfaceVariant = '#F4DDDE';
                currentColors.colorOnSurfaceVariant = '#524344';
                currentColors.colorSurfaceContainer = '#DEE5D9';
                currentColors.colorError = '#BA1A1A';
                currentColors.colorOnError = '#FFFFFF';
            }
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
