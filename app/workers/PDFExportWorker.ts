import '@nativescript/core/globals';
import { BaseWorker, WorkerEvent } from '@akylas/nativescript-app-utils/worker/BaseWorker';
import PDFExportCanvas from '~/services/pdf/PDFExportCanvas';

const context: Worker = self as any;
const TAG = '[PDFExportWorker]';

DEV_LOG && console.log(TAG);
class PDFExportWorker extends BaseWorker {
    rece;
    receivedMessage(event: WorkerEvent) {
        const data = event.data;
        switch (data.type) {
            case 'export':
                worker.export(data.id, data.type, data.messageData);
                break;
        }
    }

    async export(id, type, { compress, filename, folder, pages }) {
        try {
            DEV_LOG && console.log(TAG, 'export', id, type, pages.length, folder, filename, compress, JSON.stringify(pages));
            const exporter = new PDFExportCanvas();
            const filePath = await exporter.export({ pages, folder, filename, compress });
            // const filePath = 'test';
            (global as any).postMessage({ id, type, messageData: filePath });
        } catch (error) {
            (global as any).postMessage({ id, type, error: JSON.stringify({ message: error.toString(), stack: error.stack, stackTrace: error.stackTrace }) });
        }
    }
}

const worker = new PDFExportWorker(context);
