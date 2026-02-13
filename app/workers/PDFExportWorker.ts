import '@nativescript/core/globals';
import { BaseWorker, WorkerEvent } from '@akylas/nativescript-app-utils/worker/BaseWorker';
import PDFExportCanvas from '~/services/pdf/PDFExportCanvas';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';

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

    async export(id, type, { compress, filename, folder, pages }: { compress: boolean, filename: string, folder: string, pages: { page: OCRPage; document: OCRDocument }[] }) {
        try {
            const exporter = new PDFExportCanvas();
            pages.forEach((d) => d.page = OCRPage.fromJSON(d.page));
            // DEV_LOG && console.log(TAG, 'export', id, type, pages.length, folder, filename, compress);
            const filePath = await exporter.export({ pages, folder, filename, compress });
            // const filePath = 'test';
            (global as any).postMessage({ id, type, messageData: filePath });
        } catch (error) {
            (global as any).postMessage({ id, type, error: JSON.stringify({ message: error.toString(), stack: error.stack, stackTrace: error.stackTrace }) });
        }
    }
}

const worker = new PDFExportWorker(context);
