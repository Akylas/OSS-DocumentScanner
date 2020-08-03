import { registerNativeViewElement } from 'svelte-native/dom';
import { startSentry } from '~/utils/sentry';
import { Device } from '@nativescript/core/platform';

import { installMixins as installUIMixins } from 'nativescript-systemui';
installUIMixins();

import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
installBottomSheets();

import { Label, enableIOSDTCoreText } from 'nativescript-htmllabel';
enableIOSDTCoreText();

registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
registerNativeViewElement('mdslider', () => require('@nativescript-community/ui-material-slider').Slider);
registerNativeViewElement('htmllabel', () => Label);
registerNativeViewElement('nsimg', () => require('@nativescript-community/ui-image').Img);
// registerNativeViewElement('pullrefresh', () => require('nativescript-akylas-pulltorefresh').PullToRefresh);
registerNativeViewElement('canvasView', () => require('nativescript-canvas').CanvasView);
// registerNativeViewElement('line', () => require('nativescript-canvas/shapes/line').default);
registerNativeViewElement('canvaslabel', () => require('nativescript-canvaslabel').CanvasLabel);
registerNativeViewElement('cspan', () => require('nativescript-canvaslabel').Span);
registerNativeViewElement('cgroup', () => require('nativescript-canvaslabel').Group);
registerNativeViewElement('cameraView', () => require('./components/cameraview').CameraView);
// registerNativeViewElement('settingLabelIcon', () => require('./SettingLabelIcon.svelte').default);

import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
CollectionViewElement.register();
startSentry();

// import {addCategories, enable} from '@nativescript/core/trace';
// addCategories(DomTraceCategory);
// enable();

import { prefs } from '~/services/preferences';
import { getString } from '@nativescript/core/application-settings';
// import Theme from '@nativescript/theme';
import { android as androidApp, ios as iosApp, on as onApp, systemAppearance } from '@nativescript/core/application';

type Themes = 'auto' | 'light' | 'dark' | 'black';
const ThemeBlack = 'ns-black';
function applyTheme(theme: Themes) {
    const AppCompatDelegate = global.isAndroid ? androidx.appcompat.app.AppCompatDelegate : undefined;
    const window = global.isIOS ? iosApp.window : undefined;
    console.log('applyTheme', theme);
    switch (theme) {
        case 'auto':
            // Theme.setMode(Theme.Auto);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Unspecified;
            }
            break;
        case 'light':
            // Theme.setMode(Theme.Light);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Light;
            }
            break;
        case 'dark':
            // Theme.setMode(Theme.Dark);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
            }
            break;
        case 'black':
            // Theme.setMode(ThemeBlack);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
            }
            break;
    }
}
let theme: Themes;
if (global.isIOS) {
    const sdkVersion = Device.sdkVersion;
    if (parseFloat(sdkVersion) >= 13) {
        theme = getString('theme', 'dark') as Themes;
    } else {
        theme = 'light';
    }
} else {
    theme = getString('theme', 'dark') as Themes;
}

// on startup we need to say what we are using
console.log('applying app theme', theme);
onApp('launch', () => {
    applyTheme(theme);
});
prefs.on('key:theme', () => {
    const newTheme = getString('theme') as Themes;
    // on pref change we are updating
    if (newTheme === theme) {
        return;
    }
    console.log('theme change', theme, newTheme);
    theme = newTheme;
    applyTheme(newTheme);
    if (global.isAndroid) {
        // we recreate the activity to get the change
        const activity = androidApp.startActivity as androidx.appcompat.app.AppCompatActivity;
        activity.recreate();
    }
});

import { installMixins, themer } from '@nativescript-community/ui-material-core';
installMixins();
if (global.isIOS) {
    const variables = require('~/variables');
    const primaryColor = variables.primaryColor;
    themer.setPrimaryColor(primaryColor);
    themer.setAccentColor(primaryColor);
}

import { svelteNative } from 'svelte-native';
import App from './App.svelte';
svelteNative(App, {});
