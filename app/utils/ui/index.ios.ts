import { View } from '@nativescript/core';
import { showSnack } from '@nativescript-community/ui-material-snackbar';

export * from './index.common';

export function showToast(text: string) {
    showSnack({ message: text });
}

export function showToolTip(tooltip: string, view?: View) {
    showSnack({ message: tooltip });
}
export function checkIfCaonBackButtonnGoBack(view: View, callback) {
    // Android only for now
    callback();
}
