import { ApplicationSettings, File } from '@nativescript/core';

export async function restoreSettings(filePath: string) {
    if (filePath && File.exists(filePath)) {
        const text = await File.fromPath(filePath).readText();
        DEV_LOG && console.log('import_settings', text);
        const json = JSON.parse(text);
        const nativePref = ApplicationSettings.getNative();
        const editor = (nativePref as android.content.SharedPreferences).edit();
        editor.clear();
        Object.keys(json).forEach((k) => {
            if (k.startsWith('_')) {
                return;
            }
            const value = json[k];
            const type = typeof value;
            switch (type) {
                case 'boolean':
                    editor.putBoolean(k, value);
                    break;
                case 'number':
                    editor.putLong(k, java.lang.Double.doubleToRawLongBits(double(value)));
                    break;
                case 'string':
                    editor.putString(k, value);
                    break;
            }
        });
        editor.apply();
    }
}
