declare class NSCropView extends UIView {
    static alloc(): NSCropView; // inherited from NSObject

    static appearance(): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | (typeof NSObject)[]): NSCropView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): NSCropView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | (typeof NSObject)[]): NSCropView; // inherited from UIAppearance

    static new(): NSCropView; // inherited from NSObject

    colors: NSArray<UIColor>;

    drawFill: boolean;

    fillAlpha: number;

    imageSize: CGSize;

    quads: NSArray<NSArray<NSValue>>;

    strokeWidth: number;

    replaceProgressHashWithOldHashNewHash(oldHash: number, newHash: number): void;

    updateProgressWithHashProgress(hash: number, progress: number): void;
}
interface OCRDelegate {
    onCompleteError(result: NSObject, error: NSError): void;

    onProgress(progress: number): void;
}
declare const OCRDelegate: {
    prototype: OCRDelegate;
};

declare class OpencvDocumentProcessDelegate extends NSObject {
    static alloc(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static cropDocumentQuadsDelegate(image: UIImage, quads: string, delegate: OCRDelegate): void;

    static cropDocumentQuadsTransformsDelegate(image: UIImage, quads: string, transforms: string, delegate: OCRDelegate): void;

    static findDocumentCornersShrunkImageHeightImageRotation(image: UIImage, shrunkImageHeight: number, imageRotation: number): NSArray<any>;

    static getJSONDocumentCornersShrunkImageHeightImageRotationDelegate(image: UIImage, shrunkImageHeight: number, imageRotation: number, delegate: OCRDelegate): void;

    static new(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static ocrDocumentOptionsDelegate(image: UIImage, options: string, delegate: OCRDelegate): void;

    autoScanHandler: NSObject;

    previewResizeThreshold: number;

    constructor(o: { cropView: any });

    initWithCropView(view: any): this;

    setAutoScanHandler(value: NSObject): void;
}

declare class AutoScanHandler extends NSObject {
    static alloc(): AutoScanHandler; // inherited from NSObject

    static getHashWithPoints(points: NSArray<NSValue> | NSValue[]): number;

    static new(): AutoScanHandler; // inherited from NSObject

    cropView: NSCropView;

    onAutoScan: OnAutoScan;

    constructor(o: { cropView: NSCropView; onAutoScan: OnAutoScan });

    clearAll(): void;

    initWithCropViewOnAutoScan(cropView: NSCropView, onAutoScan: OnAutoScan): this;

    processWithPoints(points: NSArray<NSArray<NSValue>> | NSArray<NSValue>[]): void;

    replaceHashWithOldValueNewValue(oldValue: number, newValue: number): void;

    startAutoScanJobWithPoints(points: NSArray<NSValue> | NSValue[]): void;

    startAutoScanPreJobWithPoints(points: NSArray<NSValue> | NSValue[]): void;
}
interface OnAutoScan {
    onAutoScan(corners: string): void;
}
declare const OnAutoScan: {
    prototype: OnAutoScan;
};
