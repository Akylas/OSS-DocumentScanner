import type { ImageSource } from '@nativescript/core';
import { DetectOptions, OCRData } from '.';

@NativeClass
class OCRDelegateDelegateImpl extends NSObject implements OCRDelegate {
    static ObjCProtocols = [OCRDelegate];
    resolve;
    reject;
    progress;
    onCompleteError(result: any, error): void {
        if (error) {
            this.reject(error);
        } else {
            if (typeof result === 'string') {
                this.resolve(result ? JSON.parse(result) : null);
            }
            this.resolve(result);
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

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    return new Promise<any[]>((resolve, reject) => {
        try {
            // nImages is a NSArray
            OpencvDocumentProcessDelegate.cropDocumentQuadsTransformsDelegate(
                editingImage.ios,
                JSON.stringify(quads),
                transforms,
                OCRDelegateDelegateImpl.initWithResolveReject(
                    (nImages) => {
                        const images = [];
                        for (let index = 0; index < nImages.count; index++) {
                            images[index] = nImages.objectAtIndex(index);
                        }
                        resolve(images);
                    },
                    reject,
                    null
                )
            );
        } catch (error) {
            reject(error);
        }
    });
}
export async function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): Promise<[number, number][][]> {
    return new Promise((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.getJSONDocumentCornersShrunkImageHeightImageRotationDelegate(
                editingImage.ios,
                resizeThreshold,
                imageRotation,
                OCRDelegateDelegateImpl.initWithResolveReject(resolve, reject, null)
            );
        } catch (error) {
            reject(error);
        }
    });
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
