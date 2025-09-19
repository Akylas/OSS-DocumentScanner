import { AppUtilsAndroid } from '@akylas/nativescript-app-utils';
import { deviceHasCamera } from '@nativescript-community/ui-cameraview';
import { themer } from '@nativescript-community/ui-material-core';
import { Application, ApplicationSettings, Color, Frame, InitRootViewEventData, OrientationChangedEventData, Page, Screen, Utils } from '@nativescript/core';
import { getCurrentFontScale } from '@nativescript/core/accessibility/font-scale';
import { createGlobalEventListener, globalObservable } from '@shared/utils/svelte/ui';
import { get, writable } from 'svelte/store';
import { ColorThemes, getRealTheme, theme, useDynamicColors } from './helpers/theme';
import { prefs } from './services/preferences';
import { DEFAULT_COLOR_THEME, DEFAULT_DRAW_FOLDERS_BACKGROUND, SETTINGS_COLOR_THEME, SETTINGS_DRAW_FOLDERS_BACKGROUND, SETTINGS_START_ON_CAM } from './utils/constants';

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
let startOrientation;

let startingInLandscape;
export let screenHeightDips = startingInLandscape ? Screen.mainScreen.widthDIPs : Screen.mainScreen.heightDIPs;
export let screenWidthDips = startingInLandscape ? Screen.mainScreen.heightDIPs : Screen.mainScreen.widthDIPs;
export let screenRatio = screenWidthDips / screenHeightDips;

function updateStartOrientation() {
    startOrientation = Application.orientation();
    startingInLandscape = startOrientation === 'landscape';
    orientation.set(startOrientation);
    isLandscape.set(startingInLandscape);
    screenHeightDips = startingInLandscape ? Screen.mainScreen.widthDIPs : Screen.mainScreen.heightDIPs;
    screenWidthDips = startingInLandscape ? Screen.mainScreen.heightDIPs : Screen.mainScreen.widthDIPs;
    screenRatio = screenWidthDips / screenHeightDips;
}
Application.on(Application.launchEvent, updateStartOrientation);
export const startOnCam = ApplicationSettings.getBoolean(SETTINGS_START_ON_CAM, START_ON_CAM);

export const fontScale = writable(1);
export const isRTL = writable(false);
export const hasCamera = writable(true);

export const orientation = writable('portrait');
export const orientationDegrees = writable(0);
export const shouldListenForSensorOrientation = writable(false);
export const isLandscape = writable(false);

export const folderBackgroundColor = writable(DEFAULT_DRAW_FOLDERS_BACKGROUND);
prefs.on(`key:${SETTINGS_DRAW_FOLDERS_BACKGROUND}`, () => {
    const newValue = ApplicationSettings.getBoolean(SETTINGS_DRAW_FOLDERS_BACKGROUND, DEFAULT_DRAW_FOLDERS_BACKGROUND);
    folderBackgroundColor.set(newValue);
    globalObservable.notify({ eventName: SETTINGS_DRAW_FOLDERS_BACKGROUND, data: newValue });
});
export const onFolderBackgroundColorChanged = createGlobalEventListener(SETTINGS_DRAW_FOLDERS_BACKGROUND);

function updateSystemFontScale(value) {
    DEV_LOG && console.log('updating font scale svelte store', value, get(fontScale));
    fontScale.set(value);
}
Application.on('orientationChanged', (event: OrientationChangedEventData) => {
    const newOrientation = event.newValue;
    DEV_LOG && console.log('orientationChanged', event.newValue, event.degrees);
    orientation.set(newOrientation);
    orientationDegrees.set(event.degrees ?? 0);
    isLandscape.set(newOrientation === 'landscape');
});

