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

    image: UIImage;

    imageSize: CGSize;

    quads: NSArray<any>;

    strokeWidth: number;
}

declare class OCRDelegate extends NSObject {
    static alloc(): OCRDelegate; // inherited from NSObject

    static new(): OCRDelegate; // inherited from NSObject

    onCompleteError(result: string, error: NSError): void;

    onProgress(progress: number): void;
}

declare class OpencvDocumentProcessDelegate extends NSObject {
    static alloc(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static cropDocumentQuads(image: UIImage, quads: string): NSArray<any>;

    static cropDocumentQuadsTransforms(image: UIImage, quads: string, transforms: string): NSArray<any>;

    static findDocumentCornersShrunkImageHeightImageRotation(image: UIImage, shrunkImageHeight: number, imageRotation: number): NSArray<any>;

    static getJSONDocumentCornersShrunkImageHeightImageRotation(image: UIImage, shrunkImageHeight: number, imageRotation: number): string;

    static new(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static ocrDocumentOptionsDelegate(image: UIImage, options: string, delegate: OCRDelegate): void;

    cropView: NSCropView;

    previewResizeThreshold: number;

    constructor(o: { cropView: NSCropView });

    initWithCropView(view: NSCropView): this;
}
