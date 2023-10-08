import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from '@nativescript/core/connectivity';
import { EventData, Observable } from '@nativescript/core/data/observable';
import { CustomError } from '~/utils/error';
import * as https from '@nativescript-community/https';
import { ApplicationEventData, off as applicationOff, on as applicationOn, resumeEvent, suspendEvent } from '@nativescript/core/application';

type HTTPSOptions = https.HttpsRequestOptions;

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

interface NetworkService {
    // on(eventNames: 'connected', callback: (data: NetworkConnectionStateEventData) => void, thisArg?: any);
    // on(eventNames: 'connection', callback: (e: EventData & { connectionType: connectionType; connected: boolean }) => void, thisArg?: any);
}

class NetworkService extends Observable {
    _connectionType: connectionType = connectionType.none;
    _connected = false;
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
        applicationOn(resumeEvent, this.onAppResume, this);
        startMonitoring(this.onConnectionStateChange.bind(this));
        this.connectionType = getConnectionType();
    }
    stop() {
        if (!this.monitoring) {
            return;
        }
        applicationOff(resumeEvent, this.onAppResume, this);
        this.monitoring = false;
        stopMonitoring();
    }
    onAppResume(args: ApplicationEventData) {
        this.connectionType = getConnectionType();
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

async function handleRequestResponse(response: https.HttpsResponse, requestParams: HttpRequestOptions, requestStartTime, retry) {
    const statusCode = response.statusCode;
    // return Promise.resolve()
    // .then(() => {
    let content = await response.content.toJSONAsync();
    if (!content) {
        content = await response.content.toStringAsync();
    }
    const isJSON = typeof content === 'object' || Array.isArray(content);
    // const isJSON = !!jsonContent;
    if (Math.round(statusCode / 100) !== 2) {
        let jsonReturn;
        if (isJSON) {
            jsonReturn = content;
        } else {
            // jsonReturn = jsonContent;
            // } else {
            // try {
            // jsonReturn = JSON.parse(content);
            // } catch (err) {
            // error result might html
            const match = /<title>(.*)\n*<\/title>/.exec(content);
            return Promise.reject(
                new HTTPError({
                    statusCode,
                    message: match ? match[1] : content.toString(),
                    requestParams
                })
            );
            // }
        }
        if (jsonReturn) {
            if (Array.isArray(jsonReturn)) {
                jsonReturn = jsonReturn[0];
            }
            if (statusCode === 401 && jsonReturn.error === 'invalid_grant') {
                return this.handleRequestRetry(requestParams, retry);
            }
            const error = jsonReturn.error_description || jsonReturn.error || jsonReturn;
            throw new HTTPError({
                statusCode: error.code || statusCode,
                message: error.error_description || error.form || error.message || error.error || error,
                requestParams
            });
        }
    }
    // if (isJSON) {
    // if (isJSON) {
    // clog('handleRequestResponse response', JSON.stringify(content));
    return content;
    // }
    // try {
    //     // we should never go there anymore
    //     return JSON.parse(content);
    // } catch (e) {
    //     // console.log('failed to parse result to JSON', e);
    //     return content;
    // }
    // }
    // try {
    //     return response.content.toJSON();
    // } catch (e) {
    //     // console.log('failed to parse result to JSON', e);
    //     return response.content;
    // }
    // })
    // .catch(err => {
    //     const delta = Date.now() - requestStartTime;
    //     if (delta >= 0 && delta < 500) {
    //         return timeout(delta).then(() => Promise.reject(err));
    //     } else {
    //         return Promise.reject(err);
    //     }
    // });
}
function getRequestHeaders(requestParams?: HttpRequestOptions) {
    const headers = requestParams?.headers ?? {};
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}
export function request<T = any>(requestParams: HttpRequestOptions, retry = 0) {
    if (!networkService.connected) {
        throw new NoNetworkError();
    }
    if (requestParams.queryParams) {
        requestParams.url = queryString(requestParams.queryParams, requestParams.url);
        delete requestParams.queryParams;
    }
    requestParams.headers = getRequestHeaders(requestParams);

    const requestStartTime = Date.now();
    return https.request(requestParams).then((response) => handleRequestResponse(response, requestParams, requestStartTime, retry));
}
