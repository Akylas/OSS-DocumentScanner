import { Folder } from '@nativescript/core';
import { DocFolder, OCRDocument } from '~/models/OCRDocument';
import { FileStat } from '~/webdav';
import { BaseSyncService, BaseSyncServiceOptions } from './BaseSyncService';

export type BaseDataSyncServiceOptions = BaseSyncServiceOptions;

export abstract class BaseDataSyncService extends BaseSyncService {
    allowToRemoveOnRemote: boolean = true;
    abstract ensureRemoteFolder(): Promise<void>;
    abstract getRemoteFolderDirectories(folderStr: string): Promise<FileStat[]>;
    abstract sendFolderToRemote(folder: Folder, remotePath: string): Promise<any>;

    abstract removeDocumentFromRemote(remotePath: string): Promise<any>;
    abstract importFolderFromRemote(remotePath: string, folder: Folder, ignores?: string[]): Promise<any>;
    abstract addDocumentToRemote(document: OCRDocument): Promise<any>;
    abstract importDocumentFromRemote(data: FileStat): Promise<{ doc: OCRDocument; folder: DocFolder }>;
    abstract fileExists(filename: string): Promise<boolean>;
    abstract getFileFromRemote(filename: string, document?: OCRDocument): Promise<any>;
    abstract putFileContents(relativePath: string, localFilePath: string, options?): Promise<any>;
    abstract putFileContentsFromData(relativePath: string, data: string, options?): Promise<any>;
    abstract deleteFile(relativePath: string): Promise<any>;

    // Methods for .valid marker file
    abstract createValidMarker(documentId: string): Promise<void>;
    abstract hasValidMarker(documentId: string): Promise<boolean>;
    abstract removeValidMarker(documentId: string): Promise<void>;
}
