import { ImageSource, Utils } from '@nativescript/core';
import {
    CornersOptions,
    CropOptions,
    CropResult,
    DetectOptions,
    DetectQRCodeOptions,
    GenerateColorOptions,
    GenerateQRCodeOptions,
    LoadImageOptions,
    OCRData,
    PDFImportOptions,
    QRCodeData,
    Quads
} from '.';
import { CropView } from './CropView';
import { wrapNativeException } from '@nativescript/core/utils';
import { SilentError } from '~/utils/error';

function androidFunctionCallbackPromise<T>(onCallback: (calback: com.akylas.documentscanner.utils.FunctionCallback) => void, transformer = (v) => v, errorHandler = (e) => wrapNativeException(e)) {
    return new Promise<T>((resolve, reject) => {
        onCallback(
            new com.akylas.documentscanner.utils.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(errorHandler(e));
                    } else {
                        try {
                            resolve(transformer(result));
                        } catch (error) {
                            reject(error);
                        }
                    }
                }
            })
        );
    });
}

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    return androidFunctionCallbackPromise<any[]>((callback) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify(quads), callback, transforms);
    });
    // return new Promise<any[]>((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(
    //         editingImage.android,
    //         JSON.stringify(quads),
    //         new com.akylas.documentscanner.utils.FunctionCallback({
    //             onResult(e, result) {
    //                 if (e) {
    //                     reject(e);
    //                 } else {
    //                     resolve(result);
    //                 }
    //             }
    //         }),
    //         transforms
    //     );
    // });
}
export async function cropDocumentFromFile(src: string, quads, options: CropOptions = {}) {
    return androidFunctionCallbackPromise<CropResult[]>((callback) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocumentFromFile(Utils.android.getApplicationContext(), src, JSON.stringify(quads), callback, JSON.stringify(options));
    }, JSON.parse);
    // return new Promise<CropResult[]>((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocumentFromFile(
    //         Utils.android.getApplicationContext(),
    //         src,
    //         JSON.stringify(quads),
    //         new com.akylas.documentscanner.utils.FunctionCallback({
    //             onResult(e, result) {
    //                 if (e) {
    //                     reject(e);
    //                 } else {
    //                     resolve(JSON.parse(result));
    //                 }
    //             }
    //         }),
    //         JSON.stringify(options)
    //     );
    // });
}
export async function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0) {
    return androidFunctionCallbackPromise<Quads>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, callback, resizeThreshold, imageRotation);
        },
        (r) => (r ? JSON.parse(r) : [])
    );
}
export async function getJSONDocumentCornersFromFile(src: string, options: CornersOptions = {}) {
    return androidFunctionCallbackPromise<Quads>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCornersFromFile(Utils.android.getApplicationContext(), src, callback, JSON.stringify(options));
        },
        (r) => (r ? JSON.parse(r) : [])
    );
}
export async function processFromFile(src: string, processes: any[], options: LoadImageOptions = {}) {
    return androidFunctionCallbackPromise<any[]>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.processFromFile(Utils.android.getApplicationContext(), src, JSON.stringify(processes), callback, JSON.stringify(options));
        },
        (r) => (r ? JSON.parse(r) : [])
    );
}
// export async function getJSONDocumentCornersAndImage(
//     imageProxy: androidx.camera.core.ImageProxy,
//     processor: com.nativescript.cameraview.ImageAsyncProcessor,
//     resizeThreshold = 300,
//     imageRotation = 0
// ): Promise<[android.graphics.Bitmap, Quads]> {
//     return new Promise((resolve, reject) => {
//         com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCornersAndImage(
//             imageProxy,
//             processor,
//             new com.akylas.documentscanner.utils.FunctionCallback({
//                 onResult(e, result: java.util.HashMap<string, any>) {
//                     if (e) {
//                         reject(e);
//                     } else {
//                         //
//                         const image = result.get('image');
//                         const corners = result.get('corners');
//                         resolve([image, corners ? JSON.parse(corners) : []]);
//                     }
//                 }
//             }),
//             resizeThreshold,
//             imageRotation
//         );
//     });
// }

