import { install as installGestures } from '@nativescript-community/gesturehandler';
import { installMixins as installUIMixins } from '@nativescript-community/systemui';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import { initialize } from '@nativescript-community/ui-image';
import { installMixins as installColorFilters } from '@nativescript-community/ui-image-colorfilter';
import { Label } from '@nativescript-community/ui-label';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { Pager } from '@nativescript-community/ui-pager';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import SwipeMenuElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
import DrawerElement from '@nativescript-community/ui-drawer/svelte';
import { Application, Trace, Utils } from '@nativescript/core';
import { CropView } from 'plugin-nativeprocessor/CropView';
import { svelteNative } from 'svelte-native';
import { FrameElement, PageElement, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { NestedScrollView } from '~/NestedScrollView';
import { start as startThemeHelper } from '~/helpers/theme';
import { documentsService } from '~/services/documents';
import ZoomOutTransformer from '~/transformers/ZoomOutTransformer';
import { startSentry } from '~/utils/sentry';
import { ocrService } from './services/ocr';
import { syncService } from './services/sync';
import { showError } from './utils/error';
import { CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';
import { ImageViewTraceCategory } from '@nativescript-community/ui-image';
import { securityService } from './services/security';
import { networkService } from './services/api';

try {
    Pager.registerTransformer('zoomOut', ZoomOutTransformer);
    installGestures(true);
    installMixins();
    installColorFilters();
    installBottomSheets();
    installUIMixins();
    overrideSpanAndFormattedString();

    registerNativeViewElement('cropview', () => CropView);
    registerNativeViewElement('AbsoluteLayout', () => require('@nativescript/core').AbsoluteLayout);
    registerNativeViewElement('wraplayout', () => require('@nativescript/core').WrapLayout);
    registerElement('Frame', () => new FrameElement());
    registerElement('Page', () => new PageElement());
    registerNativeViewElement('GridLayout', () => require('@nativescript/core').GridLayout);
    registerNativeViewElement('ScrollView', () => NestedScrollView as any);
    registerNativeViewElement('StackLayout', () => require('@nativescript/core').StackLayout);
    registerNativeViewElement('Switch', () => require('@nativescript-community/ui-material-switch').Switch);
    registerNativeViewElement('Span', () => require('@nativescript/core').Span);
    registerNativeViewElement('TextView', () => require('@nativescript/core').TextView);

    registerNativeViewElement('slider', () => require('@nativescript-community/ui-material-slider').Slider, null, {}, { override: true });
    registerNativeViewElement('textfield', () => require('@nativescript-community/ui-material-textfield').TextField, null, {}, { override: true });
    registerNativeViewElement('mdbutton', () => require('@nativescript-community/ui-material-button').Button);
    registerNativeViewElement('activityIndicator', () => require('@nativescript-community/ui-material-activityindicator').ActivityIndicator);
    registerNativeViewElement('progress', () => require('@nativescript-community/ui-material-progress').Progress);
    registerNativeViewElement('label', () => Label);
    registerNativeViewElement('image', () => require('@nativescript-community/ui-image').Img);
    registerNativeViewElement('zoomimage', () => require('@nativescript-community/ui-zoomimage').ZoomImg);
    registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
    registerNativeViewElement('line', () => require('@nativescript-community/ui-canvas/shapes/line').default);
    registerNativeViewElement('canvaslabel', () => require('@nativescript-community/ui-canvaslabel').CanvasLabel);
    registerNativeViewElement('cspan', () => require('@nativescript-community/ui-canvaslabel').Span);
    registerNativeViewElement('cgroup', () => require('@nativescript-community/ui-canvaslabel').Group);
    registerNativeViewElement('cameraView', () => require('@nativescript-community/ui-cameraview').CameraView);
    registerNativeViewElement('checkbox', () => require('@nativescript-community/ui-checkbox').CheckBox);
    registerNativeViewElement('gesturerootview', () => require('@nativescript-community/gesturehandler').GestureRootView);
    registerNativeViewElement('awebview', () => require('@nativescript-community/ui-webview').AWebView);
    registerNativeViewElement('lottie', () => require('@nativescript-community/ui-lottie').LottieView);
    registerNativeViewElement('pagerindicator', () => require('@nativescript-community/ui-pager-indicator').PagerIndicator);
    // registerNativeViewElement('blurview', () => require('@nativescript-community/ui-blurview').BlurView);

    PagerElement.register();
    CollectionViewElement.register();
    SwipeMenuElement.register();
    DrawerElement.register();
    startSentry();
    initialize();
    // Trace.addCategories(Trace.categories.NativeLifecycle);
    // Trace.addCategories(CollectionViewTraceCategory);
    // Trace.addCategories(ImageViewTraceCategory);
    // Trace.enable();

    let launched = false;
    async function start() {
        try {
            DEV_LOG && console.log('start');
            networkService.start();
            securityService.start();
            await syncService.start();
            await ocrService.start();
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
    Application.on(Application.launchEvent, async () => {
        // DEV_LOG && console.log('launchEvent');
        startThemeHelper();
        launched = true;
        start();
    });
    Application.on(Application.resumeEvent, () => {
        if (!launched) {
            // DEV_LOG && console.log('resume');
            launched = true;
            start();
        }
    });
    Application.on(Application.exitEvent, () => {
        // DEV_LOG && console.log('exit');
        launched = false;
        //  ocrService.stop();
        try {
            syncService.stop();
            documentsService.stop();
        } catch (error) {
            console.error(error, error.stack);
        }
    });

    themer.createShape('round', {
        cornerFamily: 'rounded' as any,
        cornerSize: {
            value: 0.5,
            unit: '%'
        }
    });
    themer.createShape('medium', {
        cornerFamily: 'rounded' as any,
        cornerSize: 12
    });
    let Comp;
    const startOnCam = START_ON_CAM; /* ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) */
    if (startOnCam) {
        Comp = await import('~/components/Camera.svelte');
    } else if (CARD_APP) {
        Comp = await import('~/components/CardsList.svelte');
    } else {
        Comp = await import('~/components/DocumentsList.svelte');
    }
    svelteNative(Comp.default, {});
} catch (error) {
    console.error(error, error.stack);
}
