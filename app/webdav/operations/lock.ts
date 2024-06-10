import nestedProp from 'nested-property';
import { encodePath } from '../tools/path';
import { generateLockXML, parseGenericResponse } from '../tools/xml';
import { prepareRequestOptions, request } from '../request';
import { createErrorFromResponse, handleResponseCode } from '../response';
import { Headers, LockOptions, LockResponse, WebDAVClientContext, WebDAVMethodOptions } from '../types';
import { path } from '@nativescript/core';

const DEFAULT_TIMEOUT = 'Infinite, Second-4100000000';

export async function lock(context: WebDAVClientContext, pathStr: string, options: LockOptions = {}): Promise<LockResponse> {
    const { refreshToken, timeout = DEFAULT_TIMEOUT } = options;
    const headers: Headers = {
        Accept: 'text/plain,application/xml',
        Timeout: timeout + ''
    };
    if (refreshToken) {
        headers.If = refreshToken;
    }
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, encodePath(pathStr)),
            method: 'LOCK' as any,
            headers,
            data: generateLockXML(context.contactHref)
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
    const responseData = await response.content.toStringAsync();
    const lockPayload = parseGenericResponse(responseData);
    const token = nestedProp.get(lockPayload, 'prop.lockdiscovery.activelock.locktoken.href');
    const serverTimeout = nestedProp.get(lockPayload, 'prop.lockdiscovery.activelock.timeout');
    if (!token) {
        const err = createErrorFromResponse(response, requestOptions, 'No lock token received: ');
        throw err;
    }
    return {
        token,
        serverTimeout
    };
}

export async function unlock(context: WebDAVClientContext, pathStr: string, token: string, options: WebDAVMethodOptions = {}): Promise<void> {
    const requestOptions = prepareRequestOptions(
        {
            url: path.join(context.remoteURL, encodePath(pathStr)),
            method: 'UNLOCK' as any,
            headers: {
                'Lock-Token': token
            }
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
    if (response.statusCode !== 204 && response.statusCode !== 200) {
        const err = createErrorFromResponse(response, requestOptions);
        throw err;
    }
}
