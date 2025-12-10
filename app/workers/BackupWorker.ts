import '@nativescript/core/globals';
import { BaseWorker, WorkerEvent } from '@akylas/nativescript-app-utils/worker/BaseWorker';
import { getDocumentsService, setDocumentsService } from '~/models/OCRDocument';
import { DocumentsService } from '~/services/documents';
import { BackupService } from '~/services/backup';

const context: Worker = self as any;

const TAG = '[BackupWorker]';
DEV_LOG && console.log(TAG, 'main');

let documentsService: DocumentsService;
let backupService: BackupService;

export default class BackupWorker extends BaseWorker {
    constructor(protected context) {
        DEV_LOG && console.log(TAG, 'constructor');
        super(context);
    }

    async handleStart(event: WorkerEvent) {
        if (!documentsService) {
            documentsService = new DocumentsService();
            DEV_LOG && console.warn(TAG, 'handleStart', documentsService.id, event.data.nativeData.db);
            documentsService.notify = (e) => {
                if (e.eventName === 'started') {
                    return;
                }
                const { object, ...other } = e;
                this.notify({ ...other, target: 'documentsService', object: object === this ? undefined : object });
            };
            setDocumentsService(documentsService);
            await documentsService.start(event.data.nativeData.db);
        }
        
        if (!backupService) {
            backupService = BackupService.getInstance();
        }
    }

    async receivedMessage(event: WorkerEvent) {
        const data = event.data;
        DEV_LOG && console.log(TAG, 'receivedMessage', data.type);
        
        try {
            switch (data.type) {
                case 'createBackup':
                    await this.handleStart(event);
                    const backupPath = await backupService.createBackup();
                    this.sendResult(data.id, { success: true, path: backupPath });
                    break;
                case 'restoreBackup':
                    await this.handleStart(event);
                    await backupService.restoreBackup(data.messageData.zipPath);
                    this.sendResult(data.id, { success: true });
                    break;
                case 'stop':
                    this.stop(data.messageData?.error, data.id);
                    break;
            }
        } catch (error) {
            console.error(TAG, 'Error in receivedMessage', error);
            this.sendError(error, data.id);
        }
    }
}

const worker = new BackupWorker(context);
