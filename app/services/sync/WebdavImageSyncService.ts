import { File, ImageSource, knownFolders, path } from '@nativescript/core';
import { saveImage } from '~/utils/utils';
import { AuthType, FileStat, WebDAVClient, createClient } from '~/webdav';
import { networkService } from '../api';
import { DocumentEvents } from '../documents';
import { BaseImageSyncService, BaseImageSyncServiceOptions } from './BaseImageSyncService';
import { WebdavSyncOptions } from './Webdav';
import { SERVICES_SYNC_MASK } from './types';

export interface WebdavImageSyncServiceOptions extends BaseImageSyncServiceOptions, WebdavSyncOptions {}

export class WebdavImageSyncService extends BaseImageSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        return (force || (event && this.autoSync)) && networkService.connected;
    }
    static type = 'webdav_image';
    type = WebdavImageSyncService.type;
    syncMask = SERVICES_SYNC_MASK[WebdavImageSyncService.type];
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
            const service = WebdavImageSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('WebdavImageSyncService', 'start', JSON.stringify(config), service.autoSync);
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
    override async writeImage(imageSource: ImageSource, fileName: string, imageFormat: 'png' | 'jpeg' | 'jpg', imageQuality: number, overwrite: boolean) {
        const temp = knownFolders.temp().path;
        await saveImage(imageSource, {
            exportDirectory: temp,
            fileName,
            imageFormat,
            imageQuality,
            overwrite
        });
        return this.putFileContents(fileName, path.join(temp, fileName));
    }
}
