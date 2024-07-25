import { File, Folder, path } from '@nativescript/core';
import { type OCRDocument, type OCRPage, getDocumentsService } from '~/models/OCRDocument';
import { AuthType, FileStat, WebDAVClient, createClient, createContext } from '~/webdav';
import { basename } from '~/webdav/tools/path';
import { DocumentEvents, DocumentsService } from '../documents';
import { BaseDataSyncService, BaseDataSyncServiceOptions } from './BaseDataSyncService';
// import { timeout } from '~/utils/ui';
import { type Headers, networkService } from '../api';
import { WebdavSyncOptions } from './Webdav';
import { SERVICES_SYNC_MASK } from './types';
import { lc } from '@nativescript-community/l';

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
            const { remoteURL, headers, authType, ...otherConfig } = config;
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
    override async getFileFromRemote(document: OCRDocument, filename: string) {
        const remoteDocPath = path.join(this.remoteFolder, document.id);
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
        await this.client.putFileContents(path.join(this.remoteFolder, document.id, 'data.json'), document.toString());
        // mark the document as synced
        // TEST_LOG && console.log('addDocumentToWebdav done saving synced state', document.id, document.pages);
    }

    override async importDocumentFromRemote(data: FileStat) {
        const dataJSON = JSON.parse(
            await this.client.getFileContents(path.join(data.filename, 'data.json'), {
                format: 'text'
            })
        ) as OCRDocument & { pages: OCRPage[]; db_version?: number };
        const { pages, db_version, ...docProps } = dataJSON;
        if (db_version > DocumentsService.DB_VERSION) {
            throw new Error(lc('document_need_updated_app', docProps.name));
        }
        let docId = docProps.id;
        let pageIds = [];
        let docDataFolder: Folder;
        try {
            TEST_LOG && console.log('importDocumentFromRemote creating document', JSON.stringify(docProps));
            await getDocumentsService().documentRepository.delete({ id: docId } as any);
            const doc = await getDocumentsService().documentRepository.createDocument({ ...docProps, _synced: 0 });
            docId = doc.id;
            docDataFolder = getDocumentsService().dataFolder.getFolder(docId);
            TEST_LOG && console.log('importDocumentFromWebdav', docDataFolder.path, data, JSON.stringify(dataJSON));
            pages.forEach((page) => {
                const pageDataFolder = docDataFolder.getFolder(page.id);
                page.sourceImagePath = path.join(pageDataFolder.path, basename(page.sourceImagePath));
                page.imagePath = path.join(pageDataFolder.path, basename(page.imagePath));
            });
            pageIds = pages.map((p) => p.id);
            await this.importFolderFromRemote(data.basename, docDataFolder, ['data.json']);
            await doc.addPages(pages);
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
    override async deleteFile(relativePath: string) {
        return this.client.deleteFile(path.join(this.remoteFolder, relativePath));
    }
}
