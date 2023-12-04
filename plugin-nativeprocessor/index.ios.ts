import { Color, ImageSource } from '@nativescript/core';
import { DetectOptions, GenerateQRCodeOptions, OCRData } from '.';

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
