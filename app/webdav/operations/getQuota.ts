import { SEPARATOR } from '~/utils/constants';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode, processResponsePayload } from '../response';
import { parseXML } from '../tools/dav';
import { parseQuota } from '../tools/quota';
import { DiskQuota, GetQuotaOptions, ResponseDataDetailed, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';

export async function getQuota(context: WebDAVClientContext, options: GetQuotaOptions = {}): Promise<DiskQuota | null | ResponseDataDetailed<DiskQuota | null>> {
    const pathStr = options.path || SEPARATOR;
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, pathStr),
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
    await handleResponseCode(context, response, requestOptions);
    const responseData = await response.content.toStringAsync();
    const result = await parseXML(responseData);
    const quota = parseQuota(result);
    return processResponsePayload(response, quota, options.details);
}
