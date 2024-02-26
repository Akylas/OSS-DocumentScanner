import { NavigatedData, Page, View } from '@nativescript/core';
import * as SentryType from '@nativescript-community/sentry';
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
                release: `${__APP_ID__}@${__APP_VERSION__}+${__APP_BUILD_NUMBER__}`,
                dist: `${__APP_BUILD_NUMBER__}.${__ANDROID__ ? 'android' : 'ios'}`,
                colnoOffset: 4,
                enableUIViewControllerTracing: false,
                enableUserInteractionTracing: false,
                enableAutoBreadcrumbTracking: false,
                enableFragmentLifecycleBreadcrumbs: false,
                enableAutoFragmentLifecycleTracing: false,
                enableAppLifecycleBreadcrumbs: false
            });
            install();
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
