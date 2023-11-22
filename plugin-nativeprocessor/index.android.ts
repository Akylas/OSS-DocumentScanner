import type { ImageSource } from '@nativescript/core';
import { DetectOptions, OCRData } from '.';

export function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    /* : android.graphics.Bitmap[] */ const images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify(quads), transforms);

    return images;
}
export function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): [number, number][][] {
    const corners = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, resizeThreshold, imageRotation);

    return corners ? JSON.parse(corners) : [];
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
