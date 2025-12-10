import BaseWorkerHandler from '@akylas/nativescript-app-utils/worker/BaseWorkerHandler';
import { showError } from '@shared/utils/showError';
import { CustomError } from '@shared/utils/error';
import type BackupWorker from '~/workers/BackupWorker';

export class BackupWorkerService extends BaseWorkerHandler<BackupWorker> {
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
        const result = await this.sendMessageToWorker({
            type: 'createBackup'
        });
        return result.path;
    }

    async restoreBackup(zipPath: string): Promise<void> {
        await this.sendMessageToWorker({
            type: 'restoreBackup',
            messageData: { zipPath }
        });
    }
}

export const backupWorkerService = BackupWorkerService.getInstance();
