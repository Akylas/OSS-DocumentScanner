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

export async function getImageSize(imagePath: string) {
    const size = ImageUtils.getImageSize(imagePath);
    return { width: size.objectForKey('width'), height: size.objectForKey('height'), rotation: size.objectForKey('rotation') };
}
