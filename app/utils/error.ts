import { AlertOptions, Color } from '@nativescript/core';
import { lc } from '@nativescript-community/l';
import { Label } from '@nativescript-community/ui-label';
import { MDCAlertControlerOptions, confirm, alert as mdAlert } from '@nativescript-community/ui-material-dialogs';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { BaseError } from 'make-error';
import { l } from '~/helpers/locale';
import type { HTTPSOptions } from '~/services/api';
import { Sentry, isSentryEnabled } from '~/utils/sentry';
import { colors } from '~/variables';
import { get } from 'svelte/store';
import { createView } from './ui';

Error.stackTraceLimit = Infinity;

function evalTemplateString(resource: string, obj: {}) {
    if (!obj) {
        return resource;
    }
    const names = Object.keys(obj);
    const vals = Object.keys(obj).map((key) => obj[key]);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(...names, `return \`${resource}\`;`)(...vals);
}

export class CustomError extends BaseError {
    customErrorConstructorName: string;
    isCustomError = true;
    assignedLocalData: any;
    silent?: boolean;
    _customStack?: string;
    constructor(props?, customErrorConstructorName?: string) {
        super(props.message);
        this.message = props.message;
        delete props.message;

        // standard way: Error.captureStackTrace(this, this.constructor.name);
        // if you do this, you couldn't set different getter for the 'stack' property
        this.stack = props.stack || new Error().stack; // do this, if you need a custom getter

        this.silent = props.silent;
        delete props.silent;

        // we need to understand if we are duplicating or not
        const isError = props instanceof Error;
        if (customErrorConstructorName || isError) {
            // duplicating
            // use getOwnPropertyNames to get hidden Error props
            const keys = Object.getOwnPropertyNames(props);
            for (let index = 0; index < keys.length; index++) {
                const k = keys[index];
                if (!props[k] || typeof props[k] === 'function') continue;
                if (k === 'stack') {
                    this._customStack = props[k];
                } else {
                    this[k] = props[k];
                }
            }
        }
        this.assignedLocalData = props;

        this.customErrorConstructorName ??= customErrorConstructorName || (this as any).constructor.name; // OR (<any>this).constructor.name;
    }
    //@ts-ignore
    get stack() {
        return this._customStack;
    }
    set stack(value) {
        this._customStack = value;
    }

    localData() {
        const res = {};
        for (const key in this.assignedLocalData) {
            res[key] = this.assignedLocalData[key];
        }
        return res;
    }

    toJSON() {
        const error = {
            message: this.message
        };
        Object.getOwnPropertyNames(this).forEach((key) => {
            if (typeof this[key] !== 'function') {
                error[key] = this[key];
            }
        });
        return error;
    }
    toData() {
        return JSON.stringify(this.toJSON());
    }
    toString() {
        return evalTemplateString(l(this.message), Object.assign({ l }, this.assignedLocalData));
    }

    getMessage() {}
}

export class TimeoutError extends CustomError {
    constructor(props?) {
        super(
            Object.assign(
                {
                    message: 'timeout_error'
                },
                props
            ),
            'TimeoutError'
        );
    }
}
export class PermissionError extends CustomError {
    constructor(message?) {
        super(
            {
                message: message ?? 'permission_error'
            },
            'PermissionError'
        );
    }
}
export class SilentError extends CustomError {
    constructor(message?) {
        super(
            {
                message: message ?? 'silent_error'
            },
            'SilentError'
        );
    }
}

export class NoNetworkError extends CustomError {
    constructor(props?) {
        super(
            Object.assign(
                {
                    message: 'no_network'
                },
                props
            ),
            'NoNetworkError'
        );
    }
}
export interface HTTPErrorProps {
    statusCode: number;
    message: string;
    requestParams: HTTPSOptions;
}
export class HTTPError extends CustomError {
    statusCode: number;
    requestParams: HTTPSOptions;
    constructor(props: HTTPErrorProps | HTTPError) {
        super(
            Object.assign(
                {
                    message: 'httpError'
                },
                props
            ),
            'HTTPError'
        );
    }
}
export function wrapNativeException(ex, wrapError: (...args) => Error = (msg) => new Error(msg)) {
    if (typeof ex === 'string') {
        return new Error(ex);
    }
    if (!(ex instanceof Error)) {
        if (__ANDROID__) {
            const err = wrapError(ex.toString());
            err['nativeException'] = ex;
            err['stackTrace'] = com.tns.NativeScriptException.getStackTraceAsString(ex);
            return err;
        }
        if (__IOS__) {
            const err = wrapError(ex.localizedDescription);
            err['nativeException'] = ex;
            err['code'] = ex.code;
            err['domain'] = ex.domain;
            // TODO: we loose native stack. see how to get it
            return err;
        }
    }
    return ex;
}
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
        DEV_LOG && console.error('showError', reporterEnabled, realError && Object.keys(realError), message, realError?.['stack'], realError?.['stackTrace'], realError?.['nativeException']);
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
