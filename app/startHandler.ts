import { CustomError } from '@akylas/nativescript-app-utils/error';
import { Application, ApplicationSettings } from '@nativescript/core';
import { getCurrentISO3Language, lc } from '~/helpers/locale';
import { setDocumentsService } from '~/models/OCRDocument';
import { networkService } from '~/services/api';
import { documentsService } from '~/services/documents';
import { ocrService } from '~/services/ocr';
import { securityService } from '~/services/security';
import { syncService } from '~/services/sync.android';
import { SETTINGS_SYNC_ON_START } from '~/utils/constants';

export class StartError extends CustomError {
    constructor(message: string) {
        super({ message }, 'StartError');
    }
}

export async function start() {
    if (Application.servicesStarted) {
        return;
    }
    try {
        Application.servicesStarted = false;
        // DEV_LOG && console.log('start');
        setDocumentsService(documentsService);
        await Promise.all([networkService.start(), securityService.start(), syncService.start(), ocrService.start(getCurrentISO3Language()), documentsService.start()]);
        Application.servicesStarted = true;
        // DEV_LOG && console.log('servicesStarted');
        Application.notify({ eventName: 'servicesStarted' });
        if (ApplicationSettings.getBoolean(SETTINGS_SYNC_ON_START, false)) {
            syncService.syncDocuments({ withFolders: true });
        }
    } catch (error) {
        throw new StartError(PLAY_STORE_BUILD ? lc('startup_error') : error.message);
    }
}
export async function stopAppServices() {
    try {
        securityService.stop();
        // wait for sync to stop to stop documentService as their could be writes to the db
        await syncService.stop();
        documentsService.stop();
    } catch (error) {
        console.error(error, error.stack);
    }
}
