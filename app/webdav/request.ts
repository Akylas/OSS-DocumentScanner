import { HttpsResponse, HttpsResponseLegacy, request } from '@nativescript-community/https';
import { wrapNativeHttpException } from '~/services/api';
import { generateDigestAuthHeader, parseDigestAuth } from './auth/digest';
import { mergeHeaders } from './tools/headers';
import { merge } from './tools/merge';
import { RequestOptions, RequestOptionsWithState, WebDAVClientContext, WebDAVMethodOptions } from './types';

// function getFetchOptions(requestOptions: RequestOptions): HttpsRequestOptions {
//     let headers: Headers = {};
//     // Handle standard options
//     const opts: HttpsRequestOptions = {
//         method: requestOptions.method
//     } as any;
//     if (requestOptions.headers) {
//         headers = mergeHeaders(headers, requestOptions.headers);
//     }
//     if (typeof requestOptions.data !== 'undefined') {
//         const [body, newHeaders] = requestDataToFetchBody(requestOptions.data);
//         opts.body = body;
//         headers = mergeHeaders(headers, newHeaders);
//     }
//     // if (requestOptions.signal) {
//     //     opts.signal = requestOptions.signal;
//     // }
//     // if (requestOptions.withCredentials) {
//     //     (opts as RequestInit).credentials = 'include';
//     // }
//     // Check for node-specific options
//     // if (!isWeb()) {
//     //     if (requestOptions.httpAgent || requestOptions.httpsAgent) {
//     //         (opts as RequestInitNF).agent = (parsedURL: URL) => {
//     //             if (parsedURL.protocol === 'http:') {
//     //                 return requestOptions.httpAgent || new HTTPAgent();
//     //             }
//     //             return requestOptions.httpsAgent || new HTTPSAgent();
//     //         };
//     //     }
//     // }
//     // Attach headers
//     opts.headers = headers;
//     return opts;
// }

export function prepareRequestOptions(requestOptions: RequestOptions | RequestOptionsWithState, context: WebDAVClientContext, userOptions: WebDAVMethodOptions): RequestOptionsWithState {
    // const finalOptions = cloneShallow(requestOptions) as RequestOptionsWithState;
    const finalOptions = { ...requestOptions, ...(userOptions || {}) } as RequestOptionsWithState;
    finalOptions.headers = mergeHeaders(context.headers, finalOptions.headers || {}, userOptions.headers || {});
    finalOptions.responseOnMainThread = false;
    // if (typeof userOptions.data !== 'undefined') {
    //     finalOptions.data = userOptions.data;
    // }
    // if (userOptions.signal) {
    //     finalOptions.signal = userOptions.signal;
    // }
    // if (context.httpAgent) {
    //     finalOptions.httpAgent = context.httpAgent;
    // }
    // if (context.httpsAgent) {
    //     finalOptions.httpsAgent = context.httpsAgent;
    // }
    if (context.digest) {
        finalOptions._digest = context.digest;
    }
    // if (typeof context.withCredentials === 'boolean') {
    //     finalOptions.withCredentials = context.withCredentials;
    // }
    return finalOptions;
}

async function _request<T = any>(requestOptions: RequestOptionsWithState) {
    DEV_LOG && console.log('webdav request', JSON.stringify(requestOptions));
    try {
        const response = await request<T>({ ...requestOptions, body: requestOptions.data as any });
        DEV_LOG && console.log('webdavRequest response', response.statusCode, requestOptions.url);
        return response;
    } catch (error) {
        throw wrapNativeHttpException(error, requestOptions);
    }
}
async function webdavRequest<T>(requestOptions: RequestOptionsWithState): Promise<HttpsResponse<HttpsResponseLegacy<T>>> {
    // Client not configured for digest authentication
    if (!requestOptions._digest) {
        return _request(requestOptions);
    }
    // Remove client's digest authentication object from request options
    const _digest = requestOptions._digest;
    delete requestOptions._digest;
    // If client is already using digest authentication, include the digest authorization header
    if (_digest.hasDigestAuth) {
        requestOptions = merge(requestOptions, {
            headers: {
                Authorization: generateDigestAuthHeader(requestOptions, _digest)
            }
        });
    }
    // Perform digest request + check
    const response = await _request(requestOptions);
    if (response.statusCode === 401) {
        _digest.hasDigestAuth = parseDigestAuth(response, _digest);
        if (_digest.hasDigestAuth) {
            requestOptions = merge(requestOptions, {
                headers: {
                    Authorization: generateDigestAuthHeader(requestOptions, _digest)
                }
            });
            const response2 = await _request(requestOptions);
            if (response2.statusCode === 401) {
                _digest.hasDigestAuth = false;
            } else {
                _digest.nc++;
            }
            return response2;
        }
    } else {
        _digest.nc++;
    }
    return response;
}
export { webdavRequest as request };
