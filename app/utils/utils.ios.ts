import { wrapNativeException } from '@akylas/nativescript/utils';
import { File, ImageSource, path } from '@nativescript/core';

export * from './utils.common';

@NativeClass
class SaveAlbumCompletion extends NSObject {
    static ObjCExposedMethods = {
        'didFinishSavingWithError:contextInfo:': {
            returns: interop.types.void,
            params: [UIImage, NSError, interop.Pointer]
        }
    };
    resolve;
    reject;
    static initWithResolve(resolve, reject) {
        const delegate = SaveAlbumCompletion.new() as SaveAlbumCompletion;
        delegate.resolve = resolve;
        delegate.reject = reject;
        return delegate;
    }

    'didFinishSavingWithError:contextInfo:'(image: UIImage, error: NSError, contextInfo) {
        if (error) {
            this.reject(wrapNativeException(error));
        } else {
            this.resolve();
        }
    }
}

export function restartApp() {
    throw new Error('not possible on iOS');
}

export async function saveImage(
    imageSource: ImageSource,
    {
        exportDirectory,
        fileName,
        imageFormat,
        imageQuality,
        overwrite = true,
        reportName,
        toGallery = false
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
    if (toGallery) {
        await new Promise((resolve, reject) => {
            UIImageWriteToSavedPhotosAlbum(imageSource.ios, SaveAlbumCompletion.initWithResolve(resolve, reject), 'didFinishSavingWithError:contextInfo:', null);
        });
    } else {
        await imageSource.saveToFileAsync(destinationPath, imageFormat, imageQuality);
    }
    // destinationPaths.push(destinationPath);
    if (reportName !== undefined) {
        if (reportName) {
            return destinationPath;
        } else {
            return exportDirectory;
        }
    }
}

export function checkManagePermission() {
    return true;
}
export async function askForManagePermission() {
    return true;
}
export function hasManagePermission() {
    return true;
}
