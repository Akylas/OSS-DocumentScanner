<script lang="ts">
    import { backgroundEvent, foregroundEvent } from '@akylas/nativescript/application';
    import { AndroidApplication, ApplicationEventData, android as androidApp, off as applicationOff, on as applicationOn, launchEvent } from '@nativescript/core/application';
    import { request } from '@nativescript-community/perms';
    import { Canvas, CanvasView, Matrix, Paint, Path, Style } from '@nativescript-community/ui-canvas';
    import { File, ObservableArray, Page } from '@nativescript/core';
    import { getString, setString } from '@nativescript/core/application-settings';
    import { ImageSource } from '@nativescript/core/image-source';
    import * as imagepicker from '@nativescript/imagepicker';
    import * as cv2 from 'nativescript-opencv';
    import { showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { showBottomSheet } from '~/utils/svelte/bottomsheet';
    import { l, onLanguageChanged } from '~/helpers/locale';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { hideLoading, showLoading } from '~/utils/ui';
    import { accentColor } from '~/variables';
    import { WorkerEventType, WorkerResult } from '~/workers/BaseWorker';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import DocumentsList from './DocumentsList.svelte';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import PDFView from './PDFView.svelte';
    import { ImageComputeOptions, ImageWorkerOptions } from '../workers/options';
    import PdfEdit from './PDFEdit.svelte';
    import { CameraView } from 'nativescript-cameraview';
    import { onDestroy, onMount } from 'svelte';
    import { getCVRotation } from '~/workers/contours';

    // import { ImageWorkerOptions, ImageComputeOptions } from './workers/index';

    cv2.init();

    // let networkConnected = false;
    const worker = new Worker('~/workers/ImageWorker');
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
    let pages: ObservableArray<OCRPage>;
    let pauseProcessing = false;
    let currentImage: ImageSource = null;
    let debugEdgesImage: ImageSource = null;
    let debugResizedImage: ImageSource = null;
    let contourWidth = 0;
    let contourHeight = 0;
    let contourRotation = 0;
    let flashMode = 0;
    let torchEnabled = false;
    let showEdges = true;

    let computeOptions: ImageComputeOptions = PRODUCTION
        ? {
              algo: 4,
              boundType: 0,
              pageContourType: 1,
              colorType: 1,
              approxValue: 0.02,
              computeTextOrientation: false,
              debug: false,
              sizeFactor: 1
          }
        : JSON.parse(
              getString(
                  'compute_options',
                  `{
        "algo": 4,
        "boundType": 0,
        "pageContourType": 1,
        "colorType": 1,
        "approxValue": 0.02,
        "computeTextOrientation": false,
        "debug": false,
        "sizeFactor": 1
    }`
              )
          );
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
                        text: l('preferences')
                    },
                    {
                        icon: 'mdi-information-outline',
                        id: 'about',
                        text: l('about')
                    },
                    {
                        icon: 'mdi-image-plus',
                        id: 'image_import',
                        text: l('image_import')
                    }
                ]
            }
        });
        if (result) {
            switch (result.id) {
                case 'preferences':
                    prefs.openSettings();
                    break;
                case 'image_import':
                    try {
                        await request('storage');
                        const selection = await imagepicker
                            .create({
                                mediaType: 1,
                                android: {
                                    read_external_storage: 'reading images'
                                },
                                mode: 'single' // use "multiple" for multiple selection
                            })
                            // on android pressing the back button will trigger an error which we dont want
                            .present();
                        if (selection.length > 0) {
                            return new Promise((resolve, reject) => {
                                selection[0].getImageAsync((image, error) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(image);
                                    }
                                });
                            })
                                .then((image) => {
                                    pauseProcessing = true;
                                    const mat = cv2.matFromImage(image);
                                    const size = mat.size();
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
                    const About = require('./About.svelte').default;
                    showModal({ page: About, animated: true, fullscreen: true });
                    break;
            }
        }
    }

    function onCanvasLabelClicked(e) {
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
                    nativeDataKeys: keys
                },
                messageData
            );
            // console.log('postMessage', mData);
            worker.postMessage(mData);
        });
    }

    function handleContours(data) {
        showContour(data);
    }

    function showEdgesMat(mat, rotation = 0) {
        if (!mat) {
            debugEdgesImage = null;
            return;
        }
        const cvRot = getCVRotation(rotation);
        if (cvRot !== -1) {
            cv2.Core.rotate(mat, mat, cvRot);
        }
        let image = cv2.imageFromMat(mat);

        debugEdgesImage = new ImageSource(image);
    }

    function showResizedMat(mat, rotation = 0) {
        if (!mat) {
            debugResizedImage = null;
            return;
        }
        const cvRot = getCVRotation(rotation);
        if (cvRot !== -1) {
            cv2.Core.rotate(mat, mat, cvRot);
        }
        let image = cv2.imageFromMat(mat);

        debugResizedImage = new ImageSource(image);
    }

    function setOptionsKey(key: keyof ImageWorkerOptions, value: any) {
        computeOptions[key] = value;
        computeOptions = computeOptions;
        setString('compute_options', JSON.stringify(computeOptions));
    }

    function showContour(res: { contours; rotation; width; height; originalWidth; originalHeight }) {
        if (contours !== res.contours) {
            contours = res.contours;
            contourWidth = res.width;
            contourHeight = res.height;
            contourRotation = res.rotation;
            canvasView.nativeView.invalidate();
        }
    }

    async function processFrame(event) {
        try {
            if (pauseProcessing) {
                event.processor?.finished();
                return;
            }
            const frame = event.image;
            const info = event.info;
            const viewRotation = info.getRotationDegrees();
            // let w, h;
            // if (viewRotation % 90 === 1) {
            //      w = size.getWidth();
            //  h = size.getHeight();
            // } else {
            //      h = size.getWidth();
            //  w= size.getHeight();
            // }
            const w = frame.getWidth();
            const h = frame.getHeight();
            const planes = frame.getPlanes();
            const y_plane = planes[0].getBuffer();
            const y_plane_step = planes[0].getRowStride();
            grayImage = new cv2.Mat(h, w, cv2.CvType.CV_8UC1, y_plane, y_plane_step);
            // currentImage = new ImageSource(cv2.imageFromMat(grayImage))
            // cv2.Core.rotate(grayImage, grayImage, cv2.Core.ROTATE_180);
            // } else {
            //     grayImage = new cv2.Mat(h, w, cv2.CvType.CV_8UC1);
            //     grayImage.put(0, 0, image);
            // }
            const data = await sendMessageToWorker({ image: grayImage }, { width: w, height: h, rotation: viewRotation, ...computeOptions });
            event.processor?.finished();
            handleContours(data);
            if (computeOptions.debug) {
                showEdgesMat(data.nativeDatas.edgesImage, data.rotation);
                showResizedMat(data.nativeDatas.resizedImage, data.rotation);
            }
            data.nativeDatas.edgesImage.release();
            data.nativeDatas.resizedImage.release();
        } catch (err) {
            event.processor?.finished();
            console.error(err);
        }
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
        const canvas = event.canvas;
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        if (contours) {
            const imgW = contourWidth;
            const imgH = contourHeight;
            const correctionScale = (imgW / imgH) * (contourRotation % 180 === 90 ? w / h : h / w);
            const scale = contourRotation % 180 === 90 ? (h / imgW) * correctionScale : imgH / h / correctionScale;
            // const scale = h / imgW;
            // console.log('onCanvasDraw', w, h, imgW, imgH, contourRotation, scale);
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
        pauseProcessing = false;
    }
    let currentDocument: OCRDocument;
    async function handleFullResult(data: { id: number; nativeDatas?: { [k: string]: any }; [k: string]: any }) {
        const mats = data.nativeDatas.mats;
        // console.log('handleFullResult', data, mats);
        try {
            // doc.mats = data.nativeDatas.mats;
            // doc.rawmats = data.nativeDatas.mats;
            if (mats && mats.length) {
                // const bitmaps = data.nativeDatas.bitmaps;
                const transformedMats = data.nativeDatas.transformedMats;
                const bitmaps = data.nativeDatas.bitmaps;
                const pagesToAdd = data.pages;
                pagesToAdd.forEach((p, i) => {
                    p['mat'] = mats[i];
                    p['bitmap'] = bitmaps[i];
                    p['transformedMat'] = transformedMats[i];
                });
                console.log('document', pages);
                if (!currentDocument) {
                    currentDocument = await OCRDocument.createDocument(new Date().toString(), pagesToAdd);
                    pages = currentDocument.getObservablePages();
                } else {
                    currentDocument.addPages(pagesToAdd);
                }

                if (computeOptions.debug) {
                    // in full image is rotated already
                    showEdgesMat(data.nativeDatas.edgesImage, 0);
                    showResizedMat(data.nativeDatas.resizedImage, 0);
                    currentImage = data.filePath;
                } else {
                    // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
                    navigate({
                        page: PdfEdit,
                        transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                        props: {
                            document: currentDocument
                        }
                    });
                    currentDocument = null;
                    pages = null;
                }
            } else {
                throw new Error('no contours found');
            }
        } catch (err) {
            showError(err);
        }
    }

    async function takePicture() {
        pauseProcessing = true;
        try {
            showLoading(l('computing'));
            const file: File = (await cameraPreview.nativeView.takePicture()) as any;
            // const imageSource = await ImageSource.fromFile(file.path);
            // const mat = cv2.matFromImage(imageSource);
            const data = await sendMessageToWorker({}, { filePath: file.path, full: true, maxSize: 1000, ...computeOptions });
            handleFullResult(data);
            if (!computeOptions.debug) {
                resetPreview();
            }
        } catch (err) {
            showError(err);
            resetPreview();
        } finally {
            hideLoading();
        }
    }
    function switchTorch() {
        const current = cameraPreview.nativeView.flashMode;
        torchEnabled = !(current === 'torch');
        cameraPreview.nativeView.flashMode = torchEnabled ? 'torch' : (flashMode as any);
    }
    function toggleCamera() {
        cameraPreview.nativeView.toggleCamera();
    }

    onMount(() => {
        request('camera').then(onNavigatedTo);

        applicationOn(backgroundEvent, onNavigatedFrom);
        applicationOn(foregroundEvent, onNavigatedTo);
        // documentsService.start().catch(showError);
        // switchTorch();
    });
    onDestroy(() => {
        applicationOff(backgroundEvent, onNavigatedFrom);
        applicationOff(foregroundEvent, onNavigatedTo);
    });
    function onNavigatedFrom() {
        console.log('onNavigatedFrom');
        if (torchEnabled) {
            switchTorch();
        }
        cameraPreview.nativeView.stopPreview();
        // cameraPreview.nativeView.stopCamera();
    }
    function onNavigatedTo() {
        console.log('onNavigatedTo');
        cameraPreview.nativeView.startPreview();
    }
    $: console.log('flashMode', flashMode);
</script>

<page bind:this={page} actionBarHidden={true} id="home" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout rows="auto,*,50">
        <cameraView rowSpan="2" bind:this={cameraPreview} on:frame={processFrame} {flashMode} />
        <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} />
        <CActionBar title={l('document_scanner')}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-file-document" on:tap={showDocumentsList} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-dots-vertical" on:tap={showOptions} />
        </CActionBar>
        <gridLayout row={1} rows="auto,*,auto" padding="10">
            <stacklayout orientation="horizontal">
                <mdbutton variant="flat" class="icon-btn" color="white" text="mdi-flash " on:tap={() => (flashMode = (flashMode + 1) % 5)} />

                <mdbutton color={torchEnabled ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-flashlight" on:tap={switchTorch} />
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-camera" on:tap={toggleCamera} />
            </stacklayout>
            {#if computeOptions.debug}
                <mdslider
                    row={1}
                    height="30"
                    verticalAlignment="top"
                    maxValue="200"
                    value={computeOptions.sizeFactor * 100}
                    on:valueChange={(event) => setOptionsKey('sizeFactor', event.value / 100)}
                />
                <mdslider
                    row={1}
                    marginTop="30"
                    height="30"
                    verticalAlignment="top"
                    maxValue="20"
                    value={computeOptions.approxValue * 100}
                    on:valueChange={(event) => setOptionsKey('approxValue', event.value / 100)}
                />
                <image row={1} stretch="aspectFit" src={showEdges ? debugEdgesImage : debugResizedImage} width="50%" height="50%" horizontalAlignment="right" verticalAlignment="center" />
            {/if}

            <mdbutton row={1} visibility={contours && contours.length > 0 ? 'visible' : 'hidden'} text="takePicture" on:tap={takePicture} verticalAlignment="bottom" horizontalAlignment="center" />
            <mdbutton
                row={1}
                visibility={pauseProcessing ? 'visible' : 'hidden'}
                text="reset"
                on:tap={() => (pauseProcessing = !pauseProcessing)}
                verticalAlignment="bottom"
                horizontalAlignment="left"
            />
            <collectionView items={pages} verticalAlignment="bottom" height="60" row={1} orientation="horizontal" marginBottom={50} reverseLayout={true} colWidth="auto">
                <Template let:item>
                    <gridLayout columns="auto" padding="4">
                        <image src={item.getImageSource()} height="100%" elevation="2" borderRadius="4" rippleColor={accentColor} on:tap={() => onImageTap(item)} />
                    </gridLayout>
                </Template>
            </collectionView>
            {#if currentImage}
                <gridLayout rowSpan="2" width="100%" height="100%">
                    <image stretch="aspectFit" src={currentImage} on:tap={() => (currentImage = null)} />
                    <mdbutton
                        color={accentColor}
                        variant="flat"
                        class="icon-btn"
                        text="mdi-share-variant"
                        on:tap={() => share({ image: currentImage })}
                        verticalAlignment="bottom"
                        horizontalAlignment="right"
                    />
                </gridLayout>
            {/if}
        </gridLayout>
        <stackLayout row="2" orientation="horizontal" backgroundColor="black">
            <mdbutton color={computeOptions.debug ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-bug" on:tap={() => setOptionsKey('debug', !computeOptions.debug)} />
            <mdbutton color={showEdges ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-border-outside" on:tap={() => (showEdges = !showEdges)} />
            <mdbutton variant="flat" class="icon-btn" color="white" text="mdi-invert-colors" on:tap={() => setOptionsKey('colorType', (computeOptions.colorType + 1) % 3)} />
            <gridLayout rows="auto" columns="auto">
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-blur" on:tap={() => setOptionsKey('algo', (computeOptions.algo + 1) % 5)} />
                <label color="white" text={computeOptions.algo + ''} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
            </gridLayout>
            <gridLayout rows="auto" columns="auto">
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-barcode-scan" on:tap={() => setOptionsKey('pageContourType', (computeOptions.pageContourType + 1) % 8)} />
                <label color="white" text={computeOptions.pageContourType + ''} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
            </gridLayout>
            <gridLayout rows="auto" columns="auto">
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-feature-search-outline" on:tap={() => setOptionsKey('boundType', (computeOptions.boundType + 1) % 4)} />
                <label color="white" text={computeOptions.boundType + ''} fontSize="11" verticalAlignment="bottom" horizontalAlignment="right" paddingRight="10" />
            </gridLayout>
            <mdbutton
                color={computeOptions.computeTextOrientation ? accentColor : 'white'}
                variant="flat"
                class="icon-btn"
                text="mdi-format-text-variant"
                on:tap={() => setOptionsKey('computeTextOrientation', !computeOptions.computeTextOrientation)}
            />
        </stackLayout>
    </gridlayout>
</page>
