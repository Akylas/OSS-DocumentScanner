<script lang="ts">
    import { CameraView } from '@nativescript-community/ui-cameraview';
    import { Canvas, CanvasView, Paint, Style } from '@nativescript-community/ui-canvas';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { AndroidActivityBackPressedEventData, Application, ApplicationSettings, Page, Utils, knownFolders, path } from '@nativescript/core';
    import { ImageSource } from '@nativescript/core/image-source';
    import { debounce } from '@nativescript/core/utils';
    import dayjs from 'dayjs';
    import { createAutoScanHandler } from 'plugin-nativeprocessor';
    import { CropView } from 'plugin-nativeprocessor/CropView';
    import { onDestroy, onMount } from 'svelte';
    import { closeModal } from 'svelte-native';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { writable } from 'svelte/store';
    import CameraSettingsBottomSheet from '~/components/camera/CameraSettingsBottomSheet.svelte';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import IconButton from '~/components/common/IconButton.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, PageData } from '~/models/OCRDocument';
    import {
        AUTO_SCAN_DELAY,
        AUTO_SCAN_DISTANCETHRESHOLD,
        AUTO_SCAN_DURATION,
        AUTO_SCAN_ENABLED,
        IMAGE_CONTEXT_OPTIONS,
        IMG_COMPRESS,
        IMG_FORMAT,
        PREVIEW_RESIZE_THRESHOLD,
        TRANSFORMS_SPLIT
    } from '~/models/constants';
    import { documentsService } from '~/services/documents';
    import { showError, wrapNativeException } from '~/utils/error';
    import { recycleImages } from '~/utils/images';
    import { navigate } from '~/utils/svelte/ui';
    import { goToDocumentView, hideLoading, onBackButton, processCameraImage, showLoading, showSettings } from '~/utils/ui';
    import { colors, navigationBarHeight } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary } = $colors);

    let page: NativeViewElementNode<Page>;
    let cameraView: NativeViewElementNode<CameraView>;
    let takPictureBtnCanvas: NativeViewElementNode<CanvasView>;
    let cropView: NativeViewElementNode<CropView>;

    const cameraOptionsStore = writable<{ aspectRatio: string; stretch: string; viewsize: string; pictureSize: string }>(
        JSON.parse(ApplicationSettings.getString('camera_settings', '{"aspectRatio":"4:3", "stretch":"aspectFit","viewsize":"limited", "pictureSize":null}'))
    );
    cameraOptionsStore.subscribe((newValue) => {
        ApplicationSettings.setString('camera_settings', JSON.stringify(newValue));
    });
    $: ({ aspectRatio, stretch, viewsize, pictureSize } = $cameraOptionsStore);
    $: DEV_LOG && console.log('aspectRatio', aspectRatio);
    $: DEV_LOG && console.log('pictureSize', pictureSize);

    export let modal = false;
    export let document: OCRDocument = null;

    let nbPages = 0;
    let takingPicture = false;
    // let croppedImage: string | ImageSource = null;
    let smallImage: string = null;
    let smallImageRotation: number = 0;
    // let croppedImageRotation: number = 0;
    const previewResizeThreshold = ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD);
    let flashMode = ApplicationSettings.getNumber('defaultFlashMode', 0);
    const zoom = ApplicationSettings.getNumber('defaultZoom', 1);
    let _actualFlashMode = flashMode;
    let torchEnabled = false;
    let batchMode = ApplicationSettings.getBoolean('batchMode', false);
    let canSaveDoc = false;
    let editing = false;

    const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) && !modal;
    $: ApplicationSettings.setBoolean('batchMode', batchMode);

    async function showDocumentsList() {
        if (START_ON_CAM) {
            if (CARD_APP) {
                const CardsList = (await import('~/components/CardsList.svelte')).default;
                return navigate({ page: CardsList });
            } else {
                const DocumentsList = (await import('~/components/DocumentsList.svelte')).default;
                return navigate({ page: DocumentsList });
            }
        }
    }

    async function showCameraSettings() {
        try {
            const addedProps: any = __ANDROID__
                ? {
                      resolutions: cameraView.nativeView.getAllAvailablePictureSizes(),
                      currentResolution: cameraView.nativeView.getCurrentResolutionInfo()
                  }
                : {};
            await showBottomSheet({
                parent: page,
                view: CameraSettingsBottomSheet,
                backgroundOpacity: 0.8,
                skipCollapsedState: true,
                closeCallback: (result, bottomsheetComponent: CameraSettingsBottomSheet) => {
                    ApplicationSettings.setString('defaultColorType', bottomsheetComponent.colorType);
                    if (bottomsheetComponent.colorMatrix) {
                        ApplicationSettings.setString('defaultColorMatrix', JSON.stringify(bottomsheetComponent.colorMatrix));
                    } else {
                        ApplicationSettings.remove('defaultColorMatrix');
                    }
                    ApplicationSettings.setString('defaultTransforms', bottomsheetComponent.transforms.join(TRANSFORMS_SPLIT));
                },
                props: {
                    cameraOptionsStore,
                    ...addedProps
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    async function processAndAddImage(image, autoScan = false) {
        let imageSource: ImageSource;
        try {
            showLoading(l('computing'));
            imageSource = new ImageSource(image);
            const tempImagePath = path.join(knownFolders.temp().path, `capture_${Date.now()}.${IMG_COMPRESS}`);
            await imageSource.saveToFileAsync(tempImagePath, IMG_FORMAT, IMG_COMPRESS);
            //clear memory as soon as possible
            recycleImages(imageSource);
            return await processCameraImage({
                imagePath: tempImagePath,
                fileName: `cropedBitmap_${pagesToAdd.length}.${IMG_FORMAT}`,
                autoScan,
                onBeforeModalImport: () => {
                    if (torchEnabled) {
                        forceTorchDisabled(true);
                    }
                },
                onAfterModalImport: () => {
                    if (torchEnabled) {
                        forceTorchDisabled(false);
                    }
                },
                pagesToAdd
            });
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            if (imageSource) {
                recycleImages(imageSource);
                imageSource = null;
            }
            takingPicture = false;
            hideLoading();
        }
    }

    function pauseAutoScan() {
        DEV_LOG && console.log('pauseAutoScan', autoScanHandler, autoScanHandler?.enabled);
        if (autoScanHandler) {
            autoScanHandler.enabled = false;
        }
    }
    function resumeAutoScan() {
        DEV_LOG && console.log('resumeAutoScan', autoScanHandler, autoScanHandler?.enabled);
        if (autoScanHandler) {
            autoScanHandler.enabled = true;
        }
    }
    async function takePicture(autoScan = false) {
        if (takingPicture) {
            return;
        }
        takingPicture = true;
        if (autoScanHandler) {
            pauseAutoScan();
        }
        try {
            DEV_LOG && console.log('takePicture', autoScan, _actualFlashMode);
            await showLoading(l('capturing'));
            const { image, info } = await cameraView.nativeView.takePicture({
                savePhotoToDisk: false,
                flashMode: _actualFlashMode,
                maxWidth: 4500,
                maxHeight: 4500
            });
            const didAdd = await processAndAddImage(image, autoScan);
            DEV_LOG && console.log('takePicture done', image, didAdd);
            if (didAdd) {
                nbPages = pagesToAdd.length;
                const lastPage = pagesToAdd[pagesToAdd.length - 1];
                setCurrentImage(lastPage.imagePath, lastPage.rotation, true);
                if (!batchMode) {
                    await saveCurrentDocument();
                }
            }
        } catch (err) {
            // we can get a native error here
            showError(wrapNativeException(err));
        } finally {
            takingPicture = false;
            if (autoScanHandler) {
                resumeAutoScan();
            }
            hideLoading();
        }
    }

    $: {
        _actualFlashMode = torchEnabled ? 4 : (flashMode as any);
    }
    function forceTorchDisabled(value) {
        if (value) {
            _actualFlashMode = flashMode;
        } else {
            _actualFlashMode = torchEnabled ? 4 : (flashMode as any);
        }
    }
    function switchTorch() {
        torchEnabled = !torchEnabled;
    }
    function toggleCamera() {
        cameraView.nativeView.toggleCamera();
    }

    onMount(async () => {
        onNavigatedTo();
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        Application.on(Application.backgroundEvent, onBackground);
        Application.on(Application.foregroundEvent, onForeground);

        if (documentsService.started) {
            startPreview();
        } else {
            documentsService.once('started', startPreview);
        }
    });
    onDestroy(() => {
        // clearImages();
        document = null;
        nbPages = 0;
        if (autoScanHandler) {
            autoScanHandler.enabled = false;
            autoScanHandler = null;
        }
        if (processor) {
            processor.autoScanHandler = null;
            processor = null;
        }
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        Application.off(Application.backgroundEvent, onBackground);
        Application.off(Application.foregroundEvent, onForeground);
    });
    function onNavigatedFrom() {
        if (torchEnabled) {
            forceTorchDisabled(true);
        }
        stopPreview();
        if (document) {
            // we need to clear the current document which was not saved
            //especially memory images
            document.removeFromDisk();
            document = null;
        }
    }
    let previewStarted = true;
    function startPreview() {
        if (!previewStarted) {
            previewStarted = true;
            cameraView?.nativeView.startPreview();
        }
    }
    function stopPreview() {
        if (previewStarted) {
            previewStarted = false;
            cameraView?.nativeView.stopPreview();
            if (cropView?.nativeView) {
                cropView.nativeView.quads = null;
            }
        }
    }
    function onNavigatedTo() {
        (async () => {
            try {
                startPreview();
            } catch (error) {
                console.error(error, error.stack);
            }
        })();
    }
    function onBackground() {
        stopPreview();
    }
    function onForeground() {
        DEV_LOG && console.log('onForeground', !!cameraView);
        startPreview();
    }
    async function saveCurrentDocument() {
        const newDocument = !document;
        try {
            DEV_LOG && console.log('saveCurrentDocument', newDocument, !!document);
            if (!document) {
                document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
                if (startOnCam) {
                    await goToDocumentView(document);
                } else {
                    // we should already be in edit so closing should go back there
                }
            } else {
                await document.addPages(pagesToAdd);
                await document.save({}, false);
            }
            if (document) {
                if (!startOnCam) {
                    closeModal(document);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            if (editing) {
                toggleEditing();
                data.cancel = true;
            }
        });

    const pagesToAdd: PageData[] = [];

    async function setCurrentImage(image: string, rotation = 0, needAnimateBack = false) {
        smallImage = image;
        smallImageRotation = rotation;
    }
    $: canSaveDoc = nbPages > 0;

    function focusCamera(e) {
        DEV_LOG && console.log('focusCamera', e.getX(), e.getY());
        cameraView.nativeElement.focusAtPoint(e.getX(), e.getY());
    }
    const onZoom = debounce(function onZoom(event) {
        ApplicationSettings.setNumber('defaultZoom', event.zoom);
    }, 500);

    let autoScan = ApplicationSettings.getBoolean('autoScan', AUTO_SCAN_ENABLED);
    let processor;
    let autoScanHandler;
    function applyAutoScan(value: boolean) {
        if (value) {
            const nCropView = cropView.nativeView;
            const newAutoScanHandler = createAutoScanHandler(nCropView, (result) => {
                DEV_LOG && console.log('onAutoScan', result);
                // TODO: safeguard though should never happen
                if (cameraView?.nativeView) {
                    takePicture(true);
                }
            });
            newAutoScanHandler.distanceThreshod = ApplicationSettings.getNumber('autoScan_distanceThreshold', AUTO_SCAN_DISTANCETHRESHOLD);
            newAutoScanHandler.autoScanDuration = ApplicationSettings.getNumber('autoScan_autoScanDuration', AUTO_SCAN_DURATION);
            newAutoScanHandler.preAutoScanDelay = ApplicationSettings.getNumber('autoScan_preAutoScanDelay', AUTO_SCAN_DELAY);
            autoScanHandler = processor.autoScanHandler = newAutoScanHandler;
        } else {
            processor.autoScanHandler = null;
            autoScanHandler = null;
        }
    }
    function toggleAutoScan(apply = true) {
        DEV_LOG && console.log('toggleAutoScan', autoScan, apply);
        autoScan = !autoScan;
        ApplicationSettings.setBoolean('autoScan', autoScan);
        if (apply) {
            applyAutoScan(autoScan);
        }
    }
    async function applyProcessor() {
        if (processor) {
            return;
        }

        const showAutoScanWarning = ApplicationSettings.getBoolean('showAutoScanWarning', true);
        if (showAutoScanWarning) {
            if (autoScan) {
                const result = await confirm({
                    message: lc('auto_scan_first_use'),
                    okButtonText: lc('enable'),
                    cancelButtonText: lc('disable')
                });
                if (!result && autoScan) {
                    toggleAutoScan(false);
                }
            }
            ApplicationSettings.setBoolean('showAutoScanWarning', false);
        }
        try {
            const nCropView = cropView.nativeView.nativeViewProtected;
            if (__ANDROID__) {
                const context = Utils.android.getApplicationContext();
                processor = new com.akylas.documentscanner.CustomImageAnalysisCallback(context, nCropView);
                cameraView.nativeView.processor = processor;
            } else {
                processor = OpencvDocumentProcessDelegate.alloc().initWithCropView(nCropView);
                cameraView.nativeView.processor = processor;
            }
            DEV_LOG && console.log('applyProcessor', processor, previewResizeThreshold);
            applyAutoScan(autoScan);
            processor.previewResizeThreshold = previewResizeThreshold;
        } catch (error) {
            console.error(error, error.stack);
        }
    }

    function toggleEditing() {
        editing = !editing;
        if (torchEnabled) {
            forceTorchDisabled(editing);
        }
        if (editing) {
            stopPreview();
        } else {
            startPreview();
        }
    }

    function getFlashIcon(flashMode) {
        switch (flashMode) {
            case 0:
                return 'mdi-flash-off';
            case 1:
                return 'mdi-flash';
            case 2:
                return 'mdi-flash-auto';
            case 3:
                return 'mdi-flash-red-eye';
            case 4:
                return 'mdi-flashlight';
        }
    }

    const borderStroke = 3;
    const borderPaint = new Paint();
    borderPaint.strokeWidth = borderStroke;
    borderPaint.style = Style.STROKE;
    borderPaint.color = 'white';

    function onAutoScanChanged(value) {
        if (takPictureBtnCanvas?.nativeView) {
            takPictureBtnCanvas.nativeView.invalidate();
        }
    }
    $: onAutoScanChanged(autoScan);
    function drawTakePictureBtnBorder({ canvas }: { canvas: Canvas }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const radius = Math.min(w, h) / 2 - borderStroke / 2;
        if (autoScan) {
            canvas.drawArc(w / 2 - radius, h / 2 - radius, w / 2 + radius, h / 2 + radius, 0, 270, false, borderPaint);
        } else {
            canvas.drawCircle(w / 2, h / 2, radius, borderPaint);
        }
    }
    let cameraOpened = false;
    function onCameraOpen({ object }: { object: CameraView }) {
        if (__ANDROID__) {
            const currentResolution = cameraView.nativeView.getCurrentResolutionInfo();
            if (currentResolution) {
                cameraOptionsStore.update((state) => {
                    state['aspectRatio'] = currentResolution.aspectRatio;
                    state['pictureSize'] = currentResolution.pictureSize;
                    return state;
                });
            }
        }
        cameraOpened = true;
    }
</script>

<page bind:this={page} id="camera" actionBarHidden={true} statusBarStyle="dark" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout backgroundColor="black" rows="auto,*,auto,auto">
        <cameraView
            bind:this={cameraView}
            {aspectRatio}
            autoFocus={true}
            captureMode={1}
            enablePinchZoom={true}
            flashMode={_actualFlashMode}
            iosCaptureMode="videoPhotoWithoutAudio"
            {pictureSize}
            rowSpan={viewsize === 'full' ? 4 : 2}
            {stretch}
            {zoom}
            on:cameraOpen={onCameraOpen}
            on:loaded={applyProcessor}
            on:zoom={onZoom}
            on:tap={focusCamera} />
        <cropview bind:this={cropView} colors={[colorPrimary]} fillAlpha={120} isUserInteractionEnabled={false} rowSpan="2" strokeWidth={3} />
        <!-- <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} /> -->
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true}>
            {#if startOnCam}
                <IconButton class="actionBarButton" defaultVisualState="black" text="mdi-image-plus" on:tap={showDocumentsList} />
                <IconButton class="actionBarButton" defaultVisualState="black" text="mdi-cogs" on:tap={() => showSettings()} />
            {/if}
        </CActionBar>

        <stacklayout horizontalAlignment="left" orientation="horizontal" row={2} verticalAlignment="center">
            <IconButton color="white" text={getFlashIcon(flashMode)} tooltip={lc('flash_mode')} on:tap={() => (flashMode = (flashMode + 1) % 4)} />
            <IconButton color="white" isSelected={torchEnabled} selectedColor={colorPrimary} text="mdi-flashlight" tooltip={lc('torch')} on:tap={switchTorch} />
            <IconButton color="white" text="mdi-camera-flip" tooltip={lc('toggle_camera')} on:tap={toggleCamera} />
        </stacklayout>
        {#if !startOnCam}
            <IconButton color="white" horizontalAlignment="right" isEnabled={cameraOpened} row={2} text="mdi-tune" on:tap={showCameraSettings} />
        {/if}

        <gridlayout columns="60,*,auto,*,60" ios:paddingBottom={30} android:marginBottom={30 + $navigationBarHeight} paddingTop={30} row={3}>
            <IconButton
                color="white"
                horizontalAlignment="left"
                marginLeft={16}
                text={batchMode ? 'mdi-image-multiple' : 'mdi-image'}
                tooltip={lc('batch_mode')}
                verticalAlignment="center"
                on:tap={() => (batchMode = !batchMode)} />

            <image
                borderColor="white"
                col={1}
                ios:contextOptions={IMAGE_CONTEXT_OPTIONS}
                decodeWidth={Utils.layout.toDevicePixels(60)}
                height={60}
                horizontalAlignment="center"
                imageRotation={smallImageRotation}
                src={smallImage}
                stretch="aspectFit"
                verticalAlignment="center"
                width={60} />
            <gridlayout col={2} height={70} horizontalAlignment="center" opacity={takingPicture ? 0.6 : 1} verticalAlignment="center" width={70}>
                <canvasView bind:this={takPictureBtnCanvas} class:infinite-rotate={autoScan} on:draw={drawTakePictureBtnBorder}> </canvasView>
                <gridlayout backgroundColor={colorPrimary} borderRadius="50%" height={54} horizontalAlignment="center" width={54} on:tap={() => takePicture()} on:longPress={() => toggleAutoScan()} />
                <label color="white" fontSize={20} isUserInteractionEnabled={false} text={nbPages + ''} textAlignment="center" verticalAlignment="middle" visibility={nbPages ? 'visible' : 'hidden'} />
            </gridlayout>

            <IconButton
                col={4}
                color="white"
                horizontalAlignment="right"
                marginRight={16}
                text="mdi-check"
                tooltip={lc('finish')}
                verticalAlignment="center"
                visibility={canSaveDoc ? 'visible' : 'hidden'}
                on:tap={() => saveCurrentDocument()} />
        </gridlayout>

        <!-- <image
            bind:this={fullImageView}
            colorMatrix={getColorMatrix(colorType)}
            imageRotation={smallImageRotation}
            rowSpan={4}
            src={smallImage}
            stretch="aspectFit"
            visibility={showingFullScreenImage ? 'visible' : 'hidden'} /> -->
    </gridlayout>
</page>
