import { request } from '@nativescript-community/perms';
import { pickFolder } from '@nativescript-community/ui-document-picker';
import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
import { AlertDialog, MDCAlertControlerOptions, alert, prompt } from '@nativescript-community/ui-material-dialogs';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { HorizontalPosition, PopoverOptions, VerticalPosition } from '@nativescript-community/ui-popover';
import { closePopover, showPopover } from '@nativescript-community/ui-popover/svelte';
import {
    AlertOptions,
    Animation,
    AnimationDefinition,
    Application,
    ApplicationSettings,
    GridLayout,
    ImageSource,
    ObservableArray,
    Utils,
    View,
    ViewBase,
    knownFolders,
    path
} from '@nativescript/core';
import { SDK_VERSION, copyToClipboard, openFile, openUrl } from '@nativescript/core/utils';
import * as imagePickerPlugin from '@nativescript/imagepicker';
import dayjs from 'dayjs';
import { cropDocument, detectQRCode, getColorPalette, getJSONDocumentCorners } from 'plugin-nativeprocessor';
import { showModal } from 'svelte-native';
import { NativeViewElementNode, createElement } from 'svelte-native/dom';
import { get } from 'svelte/store';
import type LoadingIndicator__SvelteComponent_ from '~/components/common/LoadingIndicator.svelte';
import LoadingIndicator from '~/components/common/LoadingIndicator.svelte';
import type BottomSnack__SvelteComponent_ from '~/components/widgets/BottomSnack.svelte';
import BottomSnack from '~/components/widgets/BottomSnack.svelte';
import { l, lc } from '~/helpers/locale';
import { OCRDocument, OCRPage, PageData } from '~/models/OCRDocument';
import {
    CROP_ENABLED,
    DEFAULT_EXPORT_DIRECTORY,
    DOCUMENT_NOT_DETECTED_MARGIN,
    IMG_COMPRESS,
    IMG_FORMAT,
    PREVIEW_RESIZE_THRESHOLD,
    QRCODE_RESIZE_THRESHOLD,
    TRANSFORMS_SPLIT
} from '~/models/constants';
import { documentsService } from '~/services/documents';
import { ocrService } from '~/services/ocr';
import { getTransformedImage } from '~/services/pdf/PDFExportCanvas.common';
import { cleanFilename, exportPDFAsync } from '~/services/pdf/PDFExporter';
import { showError } from '~/utils/error';
import { loadImage, recycleImages } from '~/utils/images';
import { share } from '~/utils/share';
import { showToast } from '~/utils/ui';
import { colors, fontScale } from '~/variables';

export { ColorMatricesType, ColorMatricesTypes, getColorMatrix } from '~/utils/matrix';

export interface ComponentInstanceInfo<T extends ViewBase = View, U = SvelteComponent> {
    element: NativeViewElementNode<T>;
    viewInstance: U;
}

