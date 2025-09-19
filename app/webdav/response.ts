import { HTTPError } from '@shared/utils/error';
import { parseRawXML } from './tools/dav';
import { Response, ResponseDataDetailed, WebDAVClientContext } from './types';
import { lc } from '@nativescript-community/l';

export async function createErrorFromResponse(response: Response, requestParams, prefix: string = '') {
    const serverResponse = await response.content.toStringAsync();
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

export async function handleResponseCode(context: WebDAVClientContext, response: Response, requestOptions) {
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
export function processResponsePayload<T, U extends boolean = false>(response: Response, data: T, isDetailed?: U): U extends true ? ResponseDataDetailed<T> : T {
    return (
        isDetailed === true
            ? {
                  data,
                  headers: response.headers,
                  status: response.statusCode,
                  statusText: response.reason
              }
            : data
    ) as U extends true ? ResponseDataDetailed<T> : T;
}
