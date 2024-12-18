import { File, Folder, Screen, path } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { generatePDFASync } from 'plugin-nativeprocessor';
import { OCRDocument } from '~/models/OCRDocument';
import { PDF_EXT } from '~/utils/constants';
import { getPageColorMatrix } from '~/utils/matrix';
import { FileStat } from '~/webdav';
import { DocumentEvents } from '../documents';
import PDFExportCanvas from '../pdf/PDFExportCanvas';
import { BasePDFSyncService, BasePDFSyncServiceOptions } from './BasePDFSyncService';
import { SERVICES_SYNC_MASK } from './types';

export interface LocalFolderPDFSyncServiceOptions extends BasePDFSyncServiceOptions {
    localFolderPath: string;
}

export class LocalFolderPDFSyncService extends BasePDFSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        // DEV_LOG && console.log('shouldSync', force, this.autoSync);
        return force || (event && this.autoSync);
    }
    static type = 'folder_pdf';
    type = LocalFolderPDFSyncService.type;
    syncMask = SERVICES_SYNC_MASK[LocalFolderPDFSyncService.type];
    localFolderPath: string;
    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const service = LocalFolderPDFSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('LocalFolderPDFSyncService', 'start', JSON.stringify(config), service.autoSync);
            return service;
        }
    }
    override stop() {}
    override async ensureRemoteFolder() {
        if (!Folder.exists(this.localFolderPath)) {
            Folder.fromPath(this.localFolderPath);
        }
    }
    override async getRemoteFolderFiles(folderStr: string) {
        const files = await Folder.fromPath(this.localFolderPath).getEntities();
        return files
            .filter((e) => e instanceof File)
            .map(
                (e) =>
                    ({
                        basename: e.name,
                        filename: e.path,
                        type: 'file',
                        lastmod: e.lastModified.valueOf() / 1000,
                        size: e.size
                    }) as FileStat
            );
    }
    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        return File.fromPath(localFilePath).copy(path.join(this.localFolderPath, relativePath));
    }
    override putFileContentsFromData(relativePath: string, data: string, options?) {
        return File.fromPath(path.join(this.localFolderPath, relativePath)).writeText(data);
    }
    override async deleteFile(relativePath: string) {
        return File.fromPath(path.join(this.localFolderPath, relativePath)).remove();
    }
    override async writePDF(document: OCRDocument, filename: string) {
        const pages = document.pages;
        if (!pages || pages.length === 0) {
            return;
        }
        if (!filename.endsWith(PDF_EXT)) {
            filename += PDF_EXT;
        }
        if (__ANDROID__) {
            const options = JSON.stringify({
                overwrite: true,
                // page_padding: Utils.layout.toDevicePixels(pdfCanvas.options.page_padding),
                text_scale: Screen.mainScreen.scale * 1.4,
                pages: pages.map((p) => ({ ...p, colorMatrix: getPageColorMatrix(p) })),
                ...this.exportOptions
            });
            return generatePDFASync(this.localFolderPath, filename, options, wrapNativeException);
        } else {
            const exporter = new PDFExportCanvas();
            await exporter.export({ pages: pages.map((page) => ({ page, document })), folder: this.localFolderPath, filename, compress: true, options: this.exportOptions });
        }
    }
}
