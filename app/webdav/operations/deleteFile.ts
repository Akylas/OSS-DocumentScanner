import { encodePath } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { WebDAVClientContext, WebDAVMethodOptions } from '../types';
import { path } from '@nativescript/core';

export async function deleteFile(context: WebDAVClientContext, filename: string, options: WebDAVMethodOptions = {}) {
    const requestOptions = prepareRequestOptions(
        {
            url: filename.startsWith('http') ? filename : path.join(context.remoteURL, encodePath(filename)),
            method: 'DELETE'
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
}
