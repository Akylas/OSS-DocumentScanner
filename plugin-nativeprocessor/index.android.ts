import { ImageSource, Utils } from '@nativescript/core';
import { DetectOptions, DetectQRCodeOptions, GenerateColorOptions, GenerateQRCodeOptions, OCRData } from '.';
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

export async function detectQRCode(editingImage: ImageSource | android.graphics.Bitmap, options?: Partial<DetectQRCodeOptions>, onProgress?: (progress: number) => void) {
    return new Promise<any>((resolve, reject) => {
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

export function generateQRCodeImageSync(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
    com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCodeSync(text, format, width, height, options ? JSON.stringify(options) : '');
}

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
