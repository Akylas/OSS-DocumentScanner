import { Device } from '@nativescript/core/platform';
import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { startSentry } from '~/utils/sentry';

import { installMixins as installUIMixins } from '@nativescript-community/systemui';
// import { install as installGestures } from '@nativescript-community/gesturehandler';

import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';

import { android as androidApp, ios as iosApp, on as onApp } from '@nativescript/core/application';
import { getString } from '@nativescript/core/application-settings';
import { prefs } from '~/services/preferences';
import { Label } from '@nativescript-community/ui-label';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { installMixins as installColorFilters } from '@nativescript-community/ui-image-colorfilter';
import { svelteNative } from 'svelte-native';
import { ApplicationSettings, ScrollView } from '@nativescript/core';
import { documentsService } from './services/documents';
import { primaryColor } from './variables';
import { start as startThemeHelper } from '~/helpers/theme';
console.log('test starting')

// installGestures(true);
installMixins();
installColorFilters();
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

registerNativeViewElement('slider', () => require('@nativescript-community/ui-material-slider').Slider, null, {}, { override: true });
registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
registerNativeViewElement('tabs', () => require('@nativescript-community/ui-material-tabs').Tabs);
registerNativeViewElement('tabStrip', () => require('@nativescript-community/ui-material-tabs').TabStrip);
registerNativeViewElement('tabStripItem', () => require('@nativescript-community/ui-material-tabs').TabStripItem);
registerNativeViewElement('tabContentItem', () => require('@nativescript-community/ui-material-tabs').TabContentItem);
registerNativeViewElement('label', () => Label);
registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img);
registerNativeViewElement('zoomimage', () => require('@nativescript-community/ui-zoomimage').ZoomImg);
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

// import { Trace } from '@nativescript/core';
// Trace.addCategories(Trace.categories.All);
// Trace.enable();

// switchTorch();
let launched = false;

async function start() {
    try {
        await documentsService.start();
    } catch (error) {
        console.error('start', error, error.stack);
    }
}
onApp('launch', () => {
    console.log('launch');
    launched = true;
    start();
});
onApp('resume', () => {
    console.log('resume');
    if (!launched) {
        launched = true;
        start();
    }
});
onApp('exit', () => {
    console.log('exit');
    launched = false;
    documentsService.stop();
});
startThemeHelper();

if (global.isIOS) {
    themer.setPrimaryColor(primaryColor);
    themer.setAccentColor(primaryColor);
}

themer.createShape('round', {
    cornerFamily: 'rounded' as any,
    cornerSize: {
        value: 0.5,
        unit: '%'
    }
});
let Comp;
const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);
console.log('test starting app', startOnCam)
if (startOnCam) {
    Comp = await import('~/components/Camera.svelte');
} else {
    Comp = await import('~/components/DocumentsList.svelte');
}
svelteNative(Comp.default, {});
