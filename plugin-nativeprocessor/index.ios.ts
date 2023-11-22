import type { ImageSource } from '@nativescript/core';
import { DetectOptions, OCRData } from '.';

@NativeClass
class OCRDelegateDelegateImpl extends NSObject implements OCRDelegate {
    static ObjCProtocols = [OCRDelegate];
    resolve;
    reject;
    progress;
    onCompleteError(result: string, error): void {
        if (error) {
            this.reject(error);
        } else {
            this.resolve(result ? JSON.parse(result) : null);
        }
    }
    onProgress(progress: number): void {
        this.progress?.(progress);
    }

    static initWithResolveReject(resolve, reject, progress) {
        const delegate = OCRDelegateDelegateImpl.new() as OCRDelegateDelegateImpl;
        delegate.resolve = resolve;
        delegate.reject = reject;
        delegate.onProgress = progress;
        return delegate;
    }
}

export function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    // nImages is a NSArray
    const nImages = OpencvDocumentProcessDelegate.cropDocumentQuadsTransforms(editingImage.ios, JSON.stringify(quads), transforms);
    const images = [];
    for (let index = 0; index < nImages.count; index++) {
        images[index] = nImages.objectAtIndex(index);
    }
    return images;
}
export function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): [number, number][][] {
    const corners = OpencvDocumentProcessDelegate.getJSONDocumentCornersShrunkImageHeightImageRotation(editingImage.ios, resizeThreshold, imageRotation);
    return corners ? JSON.parse(corners) : [];
}

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.ocrDocumentOptionsDelegate(
                editingImage.ios,
                options ? JSON.stringify(options) : '',
                OCRDelegateDelegateImpl.initWithResolveReject(resolve, reject, onProgress)
            );
        } catch (error) {
            reject(error);
        }
    });
}
