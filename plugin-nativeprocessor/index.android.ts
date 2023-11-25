import type { ImageSource } from '@nativescript/core';
import { DetectOptions, OCRData } from '.';

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    return new Promise<any[]>((resolve, reject) => {
        com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(
            editingImage.android,
            JSON.stringify(quads),
            new com.akylas.documentscanner.CustomImageAnalysisCallback.OCRDocumentCallback({
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
            new com.akylas.documentscanner.CustomImageAnalysisCallback.OCRDocumentCallback({
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
            new com.akylas.documentscanner.CustomImageAnalysisCallback.OCRDocumentCallback({
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
                ? new com.akylas.documentscanner.CustomImageAnalysisCallback.OCRDocumentProgress({
                      onProgress
                  })
                : undefined
        );
    });
}
