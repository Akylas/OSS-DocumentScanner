declare class OCRDelegate extends NSObject {
    onCompleteError(result: string, error): void;
    onProgress(progress: number): void;
}
declare class OpencvDocumentProcessDelegate extends NSObject {
    initWithCropView(cropView): this;
    public static getJSONDocumentCornersShrunkImageHeightImageRotation(...args): string;
    public static cropDocumentQuadsTransforms(...args): NSArray;
    public static cropDocumentQuads(...args): NSArray;
    public static ocrDocumentOptionsDelegate(...args);
}

declare class NSCropView extends UIView {}
