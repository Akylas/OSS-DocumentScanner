import { File, Folder, ImageSource, path } from '@nativescript/core';
import { saveImage } from '~/utils/utils';
import { FileStat } from '~/webdav';
import { DocumentEvents } from '../documents';
import { BaseImageSyncService, BaseImageSyncServiceOptions } from './BaseImageSyncService';
import { SERVICES_SYNC_MASK } from './types';

export interface LocalFolderImageSyncServiceOptions extends BaseImageSyncServiceOptions {
    localFolderPath: string;
}

export class LocalFolderImageSyncService extends BaseImageSyncService {
    shouldSync(force?: boolean, event?: DocumentEvents) {
        // DEV_LOG && console.log('shouldSync', force, this.autoSync);
        return force || (event && this.autoSync);
    }
    static type = 'folder_image';
    type = LocalFolderImageSyncService.type;
    syncMask = SERVICES_SYNC_MASK[LocalFolderImageSyncService.type];
    localFolderPath: string;
    static start(config?: { id: number; [k: string]: any }) {
        if (config) {
            const service = LocalFolderImageSyncService.getOrCreateInstance();
            Object.assign(service, config);
            DEV_LOG && console.log('LocalFolderImageSyncService', 'start', JSON.stringify(config), service.autoSync);
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
    override async deleteFile(relativePath: string) {
        return File.fromPath(path.join(this.localFolderPath, relativePath)).remove();
    }
    override async writeImage(imageSource: ImageSource, fileName: string, imageFormat: 'png' | 'jpeg' | 'jpg', imageQuality: number, overwrite: boolean) {
        await saveImage(imageSource, {
            exportDirectory: this.localFolderPath,
            fileName,
            imageFormat,
            imageQuality,
            overwrite
        });
    }
}
