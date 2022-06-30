import { Device } from '@nativescript/core/platform';
import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { startSentry } from '~/utils/sentry';

import { installMixins as installUIMixins } from '@nativescript-community/systemui';
// import { install as installGestures } from '@nativescript-community/gesturehandler';

import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';

import { android as androidApp, ios as iosApp, on as onApp } from '@nativescript/core/application';
import { getString } from '@nativescript/core/application-settings';
import Theme from '@nativescript/theme';
import { prefs } from '~/services/preferences';
import { Label } from '@nativescript-community/ui-label';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { svelteNative } from 'svelte-native';
import { ScrollView } from '@nativescript/core';
import { documentsService } from './services/documents';
import App from './components/App.svelte';

// installGestures(true);
installMixins();
installBottomSheets();
installUIMixins();
overrideSpanAndFormattedString();

class NestedScrollView extends ScrollView {
    createNativeView() {
        if (__ANDROID__) {
            return new androidx.core.widget.NestedScrollView(this._context);
        }
        return super.createNativeView();
    }
}

registerNativeViewElement('AbsoluteLayout', () => require('@nativescript/core').AbsoluteLayout);
registerElement('Frame', () => new FrameElement());
registerElement('Page', () => new PageElement());
registerNativeViewElement('GridLayout', () => require('@nativescript/core').GridLayout);
registerNativeViewElement('ScrollView', () => NestedScrollView as any);
registerNativeViewElement('StackLayout', () => require('@nativescript/core').StackLayout);
registerNativeViewElement('flexlayout', () => require('@nativescript/core').FlexboxLayout);
registerNativeViewElement('Switch', () => require('@nativescript/core').Switch);
registerNativeViewElement('TextField', () => require('@nativescript/core').TextField);
registerNativeViewElement('Span', () => require('@nativescript/core').Span);

registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
registerNativeViewElement('mdslider', () => require('@nativescript-community/ui-material-slider').Slider);
registerNativeViewElement('tabs', () => require('@nativescript-community/ui-material-tabs').Tabs);
registerNativeViewElement('tabStrip', () => require('@nativescript-community/ui-material-tabs').TabStrip);
registerNativeViewElement('tabStripItem', () => require('@nativescript-community/ui-material-tabs').TabStripItem);
registerNativeViewElement('tabContentItem', () => require('@nativescript-community/ui-material-tabs').TabContentItem);
registerNativeViewElement('label', () => Label);
registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img);
// registerNativeViewElement('pullrefresh', () => require('nativescript-akylas-pulltorefresh').PullToRefresh);
registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
// registerNativeViewElement('line', () => require('nativescript-canvas/shapes/line').default);
registerNativeViewElement('canvaslabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
registerNativeViewElement('cspan', () => require('@nativescript-community/ui-canvaslabel').Span);
registerNativeViewElement('cgroup', () => require('@nativescript-community/ui-canvaslabel').Group);
registerNativeViewElement('cameraView', () => require('nativescript-cameraview').CameraView);
// registerNativeViewElement('settingLabelIcon', () => require('./SettingLabelIcon.svelte').default);

PagerElement.register();
CollectionViewElement.register();
startSentry();

// import {Trace} from '@nativescript/core';
// import {CollectionViewTraceCategory} from '@nativescript-community/ui-collectionview';
// Trace.addCategories(CollectionViewTraceCategory);
// Trace.enable();

type Themes = 'auto' | 'light' | 'dark' | 'black';
const ThemeBlack = 'ns-black';

function applyTheme(theme: Themes) {
    const AppCompatDelegate = global.isAndroid ? androidx.appcompat.app.AppCompatDelegate : undefined;
    const window = global.isIOS ? iosApp.window : undefined;
    console.log('applyTheme', theme);
    switch (theme) {
        case 'auto':
            Theme.setMode(Theme.Auto);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Unspecified;
            }
            break;
        case 'light':
            Theme.setMode(Theme.Light);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Light;
            }
            break;
        case 'dark':
            Theme.setMode(Theme.Dark);
            if (global.isAndroid) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            } else {
                window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
            }
            break;
        case 'black':
            Theme.setMode(ThemeBlack);
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
        theme = getString('theme', 'light') as Themes;
    } else {
        theme = 'light';
    }
} else {
    theme = getString('theme', 'light') as Themes;
}

// on startup we need to say what we are using
console.log('applying app theme', theme);

// switchTorch();
let launched = false;

async function start() {
    try {
        await documentsService.start();
        applyTheme(theme);
    } catch (error) {
        console.error('start', error, error.stack);
    }
}
onApp('launch', () => {
    launched = true;
    start();
});
onApp('resume', () => {
    if (!launched) {
        launched = true;
        start();
    }
});
onApp('exit', () => {
    launched = false;
    documentsService.stop();
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

if (global.isIOS) {
    const variables = require('~/variables');
    const primaryColor = variables.primaryColor;
    themer.setPrimaryColor(primaryColor);
    themer.setAccentColor(primaryColor);
}

svelteNative(App, {});
