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

export function showToast(text: string) {
    showSnack({ message: text });
}

export function showToolTip(tooltip: string, view?: View) {
    showSnack({ message: tooltip });
}
