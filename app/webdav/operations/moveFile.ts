import { encodePath, join } from '../tools/path';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { WebDAVClientContext, WebDAVMethodOptions } from '../types';
import { path } from '@nativescript/core';

export async function moveFile(context: WebDAVClientContext, filename: string, destination: string, options: WebDAVMethodOptions = {}) {
    const requestOptions = prepareRequestOptions(
        {
            url: join(context.remoteURL, encodePath(filename)),
            method: 'MOVE' as any,
            headers: {
                Destination: join(context.remoteURL, encodePath(destination))
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
}
