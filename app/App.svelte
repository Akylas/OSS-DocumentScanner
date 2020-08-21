<script lang="ts">
    import { Page, ObservableArray } from '@nativescript/core';
    import { android as androidApp } from '@nativescript/core/application';
    import { getString, setString } from '@nativescript/core/application-settings';
    import { ImageSource } from '@nativescript/core/image-source';
    import { Canvas, CanvasView, Matrix, Paint, Path, Style } from '@nativescript-community/ui-canvas';
    import * as imagepicker from 'nativescript-imagepicker';
    import * as cv2 from 'nativescript-opencv';
    import { request } from 'nativescript-perms';
    import * as Worker from 'nativescript-worker-loader!~/workers/ImageWorker';
    import { onMount } from 'svelte';
    import { showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { showBottomSheet } from '~/bottomsheet';
    import { l, onLanguageChanged } from '~/helpers/locale';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { CustomTransition } from '~/transitions/custom-transition';
    import { share } from '~/utils/share';
    import { hideLoading, showLoading } from '~/utils/ui';
    import { accentColor } from '~/variables';
    import { WorkerEventType, WorkerResult } from '~/workers/BaseWorker';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import { CameraView } from './components/cameraview';
    import OCRDocument from './models/OCRDocument';
    import PDFView from './PDFView.svelte';
    import { ImageComputeOptions, ImageWorkerOptions } from './workers/options';
    import DocumentsList from './DocumentsList.svelte';
    import { throttle } from 'helpful-decorators';

    // import { ImageWorkerOptions, ImageComputeOptions } from './workers/index';

    cv2.init();

    // let networkConnected = false;
    const worker = new Worker();
    worker.onmessage = onWorkerMessage;
    let page: NativeViewElementNode<Page>;
    let cameraPreview: NativeViewElementNode<CameraView>;
    let canvasView: NativeViewElementNode<CanvasView>;
    const messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: NodeJS.Timer }[] } = {};
    let grayImage: cv2.Mat;
    const paint = new Paint();
    paint.setAntiAlias(true);
    const path = new Path();
    paint.setColor('red');
    paint.setStrokeWidth(1);

    let contours: [number, number][][] = null;
    let matrix = new Matrix();
    let images: ObservableArray<ImageSource> = [] as any;
    let pausePreview = false;
    let currentImage: ImageSource = null;
    let debugEdgesImage: ImageSource = null;
    let debugResizedImage: ImageSource = null;
    let contourWidth = 0;
    let contourHeight = 0;
    let contourRotation = 0;
    let torchEnabled = false;
    let showEdges = true;

    let computeOptions: ImageComputeOptions = JSON.parse(
        getString(
            'compute_options',
            `{
        "algo": 2,
        "boundType": 3,
        "pageContourType": 3,
        "colorType": 0,
        "approxValue": 0.01,
        "computeTextOrientation": false,
        "debug": false,
        "sizeFactor": 1
    }`
        )
    );
    console.log('computeOptions', computeOptions);
    // onMount(async () => {
    //     networkService.on(NetworkConnectionStateEvent, (event: NetworkConnectionStateEventData) => {
    //         networkConnected = event.data.connected;
    //     });
    //     networkService.start(); // should send connection event and then refresh
    // });
    onLanguageChanged((lang) => {
        console.log('refresh triggered by lang change');
    });

    // interface Option {
    //     icon: string;
    //     id: string;
    //     text: string;
    // }
    async function showDocumentsList() {
        navigate({ page: DocumentsList });
    }

    async function showOptions() {
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
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
                    {
                        icon: 'mdi-image-plus',
                        id: 'image_import',
                        text: l('image_import'),
                    },
                ],
            },
        });
        if (result) {
            switch (result.id) {
                case 'preferences':
                    prefs.openSettings();
                    break;
                case 'image_import':
                    try {
                        const permRes = await request('storage');
                        console.log('permRes', permRes);
                        const selection = await imagepicker
                            .create({
                                mode: 'single', // use "multiple" for multiple selection
                            })
                            // on android pressing the back button will trigger an error which we dont want
                            .present();
                        console.log('selection', selection);
                        if (selection.length > 0) {
                            return new Promise((resolve, reject) => {
                                selection[0].getImageAsync((image, error) => {
                                    console.log('selection', image, error);
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(image);
                                    }
                                });
                            })
                                .then((image) => {
                                    pausePreview = true;
                                    const mat = cv2.matFromImage(image);
                                    const size = mat.size();
                                    console.log('importing image', image, mat, size);
                                    return sendMessageToWorker({ image: mat }, { full: true, width: size.width, height: size.height, rotation: 0, ...computeOptions });
                                })
                                .then(handleFullResult)
                                .catch(showError);
                        }
                    } catch (err) {
                        console.error(err);
                    }

                    break;
                case 'about':
                    console.log('showing about');
                    const About = require('./About.svelte').default;
                    showModal({ page: About, animated: true, fullscreen: true });
                    break;
            }
        }
    }

    function quitApp() {
        if (global.isIOS) {
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
                    if (global.isAndroid) {
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

    function onImageTap(item) {
        currentImage = item;
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
            if (global.isAndroid) {
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

    function showEdgesMat(mat, rotation = 0) {
        if (!mat) {
            debugEdgesImage = null;
            return;
        }
        const size = mat.size();
        if (rotation !== 0) {
            const M = cv2.Imgproc.getRotationMatrix2D(new cv2.Point(size.width / 2, size.height / 2), rotation, 1);
            cv2.Imgproc.warpAffine(mat, mat, M, new cv2.Size(size.width, size.height));
        }
        let image = cv2.imageFromMat(mat);

        debugEdgesImage = new ImageSource(image);
    }

    function showResizedMat(mat, rotation = 0) {
        if (!mat) {
            debugResizedImage = null;
            return;
        }
        const size = mat.size();
        if (rotation !== 0) {
            const M = cv2.Imgproc.getRotationMatrix2D(new cv2.Point(size.width / 2, size.height / 2), rotation, 1);
            cv2.Imgproc.warpAffine(mat, mat, M, new cv2.Size(size.width, size.height));
        }
        let image = cv2.imageFromMat(mat);

        debugResizedImage = new ImageSource(image);
    }

    function setOptionsKey(key: keyof ImageWorkerOptions, value: any) {
        computeOptions[key] = value;
        console.log('setOptionsKey', key, value);
        computeOptions = computeOptions;
        setString('compute_options', JSON.stringify(computeOptions));
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
        // let w, h;
        // if (viewRotation % 90 === 1) {
        //      w = size.getWidth();
        //  h = size.getHeight();
        // } else {
        //      h = size.getWidth();
        //  w= size.getHeight();
        // }
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
        sendMessageToWorker({ image: grayImage }, { width: w, height: h, rotation: viewRotation, ...computeOptions })
            .then((data) => {
                handleContours(data.contours, data.rotation, data.width, data.height);
                if (computeOptions.debug) {
                    showEdgesMat(data.nativeDatas.edgesImage, data.rotation);
                    showResizedMat(data.nativeDatas.resizedImage, data.rotation);
                }
            })
            .catch(showError);
    }

    function getColor(index) {
        switch (index % 6) {
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
                path.setLines(toDraw);
                paint.color = getColor(i);
                paint.setStyle(Style.FILL);
                paint.setAlpha(100);
                canvas.drawPath(path, paint);
                paint.setStyle(Style.STROKE);
                paint.setAlpha(255);
                canvas.drawPath(path, paint);
            });
            canvas.restore();
        }
    }
    function resetPreview() {
        pausePreview = false;
    }

    async function handleFullResult(data: { id: number; nativeDatas?: { [k: string]: any }; [k: string]: any }) {
        const nativeImages = data.nativeDatas.images;
        console.log('handleFullResult', nativeImages, data.nativeDatas.mats);
        try {
            // doc.mats = data.nativeDatas.mats;
            // doc.rawmats = data.nativeDatas.mats;
            if (nativeImages) {
                const document = await OCRDocument.createDocument(new Date().toString(), data.nativeDatas.mats);
                console.log('document created', nativeImages, data.nativeDatas.mats);
                
                images = null;
                const newImages = [];
                if (computeOptions.debug) {
                    images = new ObservableArray(await Promise.all((await document.pages).map((p) => p.imageSource)));
                    // images = new ObservableArray(document.pages.map(p=>p.image));
                    showEdgesMat(data.nativeDatas.edgesImage, data.rotation);
                    showResizedMat(data.nativeDatas.resizedImage, data.rotation);
                } else {
                    // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
                    navigate({
                        page: PDFView,
                        transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                        props: {
                            document,
                        },
                    });
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    async function takePicture() {
        pausePreview = true;
        try {
            showLoading(l('computing'));
            const res: { data: any; rotation: number } = (await cameraPreview.nativeView.takePicture()) as any;
            console.log('got takePicture  image', res.data, res.rotation);
            // let mat = cv2.matFromImage(res.image);
            let mat = cv2.Imgcodecs.imdecode(new cv2.MatOfByte(res.data), cv2.Imgcodecs.IMREAD_COLOR);
            cv2.Imgproc.cvtColor(mat, mat, cv2.Imgproc.COLOR_BGR2RGB);
            // showMat(mat);
            const size = mat.size();
            // (org.nativescript as any).demovueopencv2.WorkersContext.setValue('fullImage', mat);
            // showMat(mat, res.data.rotation);

            console.log('got takePicture2  image', size);
            const data = await sendMessageToWorker({ image: mat }, { full: true, width: size.width, height: size.height, rotation: res.rotation, ...computeOptions });
            handleFullResult(data);
            mat.release();
        } catch (err) {
            showError(err);
        } finally {
            hideLoading();
        }
    }
    function switchTorch() {
        const current = cameraPreview.nativeView.torch;
        torchEnabled = !(current === 'torch');
        cameraPreview.nativeView.torch = torchEnabled ? 'torch' : 'off';
    }

    // onMount(() => {
    //     documentsService.start().catch(showError);
    //     // switchTorch();
    // });
    function onNavigatedFrom() {
        console.log('onNavigatedFrom', torchEnabled);
        if (torchEnabled) {
            switchTorch();
        }
        // cameraPreview.nativeView.stopCamera();
    }
    function onNavigatedTo() {
        // cameraPreview.nativeView.startCamera();
    }
</script>

<page bind:this={page} actionBarHidden="true" id="home" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout rows="auto,*">

        <cameraView rowSpan="2" bind:this={cameraPreview} on:frame={processFrame} />
        <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} />
        <CActionBar title={l('document_scanner')}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-file-document" on:tap={showDocumentsList} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-dots-vertical" on:tap={showOptions} />
        </CActionBar>
        <gridLayout row="1" rows="auto,*,auto" padding="10">
            <stackLayout orientation="horizontal" backgroundColor="#33000000" borderRadius="4">
                <mdbutton color={torchEnabled ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-flashlight" on:tap={switchTorch} />
                <mdbutton color={computeOptions.debug ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-bug" on:tap={() => setOptionsKey('debug', !computeOptions.debug)} />
                <mdbutton color={showEdges ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-border-outside" on:tap={() => (showEdges = !showEdges)} />
                <!-- <mdbutton variant="flat" class="icon-btn" text="mdi-invert-colors" on:tap={() => setOptionsKey('colorType', (computeOptions.colorType + 1) % 3)} /> -->
                <gridLayout rows="auto" columns="auto">
                    <mdbutton variant="flat" class="icon-btn" text="mdi-blur" on:tap={() => setOptionsKey('algo', (computeOptions.algo + 1) % 5)} />
                    <htmllabel text={computeOptions.algo} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
                </gridLayout>
                <gridLayout rows="auto" columns="auto">
                    <mdbutton variant="flat" class="icon-btn" text="mdi-barcode-scan" on:tap={() => setOptionsKey('pageContourType', (computeOptions.pageContourType + 1) % 9)} />
                    <htmllabel text={computeOptions.pageContourType} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
                </gridLayout>
                <gridLayout rows="auto" columns="auto">
                    <mdbutton variant="flat" class="icon-btn" text="mdi-bandcamp" on:tap={() => setOptionsKey('boundType', (computeOptions.boundType + 1) % 4)} />
                    <htmllabel text={computeOptions.boundType} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
                </gridLayout>
                <mdbutton
                    color={computeOptions.computeTextOrientation ? accentColor : 'white'}
                    variant="flat"
                    class="icon-btn"
                    text="mdi-format-text-variant"
                    on:tap={() => setOptionsKey('computeTextOrientation', !computeOptions.computeTextOrientation)} />

            </stackLayout>
            {#if computeOptions.debug}
                <mdslider
                    row="1"
                    height="30"
                    verticalAlignment="top"
                    maxValue="200"
                    value={computeOptions.sizeFactor * 100}
                    on:valueChange={(event) => setOptionsKey('sizeFactor', event.value / 100)} />
                <mdslider
                    row="1"
                    marginTop="30"
                    height="30"
                    verticalAlignment="top"
                    maxValue="20"
                    value={computeOptions.approxValue * 100}
                    on:valueChange={(event) => setOptionsKey('approxValue', event.value / 100)} />
                <nsimg row="1" stretch="aspectFit" src={showEdges ? debugEdgesImage : debugResizedImage} width="50%" height="30%" horizontalAlignment="right" verticalAlignment="center" />
            {/if}

            <mdbutton row="1" visibility={contours && contours.length > 0 ? 'visible' : 'hidden'} text="takePicture" on:tap={takePicture} verticalAlignment="bottom" horizontalAlignment="center" />
            <mdbutton row="1" visibility={pausePreview ? 'visible' : 'hidden'} text="reset" on:tap={() => (pausePreview = !pausePreview)} verticalAlignment="bottom" horizontalAlignment="left" />
            <collectionView items={images} verticalAlignment="bottom" horizontalAlignment="right" width="50" rowSpan="3">
                <Template let:item>
                    <gridLayout columns="auto" padding="4">
                        <nsimg src={item} width="100%" elevation="2" borderRadius="4" rippleColor={accentColor} on:tap={() => onImageTap(item)} />

                    </gridLayout>
                </Template>
            </collectionView>
            {#if currentImage}
                <gridLayout rowSpan="2" width="100%" height="100%">
                    <nsimg stretch="aspectFit" src={currentImage} on:tap={() => (currentImage = null)} />
                    <mdbutton
                        color={accentColor}
                        variant="flat"
                        class="icon-btn"
                        text="mdi-share-variant"
                        on:tap={() => share({ image: currentImage })}
                        verticalAlignment="bottom"
                        horizontalAlignment="right" />
                </gridLayout>
            {/if}
        </gridLayout>
    </gridlayout>
</page>
