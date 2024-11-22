import { File, Folder, path } from '@nativescript/core';
import { type OCRDocument, type OCRPage, getDocumentsService } from '~/models/OCRDocument';
import { DocumentEvents, DocumentsService } from '~/services/documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from '~/services/sync/BaseDataSyncService';
import { AuthType, FileStat, WebDAVClient, createClient } from '~/webdav';
import { basename } from '~/webdav/tools/path';
// import { timeout } from '~/utils/ui';
import { lc } from '@nativescript-community/l';
import { networkService } from '~/services/api';
import { WebdavSyncOptions } from '~/services/sync/Webdav';
import { SERVICES_SYNC_MASK } from '~/services/sync/types';
import { DOCUMENT_DATA_FILENAME } from '~/utils/constants';

export interface WebdavDataSyncOptions extends BaseDataSyncServiceOptions, WebdavSyncOptions {}

export class WebdavDataSyncService extends BaseDataSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'webdav_data';
    type = WebdavDataSyncService.type;
    syncMask = SERVICES_SYNC_MASK[WebdavDataSyncService.type];
    remoteURL;
    username;
    remoteFolder;
    authType;
    client: WebDAVClient;
    token;
    password;

    stop() {}
    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            // const config = JSON.parse(econfigStr);
            const { authType, headers, remoteURL, ...otherConfig } = config;
            const service = WebdavDataSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('WebdavDataSyncService', 'start', JSON.stringify(config), service.autoSync);
            // const context = createContext(config.remoteURL, { config.username, password, authType: AuthType.Password });
            service.client = createClient(remoteURL, {
                headers,
                authType: !authType || authType === AuthType.Password ? AuthType.None : authType,
                ...otherConfig
            });
            return service;
        }
    }
    override async ensureRemoteFolder() {
        DEV_LOG && console.log('ensureRemoteFolder', this.remoteFolder);
        if (!(await this.client.exists(this.remoteFolder))) {
            return this.client.createDirectory(this.remoteFolder, { recursive: true });
        }
    }

    override async getRemoteFolderDirectories(relativePath: string) {
        return this.client.getDirectoryContents(path.join(this.remoteFolder, relativePath), { includeSelf: false, details: false }) as Promise<FileStat[]>;
    }

    override async sendFolderToRemote(folder: Folder, remoteRelativePath: string) {
        const remotePath = path.join(this.remoteFolder, remoteRelativePath);
        DEV_LOG && console.log('sendFolderToWebDav', folder.path, remotePath);
        try {
            await this.client.createDirectory(remotePath, { recursive: false });
        } catch (error) {
            if (error.statusCode !== 405) {
                throw error;
            }
        }

        const entities = await folder.getEntities();
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            if (entity instanceof File) {
                await this.client.putFileContents(path.join(remotePath, entity.name), File.fromPath(entity.path));
            } else {
                await this.sendFolderToRemote(Folder.fromPath(entity.path), path.join(remoteRelativePath, entity.name));
            }
        }
    }
    override async fileExists(filename: string) {
        return this.client.exists(path.join(this.remoteFolder, filename));
    }

    override async getFileFromRemote(filename: string, document?: OCRDocument) {
        const remoteDocPath = document ? path.join(this.remoteFolder, document.id) : this.remoteFolder;
        const result = await this.client.getFileContents(path.join(remoteDocPath, filename), {
            format: 'text'
        });
        DEV_LOG && console.log('getFileFromRemote', result);
        return result;
    }

    override async removeDocumentFromRemote(remoteRelativePath: string) {
        const remoteDocPath = path.join(this.remoteFolder, remoteRelativePath);
        DEV_LOG && console.log('removeDocumentFromWebdav', remoteDocPath);
        return this.client.deleteFile(remoteDocPath);
        // const remoteDocuments = (await this.getRemoteFolderDirectories(remotePath)) as FileStat[];
        // for (let index = 0; index < remoteDocuments.length; index++) {
        //     const remoteDocument = remoteDocuments[index];
        //     if (ignores?.indexOf(remoteDocument.basename) >= 0) {
        //         continue;
        //     }
        //     if (remoteDocument.type === 'directory') {
        //         await this.importFolderFromWebdav(path.join(remotePath, remoteDocument.basename), folder.getFolder(remoteDocument.basename));
        //     } else {
        //         await this.client.getFileContents(path.join(remotePath, remoteDocument.basename), {
        //             format: 'file',
        //             destinationFilePath: path.join(folder.path, remoteDocument.basename)
        //         });
        //     }
        // }
    }
    override async importFolderFromRemote(remoteRelativePath: string, folder: Folder, ignores?: string[]) {
        if (!folder?.path) {
            throw new Error('importFolderFromWebdav missing folder');
        }
        DEV_LOG && console.log('importFolderFromWebdav', remoteRelativePath, folder.path, ignores);
        const remoteDocuments = await this.getRemoteFolderDirectories(remoteRelativePath);
        for (let index = 0; index < remoteDocuments.length; index++) {
            const remoteDocument = remoteDocuments[index];
            if (ignores?.indexOf(remoteDocument.basename) >= 0) {
                continue;
            }
            if (remoteDocument.type === 'directory') {
                await this.importFolderFromRemote(path.join(remoteRelativePath, remoteDocument.basename), folder.getFolder(remoteDocument.basename));
            } else {
                await this.client.getFileContents(path.join(this.remoteFolder, remoteRelativePath, remoteDocument.basename), {
                    format: 'file',
                    destinationFilePath: path.join(folder.path, remoteDocument.basename)
                });
            }
        }
    }
    override async addDocumentToRemote(document: OCRDocument) {
        TEST_LOG && console.log('addDocumentToWebdav', this.remoteFolder, document.id, document.pages);
        const docFolder = getDocumentsService().dataFolder.getFolder(document.id);
        await this.sendFolderToRemote(docFolder, document.id);
        await this.client.putFileContents(path.join(this.remoteFolder, document.id, DOCUMENT_DATA_FILENAME), document.toString());
        // mark the document as synced
        // TEST_LOG && console.log('addDocumentToWebdav done saving synced state', document.id, document.pages);
    }

    override async importDocumentFromRemote(data: FileStat) {
        const dataJSON = JSON.parse(
            await this.client.getFileContents(path.join(data.filename, DOCUMENT_DATA_FILENAME), {
                format: 'text'
            })
        ) as OCRDocument & { pages: OCRPage[]; db_version?: number };
        const { db_version, folders, pages, ...docProps } = dataJSON;
        if (db_version > DocumentsService.DB_VERSION) {
            throw new Error(lc('document_need_updated_app', docProps.name));
        }
        let docId = docProps.id;
        let pageIds = [];
        let docDataFolder: Folder;
        try {
            TEST_LOG && console.log('importDocumentFromRemote creating document', JSON.stringify(docProps), JSON.stringify(folders));
            await getDocumentsService().documentRepository.delete({ id: docId } as any);
            const doc = await getDocumentsService().documentRepository.createDocument({ ...docProps, folders, _synced: 0 });
            docId = doc.id;
            docDataFolder = getDocumentsService().dataFolder.getFolder(docId);
            pages.forEach((page) => {
                const pageDataFolder = docDataFolder.getFolder(page.id);
                page.sourceImagePath = path.join(pageDataFolder.path, basename(page.sourceImagePath));
                page.imagePath = path.join(pageDataFolder.path, basename(page.imagePath));
            });
            pageIds = pages.map((p) => p.id);
            await this.importFolderFromRemote(data.basename, docDataFolder, [DOCUMENT_DATA_FILENAME]);
            await doc.addPages(pages);
            if (folders) {
                const actualFolders = await Promise.all(folders.map((folderId) => getDocumentsService().folderRepository.get(folderId)));
                // in this case we only add folders which actually already exists in db. Means they have to be synced before
                for (let index = 0; index < actualFolders.length; index++) {
                    const folder = actualFolders[index];
                    doc.setFolder({ folderId: folder.id });
                }
            }
            return doc;
        } catch (error) {
            console.error('error while adding remote doc, let s remove it', docId, pageIds, error, error.stack);
            // there was an error while creating the doc. remove it so that we can try again later
            try {
                // await timeout(1000);
                if (docId) {
                    await getDocumentsService().documentRepository.delete({ id: docId } as any);
                    await Promise.all(pageIds.map((p) => getDocumentsService().pageRepository.delete({ id: p.id } as any)));
                }
                if (docDataFolder && Folder.exists(docDataFolder.path)) {
                    await docDataFolder.remove();
                }
            } catch (error2) {
                console.error('error while removing failed sync documennt', error2, error2.stack);
            }
            throw error;
        }
    }

    override async putFileContents(relativePath: string, localFilePath: string, options?) {
        return this.client.putFileContents(path.join(this.remoteFolder, relativePath), File.fromPath(localFilePath), options);
    }
    override putFileContentsFromData(relativePath: string, data: string, options?) {
        return this.client.putFileContents(path.join(this.remoteFolder, relativePath), data, options);
    }
    override async deleteFile(relativePath: string) {
        return this.client.deleteFile(path.join(this.remoteFolder, relativePath));
    }
}
