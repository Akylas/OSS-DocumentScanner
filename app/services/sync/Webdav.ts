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

export async function testWebdavConnection({ remoteURL, username, password, remoteFolder, token, authType = null }): Promise<boolean> {
    try {
        const context = createContext(remoteURL, { password, username, authType: authType || AuthType.Password, token: token ? { access_token: token, token_type: 'Bearer' } : token });
        DEV_LOG && console.log('testConnection', context);
        await exists(context, '', { cachePolicy: 'noCache' });
        return true;
    } catch (error) {
        console.error(error, error.stack);
        return false;
    }
}

export function createWebdavConfig({ remoteURL, username, password, remoteFolder, authType = AuthType.Password, token, ...otherProps }: WebdavSyncOptions) {
    const context = createContext(remoteURL, { username, password, authType, token: token ? { access_token: token, token_type: 'bearer' } : undefined });
    return {
        remoteURL,
        username,
        headers: context.headers,
        remoteFolder,
        ha1: context.ha1 || context.digest?.ha1,
        authType,
        // password: authType === AuthType.Password ? password : undefined,
        token,
        ...otherProps
    };
}
