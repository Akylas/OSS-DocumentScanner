import type { ImageSource } from '@nativescript/core';

export interface OCRData {
    text: string;
    blocks: { block: string; text: string; confidence: number; font_name?: string; bold?: boolean; italic?: boolean; underlined?: boolean; pointsize?: number }[];
}

export function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    console.log('cropDocument', editingImage.width, editingImage.height, quads, transforms);
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
    console.log('getJSONDocumentCorners', editingImage.width, editingImage.height, resizeThreshold, imageRotation);
    let corners;
    if (__ANDROID__) {
        corners = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, resizeThreshold, imageRotation);
    } else {
        corners = OpencvDocumentProcessDelegate.getJSONDocumentCornersShrunkImageHeightImageRotation(editingImage.ios, resizeThreshold, imageRotation);
    }
    return corners ? JSON.parse(corners) : [];
}

export function ocrDocument(editingImage: ImageSource, options?: {}): OCRData {
    let data;
    if (__ANDROID__) {
        data = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.ocrDocument(editingImage.android, options ? JSON.stringify(options) : '');
    } else {
        // TODO: implement iOS
    }
    return data ? JSON.parse(data) : [];
}
