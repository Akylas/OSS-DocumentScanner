import '@nativescript/core/globals';
const context: Worker = self as any;
import BaseWorker, { WorkerPostEvent } from './BaseWorker';
import { calculateTextRotation, findDocuments, persp_transform } from '~/workers/contours';
import { knownFolders, path } from '@nativescript/core/file-system';
import * as cv2 from 'nativescript-opencv';
import { ImageWorkerOptions } from './options';

function nativeArray(array) {
    if (global.isAndroid) {
        const nArray = Array.create(java.lang.Object, array.length);
        for (let index = 0; index < array.length; index++) {
            nArray[index] = array[index];
        }
        return nArray;
    }
    return array;
}
let net: cv2.Net;
export default class ImageWorker extends BaseWorker {
    processing = false;
    processImage(nativeDatas: { [k: string]: any }, data: ImageWorkerOptions) {
        this.processing = true;
        const mat = nativeDatas.image;

        const id = data.id;
        let result: {
            edgesImage: cv2.Mat;
            resizedImage: cv2.Mat;
            contours: any[];
        };
        try {
            // if (data.full) {
            // console.log('starting', mat);
            //     cv2.Core.flip(mat, mat, 0);
            // }
            result = findDocuments(mat, data);
            // try {
            //     const time = Date.now();
            //     if (!net) {
            //         const filepath = path.join(knownFolders.currentApp().path, 'assets/frozen_east_text_detection.pb');
            //         console.log('net file', filepath);
            //         net = cv2.Dnn.readNet(filepath);
            //     }
            //     const textMat = new cv2.Mat();
            //     cv2.Imgproc.resize(result.resizedImage, textMat, new cv2.Size(32, 32));
            //     const blob = cv2.Dnn.blobFromImage(textMat, 0.00392, textMat.size(), new cv2.Scalar(123.68, 116.78, 103.94), true, false);
            //     net.setInput(blob);
            //     const layerNames = new java.util.ArrayList();
            //     const blobResults = new java.util.ArrayList();
            //     layerNames.add('feature_fusion/Conv_7/Sigmoid');
            //     layerNames.add('feature_fusion/concat_3');
            //     net.forward(blobResults, layerNames);
            //     const confThreshold = 0.6;
            //     const scores = blobResults.get(0);
            //     const geometry = blobResults.get(1);
            //     const clsIds = new java.util.ArrayList();
            //     const confs = new java.util.ArrayList();
            //     const rects = new java.util.ArrayList();
            //     for (let i = 0; i < blobResults.size(); ++i) {
            //         // each row is a candidate detection, the 1st 4 numbers are
            //         // [center_x, center_y, width, height], followed by (N-4) class probabilities
            //         const level = blobResults.get(i);
            //         for (let j = 0; j < level.rows(); ++j) {
            //             const row = level.row(j);
            //             const scores = row.colRange(5, level.cols());
            //             const mm = cv2.Core.minMaxLoc(scores);
            //             const confidence = mm.maxVal;
            //             const classIdPoint = mm.maxLoc;
            //             if (confidence > confThreshold) {
            //                 const centerX = Math.round(row.get(0, 0)[0] * textMat.cols());
            //                 const centerY = Math.round(row.get(0, 1)[0] * textMat.rows());
            //                 const width = Math.round(row.get(0, 2)[0] * textMat.cols());
            //                 const height = Math.round(row.get(0, 3)[0] * textMat.rows());
            //                 const left = centerX - width / 2;
            //                 const top = centerY - height / 2;

            //                 clsIds.add(Math.round(classIdPoint.x));
            //                 confs.add(confidence);
            //                 rects.add(new cv2.Rect(left, top, width, height));
            //             }
            //         }
            //     }
            //     if (confs.size() >= 2) {
            //         const nmsThresh = 0.5;
            //         const confidences = new cv2.MatOfFloat(cv2.Converters.vector_float_to_Mat(confs));
            //         const boxesArray = rects.toArray(new Rect[0]());
            //         const boxes = new cv2.MatOfRect(boxesArray);
            //         const indices = new cv2.MatOfInt();
            //         cv2.Dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThresh, indices);

            //         const ind = indices.toArray();
            //         // let j = 0;
            //         for (let i = 0; i < ind.length; ++i) {
            //             const idx = ind[i];
            //             const box = boxesArray[idx];
            //             console.log('rectangle');
            //             cv2.Imgproc.rectangle(textMat, box.tl(), box.br(), new cv2.Scalar(0, 0, 255), 2);
            //         }
            //     }
            //     const nmsThresh = 0.5;

            //     console.log('ocr detect', blobResults.size(), Date.now() - time, 'ms');
            // } catch (err2) {
            //     console.error('error running dnn', err2, err2.stack);
            // }

            if (data.full) {
                // console.log('full', 'contours', data);
                // if (full) {
                // console.log('handling full image', data, result.contours.length);
                // }
                const width = result.resizedImage.size().width;
                const ratio = data.width / width;
                const images = result.contours.map((c, i) => {
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
                        // if (data.colorType > 0) {
                        //     // convert the warped image to grayscale

                        //     // sharpen image
                        //     const sharpen = new cv2.Mat();
                        //     cv2.Imgproc.GaussianBlur(gray, sharpen, new cv2.Size(0, 0), 3);
                        //     cv2.Core.addWeighted(rMat, 1.5, sharpen, -0.5, 0, rMat);

                        //     // apply adaptive threshold to get black and white effect
                        //     // cv2.Imgproc.threshold(rMat, rMat, 127, 255, cv2.Imgproc.THRESH_BINARY);
                        //     if (data.colorType === 2) {
                        //         cv2.Imgproc.adaptiveThreshold(rMat, rMat, 255, cv2.Imgproc.ADAPTIVE_THRESH_MEAN_C, cv2.Imgproc.THRESH_BINARY, 11, 12);
                        //     }
                        // }
                        if (data.rotation !== 0) {
                            cv2.Core.rotate(rMat, rMat, cv2.Core.ROTATE_90_COUNTERCLOCKWISE);
                            // console.log('rotation', 'data.rotation', i, data.rotation);
                            // const matrix = new android.graphics.Matrix();
                            // matrix.postRotate(data.rotation);
                            // bitmap = android.graphics.Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
                        }
                        const bitmap = cv2.imageFromMat(rMat);
                        // rMat.release();
                        gray.release();
                        return { bitmap, mat: rMat };
                    } catch (err) {
                        console.error('error persp_transform', err);
                    }
                }) as { bitmap: android.graphics.Bitmap; mat: cv2.Mat }[];
                // console.log('full', 'images', images);

                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_images`, nativeArray(images.map((i) => i.bitmap)));
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_mats`, nativeArray(images.map((i) => (i.mat as any)._native)));
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_resizedImage`, result.resizedImage.clone());
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
                        nativeDataKeys: ['edgesImage', 'images', 'mats', 'resizedImage'],
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
