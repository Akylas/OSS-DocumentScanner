// import InAppBrowser from '@akylas/nativescript-inappbrowser';
import { request } from '@nativescript-community/perms';
import { Label } from '@nativescript-community/ui-label';
import { ActivityIndicator } from '@nativescript-community/ui-material-activityindicator';
import { AlertDialog } from '@nativescript-community/ui-material-dialogs';
import { Image, ImageAsset, ImageSource, StackLayout } from '@nativescript/core';
import { openUrl } from '@nativescript/core/utils';
import * as imagepicker from '@nativescript/imagepicker';
import dayjs from 'dayjs';
import { OCRDocument, PageData } from '~/models/OCRDocument';
import { documentsService } from '~/services/documents';
import { showError } from './error';
import ColorMatrices from './color_matrix';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { lc } from '@nativescript-community/l';
import { showModal } from 'svelte-native';
import { loadImage } from './utils';

export function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function openLink(url) {
    try {
        // const available = await InAppBrowser.isAvailable();
        // if (available) {
        //     const result = await InAppBrowser.open(url, {
        //         // iOS Properties
        //         dismissButtonStyle: 'close',
        //         preferredBarTintColor: primaryColor,
        //         preferredControlTintColor: 'white',
        //         readerMode: false,
        //         animated: true,
        //         enableBarCollapsing: false,
        //         // Android Properties
        //         showTitle: true,
        //         toolbarColor: primaryColor,
        //         secondaryToolbarColor: 'white',
        //         enableUrlBarHiding: true,
        //         enableDefaultShare: true,
        //         forceCloseOnRedirection: false,
        //     });
        // } else {
        openUrl(url);
        // }
    } catch (error) {
        alert({
            title: 'Error',
            message: error.message,
            okButtonText: 'Ok'
        });
    }
}
let loadingIndicator: AlertDialog & { label?: Label };
let showLoadingStartTime: number = null;
function getLoadingIndicator() {
    if (!loadingIndicator) {
        const stack = new StackLayout();
        stack.padding = 10;
        stack.orientation = 'horizontal';
        const activityIndicator = new ActivityIndicator();
        activityIndicator.className = 'activity-indicator';
        activityIndicator.busy = true;
        stack.addChild(activityIndicator);
        const label = new Label();
        label.paddingLeft = 15;
        label.textWrap = true;
        label.verticalAlignment = 'middle';
        label.fontSize = 16;
        stack.addChild(label);
        loadingIndicator = new AlertDialog({
            view: stack,
            cancelable: false
        });
        loadingIndicator.label = label;
    }
    return loadingIndicator;
}
export function showLoading(msg: string) {
    const loadingIndicator = getLoadingIndicator();
    console.log('showLoading', msg, !!loadingIndicator);
    loadingIndicator.label.text = msg + '...';
    showLoadingStartTime = Date.now();
    loadingIndicator.show();
}
export function hideLoading() {
    const delta = showLoadingStartTime ? Date.now() - showLoadingStartTime : -1;
    if (delta >= 0 && delta < 1000) {
        setTimeout(() => hideLoading(), 1000 - delta);
        return;
    }
    // log('hideLoading', !!loadingIndicator);
    if (loadingIndicator) {
        loadingIndicator.hide();
    }
}

// export const IMAGE_FILTERS = {
//     grayscale: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
//     bw: (value = 1) => [value, value, value, -1, 0, value, value, value, -1, 0, value, value, value, -1, 0, 0, 0, 0, 1, 0],
//     nightVision: [0.1, 0.4, 0, 0, 0, 0.3, 1, 0.3, 0, 0, 0, 0.4, 0.1, 0, 0, 0, 0, 0, 1, 0],
//     polaroid: [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0]
// };

export const ColorMatricesTypes = Object.keys(ColorMatrices);
export type ColorMatricesType = string;
// export type ColorMatricesType = keyof typeof ColorMatricesTypes;

export function getColorMatrix(type: string, ...args): number[] {
    return (ColorMatrices[type] as Function)?.apply(ColorMatrices, args);
    // switch (color) {
    //     case ColorType.BLACK_WHITE:
    //         return IMAGE_FILTERS.bw(value);
    //     case ColorType.GRAY:
    //         return IMAGE_FILTERS.grayscale;
    //     case ColorType.NIGHT_VISION:
    //         return IMAGE_FILTERS.nightVision;
    //     case ColorType.POLAROID:
    //         return IMAGE_FILTERS.polaroid;
    //     default:
    //         return 0 as any;
    // }
}

