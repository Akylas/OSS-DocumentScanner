import { HttpsRequestOptions, HttpsResponse, HttpsResponseLegacy, request } from '@nativescript-community/https';
import { File } from '@nativescript/core';
import { wrapNativeHttpException } from '~/services/api';
import { OAuthProvider, OAuthTokens, isTokenExpired, refreshAccessToken } from './OAuthHelper';
import { ResponseData } from '~/services/sync/interfaces';
import { GetFileContentsOptions } from '~/webdav';

/**
 * OneDrive API configuration
 */
export const ONEDRIVE_PROVIDER: OAuthProvider = {
    name: 'OneDrive',
    config: {
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        // This is a placeholder client ID - users should configure their own
        clientId: '',
        redirectUri: 'com.akylas.documentscanner.oauth:/oauth2redirect',
        scope: 'files.readwrite offline_access',
        responseType: 'code'
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
    tokens: OAuthTokens,
    endpoint: string,
    options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
    } = {}
): Promise<HttpsResponse<HttpsResponseLegacy<T>>> {
    const { body, headers = {}, method = 'GET' } = options;

    // Check if token needs refresh
    if (isTokenExpired(tokens.expiresAt) && tokens.refreshToken) {
        const newTokens = await refreshAccessToken(ONEDRIVE_PROVIDER, tokens.refreshToken);
        Object.assign(tokens, newTokens);
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
        content: body
    } as HttpsRequestOptions;
    try {
        const response = await request<T>(requestOptions);

        if (response.statusCode >= 400) {
            throw new Error(`OneDrive API error: ${response.statusCode}`);
        }

        return response;
    } catch (error) {
        DEV_LOG && console.error('OneDrive request error:', error);
        throw wrapNativeHttpException(error, requestOptions);
    }
}

export async function getOneDriveRequestContents<U = any, V extends 'binary' | 'text' | 'json' | 'file' = 'json'>(
    tokens: OAuthTokens,
    fileId: string,
    httpOptions?: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
    },
    options: GetFileContentsOptions & { format?: V } = {}
): Promise<ResponseData<V, U>> {
    const { format = 'json' } = options;
    const response = await makeOneDriveRequest(tokens, fileId, httpOptions);
    let body;
    switch (format) {
        case 'binary':
            body = await response.content.toArrayBufferAsync();
            break;
        case 'text':
            body = await response.content.toStringAsync();
            break;
        case 'json':
            body = await response.content.toJSONAsync();
            break;
        case 'file':
            body = await response.content.toFile(options.destinationFilePath);
            break;
        default:
            throw new Error(`Invalid output format: ${format}`);
    }
    return body;
}

/**
 * Get or create a folder by path
 */
export async function getOrCreateFolder(tokens: OAuthTokens, folderPath: string): Promise<string> {
    const parts = folderPath.split('/').filter((p) => p);
    let currentId = 'root';

    for (const part of parts) {
        try {
            // Try to get the folder
            const response = await getOneDriveRequestContents<OneDriveItem>(tokens, `/items/${currentId}:/${part}`);
            currentId = response.id;
        } catch (error) {
            // Folder doesn't exist, create it
            const response = await getOneDriveRequestContents<OneDriveItem>(tokens, `/items/${currentId}/children`, {
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
export async function listItems(tokens: OAuthTokens, folderId: string): Promise<OneDriveItem[]> {
    const response = await getOneDriveRequestContents<{ value: OneDriveItem[] }>(tokens, `/items/${folderId}/children`);

    return response.value || [];
}

/**
 * Upload a file to OneDrive
 */
export async function uploadFile(tokens: OAuthTokens, fileName: string, content: string | ArrayBuffer | File, parentId: string): Promise<string> {
    // For small files (< 4MB), use simple upload
    const response = await getOneDriveRequestContents<OneDriveItem>(tokens, `/items/${parentId}:/${fileName}:/content`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        body: content
    });

    return response.id;
}

export async function downloadFile<U = any, V extends 'binary' | 'text' | 'json' | 'file' = 'json'>(
    tokens: OAuthTokens,
    fileId: string,
    options: GetFileContentsOptions & { format?: V } = {}
): Promise<ResponseData<V, U>> {
    const response = await getOneDriveRequestContents<{ '@microsoft.graph.downloadUrl': string }>(tokens, `/items/${fileId}`);

    // Download from the temporary download URL
    const downloadResponse = await request<string>({
        url: response['@microsoft.graph.downloadUrl'],
        method: 'GET'
    });

    const { format = 'json' } = options;
    let body;
    switch (format) {
        case 'binary':
            body = await downloadResponse.content.toArrayBufferAsync();
            break;
        case 'text':
            body = await downloadResponse.content.toStringAsync();
            break;
        case 'json':
            body = await downloadResponse.content.toJSONAsync();
            break;
        case 'file':
            body = await downloadResponse.content.toFile(options.destinationFilePath);
            break;
        default:
            throw new Error(`Invalid output format: ${format}`);
    }
    return body;
}

/**
 * Delete a file or folder
 */
export async function deleteItem(tokens: OAuthTokens, itemId: string): Promise<void> {
    await makeOneDriveRequest(tokens, `/items/${itemId}`, { method: 'DELETE' });
}

/**
 * Check if a file exists
 */
export async function itemExists(tokens: OAuthTokens, itemName: string, parentId: string): Promise<boolean> {
    try {
        await makeOneDriveRequest(tokens, `/items/${parentId}:/${itemName}`);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get item by path
 */
export async function getItemByPath(tokens: OAuthTokens, path: string, parentId: string = 'root'): Promise<OneDriveItem | null> {
    try {
        return getOneDriveRequestContents<OneDriveItem>(tokens, `/items/${parentId}:/${path}`);
    } catch (error) {
        return null;
    }
}

/**
 * Test OneDrive connection
 */
export async function testOneDriveConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
        await makeOneDriveRequest(tokens, '/');
        return true;
    } catch (error) {
        DEV_LOG && console.error('OneDrive connection test failed:', error);
        return false;
    }
}
