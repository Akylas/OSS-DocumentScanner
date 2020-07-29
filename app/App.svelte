<script lang="ts">
    import { Page } from '@nativescript/core';
    import { android as androidApp } from '@nativescript/core/application';
    import { ImageSource } from '@nativescript/core/image-source';
    import { Canvas, CanvasView, Matrix, Paint } from 'nativescript-canvas';
    import * as cv2 from 'nativescript-opencv';
    import * as Worker from 'nativescript-worker-loader!~/workers/ImageWorker';
    import { onMount } from 'svelte';
    import { showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { showBottomSheet } from '~/bottomsheet';
    import { accentColor } from '~/variables';
    import { l, onLanguageChanged } from '~/helpers/locale';
    import { NetworkConnectionStateEvent, NetworkConnectionStateEventData, networkService } from '~/services/api';
    import { prefs } from '~/services/preferences';
    import { WorkerEventType, WorkerResult } from '~/workers/BaseWorker';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import { CameraView } from './components/cameraview.android';
    import { showError } from '~/utils/error';

    cv2.init();

    let networkConnected = false;
    const worker = new Worker();
    worker.onmessage = onWorkerMessage;
    let page: NativeViewElementNode<Page>;
    let cameraPreview: NativeViewElementNode<CameraView>;
    let canvasView: NativeViewElementNode<CanvasView>;
    const messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: NodeJS.Timer }[] } = {};
    let grayImage: cv2.Mat;
    const paint = new Paint();
    paint.setColor('red');
    paint.setStrokeWidth(1);

    let contours: [number, number][][] = null;
    let matrix = new Matrix();
    let images: ImageSource[] = [];
    let pausePreview = false;
    let currentImage: ImageSource = null;
    let debugImage: ImageSource = null;
    let contourWidth = 0;
    let contourHeight = 0;
    let contourRotation = 0;
    let torchEnabled = false;

    onMount(async () => {
        networkService.on(NetworkConnectionStateEvent, (event: NetworkConnectionStateEventData) => {
            networkConnected = event.data.connected;
        });
        networkService.start(); // should send connection event and then refresh
    });
    onLanguageChanged((lang) => {
        console.log('refresh triggered by lang change');
    });

    // interface Option {
    //     icon: string;
    //     id: string;
    //     text: string;
    // }
    function showOptions() {
        showBottomSheet({
            parent: page,
            view: ActionSheet,
            props: {
                options: [
                    // {
                    //     icon: 'mdi-map',
                    //     id: 'select_on_map',
                    //     text: l('select_on_map')
                    // },
                    {
                        icon: 'mdi-cogs',
                        id: 'preferences',
                        text: l('preferences'),
                    },
                    {
                        icon: 'mdi-information-outline',
                        id: 'about',
                        text: l('about'),
                    },
                ],
            },
        }).then((result: { icon: string; id: string; text: string }) => {
            if (result) {
                switch (result.id) {
                    case 'preferences':
                        prefs.openSettings();
                        break;
                    case 'about':
                        console.log('showing about');
                        const About = require('./About.svelte').default;
                        showModal({ page: About, animated: true, fullscreen: true });
                        break;
                }
            }
        });
    }

    function quitApp() {
        if (gVars.isIOS) {
            exit(0);
        } else {
            androidApp.startActivity.finish();
        }
    }

    function onCanvasLabelClicked(e) {
        console.log('onCanvasLabelClicked', e.object);
        e.object.redraw();
    }

    function onWorkerMessage(event: {
        data: {
            type: WorkerEventType;
            result: WorkerResult;
            full?: boolean;
            contours?: number[][];
            width?: number;
            height?: number;
            originalWidth?: number;
            originaHeight?: number;
            id?: number;
            rotation?: number;
            nativeDataKeys: string[];
            nativeDatas?: { [k: string]: any };
        };
    }) {
        const data = event.data;
        const id = data.id;

        if (id && messagePromises.hasOwnProperty(id)) {
            messagePromises[id].forEach(function (executor) {
                executor.timeoutTimer && clearTimeout(executor.timeoutTimer);
                // if (isError) {
                // executor.reject(createErrorFromMessage(message));
                // } else {
                const id = data.id;
                if (data.nativeDataKeys.length > 0) {
                    const nativeDatas: { [k: string]: any } = {};
                    if (gVars.isAndroid) {
                        data.nativeDataKeys.forEach((k) => {
                            nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                            com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
                        });
                        data.nativeDatas = nativeDatas;
                    }
                }

                executor.resolve(data);
                // }
            });
            delete messagePromises[id];
        }
    }

    function onImageTap(event) {
        pausePreview = false;
        currentImage = event.item;
    }

    function sendMessageToWorker(
        nativeData,
        messageData,
        timeout = 0
    ): Promise<{
        id: number;
        nativeDatas?: { [k: string]: any };
        [k: string]: any;
    }> {
        return new Promise((resolve, reject) => {
            const id = Date.now().valueOf();
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
            messagePromises[id].push({ resolve, reject, timeoutTimer });

            // const result = worker.processImage(image, { width, height, rotation });
            // handleContours(result.contours, rotation, width, height);
            const keys = Object.keys(nativeData);
            if (gVars.isAndroid) {
                keys.forEach((k) => {
                    com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, nativeData[k]._native || nativeData[k]);
                });
            }
            const mData = Object.assign(
                {
                    type: 'image',
                    id,
                    nativeDataKeys: keys,
                },
                messageData
            );
            // console.log('postMessage', mData);
            worker.postMessage(mData);
        });
    }

    function handleContours(contours, rotation, w, h) {
        showContour(contours, rotation, w, h);
    }

    function showMat(mat, rotation = 0) {
        const size = mat.size();
        if (!mat) {
            debugImage = null;
            return;
        }
        if (rotation !== 0) {
            const M = cv2.Imgproc.getRotationMatrix2D(new cv2.Point(size.width / 2, size.height / 2), rotation, 1);
            cv2.Imgproc.warpAffine(mat, mat, M, new cv2.Size(size.widt, size.height));
        }
        let image = cv2.imageFromMat(mat);

        const imageSource = new ImageSource();
        imageSource.setNativeSource(image);
        debugImage = imageSource;
    }

    function showContour(ctns, rotation, width, height) {
        if (contours !== ctns) {
            contours = ctns;
            contourWidth = width;
            contourHeight = height;
            contourRotation = rotation;
            canvasView.nativeView.invalidate();
        }
    }

    function processFrame(event) {
        if (pausePreview) {
            return;
        }
        const frame = event.frame;
        const viewRotation = frame.getRotationToView();
        const image = frame.getData();
        const size = frame.getSize();
        const w = size.getWidth();
        const h = size.getHeight();
        if (typeof image.getPlanes === 'function') {
            const planes = image.getPlanes();
            const y_plane = planes[0].getBuffer();
            const y_plane_step = planes[0].getRowStride();
            grayImage = new cv2.Mat(h, w, cv2.CvType.CV_8UC1, y_plane, y_plane_step);
        } else {
            grayImage = new cv2.Mat(h, w, cv2.CvType.CV_8UC1);
            grayImage.put(0, 0, image);
        }
        sendMessageToWorker({ image: grayImage }, { width: w, height: h, rotation: viewRotation })
            .then((data) => {
                handleContours(data.contours, data.rotation, data.width, data.height);
                // showMat(data.nativeDatas.edgesImage, data.rotation);
            })
            .catch(showError);
    }

    function getColor(index) {
        switch (index) {
            case 0:
                return '#ff0000';
            case 1:
                return '#00ff00';
            case 2:
                return '#0000ff';
            case 3:
                return '#00ffff';
            case 4:
                return '#ffff00';
            case 5:
                return '#ff00ff';
        }
    }
    function onCanvasDraw(event: { canvas: Canvas }) {
        // const deviceScale = screen.mainScreen.scale;
        const canvas = event.canvas;
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        if (contours) {
            const imgW = contourWidth;
            const imgH = contourHeight;
            const scale = h / imgW;
            paint.color = '#ff0000';
            canvas.drawText(contours.length + '', 30, 30, paint);
            canvas.save();
            canvas.scale(scale, scale, w / 2, h / 2);
            canvas.rotate(contourRotation, w / 2, h / 2);
            canvas.translate(w / 2 - imgW / 2, h / 2 - imgH / 2);
            contours.forEach((c, i) => {
                paint.color = getColor(i);
                let toDraw = [];
                for (let index = 0; index < c.length; index++) {
                    const element = c[index];
                    toDraw.push(element[0]);
                    toDraw.push(element[1]);
                    if (index > 0) {
                        toDraw.push(element[0]);
                        toDraw.push(element[1]);
                    }
                }
                toDraw.push(toDraw[0]);
                toDraw.push(toDraw[1]);
                canvas.drawLines(toDraw, paint);
            });
            canvas.restore();
        }
    }

    function takePicture() {
        pausePreview = true;
        cameraPreview.nativeView
            .takePicture()
            .then((res: { data: any; rotation: number }) => {
                // console.log('got image', res.size, res.rotation);
                // let mat = cv2.matFromImage(res.image);
                let mat = cv2.Imgcodecs.imdecode(new cv2.MatOfByte(res.data), cv2.Imgcodecs.IMREAD_COLOR);
                cv2.Imgproc.cvtColor(mat, mat, cv2.Imgproc.COLOR_BGR2RGB);
                // showMat(mat);
                const size = mat.size();
                // (org.nativescript as any).demovueopencv2.WorkersContext.setValue('fullImage', mat);
                // showMat(mat, res.data.rotation);

                return sendMessageToWorker({ image: mat }, { width: size.width, height: size.height, rotation: res.rotation, full: true, gray: true }).then((data) => {
                    const newImages = [];
                    for (let index = 0; index < data.nativeDatas.images.length; index++) {
                        const imageSource = new ImageSource();
                        imageSource.setNativeSource(data.nativeDatas.images[index]);
                        newImages[index] = imageSource;
                    }
                    images = newImages;
                });
            })
            .catch(showError);
    }
    function switchTorch() {
        const current = cameraPreview.nativeView.torch;
        torchEnabled = current === 'torch';
        cameraPreview.nativeView.torch = torchEnabled ? 'off' : 'torch';
    }