function calculateInterpolation(outMatrix: android.graphics.Matrix, startValues, stopValues, fraction) {
    const currentValues = [];
    for (let i = 0; i < 9; i++) {
        currentValues[i] = (1 - fraction) * startValues[i] + fraction * stopValues[i];
    }
    outMatrix.setValues(currentValues);
}

export async function setImageRotation(imageView: Image, rotation, duration?: number) {
    console.log('setImageRotation', rotation);
    // let currentMatrix = new android.graphics.Matrix()
    // let values =  Array.create('float', 9);currentMatrix.getValues(values)
    // console.log('values', values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8])

    // currentMatrix.postRotate(rotation)
    // currentMatrix.getValues(values)
    // console.log('values2', values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8])
    // setImageMatrix(imageView, values, duration);

    const scaleType = imageView.nativeViewProtected.getHierarchy().getActualImageScaleType();
    if (scaleType['setImageRotation']) {
        scaleType['setImageRotation'](rotation);
        (imageView.nativeViewProtected as android.widget.ImageView).invalidate();
        console.log('setImageRotation done', rotation);
    }
}
export async function setImageMatrix(imageView: Image, values: number[], duration?: number) {
    if (duration) {
        return new Promise<void>((resolve, reject) => {
            try {
                const currentAnimator = imageView['matrixAnimator'];
                if (currentAnimator) {
                    currentAnimator.cancel();
                    currentAnimator.removeAllUpdateListeners();
                    currentAnimator.removeAllListeners();
                    imageView['matrixAnimator'] = null;
                }
                const arr = Array.create('float', 2);
                arr[0] = 0;
                arr[1] = 1;
                const valueAnimator = android.animation.ValueAnimator.ofFloat(arr);
                const startValues = Array.create('float', 9);
                (imageView.nativeViewProtected as android.widget.ImageView).getImageMatrix().getValues(startValues);
                const currentMatrix = new android.graphics.Matrix();
                valueAnimator.setInterpolator(new android.view.animation.DecelerateInterpolator());
                valueAnimator.setDuration(duration);
                valueAnimator.addUpdateListener(
                    new android.animation.ValueAnimator.AnimatorUpdateListener({
                        onAnimationUpdate(valueAnimator) {
                            calculateInterpolation(currentMatrix, startValues, values, valueAnimator.getAnimatedValue());
                            (imageView.nativeViewProtected as android.widget.ImageView).setImageMatrix(currentMatrix);
                        }
                    })
                );
                valueAnimator.addListener(
                    new android.animation.Animator.AnimatorListener({
                        onAnimationStart() {},
                        onAnimationRepeat() {},
                        onAnimationCancel(animation) {
                            imageView['matrixAnimator'] = null;
                        },

                        onAnimationEnd(animation) {
                            resolve();
                            imageView['matrixAnimator'] = null;
                        }
                    })
                );
                imageView['matrixAnimator'] = valueAnimator;
                valueAnimator.start();
            } catch (error) {
                reject(error);
            }
        });
    } else {
        const matrix = new android.graphics.Matrix();
        const arr = Array.create('float', values.length);
        for (let index = 0; index < values.length; index++) {
            console.log('arr', index, values[index]);
            arr[index] = values[index];
        }
        matrix.setValues(arr);
        const scaleType = imageView.nativeViewProtected.getHierarchy().getActualImageScaleType();
        if (scaleType['setImageMatrix']) {
            scaleType['setImageMatrix'](matrix)(imageView.nativeViewProtected as android.widget.ImageView).invalidate();
        }
        // (imageView.nativeViewProtected as android.widget.ImageView).setScaleType(android.widget.ImageView.ScaleType.MATRIX);
        // (imageView.nati.veViewProtected as android.widget.ImageView).setImageMatrix(matrix);
    }
}

// const worker = new Worker('~/workers/ImageWorker');
// const messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: NodeJS.Timer }[] } = {};
// worker.onmessage = function onWorkerMessage(event: {
//     data: {
//         type: WorkerEventType;
//         result: WorkerResult;
//         full?: boolean;
//         contours?: number[][];
//         width?: number;
//         height?: number;
//         originalWidth?: number;
//         originaHeight?: number;
//         id?: number;
//         rotation?: number;
//         nativeDataKeys: string[];
//         nativeDatas?: { [k: string]: any };
//     };
// }) {
//     const data = event.data;
//     const id = data.id;

