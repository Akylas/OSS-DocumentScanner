import { Color, ImageSource } from '@nativescript/core';
import { CornersOptions, CropOptions, DetectOptions, DetectQRCodeOptions, GenerateColorOptions, GenerateQRCodeOptions, LoadImageOptions, OCRData, PDFImportOptions, QRCodeData, Quads } from '.';
import { CropView } from './CropView';

@NativeClass
class CompletionDelegateImpl extends NSObject implements CompletionDelegate {
    static ObjCProtocols = [CompletionDelegate];
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

    static initWithResolveReject(resolve, reject, progress?) {
        const delegate = CompletionDelegateImpl.new() as CompletionDelegateImpl;
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
    throw new Error('not implemented');
    // return new Promise((resolve, reject) => {
    // com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.processFromFile(
    //     Utils.android.getApplicationContext(),
    //     src,
    //     JSON.stringify(processes),
    //     new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
    //         onResult(e, result) {
    //             if (e) {
    //                 reject(e);
    //             } else {
    //                 resolve(result ? JSON.parse(result) : []);
    //             }
    //         }
    //     }),
    //     options ? JSON.stringify(options) : null
    // );
    // });
}
export async function getColorPalette(editingImage: ImageSource, options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 0, colorPalette: 0 }): Promise<Quads> {
    throw new Error('not implemented');
    // return new Promise((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPalette(
    //         editingImage['android'] || editingImage,
    //         new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
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
    options: Partial<GenerateColorOptions> = { resizeThreshold: 100, colorsFilterDistanceThreshold: 0, colorPalette: 0 },
    strOptions?: string
): Promise<Quads> {
    throw new Error('not implemented');
    // return new Promise((resolve, reject) => {
    // com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getColorPaletteFromFile(
    //     Utils.android.getApplicationContext(),
    //     src,
    //     new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
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

export async function ocrDocument(editingImage: ImageSource, options?: Partial<DetectOptions>, onProgress?: (progress: number) => void) {
    return new Promise<OCRData>((resolve, reject) => {
        try {
            OpencvDocumentProcessDelegate.ocrDocumentOptionsDelegate(
                editingImage.ios,
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

export async function detectQRCode(editingImage: ImageSource | android.graphics.Bitmap, options?: Partial<DetectQRCodeOptions>) {
    throw new Error('not implemented');
    // return new Promise<QRCodeData>((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCode(
    //         editingImage['android'] || editingImage,
    //         new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
    //             onResult(e, result) {
    //                 if (e) {
    //                     reject(e);
    //                 } else {
    //                     resolve(result ? JSON.parse(result) : null);
    //                 }
    //             }
    //         }),
    //         options ? JSON.stringify(options) : ''
    //     );
    // });
}

export async function detectQRCodeFromFile(src: string, options?: Partial<DetectQRCodeOptions>) {
    throw new Error('not implemented');
    // return new Promise<QRCodeData>((resolve, reject) => {
    //     com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.readQRCodeFromFile(
    //         Utils.android.getApplicationContext(),
    //         src,
    //         new com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback({
    //             onResult(e, result) {
    //                 if (e) {
    //                     reject(e);
    //                 } else {
    //                     resolve(result ? JSON.parse(result) : null);
    //                 }
    //             }
    //         }),
    //         options ? JSON.stringify(options) : ''
    //     );
    // });
}

export async function generateQRCodeImage(text: string, format: string, width: number, height: number, options?: Partial<GenerateQRCodeOptions>) {
    const data = NSString.stringWithString(text).dataUsingEncoding(NSISOLatin1StringEncoding);
    let generatorKey;
    switch (format) {
        case 'qrcode':
            generatorKey = 'CIQRCodeGenerator';
            break;
        case 'pdf417':
            generatorKey = 'CIPDF417BarcodeGenerator';
            break;
        case 'aztec':
            generatorKey = 'CIAztecCodeGenerator';
            break;
        case 'upce':
        case 'code39':
        case 'code39mod43':
        case 'code93':
        case 'ean13':
        case 'ean8':
        case 'upca':
        case 'code128':
            generatorKey = 'CICode128BarcodeGenerator';
            break;
    }
    if (generatorKey) {
        const filter = CIFilter.filterWithName(generatorKey);
        if (filter) {
            filter.setValueForKey(data, 'inputMessage');
            // filter.setValueForKey('H', 'inputCorrectionLevel');

            let output = filter.outputImage;
            if (output) {
                if (options?.frontColor || options?.backColor) {
                    //change qrcode color : #1e3259
                    const filterFalseColor = CIFilter.filterWithName('CIFalseColor');
                    filterFalseColor.setDefaults();
                    filterFalseColor.setValueForKey(output, 'inputImage');
                    // convert method
                    if (options?.frontColor) {
                        const color = options.frontColor instanceof Color ? options.frontColor : new Color(options.frontColor);
                        filterFalseColor.setValueForKey(CIColor.colorWithCGColor(color.ios.CGColor), 'inputColor0');
                    } else {
                        filterFalseColor.setValueForKey(CIColor.colorWithString('black'), 'inputColor0');
                    }
                    if (options?.backColor) {
                        const color = options.backColor instanceof Color ? options.backColor : new Color(options.backColor);
                        filterFalseColor.setValueForKey(CIColor.colorWithCGColor(color.ios.CGColor), 'inputColor1');
                    } else {
                        filterFalseColor.setValueForKey(CIColor.colorWithString('white'), 'inputColor1');
                    }
                    output = filterFalseColor.outputImage;
                }
                const scaleX = width / output.extent.size.width;
                const scaleY = height / output.extent.size.height;

                output = output.imageByApplyingTransform(CGAffineTransformMakeScale(scaleX, scaleY));

                const context = CIContext.context();
                if (context) {
                    // if we create the UIImage directly from the CIImage then it wont be drawn correctly in UIImageView
                    // the contentMode won't be respected, and it won't even draw with SDAnimatedImageView
                    const CGImage = context.createCGImageFromRect(output, output.extent);
                    return new ImageSource(UIImage.imageWithCGImageScaleOrientation(CGImage, UIScreen.mainScreen.scale, UIImageOrientation.Up));
                }
            }
        }
    }
    return null;
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

export async function importPdfToTempImages(pdfPath: string, options?: Partial<PDFImportOptions>) {
    return new Promise<string[]>((resolve, reject) => {
        PDFUtils.importPdfToTempImagesDelegateOptions(pdfPath, CompletionDelegateImpl.initWithResolveReject(resolve, reject), options ? JSON.stringify(options) : '');
    });
}