export function resolveComponentElement<T>(viewSpec: typeof SvelteComponent<T>, props?: T): ComponentInstanceInfo {
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
    if (!loadingIndicator) {
        return;
    }
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
export async function importAndScanImageFromUris(uris, document?: OCRDocument) {
    let pagesToAdd: PageData[] = [];
    DEV_LOG && console.log('importAndScanImageFromUris', uris);
    let items;
    try {
        await showLoading(l('computing'));
        const cropEnabled = ApplicationSettings.getBoolean('cropEnabled', CROP_ENABLED);

        items = await Promise.all(
            uris.map(
                (s) =>
                    new Promise(async (resolve, reject) => {
                        try {
                            const sourceImagePath = s;
                            const editingImage = await loadImage(sourceImagePath);

                            if (!editingImage) {
                                throw new Error('failed to read imported image');
                            }

                            const noDetectionMargin = ApplicationSettings.getNumber('documentNotDetectedMargin', DOCUMENT_NOT_DETECTED_MARGIN);
                            const previewResizeThreshold = ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD);
                            const quads = cropEnabled ? await getJSONDocumentCorners(editingImage, previewResizeThreshold * 1.5, 0) : undefined;
                            let qrcode;
                            if (CARD_APP) {
                                // try to get the qrcode to show it in the import screen
                                qrcode = await detectQRCode(editingImage, { resizeThreshold: QRCODE_RESIZE_THRESHOLD });
                            }
                            if (cropEnabled && quads.length === 0) {
                                quads.push([
                                    [noDetectionMargin, noDetectionMargin],
                                    [editingImage.width - noDetectionMargin, noDetectionMargin],
                                    [editingImage.width - noDetectionMargin, editingImage.height - noDetectionMargin],
                                    [noDetectionMargin, editingImage.height - noDetectionMargin]
                                ]);
                            }
                            resolve({ editingImage, quads, sourceImagePath, qrcode });
                        } catch (error) {
                            reject(error);
                        }
                    })
            )
        );
        DEV_LOG && console.log('items', items);
        // const sourceImagePath = selection[0].path;
        // editingImage = await loadImage(sourceImagePath);

        // if (!editingImage) {
        //     throw new Error('failed to read imported image');
        // }
        // let quads = await getJSONDocumentCorners(editingImage, 300, 0);
        // let qrcode;
        // if (CARD_APP) {
        //     // try to get the qrcode to show it in the import screen
        //     qrcode = await detectQRCode(editingImage, { resizeThreshold: 900 });
        // }
        // if (quads.length === 0) {
        //     quads.push([
        //         [100, 100],
        //         [editingImage.width - 100, 100],
        //         [editingImage.width - 100, editingImage.height - 100],
        //         [100, editingImage.height - 100]
        //     ]);
        // }
        if (items?.length) {
            if (cropEnabled) {
                const ModalImportImage = (await import('~/components/ModalImportImages.svelte')).default;
                const newItems = await showModal({
                    page: ModalImportImage,
                    animated: true,
                    fullscreen: true,
                    props: {
                        items
                    }
                });
                DEV_LOG && console.log('items after crop1', newItems, items);
            }
            if (items) {
                DEV_LOG && console.log('items after crop', items);

                pagesToAdd = (
                    await Promise.all(
                        items.map(
                            (item) =>
                                new Promise<PageData[]>(async (resolve, reject) => {
                                    try {
                                        DEV_LOG && console.log('about to cropDocument', item.quads);
                                        const editingImage = item.editingImage;
                                        const images = cropEnabled ? await cropDocument(editingImage, item.quads) : [__IOS__ ? editingImage.ios : editingImage.android];
                                        let qrcode;
                                        let colors;
                                        if (CARD_APP) {
                                            [qrcode, colors] = await Promise.all([detectQRCode(images[0], { resizeThreshold: 900 }), getColorPalette(images[0])]);
                                            DEV_LOG && console.log('qrcode and colors', qrcode, colors);
                                        }
                                        const result = [];
                                        if (images?.length) {
                                            for (let index = 0; index < images.length; index++) {
                                                const image = images[index];
                                                result.push({
                                                    image,
                                                    crop: item.quads?.[index] || [
                                                        [0, 0],
                                                        [editingImage.width - 0, 0],
                                                        [editingImage.width - 0, editingImage.height - 0],
                                                        [0, editingImage.height - 0]
                                                    ],
                                                    sourceImagePath: item.sourceImagePath,
                                                    width: __ANDROID__ ? image.getWidth() : image.size.width,
                                                    height: __ANDROID__ ? image.getHeight() : image.size.height,
                                                    rotation: editingImage.rotationAngle,
                                                    ...(CARD_APP
                                                        ? {
                                                              qrcode,
                                                              colors
                                                          }
                                                        : {})
                                                });
                                            }
                                        }
                                        resolve(result);
                                    } catch (error) {
                                        reject(error);
                                    }
                                })
                        )
                    )
                ).flat();
                DEV_LOG && console.log('pagesToAdd', pagesToAdd);
                if (pagesToAdd.length) {
                    if (document) {
                        await document.addPages(pagesToAdd);
                        await document.save({}, false);
                    } else {
                        document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
                    }
                    return document;
                }
            }
        }
        showSnack({ message: lc('no_document_found') });
    } catch (error) {
        throw error;
    } finally {
        hideLoading();
        recycleImages(pagesToAdd.map((p) => p.image));
        if (items) {
            recycleImages(items.map((i) => i.editingImage));
        }
    }
}
export async function importAndScanImage(document?: OCRDocument) {
    await request({ storage: {}, photo: {} });
    // let selection: { files: string[]; ios?; android? };
    let selection;
    // let editingImage: ImageSource;
    try {
        // if (__ANDROID__) {
        //     // selection = (
        //     //     await openFilePicker({
        //     //         mimeTypes: ['image/*'],
        //     //         documentTypes: __IOS__ ? [UTTypeImage.identifier] : undefined,
        //     //         multipleSelection: true,
        //     //         pickerMode: 0
        //     //     })
        //     // )?.files;
        //     await new Promise((resolve, reject) => {
        //         com.akylas.documentscanner.ImagePicker.Companion.pickImagesVideos(
        //             Application.android.startActivity,
        //             new com.akylas.documentscanner.ImagePicker.OnResult({
        //                 onResult: (err, result) => {
        //                     if (err) {
        //                         reject(err);
        //                     } else {
        //                         resolve(result);
        //                     }
        //                 }
        //             }),
        //             ''
        //         );
        //     });
        // } else {
        selection = await imagePickerPlugin
            .create({
                mediaType: 1,
                android: {
                    // read_external_storage: lc('import_images')
                },
                mode: 'multiple' // use "multiple" for multiple selection
            })
            // on android pressing the back button will trigger an error which we dont want
            .present()
            .catch((err) => null);
        // }
        //we need to wait a bit or the presenting controller
        // is still the image picker and will mix things up
        if (__IOS__) {
            await timeout(500);
        }
        // }
        DEV_LOG && console.log('selection', selection);
        if (selection?.length) {
            showLoading(l('computing'));
            return await importAndScanImageFromUris(
                selection.map((s) => s.path),
                document
            );
        }
    } catch (error) {
        showError(error);
    } finally {
        hideLoading();
    }
}

