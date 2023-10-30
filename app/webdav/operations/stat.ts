import { parseStat, parseXML } from '../tools/dav';
import { encodePath } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode, processResponsePayload } from '../response';
import { FileStat, ResponseDataDetailed, StatOptions, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';

export async function getStat(context: WebDAVClientContext, filename: string, options: StatOptions = {}): Promise<FileStat | ResponseDataDetailed<FileStat>> {
    const { details: isDetailed = false } = options;
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, encodePath(filename)),
            method: 'PROPFIND' as any,
            headers: {
                Accept: 'text/plain,application/xml',
                Depth: '0'
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response);
    const responseData = await response.content.toStringAsync();
    const result = await parseXML(responseData);
    const stat = parseStat(result, filename, isDetailed);
    return processResponsePayload(response, stat, isDetailed);
}
