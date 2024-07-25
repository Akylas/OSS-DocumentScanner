import { Folder } from '@nativescript/core';
import { OCRDocument } from '~/models/OCRDocument';
import { FileStat } from '~/webdav';
import { BaseSyncService, BaseSyncServiceOptions } from './BaseSyncService';

export interface BaseDataSyncServiceOptions extends BaseSyncServiceOptions {}

export abstract class BaseDataSyncService extends BaseSyncService {
    allowToRemoveOnRemote: boolean = true;
    abstract ensureRemoteFolder(): Promise<void>;
    abstract getRemoteFolderDirectories(folderStr: string): Promise<FileStat[]>;
    abstract sendFolderToRemote(folder: Folder, remotePath: string): Promise<any>;

    abstract removeDocumentFromRemote(remotePath: string): Promise<any>;
    abstract importFolderFromRemote(remotePath: string, folder: Folder, ignores?: string[]): Promise<any>;
    abstract addDocumentToRemote(document: OCRDocument): Promise<any>;
    abstract importDocumentFromRemote(data: FileStat): Promise<OCRDocument>;
    abstract getFileFromRemote(document: OCRDocument, filename: string): Promise<any>;
    abstract putFileContents(relativePath: string, localFilePath: string, options?): Promise<any>;
    abstract deleteFile(relativePath: string): Promise<any>;
}
