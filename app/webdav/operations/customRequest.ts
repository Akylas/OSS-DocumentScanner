import { encodePath } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { RequestOptions, Response, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';

export async function customRequest(context: WebDAVClientContext, remotePath: string, requestOptions: RequestOptions): Promise<Response> {
    if (!requestOptions.url) {
        requestOptions.url = path.join(context.remoteURL, encodePath(remotePath));
    }
    const finalOptions = prepareRequestOptions(requestOptions, context, {});
    const response = await request(finalOptions);
    await handleResponseCode(context, response, finalOptions);
    return response;
}
