<script lang="ts">
    import { request } from '@nativescript-community/perms';
    import { CameraView } from '@nativescript-community/ui-cameraview';
    import { Img } from '@nativescript-community/ui-image';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { AndroidActivityBackPressedEventData, Application, ApplicationSettings, CoreTypes, File, ObservableArray, Page, TouchAnimationOptions, Utils } from '@nativescript/core';
    import { ImageSource } from '@nativescript/core/image-source';
    import dayjs from 'dayjs';
    import { onDestroy, onMount } from 'svelte';
    import { closeModal, showModal } from 'svelte-native';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { CropView } from 'plugin-nativeprocessor/CropView';
    import { l, lc, onLanguageChanged } from '~/helpers/locale';
    import { OCRDocument, OCRPage, PageData } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { getColorMatrix, hideLoading, importAndScanImage, showLoading, timeout } from '~/utils/ui';
    import { colors } from '~/variables';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import CropEditView from './CropEditView.svelte';
    import DocumentsList from './DocumentsList.svelte';
    import { loadImage, recycleImages } from '~/utils/utils.common';
    import { cropDocument, getJSONDocumentCorners } from 'plugin-nativeprocessor';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import CameraSettingsBottomSheet from '~/components/CameraSettingsBottomSheet.svelte';

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
    let cameraPreview: NativeViewElementNode<CameraView>;
    let cropView: NativeViewElementNode<CropView>;
    let fullImageView: NativeViewElementNode<Img>;
    let smallImageView: NativeViewElementNode<Img>;
    // let collectionView: NativeViewElementNode<CollectionView>;

    export let modal = false;
    export let document: OCRDocument = null;
    const newDocument = !document;

    const contours: [number, number][][] = null;
    let pages: ObservableArray<OCRPage>;
    let nbPages = 0;
    let takingPicture = false;
    let croppedImagePath: string = null;
    let smallImagePath: string = null;
    let croppedImageRotation: number = 0;
    let colorType = ApplicationSettings.getString('defaultColorType', 'normal');
    let transforms = ApplicationSettings.getString('defaultTransforms', '').split(',');
    let flashMode = ApplicationSettings.getNumber('defaultFlashMode', 0);
    let torchEnabled = false;
    let batchMode = ApplicationSettings.getBoolean('batchMode', false);
    let canSaveDoc = false;
    let cameraScreenRatio = 1;
    let showingFullScreenImage = false;
    let editing = false;

    const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) && !modal;
    $: ApplicationSettings.setBoolean('batchMode', batchMode);

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
                        const doc = await importAndScanImage();
                        const page = (await import('~/components/PDFView.svelte')).default;
                        navigate({
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

    async function showCameraSettings() {
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: CameraSettingsBottomSheet,
            closeCallback: (result, bottomsheetComponent: CameraSettingsBottomSheet) => {
                transforms = bottomsheetComponent.transforms;
                colorType = bottomsheetComponent.colorType;
                ApplicationSettings.setString('defaultColorType', colorType);
                ApplicationSettings.setString('defaultTransforms', transforms.join(','));
            },
            props: {
                colorType,
                transforms
            }
        });
    }

    function onImageTap(e, item) {
        setCurrentImage(e.object.src);
    }

    let editingImage: ImageSource;
    // let quads;
    let currentQuad;

    async function processAndAddImage(image) {
        // if (!File.exists(imagePath)) {
        //     console.error('cant find image', imagePath);
        //     return;
        // }
        try {
            stopPreview();
            showLoading(l('computing'));
            // editingImage = await loadImage(imagePath);
            editingImage = new ImageSource(image);
            let quads = await getJSONDocumentCorners(editingImage, 300, 0);

            if (quads.length === 0) {
                const ModalImportImage = require('~/components/ModalImportImage.svelte').default;
                quads = await showModal({
                    page: ModalImportImage,
                    animated: true,
                    fullscreen: true,
                    props: {
                        editingImage,
                        quads: [
                            [
                                [100, 100],
                                [editingImage.width - 100, 100],
                                [editingImage.width - 100, editingImage.height - 100],
                                [100, editingImage.height - 100]
                            ]
                        ]
                    }
                });
            }
            if (quads?.length) {
                await addCurrentImageToDocument(image, quads);
            }
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            takingPicture = false;
            startPreview();
            hideLoading();
        }
    }
    async function takePicture() {
        if (takingPicture) {
            return;
        }
        takingPicture = true;
        try {
            // const start = Date.now();
            // const available = cameraPreview.nativeView.getAllAvailablePictureSizes();
            // console.log('available', available.length);
            // const test = available[0];
            // console.log('max size', test.width, test.height);
            showLoading(l('capturing'));
            const { image, info } = await cameraPreview.nativeView.takePicture({
                savePhotoToDisk: false,
                // pictureSize: { width: test.width, height: test.height },
                captureMode: 1
                // captureMode: batchMode ? 1 : 0
            });
            await processAndAddImage(image);
            if (!batchMode) {
                await saveCurrentDocument();
            }
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            takingPicture = false;
            hideLoading();
        }
    }

    function setTorchEnabled(enabled: boolean) {
        cameraPreview.nativeView.flashMode = enabled ? 'torch' : (flashMode as any);
    }
    function switchTorch() {
        if (cameraPreview) {
            const current = cameraPreview.nativeView.flashMode;
            torchEnabled = !(current === 'torch');
            setTorchEnabled(torchEnabled);
        }
    }
    function toggleCamera() {
        cameraPreview.nativeView.toggleCamera();
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
        // documentsService.start().catch(showError);
        // switchTorch();
    });
    onDestroy(() => {
        clearImages();
        document = null;
        croppedImageRotation = 0;
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
            console.log('startPreview');
            cameraPreview?.nativeView.startPreview();
        }
    }
    function stopPreview() {
        if (previewStarted) {
            previewStarted = false;
            console.log('stopPreview');
            cameraPreview?.nativeView.stopPreview();
            if (cropView?.nativeView) {
                cropView.nativeView.quads = null;
            }
        }
    }
    function onNavigatedTo() {
        DEV_LOG && console.log('onNavigatedTo', !!cameraPreview);
        (async () => {
            try {
                startPreview();
            } catch (error) {
                console.error(error, error.stack);
            }
        })();
    }
    function onBackground() {
        DEV_LOG && console.log('onBackground', !!cameraPreview);
        stopPreview();
    }
    function onForeground() {
        DEV_LOG && console.log('onForeground', !!cameraPreview);
        startPreview();
    }
    async function saveCurrentDocument() {
        try {
            DEV_LOG && console.log('saveCurrentDocument', newDocument, !!document);
            if (document) {
                await document.save();
                if (newDocument) {
                    documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
                    if (startOnCam) {
                        // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
                        const page = (await import('~/components/PDFView.svelte')).default;
                        navigate({
                            page,
                            // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                            props: {
                                document
                            }
                        });
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
        // if (editingImage) {
        recycleImages(editingImage);
        editingImage = null;
        // }
        smallImagePath = null;
        croppedImagePath = null;
    }

    async function addCurrentImageToDocument(sourceImage, quads) {
        try {
            if (!editingImage) {
                return;
            }
            const strTransforms = transforms.join(',');
            DEV_LOG && console.log('addCurrentImageToDocument', editingImage, quads, processor);
            let images = await cropDocument(editingImage, quads, strTransforms);
            const pagesToAdd: PageData[] = [];
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                pagesToAdd.push({
                    image,
                    crop: quads[index],
                    colorType,
                    transforms: strTransforms,
                    sourceImage,
                    width: __ANDROID__ ? image.getWidth() : image.size.width,
                    height: __ANDROID__ ? image.getHeight() : image.size.height,
                    rotation: editingImage.rotationAngle
                });
            }

            //TODO:
            if (!document) {
                document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
            } else {
                await document.addPages(pagesToAdd);
            }
            if (!pages) {
                pages = document.getObservablePages();
            }
            recycleImages(images);
            images = null;
            nbPages = pages.length;
            startPreview();
            // if (editing) {
            //     toggleEditing();
            // }
            const lastPage = pages.getItem(pages.length - 1);
            currentQuad = lastPage.crop;
            setCurrentImage(lastPage.getImagePath(), lastPage.rotation, true);
        } catch (error) {
            showError(error);
        }
    }

    async function setCurrentImage(imagePath, rotation = 0, needAnimateBack = false) {
        const imageView = fullImageView.nativeElement;
        imageView.originX = 0.5;
        imageView.originY = 0.5;
        console.log('imagePath', imagePath, croppedImagePath);
        if (!imagePath && croppedImagePath) {
            showingFullScreenImage = false;
            await imageView.animate({
                duration: 200,
                opacity: 0,
                scale: {
                    x: 0.5,
                    y: 0.5
                }
            });
            croppedImagePath = imagePath;
            croppedImageRotation = rotation;
        } else if (imagePath) {
            showingFullScreenImage = !needAnimateBack;
            croppedImagePath = imagePath;
            croppedImageRotation = rotation;
            imageView.opacity = 0;
            imageView.scaleX = 0.5;
            imageView.scaleY = 0.5;
            await imageView.animate({
                duration: 200,
                opacity: 1,
                scale: {
                    x: 1,
                    y: 1
                }
            });
            if (needAnimateBack) {
                imageView.originX = 0;
                imageView.originY = 1;
                const ratio = imageView.getMeasuredWidth() / imageView.getMeasuredHeight();
                const scaleX = (ratio * smallImageView.nativeElement.getMeasuredHeight()) / imageView.getMeasuredWidth();
                const scaleY = smallImageView.nativeElement.getMeasuredHeight() / imageView.getMeasuredHeight();
                await imageView.animate({
                    duration: 400,
                    opacity: 1,
                    scale: {
                        x: scaleX,
                        y: scaleY
                    },

                    translate: {
                        x: Utils.layout.toDeviceIndependentPixels((smallImageView.nativeElement.getMeasuredWidth() - ratio * smallImageView.nativeElement.getMeasuredHeight()) / 2),
                        y: 0
                    }
                });
                imageView.opacity = 0;
            }
            smallImagePath = imagePath;
        }
    }
    $: canSaveDoc = !!document;

    function onCameraLayoutChanged() {
        cameraScreenRatio = cameraPreview.nativeElement.getMeasuredWidth() / cameraPreview.nativeElement.getMeasuredHeight();
    }
    function focusCamera(e) {
        DEV_LOG && console.log('focusCamera', e.getX(), e.getY(), Object.keys(e));
        cameraPreview.nativeElement.focusAtPoint(e.getX(), e.getY());
    }
    function onCollectionLayoutChanged(e) {
        // console.log('onCameraLayoutChanged', e.object.getMeasuredWidth(), e.object.getMeasuredHeight(), e.object.getMeasuredWidth() / e.object.getMeasuredHeight());
    }
    let processor;
    async function applyProcessor() {
        if (processor) {
            return;
        }
        try {
            if (__ANDROID__) {
                processor = new com.akylas.documentscanner.CustomImageAnalysisCallback(Utils.android.getApplicationContext(), cropView.nativeView.nativeViewProtected);
                cameraPreview.nativeView.processor = processor;
            } else {
                processor = OpencvDocumentProcessDelegate.alloc().initWithCropView(cropView.nativeView.nativeViewProtected);
                cameraPreview.nativeView.processor = processor;
            }
            // if (documentsService.started) {
            //     processAndAddImage('/storage/9016-4EF8/Android/data/com.akylas.documentscanner/files/data/1696507798228/1696507798273_0/PIC_20231005140955.jpg');
            //     // toggleEditing();
            // } else {
            //     documentsService.once('started', () => {
            //         processAndAddImage('/storage/9016-4EF8/Android/data/com.akylas.documentscanner/files/data/1696507798228/1696507798273_0/PIC_20231005140955.jpg');
            //         // toggleEditing();
            //     });
            // }
        } catch (error) {
            console.error(error, error.stack);
        }
    }

    function onFinishEditing() {
        toggleEditing();
    }
    function onCroppedImageChanged() {
        //current cropped image was modified
        smallImageView?.nativeView?.updateImageUri();
    }

    function toggleEditing() {
        editing = !editing;
        console.log('toggleEditing');
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
</script>

<page bind:this={page} id="camera" actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout rows="auto,*">
        <cameraView bind:this={cameraPreview} autoFocus={true} enablePinchZoom={true} {flashMode} rowSpan="2" on:layoutChanged={onCameraLayoutChanged} on:loaded={applyProcessor} />
        <cropview bind:this={cropView} colors={[colorPrimary]} fillAlpha={120} rowSpan="2" strokeWidth={3} />
        <!-- <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} /> -->
        <CActionBar backgroundColor="transparent" modalWindow={true} title={null}>
            <mdbutton class="actionBarButton" text="mdi-file-document" variant="text" visibility={startOnCam ? 'visible' : 'collapsed'} on:tap={showDocumentsList} />
            <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" visibility={startOnCam ? 'visible' : 'collapsed'} on:tap={showOptions} />
            <mdbutton class="actionBarButton" text="mdi-tune" variant="text" visibility={startOnCam ? 'collapsed' : 'visible'} on:tap={showCameraSettings} />
        </CActionBar>

        <gridlayout padding="10" row={1} rows="*,auto">
            <gridlayout>
                <stacklayout horizontalAlignment="left" verticalAlignment="center">
                    <mdbutton class="icon-btn" color="white" text={getFlashIcon(flashMode)} variant="text" on:tap={() => (flashMode = (flashMode + 1) % 4)} />
                    <mdbutton class="icon-btn" color={torchEnabled ? colorPrimary : 'white'} text="mdi-flashlight" variant="text" on:tap={switchTorch} />
                    <mdbutton class="icon-btn" color="white" text="mdi-camera-flip" variant="text" on:tap={toggleCamera} />
                </stacklayout>
                <mdbutton
                    class="icon-btn"
                    color="white"
                    horizontalAlignment="left"
                    text={batchMode ? 'mdi-image-multiple' : 'mdi-image'}
                    variant="text"
                    verticalAlignment="bottom"
                    on:tap={() => (batchMode = !batchMode)} />
            </gridlayout>

            <image
                bind:this={smallImageView}
                colorMatrix={getColorMatrix(colorType)}
                height={80}
                horizontalAlignment="left"
                imageRotation={croppedImageRotation}
                rowSpan={2}
                src={smallImagePath}
                stretch="aspectFit"
                verticalAlignment="bottom"
                width={80}
                on:tap={toggleEditing} />

            <image
                bind:this={fullImageView}
                colorMatrix={getColorMatrix(colorType)}
                imageRotation={croppedImageRotation}
                isUserInteractionEnabled={showingFullScreenImage}
                rowSpan={2}
                src={croppedImagePath}
                stretch="aspectFit"
                visibility={showingFullScreenImage ? 'visible' : 'hidden'}
                on:tap={() => setCurrentImage(null)} />

            <gridlayout
                borderColor="white"
                borderRadius="50%"
                borderWidth={3}
                height={90}
                horizontalAlignment="center"
                marginBottom={10}
                opacity={takingPicture ? 0.6 : 1}
                row={1}
                verticalAlignment="bottom"
                width={90}>
                <gridlayout
                    backgroundColor={colorPrimary}
                    borderRadius="50%"
                    height={74}
                    horizontalAlignment="center"
                    ignoreTouchAnimation={false}
                    touchAnimation={touchAnimationShrink}
                    width={74}
                    on:tap={takePicture} />
                <label color="white" fontSize={20} text={nbPages + ''} textAlignment="center" verticalAlignment="middle" visibility={nbPages ? 'visible' : 'hidden'} />
            </gridlayout>
            <!-- <mdbutton
                row={1}
                visibility={pauseProcessing ? 'visible' : 'hidden'}
                text="reset"
                on:tap={() => (pauseProcessing = !pauseProcessing)}
                verticalAlignment="bottom"
                horizontalAlignment="left"
            /> -->
            <mdbutton
                class="fab"
                elevation={0}
                horizontalAlignment="right"
                rippleColor="white"
                row={1}
                text="mdi-check"
                variant="text"
                verticalAlignment="center"
                visibility={canSaveDoc ? 'visible' : 'hidden'}
                on:tap={() => saveCurrentDocument()} />
        </gridlayout>
        <CropEditView
            {croppedImagePath}
            {editingImage}
            quad={currentQuad}
            rowSpan={2}
            visibility={editing ? 'visible' : 'collapsed'}
            bind:croppedImageRotation
            bind:colorType
            on:finished={onFinishEditing}
            on:croppedImageChanged={onCroppedImageChanged} />
    </gridlayout>
</page>
