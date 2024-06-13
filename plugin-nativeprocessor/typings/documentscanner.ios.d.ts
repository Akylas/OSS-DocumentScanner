declare class OpencvDocumentProcessDelegate extends NSObject {
    static generateQRCodeFormatWidthHeightOptionsDelegate(text: string, format: string, width: number, height: number, arg4: string, arg5: CompletionDelegate);
    static generateQRCodeSVGFormatSizeHintOptionsDelegate(text: string, format: string, hintSize: number, arg3: string, arg4: CompletionDelegate);
    static processFromFileProcessesOptionsDelegate(src: string, arg1: string, arg2: string, arg3: CompletionDelegate);
    static alloc(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static cropDocumentFromFileQuadsDelegate(src: string, quads: string, delegate: CompletionDelegate): void;

    static cropDocumentFromFileQuadsDelegateOptions(src: string, quads: string, delegate: CompletionDelegate, optionsStr: string): void;

    static cropDocumentQuadsDelegate(image: UIImage, quads: string, delegate: CompletionDelegate): void;

    static cropDocumentQuadsDelegateTransforms(image: UIImage, quads: string, delegate: CompletionDelegate, transforms: string): void;

    static cropDocumentSyncQuadsDelegateTransforms(image: UIImage, quads: string, delegate: CompletionDelegate, transforms: string): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileName(image: UIImage, quads: string, delegate: CompletionDelegate, transforms: string, saveInFolder: string, fileName: string): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileNameCompressFormat(
        image: UIImage,
        quads: string,
        delegate: CompletionDelegate,
        transforms: string,
        saveInFolder: string,
        fileName: string,
        compressFormat: string
    ): void;

    static cropDocumentSyncQuadsDelegateTransformsSaveInFolderFileNameCompressFormatCompressQuality(
        image: UIImage,
        quads: string,
        delegate: CompletionDelegate,
        transforms: string,
        saveInFolder: string,
        fileName: string,
        compressFormat: string,
        compressQuality: number
    ): void;

    static findDocumentCornersShrunkImageHeightImageRotation(image: UIImage, shrunkImageHeight: number, imageRotation: number): NSArray<any>;

    static getJSONDocumentCornersFromFileShrunkImageHeightImageRotationDelegate(src: string, shrunkImageHeight: number, imageRotation: number, delegate: CompletionDelegate): void;

    static getJSONDocumentCornersFromFileShrunkImageHeightImageRotationDelegateOptions(
        src: string,
        shrunkImageHeight: number,
        imageRotation: number,
        delegate: CompletionDelegate,
        options: string
    ): void;
    static getJSONDocumentCornersFromFileDelegateOptions(src: string, delegate: CompletionDelegate, options: string): void;

    static getJSONDocumentCornersShrunkImageHeightImageRotationDelegate(image: UIImage, shrunkImageHeight: number, imageRotation: number, delegate: CompletionDelegate): void;

    static getJSONDocumentCornersSyncShrunkImageHeightImageRotationDelegate(image: UIImage, shrunkImageHeight: number, imageRotation: number, delegate: CompletionDelegate): void;

    static new(): OpencvDocumentProcessDelegate; // inherited from NSObject

    static ocrDocumentFromFileOptionsDelegate(src: string, options: string, delegate: CompletionDelegate): void;
    static detectQRCodeFromFileOptionsDelegate(src: string, options: string, delegate: CompletionDelegate): void;

    static ocrDocumentOptionsDelegate(image: UIImage, options: string, delegate: CompletionDelegate): void;
    static detectQRCodeOptionsDelegate(image: UIImage, options: string, delegate: CompletionDelegate): void;

    static ocrDocumentSyncOptionsDelegate(image: UIImage, options: string, delegate: CompletionDelegate): void;

    autoScanHandler: NSObject;

    previewResizeThreshold: number;

    detectQRCode: boolean;
    detectDocuments: boolean;

    constructor(o: { cropView: any });

    initWithCropView(view: any): this;
    initWithCropViewOnQRCode(view: any, onQRCode: any): this;

    setAutoScanHandler(value: NSObject): void;
}
