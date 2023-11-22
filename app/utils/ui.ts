// import InAppBrowser from '@akylas/nativescript-inappbrowser';
import { request } from '@nativescript-community/perms';
import { Label } from '@nativescript-community/ui-label';
import { ActivityIndicator } from '@nativescript-community/ui-material-activityindicator';
import { AlertDialog } from '@nativescript-community/ui-material-dialogs';
import { Image, ImageAsset, ImageSource, StackLayout, View } from '@nativescript/core';
import { openUrl } from '@nativescript/core/utils';
import * as imagepicker from '@nativescript/imagepicker';
import dayjs from 'dayjs';
import { OCRDocument, PageData } from '~/models/OCRDocument';
import { documentsService } from '~/services/documents';
import { showError } from './error';
import ColorMatrices from './color_matrix';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { showModal } from 'svelte-native';
import { loadImage, recycleImages } from './utils.common';
import { cropDocument, getJSONDocumentCorners } from 'plugin-nativeprocessor';
import { NativeViewElementNode, createElement } from 'svelte-native/dom';
import { l, lc } from '~/helpers/locale';

import type LoadingIndicator__SvelteComponent_ from '~/components/LoadingIndicator.svelte';
import LoadingIndicator from '~/components/LoadingIndicator.svelte';

export interface ComponentInstanceInfo {
    element: NativeViewElementNode<View>;
    viewInstance: SvelteComponent;
}

export function resolveComponentElement<T>(viewSpec: typeof SvelteComponent<T>, props?: any): ComponentInstanceInfo {
    const dummy = createElement('fragment', window.document as any);
    const viewInstance = new viewSpec({ target: dummy, props });
    const element = dummy.firstElement() as NativeViewElementNode<View>;
    return { element, viewInstance };
}

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
        //         preferredBarTintColor: colorPrimary,
        //         preferredControlTintColor: 'white',
        //         readerMode: false,
        //         animated: true,
        //         enableBarCollapsing: false,
        //         // Android Properties
        //         showTitle: true,
        //         toolbarColor: colorPrimary,
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

export interface ShowLoadingOptions {
    title?: string;
    text: string;
    progress?: number;
    onButtonTap?: () => void;
}