export async function showAlertOptionSelect<T>(viewSpec: typeof SvelteComponent<T>, props?: T, options?: Partial<AlertOptions & MDCAlertControlerOptions>) {
    let componentInstanceInfo: ComponentInstanceInfo;
    try {
        componentInstanceInfo = resolveComponentElement(viewSpec, {
            onClose: (result) => {
                view.bindingContext.closeCallback(result);
            },
            onCheckBox(item, value, e) {
                view.bindingContext.closeCallback(item);
            },
            trackingScrollView: 'collectionView',
            ...props
        });
        const view: View = componentInstanceInfo.element.nativeView;
        const result = await alert({
            view,
            okButtonText: lc('cancel'),
            ...(options ? options : {})
        });
        return result;
    } catch (err) {
        throw err;
    } finally {
        componentInstanceInfo.element.nativeElement._tearDownUI();
        componentInstanceInfo.viewInstance.$destroy();
        componentInstanceInfo = null;
    }
}

export async function showPopoverMenu<T = any>({
    options,
    anchor,
    onClose,
    props,
    horizPos,
    vertPos,
    closeOnClose = true
}: { options; anchor; onClose?; props?; closeOnClose? } & Partial<PopoverOptions>) {
    const { colorSurfaceContainer } = get(colors);
    const OptionSelect = (await import('~/components/common/OptionSelect.svelte')).default;
    const rowHeight = (props?.rowHeight || 58) * get(fontScale);
    const result: T = await showPopover({
        backgroundColor: colorSurfaceContainer,
        view: OptionSelect,
        anchor,
        horizPos: horizPos ?? HorizontalPosition.ALIGN_LEFT,
        vertPos: vertPos ?? VerticalPosition.CENTER,
        props: {
            borderRadius: 10,
            elevation: 3,
            margin: 4,
            fontWeight: 500,
            backgroundColor: colorSurfaceContainer,
            containerColumns: 'auto',
            rowHeight: !!props?.autoSizeListItem ? null : rowHeight,
            height: Math.min(rowHeight * options.length, props?.maxHeight || 400),
            width: 200 * get(fontScale),
            options,
            onClose: async (item) => {
                if (closeOnClose) {
                    if (__IOS__) {
                        // on iOS we need to wait or if onClose shows an alert dialog it wont work
                        await closePopover();
                    } else {
                        closePopover();
                    }
                }
                try {
                    await onClose?.(item);
                } catch (error) {
                    showError(error);
                } finally {
                    hideLoading();
                }
            },
            ...(props || {})
        }
    });
    return result;
}

