<script lang="ts">
    import { CameraView } from '@nativescript-community/ui-cameraview';
    import { Canvas, CanvasView, Paint, Style } from '@nativescript-community/ui-canvas';
    import { Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { AndroidActivityBackPressedEventData, Application, ApplicationSettings, CoreTypes, Page, TouchAnimationOptions, Utils } from '@nativescript/core';
    import { ImageSource } from '@nativescript/core/image-source';
    import dayjs from 'dayjs';
    import { cropDocument, detectQRCode, getColorPalette, getJSONDocumentCorners } from 'plugin-nativeprocessor';
    import { CropView } from 'plugin-nativeprocessor/CropView';
    import { onDestroy, onMount } from 'svelte';
    import { closeModal, showModal } from 'svelte-native';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { writable } from 'svelte/store';
    import CameraSettingsBottomSheet from '~/components/camera/CameraSettingsBottomSheet.svelte';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, PageData } from '~/models/OCRDocument';
    import {
        AUTO_SCAN_DELAY,
        AUTO_SCAN_DISTANCETHRESHOLD,
        AUTO_SCAN_DURATION,
        AUTO_SCAN_ENABLED,
        DOCUMENT_NOT_DETECTED_MARGIN,
        PREVIEW_RESIZE_THRESHOLD,
        QRCODE_RESIZE_THRESHOLD,
        TRANSFORMS_SPLIT
    } from '~/models/constants';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { getColorMatrix, hideLoading, showLoading } from '~/utils/ui';
    import { recycleImages } from '~/utils/utils.common';
    import { colors } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary } = $colors);

    const touchAnimationShrink: TouchAnimationOptions = {
        down: {
            scale: { x: 0.9, y: 0.9 },
            // backgroundColor: colorPrimary.darken(10),
            duration: 100,
            curve: CoreTypes.AnimationCurve.easeInOut
        },
        up: {
            scale: { x: 1, y: 1 },
            // backgroundColor: colorPrimary,
            duration: 100,
            curve: CoreTypes.AnimationCurve.easeInOut
        }
    };
    let page: NativeViewElementNode<Page>;
    let cameraView: NativeViewElementNode<CameraView>;
    let takPictureBtnCanvas: NativeViewElementNode<CanvasView>;
    let cropView: NativeViewElementNode<CropView>;
    let fullImageView: NativeViewElementNode<Img>;
    let smallImageView: NativeViewElementNode<Img>;

    const cameraOptionsStore = writable<{ aspectRatio: string; stretch: string; viewsize: string; pictureSize: string }>(
        JSON.parse(ApplicationSettings.getString('camera_settings', '{"aspectRatio":"4:3", "stretch":"aspectFit","viewsize":"limited", "pictureSize":null}'))
    );
    cameraOptionsStore.subscribe((newValue) => {
        ApplicationSettings.setString('camera_settings', JSON.stringify(newValue));
    });
    $: ({ aspectRatio, stretch, viewsize, pictureSize } = $cameraOptionsStore);
    $: DEV_LOG && console.log('aspectRatio', aspectRatio);
    $: DEV_LOG && console.log('pictureSize', pictureSize);

    // let aspectRatio = ApplicationSettings.getString('camera_aspectratio', '4:3');
    // let stretch = ApplicationSettings.getString('camera_stretch', 'aspectFit');
    // let collectionView: NativeViewElementNode<CollectionView>;

    export let modal = false;
    export let document: OCRDocument = null;
    // export let outputUri; // android only
    // export let forActivityResult = false; //android only
    const newDocument = !document;

    const contours: [number, number][][] = null;
    // let pages: ObservableArray<OCRPage>;
    let nbPages = 0;
    let takingPicture = false;
    // let croppedImage: string | ImageSource = null;
    let smallImage: string | ImageSource = null;
    let smallImageRotation: number = 0;
    // let croppedImageRotation: number = 0;
    const noDetectionMargin = ApplicationSettings.getNumber('documentNotDetectedMargin', DOCUMENT_NOT_DETECTED_MARGIN);
    const previewResizeThreshold = ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD);
    let colorType = ApplicationSettings.getString('defaultColorType', 'normal');
    let transforms = ApplicationSettings.getString('defaultTransforms', '').split(TRANSFORMS_SPLIT);
    let flashMode = ApplicationSettings.getNumber('defaultFlashMode', 0);
    let torchEnabled = false;
    let batchMode = ApplicationSettings.getBoolean('batchMode', false);
    let canSaveDoc = false;
    let cameraScreenRatio = 1;
    const showingFullScreenImage = false;
    let editing = false;

    const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) && !modal;
    $: ApplicationSettings.setBoolean('batchMode', batchMode);

    // interface Option {
    //     icon: string;
    //     id: string;
    //     text: string;
    // }
    async function showDocumentsList() {
        if (CARD_APP) {
            const CardsList = (await import('~/components/CardsList.svelte')).default;
            return navigate({ page: CardsList });
        } else {
            const DocumentsList = (await import('~/components/DocumentsList.svelte')).default;
            return navigate({ page: DocumentsList });
        }
    }

    async function goToView(doc: OCRDocument) {
        if (CARD_APP) {
            const page = (await import('~/components/view/CardView.svelte')).default;
            return navigate({
                page,
                props: {
                    document: doc
                }
            });
        } else {
            const page = (await import('~/components/view/DocumentView.svelte')).default;
            return navigate({
                page,
                props: {
                    document: doc
                }
            });
        }
    }

    async function showSettings() {
        try {
            const Settings = (await import('~/components/settings/Settings.svelte')).default;
            navigate({ page: Settings });
        } catch (error) {
            showError(error);
        }
    }
    // async function showOptions() {
    //     const result: { icon: string; id: string; text: string } = await showBottomSheet({
    //         parent: page,
    //         view: ActionSheet,
    //         props: {
    //             options: [
    //                 {
    //                     icon: 'mdi-cogs',
    //                     id: 'preferences',
    //                     text: l('preferences')
    //                 },
    //                 {
    //                     icon: 'mdi-image-plus',
    //                     id: 'image_import',
    //                     text: l('image_import')
    //                 }
    //             ]
    //         }
    //     });
    //     if (result) {
    //         switch (result.id) {
    //             case 'preferences':
    //                 prefs.openSettings();
    //                 break;
    //             case 'image_import':
    //                 try {
    //                     const doc = await importAndScanImage();
    //                     await goToView(doc);
    //                 } catch (err) {
    //                     console.error(err);
    //                 }

    //                 break;
    //         }
    //     }
    // }

    async function showCameraSettings() {
        const addedProps: any = __ANDROID__
            ? {
                  resolutions: cameraView.nativeView.getAllAvailablePictureSizes(),
                  currentResolution: cameraView.nativeView.getCurrentResolutionInfo()
              }
            : {};
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: CameraSettingsBottomSheet,
            backgroundOpacity: 0.8,
            skipCollapsedState: true,
            closeCallback: (result, bottomsheetComponent: CameraSettingsBottomSheet) => {
                transforms = bottomsheetComponent.transforms;
                colorType = bottomsheetComponent.colorType;
                ApplicationSettings.setString('defaultColorType', colorType);
                ApplicationSettings.setString('defaultTransforms', transforms.join(TRANSFORMS_SPLIT));
            },
            props: {
                cameraOptionsStore,
                colorType,
                transforms,
                ...addedProps
            }
        });
    }

    function onImageTap(e, item) {
        setCurrentImage(e.object.src);
    }

    let editingImage: ImageSource;

    async function processAndAddImage(image, autoScan = false) {
        try {
            showLoading(l('computing'));
            editingImage = new ImageSource(image);
            let quads = await getJSONDocumentCorners(editingImage, previewResizeThreshold * 1.5, 0);
            DEV_LOG && console.log('processAndAddImage', image, previewResizeThreshold, quads, autoScan);
            if (quads.length === 0) {
                let items = [
                    {
                        editingImage,
                        quads: [
                            [
                                [noDetectionMargin, noDetectionMargin],
                                [editingImage.width - noDetectionMargin, noDetectionMargin],
                                [editingImage.width - noDetectionMargin, editingImage.height - noDetectionMargin],
                                [noDetectionMargin, editingImage.height - noDetectionMargin]
                            ]
                        ] as [number, number][][]
                    }
                ];
                if (autoScan === false) {
                    const ModalImportImage = (await import('~/components/ModalImportImages.svelte')).default;
                    items = await showModal({
                        page: ModalImportImage,
                        animated: true,
                        fullscreen: true,
                        props: {
                            items
                        }
                    });
                    quads = items ? items[0].quads : undefined;
                }
            }
            if (quads?.length) {
                await addCurrentImageToDocument(image, quads);
                return true;
            }
            showSnack({ message: lc('no_document_found') });
            return false;
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            takingPicture = false;
            hideLoading();
        }
    }

    function pauseAutoScan() {
        if (__ANDROID__) {
            (processor as com.akylas.documentscanner.CustomImageAnalysisCallback).autoScanHandler.enabled = false;
        } else {
            // TODO: implement autoScan on iOS
        }
    }
    function resumeAutoScan() {
        if (__ANDROID__) {
            (processor as com.akylas.documentscanner.CustomImageAnalysisCallback).autoScanHandler.enabled = true;
        } else {
            // TODO: implement autoScan on iOS
        }
    }
    async function takePicture(autoScan = false) {
        if (takingPicture) {
            return;
        }
        takingPicture = true;
        if (autoScan) {
            pauseAutoScan();
        }
        try {
            DEV_LOG && console.log('takePicture');
            showLoading(l('capturing'));
            const { image, info } = await cameraView.nativeView.takePicture({
                savePhotoToDisk: false,
                captureMode: 1
            });
            const didAdd = await processAndAddImage(image, autoScan);
            DEV_LOG && console.log('takePicture done', image, didAdd);
            if (didAdd && !batchMode) {
                await saveCurrentDocument();
            }
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            takingPicture = false;
            if (autoScan) {
                resumeAutoScan();
            }
            hideLoading();
        }
    }

    function setTorchEnabled(enabled: boolean) {
        cameraView.nativeView.flashMode = enabled ? 'torch' : (flashMode as any);
    }
    function switchTorch() {
        if (cameraView) {
            const current = cameraView.nativeView.flashMode;
            torchEnabled = !(current === 'torch');
            setTorchEnabled(torchEnabled);
        }
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
        clearImages();
        document = null;
        nbPages = 0;
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        Application.off(Application.backgroundEvent, onBackground);
        Application.off(Application.foregroundEvent, onForeground);
    });
    function onNavigatedFrom() {
        DEV_LOG && console.log('onNavigatedFrom');
        if (torchEnabled) {
            setTorchEnabled(false);
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
        DEV_LOG && console.log('onNavigatedTo', !!cameraView);
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
        try {
            DEV_LOG && console.log('saveCurrentDocument', newDocument, !!document);
            if (!document) {
                document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
            } else {
                await document.addPages(pagesToAdd);
            }
            DEV_LOG && console.log('saveCurrentDocument1', newDocument, !!document);
            if (document) {
                await document.save({}, false);
                if (newDocument) {
                    documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
                    if (startOnCam) {
                        await goToView(document);
                    } else {
                        // we should already be in edit so closing should go back there
                    }
                }

                if (!startOnCam) {
                    closeModal(document);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    function onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (__ANDROID__) {
            if (editing) {
                toggleEditing();
                data.cancel = true;
            } else if (startOnCam) {
                if (document) {
                    // we need to clear the current document which was not saved
                    //especially memory images
                    document.removeFromDisk();
                    document = null;
                }
            }
        }
    }

    function clearImages() {
        DEV_LOG && console.log('clearImages');
        // if (editingImage) {
        const toRelease = [editingImage, smallImage].concat(pagesToAdd ? pagesToAdd.map((d) => d.image) : []);
        editingImage = null;
        smallImage = null;
        recycleImages(toRelease);
    }
    const pagesToAdd: PageData[] = [];

    async function addCurrentImageToDocument(sourceImage, quads) {
        try {
            if (!editingImage) {
                return;
            }
            const strTransforms = transforms.join(',');
            DEV_LOG && console.log('addCurrentImageToDocument', editingImage, quads, processor);
            let images = await cropDocument(editingImage, quads, strTransforms);
            let qrcode;
            let colors;
            if (CARD_APP) {
                [qrcode, colors] = await Promise.all([detectQRCode(images[0], { resizeThreshold: QRCODE_RESIZE_THRESHOLD }), getColorPalette(images[0])]);
                DEV_LOG && console.log('qrcode and colors', qrcode, colors);
            }
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                pagesToAdd.push({
                    image,
                    crop: quads[index],
                    colorType,
                    colors,
                    qrcode,
                    transforms: strTransforms,
                    sourceImage,
                    width: __ANDROID__ ? image.getWidth() : image.size.width,
                    height: __ANDROID__ ? image.getHeight() : image.size.height,
                    rotation: editingImage.rotationAngle
                });
            }

            images = null;
            nbPages = pagesToAdd.length;
            startPreview();
            const lastPage = pagesToAdd[pagesToAdd.length - 1];
            setCurrentImage(new ImageSource(lastPage.image), lastPage.rotation, true);
        } catch (error) {
            showError(error);
        }
    }

    async function setCurrentImage(image, rotation = 0, needAnimateBack = false) {
        // const imageView = fullImageView.nativeElement;
        // const sImageView = smallImageView.nativeElement;
        // imageView.originX = 0.5;
        // imageView.originY = 0.5;
        // if (!image) {
        //     showingFullScreenImage = false;
        //     await imageView.animate({
        //         duration: 200,
        //         opacity: 0,
        //         scale: {
        //             x: 0.5,
        //             y: 0.5
        //         }
        //     });
        //     // croppedImage = image;
        //     // croppedImageRotation = rotation;
        // } else if (image) {
        smallImage = image;
        smallImageRotation = rotation;
        // smallImageView.nativeElement.opacity = 0;
        // showingFullScreenImage = true;
        // // croppedImage = image;
        // // croppedImageRotation = rotation;
        // imageView.translateX = 0;
        // imageView.translateY = 0;
        // imageView.opacity = 0;
        // imageView.scaleX = 0.5;
        // imageView.scaleY = 0.5;
        // console.log('animating', needAnimateBack);
        // await imageView.animate({
        //     duration: 200,
        //     opacity: 1,
        //     scale: {
        //         x: 1,
        //         y: 1
        //     }
        // });
        // if (needAnimateBack) {
        //     imageView.originX = 0;
        //     imageView.originY = 1;
        //     const position = sImageView.getLocationOnScreen();
        //     const size = { width: sImageView.getMeasuredWidth(), height: sImageView.getMeasuredHeight() };
        //     const ratio = imageView.getMeasuredWidth() / imageView.getMeasuredHeight();
        //     const scaleX = (ratio * size.height) / imageView.getMeasuredWidth();
        //     const scaleY = size.height / imageView.getMeasuredHeight();
        //     console.log('animateBack', showingFullScreenImage, ratio, scaleX, scaleY);
        //     await imageView.animate({
        //         duration: 400,
        //         scale: {
        //             x: scaleX,
        //             y: scaleY
        //         },

        //         translate: {
        //             x: position.x + Utils.layout.toDeviceIndependentPixels((size.width - ratio * size.height) / 2),
        //             y: -(Screen.mainScreen.heightDIPs - position.y - Utils.layout.toDeviceIndependentPixels(size.height))
        //         }
        //     });
        //     imageView.opacity = 0;
        // }
        // smallImageView.nativeElement.opacity = 1;
        // showingFullScreenImage = false;
        // }
    }
    $: canSaveDoc = nbPages > 0;

    function onCameraLayoutChanged() {
        cameraScreenRatio = cameraView.nativeElement.getMeasuredWidth() / cameraView.nativeElement.getMeasuredHeight();
    }
    function focusCamera(e) {
        cameraView.nativeElement.focusAtPoint(e.getX(), e.getY());
    }

    // TODO: implement autoScan on iOS
    let autoScan = ApplicationSettings.getBoolean('autoScan', AUTO_SCAN_ENABLED);

    function applyAutoScan(value: boolean) {
        DEV_LOG && console.log('applyAutoScan', value);
        if (value) {
            if (__ANDROID__) {
                const context = Utils.android.getApplicationContext();
                const nCropView = cropView.nativeView.nativeViewProtected;
                const AutoScanHandler = com.akylas.documentscanner.AutoScanHandler;
                DEV_LOG && console.log('creating autoScan handler', value);
                const autoScanHandler = new AutoScanHandler(
                    context,
                    nCropView,
                    new AutoScanHandler.OnAutoScan({
                        onAutoScan: (result) => {
                            DEV_LOG && console.log('onAutoScan', result);
                            takePicture(true);
                        }
                    })
                );
                autoScanHandler.distanceThreshod = ApplicationSettings.getNumber('autoScan_distanceThreshold', AUTO_SCAN_DISTANCETHRESHOLD);
                autoScanHandler.autoScanDuration = ApplicationSettings.getNumber('autoScan_autoScanDuration', AUTO_SCAN_DURATION);
                autoScanHandler.preAutoScanDelay = ApplicationSettings.getNumber('autoScan_preAutoScanDelay', AUTO_SCAN_DELAY);
                processor.autoScanHandler = autoScanHandler;
            } else {
                // TODO: implement autoScan on iOS
            }
        } else {
            if (__ANDROID__) {
                processor.autoScanHandler = null;
            } else {
                // TODO: implement autoScan on iOS
            }
        }
    }
    function toggleAutoScan(apply = true) {
        autoScan = !autoScan;
        ApplicationSettings.setBoolean('autoScan', autoScan);
        if (apply) {
            applyAutoScan(autoScan);
        }
    }
    let processor;
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
            applyAutoScan(autoScan);
            processor['previewResizeThreshold'] = previewResizeThreshold;
        } catch (error) {
            console.error(error, error.stack);
        }
    }

    function onFinishEditing() {
        toggleEditing();
    }

    function toggleEditing() {
        editing = !editing;
        if (torchEnabled) {
            setTorchEnabled(!editing);
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

    let borderStroke = 3;
    const borderPaint = new Paint();
    borderPaint.strokeWidth = borderStroke;
    borderPaint.style = Style.STROKE;
    borderPaint.color = 'white';
    $: {
        borderStroke = autoScan ? 4 : 3;
        borderPaint.strokeWidth = borderStroke;
        if (takPictureBtnCanvas?.nativeView) {
            takPictureBtnCanvas.nativeView.invalidate();
            if (autoScan) {
                // without the timeout it wont start
                setTimeout(() => {
                    takPictureBtnCanvas?.nativeView
                        .animate({
                            curve: CoreTypes.AnimationCurve.linear,
                            duration: 1500,
                            rotate: 360,
                            iterations: Number.POSITIVE_INFINITY
                        })
                        .catch((err) => console.error(err, err.stack));
                }, 300);
            } else {
                takPictureBtnCanvas.nativeView.cancelAllAnimations();
            }
        }
    }
    function drawTakePictureBtnBorder({ canvas }: { canvas: Canvas }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        if (autoScan) {
            const radius = Math.min(w, h) - borderStroke / 2;
            canvas.drawArc(0, 0, radius, radius, 0, 90, false, borderPaint);
        } else {
            const radius = Math.min(w, h) / 2 - borderStroke / 2;
            canvas.drawCircle(w / 2, h / 2, radius, borderPaint);
        }
    }
    let cameraOpened = false;
    function onCameraOpen({ object }: { object: CameraView }) {
        console.log('onCameraOpen', object);
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

<page bind:this={page} id="camera" actionBarHidden={true} statusBarColor="black" statusBarStyle="dark" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout backgroundColor="black" paddingBottom={30} rows="auto,*,auto,auto">
        <cameraView
            bind:this={cameraView}
            {aspectRatio}
            autoFocus={true}
            enablePinchZoom={true}
            {flashMode}
            {pictureSize}
            rowSpan={viewsize === 'full' ? 4 : 2}
            {stretch}
            on:cameraOpen={onCameraOpen}
            on:layoutChanged={onCameraLayoutChanged}
            on:loaded={applyProcessor}
            on:tap={focusCamera} />
        <cropview bind:this={cropView} colors={[colorPrimary]} fillAlpha={120} rowSpan="2" strokeWidth={3} />
        <!-- <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} /> -->
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true}>
            <mdbutton class="actionBarButton" defaultVisualState="black" text="mdi-file-document" variant="text" visibility={startOnCam ? 'visible' : 'collapse'} on:tap={showDocumentsList} />
            <mdbutton class="actionBarButton" defaultVisualState="black" text="mdi-cogs" variant="text" visibility={startOnCam ? 'visible' : 'collapse'} on:tap={showSettings} />
        </CActionBar>

        <!-- <gridlayout padding="10" row={1} rows="*,auto"> -->
        <stacklayout horizontalAlignment="left" orientation="horizontal" row={2} verticalAlignment="center">
            <mdbutton class="icon-btn" color="white" text={getFlashIcon(flashMode)} variant="text" on:tap={() => (flashMode = (flashMode + 1) % 4)} />
            <mdbutton class="icon-btn" color={torchEnabled ? colorPrimary : 'white'} text="mdi-flashlight" variant="text" on:tap={switchTorch} />
            <mdbutton class="icon-btn" color="white" text="mdi-camera-flip" variant="text" on:tap={toggleCamera} />
        </stacklayout>
        <mdbutton
            class="icon-btn"
            color="white"
            horizontalAlignment="right"
            isEnabled={cameraOpened}
            row={2}
            text="mdi-tune"
            variant="text"
            visibility={startOnCam ? 'collapse' : 'visible'}
            on:tap={showCameraSettings} />

        <gridlayout columns="60,*,auto,*,60" row={3}>
            <mdbutton
                class="icon-btn"
                color="white"
                horizontalAlignment="left"
                marginLeft={10}
                ripple-color="white"
                text={batchMode ? 'mdi-image-multiple' : 'mdi-image'}
                variant="text"
                verticalAlignment="center"
                on:tap={() => (batchMode = !batchMode)} />

            <image
                bind:this={smallImageView}
                borderColor="white"
                col={1}
                colorMatrix={getColorMatrix(colorType)}
                height={60}
                horizontalAlignment="center"
                imageRotation={smallImageRotation}
                src={smallImage}
                stretch="aspectFit"
                verticalAlignment="center"
                width={60} />
            <gridlayout col={2} height={70} horizontalAlignment="center" opacity={takingPicture ? 0.6 : 1} verticalAlignment="center" width={70}>
                <canvasView bind:this={takPictureBtnCanvas} on:draw={drawTakePictureBtnBorder}> </canvasView>
                <gridlayout
                    backgroundColor={colorPrimary}
                    borderRadius="50%"
                    height={54}
                    horizontalAlignment="center"
                    ignoreTouchAnimation={false}
                    touchAnimation={touchAnimationShrink}
                    width={54}
                    on:tap={() => takePicture()}
                    on:longPress={toggleAutoScan} />
                <label color="white" fontSize={20} text={nbPages + ''} textAlignment="center" verticalAlignment="middle" visibility={nbPages ? 'visible' : 'hidden'} />
            </gridlayout>

            <mdbutton
                class="icon-btn"
                col={4}
                color="white"
                elevation={0}
                horizontalAlignment="right"
                ripple-color="white"
                text="mdi-check"
                variant="text"
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

        <!-- <mdbutton
                row={1}
                visibility={pauseProcessing ? 'visible' : 'hidden'}
                text="reset"
                on:tap={() => (pauseProcessing = !pauseProcessing)}
                verticalAlignment="bottom"
                horizontalAlignment="left"
            /> -->
        <!-- </gridlayout> -->
        <!-- <CropEditView
            croppedImagePath={croppedImage}
            {editingImage}
            quad={currentQuad}
            rowSpan={4}
            visibility={editing ? 'visible' : 'collapse'}
            bind:croppedImageRotation
            bind:colorType
            on:finished={onFinishEditing} /> -->
    </gridlayout>
</page>
