import { File, Folder, path } from '@nativescript/core';
import { type OCRDocument } from '~/models/OCRDocument';
import { networkService } from '~/services/api';
import { DocumentEvents } from '~/services/documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from '~/services/sync/BaseDataSyncService';
import { SERVICES_SYNC_MASK } from '~/services/sync/types';
import { FileStat, GetFileContentsOptions, ResponseData } from '~/webdav';
import { OAuthTokens } from './OAuthHelper';
import { OneDriveSyncOptions, deleteItem, downloadFile, getItemByPath, getOneDriveRequestContents, getOrCreateFolder, listItems, uploadFile } from './OneDrive';

export interface OneDriveDataSyncOptions extends BaseDataSyncServiceOptions, OneDriveSyncOptions {}

/**
 * OneDrive Data Sync Service
 * Syncs document data and folder structures to OneDrive
 */
export class OneDriveDataSyncService extends BaseDataSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'onedrive_data';
    type = OneDriveDataSyncService.type;
    syncMask = SERVICES_SYNC_MASK[OneDriveDataSyncService.type];
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

    stop() {}

    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const service = OneDriveDataSyncService.getOrCreateInstance();
            Object.assign(service, config);
            // DEV_LOG && console.log('OneDriveDataSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }

    override async ensureRemoteFolder() {
        // DEV_LOG && console.log('ensureRemoteFolder', this.remoteFolder);
        if (!this.remoteFolderId) {
            this.remoteFolderId = await getOrCreateFolder(this.tokens, this.remoteFolder);
        }
    }
    getItemByPath(path: string) {
        return getItemByPath(this.tokens, path, this.remoteFolderId, this.remoteFolder);
    }
    override async getRemoteFolderDirectories(relativePath: string): Promise<FileStat[]> {
        const item = relativePath ? await this.getItemByPath(relativePath) : { id: this.remoteFolderId };

        if (!item) {
            return [];
        }

        const items = await listItems(this.tokens, item.id);

        return items.map(
            (item) =>
                ({
                    filename: path.join(relativePath || '', item.name),
                    basename: item.name,
                    lastmod: item.lastModifiedDateTime || new Date().toISOString(),
                    size: item.size || 0,
                    type: item.folder ? 'directory' : 'file',
                    mime: item.file?.mimeType
                }) as FileStat
        );
    }

    override async sendFolderToRemote(folder: Folder, remoteRelativePath: string) {
        const remotePath = path.join(this.remoteFolder, remoteRelativePath);
        // Get or create target folder
        const targetItem = await this.getItemByPath(remotePath);
        // DEV_LOG && console.warn('sendFolderToOneDrive', folder.path, remotePath, this.remoteFolderId, targetItem?.id);
        const targetFolderId = targetItem?.id || (await getOrCreateFolder(this.tokens, remotePath));

        const entities = await folder.getEntities();
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            if (entity instanceof File) {
                await uploadFile(this.tokens, entity.name, entity, targetFolderId);
            } else {
                await this.sendFolderToRemote(Folder.fromPath(entity.path), path.join(remoteRelativePath, entity.name));
            }
        }
    }

    override async fileExists(filename: string) {
        const item = await this.getItemByPath(filename);
        return !!item;
    }

    override async getFileFromRemote(filename: string, document?: OCRDocument) {
        const remoteDocPath = document ? path.join(this.remoteFolder, document.id) : this.remoteFolder;
        const fullPath = path.join(remoteDocPath, filename);
        // DEV_LOG && console.log('getFileFromRemote', fullPath, remoteDocPath, this.remoteFolderId);
        const item = await this.getItemByPath(fullPath);

        if (!item) {
            throw new Error(`File not found: ${fullPath}`);
        }

        const result = await downloadFile(this.tokens, item.id, { format: 'text' });
        return result;
    }

    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        // const content = await File.fromPath(localFilePath).readText();
        // return this.putFileContentsFromData(relativePath, content, options);
        // DEV_LOG && console.log('putFileContents', relativePath, localFilePath);

        const parts = relativePath.split('/').filter((p) => p);
        const fileName = parts.pop();

        const parentPath = parts.join('/');
        const parentItem = parentPath ? await this.getItemByPath(parentPath) : { id: this.remoteFolderId };

        const parentId = parentItem?.id || (await getOrCreateFolder(this.tokens, parentPath));
        const file = File.fromPath(localFilePath);

        await uploadFile(this.tokens, file.name, file, parentId);
    }

    override async putFileContentsFromData(relativePath: string, data: string, options?) {
        // DEV_LOG && console.log('putFileContentsFromData', relativePath);
        const parts = relativePath.split('/').filter((p) => p);
        const fileName = parts.pop();

        const parentPath = parts.join('/');
        const parentItem = parentPath ? await this.getItemByPath(parentPath) : { id: this.remoteFolderId };

        const parentId = parentItem?.id || (await getOrCreateFolder(this.tokens, parentPath));
        await uploadFile(this.tokens, fileName, data, parentId);
    }

    override async deleteFile(relativePath: string) {
        const item = await this.getItemByPath(relativePath);
        if (item) {
            await deleteItem(this.tokens, item.id);
        }
    }
    override async getFileContents<V extends 'binary' | 'text' | 'file' | 'json' = 'json'>(filePath: string, options?: GetFileContentsOptions & { format?: V }): Promise<ResponseData<V>> {
        const item = await this.getItemByPath(filePath);

        if (!item) {
            throw new Error(`File not found: ${filePath}`);
        }
        return getOneDriveRequestContents(this.tokens, item.id, undefined, options);
    }
}
