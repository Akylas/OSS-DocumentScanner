import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { startSentry } from '~/utils/sentry';

import { installMixins as installUIMixins } from '@nativescript-community/systemui';
// import { install as installGestures } from '@nativescript-community/gesturehandler';

import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';

import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import { installMixins as installColorFilters } from '@nativescript-community/ui-image-colorfilter';
import { Label } from '@nativescript-community/ui-label';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import { Application, ApplicationSettings, SharedTransition } from '@nativescript/core';
import { svelteNative } from 'svelte-native';
import { start as startThemeHelper } from '~/helpers/theme';
import { documentsService } from './services/documents';
import { primaryColor } from './variables';
import { ImageViewTraceCategory, initialize } from '@nativescript-community/ui-image';
import { CropView } from './CropView';
import { NestedScrollView } from './NestedScrollView';
import { request } from '@nativescript-community/perms';
import { Pager } from '@nativescript-community/ui-pager';

import ZoomOutTransformer from '~/transformers/ZoomOutTransformer';

Pager.registerTransformer('zoomOut', ZoomOutTransformer);
// installGestures(true);
installMixins();
installColorFilters();
installBottomSheets();
installUIMixins();
overrideSpanAndFormattedString();

registerNativeViewElement('cropview', () => CropView);
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
// registerNativeViewElement('image', () => require('@nativescript/core').Image);
registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img);
registerNativeViewElement('zoomimage', () => require('@nativescript-community/ui-zoomimage').ZoomImg);
// registerNativeViewElement('pullrefresh', () => require('nativescript-akylas-pulltorefresh').PullToRefresh);
registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
// registerNativeViewElement('line', () => require('nativescript-canvas/shapes/line').default);
registerNativeViewElement('canvaslabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
registerNativeViewElement('cspan', () => require('@nativescript-community/ui-canvaslabel').Span);
registerNativeViewElement('cgroup', () => require('@nativescript-community/ui-canvaslabel').Group);
registerNativeViewElement('cameraView', () => require('@nativescript-community/ui-cameraview').CameraView);
// registerNativeViewElement('settingLabelIcon', () => require('./SettingLabelIcon.svelte').default);

PagerElement.register();
CollectionViewElement.register();
startSentry();
initialize();
// import { Trace } from '@nativescript/core';
// import { CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';
// Trace.addCategories(Trace.categories.NativeLifecycle);
// Trace.addCategories(CollectionViewTraceCategory)
// Trace.addCategories(ImageViewTraceCategory)
// Trace.enable();

let launched = false;
async function start() {
    try {
        await documentsService.start();
    } catch (error) {
        console.error('start', error, error.stack);
    }
}
Application.on('launch', () => {
    console.log('launch');
    launched = true;
    start();
});
Application.on('resume', () => {
    console.log('resume');
    if (!launched) {
        launched = true;
        start();
    }
});
Application.on('exit', () => {
    console.log('exit');
    launched = false;
    documentsService.stop();
});
startThemeHelper();

if (__IOS__) {
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
const startOnCam = START_ON_CAM; /* ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) */
console.log('test starting app', startOnCam);
if (startOnCam) {
    Comp = await import('~/components/Camera.svelte');
} else {
    Comp = await import('~/components/DocumentsList.svelte');
}
svelteNative(Comp.default, {});