export async function showPDFPopoverMenu(pages: OCRPage[], document?: OCRDocument, anchor?) {
    let exportDirectory = ApplicationSettings.getString('pdf_export_directory', DEFAULT_EXPORT_DIRECTORY);
    let exportDirectoryName = exportDirectory;
    function updateDirectoryName() {
        exportDirectoryName = exportDirectory.split(/(\/|%3A)/).pop();
    }
    updateDirectoryName();

    const options = new ObservableArray(
        (__ANDROID__ ? [{ id: 'set_export_directory', name: lc('export_folder'), subtitle: exportDirectoryName, rightIcon: 'mdi-restore' }] : []).concat([
            { id: 'open', name: lc('open'), icon: 'mdi-eye' },
            { id: 'share', name: lc('share'), icon: 'mdi-share-variant' },
            { id: 'export', name: lc('export'), icon: 'mdi-export' },
            { id: 'preview', name: lc('preview'), icon: 'mdi-printer-eye' }
        ] as any)
    );
    return showPopoverMenu({
        options,
        anchor,
        vertPos: VerticalPosition.BELOW,
        props: {
            width: 250,
            // rows: 'auto',
            // rowHeight: null,
            // height: null,
            autoSizeListItem: true,
            onRightIconTap: (item, event) => {
                try {
                    switch (item.id) {
                        case 'set_export_directory': {
                            ApplicationSettings.remove('pdf_export_directory');
                            exportDirectory = DEFAULT_EXPORT_DIRECTORY;
                            updateDirectoryName();
                            const item = options.getItem(0);
                            item.subtitle = exportDirectoryName;
                            options.setItem(0, item);
                            break;
                        }
                    }
                } catch (error) {
                    showError(error);
                }
            }
        },

        closeOnClose: false,
        onClose: async (item) => {
            try {
                DEV_LOG && console.log('showPDFPopoverMenu', 'action', item.id);
                switch (item.id) {
                    case 'set_export_directory': {
                        const result = await pickFolder({
                            multipleSelection: false,
                            permissions: { write: true, persistable: true }
                        });
                        if (result.folders.length) {
                            exportDirectory = result.folders[0];
                            ApplicationSettings.setString('pdf_export_directory', exportDirectory);
                            updateDirectoryName();
                            const item = options.getItem(0);
                            item.subtitle = exportDirectoryName;
                            options.setItem(0, item);
                        }
                        break;
                    }
                    case 'open': {
                        await closePopover();
                        await showLoading(l('exporting'));
                        const filePath = await exportPDFAsync(pages, document);
                        hideLoading();
                        openFile(filePath);
                        break;
                    }
                    case 'share': {
                        await closePopover();
                        await showLoading(l('exporting'));
                        const filePath = await exportPDFAsync(pages, document);
                        hideLoading();
                        share({ file: filePath }, { mimetype: 'application/pdf' });
                        break;
                    }
                    case 'export': {
                        await closePopover();
                        const result = await prompt({
                            okButtonText: lc('ok'),
                            cancelButtonText: lc('cancel'),
                            defaultText: (document ? cleanFilename(document.name) : Date.now()) + '.pdf',
                            hintText: lc('pdf_filename')
                        });
                        if (result?.result && result?.text?.length) {
                            showLoading(l('exporting'));
                            DEV_LOG && console.log('exportPDF', exportDirectory, result.text);
                            const filePath = await exportPDFAsync(pages, document, exportDirectory, result.text);
                            hideLoading();
                            const onSnack = await showSnack({ message: lc('pdf_saved', filePath), actionText: lc('open') });
                            if (onSnack.reason === 'action') {
                                DEV_LOG && console.log('openFile', filePath);
                                openFile(filePath);
                            }
                        }
                        break;
                    }
                    case 'preview':
                        await closePopover();
                        const component = (await import('~/components/pdf/PDFPreview.svelte')).default;
                        await showModal({
                            page: component,
                            animated: true,
                            fullscreen: true,
                            props: {
                                pages,
                                document
                            }
                        });
                        break;
                }
            } catch (error) {
                showError(error);
            } finally {
                hideLoading();
            }
        }
    });
}