</script>

<page bind:this={page} actionBarHidden="true" id="home">
    <gridlayout rows="auto,*">
        <CActionBar title={l('document_scanner')}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-dots-vertical" on:tap={showOptions} />
        </CActionBar>
        <gridLayout row="1" rows="*,auto" padding="10">
            <cameraView rowSpan="2" bind:this={cameraPreview} on:frame={processFrame} />
            <nsimg rowSpan="2" stretch="aspectFit" src={debugImage} width="50%" height="30%" horizontalAlignment="right" verticalAlignment="bottom" />
            <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} />
            <mdbutton visibility={contours && contours.length > 0 ? 'visible' : 'hidden'} text="takePicture" on:tap={takePicture} verticalAlignment="bottom" horizontalAlignment="center" />
            <mdbutton color={torchEnabled ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-flashlight" on:tap={switchTorch} verticalAlignment="top" horizontalAlignment="right" />
            <mdbutton visibility={pausePreview ? 'visible' : 'hidden'} text="reset" on:tap={(pausePreview = false)} verticalAlignment="top" horizontalAlignment="left" />
            <collectionView items={images} verticalAlignment="bottom" horizontalAlignment="left" orientation="horizontal" rowHeight="100" rowSpan="2" on:itemTap={onImageTap} marginBottom="50">
                <Template let:item>
                    <nsimg src={item} width="100%" />
                </Template>
            </collectionView>
            {#if currentImage}
                <nsimg rowSpan="2" stretch="aspectFit" src={currentImage} width="100%" height="100%" on:tap={(currentImage = null)} />
            {/if}
        </gridLayout>
    </gridlayout>
</page>
