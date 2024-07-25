import { request } from '@nativescript-community/perms';
import { AndroidActivityNewIntentEventData, Application, Color, Page, Utils, View } from '@nativescript/core';
import { goToDocumentView, importAndScanImageOrPdfFromUris, onStartCam } from './index.common';
import { showError } from '../showError';
import { throttle } from '@nativescript/core/utils';
import { securityService } from '~/services/security';
import { documentsService } from '~/services/documents';
import { lc } from '@nativescript-community/l';

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

async function innerOnAndroidIntent(event: AndroidActivityNewIntentEventData) {
    if (__ANDROID__) {
        DEV_LOG && console.log('innerOnAndroidIntent', Application.servicesStarted, securityService.validating);
        if (Application.servicesStarted !== true) {
            return Application.once('servicesStarted', () => innerOnAndroidIntent(event));
        }
        if (securityService.validating) {
            return securityService.once('validated', () => innerOnAndroidIntent(event));
        }
        try {
            const intent = event.intent as android.content.Intent;
            const action = intent.getAction();
            let uris: string[] = [];
            switch (action) {
                case 'android.intent.action.SEND':
                    const imageUri = intent.getParcelableExtra('android.intent.extra.STREAM') as android.net.Uri;
                    if (imageUri) {
                        uris.push(imageUri.toString());
                    }
                    break;
                case 'android.intent.action.SEND_MULTIPLE':
                    const imageUris = intent.getParcelableArrayListExtra('android.intent.extra.STREAM') as java.util.ArrayList<android.net.Uri>;
                    if (imageUris) {
                        for (let index = 0; index < imageUris.size(); index++) {
                            uris.push(imageUris.get(index).toString());
                        }
                    }
                    break;
                case 'com.akylas.documentscanner.OPEN_CAMERA':
                    setTimeout(() => {
                        onStartCam();
                    }, 0);
                    break;
                case 'android.intent.action.MAIN':
                    const extras = intent.getExtras();
                    const bundleAction = extras?.getString('action');
                    switch (bundleAction) {
                        case 'view':
                            const id = extras?.getString('id');
                            if (id) {
                                const document = await documentsService.documentRepository.get(id);
                                if (document) {
                                    goToDocumentView(document);
                                }
                            }
                            break;
                    }
                    break;
            }
            DEV_LOG && console.log('innerOnAndroidIntent uris', action, uris);
            if (__ANDROID__ && uris.length) {
                const needsStoragePermission = uris.find((d) => d.startsWith('file://'));
                if (needsStoragePermission) {
                    await request('storage');
                    uris = uris.map((u) => {
                        if (u.startsWith('file://')) {
                            const newUri = androidx.core.content.FileProvider.getUriForFile(
                                Utils.android.getApplicationContext(),
                                __APP_ID__ + '.provider',
                                new java.io.File(u.replace('file://', ''))
                            );
                            return newUri?.toString() || u;
                        } else {
                            return u;
                        }
                    });
                }
            }
            if (uris.length) {
                await importAndScanImageOrPdfFromUris(uris);
            }
        } catch (error) {
            showError(error);
        }
    }
}
export const onAndroidNewItent = throttle(async function onAndroidNewItent(event: AndroidActivityNewIntentEventData) {
    DEV_LOG && console.log('onAndroidNewItent', Application.servicesStarted, securityService.validating);
    innerOnAndroidIntent(event);
}, 500);

// TODO: move to a plugin
export async function pickColor(color: Color | string, options: { alpha?: boolean } = {}) {
    return new Promise<Color>((resolve) => {
        const activity = Application.android.startActivity;
        if (!(color instanceof Color)) {
            color = new Color(color as any);
        }
        const builder = new com.skydoves.colorpickerview.ColorPickerDialog.Builder(activity)
            .setTitle(lc('pick_color'))
            .attachAlphaSlideBar(options.alpha !== false)
            .setPositiveButton(
                lc('choose'),
                new com.skydoves.colorpickerview.listeners.ColorListener({
                    onColorSelected(color: number) {
                        resolve(new Color(color));
                    }
                })
            )
            .setNegativeButton(
                lc('cancel'),
                new android.content.DialogInterface.OnClickListener({
                    onClick(dialogInterface) {
                        dialogInterface.dismiss();
                        resolve(null);
                    }
                })
            )
            .setBottomSpace(12); // set a bottom space between the last slidebar and buttons.

        builder.getColorPickerView().setInitialColor(color.android);
        const popup = builder.create();
        popup.show();
    });
}
