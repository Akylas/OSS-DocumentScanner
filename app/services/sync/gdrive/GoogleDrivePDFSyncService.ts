import { File, Screen, knownFolders, path } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { generatePDFASync } from 'plugin-nativeprocessor';
import type { DocFolder, OCRDocument } from '~/models/OCRDocument';
import PDFExportCanvas from '~/services/pdf/PDFExportCanvas';
import { PDF_EXT } from '~/utils/constants';
import { getPageColorMatrix } from '~/utils/matrix';
import { FileStat } from '~/webdav';
import { networkService } from '../../api';
import { DocumentEvents } from '../../documents';
import { BasePDFSyncService, BasePDFSyncServiceOptions } from '../BasePDFSyncService';
import { GoogleDriveSyncOptions, getOrCreateFolder, listFiles, uploadFile } from './GoogleDrive';
import { OAuthTokens } from '../OAuthHelper';
import { SERVICES_SYNC_MASK } from '../types';

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
            // DEV_LOG && console.log('GoogleDrivePDFSyncService', 'start', JSON.stringify(config), service.autoSync);
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
            const parts = relativePath.split('/').filter((p) => p);
            for (const part of parts) {
                const files = await listFiles(this.tokens, folderId);
                const folder = files.find((f) => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
                if (!folder) {
                    return [];
                }
                folderId = folder.id;
            }
        }

        const items = await listFiles(this.tokens, folderId);

        return items
            .filter((item) => item.mimeType === 'application/pdf' || item.name.endsWith('.pdf'))
            .map((item) => ({
                filename: path.join(relativePath || '', item.name),
                basename: item.name,
                lastmod: item.modifiedTime || new Date().toISOString(),
                size: parseInt((item.size || 0) + '', 10),
                type: 'file' as const,
                mime: 'application/pdf'
            }));
    }

    override async writePDF(document: OCRDocument, fileName: string, docFolder?: DocFolder) {
        const pages = document.pages;
        if (!pages || pages.length === 0) {
            return;
        }
        if (!fileName.endsWith(PDF_EXT)) {
            fileName += PDF_EXT;
        }
        const temp = knownFolders.temp().path;

        if (__ANDROID__) {
            const exportOptions = this.exportOptions;
            const black_white = exportOptions.color === 'black_white';
            const options = JSON.stringify({
                overwrite: true,
                // page_padding: Utils.layout.toDevicePixels(pdfCanvas.options.page_padding),
                text_scale: Screen.mainScreen.scale * 1.4,
                pages: pages.map((p) => ({ ...p, colorMatrix: getPageColorMatrix(p, black_white ? 'grayscale' : undefined) })),
                ...exportOptions
            });
            await generatePDFASync(temp, fileName, options, wrapNativeException);
        } else {
            const exporter = new PDFExportCanvas();
            await exporter.export({ pages: pages.map((page) => ({ page, document })), folder: temp, filename: fileName, compress: true, options: this.exportOptions });
        }
        const localFilePath = path.join(temp, fileName);
        // let destinationPath = this.remoteFolder;
        // if (docFolder) {
        //     destinationPath = path.join(destinationPath, docFolder.name);
        //     await this.ensureRemoteFolder(destinationPath);
        // }
        let targetFolderId = this.remoteFolderId;
        if (docFolder) {
            targetFolderId = await getOrCreateFolder(this.tokens, docFolder.name, this.remoteFolderId);
        }
        await uploadFile(this.tokens, fileName, File.fromPath(localFilePath), 'application/pdf', targetFolderId);
    }
}
