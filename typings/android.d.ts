declare namespace com {
    export namespace tns {
        export class NativeScriptException {
            static getStackTraceAsString(ex): String;
        }
    }
    export namespace akylas {
        export namespace documentscanner {
            export namespace WorkersContext {
                export class Companion {
                    public static getValue(key): any;
                    public static setValue(key: string, value);
                }
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
        }
    }
}
