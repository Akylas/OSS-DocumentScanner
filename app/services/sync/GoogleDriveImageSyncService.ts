import { File, ImageSource, knownFolders, path } from '@nativescript/core';
import { saveImage } from '~/utils/utils';
import { FileStat } from '~/webdav';
import { networkService } from '../api';
import { DocumentEvents } from '../documents';
import { BaseImageSyncService, BaseImageSyncServiceOptions } from './BaseImageSyncService';
import { SERVICES_SYNC_MASK } from './types';
import type { DocFolder } from '~/models/OCRDocument';
import { GoogleDriveSyncOptions, getOrCreateFolder, listFiles, uploadFile } from './GoogleDrive';
import { OAuthTokens } from './OAuthHelper';

export interface GoogleDriveImageSyncServiceOptions extends BaseImageSyncServiceOptions, GoogleDriveSyncOptions {}

export class GoogleDriveImageSyncService extends BaseImageSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'gdrive_image';
    type = GoogleDriveImageSyncService.type;
    syncMask = SERVICES_SYNC_MASK[GoogleDriveImageSyncService.type];
    remoteFolder: string;
    remoteFolderId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;

    private get tokens(): OAuthTokens {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresAt: this.expiresAt
        };
    }

    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const service = GoogleDriveImageSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('GoogleDriveImageSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }

    override stop() {}

    override async ensureRemoteFolder(remoteFolder = this.remoteFolder) {
        if (!this.remoteFolderId) {
            this.remoteFolderId = await getOrCreateFolder(this.tokens, remoteFolder || 'DocumentScanner');
        } else if (remoteFolder !== this.remoteFolder) {
            // Navigate to or create subfolder
            await getOrCreateFolder(this.tokens, remoteFolder, this.remoteFolderId);
        }
    }

    override async getRemoteFolderFiles(relativePath: string): Promise<FileStat[]> {
        let folderId = this.remoteFolderId;
        
        if (relativePath) {
            const parts = relativePath.split('/').filter(p => p);
            for (const part of parts) {
                const files = await listFiles(this.tokens, folderId);
                const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
                if (!folder) {
                    return [];
                }
                folderId = folder.id;
            }
        }

        const items = await listFiles(this.tokens, folderId);
        
        return items
            .filter(item => item.mimeType !== 'application/vnd.google-apps.folder')
            .map(item => ({
                filename: path.join(relativePath || '', item.name),
                basename: item.name,
                lastmod: item.modifiedTime || new Date().toISOString(),
                size: parseInt(item.size || '0', 10),
                type: 'file' as const,
                mime: item.mimeType
            }));
    }

    override async writeImage(imageSource: ImageSource, fileName: string, imageFormat: 'png' | 'jpeg' | 'jpg', imageQuality: number, overwrite: boolean, docFolder?: DocFolder) {
        const temp = knownFolders.temp().path;
        await saveImage(imageSource, {
            exportDirectory: temp,
            fileName,
            imageFormat,
            imageQuality,
            overwrite
        });
        const localFilePath = path.join(temp, fileName);
        
        let targetFolderId = this.remoteFolderId;
        if (docFolder) {
            targetFolderId = await getOrCreateFolder(this.tokens, docFolder.name, this.remoteFolderId);
        }

        const file = File.fromPath(localFilePath);
        const content = await file.readText('base64');
        const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
        
        await uploadFile(this.tokens, fileName, content, mimeType, targetFolderId);
        
        // Clean up temp file
        try {
            file.remove();
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}
