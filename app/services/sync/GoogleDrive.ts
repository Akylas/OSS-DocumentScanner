import { HttpsRequestOptions, HttpsResponse, HttpsResponseLegacy, request } from '@nativescript-community/https';
import { File } from '@nativescript/core';
import { wrapNativeHttpException } from '~/services/api';
import { BufferLike } from '~/services/sync/interfaces';
import { GetFileContentsOptions, ResponseData } from '~/webdav';
import { OAuthProvider, OAuthTokens, isTokenExpired, refreshAccessToken } from './OAuthHelper';

/**
 * Google Drive API configuration
 */
export const GOOGLE_DRIVE_PROVIDER: OAuthProvider = {
    name: 'Google Drive',
    config: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        // This is a placeholder client ID - users should configure their own
        clientId: GOOGLE_OAUTH_CLIENT_ID,
        redirectUri: 'com.akylas.documentscanner.oauth:/oauth2redirect',
        scope: 'https://www.googleapis.com/auth/drive.file',
        responseType: 'code'
    }
};

export interface GoogleDriveSyncOptions {
    remoteFolder?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
}

/**
 * Google Drive file metadata
 */
export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: number;
    modifiedTime?: string;
    parents?: string[];
}

/**
 * Make an authenticated request to Google Drive API
 */
export async function makeGoogleDriveRequest<T = any>(
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
        const newTokens = await refreshAccessToken(GOOGLE_DRIVE_PROVIDER, tokens.refreshToken);
        Object.assign(tokens, newTokens);
    }

    const url = endpoint.startsWith('http') ? endpoint : `https://www.googleapis.com/drive/v3${endpoint}`;
    const requestOptions = {
        url,
        method,
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            ...headers
        },
        content: body
    } as HttpsRequestOptions;
    try {
        const response = await request<T>(requestOptions);

        if (response.statusCode >= 400) {
            throw new Error(`Google Drive API error: ${response.statusCode}`);
        }

        return response;
    } catch (error) {
        DEV_LOG && console.error('Google Drive request error:', error);
        throw wrapNativeHttpException(error, requestOptions);
    }
}

/**
 * Get or create a folder by name
 */
export async function getOrCreateFolder(tokens: OAuthTokens, folderName: string, parentId: string = 'root'): Promise<string> {
    // Search for existing folder
    const searchQuery = `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const searchResponse = await getGoogleDriveRequestContents<{ files: GoogleDriveFile[] }>(tokens, `/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name)`);

    if (searchResponse.files && searchResponse.files.length > 0) {
        return searchResponse.files[0].id;
    }

    // Create folder if not found
    const createResponse = await getGoogleDriveRequestContents<GoogleDriveFile>(tokens, '/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId]
        })
    });

    return createResponse.id;
}

/**
 * List files in a folder
 */
export async function listFiles(tokens: OAuthTokens, folderId: string): Promise<GoogleDriveFile[]> {
    const query = `'${folderId}' in parents and trashed=false`;
    const response = await getGoogleDriveRequestContents<{ files: GoogleDriveFile[] }>(tokens, `/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,modifiedTime,parents)`);

    return response.files || [];
}

/**
 * Upload a file to Google Drive
 */
export async function uploadFile(tokens: OAuthTokens, fileName: string, content: string | BufferLike | File, mimeType: string, parentId: string): Promise<string> {
    // Create file metadata
    const metadata = {
        name: fileName,
        parents: [parentId]
    };

    // Use multipart upload
    // const boundary = '-------314159265358979323846';
    // const delimiter = `\r\n--${boundary}\r\n`;
    // const closeDelimiter = `\r\n--${boundary}--`;

    // const metadataPart = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata);
    // const contentPart = delimiter + `Content-Type: ${mimeType}\r\n\r\n` + content;

    // const multipartBody = metadataPart + contentPart + closeDelimiter;

    const response = await getGoogleDriveRequestContents<GoogleDriveFile>(tokens, 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data`
        },
        body: [
            {
                contentType: 'application/json; charset=UTF-8',
                fileName,
                data: JSON.stringify(metadata)
            },
            {
                contentType: mimeType,
                fileName,
                data: content
            }
        ]
    });

    return response.id;
}

export async function getGoogleDriveRequestContents<U = any, V extends 'binary' | 'text' | 'json' | 'file' = 'json'>(
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
    const response = await makeGoogleDriveRequest(tokens, fileId, httpOptions);
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
 * Download file content
 */
export async function downloadFile(tokens: OAuthTokens, fileId: string): Promise<string> {
    return getGoogleDriveRequestContents<string>(tokens, `/files/${fileId}?alt=media`);
}

/**
 * Delete a file
 */
export async function deleteFile(tokens: OAuthTokens, fileId: string): Promise<void> {
    await makeGoogleDriveRequest(tokens, `/files/${fileId}`, { method: 'DELETE' });
}

/**
 * Check if a file exists
 */
export async function fileExists(tokens: OAuthTokens, fileName: string, parentId: string): Promise<boolean> {
    const query = `name='${fileName}' and '${parentId}' in parents and trashed=false`;
    const response = await getGoogleDriveRequestContents<{ files: GoogleDriveFile[] }>(tokens, `/files?q=${encodeURIComponent(query)}&fields=files(id)`);

    return response.files && response.files.length > 0;
}

/**
 * Test Google Drive connection
 */
export async function testGoogleDriveConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
        await makeGoogleDriveRequest(tokens, '/about?fields=user');
        return true;
    } catch (error) {
        DEV_LOG && console.error('Google Drive connection test failed:', error);
        return false;
    }
}
