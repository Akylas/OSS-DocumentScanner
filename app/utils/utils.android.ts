import { request } from '@nativescript-community/perms';
import { Application, File, Folder, ImageSource, Utils, path } from '@nativescript/core';
import { ANDROID_CONTENT } from './constants';

export * from './utils.common';

export function restartApp() {
    com.akylas.documentscanner.Utils.Companion.restartApp(Utils.android.getApplicationContext(), Application.android.startActivity);
}

export async function copyFolderContent(src: string, dst: string) {
    const folder = Folder.fromPath(src);
    // ensure we create the folder
    Folder.fromPath(dst);
    if (!Folder.exists(dst)) {
        throw new Error('failed copying folder ' + dst);
    }
    DEV_LOG && console.log('copyFolderContent ', src, dst, Folder.exists(dst));
    return Promise.all(
        (await folder.getEntities()).map((e) => {
            if (e instanceof File) {
                const dstFile = path.join(dst, e.name);
                DEV_LOG && console.log('copyFile ', e.path, dstFile);
                return e.copy(dstFile).then((r) => {
                    if (!File.exists(dstFile)) {
                        throw new Error('failed copying file ' + dstFile);
                    }
                });
            } else {
                const dstFolder = path.join(dst, e.name);
                return copyFolderContent(path.join(src, e.name), dstFolder);
            }
        })
    );
}
export async function removeFolderContent(src: string) {
    const folder = Folder.fromPath(src);
    return Promise.all((await folder.getEntities()).map((e) => e.remove()));
}
export async function saveImage(
    imageSource: ImageSource,
    {
        imageFormat,
        fileName,
        imageQuality,
        exportDirectory,
        toGallery = false,
        overwrite = true,
        reportName
    }: { toGallery?: boolean; imageFormat: 'png' | 'jpeg' | 'jpg'; imageQuality; fileName: string; exportDirectory: string; reportName?: boolean; overwrite?: boolean }
) {
    let destinationName = fileName;
    if (!destinationName.endsWith(imageFormat)) {
        destinationName += '.' + imageFormat;
    }
    // DEV_LOG && console.log('saveImage', fileName, imageFormat, imageQuality, exportDirectory, destinationName);
    if (toGallery) {
        await request('storage');
        com.akylas.documentscanner.utils.ImageUtil.Companion.saveBitmapToGallery(Utils.android.getApplicationContext(), imageSource.android, imageFormat, imageQuality, fileName);
    } else if (exportDirectory.startsWith(ANDROID_CONTENT)) {
        const context = Utils.android.getApplicationContext();
        const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(exportDirectory));
        let outfile: androidx.documentfile.provider.DocumentFile;
        if (overwrite) {
            outfile = outdocument.findFile(destinationName) || outdocument.createFile('image/' + imageFormat, destinationName);
        } else {
            outfile = outdocument.createFile('image/' + imageFormat, destinationName) || outdocument.findFile(destinationName);
        }
        if (!outfile) {
            throw new Error(`error creating file "${destinationName}" in "${exportDirectory}"`);
        }

        const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
        (imageSource.android as android.graphics.Bitmap).compress(
            imageFormat === 'png' ? android.graphics.Bitmap.CompressFormat.PNG : android.graphics.Bitmap.CompressFormat.JPEG,
            imageQuality,
            stream
        );
        if (reportName !== undefined) {
            if (reportName) {
                return com.nativescript.documentpicker.FilePath.getPath(context, outfile.getUri());
            } else {
                return com.nativescript.documentpicker.FilePath.getPath(context, outdocument.getUri());
            }
        }
    } else {
        const destinationPath = path.join(exportDirectory, destinationName);

        if (overwrite && File.exists(destinationPath)) {
            await File.fromPath(destinationPath).remove();
        }
        await imageSource.saveToFileAsync(destinationPath, imageFormat, imageQuality);
        // destinationPaths.push(destinationPath);
        if (reportName !== undefined) {
            if (reportName) {
                return destinationPath;
            } else {
                return exportDirectory;
            }
        }
    }
}
