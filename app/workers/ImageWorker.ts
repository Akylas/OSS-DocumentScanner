import '@nativescript/core/globals';
const context: Worker = self as any;
import BaseWorker, { WorkerPostEvent } from './BaseWorker';
import { findDocuments, persp_transform } from '~/workers/contours';
import { isAndroid } from '@nativescript/core';
import * as cv2 from 'nativescript-opencv';

function nativeArray(array) {
    if (isAndroid) {
        const nArray = Array.create(java.lang.Object, array.length);
        for (let index = 0; index < array.length; index++) {
            nArray[index] = array[index];
        }
        return nArray;
    }
    return array;
}
export default class ImageWorker extends BaseWorker {
    processImage(nativeDatas: { [k: string]: any }, data) {
        const full = data.full === true;
        const mat = nativeDatas.image;
        // console.log('processImage', mat, full);

        const id = data.id;
        let result;
        try {
            result = findDocuments(mat, full);

            if (full) {
                // if (full) {
                //     console.log('handling full image', data, result.contours.length);
                // }
                const width = result.resizedImage.size().width;
                const ratio = data.width / width;
                const images = result.contours.map((c) => {
                    const rMat = persp_transform(mat, c, ratio);
                    if (data.gray === true || data.blackwhite === true) {
                        // convert the warped image to grayscale
                        cv2.Imgproc.cvtColor(rMat, rMat, cv2.Imgproc.COLOR_RGB2GRAY);

                        // sharpen image
                        const sharpen = new cv2.Mat();
                        cv2.Imgproc.GaussianBlur(rMat, sharpen, new cv2.Size(0, 0), 3);
                        cv2.Core.addWeighted(rMat, 1.5, sharpen, -0.5, 0, rMat);

                        // apply adaptive threshold to get black and white effect
                        // cv2.Imgproc.threshold(rMat, rMat, 127, 255, cv2.Imgproc.THRESH_BINARY);
                        if (data.blackwhite === true) {
                            cv2.Imgproc.adaptiveThreshold(rMat, rMat, 255, cv2.Imgproc.ADAPTIVE_THRESH_MEAN_C, cv2.Imgproc.THRESH_BINARY, 11, 12);
                        }
                    }
                    let image = cv2.imageFromMat(rMat);
                    if (data.rotation !== 0) {
                        const matrix = new android.graphics.Matrix();
                        matrix.postRotate(data.rotation);
                        image = android.graphics.Bitmap.createBitmap(image, 0, 0, image.getWidth(), image.getHeight(), matrix, true);
                    }
                    return image;
                });

                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_images`, nativeArray(images));
                (global as any).postMessage(
                    Object.assign(data, {
                        type: 'contours',
                        id,
                        contours: result.contours,
                        width,
                        height: result.resizedImage.size().height,
                        originalWidth: data.width,
                        originalHeight: data.height,
                        nativeDataKeys: ['edgesImage', 'images'],
                    })
                );
            } else {
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                (global as any).postMessage(
                    Object.assign(data, {
                        type: 'contours',
                        id,
                        contours: result.contours,
                        width: result.resizedImage.size().width,
                        height: result.resizedImage.size().height,
                        originalWidth: data.width,
                        originalHeight: data.height,
                        nativeDataKeys: ['edgesImage'],
                    })
                );
            }
        } catch (error) {
            console.error(error);
            (global as any).postMessage(
                Object.assign(data, {
                    type: 'error',
                    id,
                    error,
                })
            );
        }
    }
}
const worker = new ImageWorker();
context.onmessage = ((event: { data }) => {
    const data = event.data;
    switch (data.type) {
        case 'terminate':
            // worker.log('terminating worker');
            // worker.stop();
            (context as any).close();
            break;
        case 'image':
            const id = data.id;
            const nativeDatas = {};
            data.nativeDataKeys.forEach((k) => {
                nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
            });
            worker.processImage(nativeDatas, data);
            break;
    }
}) as any;
