import { installMixins as installUIMixins } from '@nativescript-community/systemui';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import { ImageViewTraceCategory, initialize } from '@nativescript-community/ui-image';
import { installMixins as installColorFilters } from '@nativescript-community/ui-image-colorfilter';
import { Label } from '@nativescript-community/ui-label';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { Pager } from '@nativescript-community/ui-pager';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import { Application } from '@nativescript/core';
import { svelteNative } from 'svelte-native';
import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { CropView } from '~/CropView';
import { NestedScrollView } from '~/NestedScrollView';
import { start as startThemeHelper } from '~/helpers/theme';
import { documentsService } from '~/services/documents';
import ZoomOutTransformer from '~/transformers/ZoomOutTransformer';
import { startSentry } from '~/utils/sentry';
import { primaryColor } from '~/variables';
import { showError } from './utils/error';
import { syncService } from './services/sync';
import { Trace } from '@nativescript/core';

try {
    Pager.registerTransformer('zoomOut', ZoomOutTransformer);
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
    // registerNativeViewElement('flexlayout', () => require('@nativescript/core').FlexboxLayout);
    registerNativeViewElement('Switch', () => require('@nativescript/core').Switch);
    // registerNativeViewElement('TextField', () => require('@nativescript/core').TextField);
    registerNativeViewElement('Span', () => require('@nativescript/core').Span);

    registerNativeViewElement('slider', () => require('@nativescript-community/ui-material-slider').Slider, null, {}, { override: true });
    registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
    registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
    registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
    // registerNativeViewElement('tabs', () => require('@nativescript-community/ui-material-tabs').Tabs);
    // registerNativeViewElement('tabStrip', () => require('@nativescript-community/ui-material-tabs').TabStrip);
    // registerNativeViewElement('tabStripItem', () => require('@nativescript-community/ui-material-tabs').TabStripItem);
    // registerNativeViewElement('tabContentItem', () => require('@nativescript-community/ui-material-tabs').TabContentItem);
    registerNativeViewElement('label', () => Label);
    // registerNativeViewElement('image', () => require('@nativescript/core').Image);
    registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img);
    registerNativeViewElement('zoomimage', () => require('@nativescript-community/ui-zoomimage').ZoomImg);
    // registerNativeViewElement('pullrefresh', () => require('nativescript-akylas-pulltorefresh').PullToRefresh);
    registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
    registerNativeViewElement('line', () => require('@nativescript-community/ui-canvas/shapes/line').default);
    registerNativeViewElement('canvaslabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
    registerNativeViewElement('cspan', () => require('@nativescript-community/ui-canvaslabel').Span);
    registerNativeViewElement('cgroup', () => require('@nativescript-community/ui-canvaslabel').Group);
    registerNativeViewElement('cameraView', () => require('@nativescript-community/ui-cameraview').CameraView);
    registerNativeViewElement('checkbox', () => require('@nativescript-community/ui-checkbox').CheckBox);
    registerNativeViewElement('gesturerootview', () => require('@nativescript-community/gesturehandler').GestureRootView);
    // registerNativeViewElement('settingLabelIcon', () => require('./SettingLabelIcon.svelte').default);

    PagerElement.register();
    CollectionViewElement.register();
    startSentry();
    initialize();

    // import { CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';
    // Trace.addCategories(Trace.categories.NativeLifecycle);
    // Trace.addCategories(CollectionViewTraceCategory)
    // Trace.addCategories(ImageViewTraceCategory);
    // Trace.enable();

    let launched = false;
    async function start() {
        try {
            await syncService.start();
            await documentsService.start();

            try {
                await syncService.syncDocuments();
            } catch (error) {
                console.error('start sync error', error, error.stack);
            }
        } catch (error) {
            showError(error);
        }
    }
    Application.on('launch', async () => {
        launched = true;
        start();
    });
    Application.on('resume', () => {
        if (!launched) {
            launched = true;
            start();
        }
    });
    Application.on('exit', () => {
        launched = false;
        // documentsService.stop();
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
    if (startOnCam) {
        Comp = await import('~/components/Camera.svelte');
    } else {
        Comp = await import('~/components/DocumentsList.svelte');
    }
    svelteNative(Comp.default, {});
} catch (error) {
    console.error(error, error.stack);
}