//     if (id && messagePromises.hasOwnProperty(id)) {
//         messagePromises[id].forEach(function (executor) {
//             executor.timeoutTimer && clearTimeout(executor.timeoutTimer);
//             // if (isError) {
//             // executor.reject(createErrorFromMessage(message));
//             // } else {
//             const id = data.id;
//             if (data.nativeDataKeys.length > 0) {
//                 const nativeDatas: { [k: string]: any } = {};
//                 if (__ANDROID__) {
//                     data.nativeDataKeys.forEach((k) => {
//                         nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
//                         com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
//                     });
//                     data.nativeDatas = nativeDatas;
//                 }
//             }

//             executor.resolve(data);
//             // }
//         });
//         delete messagePromises[id];
//     }
// };
// export function sendMessageToWorker(
//     nativeData,
//     messageData,
//     timeout = 0
// ): Promise<{
//     id: number;
//     nativeDatas?: { [k: string]: any };
//     [k: string]: any;
// }> {
//     return new Promise((resolve, reject) => {
//         const id = Date.now().valueOf();
//         messagePromises[id] = messagePromises[id] || [];
//         let timeoutTimer;
//         if (timeout > 0) {
//             timeoutTimer = setTimeout(() => {
//                 // we need to try catch because the simple fact of creating a new Error actually throws.
//                 // so we will get an uncaughtException
//                 try {
//                     reject(new Error('timeout'));
//                 } catch {}
//                 delete messagePromises[id];
//             }, timeout);
//         }
//         messagePromises[id].push({ resolve, reject, timeoutTimer });

//         // const result = worker.processImage(image, { width, height, rotation });
//         // handleContours(result.contours, rotation, width, height);
//         const keys = Object.keys(nativeData);
//         if (__ANDROID__) {
//             keys.forEach((k) => {
//                 com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, nativeData[k]._native || nativeData[k]);
//             });
//         }
//         const mData = Object.assign(
//             {
//                 type: 'image',
//                 id,
//                 nativeDataKeys: keys
//             },
//             messageData
//         );
//         // console.log('postMessage', mData);
//         worker.postMessage(mData);
//     });
// }

export async function importAndScanImage(document?: OCRDocument) {
    await request('storage');
    let selection;
    let editingImage: ImageSource;
    try {
        selection = await imagepicker
            .create({
                mediaType: 1,
                android: {
                    read_external_storage: 'reading images'
                },
                mode: 'single' // use "multiple" for multiple selection
            })
            // on android pressing the back button will trigger an error which we dont want
            .present()
            .catch((err) => null);
        if (selection?.length) {
            const sourceImagePath = selection[0].path;
            console.log('selection', selection[0], selection[0].constructor.name);
            editingImage = await loadImage(sourceImagePath);

            if (!editingImage) {
                throw new Error('failed to read imported image');
            }
            let quads;
            console.log('editingImage', editingImage.width, editingImage.height, editingImage.android);
            if (__ANDROID__) {
                quads = JSON.parse(com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, 600, 0));
            }
            if (quads?.length) {
                console.log('quads', quads);
                const ModalImportImage = require('~/components/ModalImportImage.svelte').default;
                quads = await showModal({
                    page: ModalImportImage,
                    animated: true,
                    fullscreen: true,
                    props: {
                        editingImage,
                        quads
                    }
                });
                if (quads) {
                    let images /* : android.graphics.Bitmap[] */;
                    if (__ANDROID__) {
                        images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify(quads));
                    }
                    if (images) {
                        const pagesToAdd: PageData[] = [];
                        for (let index = 0; index < images.length; index++) {
                            const image = images[index];
                            pagesToAdd.push({
                                image,
                                crop: quads[index],
                                sourceImagePath,
                                width: __ANDROID__ ? image.getWidth() : image.size.width,
                                height: __ANDROID__ ? image.getHeight() : image.size.height,
                                rotation: editingImage.rotationAngle
                            });
                        }
                        if (document) {
                            await document.addPages(pagesToAdd);
                            await document.save();
                        } else {
                            const document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
                            await document.save();
                            documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
                        }
                        return document;
                    }
                }
            } else {
                showSnack({ message: lc('no_document_found') });
            }
        }
    } catch (error) {
        showError(error);
        if (__ANDROID__) {
            editingImage?.android?.recycle();
        }
    }
}