let loadingIndicator: AlertDialog & { instance?: LoadingIndicator__SvelteComponent_ };
let showLoadingStartTime: number = null;
function getLoadingIndicator() {
    if (!loadingIndicator) {
        const componentInstanceInfo = resolveComponentElement(LoadingIndicator, {});
        const view: View = componentInstanceInfo.element.nativeView;
        // const stack = new StackLayout()
        loadingIndicator = new AlertDialog({
            view,
            cancelable: false
        });
        loadingIndicator.instance = componentInstanceInfo.viewInstance as LoadingIndicator__SvelteComponent_;
    }
    return loadingIndicator;
}
export function updateLoadingProgress(msg: Partial<ShowLoadingOptions>) {
    if (showingLoading()) {
        const loadingIndicator = getLoadingIndicator();
        const props = {
            progress: msg.progress
        };
        if (msg.text) {
            props['text'] = msg.text;
        }
        loadingIndicator.instance.$set(props);
    }
}
export async function showLoading(msg?: string | ShowLoadingOptions) {
    const text = (msg as any)?.text || (typeof msg === 'string' && msg) || lc('loading');
    const loadingIndicator = getLoadingIndicator();
    loadingIndicator.instance.onButtonTap = msg['onButtonTap'];
    // if (!!msg?.['onButtonTap']) {
    //     loadingIndicator.instance.$on('tap', msg['onButtonTap']);
    // } else {
    //     loadingIndicator.instance.$off('tap');
    // }
    const props = {
        showButton: !!msg?.['onButtonTap'],
        text,
        title: (msg as any)?.title,
        progress: null
    };
    if (msg && typeof msg !== 'string' && msg?.hasOwnProperty('progress')) {
        props.progress = msg.progress;
    } else {
        props.progress = null;
    }
    loadingIndicator.instance.$set(props);
    if (showLoadingStartTime === null) {
        showLoadingStartTime = Date.now();
        loadingIndicator.show();
    }
}
export function showingLoading() {
    return showLoadingStartTime !== null;
}
export async function hideLoading() {
    const delta = showLoadingStartTime ? Date.now() - showLoadingStartTime : -1;
    if (__IOS__ && delta >= 0 && delta < 1000) {
        setTimeout(() => hideLoading(), 1000 - delta);
        return;
    }
    showLoadingStartTime = null;
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

const sortPriority = ['normal', 'grayscale', 'bw', 'sepia', 'invert', 'polaroid', 'nightvision'];
export const ColorMatricesTypes = Object.keys(ColorMatrices).sort((a, b) => {
    const sortIndexA = sortPriority.indexOf(a);
    const sortIndexB = sortPriority.indexOf(b);
    if (sortIndexA !== -1) {
        if (sortIndexB !== -1) {
            return sortIndexA - sortIndexB;
        }
        return -1;
    } else if (sortIndexB !== -1) {
        return 1;
    }
    return a.localeCompare(b);
});
export type ColorMatricesType = string;

export function getColorMatrix(type: string, ...args): number[] {
    return (ColorMatrices[type] as Function)?.apply(ColorMatrices, args);
}

// function calculateInterpolation(outMatrix: android.graphics.Matrix, startValues, stopValues, fraction) {
//     const currentValues = [];
//     for (let i = 0; i < 9; i++) {
//         currentValues[i] = (1 - fraction) * startValues[i] + fraction * stopValues[i];
//     }
//     outMatrix.setValues(currentValues);
// }

// export async function setImageRotation(imageView: Image, rotation, duration?: number) {

//     const scaleType = imageView.nativeViewProtected.getHierarchy().getActualImageScaleType();
//     if (scaleType['setImageRotation']) {
//         scaleType['setImageRotation'](rotation);
//         (imageView.nativeViewProtected as android.widget.ImageView).invalidate();
//     }
// }
// export async function setImageMatrix(imageView: Image, values: number[], duration?: number) {
//     if (duration) {
//         return new Promise<void>((resolve, reject) => {
//             try {
//                 const currentAnimator = imageView['matrixAnimator'];
//                 if (currentAnimator) {
//                     currentAnimator.cancel();
//                     currentAnimator.removeAllUpdateListeners();
//                     currentAnimator.removeAllListeners();
//                     imageView['matrixAnimator'] = null;
//                 }
//                 const arr = Array.create('float', 2);
//                 arr[0] = 0;
//                 arr[1] = 1;
//                 const valueAnimator = android.animation.ValueAnimator.ofFloat(arr);
//                 const startValues = Array.create('float', 9);
//                 (imageView.nativeViewProtected as android.widget.ImageView).getImageMatrix().getValues(startValues);
//                 const currentMatrix = new android.graphics.Matrix();
//                 valueAnimator.setInterpolator(new android.view.animation.DecelerateInterpolator());
//                 valueAnimator.setDuration(duration);
//                 valueAnimator.addUpdateListener(
//                     new android.animation.ValueAnimator.AnimatorUpdateListener({
//                         onAnimationUpdate(valueAnimator) {
//                             calculateInterpolation(currentMatrix, startValues, values, valueAnimator.getAnimatedValue());
//                             (imageView.nativeViewProtected as android.widget.ImageView).setImageMatrix(currentMatrix);
//                         }
//                     })
//                 );
//                 valueAnimator.addListener(
//                     new android.animation.Animator.AnimatorListener({
//                         onAnimationStart() {},
//                         onAnimationRepeat() {},
//                         onAnimationCancel(animation) {
//                             imageView['matrixAnimator'] = null;
//                         },

//                         onAnimationEnd(animation) {
//                             resolve();
//                             imageView['matrixAnimator'] = null;
//                         }
//                     })
//                 );
//                 imageView['matrixAnimator'] = valueAnimator;
//                 valueAnimator.start();
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     } else {
//         const matrix = new android.graphics.Matrix();
//         const arr = Array.create('float', values.length);
//         for (let index = 0; index < values.length; index++) {
//             console.log('arr', index, values[index]);
//             arr[index] = values[index];
//         }
//         matrix.setValues(arr);
//         const scaleType = imageView.nativeViewProtected.getHierarchy().getActualImageScaleType();
//         if (scaleType['setImageMatrix']) {
//             scaleType['setImageMatrix'](matrix)(imageView.nativeViewProtected as android.widget.ImageView).invalidate();
//         }
//     }
// }

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
        console.log('importAndScanImage', selection);
        if (selection?.length) {
            if (__ANDROID__) {
                await showLoading(l('computing'));
            }
            const sourceImagePath = selection[0].path;
            editingImage = await loadImage(sourceImagePath);

            if (!editingImage) {
                throw new Error('failed to read imported image');
            }
            let quads = getJSONDocumentCorners(editingImage, 300, 0);

            if (quads.length === 0) {
                quads.push([
                    [0, 0],
                    [editingImage.width - 100, 0],
                    [editingImage.width - 100, editingImage.height - 100],
                    [0, editingImage.height - 100]
                ]);
            }
            if (quads?.length) {
                if (__IOS__) {
                    await timeout(100);
                }
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
                    const images = cropDocument(editingImage, quads);

                    if (images?.length) {
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
                            DEV_LOG && console.log('added page', pagesToAdd[pagesToAdd.length - 1]);
                        }
                        if (document) {
                            await document.addPages(pagesToAdd);
                            await document.save();
                        } else {
                            document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
                            // TODO: do we need to save?
                            // await document.save();
                            documentsService.notify({ eventName: 'documentAdded', object: documentsService, doc: document });
                        }
                        recycleImages(images);
                        return document;
                    }
                }
            } else {
                showSnack({ message: lc('no_document_found') });
            }
        }
    } catch (error) {
        showError(error);
    } finally {
        hideLoading();
        recycleImages(editingImage);
    }
}
