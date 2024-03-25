import { Page, Utils, View } from '@nativescript/core';

export * from './index.common';

export function showToast(text: string) {
    android.widget.Toast.makeText(Utils.android.getApplicationContext(), text, android.widget.Toast.LENGTH_SHORT).show();
}

export function showToolTip(tooltip: string, view?: View) {
    android.widget.Toast.makeText(Utils.android.getApplicationContext(), tooltip, android.widget.Toast.LENGTH_SHORT).show();
}

export function onBackButton(view: View, callback) {
    if (!view) {
        return;
    }
    // if it is not the currentPage of its frame lets ignore (we are in the backstack)
    if (view instanceof Page && view.frame && view.frame.currentPage !== view) {
        return;
    }
    let modalParent = view;
    const lastModalInStack = modalParent._getRootModalViews().slice(-1)[0];

    while (modalParent.parent && !modalParent._modalParent) {
        modalParent = modalParent.parent as View;
    }
    DEV_LOG && console.log('onBackButton', view.id, modalParent._modalParent, lastModalInStack);
    if (lastModalInStack && lastModalInStack !== modalParent) {
        return;
    }
    callback();
}
