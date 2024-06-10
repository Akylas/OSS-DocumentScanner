import { File } from '@nativescript/core';
import { fromBase64 } from '../tools/encode';
import { encodePath } from '../tools/path';
import { calculateDataLength } from '../tools/size';
import { prepareRequestOptions, request } from '../request';
import { handleResponseCode } from '../response';
import { AuthType, BufferLike, ErrorCode, Headers, PutFileContentsOptions, WebDAVClientContext } from '../types';
import { path } from '@nativescript/core';
import { HTTPError } from '~/utils/error';

export async function putFileContents(context: WebDAVClientContext, filePath: string, data: string | BufferLike | File, options: PutFileContentsOptions = {}): Promise<boolean> {
    DEV_LOG && console.log('putFileContents', filePath, data);
    const { contentLength = true, overwrite = true } = options;
    const headers: Headers = {
        'Content-Type': 'application/octet-stream'
    };
    // if (typeof Stream !== 'undefined' && typeof Stream?.Readable !== 'undefined' && data instanceof Stream.Readable) {
    //     // Skip, no content-length
    // } else
    if (contentLength === false) {
        // Skip, disabled
    } else if (typeof contentLength === 'number') {
        headers['Content-Length'] = `${contentLength}`;
    } else {
        headers['Content-Length'] = `${calculateDataLength(data)}`;
    }
    if (!overwrite) {
        headers['If-None-Match'] = '*';
    }
    const requestOptions = prepareRequestOptions(
        {
            url: filePath.startsWith('http') ? filePath : path.join(context.remoteURL, encodePath(filePath)),
            method: 'PUT',
            headers,
            data
        },
        context,
        options
    );
    const response = await request(requestOptions);
    try {
        await handleResponseCode(context, response, requestOptions);
    } catch (err) {
        const error = err as HTTPError;
        if (error.statusCode === 412 && !overwrite) {
            return false;
        } else {
            throw error;
        }
    }
    return true;
}

export function getFileUploadLink(context: WebDAVClientContext, filePath: string): string {
    let url: string = `${path.join(context.remoteURL, encodePath(filePath))}?Content-Type=application/octet-stream`;
    const protocol = /^https:/i.test(url) ? 'https' : 'http';
    switch (context.authType) {
        case AuthType.None:
            // Do nothing
            break;
        case AuthType.Password: {
            const authPart = context.headers.Authorization.replace(/^Basic /i, '').trim();
            const authContents = fromBase64(authPart);
            url = url.replace(/^https?:\/\//, `${protocol}://${authContents}@`);
            break;
        }
        default:
            throw new Error(`Unsupported auth type for file link: ${context.authType}`);
    }
    return url;
}
