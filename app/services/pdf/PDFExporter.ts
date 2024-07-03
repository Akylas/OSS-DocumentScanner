import { CustomError, PermissionError, SilentError, wrapNativeException } from '~/utils/error';
import type { WorkerEventType } from '~/workers/BaseWorker';
import PDFCanvas, { PDFExportOptions } from './PDFCanvas';
import { ApplicationSettings, Screen, Utils, knownFolders } from '@nativescript/core';
import { getColorMatrix, getPageColorMatrix } from '~/utils/matrix';
import { lc } from '~/helpers/locale';
import { SDK_VERSION } from '@nativescript/core/utils';
import { isPermResultAuthorized, request } from '@nativescript-community/perms';
import type { OCRDocument } from '~/models/OCRDocument';
import dayjs from 'dayjs';
import { getFileNameForDocument } from '~/utils/utils.common';
export async function exportPDFAsync({ pages, document, folder = knownFolders.temp().path, filename, compress }: PDFExportOptions): Promise<string> {
    DEV_LOG && console.log('exportPDFAsync', pages.length, folder, filename);
    if (!filename) {
        filename = getFileNameForDocument(document) + '.pdf';
    }
    if (__ANDROID__) {
        // if (SDK_VERSION <= 29) {
        //     const result = await request('storage');
        //     if (!isPermResultAuthorized(result)) {
        //         throw new PermissionError(lc('storage_permission_needed'));
        //     }
        // }
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const pdfCanvas = new PDFCanvas();
            // pages.forEach((page) => {
            //     if (page.colorType && !page.colorMatrix) {
            //         page.colorMatrix = getColorMatrix(page.colorType);
            //     }
            // });
            const options = JSON.stringify({
                ...pdfCanvas.options,
                // page_padding: Utils.layout.toDevicePixels(pdfCanvas.options.page_padding),
                text_scale: Screen.mainScreen.scale * 1.4,
                pages: pages.map((p) => ({ ...p, colorMatrix: getPageColorMatrix(p) }))
            });
            const context = Utils.android.getApplicationContext();
            DEV_LOG && console.log('exportPDFAsync', context, folder, filename, options);
            com.akylas.documentscanner.utils.PDFUtils.Companion.generatePDFASync(
                context,
                folder,
                filename,
                options,
                new com.akylas.documentscanner.utils.PDFUtils.FunctionCallback({
                    onResult(e, result) {
                        if (e) {
                            if (/could not create file/.test(e.toString())) {
                                reject(new SilentError(lc('please_choose_export_folder_again')));
                            } else {
                                reject(wrapNativeException(e));
                            }
                        } else {
                            resolve(result);
                        }
                        DEV_LOG && console.log('exportPDFAsync', 'done', JSON.stringify(pdfCanvas.options), options.length, Date.now() - start, 'ms');
                    }
                })
            );
        });
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
                nativeDatas?: { [k: string]: any };
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
                    // if (isError) {
                    // executor.reject(createErrorFromMessage(message));
                    // } else {
                    const id = data.id;
                    if (data.nativeDataKeys?.length > 0) {
                        const nativeDatas: { [k: string]: any } = {};
                        if (__ANDROID__) {
                            data.nativeDataKeys.forEach((k) => {
                                nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                                com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
                            });
                            data.nativeDatas = nativeDatas;
                        }
                    }
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
                                reject(new Error('timeout'));
                            } catch {}
                            delete messagePromises[id];
                        }, timeout);
                    }
                    messagePromises[id].push({ reject, resolve, timeoutTimer });
                }

                // const result = worker.processImage(image, { width, height, rotation });
                // handleContours(result.contours, rotation, width, height);
                // const keys = Object.keys(nativeData);
                // if (__ANDROID__) {
                //     keys.forEach((k) => {
                //         com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, nativeData[k]._native || nativeData[k]);
                //     });
                // }
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
        const result = await sendMessageToWorker('export', { pages, folder, filename, compress }, Date.now());
        // DEV_LOG && console.log('result', result);
        return result.messageData;
    }
}
