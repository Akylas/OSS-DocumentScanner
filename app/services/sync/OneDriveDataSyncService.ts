import { File, Folder, path } from '@nativescript/core';
import { DB_VERSION, DocFolder, type OCRDocument, type OCRPage, getDocumentsService } from '~/models/OCRDocument';
import { DocumentEvents } from '~/services/documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from '~/services/sync/BaseDataSyncService';
import { lc } from '@nativescript-community/l';
import { networkService } from '~/services/api';
import { SERVICES_SYNC_MASK } from '~/services/sync/types';
import { DOCUMENT_DATA_FILENAME, VALID_MARKER_FILENAME } from '~/utils/constants';
import { SilentError } from '@akylas/nativescript-app-utils/error';
import { OneDriveSyncOptions, getOrCreateFolder, listItems, uploadFile, downloadFile, deleteItem, getItemByPath } from './OneDrive';
import { OAuthTokens } from './OAuthHelper';
import { FileStat } from '~/webdav';

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
            DEV_LOG && console.log('OneDriveDataSyncService', 'start', JSON.stringify(config), service.autoSync);
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
        const item = relativePath 
            ? await getItemByPath(this.tokens, relativePath, this.remoteFolderId)
            : { id: this.remoteFolderId };
        
        if (!item) {
            return [];
        }

        const items = await listItems(this.tokens, item.id);
        
        return items.map(item => ({
            filename: path.join(relativePath || '', item.name),
            basename: item.name,
            lastmod: item.lastModifiedDateTime || new Date().toISOString(),
            size: item.size || 0,
            type: item.folder ? 'directory' : 'file',
            mime: item.file?.mimeType
        } as FileStat));
    }

    override async sendFolderToRemote(folder: Folder, remoteRelativePath: string) {
        DEV_LOG && console.log('sendFolderToOneDrive', folder.path, remoteRelativePath);
        
        // Get or create target folder
        const targetItem = await getItemByPath(this.tokens, remoteRelativePath, this.remoteFolderId);
        const targetFolderId = targetItem?.id || await getOrCreateFolder(this.tokens, remoteRelativePath);

        const entities = await folder.getEntities();
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            if (entity instanceof File) {
                const content = await entity.readText();
                await uploadFile(this.tokens, entity.name, content, targetFolderId);
            } else {
                await this.sendFolderToRemote(Folder.fromPath(entity.path), path.join(remoteRelativePath, entity.name));
            }
        }
    }

    override async fileExists(filename: string) {
        const item = await getItemByPath(this.tokens, filename, this.remoteFolderId);
        return !!item;
    }

    override async getFileFromRemote(filename: string, document?: OCRDocument) {
        const fullPath = document ? path.join(document.id, filename) : filename;
        const item = await getItemByPath(this.tokens, fullPath, this.remoteFolderId);
        
        if (!item) {
            throw new Error(`File not found: ${fullPath}`);
        }
        
        const result = await downloadFile(this.tokens, item.id);
        DEV_LOG && console.log('getFileFromRemote', result);
        return result;
    }

    override async removeDocumentFromRemote(remoteRelativePath: string) {
        DEV_LOG && console.log('removeDocumentFromOneDrive', remoteRelativePath);
        
        const item = await getItemByPath(this.tokens, remoteRelativePath, this.remoteFolderId);
        if (item) {
            await deleteItem(this.tokens, item.id);
        }
    }

    override async importFolderFromRemote(remoteRelativePath: string, folder: Folder, ignores?: string[]) {
        if (!folder?.path) {
            throw new Error('importFolderFromRemote missing folder');
        }
        DEV_LOG && console.log('importFolderFromRemote', remoteRelativePath, folder.path, ignores);
        
        const remoteDocuments = await this.getRemoteFolderDirectories(remoteRelativePath);
        for (let index = 0; index < remoteDocuments.length; index++) {
            const remoteDocument = remoteDocuments[index];
            if (ignores?.indexOf(remoteDocument.basename) >= 0) {
                continue;
            }
            if (remoteDocument.type === 'directory') {
                await this.importFolderFromRemote(path.join(remoteRelativePath, remoteDocument.basename), folder.getFolder(remoteDocument.basename));
            } else {
                const content = await this.getFileFromRemote(path.join(remoteRelativePath, remoteDocument.basename));
                const localFile = folder.getFile(remoteDocument.basename);
                await localFile.writeText(content);
            }
        }
    }

    override async addDocumentToRemote(document: OCRDocument) {
        DEV_LOG && console.log('addDocumentToOneDrive', this.remoteFolder, document.id, document.pages);
        const docFolder = getDocumentsService().dataFolder.getFolder(document.id);

        try {
            await this.removeValidMarker(document.id);
        } catch (error) {
            // Ignore
        }

        await this.sendFolderToRemote(docFolder, document.id);
        await this.putFileContentsFromData(path.join(document.id, DOCUMENT_DATA_FILENAME), document.toString());
        await this.createValidMarker(document.id);
    }

    override async importDocumentFromRemote(data: FileStat) {
        const hasValid = await this.hasValidMarker(data.basename);

        let remoteData: string;
        try {
            remoteData = await this.getFileFromRemote(DOCUMENT_DATA_FILENAME, { id: data.basename } as OCRDocument);
        } catch (error) {
            DEV_LOG && console.warn('importDocumentFromRemote: corrupt remote document', data.basename);
            return;
        }

        const dataJSON: OCRDocument & { pages: OCRPage[]; db_version?: number } = JSON.parse(remoteData);
        const { db_version, folders, pages, ...docProps } = dataJSON;
        if (db_version > DB_VERSION) {
            throw new SilentError(lc('document_need_updated_app', docProps.name));
        }
        
        let docId = docProps.id;
        let pageIds = [];
        let docDataFolder: Folder;
        
        try {
            await getDocumentsService().documentRepository.delete({ id: docId } as any);
            const doc = await getDocumentsService().documentRepository.createDocument({ ...docProps, folders, _synced: 0 });
            docId = doc.id;
            docDataFolder = getDocumentsService().dataFolder.getFolder(docId);
            
            pages.forEach((page) => {
                const pageDataFolder = docDataFolder.getFolder(page.id);
                page.sourceImagePath = path.join(pageDataFolder.path, path.basename(page.sourceImagePath));
                page.imagePath = path.join(pageDataFolder.path, path.basename(page.imagePath));
            });
            
            pageIds = pages.map((p) => p.id);
            await this.importFolderFromRemote(data.basename, docDataFolder, [DOCUMENT_DATA_FILENAME, VALID_MARKER_FILENAME]);
            await doc.addPages(pages, true, true);

            if (folders) {
                const actualFolders = await Promise.all(folders.map((folderId) => getDocumentsService().folderRepository.get(folderId)));
                for (let folder of actualFolders) {
                    if (folder) doc.setFolder({ folderId: folder.id });
                }
            }
            
            if (!hasValid) {
                await this.createValidMarker(doc.id);
            }

            return { doc, folder: null };
        } catch (error) {
            console.error('error while adding remote doc', error);
            try {
                if (docId) {
                    await getDocumentsService().documentRepository.delete({ id: docId } as any);
                    await Promise.all(pageIds.map((p) => getDocumentsService().pageRepository.delete({ id: p.id } as any)));
                }
                if (docDataFolder?.path && Folder.exists(docDataFolder.path)) {
                    await docDataFolder.remove();
                }
            } catch (error2) {
                console.error('error while removing failed sync document', error2);
            }
            throw error;
        }
    }

    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        const content = await File.fromPath(localFilePath).readText();
        return this.putFileContentsFromData(relativePath, content, options);
    }

    override async putFileContentsFromData(relativePath: string, data: string, options?) {
        const parts = relativePath.split('/').filter(p => p);
        const fileName = parts.pop();
        
        let parentPath = parts.join('/');
        const parentItem = parentPath 
            ? await getItemByPath(this.tokens, parentPath, this.remoteFolderId)
            : { id: this.remoteFolderId };
        
        const parentId = parentItem?.id || await getOrCreateFolder(this.tokens, parentPath);
        await uploadFile(this.tokens, fileName, data, parentId);
    }

    override async deleteFile(relativePath: string) {
        const item = await getItemByPath(this.tokens, relativePath, this.remoteFolderId);
        if (item) {
            await deleteItem(this.tokens, item.id);
        }
    }

    override async createValidMarker(documentId: string): Promise<void> {
        await this.putFileContentsFromData(path.join(documentId, VALID_MARKER_FILENAME), `${__APP_ID__}.${__APP_VERSION__}.${__APP_BUILD_NUMBER__}`);
    }

    override async hasValidMarker(documentId: string): Promise<boolean> {
        try {
            await this.getFileFromRemote(VALID_MARKER_FILENAME, { id: documentId } as OCRDocument);
            return true;
        } catch (error) {
            return false;
        }
    }

    override async removeValidMarker(documentId: string): Promise<void> {
        try {
            await this.deleteFile(path.join(documentId, VALID_MARKER_FILENAME));
        } catch (error) {
            // Ignore
        }
    }
}
