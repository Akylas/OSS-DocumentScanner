import { File } from '@nativescript/core';
import { HttpRequestOptions, request } from '~/services/api';
import { ResponseData } from '~/services/sync/interfaces';
import { GetFileContentsOptions } from '~/webdav';
import { OAuthProvider, OAuthTokens, isTokenExpired, refreshAccessToken } from '../OAuthHelper';
import { BaseSyncService } from '~/services/sync/BaseSyncService';

export interface OneDriveSyncService extends BaseSyncService {
    remoteFolder: string;
    remoteFolderId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;

    tokens: OAuthTokens;
}

/**
 * OneDrive API configuration
 */
export const ONEDRIVE_PROVIDER: OAuthProvider = {
    name: 'OneDrive',
    config: {
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        // This is a placeholder client ID - users should configure their own
        clientId: ONEDRIVE_OAUTH_CLIENT_ID,
        clientSecret: ONEDRIVE_OAUTH_CLIENT_SECRET,
        redirectUri: 'http://localhost/oauth2redirect',
        scope: 'files.readwrite offline_access',
        responseType: 'code',
        prompt: 'select_account'
    }
};

export interface OneDriveSyncOptions {
    remoteFolder?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
}

/**
 * OneDrive item metadata
 */
export interface OneDriveItem {
    id: string;
    name: string;
    size?: number;
    lastModifiedDateTime?: string;
    folder?: {
        childCount: number;
    };
    file?: {
        mimeType: string;
    };
    parentReference?: {
        id: string;
        path: string;
    };
}

/**
 * Make an authenticated request to OneDrive API
 */
export async function makeOneDriveRequest<T = any>(
    service: OneDriveSyncService,
    endpoint: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
    } = {}
) {
    const { body, headers = {}, method = 'GET' } = options;
    const tokens = service.tokens;
    // Check if token needs refresh
    if (service.updateSettings && isTokenExpired(tokens.expiresAt) && tokens.refreshToken) {
        // DEV_LOG && console.info('refreshAccessToken', tokens.expiresAt);
        const newTokens = await refreshAccessToken(ONEDRIVE_PROVIDER, tokens.refreshToken);
        Object.assign(tokens, newTokens);
        service.updateSettings(tokens);
    }

    const url = endpoint.startsWith('http') ? endpoint : `https://graph.microsoft.com/v1.0/me/drive${endpoint}`;

    const requestOptions = {
        url,
        method,
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            ...headers
        },
        responseOnMainThread: false,
        body
    } as HttpRequestOptions;
    return request<T>(requestOptions);
}

export async function getOneDriveRequestContents<U = any, V extends 'binary' | 'text' | 'json' | 'file' = 'json'>(
    service: OneDriveSyncService,
    fileId: string,
    httpOptions?: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
    },
    options: GetFileContentsOptions & { format?: V } = {}
) {
    const { format = 'json' } = options;
    const response = await makeOneDriveRequest(service, fileId, httpOptions);
    switch (format) {
        case 'binary':
            return response.binary();
        case 'text':
            return response.text();
        case 'file':
            return response.file(options.destinationFilePath);
        case 'json':
        default:
            return response.json();
    }
}

/**
 * Get or create a folder by path
 */
export async function getOrCreateFolder(service: OneDriveSyncService, folderPath: string): Promise<string> {
    const parts = folderPath.split('/').filter((p) => p);
    let currentId = 'root';
    for (const part of parts) {
        try {
            // Try to get the folder
            const response = await getOneDriveRequestContents<OneDriveItem>(service, `/items/${currentId}:/${part}`);
            currentId = response.id;
        } catch (error) {
            // Folder doesn't exist, create it
            const response = await getOneDriveRequestContents<OneDriveItem>(service, `/items/${currentId}/children`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: part,
                    folder: {},
                    '@microsoft.graph.conflictBehavior': 'fail'
                })
            });
            currentId = response.id;
        }
    }

    return currentId;
}

/**
 * List items in a folder
 */
export async function listItems(service: OneDriveSyncService, folderId: string): Promise<OneDriveItem[]> {
    const response = await getOneDriveRequestContents<{ value: OneDriveItem[] }>(service, `/items/${folderId}/children`);

    return response.value || [];
}

/**
 * Upload a file to OneDrive
 */
export async function uploadFile(service: OneDriveSyncService, fileName: string, content: string | ArrayBuffer | File, parentId: string): Promise<string> {
    // DEV_LOG && console.log('uploadFile', fileName, parentId);
    const response = await getOneDriveRequestContents<OneDriveItem>(service, `/items/${parentId}:/${fileName}:/content`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        body: content
    });

    return response.id;
}

export async function downloadFile<U = any, V extends 'binary' | 'text' | 'json' | 'file' = 'json'>(
    service: OneDriveSyncService,
    fileId: string,
    options: GetFileContentsOptions & { format?: V } = {}
): Promise<ResponseData<V>> {
    const response = await getOneDriveRequestContents<{ '@microsoft.graph.downloadUrl': string }>(service, `/items/${fileId}`);

    // Download from the temporary download URL
    const downloadResponse = await request<ResponseData<V>>({
        url: response['@microsoft.graph.downloadUrl'],
        responseOnMainThread: false,
        method: 'GET'
    });
    const { format = 'json' } = options;
    switch (format) {
        case 'binary':
            return downloadResponse.binary() as Promise<ResponseData<V>>;
        case 'text':
            return downloadResponse.text() as Promise<ResponseData<V>>;
        case 'file':
            return downloadResponse.file(options.destinationFilePath) as Promise<ResponseData<V>>;
        case 'json':
        default:
            return downloadResponse.json();
    }
}

/**
 * Delete a file or folder
 */
export async function deleteItem(service: OneDriveSyncService, itemId: string): Promise<void> {
    await makeOneDriveRequest(service, `/items/${itemId}`, { method: 'DELETE' });
}

/**
 * Check if a file exists
 */
export async function itemExists(service: OneDriveSyncService, itemName: string, parentId: string): Promise<boolean> {
    try {
        await makeOneDriveRequest(service, `/items/${parentId}:/${itemName}`);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get item by path
 */
export async function getItemByPath(service: OneDriveSyncService, path: string, parentId: string = 'root', remoteFolder?: string): Promise<OneDriveItem | null> {
    try {
        const startPath = `${remoteFolder}/`;
        if (remoteFolder && path.startsWith(startPath)) {
            path = path.slice(startPath.length);
        }
        const result = await getOneDriveRequestContents<OneDriveItem>(service, `/items/${parentId}:/${path}`);
        return result;
    } catch (error) {
        return null;
    }
}

/**
 * Test OneDrive connection
 */
export async function testOneDriveConnection(service: OneDriveSyncService): Promise<boolean> {
    try {
        await makeOneDriveRequest(service, '/');
        return true;
    } catch (error) {
        DEV_LOG && console.error('OneDrive connection test failed:', error, error.stack);
        return false;
    }
}
