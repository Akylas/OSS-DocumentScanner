declare namespace com {
    export namespace tns {
        export class NativeScriptException {
            static getStackTraceAsString(ex): String;
        }
    }
    export namespace akylas {
        export namespace documentscanner {
            export class WorkersContext {
                public static getValue(key): any;
                public static setValue(key: string, value);
            }
            export namespace Utils {
                export class Companion {
                    static prepareActivity(arg0: androidx.appcompat.app.AppCompatActivity);
                    static prepareWindow(arg0: android.view.Window);
                    static applyDayNight(context: android.content.Context, applyDynamicColors: boolean);
                    static applyDynamicColors(context: android.content.Context);
                    static getDimensionFromInt(context: android.content.Context, intToGet);
                    static getColorFromInt(context: android.content.Context, intToGet);
                    static getColorFromName(context: android.content.Context, intToGet);
                    static restartApp(context: android.content.Context, activity: android.app.Activity);
                    static getSystemLocale(): java.util.Locale;
                }
            }
            export namespace PDFUtils {
                export class FunctionCallback extends java.lang.Object {
                    public static class: java.lang.Class<FunctionCallback>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$FunctionCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onResult(param0: java.lang.Exception, param1: any): void });
                    public constructor();
                    public onResult(param0: java.lang.Exception, param1: any): void;
                }
                export class Companion {
                    static compressPDF(src: string, dst: string, jpegQuality: number);
                    static generatePDF(context: android.content.Context, destFolder: string, fileName: string, options: string);
                    static generatePDFASync(context: android.content.Context, destFolder: string, fileName: string, options: string, callback: FunctionCallback);
                }
            }
        }
    }
}
