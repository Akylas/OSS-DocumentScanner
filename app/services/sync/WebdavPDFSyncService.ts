import { File, Screen, knownFolders, path } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { generatePDFASync } from 'plugin-nativeprocessor';
import { OCRDocument } from '~/models/OCRDocument';
import { PDF_EXT } from '~/utils/constants';
import { getPageColorMatrix } from '~/utils/matrix';
import { AuthType, FileStat, WebDAVClient, createClient } from '~/webdav';
import { networkService } from '../api';
import { DocumentEvents } from '../documents';
import PDFExportCanvas from '../pdf/PDFExportCanvas';
import { BasePDFSyncService, BasePDFSyncServiceOptions } from './BasePDFSyncService';
import { WebdavSyncOptions } from './Webdav';
import { SERVICES_SYNC_MASK } from './types';

export interface WebdavPDFSyncServiceOptions extends BasePDFSyncServiceOptions, WebdavSyncOptions {}

export class WebdavPDFSyncService extends BasePDFSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'webdav_pdf';
    type = WebdavPDFSyncService.type;
    syncMask = SERVICES_SYNC_MASK[WebdavPDFSyncService.type];
    remoteURL;
    username;
    remoteFolder;
    authType;
    client: WebDAVClient;
    token;
    password;

    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const { remoteURL, headers, authType, ...otherConfig } = config;
            const service = WebdavPDFSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('WebdavPDFSyncService', 'start', JSON.stringify(config), service.autoSync);
            service.client = createClient(remoteURL, {
                headers,
                authType: !authType || authType === AuthType.Password ? AuthType.None : authType,
                ...otherConfig
            });
            return service;
        }
    }
    override stop() {}
    override async ensureRemoteFolder() {
        DEV_LOG && console.log('ensureRemoteFolder', this.remoteFolder);
        if (!(await this.client.exists(this.remoteFolder))) {
            return this.client.createDirectory(this.remoteFolder, { recursive: true });
        }
    }

    override async getRemoteFolderFiles(relativePath: string) {
        return this.client.getDirectoryContents(path.join(this.remoteFolder, relativePath), { includeSelf: false, details: false }) as Promise<FileStat[]>;
    }
    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        return this.client.putFileContents(path.join(this.remoteFolder, relativePath), File.fromPath(localFilePath), options);
    }
    override async deleteFile(relativePath: string) {
        return this.client.deleteFile(path.join(this.remoteFolder, relativePath));
    }
    override async writePDF(document: OCRDocument, filename: string) {
        if (!filename.endsWith(PDF_EXT)) {
            filename += PDF_EXT;
        }
        const temp = knownFolders.temp().path;
        if (__ANDROID__) {
            const options = JSON.stringify({
                overwrite: true,
                // page_padding: Utils.layout.toDevicePixels(pdfCanvas.options.page_padding),
                text_scale: Screen.mainScreen.scale * 1.4,
                pages: document.pages.map((p) => ({ ...p, colorMatrix: getPageColorMatrix(p) })),
                ...this.exportOptions
            });
            await generatePDFASync(temp, filename, options, wrapNativeException);
        } else {
            const exporter = new PDFExportCanvas();
            await exporter.export({ pages: document.pages, folder: temp, filename, compress: true, options: this.exportOptions });
        }
        const destinationPath = path.join(temp, filename);
        DEV_LOG && console.log('destinationPath', destinationPath, File.exists(destinationPath));
        return this.putFileContents(filename, destinationPath);
    }
}
