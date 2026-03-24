import { File, knownFolders, path } from '@nativescript/core';
import { FileStat } from '~/webdav';
import { networkService } from '../api';
import { DocumentEvents } from '../documents';
import { BasePDFSyncService, BasePDFSyncServiceOptions } from './BasePDFSyncService';
import { SERVICES_SYNC_MASK } from './types';
import type { DocFolder, OCRDocument } from '~/models/OCRDocument';
import { GoogleDriveSyncOptions, getOrCreateFolder, listFiles, uploadFile } from './GoogleDrive';
import { OAuthTokens } from './OAuthHelper';

export interface GoogleDrivePDFSyncServiceOptions extends BasePDFSyncServiceOptions, GoogleDriveSyncOptions {}

export class GoogleDrivePDFSyncService extends BasePDFSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'gdrive_pdf';
    type = GoogleDrivePDFSyncService.type;
    syncMask = SERVICES_SYNC_MASK[GoogleDrivePDFSyncService.type];
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
            const service = GoogleDrivePDFSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('GoogleDrivePDFSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }

    override stop() {}

    override async ensureRemoteFolder(remoteFolder = this.remoteFolder) {
        if (!this.remoteFolderId) {
            this.remoteFolderId = await getOrCreateFolder(this.tokens, remoteFolder || 'DocumentScanner');
        } else if (remoteFolder !== this.remoteFolder) {
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
            .filter(item => item.mimeType === 'application/pdf' || item.name.endsWith('.pdf'))
            .map(item => ({
                filename: path.join(relativePath || '', item.name),
                basename: item.name,
                lastmod: item.modifiedTime || new Date().toISOString(),
                size: parseInt(item.size || '0', 10),
                type: 'file' as const,
                mime: 'application/pdf'
            }));
    }

    override async writePDF(document: OCRDocument, fileName: string, docFolder?: DocFolder) {
        const temp = knownFolders.temp().path;
        const localFilePath = path.join(temp, fileName);
        
        // PDF generation happens before this call - file should exist
        const file = File.fromPath(localFilePath);
        if (!file.exists) {
            throw new Error(`PDF file not found: ${localFilePath}`);
        }

        let targetFolderId = this.remoteFolderId;
        if (docFolder) {
            targetFolderId = await getOrCreateFolder(this.tokens, docFolder.name, this.remoteFolderId);
        }

        const content = await file.readText('base64');
        await uploadFile(this.tokens, fileName, content, 'application/pdf', targetFolderId);
        
        // Clean up temp file
        try {
            file.remove();
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}
