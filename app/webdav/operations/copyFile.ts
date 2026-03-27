import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { encodePath, join } from '../tools/path';
import { WebDAVClientContext, WebDAVMethodOptions } from '../types';

export async function copyFile(context: WebDAVClientContext, filename: string, destination: string, options: WebDAVMethodOptions = {}) {
    const requestOptions = prepareRequestOptions(
        {
            url: join(context.remoteURL, encodePath(filename)),
            method: 'COPY' as any,
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
