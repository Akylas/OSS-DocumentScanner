import '@nativescript/core/globals';
import PDFExportCanvas from '~/services/pdf/PDFExportCanvas';
import BaseWorker from './BaseWorker';

// try {
//     const test = require('~/services/pdf/PDFExportCanvas');
// } catch (error) {
//     console.error(error, error.stack);
// }

const context: Worker = self as any;
const TAG = '[PDFExportWorker]';

DEV_LOG && console.log(TAG);
class PDFExportWorker extends BaseWorker {
    receivedMessage(event: { data }) {
        const handled = super.receivedMessage(event);
        if (!handled) {
            const data = event.data;
            switch (data.type) {
                case 'export':
                    worker.export(data.id, data.type, data.messageData);
                    break;
            }
        }
        return true;
    }

    async export(id, type, { pages, folder, filename, compress }) {
        try {
            DEV_LOG && console.log(TAG, 'export', id, type, pages.length, folder, filename, compress);
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
const receivedMessage = worker.receivedMessage.bind(worker);
context.onmessage = (event) => {
    if (typeof event.data.messageData === 'string') {
        try {
            event.data.messageData = JSON.parse(event.data.messageData);
        } catch (error) {}
    }
    if (typeof event.data.error === 'string') {
        try {
            event.data.error = JSON.parse(event.data.error);
        } catch (error) {}
    }
    receivedMessage(event);
};
