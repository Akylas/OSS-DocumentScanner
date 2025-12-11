import BaseWorkerHandler from '@akylas/nativescript-app-utils/worker/BaseWorkerHandler';
import { showError } from '@shared/utils/showError';
import { CustomError } from '@shared/utils/error';
import type BackupWorker from '~/workers/BackupWorker';
import { pickFolder } from '@nativescript-community/ui-document-picker';
import { documentsService } from './documents';

export class BackupWorkerService extends BaseWorkerHandler<BackupWorker> {
    onWorkerEvent(eventData: any) {
        DEV_LOG && console.log('onWorkerEvent', eventData);
    }
    private static instance: BackupWorkerService;

    constructor() {
        super(() => new Worker('~/workers/BackupWorker'));
    }

    static getInstance(): BackupWorkerService {
        if (!BackupWorkerService.instance) {
            BackupWorkerService.instance = new BackupWorkerService();
        }
        return BackupWorkerService.instance;
    }

    handleError(error: any) {
        showError(error);
    }

    handleWorkerError(error: any) {
        showError(CustomError.fromObject({ ...error, sentryReportTranslatedName: true }));
    }

    async createBackup(): Promise<string> {
        const folders = await pickFolder({
            multipleSelection: false,
            permissions: { write: true, persistable: true, read: true },
            forceSAF: true
        });
        if (folders.folders?.[0]) {
            const result = await this.sendMessageToWorker('createBackup', { zipPath: folders.folders?.[0] }, Date.now(), undefined, false, 0, { db: documentsService.db.db.db });
            return result.path;
        }
    }

    async restoreBackup(zipPath: string): Promise<void> {
        await this.sendMessageToWorker('restoreBackup', { zipPath }, Date.now(), undefined, false, 0, { db: documentsService.db.db.db });
    }
}

export const backupWorkerService = BackupWorkerService.getInstance();
