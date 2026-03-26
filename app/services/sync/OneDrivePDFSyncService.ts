import { File, knownFolders, path } from '@nativescript/core';
import { FileStat } from '~/webdav';
import { networkService } from '../api';
import { DocumentEvents } from '../documents';
import { BasePDFSyncService, BasePDFSyncServiceOptions } from './BasePDFSyncService';
import { SERVICES_SYNC_MASK } from './types';
import type { DocFolder, OCRDocument } from '~/models/OCRDocument';
import { OneDriveSyncOptions, getItemByPath, getOrCreateFolder, listItems, uploadFile } from './OneDrive';
import { OAuthTokens } from './OAuthHelper';

export interface OneDrivePDFSyncServiceOptions extends BasePDFSyncServiceOptions, OneDriveSyncOptions {}

export class OneDrivePDFSyncService extends BasePDFSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'onedrive_pdf';
    type = OneDrivePDFSyncService.type;
    syncMask = SERVICES_SYNC_MASK[OneDrivePDFSyncService.type];
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
            const service = OneDrivePDFSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('OneDrivePDFSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }

    override stop() {}

    override async ensureRemoteFolder(remoteFolder = this.remoteFolder) {
        if (!this.remoteFolderId) {
            this.remoteFolderId = await getOrCreateFolder(this.tokens, remoteFolder || 'DocumentScanner');
        }
    }

    override async getRemoteFolderFiles(relativePath: string): Promise<FileStat[]> {
        const item = relativePath ? await getItemByPath(this.tokens, relativePath, this.remoteFolderId) : { id: this.remoteFolderId };

        if (!item) {
            return [];
        }

        const items = await listItems(this.tokens, item.id);

        return items
            .filter((item) => !item.folder && item.name.endsWith('.pdf'))
            .map((item) => ({
                filename: path.join(relativePath || '', item.name),
                basename: item.name,
                lastmod: item.lastModifiedDateTime || new Date().toISOString(),
                size: item.size || 0,
                type: 'file' as const,
                mime: 'application/pdf'
            }));
    }

    override async writePDF(document: OCRDocument, fileName: string, docFolder?: DocFolder) {
        const temp = knownFolders.temp().path;
        const localFilePath = path.join(temp, fileName);

        if (File.exists(localFilePath)) {
            throw new Error(`PDF file not found: ${localFilePath}`);
        }

        const file = File.fromPath(localFilePath);

        let targetFolderId = this.remoteFolderId;
        if (docFolder) {
            const folderPath = docFolder.name;
            const folderItem = await getItemByPath(this.tokens, folderPath, this.remoteFolderId);
            targetFolderId = folderItem?.id || (await getOrCreateFolder(this.tokens, folderPath));
        }

        const content = await file.readText('base64');
        await uploadFile(this.tokens, fileName, content, targetFolderId);

        try {
            file.remove();
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}
