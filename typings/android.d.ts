declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class WorkersContext {
                public static getValue(key): any;
                public static setValue(key: string, value);
            }
            export class Utils {
                static applyDayNight(context: android.content.Context, applyDynamicColors: boolean);
                static applyDynamicColors(context: android.content.Context);
                static getDimensionFromInt(context: android.content.Context, intToGet);
                static getColorFromInt(context: android.content.Context, intToGet);
                static getColorFromName(context: android.content.Context, intToGet);
                static restartApp(context: android.content.Context, activity: android.app.Activity);
                static getSystemLocale(): java.util.Locale;
            }
            export class PDFUtils {
                static compressPDF(src: string, dst: string, jpegQuality: number);
            }
        }
    }
}
