import { Utils, View } from '@nativescript/core';

export * from './index.common';

export function showToast(text: string) {
    android.widget.Toast.makeText(Utils.android.getApplicationContext(), text, android.widget.Toast.LENGTH_SHORT).show();
}

export function showToolTip(tooltip: string, view?: View) {
    android.widget.Toast.makeText(Utils.android.getApplicationContext(), tooltip, android.widget.Toast.LENGTH_SHORT).show();
}
