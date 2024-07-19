import { File, ImageSource, path } from '@nativescript/core';

export * from './utils.common';

export function restartApp() {
    throw new Error('not possible on iOS');
}

export async function copyFolderContent(src: string, dst: string) {
    throw new Error('not implemented on iOS');
}
export async function removeFolderContent(src: string, dst: string) {
    throw new Error('not implemented on iOS');
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
