import { File, Folder, path } from '@nativescript/core';
import { type OCRDocument } from '~/models/OCRDocument';
import { networkService } from '~/services/api';
import { DocumentEvents } from '~/services/documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from '~/services/sync/BaseDataSyncService';
import { SERVICES_SYNC_MASK } from '~/services/sync/types';
import { basename } from '~/utils/path';
import { FileStat, GetFileContentsOptions, ResponseData } from '~/webdav';
import { GoogleDriveSyncOptions, deleteFile, downloadFile, getGoogleDriveRequestContents, getOrCreateFolder, listFiles, uploadFile } from './GoogleDrive';
import { OAuthTokens } from './OAuthHelper';

export interface GoogleDriveDataSyncOptions extends BaseDataSyncServiceOptions, GoogleDriveSyncOptions {}

export class GoogleDriveDataSyncService extends BaseDataSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'gdrive_data';
    type = GoogleDriveDataSyncService.type;
    syncMask = SERVICES_SYNC_MASK[GoogleDriveDataSyncService.type];
    remoteFolder: string;
    remoteFolderId: string; // Google Drive folder ID
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

    stop() {}

    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const service = GoogleDriveDataSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('GoogleDriveDataSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }

    override async ensureRemoteFolder() {
        DEV_LOG && console.log('ensureRemoteFolder', this.remoteFolder);
        if (!this.remoteFolderId) {
            this.remoteFolderId = await getOrCreateFolder(this.tokens, this.remoteFolder || 'DocumentScanner');
        }
    }

    override async getRemoteFolderDirectories(relativePath: string): Promise<FileStat[]> {
        const items = await this.getFiles(relativePath);

        // Convert Google Drive items to FileStat format
        return items.map(
            (item) =>
                ({
                    filename: path.join(relativePath || '', item.name),
                    basename: item.name,
                    lastmod: item.modifiedTime || new Date().toISOString(),
                    size: parseInt((item.size || 0) + '', 10),
                    type: item.mimeType === 'application/vnd.google-apps.folder' ? 'directory' : 'file',
                    mime: item.mimeType
                }) as FileStat
        );
    }

    async createDirectory(remotePath: string, recursive = true) {
        const pathParts = remotePath.split('/').filter((p) => p);
        let targetFolderId = this.remoteFolderId;

        for (const part of pathParts) {
            const files = await listFiles(this.tokens, targetFolderId);
            const folderItem = files.find((f) => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');

            if (!folderItem) {
                // Create folder
                const folderId = await getOrCreateFolder(this.tokens, part, targetFolderId);
                targetFolderId = folderId;
            } else {
                targetFolderId = folderItem.id;
            }
        }
        return targetFolderId;
    }

    override async sendFolderToRemote(folder: Folder, remoteRelativePath: string) {
        DEV_LOG && console.log('sendFolderToGDrive', folder.path, remoteRelativePath);

        // Get or create the target folder
        let targetFolderId = this.remoteFolderId;

        targetFolderId = await this.createDirectory(remoteRelativePath, false);

        // Upload files
        const entities = await folder.getEntities();
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            if (entity instanceof File) {
                // await this.putFileContents(path.join(remotePath, entity.name), entity.path);

                // const content = await entity.readText();
                await uploadFile(this.tokens, entity.name, entity, 'application/octet-stream', targetFolderId);
            } else {
                // Recursively upload subdirectory
                await this.sendFolderToRemote(Folder.fromPath(entity.path), path.join(remoteRelativePath, entity.name));
            }
        }
    }

    override async fileExists(filename: string) {
        // const parts = filename.split('/').filter((p) => p);
        // const fileName = parts.pop();

        // let folderId = this.remoteFolderId;
        // // Navigate to parent folder
        // for (const part of parts) {
        //     const files = await listFiles(this.tokens, folderId);
        //     const folder = files.find((f) => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
        //     if (!folder) {
        //         return false;
        //     }
        //     folderId = folder.id;
        // }

        return this.getFileId(filename) !== undefined;
    }

    override async getFileFromRemote(filename: string, document?: OCRDocument) {
        const fullPath = document ? path.join(document.id, filename) : filename;

        const fileId = await this.getFileId(fullPath);
        if (!fileId) {
            throw new Error(`File not found: ${fullPath}`);
        }

        const result = await downloadFile(this.tokens, fileId);
        DEV_LOG && console.log('getFileFromRemote', result);
        return result;
    }

    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        const folderId = await this.createDirectory(relativePath, true);
        const file = File.fromPath(localFilePath);
        // const content = await File.fromPath(localFilePath).readText();
        await uploadFile(this.tokens, file.name, file, 'application/octet-stream', folderId);
        // return this.putFileContentsFromData(relativePath, content, options);
    }

    override async putFileContentsFromData(relativePath: string, data: string, options?) {
        const parts = relativePath.split('/').filter((p) => p);
        const fileName = parts.pop();

        const folderId = await this.createDirectory(relativePath, true);

        await uploadFile(this.tokens, fileName, data, 'application/octet-stream', folderId);
    }

    async getFiles(relativePath: string) {
        let folderId = this.remoteFolderId;
        if (relativePath) {
            // Navigate to subdirectory
            const parts = relativePath.split('/').filter((p) => p);
            for (const part of parts) {
                const files = await listFiles(this.tokens, folderId);
                const folder = files.find((f) => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
                if (folder) {
                    folderId = folder.id;
                } else {
                    // Folder doesn't exist
                    return [];
                }
            }
        }

        return listFiles(this.tokens, folderId);
    }
    async getFileId(relativePath: string) {
        const fileName = basename(relativePath);

        const files = await this.getFiles(relativePath);
        const file = files.find((f) => f.name === fileName);
        if (file) {
            return file.id;
        }
    }

    override async deleteFile(relativePath: string) {
        const fileId = await this.getFileId(relativePath);
        if (fileId) {
            return deleteFile(this.tokens, fileId);
        }
    }

    override async getFileContents<V extends 'binary' | 'text' | 'file' | 'json' = 'json'>(filePath: string, options?: GetFileContentsOptions & { format?: V }): Promise<ResponseData<V>> {
        const fileId = await this.getFileId(filePath);
        if (fileId) {
            return getGoogleDriveRequestContents(this.tokens, fileId, undefined, options);
        }
        throw new Error(`file not found: ${filePath}`);
    }
}
