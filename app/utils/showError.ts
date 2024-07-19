import { AlertOptions } from '@akylas/nativescript';
import { wrapNativeException } from '@akylas/nativescript/utils';
import { l, lc } from '@nativescript-community/l';
import { Label } from '@nativescript-community/ui-label';
import { MDCAlertControlerOptions, alert as mdAlert } from '@nativescript-community/ui-material-dialogs';
import { get } from 'svelte/store';
import { colors } from '~/variables';
import { NoNetworkError, TimeoutError } from './error';
import { Sentry, isSentryEnabled } from './sentry';
import { createView, showSnack } from './ui';

export async function showError(
    err: Error | string,
    {
        showAsSnack = false,
        forcedMessage,
        alertOptions = {},
        silent = false
    }: { showAsSnack?: boolean; forcedMessage?: string; alertOptions?: AlertOptions & MDCAlertControlerOptions; silent?: boolean } = {}
) {
    try {
        if (!err) {
            return;
        }

        const reporterEnabled = SENTRY_ENABLED && isSentryEnabled;
        const errorType = typeof err;
        const realError = errorType === 'string' ? null : wrapNativeException(err);

        const isString = realError === null || realError === undefined;
        let message = isString ? (err as string) : realError.message || realError.toString();
        DEV_LOG && console.error('showError', reporterEnabled, message, realError?.['stack'], realError?.['stackTrace'], realError?.['nativeException']);
        message = forcedMessage || message;
        if (showAsSnack || realError instanceof NoNetworkError || realError instanceof TimeoutError) {
            showSnack({ message });
            return;
        }
        // const showSendBugReport = reporterEnabled && !isString && !(realError instanceof HTTPError) && !!realError.stack;
        const title = realError?.['title'] || lc('error');

        if (realError && reporterEnabled && realError.customErrorConstructorName !== 'PermissionError' && realError.customErrorConstructorName !== 'SilentError') {
            try {
                Sentry.captureException(realError);
            } catch (error) {
                console.error(error, error.stack);
            }
        }
        if (silent) {
            return;
        }
        return mdAlert({
            okButtonText: lc('ok'),
            title,
            view: createView(Label, {
                padding: '10 20 0 20',
                textWrap: true,
                color: get(colors).colorOnSurfaceVariant as any,
                html: message.trim()
            }),
            iosForceClosePresentedViewController: true, //ensure error popup is always showing
            ...alertOptions
        });
    } catch (error) {
        console.error('error trying to show error', err, error, error.stack);
    }
}

export function alert(message: string) {
    return mdAlert({
        okButtonText: l('ok'),
        message
    });
}
