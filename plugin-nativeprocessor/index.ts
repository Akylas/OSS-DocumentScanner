import type { ImageSource } from '@nativescript/core';

export interface OCRData {
    text: string;
    blocks: {
        box: { x: number; y: number; width: number; height: number };
        text: string;
        confidence: number;
        fontFamily?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        fontSize?: number;
    }[];
    imageWidth: number;
    imageHeight: number;
}

export interface DetectOptions {
    adapThresholdBlockSize: number; // 391
    adapThresholdC: number; // 53

    detectContours: number;

    textDetectDilate: number; // 0
    textMorphologyEx1: number; // 34
    textMorphologyEx2: number; // 12

    dataPath: string;
    language: string;
    dpi: string;
    pageSegMode: number;
    iteratorLevel: number;
    oem: number;
}

export function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    let images /* : android.graphics.Bitmap[] */;
    if (__ANDROID__) {
        images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify(quads), transforms);
    } else {
        // nImages is a NSArray
        const nImages = OpencvDocumentProcessDelegate.cropDocumentQuadsTransforms(editingImage.ios, JSON.stringify(quads), transforms);
        images = [];
        for (let index = 0; index < nImages.count; index++) {
            images[index] = nImages.objectAtIndex(index);
        }
    }
    return images;
}
export function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): [number, number][][] {
    let corners;
    if (__ANDROID__) {
        corners = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, resizeThreshold, imageRotation);
    } else {
        corners = OpencvDocumentProcessDelegate.getJSONDocumentCornersShrunkImageHeightImageRotation(editingImage.ios, resizeThreshold, imageRotation);
    }
    return corners ? JSON.parse(corners) : [];
}

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    // DEV_LOG && console.log('ocrDocument', editingImage.width, editingImage.height, options);
    return new Promise<OCRData>((resolve, reject) => {
        if (__ANDROID__) {
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
        } else {
            // TODO: implement iOS
        }
    });
}
