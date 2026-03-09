import { Utils, knownFolders, path } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { UnZipOptions, ZipOptions } from '.';

export async function unzip(options: UnZipOptions) {
    return new Promise<void>((resolve, reject) => {
        com.nativescript.zip.Zip.unzip(
            Utils.android.getApplicationContext(),
            options.archive,
            options.directory,
            'unzip',
            new com.nativescript.zip.Zip.ZipCallback({
                onStart(worker, mode) {},
                onUnzipComplete(worker, zipFile) {
                    resolve();
                },
                onError(worker, e, mode) {
                    reject(wrapNativeException(e));
                },
                onZipComplete(worker, zipFile) {},
                onProgress(worker, mode, entryIndex, totalEntries, entryName, entryBytesProcessed, entrySize, totalBytesProcessed, totalBytes) {}
            })
        );
    });
}

export async function zip(options: ZipOptions) {
    return new Promise<void>((resolve, reject) => {
        const archive = options?.archive ?? path.join(knownFolders.temp().path, `${java.util.UUID.randomUUID().toString()}_archive.zip`);
        const list = new java.util.ArrayList();
        list.add(options.directory);
        com.nativescript.zip.Zip.zip(
            Utils.android.getApplicationContext(),
            list,
            archive,
            'unzip',
            options.keepParent === true,
            new com.nativescript.zip.Zip.ZipCallback({
                onStart(worker, mode, totalEntries, totalBytes) {},
                onZipComplete(worker, zipFile) {
                    resolve();
                },
                onUnzipComplete(worker, extractedFolder) {},
                onError(worker, e, mode) {
                    reject(wrapNativeException(e));
                },
                onProgress(worker, mode, entryIndex, totalEntries, entryName, entryBytesProcessed, entrySize, totalBytesProcessed, totalBytes) {
                    options?.onProgress?.(totalBytesProcessed / totalBytes);
                }
            })
        );
    });
}