if (__ANDROID__) {
    @NativeClass
    class MyOrientationEventListener extends android.view.OrientationEventListener {
        constructor(context) {
            super(context);

            return global.__native(this);
        }
        public onOrientationChanged(orientation: number): void {
            if (orientation === -1) {
                orientationDegrees.set(0);
            }
            // Roughly determine landscape/portrait
            if (orientation >= 60 && orientation <= 120) {
                orientationDegrees.set(90);
            } else if (orientation >= 120 && orientation <= 240) {
                orientationDegrees.set(180);
            } else if (orientation >= 240 && orientation <= 300) {
                orientationDegrees.set(270);
            } else {
                orientationDegrees.set(0);
            }
        }
    }
    const orientationListener = new MyOrientationEventListener(Utils.android.getApplicationContext());
    // @Override
    // public void onOrientationChanged(int orientation) {

    shouldListenForSensorOrientation.subscribe((enabled) => {
        if (enabled) {
            orientationListener.enable();
        }
    });
    Application.android.on(Application.android.activityCreateEvent, (event) => {
        DEV_LOG && console.log('activityCreateEvent', useDynamicColors);
        AppUtilsAndroid.prepareActivity(event.activity, useDynamicColors);
    });
    Application.android.on(Application.android.activityResumedEvent, (event) => {
        DEV_LOG && console.log('activityResumedEvent', useDynamicColors);
        if (get(shouldListenForSensorOrientation)) {
            orientationListener.enable();
        }
    });
    Application.android.on(Application.android.activityPausedEvent, (event) => {
        DEV_LOG && console.log('activityPausedEvent', useDynamicColors);
        orientationListener.disable();
    });
    Page.on('shownModally', function (event) {
        AppUtilsAndroid.prepareWindow(event.object['_dialogFragment'].getDialog().getWindow());
    });
    Frame.on('shownModally', function (event) {
        AppUtilsAndroid.prepareWindow(event.object['_dialogFragment'].getDialog().getWindow());
    });
}

function updateRootCss() {
    let rootView = Application.getRootView();
    if (rootView?.parent) {
        rootView = rootView.parent as any;
    }
    rootView?._onCssStateChange();
    const rootModalViews = rootView?._getRootModalViews();
    rootModalViews.forEach((rootModalView) => rootModalView._onCssStateChange());
}
const onInitRootView = function (event: InitRootViewEventData) {
    // we need a timeout to read rootView css variable. not 100% sure why yet
    if (__ANDROID__) {
        // setTimeout(() => {
        const rootView = event.rootView || Application.getRootView();
        if (!rootView) {
            return;
        }
        const rootViewStyle = rootView.style;
        if (!rootViewStyle) {
            return;
        }
        AppUtilsAndroid.listenForWindowInsets((inset) => {
            const newInset = {
                top: Utils.layout.toDeviceIndependentPixels(inset[0]),
                bottom: Utils.layout.toDeviceIndependentPixels(Math.max(inset[1], inset[4])),
                left: Utils.layout.toDeviceIndependentPixels(inset[2]),
                right: Utils.layout.toDeviceIndependentPixels(inset[3])
            };
            windowInset.set(newInset);
            rootViewStyle.setUnscopedCssVariable('--windowInsetLeft', newInset.left + '');
            rootViewStyle.setUnscopedCssVariable('--windowInsetRight', newInset.right + '');
            // DEV_LOG && console.log('rootViewStyle changed windowInset', JSON.stringify(newInset), rootView);
            updateRootCss();
        });
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
        const context = Utils.android.getApplicationContext();
        hasCamera.set(deviceHasCamera());
        DEV_LOG && console.log('hasCamera', get(hasCamera));

        const resources = Utils.android.getApplicationContext().getResources();
        updateSystemFontScale(resources.getConfiguration().fontScale);
        isRTL.set(resources.getConfiguration().getLayoutDirection() === 1);

        let nActionBarHeight = Utils.layout.toDeviceIndependentPixels(AppUtilsAndroid.getDimensionFromInt(context, 16843499 /* actionBarSize */));
        // let nActionBarHeight = 0;
        // if (resourceId > 0) {
        //     nActionBarHeight = Utils.layout.toDeviceIndependentPixels(resources.getDimensionPixelSize(resourceId));
        // }
        if (nActionBarHeight > 0) {
            actionBarHeight.set(nActionBarHeight);
            rootViewStyle.setUnscopedCssVariable('--actionBarHeight', nActionBarHeight + '');
        } else {
            nActionBarHeight = parseFloat(rootViewStyle.getCssVariable('--actionBarHeight'));
            actionBarHeight.set(nActionBarHeight);
        }
        const nActionBarButtonHeight = nActionBarHeight - 10;
        actionBarButtonHeight.set(nActionBarButtonHeight);
        rootViewStyle.setUnscopedCssVariable('--actionBarButtonHeight', nActionBarButtonHeight + '');
        // }, 0);
    }

    if (__IOS__) {
        const rootView = Application.getRootView();
        const rootViewStyle = rootView?.style;
        fonts.set({ mdi: rootViewStyle.getCssVariable('--mdiFontFamily') });

        const safeAreaInsets = UIApplication.sharedApplication.keyWindow?.safeAreaInsets;
        // DEV_LOG && console.log('safeAreaInsets', safeAreaInsets.top, safeAreaInsets.right, safeAreaInsets.bottom, safeAreaInsets.left);
        if (safeAreaInsets) {
            windowInset.set({
                left: Math.round(safeAreaInsets.left),
                top: 0,
                right: Math.round(safeAreaInsets.right),
                bottom: 0
            });
        }
        Application.on('orientationChanged', () => {
            const safeAreaInsets = UIApplication.sharedApplication.keyWindow.safeAreaInsets;
            // DEV_LOG && console.log('safeAreaInsets', safeAreaInsets.top, safeAreaInsets.right, safeAreaInsets.bottom, safeAreaInsets.left);
            windowInset.set({
                left: Math.round(safeAreaInsets.left),
                top: 0,
                // top: Math.round(safeAreaInsets.top),
                right: Math.round(safeAreaInsets.right),
                // bottom: Math.round(safeAreaInsets.bottom)
                bottom: 0
            });
        });

        const currentColors = get(colors);
        Object.keys(currentColors).forEach((c) => {
            currentColors[c] = rootViewStyle.getCssVariable('--' + c);
        });
        colors.set(currentColors);
        updateSystemFontScale(getCurrentFontScale());
        actionBarHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarHeight')));
        actionBarButtonHeight.set(parseFloat(rootViewStyle.getCssVariable('--actionBarButtonHeight')));
    }
    Application.on(Application.fontScaleChangedEvent, (event) => updateSystemFontScale(event.newValue));
    updateThemeColors(getRealTheme(theme));
    // DEV_LOG && console.log('initRootView', get(navigationBarHeight), get(statusBarHeight), get(actionBarHeight), get(actionBarButtonHeight), get(fonts));
    Application.off(Application.initRootViewEvent, onInitRootView);
    // getRealThemeAndUpdateColors();
};
Application.on(Application.initRootViewEvent, onInitRootView);
if (__ANDROID__) {
    Application.android.on(Application.android.activityStartedEvent, () => {
        const resources = Utils.android.getApplicationContext().getResources();
        isRTL.set(resources.getConfiguration().getLayoutDirection() === 1);
    });
}

