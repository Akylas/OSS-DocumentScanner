import { AuthType, Headers, createContext } from '~/webdav';
import { exists } from '~/webdav/operations/exists';

export interface WebdavSyncOptions {
    remoteURL: string;
    username?: string;
    password?: string;
    remoteFolder: string;
    authType: AuthType;
    token?: string;
    headers?: Headers;
}

export async function testWebdavConnection({ authType = null, password, remoteFolder, remoteURL, token, username }): Promise<boolean> {
    try {
        const context = createContext(remoteURL, { password, username, authType: authType || AuthType.Password, token: token ? { access_token: token, token_type: 'Bearer' } : token });
        await exists(context, '', { cachePolicy: 'noCache' });
        return true;
    } catch (error) {
        console.error(error, error.stack);
        return false;
    }
}

export function createWebdavConfig({ authType = AuthType.Password, password, remoteFolder, remoteURL, token, username, ...otherProps }: WebdavSyncOptions) {
    const context = createContext(remoteURL, { username, password, authType, token: token ? { access_token: token, token_type: 'bearer' } : undefined });
    return {
        remoteURL,
        username,
        remoteFolder,
        authType,
        token,
        ...otherProps,
        headers: context.headers,
        ha1: context.ha1 || context.digest?.ha1
    };
}
