declare class NSCropView extends UIView {
    static alloc(): NSCropView; // inherited from NSObject

    static appearance(): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollection(trait: UITraitCollection): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject): NSCropView; // inherited from UIAppearance

    static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | (typeof NSObject)[]): NSCropView; // inherited from UIAppearance

    static appearanceWhenContainedIn(ContainerClass: typeof NSObject): NSCropView; // inherited from UIAppearance

    static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | (typeof NSObject)[]): NSCropView; // inherited from UIAppearance

    static new(): NSCropView; // inherited from NSObject

    colors: NSArray<any>;

    fillAlpha: number;

    image: UIImage;

    imageSize: CGSize;

    quads: NSArray<any>;

    strokeWidth: number;
}

interface OCRDelegate {
    onCompleteError(result: NSObject, error: NSError): void;

    onProgress(progress: number): void;
}
declare let OCRDelegate: {
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

    cropView: NSCropView;

    previewResizeThreshold: number;

    constructor(o: { cropView: NSCropView });

    initWithCropView(view: NSCropView): this;
}
