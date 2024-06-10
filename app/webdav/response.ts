import { HTTPError } from '~/utils/error';
import { parseRawXML } from './tools/dav';
import { Response, ResponseDataDetailed, WebDAVClientContext } from './types';

export async function createErrorFromResponse(response: Response, requestParams, prefix: string = '') {
    const result = await parseRawXML(await response.content.toStringAsync());
    // console.log('createErrorFromResponse', response.statusCode, await response.content.toStringAsync(), JSON.stringify(result));

    return new HTTPError({
        statusCode: response.statusCode,
        message: prefix + result.error?.message,
        requestParams
    });
}

export async function handleResponseCode(context: WebDAVClientContext, response: Response, requestOptions) {
    const { statusCode } = response;
    // DEV_LOG && console.log('handleResponseCode', response.statusCode, response.headers);
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
    return isDetailed === true
        ? {
              data,
              headers: response.headers,
              status: response.statusCode,
              statusText: response.reason
          }
        : (data as any);
}