async function exportImage(pages: OCRPage[], exportDirectory: string) {
    const sortedPages = pages.sort((a, b) => a.createdDate - b.createdDate);
    const imagePaths = sortedPages.map((page) => page.imagePath);
    const canSetName = imagePaths.length === 1;
    let outputImageNames = [];
    if (canSetName) {
        const result = await prompt({
            okButtonText: lc('ok'),
            cancelButtonText: lc('cancel'),
            defaultText: Date.now() + '',
            hintText: lc('image_filename')
        });
        if (!result?.result || !result?.text?.length) {
            return;
        }
        outputImageNames.push(result.text);
    } else {
        outputImageNames = sortedPages.map((page) => page.createdDate);
        // find duplicates and rename if any
        let lastName;
        let renameDelta = 1;
        for (let index = 0; index < outputImageNames.length; index++) {
            const name = outputImageNames[index];
            if (name === lastName) {
                outputImageNames[index] = name + '_' + (renameDelta++ + '').padStart(2, '0');
                // we dont reset lastName so that we compare to the first one found
            } else {
                lastName = name;
                renameDelta = 1;
            }
        }
    }
    DEV_LOG && console.log('outputImageNames', outputImageNames);
    showLoading(l('exporting'));
    // const destinationPaths = [];
    let finalMessagePart;
    await Promise.all(
        sortedPages.map(
            (page, index) =>
                new Promise<void>(async (resolve, reject) => {
                    let imageSource: ImageSource;
                    try {
                        const destinationName = outputImageNames[index] + '.' + IMG_FORMAT;
                        // const imageSource = await ImageSource.fromFile(imagePath);
                        imageSource = await getTransformedImage(page);
                        if (__ANDROID__ && exportDirectory.startsWith('content://')) {
                            const context = Utils.android.getApplicationContext();
                            const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(exportDirectory));
                            let outfile = outdocument.createFile('image/jpeg', destinationName);
                            if (outfile == null) {
                                outfile = outdocument.findFile(destinationName);
                            }
                            if (!outfile) {
                                throw new Error(`error creating file "${destinationName}" in "${exportDirectory}"`);
                            }
                            if (!finalMessagePart) {
                                if (canSetName) {
                                    finalMessagePart = com.nativescript.documentpicker.FilePath.getPath(context, outfile.getUri());
                                } else {
                                    finalMessagePart = com.nativescript.documentpicker.FilePath.getPath(context, outdocument.getUri());
                                }
                            }
                            const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
                            (imageSource.android as android.graphics.Bitmap).compress(android.graphics.Bitmap.CompressFormat.JPEG, IMG_COMPRESS, stream);
                            // destinationPaths.push(outfile.getUri().toString());
                        } else {
                            const destinationPath = path.join(exportDirectory, destinationName);
                            await imageSource.saveToFileAsync(destinationPath, IMG_FORMAT, IMG_COMPRESS);
                            // destinationPaths.push(destinationPath);
                            if (!finalMessagePart) {
                                if (canSetName) {
                                    finalMessagePart = destinationPath;
                                } else {
                                    finalMessagePart = exportDirectory;
                                }
                            }
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    } finally {
                        recycleImages(imageSource);
                    }
                })
        )
    );
    if (outputImageNames.length === 1) {
        await showSnack({ message: lc('image_saved', finalMessagePart) });
    } else {
        await showSnack({ message: lc('images_saved', finalMessagePart) });
    }
}

