<script lang="ts">
    import { backgroundEvent, foregroundEvent } from '@akylas/nativescript/application';
    import { request } from '@nativescript-community/perms';
    import { Canvas, CanvasView, Matrix, Paint, Path, Style } from '@nativescript-community/ui-canvas';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { ApplicationSettings, CoreTypes, File, ObservableArray, Page, TouchAnimationOptions, Utils } from '@nativescript/core';
    import { off as applicationOff, on as applicationOn } from '@nativescript/core/application';
    import { getString, setString } from '@nativescript/core/application-settings';
    import { ImageSource } from '@nativescript/core/image-source';
    import { StackLayout } from '@nativescript/core/ui';
    import { CameraView } from 'nativescript-cameraview';
    import * as cv2 from 'nativescript-opencv';
    import { onDestroy, onMount } from 'svelte';
    import { closeModal, showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { l, onLanguageChanged } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { getColorMatrix, hideLoading, importAndScanImage, sendMessageToWorker, showLoading } from '~/utils/ui';
    import { accentColor, primaryColor } from '~/variables';
    import { getCVRotation } from '~/workers/contours';
    import { DEFAULT_PRODUCTION_COMPUTE_OPTIONS, ImageComputeOptions, ImageWorkerOptions } from '../workers/options';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import DocumentsList from './DocumentsList.svelte';
    import RotableImageView from './RotableImageView.svelte';

    cv2.init();

    const touchAnimationShrink: TouchAnimationOptions = {
        down: {
            scale: { x: 0.9, y: 0.9 },
            // backgroundColor: primaryColor.darken(10),
            duration: 100,
            curve: CoreTypes.AnimationCurve.easeInOut
        },
        up: {
            scale: { x: 1, y: 1 },
            // backgroundColor: primaryColor,
            duration: 100,
            curve: CoreTypes.AnimationCurve.easeInOut
        }
    };
    let page: NativeViewElementNode<Page>;
    let cameraPreview: NativeViewElementNode<CameraView>;
    let fullImageView: NativeViewElementNode<Img>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let canvasView: NativeViewElementNode<CanvasView>;
    let grayImage: cv2.Mat;
    const paint = new Paint();
    paint.setAntiAlias(true);
    const path = new Path();
    paint.setColor('red');
    paint.setStrokeWidth(1);

    export let document: OCRDocument;
    export let modal = false;
    let newDocument = !document;

    let contours: [number, number][][] = null;
    let pages: ObservableArray<OCRPage>;
    let nbPages = 0;
    let pauseProcessing = false;
    let takingPicture = false;
    let currentImage: ImageSource = null;
    let debugEdgesImage: ImageSource = null;
    let debugResizedImage: ImageSource = null;
    let contourWidth = 0;
    let contourHeight = 0;
    let contourRotation = 0;
    let flashMode = 0;
    let torchEnabled = false;
    let showEdges = true;
    let batchMode = ApplicationSettings.getBoolean('batchMode', false);
    let canSaveDoc = false;
    let cameraScreenRatio = 1;
    let showingFullScreenImage = false;

    const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) && !modal;
    $: ApplicationSettings.setBoolean('batchMode', batchMode);
    let computeOptions: ImageComputeOptions = PRODUCTION
        ? DEFAULT_PRODUCTION_COMPUTE_OPTIONS
        : JSON.parse(
              getString(
                  'compute_options',
                  `{
        "algo": 6,
        "boundType": 0,
        "pageContourType": 4,
        "colorType": 1,
        "approxValue": 0.02,
        "computeTextOrientation": false,
        "debug": false,
        "sizeFactor": 1,
        "blurSize": 3,
        "contrast": 1.3
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
        return navigate({ page: DocumentsList });
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
                        const doc = await importAndScanImage(computeOptions);
                        const page = (await import('~/components/PDFView.svelte')).default;
                        await navigate({
                            page,
                            props: {
                                document: doc
                            }
                        });
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

    function onImageTap(e, item) {
        setCurrentImage(e.object.src);
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
            const data = await sendMessageToWorker({ mat: grayImage }, { width: w, height: h, rotation: viewRotation, ...computeOptions });
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
            // paint.color = '#ff0000';
            // canvas.drawText(contours.length + '', 30, 30, paint);
            canvas.save();
            canvas.scale(scale, scale, w / 2, h / 2);
            canvas.rotate(contourRotation, w / 2, h / 2);
            canvas.translate(w / 2 - imgW / 2, h / 2 - imgH / 2);
            let c, element;
            for (let i = 0; i < contours.length; i++) {
                c = contours[i];
                paint.color = getColor(i);
                let toDraw = [];
                for (let index = 0; index < c.length; index++) {
                    element = c[index];
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
            }
            canvas.restore();
        }
    }
    function resetPreview() {
        pauseProcessing = false;
    }
    async function handleFullResult(data: { id: number; nativeDatas?: { [k: string]: any }; [k: string]: any }, filePath) {
        const start = Date.now();
        const mats = data.nativeDatas.mats;
        const hasMats = mats && mats.length;
        // console.log('handleFullResult', data, mats);
        try {
            // doc.mats = data.nativeDatas.mats;
            // doc.rawmats = data.nativeDatas.mats;
            if (hasMats) {
                // const bitmaps = data.nativeDatas.bitmaps;
                // const transformedMats = data.nativeDatas.transformedMats;
                // const bitmaps = data.nativeDatas.bitmaps;
                const pagesToAdd = data.pages;
                pagesToAdd.forEach((p, i) => {
                    p['mat'] = mats[i];
                    if (p.colorType && !p.colorMatrix) {
                        p.colorMatrix = getColorMatrix(p.colorType);
                    }
                    // p['bitmap'] = bitmaps[i];
                    // p['transformedMat'] = transformedMats[i];
                });
                if (!document) {
                    document = await OCRDocument.createDocument(new Date().toString(), pagesToAdd);
                } else {
                    await document.addPages(pagesToAdd);
                }
                pagesToAdd.forEach((p) => {
                    p.mat.release();
                    // p.transformedMat.release();
                });
                console.log('document updated', Date.now() - start, 'ms');

                if (computeOptions.debug) {
                    // in full image is rotated already
                    showEdgesMat(data.nativeDatas.edgesImage, 0);
                    showResizedMat(data.nativeDatas.resizedImage, 0);
                    // currentImage = data.filePath;
                }
                if (batchMode) {
                    if (!pages) {
                        pages = document.getObservablePages();
                    }
                    nbPages = pages.length;
                    setCurrentImage(pages.getItem(pages.length - 1).getImagePath(), true);
                } else {
                    saveCurrentDocument();
                }
            } else {
                showSnack({ message: 'no_scan_found' });
            }
        } catch (err) {
            showError(err);
        }
    }

    async function takePicture() {
        if (takingPicture) {
            return;
        }
        pauseProcessing = true;
        takingPicture = true;
        try {
            const start = Date.now();
            // const available = cameraPreview.nativeView.getAllAvailablePictureSizes();
            // console.log('available', available.length);
            // const test = available[0];
            // console.log('max size', test.width, test.height);
            const file: File = (await cameraPreview.nativeView.takePicture({
                // pictureSize: { width: test.width, height: test.height },
                captureMode: batchMode ? 1 : 0
            })) as any;
            showLoading(l('computing'));
            console.log('got image', Date.now() - start, 'ms');
            // const imageSource = await ImageSource.fromFile(file.path);
            // const mat = cv2.matFromImage(imageSource);
            const data = await sendMessageToWorker({}, { filePath: file.path, full: true, ...computeOptions });
            console.log('worker is done!', Date.now() - start, 'ms');
            await handleFullResult(data, file.path);
            console.log('handleFullResult is done!', Date.now() - start, 'ms');
            if (!computeOptions.debug) {
                resetPreview();
            }
        } catch (err) {
            showError(err);
            resetPreview();
        } finally {
            takingPicture = false;
            hideLoading();
        }
    }
    function switchTorch() {
        if (cameraPreview) {
            const current = cameraPreview.nativeView.flashMode;
            torchEnabled = !(current === 'torch');
            cameraPreview.nativeView.flashMode = torchEnabled ? 'torch' : (flashMode as any);
        }
    }
    function toggleCamera() {
        cameraPreview.nativeView.toggleCamera();
    }

    onMount(async () => {
        await request('camera');
        onNavigatedTo();

        applicationOn(backgroundEvent, onBackground);
        applicationOn(foregroundEvent, onForeground);
        // documentsService.start().catch(showError);
        // switchTorch();
    });
    onDestroy(() => {
        applicationOff(backgroundEvent, onBackground);
        applicationOff(foregroundEvent, onForeground);
    });
    function onNavigatedFrom() {
        console.log('onNavigatedFrom');
        if (torchEnabled) {
            switchTorch();
        }
        cameraPreview?.nativeView.stopPreview();
        // cameraPreview.nativeView.stopCamera();
    }
    function onNavigatedTo() {
        console.log('onNavigatedTo', !!cameraPreview);
        cameraPreview?.nativeView.startPreview();
    }
    function onBackground() {
        console.log('onBackground', !!cameraPreview);
        cameraPreview?.nativeView.stopPreview();
    }
    function onForeground() {
        console.log('onForeground', !!cameraPreview);
        cameraPreview?.nativeView.startPreview();
    }
    $: console.log('flashMode', flashMode);
    async function saveCurrentDocument() {
        console.log('saveCurrentDocument', newDocument);
        if (document) {
            document.save();
            if (newDocument) {
                documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
                // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
                const page = (await import('~/components/PDFView.svelte')).default;
                navigate({
                    page,
                    // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                    props: {
                        document: document
                    }
                });
            } else {
                // we should already be in edit so closing should go back there
            }

            if (!startOnCam) {
                closeModal(document);
            }

            document = null;
            nbPages = 0;
            pages = new ObservableArray([]);
            resetPreview();
        }
    }

    async function setCurrentImage(image, needAnimateBack = false) {
        const imageView = fullImageView.nativeElement;
        imageView.originX = 0.5;
        imageView.originY = 0.5;
        if (!image && currentImage) {
            showingFullScreenImage = false;
            await imageView.animate({
                duration: 200,
                opacity: 0,
                scale: {
                    x: 0.5,
                    y: 0.5
                }
            });
            currentImage = image;
        } else if (image) {
            showingFullScreenImage = !needAnimateBack;
            currentImage = image;
            await imageView.animate({
                duration: 200,
                opacity: 1,
                scale: {
                    x: 1,
                    y: 1
                }
            });
            if (needAnimateBack) {
                imageView.originX = 1;
                imageView.originY = 1 - 80 / Utils.layout.toDeviceIndependentPixels(canvasView.nativeElement.getMeasuredHeight());
                const ratio = imageView.getMeasuredWidth() / imageView.getMeasuredHeight();
                const scaleX = (ratio * collectionView.nativeElement.getMeasuredHeight()) / imageView.getMeasuredWidth();
                const scaleY = collectionView.nativeElement.getMeasuredHeight() / imageView.getMeasuredHeight();
                await imageView.animate({
                    duration: 500,
                    scale: {
                        x: scaleX,
                        y: scaleY
                    }
                });
                imageView.opacity = 0;
                collectionView.nativeElement.scrollToIndex(pages.length - 1, false);
                // currentImage = null;
            }
        }
    }
    $: canSaveDoc = document && batchMode;

    function onCameraLayoutChanged() {
        cameraScreenRatio = cameraPreview.nativeElement.getMeasuredWidth() / cameraPreview.nativeElement.getMeasuredHeight();
    }
    function focusCamera(e) {
        console.log('focusCamera', e.getX(), e.getY(), Object.keys(e));
        cameraPreview.nativeElement.focusAtPoint(e.getX(), e.getY());
    }
    function onCollectionLayoutChanged(e) {
        // console.log('onCameraLayoutChanged', e.object.getMeasuredWidth(), e.object.getMeasuredHeight(), e.object.getMeasuredWidth() / e.object.getMeasuredHeight());
    }
</script>

<page bind:this={page} actionBarHidden={true} id="home" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout rows="auto,*,50">
        <cameraView rowSpan="2" bind:this={cameraPreview} {flashMode} on:frame={processFrame} on:layoutChanged={onCameraLayoutChanged} enablePinchZoom={true} autoFocus={true} />
        <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} />
        <CActionBar title={startOnCam ? l('app.name') : null} backgroundColor="transparent" modalWindow={!startOnCam}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-document" on:tap={showDocumentsList} visibility={startOnCam ? 'visible' : 'collapsed'} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-dots-vertical" on:tap={showOptions} visibility={startOnCam ? 'visible' : 'collapsed'} />
        </CActionBar>
        <gridLayout row={1} rows="auto,*,auto" padding="10">
            <stacklayout orientation="horizontal">
                <mdbutton variant="flat" class="icon-btn" color="white" text="mdi-flash " on:tap={() => (flashMode = (flashMode + 1) % 5)} />

                <mdbutton color={torchEnabled ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-flashlight" on:tap={switchTorch} />
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-camera" on:tap={toggleCamera} />
            </stacklayout>
            <mdbutton color="white" variant="flat" class="icon-btn" text={batchMode ? 'mdi-image-multiple' : 'mdi-image'} on:tap={() => (batchMode = !batchMode)} horizontalAlignment="right" />
            {#if computeOptions.debug}
                <stackLayout row={1} verticalAlignment="top">
                    <gridlayout columns="auto,*,auto" rows="auto">
                        <label text="blurSize" fontSize="12" verticalAlignment="center" color="white" />
                        <slider col={1} minValue={1} maxValue={21} stepSize={2} value={computeOptions.blurSize} on:valueChange={(event) => setOptionsKey('blurSize', event.value)} />
                        <label col={2} text={computeOptions.blurSize + ''} fontSize="12" verticalAlignment="center" color="white" />
                    </gridlayout>
                    <gridlayout columns="auto,*,auto" rows="auto">
                        <label text="approxValue" fontSize="12" verticalAlignment="center" color="white" />
                        <slider col={1} stepSize={1} maxValue="20" value={computeOptions.approxValue * 100} on:valueChange={(event) => setOptionsKey('approxValue', event.value / 100)} />
                        <label col={2} text={computeOptions.approxValue + ''} fontSize="12" verticalAlignment="center" color="white" />
                    </gridlayout>
                    <gridlayout columns="auto,*,auto" rows="auto">
                        <label text="contrast" fontSize="12" verticalAlignment="center" color="white" />
                        <slider col={1} stepSize={0.1} maxValue="2" value={computeOptions.contrast || 1} on:valueChange={(event) => setOptionsKey('contrast', event.value)} />
                        <label col={2} text={computeOptions.contrast + ''} fontSize="12" verticalAlignment="center" color="white" />
                    </gridlayout>
                </stackLayout>

                <image row={1} stretch="aspectFit" src={showEdges ? debugEdgesImage : debugResizedImage} width="50%" height="50%" horizontalAlignment="right" verticalAlignment="center" />
            {/if}

            <collectionView
                items={pages}
                bind:this={collectionView}
                horizontalAlignment="left"
                verticalAlignment="bottom"
                width="100%"
                height={60 / cameraScreenRatio}
                row={1}
                orientation="horizontal"
                reverseLayout={false}
                colWidth="auto"
                marginBottom={80}
            >
                <Template let:item>
                    <gridLayout>
                        <RotableImageView {item} height="100%" rippleColor={accentColor} on:tap={(e) => onImageTap(e, item)} margin="0 5 0 5" />
                    </gridLayout>
                </Template>
            </collectionView>
            <!-- <mdbutton row={1} text="takePicture" on:tap={takePicture} verticalAlignment="bottom" horizontalAlignment="center" /> -->
            <gridlayout
                row={1}
                marginBottom={10}
                width={70}
                height={70}
                borderRadius={35}
                borderWidth={3}
                borderColor="white"
                verticalAlignment="bottom"
                horizontalAlignment="center"
                opacity={takingPicture ? 0.6 : 1}
            >
                <gridlayout touchAnimation={touchAnimationShrink} backgroundColor={primaryColor} width={60} height={60} borderRadius={30} on:tap={takePicture} />
                <label color="white" fontSize={20} textAlignment="center" verticalAlignment="center" visibility={nbPages ? 'visible' : 'hidden'} text={nbPages + ''} />
            </gridlayout>
            <mdbutton
                row={1}
                visibility={pauseProcessing ? 'visible' : 'hidden'}
                text="reset"
                on:tap={() => (pauseProcessing = !pauseProcessing)}
                verticalAlignment="bottom"
                horizontalAlignment="left"
            />
            <mdbutton
                color="white"
                variant="flat"
                row={1}
                verticalAlignment="bottom"
                horizontalAlignment="right"
                class="icon-btn"
                text="mdi-check"
                on:tap={() => saveCurrentDocument()}
                visibility={canSaveDoc ? 'visible' : 'hidden'}
            />
            <image bind:this={fullImageView} rowSpan={2} stretch="aspectFit" src={currentImage} on:tap={() => setCurrentImage(null)} isUserInteractionEnabled={showingFullScreenImage} />
        </gridLayout>
        <stackLayout row="2" orientation="horizontal" backgroundColor="black">
            <mdbutton color={computeOptions.debug ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-bug" on:tap={() => setOptionsKey('debug', !computeOptions.debug)} />
            <mdbutton color={showEdges ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-border-outside" on:tap={() => (showEdges = !showEdges)} />
            <mdbutton variant="flat" class="icon-btn" color="white" text="mdi-invert-colors" on:tap={() => setOptionsKey('colorType', (computeOptions.colorType + 1) % 3)} />
            <gridLayout rows="auto" columns="auto">
                <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-blur" on:tap={() => setOptionsKey('algo', (computeOptions.algo + 1) % 7)} />
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
