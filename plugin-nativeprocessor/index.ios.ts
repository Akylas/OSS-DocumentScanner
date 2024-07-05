import { Color, ImageSource } from '@nativescript/core';
import { CornersOptions, CropOptions, DetectOptions, DetectQRCodeOptions, GenerateColorOptions, GenerateQRCodeOptions, LoadImageOptions, OCRData, PDFImportOptions, QRCodeData, Quads } from '.';
import { CropView } from './CropView';

@NativeClass
class CompletionDelegateImpl extends NSObject implements CompletionDelegate {
    static ObjCProtocols = [CompletionDelegate];
    resolve;
    reject;
    progress;
    shouldParse;
    onCompleteError(result: any, error): void {
        if (error) {
            this.reject(error);
        } else {
            if (this.shouldParse && typeof result === 'string') {
                this.resolve(result ? JSON.parse(result) : null);
            } else {
                this.resolve(result);
            }
        }
    }
    onProgress(progress: number): void {
        this.progress?.(progress);
    }

    static initWithResolveReject(resolve, reject, progress?, shouldParse = true) {
        const delegate = CompletionDelegateImpl.new() as CompletionDelegateImpl;
        delegate.resolve = resolve;
        delegate.reject = reject;
        delegate.onProgress = progress;
        delegate.shouldParse = shouldParse;
        return delegate;
    }
}

export async function cropDocument(editingImage: ImageSource, quads, transforms = '') {
    return new Promise<any[]>((resolve, reject) => {
        try {
            // nImages is a NSArray
            OpencvDocumentProcessDelegate.cropDocumentQuadsDelegateTransforms(
                editingImage.ios,
                JSON.stringify(quads),
                CompletionDelegateImpl.initWithResolveReject((nImages) => {
                    const images = [];
                    for (let index = 0; index < nImages.count; index++) {
                        images[index] = nImages.objectAtIndex(index);
                    }
                    resolve(images);
                }, reject),
                transforms
            );
        } catch (error) {
            reject(error);
        }
    });
}
export async function cropDocumentFromFile(src: string, quads, options: CropOptions = {}) {
    return new Promise<any[]>((resolve, reject) => {
        try {
            // nImages is a NSArray
            DEV_LOG && console.log('cropDocumentFromFile', src, quads, options);
            OpencvDocumentProcessDelegate.cropDocumentFromFileQuadsDelegateOptions(src, JSON.stringify(quads), CompletionDelegateImpl.initWithResolveReject(resolve, reject), JSON.stringify(options));
        } catch (error) {
            reject(error);
        }
    });
}
export async function getJSONDocumentCorners(editingImage: ImageSource, resizeThreshold = 300, imageRotation = 0): Promise<Quads> {
    return new Promise((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.getJSONDocumentCornersShrunkImageHeightImageRotationDelegate(
                editingImage.ios,
                resizeThreshold,
                imageRotation,
                CompletionDelegateImpl.initWithResolveReject(resolve, reject)
            );
        } catch (error) {
            reject(error);
        }
    });
}
export async function getJSONDocumentCornersFromFile(src: string, options: CornersOptions = {}): Promise<Quads> {
    return new Promise((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.getJSONDocumentCornersFromFileDelegateOptions(src, CompletionDelegateImpl.initWithResolveReject(resolve, reject), JSON.stringify(options));
        } catch (error) {
            reject(error);
        }
    });
}
export async function processFromFile(src: string, processes: any[], options: LoadImageOptions = {}): Promise<any[]> {
    return new Promise((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.processFromFileProcessesOptionsDelegate(
                src,
                JSON.stringify(processes),
                JSON.stringify(options),
                CompletionDelegateImpl.initWithResolveReject(resolve, reject)
            );
        } catch (error) {
            reject(error);
        }
    });
}
export async function getColorPalette(
    editingImage: ImageSource,
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 20, colorPalette: 5 }
): Promise<Quads> {
    throw new Error('not implemented');
    // return new Promise((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPalette(
    //         editingImage['android'] || editingImage,
    //         new com.akylas.documentscanner.utils.FunctionCallback({
    //             onResult(e, result) {
    //                 if (e) {
    //                     reject(e);
    //                 } else {
    //                     resolve(result ? JSON.parse(result) : []);
    //                 }
    //             }
    //         }),
    //         options.resizeThreshold,
    //         options.colorsFilterDistanceThreshold,
    //         options.colorPalette
    //     );
    // });
}
export async function getColorPaletteFromFile(
    src: string,
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 20, colorPalette: 5 },
    strOptions?: string
): Promise<Quads> {
    throw new Error('not implemented');
    // return new Promise((resolve, reject) => {
    // com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPaletteFromFile(
    //     Utils.android.getApplicationContext(),
    //     src,
    //     new com.akylas.documentscanner.utils.FunctionCallback({
    //         onResult(e, result) {
    //             if (e) {
    //                 reject(e);
    //             } else {
    //                 resolve(result ? JSON.parse(result) : []);
    //             }
    //         }
    //     }),
    //     options.resizeThreshold,
    //     options.colorsFilterDistanceThreshold,
    //     options.colorPalette,
    //     strOptions
    // );
    // });
}

