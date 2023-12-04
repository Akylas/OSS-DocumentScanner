import { ImageSource } from '@nativescript/core';
import { DetectOptions, DetectQRCodeOptions, GenerateQRCodeOptions, OCRData } from '.';

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    console.log('cropDocument', transforms);
    return new Promise<any[]>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(
            editingImage.android,
            JSON.stringify(quads),
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    // DEV_LOG && console.log('ocrDocument onResult', e, result);
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
                    // DEV_LOG && console.log('ocrDocument onResult', e, result);
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

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    // DEV_LOG && console.log('ocrDocument', editingImage.width, editingImage.height, options);
    return new Promise<OCRData>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocument(
            editingImage.android,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    // DEV_LOG && console.log('ocrDocument onResult', e, result);
                    if (e) {
                        reject(e);
                    } else {
                        resolve(result ? JSON.parse(result) : null);
                    }
                }
            }),
            options ? JSON.stringify(options) : '',
            onProgress
                ? new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionProgress({
                      onProgress
                  })
                : undefined
        );
    });
}

export async function detectQRCode(editingImage: ImageSource | android.graphics.Bitmap, options?: Partial<DetectQRCodeOptions>, onProgress?: (progress: number) => void) {
    // DEV_LOG && console.log('ocrDocument', editingImage.width, editingImage.height, options);
    return new Promise<any>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCode(
            editingImage['android'] || editingImage,
            new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
                onResult(e, result) {
                    DEV_LOG && console.log('detectQRCode onResult', e, result);
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
    // DEV_LOG && console.log('ocrDocument', editingImage.width, editingImage.height, options);
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
    // DEV_LOG && console.log('ocrDocument', editingImage.width, editingImage.height, options);
    com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.generateQRCodeSync(text, format, width, height, options ? JSON.stringify(options) : '');
}
