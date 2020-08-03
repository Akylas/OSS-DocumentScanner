import '@nativescript/core/globals';
const context: Worker = self as any;
import BaseWorker, { WorkerPostEvent } from './BaseWorker';
import { calculateTextRotation, findDocuments, persp_transform } from '~/workers/contours';
import { isAndroid } from '@nativescript/core';
import * as cv2 from 'nativescript-opencv';
import { ImageWorkerOptions } from './options';

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
    processing = false;
    processImage(nativeDatas: { [k: string]: any }, data: ImageWorkerOptions) {
        this.processing = true;
        const mat = nativeDatas.image;

        const id = data.id;
        let result;
        try {
            if (data.full) {
                console.log('full', 'starting', data);
                //     cv2.Core.flip(mat, mat, 0);
            }
            result = findDocuments(mat, data);

            if (data.full) {
                console.log('full', 'contours', data);
                // if (full) {
                // console.log('handling full image', data, result.contours.length);
                // }
                const width = result.resizedImage.size().width;
                const ratio = data.width / width;
                const images = result.contours.map((c) => {
                    try {
                        const rMat = persp_transform(mat, c, ratio);
                        const gray = new cv2.Mat();
                        cv2.Imgproc.cvtColor(rMat, gray, cv2.Imgproc.COLOR_RGB2GRAY);
                        if (data.computeTextOrientation) {
                            const time = Date.now();
                            try {
                                const angle = calculateTextRotation(gray, rMat);
                                if (angle % 180 === 90 || angle % 180 === 0) {
                                    cv2.Core.rotate(rMat, rMat, cv2.Core.ROTATE_90_COUNTERCLOCKWISE);
                                }
                                console.log('calculateTextRotation', angle, Date.now() - time, 'ms');
                            } catch (err2) {
                                console.error('error calculateTextRotation', err2);
                            }
                        }
                        if (data.colorType > 0) {
                            // convert the warped image to grayscale

                            // sharpen image
                            const sharpen = new cv2.Mat();
                            cv2.Imgproc.GaussianBlur(gray, sharpen, new cv2.Size(0, 0), 3);
                            cv2.Core.addWeighted(rMat, 1.5, sharpen, -0.5, 0, rMat);

                            // apply adaptive threshold to get black and white effect
                            // cv2.Imgproc.threshold(rMat, rMat, 127, 255, cv2.Imgproc.THRESH_BINARY);
                            if (data.colorType === 2) {
                                cv2.Imgproc.adaptiveThreshold(rMat, rMat, 255, cv2.Imgproc.ADAPTIVE_THRESH_MEAN_C, cv2.Imgproc.THRESH_BINARY, 11, 12);
                            }
                        }
                        let image = cv2.imageFromMat(rMat);
                        if (data.rotation !== 0) {
                            const matrix = new android.graphics.Matrix();
                            matrix.postRotate(data.rotation);
                            image = android.graphics.Bitmap.createBitmap(image, 0, 0, image.getWidth(), image.getHeight(), matrix, true);
                        }
                        rMat.release();
                        gray.release();
                        return image;
                    } catch (err) {
                        console.error('error persp_transform', err);
                    }
                });
                console.log('full', 'images', images);

                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_images`, nativeArray(images.filter((i) => !!i)));
                // com.akylas.documentscanner.WorkersContext.setValue(`${id}_resizedImage`, result.resizedImage.clone());
                // com.akylas.documentscanner.WorkersContext.setValue(`${id}_image`, mat.clone());

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
                result.edgesImage.release();
                result.resizedImage.release();
                mat.release();
            } else {
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_resizedImage`, result.resizedImage.clone());

                (global as any).postMessage(
                    Object.assign(data, {
                        type: 'contours',
                        id,
                        contours: result.contours,
                        width: result.resizedImage.size().width,
                        height: result.resizedImage.size().height,
                        originalWidth: data.width,
                        originalHeight: data.height,
                        nativeDataKeys: ['edgesImage', 'resizedImage'],
                    })
                );
                result.edgesImage.release();
                result.resizedImage.release();
                mat.release();
            }
        } catch (error) {
            console.error('error processing image', error, error.stack);
            (global as any).postMessage(
                Object.assign(data, {
                    type: 'error',
                    id,
                    error,
                })
            );
        } finally {
            this.processing = false;
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
            // if (worker.processing) {
            //     console.log('ignoring processing');
            //     (global as any).postMessage(
            //         Object.assign(data, {
            //             type: 'error',
            //             id,
            //             error: 'processing',
            //         })
            //     );
            //     return;
            // }
            data.nativeDataKeys.forEach((k) => {
                nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
            });
            worker.processImage(nativeDatas, data);
            break;
    }
}) as any;
