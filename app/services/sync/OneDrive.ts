import { request } from '@nativescript-community/https';
import { wrapNativeHttpException } from '~/services/api';
import { OAuthProvider, OAuthTokens, isTokenExpired, refreshAccessToken } from './OAuthHelper';

/**
 * OneDrive API configuration
 */
export const ONEDRIVE_PROVIDER: OAuthProvider = {
    name: 'OneDrive',
    config: {
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        // This is a placeholder client ID - users should configure their own
        clientId: 'YOUR_ONEDRIVE_CLIENT_ID',
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
): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    
    // Check if token needs refresh
    if (isTokenExpired(tokens.expiresAt) && tokens.refreshToken) {
        const newTokens = await refreshAccessToken(ONEDRIVE_PROVIDER, tokens.refreshToken);
        Object.assign(tokens, newTokens);
    }

    const url = endpoint.startsWith('http') ? endpoint : `https://graph.microsoft.com/v1.0/me/drive${endpoint}`;
    
    try {
        const response = await request<T>({
            url,
            method,
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                ...headers
            },
            content: body
        });

        if (response.statusCode >= 400) {
            throw new Error(`OneDrive API error: ${response.statusCode}`);
        }

        return response.content as T;
    } catch (error) {
        DEV_LOG && console.error('OneDrive request error:', error);
        throw wrapNativeHttpException(error, { url, method });
    }
}

/**
 * Get or create a folder by path
 */
export async function getOrCreateFolder(tokens: OAuthTokens, folderPath: string): Promise<string> {
    const parts = folderPath.split('/').filter(p => p);
    let currentId = 'root';
    
    for (const part of parts) {
        try {
            // Try to get the folder
            const response = await makeOneDriveRequest<OneDriveItem>(
                tokens,
                `/items/${currentId}:/${part}`
            );
            currentId = response.id;
        } catch (error) {
            // Folder doesn't exist, create it
            const response = await makeOneDriveRequest<OneDriveItem>(
                tokens,
                `/items/${currentId}/children`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: part,
                        folder: {},
                        '@microsoft.graph.conflictBehavior': 'fail'
                    })
                }
            );
            currentId = response.id;
        }
    }
    
    return currentId;
}

/**
 * List items in a folder
 */
export async function listItems(tokens: OAuthTokens, folderId: string): Promise<OneDriveItem[]> {
    const response = await makeOneDriveRequest<{ value: OneDriveItem[] }>(
        tokens,
        `/items/${folderId}/children`
    );

    return response.value || [];
}

/**
 * Upload a file to OneDrive
 */
export async function uploadFile(
    tokens: OAuthTokens,
    fileName: string,
    content: string | ArrayBuffer,
    parentId: string
): Promise<string> {
    // For small files (< 4MB), use simple upload
    const response = await makeOneDriveRequest<OneDriveItem>(
        tokens,
        `/items/${parentId}:/${fileName}:/content`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: content
        }
    );

    return response.id;
}

/**
 * Download file content
 */
export async function downloadFile(tokens: OAuthTokens, fileId: string): Promise<string> {
    const response = await makeOneDriveRequest<{ '@microsoft.graph.downloadUrl': string }>(
        tokens,
        `/items/${fileId}`
    );

    // Download from the temporary download URL
    const downloadResponse = await request<string>({
        url: response['@microsoft.graph.downloadUrl'],
        method: 'GET'
    });

    return downloadResponse.content as string;
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
        return await makeOneDriveRequest<OneDriveItem>(tokens, `/items/${parentId}:/${path}`);
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
