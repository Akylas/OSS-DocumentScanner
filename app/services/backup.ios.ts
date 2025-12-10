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
        const userDefaults = ApplicationSettings.getNative() as NSUserDefaults;
        const domain = NSBundle.mainBundle.bundleIdentifier;
        userDefaults.removePersistentDomainForName(domain);
        
        Object.keys(settings).forEach((k) => {
            if (k.startsWith('_')) {
                return;
            }
            const value = settings[k];
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

export const backupService = BackupService.getInstance();
