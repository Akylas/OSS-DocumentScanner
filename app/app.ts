import { GestureRootView, install as installGestures } from '@nativescript-community/gesturehandler';
import { installMixins as installUIMixins } from '@nativescript-community/systemui';
import { overrideSpanAndFormattedString } from '@nativescript-community/text';
import SwipeMenuElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';
import DrawerElement from '@nativescript-community/ui-drawer/svelte';
import { ImagePipeline, getImagePipeline, initialize } from '@nativescript-community/ui-image';
import { installMixins as installColorFilters } from '@nativescript-community/ui-image-colorfilter';
import { Label } from '@nativescript-community/ui-label';
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
import { installMixins, themer } from '@nativescript-community/ui-material-core';
import { Pager } from '@nativescript-community/ui-pager';
import PagerElement from '@nativescript-community/ui-pager/svelte';
import { Application, ApplicationSettings, Frame, NavigatedData, Page, Trace } from '@nativescript/core';
import { CropView } from 'plugin-nativeprocessor/CropView';
import { FrameElement, PageElement, createElement, navigate, registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { NestedScrollView } from '~/NestedScrollView';
import { lc } from '~/helpers/locale';
import { start as startThemeHelper } from '~/helpers/theme';
import { documentsService } from '~/services/documents';
import ZoomOutTransformer from '~/transformers/ZoomOutTransformer';
import { startSentry } from '~/utils/sentry';
import { networkService } from './services/api';
import { ocrService } from './services/ocr';
import { securityService } from './services/security';
import { syncService } from './services/sync';
import { showError } from './utils/showError';
import { CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';
import { SETTINGS_APP_VERSION, SETTINGS_FIRST_OPEN } from './utils/constants';
import { setDocumentsService } from './models/OCRDocument';

declare module '@nativescript/core/application/application-common' {
    interface ApplicationCommon {
        servicesStarted: boolean;
    }
}
try {
    // we cant really use firstAppOpen anymore as all apps
    // already installed with older version without this code would
    // be seen as newly installed
    // const firstAppOpen = ApplicationSettings.getBoolean(SETTINGS_FIRST_OPEN, true);
    // if (firstAppOpen) {
    //     ApplicationSettings.setBoolean(SETTINGS_FIRST_OPEN, false);
    //     ApplicationSettings.setNumber(SETTINGS_APP_VERSION, __APP_BUILD_NUMBER__);
    // } else {
    if (__IOS__) {
        // we need this for cache image eviction because we change original image
        // while using a variety of colorMatrix,decodeWidth,....
        ImagePipeline.iosComplexCacheEviction = true;
    }

    const lastVersion = ApplicationSettings.getNumber(SETTINGS_APP_VERSION, 0);
    ApplicationSettings.setNumber(SETTINGS_APP_VERSION, __APP_BUILD_NUMBER__);
    if (lastVersion < __APP_BUILD_NUMBER__) {
        DEV_LOG && console.warn('appUpdateNeeds');

        // on 25 we fixed iOS cache clear handling so we need to remove it all
        if (__IOS__ && lastVersion < 24) {
            getImagePipeline().clearCaches();
        }
    }
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
    registerNativeViewElement('flexlayout', () => require('@nativescript/core').FlexboxLayout);
    registerElement('Frame', () => new FrameElement());
    registerElement('Page', () => new PageElement());
    registerNativeViewElement('GridLayout', () => require('@nativescript/core').GridLayout);
    registerNativeViewElement('ScrollView', () => NestedScrollView as any);
    registerNativeViewElement('StackLayout', () => require('@nativescript/core').StackLayout);
    registerNativeViewElement('Switch', () => require('@nativescript-community/ui-material-switch').Switch);
    registerNativeViewElement('Span', () => require('@nativescript/core').Span);

    registerNativeViewElement('slider', () => require('@nativescript-community/ui-material-slider').Slider, null, {}, { override: true });
    registerNativeViewElement('textview', () => require('@nativescript-community/ui-material-textview').TextView, null, {}, { override: true });
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
    registerNativeViewElement('svgview', () => require('@nativescript-community/ui-svg').SVGView);
    // registerNativeViewElement('blurview', () => require('@nativescript-community/ui-blurview').BlurView);

    PagerElement.register();
    CollectionViewElement.register();
    SwipeMenuElement.register();
    DrawerElement.register();
    startSentry();
    initialize({ isDownsampleEnabled: true });
    // Trace.addCategories(Trace.categories.Navigation);
    // Trace.addCategories(Trace.categories.Transition);
    // Trace.addCategories(Trace.categories.Accessibility);
    // Trace.addCategories(CollectionViewTraceCategory);
    // Trace.addCategories(ImageViewTraceCategory);
    // Trace.addCategories(ImageViewTraceCategory);
    // Trace.enable();

    let launched = false;
    async function start() {
        try {
            Application.servicesStarted = false;
            DEV_LOG && console.log('start');
            setDocumentsService(documentsService);
            await Promise.all([networkService.start(), securityService.start(), syncService.start(), ocrService.start(), documentsService.start()]);
            Application.servicesStarted = true;
            DEV_LOG && console.log('servicesStarted');
            Application.notify({ eventName: 'servicesStarted' });
            try {
                await syncService.syncDocuments();
            } catch (error) {
                console.error('start sync error', error, error.stack);
            }
        } catch (error) {
            showError(error, { forcedMessage: lc('startup_error') });
        }
    }
    Application.on(Application.launchEvent, async () => {
        DEV_LOG && console.log('launch');
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
    Application.on(Application.exitEvent, async () => {
        DEV_LOG && console.log('exit');
        launched = false;
        //  ocrService.stop();
        try {
            securityService.stop();
            // wait for sync to stop to stop documentService as their could be writes to the db
            await syncService.stop();
            documentsService.stop();
        } catch (error) {
            console.error(error, error.stack);
        }
    });
    if (__ANDROID__) {
        // store start intent we might received before first page is mounted
        Application.android.on(Application.android.activityNewIntentEvent, (event) => {
            Application.android['startIntent'] = event.intent;
        });
    }

    themer.createShape('round', {
        cornerFamily: 'rounded' as any,
        cornerSize: {
            value: 0.5,
            unit: '%'
        }
    });
    themer.createShape('medium', {
        cornerFamily: 'rounded' as any,
        cornerSize: 16
    });
    themer.createShape('small', {
        cornerFamily: 'rounded' as any,
        cornerSize: 12
    });

    themer.createShape('none', {
        cornerFamily: 'rounded' as any,
        cornerSize: 0
    });
    if (__ANDROID__) {
        Page.on('shownModally', function (event) {
            // DEV_LOG && console.log('onShownModally', event.object['_dialogFragment']);
            com.akylas.documentscanner.Utils.Companion.prepareWindow(event.object['_dialogFragment'].getDialog().getWindow());
        });
        Frame.on('shownModally', function (event) {
            // DEV_LOG && console.log('onShownModally', event.object['_dialogFragment']);
            com.akylas.documentscanner.Utils.Companion.prepareWindow(event.object['_dialogFragment'].getDialog().getWindow());
        });
        // GestureRootView.on('shownInBottomSheet', function (event) {
        //     const _bottomSheetFragment = event.object['_bottomSheetFragment'];
        //     DEV_LOG && console.log('shownInBottomSheet', _bottomSheetFragment, _bottomSheetFragment.getDialog().getWindow());
        //     if (_bottomSheetFragment) {
        //         com.akylas.documentscanner.Utils.prepareWindow(_bottomSheetFragment.getDialog().getWindow());
        //     }
        // });
    }
    if (!PRODUCTION && DEV_LOG) {
        Page.on('navigatingTo', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'to', event.object, event.isBackNavigation);
        });
        Page.on('showingModally', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'MODAL', event.object, event.isBackNavigation);
        });
        Frame.on('showingModally', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'MODAL', event.object, event.isBackNavigation);
        });
        Frame.on('closingModally', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'CLOSING MODAL', event.object, event.isBackNavigation);
        });
        Page.on('closingModally', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'CLOSING MODAL', event.object, event.isBackNavigation);
        });
        GestureRootView.on('shownInBottomSheet', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'BOTTOMSHEET', event.object, event.isBackNavigation);
        });
        GestureRootView.on('closedBottomSheet', (event: NavigatedData) => {
            DEV_LOG && console.info('NAVIGATION', 'CLOSING BOTTOMSHEET', event.object, event.isBackNavigation);
        });
    }
    let Comp;
    const startOnCam = START_ON_CAM; /* ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) */
    if (startOnCam) {
        Comp = await import('~/components/camera/Camera.svelte');
    } else if (CARD_APP) {
        Comp = await import('~/components/CardsList.svelte');
    } else {
        Comp = await import('~/components/DocumentsList.svelte');
    }
    // svelteNative(Comp.default, {});
    // initializeDom();
    global.__onLiveSyncCore = () => {
        Application.getRootView()?._onCssStateChange();
    };
    let rootFrame;
    let pageInstance;
    // we use custom start cause we want gesturerootview as parent of it all to add snacK message view
    new Promise((resolve, reject) => {
        //wait for launch
        Application.on(Application.launchEvent, () => {
            DEV_LOG && console.log('launch', !!pageInstance);
            resolve(pageInstance);
        });
        Application.on(Application.exitEvent, () => {
            DEV_LOG && console.log('exit', !!pageInstance);
            if (pageInstance) {
                pageInstance.$destroy();
                pageInstance = null;
            }
        });
        try {
            Application.run({
                create: () => {
                    const rootGridLayout = createElement('gesturerootview', window.document as any);
                    const rootFrame = createElement('frame', rootGridLayout.ownerDocument);
                    rootFrame.setAttribute('id', 'app-root-frame');
                    //very important here to use svelte-native navigate
                    // the throttle one wont return the pageInstance
                    pageInstance = navigate({
                        page: Comp.default,
                        props: {},
                        frame: rootFrame as any
                    });
                    DEV_LOG && console.log('Application.run', !!pageInstance);
                    rootGridLayout.appendChild(rootFrame);
                    return rootGridLayout['nativeView'];
                }
            });
        } catch (e) {
            reject(e);
        }
    });
} catch (error) {
    console.error(error, error.stack);
}
