import { GestureRootView } from '@nativescript-community/gesturehandler';
import * as SentryType from '@nativescript-community/sentry';
import { Application, NavigatedData, Page, Trace, TraceErrorHandler } from '@nativescript/core';
import { install } from '~/utils/logging';

export let Sentry: typeof SentryType;
export let isSentryEnabled = false;

export async function startSentry() {
    try {
        if (SENTRY_ENABLED) {
            Sentry = require('@nativescript-community/sentry');
            Sentry.init({
                debug: DEV_LOG,
                dsn: SENTRY_DSN,
                appPrefix: '~/',
                // appPrefix: SENTRY_PREFIX,
                release: `${__APP_ID__}@${__APP_VERSION__}+${__APP_BUILD_NUMBER__}`,
                dist: `${__APP_BUILD_NUMBER__}.${__ANDROID__ ? 'android' : 'ios'}`,
                colnoOffset: 4,
                disabledNativeIntegrations: ['io.sentry.UncaughtExceptionHandlerIntegration', 'io.sentry.android.fragment.FragmentLifecycleIntegration'], // Android
                flushSendEvent: true,
                enableCrashHandler: false, // iOS
                attachScreenshot: false,
                enableUIViewControllerTracing: false,
                enableUserInteractionTracing: false,
                enableAutoBreadcrumbTracking: false,
                enableFragmentLifecycleBreadcrumbs: false,
                enableAutoFragmentLifecycleTracing: false,
                enableAppLifecycleBreadcrumbs: false
            });
            install();
            const errorHandler: TraceErrorHandler = {
                handlerError(err) {
                    Sentry.captureException(err);
                }
            };
            Application.on(Application.uncaughtErrorEvent, (event) => {
                Sentry.captureException(event.error);
            });
            Application.on(Application.discardedErrorEvent, (event) => {
                Sentry.captureException(event.error);
            });
            Trace.setErrorHandler(errorHandler);
            isSentryEnabled = true;

            function createNavigatioTransaction(object, isBackNavigation, customMessage?: string) {
                Sentry.addBreadcrumb({
                    category: 'navigation',
                    type: 'navigation',
                    // We assume that context.name is the name of the route.
                    message: customMessage ? customMessage + ` ${object}` : `Navigation to ${object}`,
                    data: {
                        isBackNavigation,
                        // from: `${(event.object as Page).frame?.currentPage}`,
                        to: `${object}`
                    }
                });
            }
            Page.on('navigatingTo', (event: NavigatedData) => createNavigatioTransaction(event.object, event.isBackNavigation));
            Page.on('showingModally', (event: NavigatedData) => createNavigatioTransaction(event.object, false, 'Navigation to Modal'));
            Page.on('closingModally', (event: NavigatedData) => createNavigatioTransaction(event.object, true, 'Closing modal'));
            GestureRootView.on('shownInBottomSheet', (event: NavigatedData) => createNavigatioTransaction(event.object, false, 'Opening BottomSheet'));
            GestureRootView.on('closedBottomSheet', (event: NavigatedData) => createNavigatioTransaction(event.object, true, 'Closing BottomSheet'));
        }
    } catch (err) {
        console.error('startSentry', err, err['stack']);
    }
}
