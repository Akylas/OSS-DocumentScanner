import { Application, NavigatedData, Page, Trace, TraceErrorHandler, View } from '@nativescript/core';
import * as SentryType from '@nativescript-community/sentry';
import { install } from '~/utils/logging';
import * as Tracing from '@nativescript-community/sentry/tracing';

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
                disabledNativeIntegrations: ['io.sentry.UncaughtExceptionHandlerIntegration', 'io.sentry.android.fragment.FragmentLifecycleIntegration'],
                flushSendEvent: true,
                enableNativeCrashHandling: true,
                attachScreenshot: true,
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
            Page.on('navigatingTo', (event: NavigatedData) => {
                Sentry.addBreadcrumb({
                    category: 'navigation',
                    type: 'navigation',
                    // We assume that context.name is the name of the route.
                    message: `Navigation to ${event.object}`,
                    data: {
                        isBackNavigation: event.isBackNavigation,
                        // from: `${(event.object as Page).frame?.currentPage}`,
                        to: `${event.object}`
                    }
                });
            });
            View.on('showingModally', (event: NavigatedData) => {
                Sentry.addBreadcrumb({
                    category: 'navigation',
                    type: 'navigation',
                    // We assume that context.name is the name of the route.
                    message: `Navigation to Modal ${event.object}`,
                    data: {
                        // from: `${(event.object as View)._modalParent}`,
                        to: `${event.object}`
                    }
                });
            });
            View.on('closingModally', (event: NavigatedData) => {
                Sentry.addBreadcrumb({
                    category: 'navigation',
                    type: 'navigation',
                    // We assume that context.name is the name of the route.
                    message: `Closing modal ${event.object}`,
                    data: {
                        from: `${event.object as View}`
                    }
                });
            });
        }
    } catch (err) {
        console.error('startSentry', err, err['stack']);
    }
}
