import '@nativescript/core/globals';
const context: Worker = self as any;
import BaseWorker, { WorkerPostEvent } from './BaseWorker';
import { calculateTextRotation, findDocuments, getCVRotation, persp_transform, toBlackAndWhite } from '~/workers/contours';
import { knownFolders, path } from '@nativescript/core/file-system';
import * as cv2 from 'nativescript-opencv';
import { ImageWorkerOptions } from './options';
import { ImageSource } from '@nativescript/core';
import { ColorType } from '~/models/OCRDocument';

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
        const time = Date.now();
        this.processing = true;
        const mat = nativeDatas.mat as cv2.Mat;

        const id = data.id;
        let result: {
            edgesImage: cv2.Mat;
            resizedImage: cv2.Mat;
            contours: any[];
        };
        try {
            if (data.full) {
                // console.log('starting', mat);
                //     cv2.Core.flip(mat, mat, 0);
                // }
                if (data.maxSize && (data.width > data.maxSize || data.height > data.maxSize)) {
                    let newWidth, newHeight;
                    const originalRatio = data.width / data.height;
                    if (data.width > data.height) {
                        newWidth = data.maxSize;
                        newHeight = newWidth / originalRatio;
                    } else {
                        newHeight = data.maxSize;
                        newWidth = originalRatio * newHeight;
                    }
                    cv2.Imgproc.resize(mat, mat, new cv2.Size(newWidth, newHeight));
                    console.log('resize image', mat.size().width, mat.size().height, Date.now() - time, 'ms');
                }
            }
            result = findDocuments(mat, data);
            if (data.full) {
                console.log('findDocuments', Date.now() - time, 'ms');
            }
            // if (!result) {
            //     return;
            // }
            // try {
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
            let releaseMat = true;
            if (data.full) {
                const width = result.resizedImage.size().width;
                const ratio = mat.size().width / width;
                const mats = [];
                const pages = [];
                // if (data.debug) {
                // mats.push(mat);
                // pages.push({ colorType: 0 });
                // }
                if (result && result.contours.length) {
                    result.contours.forEach((c, i) => {
                        try {
                            const rMat = persp_transform(mat, c, ratio);
                            console.log('persp_transform image', Date.now() - time, 'ms');
                            if (data.computeTextOrientation) {
                                const gray = new cv2.Mat();
                                cv2.Imgproc.cvtColor(rMat, gray, cv2.Imgproc.COLOR_RGB2GRAY);
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
                                gray.release();
                            }

                            const cvRot = getCVRotation(data.rotation);
                            if (cvRot !== -1) {
                                cv2.Core.rotate(rMat, rMat, cvRot);
                            }
                            console.log('transformed image', Date.now() - time, 'ms');

                            mats.push(rMat);
                            pages.push({ colorType: data.colorType });
                        } catch (err) {
                            console.error('error persp_transform', err, err.stack);
                        }
                    });
                } else {
                    releaseMat = false;
                    mats.push(mat);
                    pages.push({ colorType: data.colorType });
                }

                console.log('created images', Date.now() - time, 'ms');
                const nativeDataKeys = ['mats'];
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_mats`, nativeArray(mats.map((i) => i._native || i)));
                if (!PRODUCTION && data.debug) {
                    com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                    com.akylas.documentscanner.WorkersContext.setValue(`${id}_resizedImage`, result.resizedImage.clone());
                    nativeDataKeys.push('edgesImage', 'resizedImage');
                }

                console.log('worker done', Date.now() - time, 'ms');
                (global as any).postMessage(
                    Object.assign(data, {
                        type: 'contours',
                        id,
                        pages,
                        contours: result.contours,
                        rotation: data.rotation,
                        width: result.resizedImage.size().width,
                        height: result.resizedImage.size().height,
                        originalWidth: data.width,
                        originalHeight: data.height,
                        nativeDataKeys
                    })
                );
                result.edgesImage.release();
                result.resizedImage.release();
                // if (!data.debug) {
                if (releaseMat) {
                    mat.release();
                }
                // }
            } else {
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_edgesImage`, result.edgesImage.clone());
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_resizedImage`, result.resizedImage.clone());

                (global as any).postMessage(
                    Object.assign(data, {
                        type: 'contours',
                        id,
                        contours: result.contours,
                        rotation: data.rotation,
                        width: result.resizedImage.size().width,
                        height: result.resizedImage.size().height,
                        originalWidth: data.width,
                        originalHeight: data.height,
                        nativeDataKeys: ['edgesImage', 'resizedImage']
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
                    error
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

            data.nativeDataKeys.forEach((k) => {
                nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
            });
            if (data.filePath) {
                const imageSource = ImageSource.fromFileSync(data.filePath);
                const mat = cv2.matFromImage(imageSource);
                nativeDatas['mat'] = mat;
                Object.assign(data, { width: imageSource.width, height: imageSource.height, rotation: imageSource.rotationAngle });
            } else if (nativeDatas['bitmap']) {
                const mat = cv2.matFromImage(nativeDatas['bitmap']);
                if (__ANDROID__) {
                    nativeDatas['bitmap'].recycle();
                }
                delete nativeDatas['bitmap'];
                const size = mat.size();
                nativeDatas['mat'] = mat;
                Object.assign(data, { width: size.width, height: size.height, rotation: 0 });
                console.log('handling full image', size.width, size.height);
            }
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
            worker.processImage(nativeDatas, data);
            break;
    }
}) as any;
