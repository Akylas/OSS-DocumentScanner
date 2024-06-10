import { parseSearch, parseXML } from '../tools/dav';
import { encodePath } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode, processResponsePayload } from '../response';
import { ResponseDataDetailed, SearchOptions, SearchResult, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';

export async function getSearch(context: WebDAVClientContext, searchArbiter: string, options: SearchOptions = {}): Promise<SearchResult | ResponseDataDetailed<SearchResult>> {
    const { details: isDetailed = false } = options;
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, encodePath(searchArbiter)),
            method: 'SEARCH' as any,
            headers: {
                Accept: 'text/plain,application/xml',
                // Ensure a Content-Type header is set was this is required by e.g. sabre/dav
                'Content-Type': context.headers['Content-Type'] || 'application/xml; charset=utf-8'
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
    const responseText = await response.content.toStringAsync();
    const responseData = await parseXML(responseText);
    const results = parseSearch(responseData, searchArbiter, isDetailed);
    return processResponsePayload(response, results, isDetailed);
}
