import * as https from '@nativescript-community/https';
import { Application, ApplicationEventData } from '@nativescript/core';
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from '@nativescript/core/connectivity';
import { EventData, Observable } from '@nativescript/core/data/observable';
import { wrapNativeException } from '@nativescript/core/utils';
import { HTTPError, NoNetworkError, TimeoutError } from '~/utils/error';

export type HTTPSOptions = https.HttpsRequestOptions;
export type { Headers } from '@nativescript-community/https';

export const NetworkConnectionStateEvent = 'connected';
export interface NetworkConnectionStateEventData extends EventData {
    data: {
        connected: boolean;
        connectionType: connectionType;
    };
}

export interface HttpRequestOptions extends HTTPSOptions {
    queryParams?: {};
}

export function queryString(params, location) {
    const obj = {};
    let i, len, key, value;

    if (typeof params === 'string') {
        value = location.match(new RegExp('[?&]' + params + '=?([^&]*)[&#$]?'));
        return value ? value[1] : undefined;
    }

    const locSplit = location.split(/[?&]/);
    // _params[0] is the url

    const parts = [];
    for (i = 0, len = locSplit.length; i < len; i++) {
        const theParts = locSplit[i].split('=');
        if (!theParts[0]) {
            continue;
        }
        if (theParts[1]) {
            parts.push(theParts[0] + '=' + theParts[1]);
        } else {
            parts.push(theParts[0]);
        }
    }
    if (Array.isArray(params)) {
        let data;

        for (i = 0, len = params.length; i < len; i++) {
            data = params[i];
            if (typeof data === 'string') {
                parts.push(data);
            } else if (Array.isArray(data)) {
                parts.push(data[0] + '=' + data[1]);
            }
        }
    } else if (typeof params === 'object') {
        for (key in params) {
            value = params[key];
            if (typeof value === 'undefined') {
                delete obj[key];
            } else {
                if (typeof value === 'object') {
                    obj[key] = encodeURIComponent(JSON.stringify(value));
                } else {
                    obj[key] = encodeURIComponent(value);
                }
            }
        }
        for (key in obj) {
            parts.push(key + (obj[key] === true ? '' : '=' + obj[key]));
        }
    }

    return parts.splice(0, 2).join('?') + (parts.length > 0 ? '&' + parts.join('&') : '');
}

interface NetworkService {
    on(eventNames: 'connected', callback: (data: NetworkConnectionStateEventData) => void, thisArg?: any);
    on(eventNames: 'connection', callback: (e: EventData & { connectionType: connectionType; connected: boolean }) => void, thisArg?: any);
}

class NetworkService extends Observable {
    _connectionType: connectionType = connectionType.none;
    _connected = true;
    get connected() {
        return this._connected;
    }
    set connected(value: boolean) {
        if (this._connected !== value) {
            this._connected = value;
            this.notify({
                eventName: NetworkConnectionStateEvent,
                object: this,
                data: {
                    connected: value,
                    connectionType: this._connectionType
                }
            } as NetworkConnectionStateEventData);
        }
    }
    get connectionType() {
        return this._connectionType;
    }
    set connectionType(value: connectionType) {
        if (this._connectionType !== value) {
            this._connectionType = value;
            this.connected = value !== connectionType.none;
            // this.notify({ eventName: 'connection', object: this, connectionType: value, connected: this.connected });
        }
    }
    monitoring = false;
    start() {
        if (this.monitoring) {
            return;
        }
        this.monitoring = true;
        Application.on(Application.foregroundEvent, this.onAppForeground, this);
        Application.on(Application.backgroundEvent, this.onAppBackground, this);
        startMonitoring(this.onConnectionStateChange.bind(this));
        this.connectionType = getConnectionType();
    }
    stop() {
        if (!this.monitoring) {
            return;
        }
        Application.off(Application.foregroundEvent, this.onAppForeground, this);
        Application.off(Application.backgroundEvent, this.onAppBackground, this);
        this.monitoring = false;
        stopMonitoring();
    }
    background = true;
    onAppForeground(args: ApplicationEventData) {
        if (this.background) {
            this.background = false;
            this.connectionType = getConnectionType();
        }
    }
    onAppBackground(args: ApplicationEventData) {
        if (!this.background) {
            this.background = true;
        }
    }
    onConnectionStateChange(newConnectionType: connectionType) {
        this.connectionType = newConnectionType;
    }
}

export const networkService = new NetworkService();

async function handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
    throw new HTTPError({
        statusCode: 401,
        message: 'HTTP error',
        requestParams
    });
}

export function wrapNativeHttpException(error, requestParams: HttpRequestOptions) {
    return wrapNativeException(error, (message) => {
        if (/(SocketTimeout|SocketException|UnknownHost)/.test(message)) {
            return new TimeoutError();
        } else {
            return new HTTPError({
                message,
                statusCode: -1,
                requestParams
            });
        }
    });
}
async function handleRequestResponse<T>(response: https.HttpsResponse<https.HttpsResponseLegacy<T>>, requestParams: HttpRequestOptions, requestStartTime, retry): Promise<T> {
    const statusCode = response.statusCode;
    let content: T;
    try {
        content = await response.content.toJSONAsync();
    } catch (err) {
        console.error(err, err.stack);
    }
    if (!content) {
        content = (await response.content.toStringAsync()) as any;
    }
    const isJSON = typeof content === 'object' || Array.isArray(content);
    if (Math.round(statusCode / 100) !== 2) {
        let jsonReturn;
        if (isJSON) {
            jsonReturn = content;
        } else {
            const match = /<title>(.*)\n*<\/title>/.exec(content as any as string);
            throw new HTTPError({
                statusCode,
                message: match ? match[1] : content.toString(),
                requestParams
            });
        }
        if (jsonReturn) {
            if (Array.isArray(jsonReturn)) {
                jsonReturn = jsonReturn[0];
            }
            // if (statusCode === 401 && jsonReturn.error === 'invalid_grant') {
            //     return this.handleRequestRetry(requestParams, retry);
            // }
            const error = jsonReturn.error_description || jsonReturn.error || jsonReturn;
            throw new HTTPError({
                statusCode: error.code || statusCode,
                message: error.error_description || error.form || error.message || error.error || error,
                requestParams
            });
        }
    }
    return content as any as T;
}
function getRequestHeaders(requestParams?: HttpRequestOptions) {
    const headers = requestParams?.headers ?? {};
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}
export async function request<T = any>(requestParams: HttpRequestOptions, retry = 0) {
    if (!networkService.connected) {
        throw new NoNetworkError();
    }
    if (requestParams.queryParams) {
        requestParams.url = queryString(requestParams.queryParams, requestParams.url);
        delete requestParams.queryParams;
    }
    requestParams.headers = getRequestHeaders(requestParams);

    const requestStartTime = Date.now();
    DEV_LOG && console.log('request', requestParams);
    try {
        const response = await https.request<T>(requestParams);
        return handleRequestResponse<T>(response, requestParams, requestStartTime, retry);
    } catch (error) {
        throw wrapNativeHttpException(error, requestParams);
    }
}