export async function showImagePopoverMenu(pages: OCRPage[], anchor) {
    let exportDirectory = ApplicationSettings.getString('image_export_directory', DEFAULT_EXPORT_DIRECTORY);
    let exportDirectoryName = exportDirectory;
    function updateDirectoryName() {
        exportDirectoryName = exportDirectory.split(/(\/|%3A)/).pop();
    }
    updateDirectoryName();

    const options = new ObservableArray(
        (__ANDROID__ ? [{ id: 'set_export_directory', name: lc('export_folder'), subtitle: exportDirectoryName, rightIcon: 'mdi-restore' }] : []).concat([
            { id: 'share', name: lc('share'), icon: 'mdi-share-variant' },
            { id: 'export', name: lc('export'), icon: 'mdi-export', subtitle: undefined }
        ] as any)
    );
    return showPopoverMenu({
        options,
        anchor,
        vertPos: VerticalPosition.BELOW,
        props: {
            width: 250,
            // rows: 'auto',
            // rowHeight: null,
            // height: null,
            // autoSizeListItem: true,
            onRightIconTap: (item, event) => {
                try {
                    switch (item.id) {
                        case 'set_export_directory': {
                            ApplicationSettings.remove('image_export_directory');
                            exportDirectory = DEFAULT_EXPORT_DIRECTORY;
                            updateDirectoryName();
                            const item = options.getItem(0);
                            item.subtitle = exportDirectoryName;
                            options.setItem(0, item);
                            break;
                        }
                    }
                } catch (error) {
                    showError(error);
                }
            }
        },

        closeOnClose: false,
        onClose: async (item) => {
            try {
                switch (item.id) {
                    case 'set_export_directory': {
                        const result = await pickFolder({
                            multipleSelection: false,
                            permissions: { write: true, persistable: true }
                        });
                        if (result.folders.length) {
                            exportDirectory = result.folders[0];
                            ApplicationSettings.setString('image_export_directory', exportDirectory);
                            updateDirectoryName();
                            const item = options.getItem(0);
                            item.subtitle = exportDirectoryName;
                            options.setItem(0, item);
                        }
                        break;
                    }
                    case 'share':
                        await closePopover();
                        const images = [];
                        const files = [];
                        try {
                            for (let index = 0; index < pages.length; index++) {
                                const page = pages[index];
                                if (page.colorMatrix) {
                                    const imageSource = await getTransformedImage(page);
                                    images.push(imageSource);
                                } else {
                                    files.push(page.imagePath);
                                }
                            }
                            await share({ images, files });
                        } catch (error) {
                            throw error;
                        } finally {
                            recycleImages(images);
                        }
                        break;
                    case 'export': {
                        await closePopover();
                        await exportImage(pages, exportDirectory);

                        break;
                    }
                }
            } catch (error) {
                showError(error);
            } finally {
                hideLoading();
            }
        }
    });
}

export interface ShowSnackMessageOptions {
    text: string;
    progress?: number;
    translateY?: number;
}
let snackMessage: ComponentInstanceInfo<GridLayout, BottomSnack__SvelteComponent_>;
function getSnackMessage(props?) {
    if (!snackMessage) {
        snackMessage = resolveComponentElement(BottomSnack, props || {}) as ComponentInstanceInfo<GridLayout, BottomSnack__SvelteComponent_>;
        try {
            (Application.getRootView() as GridLayout).addChild(snackMessage.element.nativeView);
        } catch (error) {
            console.error(error, error.stack);
        }
    }
    return snackMessage;
}
export function updateSnackMessage(msg: Partial<ShowSnackMessageOptions>) {
    if (snackMessage) {
        const snackMessage = getSnackMessage();
        const props = {
            progress: msg.progress
        };
        if (msg.text) {
            props['text'] = msg.text;
        }
        snackMessage.viewInstance.$set(props);
    }
}
export async function showSnackMessage(props: ShowSnackMessageOptions) {
    if (snackMessage) {
        updateSnackMessage(props);
    } else {
        const snackMessage = getSnackMessage(props);
        const animationArgs = [
            {
                target: snackMessage.element.nativeView,
                translate: { x: 0, y: 0 },
                duration: 100
            }
        ];
        Application.notify({ eventName: 'snackMessageAnimation', animationArgs });
        await new Animation(animationArgs).play();
        updateSnackMessage({ translateY: 0 });
    }
}
export async function hideSnackMessage() {
    if (snackMessage) {
        const animationArgs: AnimationDefinition[] = [
            {
                target: snackMessage.element.nativeView,
                translate: { x: 0, y: 100 },
                duration: 100
            }
        ];
        Application.notify({ eventName: 'snackMessageAnimation', animationArgs });
        await new Animation(animationArgs).play();
        (Application.getRootView() as GridLayout).removeChild(snackMessage.element.nativeView);
        snackMessage.element.nativeElement._tearDownUI();
        snackMessage.viewInstance.$destroy();
        snackMessage = null;
    }
}

