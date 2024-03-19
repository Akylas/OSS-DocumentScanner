import { View } from '@akylas/nativescript';
import { showSnack } from '@nativescript-community/ui-material-snackbar';

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

export function getImageSize(imagePath: string) {
    const url = NSURL.fileURLWithPath(imagePath);
    const imageSource = CGImageSourceCreateWithURL(url, null);
    if (imageSource == null) {
        // Error loading image
        return null;
    }

    const options = NSDictionary.dictionaryWithObjectForKey(false, kCGImageSourceShouldCache);
    const imageProperties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, options);
    let result;
    if (imageProperties) {
        const width = CFDictionaryGetValue(imageProperties, kCGImagePropertyPixelWidth);
        const height = CFDictionaryGetValue(imageProperties, kCGImagePropertyPixelHeight);
        result = { width, height, rotation: 0 };
        DEV_LOG && console.log('getImageSize', width, height);
        CFRelease(imageProperties);
    }
    CFRelease(imageSource);
    return result;
}
