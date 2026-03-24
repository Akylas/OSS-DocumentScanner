import { File, Folder, path } from '@nativescript/core';
import { DB_VERSION, DocFolder, type OCRDocument, type OCRPage, getDocumentsService } from '~/models/OCRDocument';
import { DocumentEvents, DocumentsService } from '~/services/documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from '~/services/sync/BaseDataSyncService';
import { lc } from '@nativescript-community/l';
import { networkService } from '~/services/api';
import { SERVICES_SYNC_MASK } from '~/services/sync/types';
import { DOCUMENT_DATA_FILENAME, VALID_MARKER_FILENAME } from '~/utils/constants';
import { SilentError } from '@akylas/nativescript-app-utils/error';
import { GoogleDriveSyncOptions, getOrCreateFolder, listFiles, uploadFile, downloadFile, deleteFile, fileExists as gdriveFileExists, GoogleDriveFile } from './GoogleDrive';
import { OAuthTokens } from './OAuthHelper';
import { FileStat } from '~/webdav';

export interface GoogleDriveDataSyncOptions extends BaseDataSyncServiceOptions, GoogleDriveSyncOptions {}

export class GoogleDriveDataSyncService extends BaseDataSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'gdrive_data';
    type = GoogleDriveDataSyncService.type;
    syncMask = SERVICES_SYNC_MASK[GoogleDriveDataSyncService.type];
    remoteFolder: string;
    remoteFolderId: string; // Google Drive folder ID
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
            const service = GoogleDriveDataSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('GoogleDriveDataSyncService', 'start', JSON.stringify(config), service.autoSync);
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
        // Get folder ID for the relative path
        let folderId = this.remoteFolderId;
        if (relativePath) {
            // Navigate to subdirectory
            const parts = relativePath.split('/').filter(p => p);
            for (const part of parts) {
                const files = await listFiles(this.tokens, folderId);
                const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
                if (folder) {
                    folderId = folder.id;
                } else {
                    // Folder doesn't exist
                    return [];
                }
            }
        }

        const items = await listFiles(this.tokens, folderId);
        
        // Convert Google Drive items to FileStat format
        return items.map(item => ({
            filename: path.join(relativePath || '', item.name),
            basename: item.name,
            lastmod: item.modifiedTime || new Date().toISOString(),
            size: parseInt(item.size || '0', 10),
            type: item.mimeType === 'application/vnd.google-apps.folder' ? 'directory' : 'file',
            mime: item.mimeType
        } as FileStat));
    }

    override async sendFolderToRemote(folder: Folder, remoteRelativePath: string) {
        DEV_LOG && console.log('sendFolderToGDrive', folder.path, remoteRelativePath);
        
        // Get or create the target folder
        let targetFolderId = this.remoteFolderId;
        const pathParts = remoteRelativePath.split('/').filter(p => p);
        
        for (const part of pathParts) {
            const files = await listFiles(this.tokens, targetFolderId);
            let folderItem = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            
            if (!folderItem) {
                // Create folder
                const folderId = await getOrCreateFolder(this.tokens, part, targetFolderId);
                targetFolderId = folderId;
            } else {
                targetFolderId = folderItem.id;
            }
        }

        // Upload files
        const entities = await folder.getEntities();
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            if (entity instanceof File) {
                const content = await entity.readText();
                await uploadFile(this.tokens, entity.name, content, 'application/octet-stream', targetFolderId);
            } else {
                // Recursively upload subdirectory
                await this.sendFolderToRemote(Folder.fromPath(entity.path), path.join(remoteRelativePath, entity.name));
            }
        }
    }

    override async fileExists(filename: string) {
        const parts = filename.split('/').filter(p => p);
        const fileName = parts.pop();
        
        let folderId = this.remoteFolderId;
        // Navigate to parent folder
        for (const part of parts) {
            const files = await listFiles(this.tokens, folderId);
            const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            if (!folder) {
                return false;
            }
            folderId = folder.id;
        }
        
        return await gdriveFileExists(this.tokens, fileName, folderId);
    }

    override async getFileFromRemote(filename: string, document?: OCRDocument) {
        const fullPath = document ? path.join(document.id, filename) : filename;
        const parts = fullPath.split('/').filter(p => p);
        const fileName = parts.pop();
        
        let folderId = this.remoteFolderId;
        // Navigate to folder
        for (const part of parts) {
            const files = await listFiles(this.tokens, folderId);
            const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            if (!folder) {
                throw new Error(`Folder not found: ${part}`);
            }
            folderId = folder.id;
        }
        
        // Get file
        const files = await listFiles(this.tokens, folderId);
        const file = files.find(f => f.name === fileName);
        if (!file) {
            throw new Error(`File not found: ${fileName}`);
        }
        
        const result = await downloadFile(this.tokens, file.id);
        DEV_LOG && console.log('getFileFromRemote', result);
        return result;
    }

    override async removeDocumentFromRemote(remoteRelativePath: string) {
        DEV_LOG && console.log('removeDocumentFromGDrive', remoteRelativePath);
        
        const parts = remoteRelativePath.split('/').filter(p => p);
        const itemName = parts.pop();
        
        let folderId = this.remoteFolderId;
        // Navigate to parent folder
        for (const part of parts) {
            const files = await listFiles(this.tokens, folderId);
            const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            if (!folder) {
                return; // Already doesn't exist
            }
            folderId = folder.id;
        }
        
        // Find and delete the item
        const files = await listFiles(this.tokens, folderId);
        const item = files.find(f => f.name === itemName);
        if (item) {
            await deleteFile(this.tokens, item.id);
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
                // Download file
                const content = await this.getFileFromRemote(path.join(remoteRelativePath, remoteDocument.basename));
                const localFile = folder.getFile(remoteDocument.basename);
                await localFile.writeText(content);
            }
        }
    }

    override async addDocumentToRemote(document: OCRDocument) {
        DEV_LOG && console.log('addDocumentToGDrive', this.remoteFolder, document.id, document.pages);
        const docFolder = getDocumentsService().dataFolder.getFolder(document.id);

        // Remove existing .valid marker if it exists (to mark as invalid during sync)
        try {
            await this.removeValidMarker(document.id);
        } catch (error) {
            // Ignore errors - folder might not exist yet
        }

        await this.sendFolderToRemote(docFolder, document.id);
        
        // Upload document data
        await this.putFileContentsFromData(path.join(document.id, DOCUMENT_DATA_FILENAME), document.toString());

        // Create .valid marker after successful sync
        await this.createValidMarker(document.id);
    }

    override async importDocumentFromRemote(data: FileStat) {
        const hasValid = await this.hasValidMarker(data.basename);

        let remoteData: string;
        try {
            remoteData = await this.getFileFromRemote(DOCUMENT_DATA_FILENAME, { id: data.basename } as OCRDocument);
        } catch (error) {
            DEV_LOG && console.warn('importDocumentFromRemote: corrupt remote document (has .valid but no data.json)', data.basename);
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
            DEV_LOG && console.log('importDocumentFromRemote creating document', JSON.stringify(docProps), JSON.stringify(folders));
            await getDocumentsService().documentRepository.delete({ id: docId } as any);
            const doc = await getDocumentsService().documentRepository.createDocument({ ...docProps, folders, _synced: 0 });
            docId = doc.id;
            docDataFolder = getDocumentsService().dataFolder.getFolder(docId);
            pages.forEach((page) => {
                const pageDataFolder = docDataFolder.getFolder(page.id);
                const sourceBase = path.basename(page.sourceImagePath);
                const imageBase = path.basename(page.imagePath);
                page.sourceImagePath = path.join(pageDataFolder.path, sourceBase);
                page.imagePath = path.join(pageDataFolder.path, imageBase);
            });
            pageIds = pages.map((p) => p.id);
            await this.importFolderFromRemote(data.basename, docDataFolder, [DOCUMENT_DATA_FILENAME, VALID_MARKER_FILENAME]);
            await doc.addPages(pages, true, true);

            let folder: DocFolder;
            if (folders) {
                const actualFolders = await Promise.all(folders.map((folderId) => getDocumentsService().folderRepository.get(folderId)));
                for (let index = 0; index < actualFolders.length; index++) {
                    folder = actualFolders[index];
                    doc.setFolder({ folderId: folder.id });
                }
            }
            if (!hasValid) {
                await this.createValidMarker(doc.id);
            }

            return { doc, folder };
        } catch (error) {
            console.error('error while adding remote doc, let s remove it', docId, pageIds, error, error.stack);
            try {
                if (docId) {
                    await getDocumentsService().documentRepository.delete({ id: docId } as any);
                    await Promise.all(pageIds.map((p) => getDocumentsService().pageRepository.delete({ id: p.id } as any)));
                }
                if (docDataFolder && Folder.exists(docDataFolder.path)) {
                    await docDataFolder.remove();
                }
            } catch (error2) {
                console.error('error while removing failed sync document', error2, error2.stack);
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
        
        let folderId = this.remoteFolderId;
        // Navigate/create folders
        for (const part of parts) {
            const files = await listFiles(this.tokens, folderId);
            let folderItem = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            
            if (!folderItem) {
                folderId = await getOrCreateFolder(this.tokens, part, folderId);
            } else {
                folderId = folderItem.id;
            }
        }
        
        await uploadFile(this.tokens, fileName, data, 'application/octet-stream', folderId);
    }

    override async deleteFile(relativePath: string) {
        const parts = relativePath.split('/').filter(p => p);
        const fileName = parts.pop();
        
        let folderId = this.remoteFolderId;
        // Navigate to parent folder
        for (const part of parts) {
            const files = await listFiles(this.tokens, folderId);
            const folder = files.find(f => f.name === part && f.mimeType === 'application/vnd.google-apps.folder');
            if (!folder) {
                return; // File doesn't exist
            }
            folderId = folder.id;
        }
        
        // Find and delete file
        const files = await listFiles(this.tokens, folderId);
        const file = files.find(f => f.name === fileName);
        if (file) {
            await deleteFile(this.tokens, file.id);
        }
    }

    // .valid marker file methods for safer sync
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
            // Ignore if .valid doesn't exist
        }
    }
}
