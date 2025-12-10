import { ApplicationSettings } from '@nativescript/core';
import { BaseBackupService } from './backup.common';

export class BackupService extends BaseBackupService {
    private static instance: BackupService;

    static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }

    protected restoreSettings(settings: any): void {
        const nativePref = ApplicationSettings.getNative() as android.content.SharedPreferences;
        const editor = nativePref.edit();
        editor.clear();
        
        Object.keys(settings).forEach((k) => {
            if (k.startsWith('_')) {
                return;
            }
            const value = settings[k];
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

export const backupService = BackupService.getInstance();