export async function detectOCROnPage(document: OCRDocument, index: number) {
    try {
        if (!(await ocrService.checkOrDownload(ocrService.dataType, ocrService.languages, false))) {
            return;
        }
        showLoading({ text: l('ocr_computing', 0), progress: 0 });
        const ocrData = await ocrService.ocrPage(document, index, (progress: number) => {
            updateLoadingProgress({ progress, text: l('ocr_computing', progress) });
        });
        return ocrData;
    } catch (err) {
        throw err;
    } finally {
        hideLoading();
        // recycleImages(ocrImage);
    }
}
export async function transformPages({ documents, pages }: { documents?: OCRDocument[]; pages?: { page: OCRPage; pageIndex: number; document: OCRDocument }[] }) {
    try {
        const view = (await import('~/components/common/TransformPagesBottomSheet.svelte')).default;
        const updateOptions = await showBottomSheet({
            view,
            skipCollapsedState: true
        });
        if (updateOptions) {
            // await showLoading(l('computing'));

            // we want to ocr the full document.
            const progress = 0;
            if (!pages && documents) {
                pages = [];
                documents.forEach((document) => {
                    pages.push(...document.pages.reduce((acc, page, pageIndex) => acc.concat([{ page, pageIndex, document }]), []));
                });
            }
            const totalPages = pages.length;
            let pagesDone = 0;
            showSnackMessage({
                text: lc('updating_pages', progress),
                progress: 0
            });
            await Promise.all(
                pages.map(async (p, index) => {
                    const pageId = p.page.id;
                    await p.document.updatePageTransforms(p.pageIndex, updateOptions.transforms.join(TRANSFORMS_SPLIT), null, {
                        colorType: updateOptions.colorType,
                        colorMatrix: updateOptions.colorMatrix
                    });

                    const progress = Math.round((pagesDone / totalPages) * 100);
                    updateSnackMessage({
                        text: lc('updating_pages', progress),
                        progress
                    });
                    pagesDone += 1;
                })
            );
        }
    } catch (error) {
        throw error;
    } finally {
        hideSnackMessage();
    }
}
export async function detectOCR({ documents, pages }: { documents?: OCRDocument[]; pages?: { page: OCRPage; pageIndex: number; document: OCRDocument }[] }) {
    try {
        const OCRSettingsBottomSheet = (await import('~/components/ocr/OCRSettingsBottomSheet.svelte')).default;
        const shouldStart = await showBottomSheet({
            view: OCRSettingsBottomSheet,
            skipCollapsedState: true,
            props: {}
        });
        if (shouldStart) {
            if (!(await ocrService.checkOrDownload(ocrService.dataType, ocrService.languages, false, true))) {
                return;
            }

            // we want to ocr the full document.
            const progress = 0;
            if (!pages && documents) {
                pages = [];
                documents.forEach((document) => {
                    pages.push(...document.pages.reduce((acc, page, pageIndex) => acc.concat([{ page, pageIndex, document }]), []));
                });
            }
            const totalPages = pages.length;
            let pagesDone = 0;
            showSnackMessage({
                text: lc('ocr_computing_document', progress),
                progress: 0
            });
            const runnningOcr: { [k: string]: number } = {};
            await Promise.all(
                pages.map(async (p, index) => {
                    const pageId = p.page.id;
                    runnningOcr[pageId] = 0;
                    await ocrService.ocrPage(p.document, p.pageIndex, (progress: number) => {
                        runnningOcr[pageId] = progress;
                        const totalProgress = Math.round((100 / totalPages) * pagesDone + Object.values(runnningOcr).reduce((a, b) => a + b) / totalPages);
                        updateSnackMessage({
                            text: lc('ocr_computing_document', totalProgress),
                            progress: totalProgress
                        });
                    });
                    delete runnningOcr[pageId];
                    pagesDone += 1;
                })
            );
        }
    } catch (error) {
        throw error;
    } finally {
        hideSnackMessage();
    }
}

export function copyTextToClipboard(text) {
    copyToClipboard(text);
    if (__IOS__ || (__ANDROID__ && SDK_VERSION < 13)) {
        showToast(lc('copied'));
    }
}
