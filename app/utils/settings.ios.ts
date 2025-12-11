import { ApplicationSettings, File } from '@nativescript/core';

export async function restoreSettings(filePath: string) {
    if (filePath && File.exists(filePath)) {
        const text = await File.fromPath(filePath).readText();
        DEV_LOG && console.log('import_settings', text);
        const json = JSON.parse(text);
        const nativePref = ApplicationSettings.getNative();
        const userDefaults = nativePref as NSUserDefaults;
        const domain = NSBundle.mainBundle.bundleIdentifier;
        userDefaults.removePersistentDomainForName(domain);
        Object.keys(json).forEach((k) => {
            if (k.startsWith('_')) {
                return;
            }
            const value = json[k];
            const type = typeof value;
            switch (type) {
                case 'boolean':
                    userDefaults.setBoolForKey(value, k);
                    break;
                case 'number':
                    userDefaults.setDoubleForKey(value, k);
                    break;
                case 'string':
                    userDefaults.setObjectForKey(value, k);
                    break;
            }
        });
    }
}
