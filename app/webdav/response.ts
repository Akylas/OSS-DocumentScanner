import { HTTPError } from '@akylas/nativescript-app-utils/error';
import { parseRawXML } from './tools/dav';
import { Response, ResponseDataDetailed, WebDAVClientContext } from './types';
import { lc } from '@nativescript-community/l';
import { RequestResponse } from '~/services/api';

export async function createErrorFromResponse(response: RequestResponse, requestParams, prefix: string = '') {
    const serverResponse = await response.text();
    const result = await parseRawXML(serverResponse);

    let error = result.error?.message;
    if (!error && result.html) {
        error = result.html?.head?.title + (result.html?.body?.p ? ': ' + result.html?.body?.p : '');
    }
    return new HTTPError({
        statusCode: response.statusCode,
        title: lc('webdav_error'),
        message: prefix + (error || serverResponse),
        requestParams
    });
}

export async function handleResponseCode<T = any>(context: WebDAVClientContext, response: RequestResponse<T>, requestOptions) {
    const { statusCode } = response;
    // if (statusCode === 401 && context.digest) return response;
    if (statusCode >= 400) {
        const err = await createErrorFromResponse(response, requestOptions);
        throw err;
    }
    return response;
}

// export function processGlobFilter(files: FileStat[], glob: string): FileStat[] {
//     return files.filter((file) => minimatch(file.filename, glob, { matchBase: true }));
// }

/**
 * Process a response payload (eg. from `customRequest`) and
 *  prepare it for further processing. Exposed for custom
 *  request handling.
 * @param response The response for a request
 * @param data The data returned
 * @param isDetailed Whether or not a detailed result is
 *  requested
 * @returns The response data, or a detailed response object
 *  if required
 */
export function processResponsePayload<T, U extends boolean = false>(response: RequestResponse<T>, data: T, isDetailed?: U): U extends true ? ResponseDataDetailed<T> : T {
    const httpResponse = response.response;
    return (
        isDetailed === true
            ? {
                  data,
                  headers: httpResponse.headers,
                  status: response.statusCode,
                  statusText: httpResponse.reason
              }
            : data
    ) as U extends true ? ResponseDataDetailed<T> : T;
}
