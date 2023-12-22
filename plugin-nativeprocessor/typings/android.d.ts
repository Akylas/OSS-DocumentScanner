declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class CropView extends android.view.View {}
            export class NightModeApplication extends android.app.Application {}
            export class WorkersContext {
                public static getValue(key): any;
                public static setValue(key: string, value);
            }
            export class Utils {
                static applyDayNight(context: android.content.Context);
                static getDimensionFromInt(context: android.content.Context, intToGet);
                static getColorFromInt(context: android.content.Context, intToGet);
                static getColorFromName(context: android.content.Context, intToGet);
                static restartApp(context: android.content.Context, activity: android.app.Activity);
            }
            export class PDFUtils {
                static compressPDF(src: string, dst: string, jpegQuality: number);
            }
            export class CustomImageAnalysisCallback {
                constructor(context: android.content.Context, cropView);
            }
            export namespace CustomImageAnalysisCallback {
                export class Companion {
                    public static getJSONDocumentCorners(...args): void;
                    public static cropDocument(...args): void;
                    public static ocrDocument(...args): void;
                    public static readQRCode(...args): void;
                    public static generateQRCode(...args): void;
                    public static generateQRCodeSync(...args): void;
                    public static getColorPalette(...args): void;
                    public static getJSONDocumentCornersAndImage(...args): void;
                }

                export class FunctionCallback {
                    onResult(e, result);
                    constructor(args: { onResult: (e, result) => void });
                }
                export class FunctionCallbackProgress {
                    onProgress(p);
                    constructor(args: { onProgress: (p) => void });
                }
            }
        }
    }
}
