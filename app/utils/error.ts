import { Color } from '@nativescript/core';
import { lc } from '@nativescript-community/l';
import { Label } from '@nativescript-community/ui-label';
import { confirm, alert as mdAlert } from '@nativescript-community/ui-material-dialogs';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { BaseError } from 'make-error';
import { l } from '~/helpers/locale';
import type { HTTPSOptions } from '~/services/api';
import { Sentry, isSentryEnabled } from '~/utils/sentry';

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
    constructor(props?, customErrorConstructorName?: string) {
        super(props.message);
        this.message = props.message;
        delete props.message;

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
                this[k] = props[k];
            }
        } else {
            this.assignedLocalData = props;
        }

        if (!this.customErrorConstructorName) {
            this.customErrorConstructorName = customErrorConstructorName || (this as any).constructor.name; // OR (<any>this).constructor.name;
        }
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
        const result = evalTemplateString(l(this.message), Object.assign({ l }, this.assignedLocalData));
        return result;
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

export async function showError(err: Error | string, showAsSnack = false) {
    try {
        if (!err) {
            return;
        }
        DEV_LOG && console.error('showError', err, err?.['stack']);
        const reporterEnabled = SENTRY_ENABLED && isSentryEnabled;
        const realError = typeof err === 'string' ? null : err;

        const isString = realError === null || realError === undefined;
        const message = isString ? (err as string) : realError.message || realError.toString();
        if (showAsSnack || realError instanceof NoNetworkError || realError instanceof TimeoutError) {
            showSnack({ message });
            return;
        }
        if (reporterEnabled) {
            Sentry.captureException(err);
        }
        const showSendBugReport = reporterEnabled && !isString && !(realError instanceof HTTPError) && !!realError.stack;
        const title = realError?.['title'] || showSendBugReport ? lc('error') : ' ';
        // if (!PRODUCTION) {
        // }
        const label = new Label();
        label.style.padding = '10 20 0 20';
        label.style.color = new Color(255, 138, 138, 138);
        label.html = message.trim();
        return mdAlert({
            okButtonText: lc('ok'),
            title,
            view: label
        });
    } catch (error) {
        console.error('showError', error);
    }
}

export function alert(message: string) {
    return mdAlert({
        okButtonText: l('ok'),
        message
    });
}
