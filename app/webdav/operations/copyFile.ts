import { encodePath } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { WebDAVClientContext, WebDAVMethodOptions } from '../types';
import { path } from '@nativescript/core';

export async function copyFile(context: WebDAVClientContext, filename: string, destination: string, options: WebDAVMethodOptions = {}) {
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, encodePath(filename)),
            method: 'COPY' as any,
            headers: {
                Destination: path.join(context.remoteURL, encodePath(destination))
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
}
