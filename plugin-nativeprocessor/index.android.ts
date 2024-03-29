import { ImageSource, Utils } from '@nativescript/core';
import { CornersOptions, CropOptions, CropResult, DetectOptions, DetectQRCodeOptions, GenerateColorOptions, GenerateQRCodeOptions, LoadImageOptions, OCRData, QRCodeData } from '.';
import { CropView } from './CropView';

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    return new Promise<any[]>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(
            editingImage.android,
            JSON.stringify(quads),
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result);
                    }
                }
            }),
            transforms
        );
    });
}
export async function cropDocumentFromFile(src: string, quads, options: CropOptions = {}) {
    return new Promise<CropResult[]>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocumentFromFile(
            Utils.android.getApplicationContext(),
            src,
            JSON.stringify(quads),
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    console.log('cropDocumentFromFile', e, result);
                    if (e) {
                        reject(e);
                    } else {
                        resolve(JSON.parse(result));
                    }
                }
            }),
            JSON.stringify(options)
        );
    });
}
export async function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): Promise<[number, number][][]> {
    return new Promise((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(
            editingImage.android,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : []);
                    }
                }
            }),
            resizeThreshold,
            imageRotation
        );
    });
}
export async function getJSONDocumentCornersFromFile(src: string, options: CornersOptions = {}): Promise<[number, number][][]> {
    return new Promise((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCornersFromFile(
            Utils.android.getApplicationContext(),
            src,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : []);
                    }
                }
            }),
            JSON.stringify(options)
        );
    });
}
export async function processFromFile(src: string, processes: any[], options: LoadImageOptions = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.processFromFile(
            Utils.android.getApplicationContext(),
            src,
            JSON.stringify(processes),
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : []);
                    }
                }
            }),
            JSON.stringify(options)
        );
    });
}
// export async function getJSONDocumentCornersAndImage(
//     imageProxy: androidx.camera.core.ImageProxy,
//     processor: com.nativescript.cameraview.ImageAsyncProcessor,
//     resizeThreshold = 300,
//     imageRotation = 0
// ): Promise<[android.graphics.Bitmap, [number, number][][]]> {
//     return new Promise((resolve, reject) => {
//         com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCornersAndImage(
//             imageProxy,
//             processor,
//             new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
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

export async function getColorPalette(
    editingImage: ImageSource,
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 0, colorPalette: 0 }
): Promise<[number, number][][]> {
    return new Promise((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPalette(
            editingImage['android'] || editingImage,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : []);
                    }
                }
            }),
            options.resizeThreshold,
            options.colorsFilterDistanceThreshold,
            options.colorPalette
        );
    });
}
export async function getColorPaletteFromFile(
    src: string,
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 0, colorPalette: 0 },
    strOptions?: string
): Promise<[number, number][][]> {
    return new Promise((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPaletteFromFile(
            Utils.android.getApplicationContext(),
            src,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : []);
                    }
                }
            }),
            options.resizeThreshold,
            options.colorsFilterDistanceThreshold,
            options.colorPalette,
            strOptions
        );
    });
}

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocument(
            editingImage.android,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                }
            }),
            options ? JSON.stringify(options) : '',
            onProgress
                ? new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress({
                      onProgress
                  })
                : undefined
        );
    });
}
export async function ocrDocumentFromFile(src: string, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocumentFromFile(
            Utils.android.getApplicationContext(),
            src,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                }
            }),
            options ? JSON.stringify(options) : '',
            onProgress
                ? new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress({
                      onProgress
                  })
                : undefined
        );
    });
}

export async function detectQRCode(editingImage: ImageSource | android.graphics.Bitmap, options?: Partial<DetectQRCodeOptions>) {
    return new Promise<QRCodeData>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCode(
            editingImage['android'] || editingImage,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                }
            }),
            options ? JSON.stringify(options) : ''
        );
    });
}

export async function detectQRCodeFromFile(src: string, options: Partial<DetectQRCodeOptions> = {}) {
    return new Promise<QRCodeData>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCodeFromFile(
            Utils.android.getApplicationContext(),
            src,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                }
            }),
            JSON.stringify(options)
        );
    });
}

export async function generateQRCodeImage(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
    return new Promise<any>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCode(
            text,
            format,
            width,
            height,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? new ImageSource(result) : null);
                    }
                }
            }),
            options ? JSON.stringify(options) : ''
        );
    });
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
