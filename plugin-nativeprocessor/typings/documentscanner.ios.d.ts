declare class OpencvDocumentProcessDelegate extends NSObject {
    static alloc(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static cropDocumentFromFileQuadsDelegate(src: string, quads: string, delegate: OCRDelegate): void;

    static cropDocumentFromFileQuadsDelegateOptions(src: string, quads: string, delegate: OCRDelegate, optionsStr: string): void;

    static cropDocumentQuadsDelegate(image: UIImage, quads: string, delegate: OCRDelegate): void;

    static cropDocumentQuadsDelegateTransforms(image: UIImage, quads: string, delegate: OCRDelegate, transforms: string): void;

    static cropDocumentSyncQuadsDelegateTransforms(image: UIImage, quads: string, delegate: OCRDelegate, transforms: string): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileName(image: UIImage, quads: string, delegate: OCRDelegate, transforms: string, saveInFolder: string, fileName: string): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileNameCompressFormat(
        image: UIImage,
        quads: string,
        delegate: OCRDelegate,
        transforms: string,
        saveInFolder: string,
        fileName: string,
        compressFormat: string
    ): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileNameCompressFormatCompressQuality(
        image: UIImage,
        quads: string,
        delegate: OCRDelegate,
        transforms: string,
        saveInFolder: string,
        fileName: string,
        compressFormat: string,
        compressQuality: number
    ): void;

    static findDocumentCornersShrunkImageHeightImageRotation(image: UIImage, shrunkImageHeight: number, imageRotation: number): NSArray<any>;

    static getJSONDocumentCornersFromFileShrunkImageHeightImageRotationDelegate(src: string, shrunkImageHeight: number, imageRotation: number, delegate: OCRDelegate): void;

    static getJSONDocumentCornersFromFileShrunkImageHeightImageRotationDelegateOptions(src: string, shrunkImageHeight: number, imageRotation: number, delegate: OCRDelegate, options: string): void;
    static getJSONDocumentCornersFromFileDelegateOptions(src: string, delegate: OCRDelegate, options: string): void;

    static getJSONDocumentCornersShrunkImageHeightImageRotationDelegate(image: UIImage, shrunkImageHeight: number, imageRotation: number, delegate: OCRDelegate): void;

    static getJSONDocumentCornersSyncShrunkImageHeightImageRotationDelegate(image: UIImage, shrunkImageHeight: number, imageRotation: number, delegate: OCRDelegate): void;

    static new(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static ocrDocumentFromFileOptionsDelegate(src: string, options: string, delegate: OCRDelegate): void;

    static ocrDocumentOptionsDelegate(image: UIImage, options: string, delegate: OCRDelegate): void;

    static ocrDocumentSyncOptionsDelegate(image: UIImage, options: string, delegate: OCRDelegate): void;

    autoScanHandler: NSObject;

    previewResizeThreshold: number;

    constructor(o: { cropView: any });

    initWithCropView(view: any): this;

    setAutoScanHandler(value: NSObject): void;
}
