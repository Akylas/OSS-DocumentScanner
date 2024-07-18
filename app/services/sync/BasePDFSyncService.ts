import { ImageSource } from '@nativescript/core';
import { OCRDocument } from '~/models/OCRDocument';
import { FileStat } from '~/webdav';
import type { PDFExportBaseOptions } from '../pdf/PDFCanvas';
import { BaseSyncService, BaseSyncServiceOptions } from './BaseSyncService';
import { getFileNameForDocument } from '~/utils/utils.common';

export interface BasePDFSyncServiceOptions extends BaseSyncServiceOptions {
    fileNameFormat?: string;
    exportOptions?: PDFExportBaseOptions;
}

export abstract class BasePDFSyncService extends BaseSyncService {
    fileNameFormat?: string;
    exportOptions?: PDFExportBaseOptions;
    useDocumentName?: boolean;

    abstract ensureRemoteFolder(): Promise<void>;
    abstract getRemoteFolderFiles(folderStr: string): Promise<FileStat[]>;
    // abstract updatePage(document: OCRDocument, page: OCRPage, pageIndex: number): Promise<any>;
    abstract deleteFile(remotePath: string): Promise<any>;
    abstract putFileContents(relativePath: string, localFilePath: string, options?): Promise<any>;
    abstract writePDF(document: OCRDocument, name: string): Promise<any>;

    getPDFName(document: OCRDocument) {
        DEV_LOG && console.log('getPDFName', this.useDocumentName, this.fileNameFormat);
        return getFileNameForDocument(document, this.useDocumentName, document.createdDate, this.fileNameFormat);
    }
}