export function updateThemeColors(theme: string, colorTheme: ColorThemes = ApplicationSettings.getString(SETTINGS_COLOR_THEME, DEFAULT_COLOR_THEME) as ColorThemes) {
    const currentColors = get(colors);
    let rootView = Application.getRootView();
    if (rootView?.parent) {
        rootView = rootView.parent as any;
    }
    DEV_LOG && console.log('updateThemeColors', theme, colorTheme, rootView);
    const rootViewStyle = rootView?.style;
    if (!rootViewStyle) {
        return;
    }
    // rootViewStyle?.setUnscopedCssVariable('--fontScale', fontScale + '');
    if (__ANDROID__) {
        const activity = Application.android.startActivity;
        // we also update system font scale so that our UI updates correcly
        fontScale.set(Utils.android.getApplicationContext().getResources().getConfiguration().fontScale);
        Object.keys(currentColors).forEach((c) => {
            if (c.endsWith('Disabled')) {
                return;
            }
            if (c === 'colorBackground') {
                currentColors.colorBackground = new Color(AppUtilsAndroid.getColorFromInt(activity, 16842801)).hex;
            } else if (c === 'popupMenuBackground') {
                currentColors.popupMenuBackground = new Color(AppUtilsAndroid.getColorFromInt(activity, 16843126)).hex;
            } else {
                currentColors[c] = new Color(AppUtilsAndroid.getColorFromName(activity, c)).hex;
            }
        });
    } else {
        const themeColors = require(`~/themes/${__APP_ID__}/${colorTheme}.json`);
        Object.assign(currentColors, theme === 'dark' || theme === 'black' ? themeColors.dark : themeColors.light);

        themer.setPrimaryColor(currentColors.colorPrimary);
        themer.setOnPrimaryColor(currentColors.colorOnPrimary);
        themer.setAccentColor(currentColors.colorPrimary);
        themer.setSecondaryColor(currentColors.colorSecondary);
        themer.setSurfaceColor(currentColors.colorSurface);
        themer.setOnSurfaceColor(currentColors.colorOnSurface);
    }
    if (theme === 'black') {
        currentColors.colorBackground = '#000000';
        currentColors.colorSurfaceContainer = '#000000';
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
    updateRootCss();
}
