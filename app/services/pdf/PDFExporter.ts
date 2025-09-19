import { WorkerEventType } from '@akylas/nativescript-app-utils/worker/BaseWorker';
import { Screen, Utils, knownFolders } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { CustomError, SilentError, TimeoutError } from '@shared/utils/error';
import { generatePDFASync } from 'plugin-nativeprocessor';
import { getFileNameForDocument, lc } from '~/helpers/locale';
import { PDF_EXT } from '~/utils/constants';
import { getPageColorMatrix } from '~/utils/matrix';
import { requestStoragePermission } from '~/utils/utils.common';
import { PDFExportOptions, getPDFDefaultExportOptions } from './PDFCanvas';
export async function exportPDFAsync({ compress, document, filename, folder = knownFolders.temp().path, options: baseOptions, pages }: PDFExportOptions): Promise<string> {
    DEV_LOG && console.log('exportPDFAsync', pages.length, folder, filename);
    if (!filename) {
        filename = getFileNameForDocument(document) + PDF_EXT;
    }
    if (__ANDROID__) {
        await requestStoragePermission();
        // return new Promise((resolve, reject) => {
        // pages.forEach((page) => {
        //     if (page.colorType && !page.colorMatrix) {
        //         page.colorMatrix = getColorMatrix(page.colorType);
        //     }
        // });
        const options = JSON.stringify({
            ...getPDFDefaultExportOptions(),
            // page_padding: Utils.layout.toDevicePixels(pdfCanvas.options.page_padding),
            text_scale: Screen.mainScreen.scale * 1.4,
            pages: pages.map((p) => ({ ...p.page, colorMatrix: getPageColorMatrix(p.page) })),
            ...(baseOptions ? baseOptions : {}),
            debug: false
        });
        const context = Utils.android.getApplicationContext();
        DEV_LOG && console.log('exportPDFAsync', context, folder, filename, options);
        return generatePDFASync(folder, filename, options, (e) => {
            if (/could not create file/.test(e.toString())) {
                return new SilentError(lc('please_choose_export_folder_again'));
            } else {
                return wrapNativeException(e);
            }
        });
        // });
    } else {
        const worker = new Worker('~/workers/PDFExportWorker');
        const messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: number }[] } = {};
        worker.onmessage = function onWorkerMessage(event: {
            data: {
                type: WorkerEventType;
                error?;
                // result: WorkerResult;
                messageData;
                id?: number;
                nativeDataKeys: string[];
                // nativeDatas?: { [k: string]: any };
            };
        }) {
            const data = event.data;
            const messageData = data.messageData;
            if (typeof messageData === 'string') {
                try {
                    data.messageData = JSON.parse(messageData);
                } catch (error) {}
            }
            const id = data.id;

            if (id && messagePromises.hasOwnProperty(id)) {
                messagePromises[id].forEach(function (executor) {
                    executor.timeoutTimer && clearTimeout(executor.timeoutTimer);
                    if (data.error) {
                        executor.reject(new CustomError(JSON.parse(data.error)));
                    } else {
                        executor.resolve(data);
                    }
                    // }
                });
                delete messagePromises[id];
            }
        };
        function sendMessageToWorker<T = any>(type: string, messageData?, id?: number, error?, timeout = 0): Promise<T> {
            return new Promise((resolve, reject) => {
                // const id = Date.now().valueOf();
                if (id || timeout) {
                    messagePromises[id] = messagePromises[id] || [];
                    let timeoutTimer;
                    if (timeout > 0) {
                        timeoutTimer = setTimeout(() => {
                            // we need to try catch because the simple fact of creating a new Error actually throws.
                            // so we will get an uncaughtException
                            try {
                                reject(new TimeoutError());
                            } catch {}
                            delete messagePromises[id];
                        }, timeout);
                    }
                    messagePromises[id].push({ reject, resolve, timeoutTimer });
                }

                const data = {
                    error: error !== undefined ? JSON.stringify({ message: error.toString(), stack: error.stack }) : undefined,
                    id,
                    messageData: messageData !== undefined ? JSON.stringify(messageData) : undefined,
                    // nativeDataKeys: keys,
                    type
                };
                // DEV_LOG && console.log('postMessage', data);
                worker.postMessage(data);
            });
        }
        // DEV_LOG && console.log('export message sent to worker', { pages, folder, filename, compress });
        const result = await sendMessageToWorker('export', { pages: pages.map((p) => ({ page: p.page })), folder, filename, compress }, Date.now());
        // DEV_LOG && console.log('result', result);
        return result.messageData;
    }
}