export async function ocrDocument(editingImage: ImageSource | UIImage, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.ocrDocumentOptionsDelegate(
                editingImage['ios'] || editingImage,
                options ? JSON.stringify(options) : '',
                CompletionDelegateImpl.initWithResolveReject(resolve, reject, onProgress)
            );
        } catch (error) {
            reject(error);
        }
    });
}
export async function ocrDocumentFromFile(src: string, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.ocrDocumentFromFileOptionsDelegate(src, options ? JSON.stringify(options) : '', CompletionDelegateImpl.initWithResolveReject(resolve, reject, onProgress));
        } catch (error) {
            reject(error);
        }
    });
}

export async function detectQRCode(editingImage: ImageSource | UIImage, options?: Partial<DetectQRCodeOptions>) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.detectQRCodeOptionsDelegate(
                editingImage['ios'] || editingImage,
                options ? JSON.stringify(options) : '',
                CompletionDelegateImpl.initWithResolveReject(resolve, reject)
            );
        } catch (error) {
            reject(error);
        }
    });
}

export async function detectQRCodeFromFile(src: string, options?: Partial<DetectQRCodeOptions>) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.detectQRCodeFromFileOptionsDelegate(src, options ? JSON.stringify(options) : '', CompletionDelegateImpl.initWithResolveReject(resolve, reject));
        } catch (error) {
            reject(error);
        }
    });
}

export async function generateQRCodeImage(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
    return new Promise<ImageSource>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.generateQRCodeFormatWidthHeightOptionsDelegate(
                text,
                format,
                width,
                height,
                options ? JSON.stringify(options) : '',
                CompletionDelegateImpl.initWithResolveReject((image) => {
                    resolve(new ImageSource(image));
                }, reject)
            );
        } catch (error) {
            reject(error);
        }
    });
}

export async function generateQRCodeSVG(text: string, format: string, hintSize: number, options?: Partial<GenerateQRCodeOptions>) {
    return new Promise<string>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.generateQRCodeSVGFormatSizeHintOptionsDelegate(
                text,
                format,
                hintSize,
                options ? JSON.stringify(options) : '',
                CompletionDelegateImpl.initWithResolveReject(resolve, reject, undefined, false)
            );
        } catch (error) {
            reject(error);
        }
    });
}

@NativeClass
export class OnQRCodeImpl extends NSObject implements OnQRCode {
    static ObjCProtocols = [OnQRCode];
    callback;

    static initWithCallback(callback) {
        const delegate = OnAutoScanImpl.new() as OnAutoScanImpl;
        delegate.callback = callback;
        return delegate;
    }
    onQRCodes(data: string): void {
        this.callback(data);
    }
}

@NativeClass
class OnAutoScanImpl extends NSObject implements OnAutoScan {
    static ObjCProtocols = [OnAutoScan];
    callback;
    onAutoScan(corners: string): void {
        this.callback(corners);
    }

    static initWithCallback(callback) {
        const delegate = OnAutoScanImpl.new() as OnAutoScanImpl;
        delegate.callback = callback;
        return delegate;
    }
}
export function createAutoScanHandler(cropView: CropView, block: (result) => void) {
    return AutoScanHandler.alloc().initWithCropViewOnAutoScan(cropView.nativeViewProtected, OnAutoScanImpl.initWithCallback(block));
}

export function createQRCodeCallback(onQRCodes): any {
    return onQRCodes ? OnQRCodeImpl.initWithCallback(onQRCodes) : null;
}

export async function importPdfToTempImages(pdfPath: string, options?: Partial<PDFImportOptions>) {
    return new Promise<string[]>((resolve, reject) => {
        PDFUtils.importPdfToTempImagesDelegateOptions(pdfPath, CompletionDelegateImpl.initWithResolveReject(resolve, reject), options ? JSON.stringify(options) : '');
    });
}

export async function getImageSize(imagePath: string) {
    const size = ImageUtils.getImageSize(imagePath);
    return { width: size.objectForKey('width'), height: size.objectForKey('height'), rotation: size.objectForKey('rotation') };
}