export async function getColorPalette(editingImage: ImageSource, options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 20, nbColors: 5, colorPalette: 2 }) {
    return androidFunctionCallbackPromise<Quads>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPalette(
                editingImage['android'] || editingImage,
                callback,
                options.resizeThreshold,
                options.colorsFilterDistanceThreshold,
                options.nbColors,
                options.colorPalette
            );
        },
        (r) => (r ? JSON.parse(r) : [])
    );
}
export async function getColorPaletteFromFile(
    src: string,
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 20, nbColors: 5, colorPalette: 2 },
    strOptions?: string
) {
    return androidFunctionCallbackPromise<Quads>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPaletteFromFile(
                Utils.android.getApplicationContext(),
                src,
                callback,
                options.resizeThreshold,
                options.colorsFilterDistanceThreshold,
                options.colorPalette,
                strOptions
            );
        },
        (r) => (r ? JSON.parse(r) : [])
    );
}

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return androidFunctionCallbackPromise<OCRData>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocument(
                editingImage.android,
                callback,
                options ? JSON.stringify(options) : '',
                onProgress
                    ? new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress({
                          onProgress
                      })
                    : undefined
            );
        },
        (r) => (r ? JSON.parse(r) : null)
    );
}
export async function ocrDocumentFromFile(src: string, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return androidFunctionCallbackPromise<OCRData>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocumentFromFile(
                Utils.android.getApplicationContext(),
                src,
                callback,
                options ? JSON.stringify(options) : '',
                onProgress
                    ? new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress({
                          onProgress
                      })
                    : undefined
            );
        },
        (r) => (r ? JSON.parse(r) : null)
    );
}

export async function detectQRCode(editingImage: ImageSource | android.graphics.Bitmap, options?: Partial<DetectQRCodeOptions>) {
    return androidFunctionCallbackPromise<QRCodeData>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCode(editingImage['android'] || editingImage, callback, options ? JSON.stringify(options) : '');
        },
        (r) => (r ? JSON.parse(r) : null)
    );
}

export async function detectQRCodeFromFile(src: string, options: Partial<DetectQRCodeOptions> = {}) {
    return androidFunctionCallbackPromise<QRCodeData>(
        (callback) => {
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCodeFromFile(Utils.android.getApplicationContext(), src, callback, JSON.stringify(options));
        },
        (r) => (r ? JSON.parse(r) : null)
    );
}

export async function generateQRCodeImage(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
    return androidFunctionCallbackPromise<any>(
        (callback) => {
            // isMatrix: Aztec | DataMatrix | MaxiCode | PDF417 | QRCode | MicroQRCode | RMQRCode
            // use it to generate image squared or not
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCode(text, format, width, height, callback, options ? JSON.stringify(options) : '');
        },
        (r) => (r ? new ImageSource(r) : null)
    );
}

export async function generateQRCodeSVG(text: string, format: string, hintSize: number, options?: Partial<GenerateQRCodeOptions>) {
    return androidFunctionCallbackPromise<any>(
        (callback) => {
            // isMatrix: Aztec | DataMatrix | MaxiCode | PDF417 | QRCode | MicroQRCode | RMQRCode
            // use it to generate image squared or not
            com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCodeSVG(text, format, hintSize, callback, options ? JSON.stringify(options) : '');
        },
        (r) => (r?.length ? r : undefined)
    );
}

// export function generateQRCodeImageSync(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
//     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCodeSync(text, format, width, height, options ? JSON.stringify(options) : '');
// }

export function createAutoScanHandler(cropView: CropView, block: (result) => void): any {
    const AutoScanHandler = com.akylas.documentscanner.AutoScanHandler;
    return new AutoScanHandler(
        Utils.android.getApplicationContext(),
        cropView.nativeViewProtected,
        new AutoScanHandler.OnAutoScan({
            onAutoScan: block
        })
    );
}

export function createQRCodeCallback(onQRCodes): any {
    return onQRCodes
        ? new com.akylas.documentscanner.CustomImageAnalysisCallback.OnQRCode({
              onQRCodes
          })
        : null;
}

export async function importPdfToTempImages(pdfPath: string, options?: Partial<PDFImportOptions>) {
    return androidFunctionCallbackPromise<string[]>((callback) => {
        com.akylas.documentscanner.utils.PDFUtils.Companion.importPdfToTempImages(Utils.android.getApplicationContext(), pdfPath, callback, options ? JSON.stringify(options) : '');
    }, JSON.parse);
}

export function printPDF(filePath: string, name: string) {
    const context = Utils.android.getCurrentActivity();
    com.akylas.documentscanner.utils.PDFUtils.Companion.printPDF(context, filePath, name);
}

export async function getFileName(src: string) {
    return androidFunctionCallbackPromise<string>((callback) => {
        com.akylas.documentscanner.utils.ImageUtil.Companion.getFileName(Utils.android.getApplicationContext(), src, callback);
    });
}

export function generatePDFASync(destFolder: string, fileName: string, options: string, errorHandler) {
    return androidFunctionCallbackPromise<string>(
        (callback) => {
            com.akylas.documentscanner.utils.PDFUtils.Companion.generatePDFASync(Utils.android.getApplicationContext(), destFolder, fileName, options, callback);
        },
        (r) => r,
        errorHandler
    );
}

export async function getImageSize(imagePath: string) {
    return androidFunctionCallbackPromise<{ width: number; height: number; rotation: number }>(
        (callback) => {
            com.akylas.documentscanner.utils.ImageUtil.Companion.getImageSize(Utils.android.getApplicationContext(), imagePath, callback);
        },
        (r) => ({ width: r[0], height: r[1], rotation: r[2] })
    );
}
