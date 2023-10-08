<script lang="ts">
    import { request } from '@nativescript-community/perms';
    import { CameraView } from '@nativescript-community/ui-cameraview';
    import { Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import {
        AndroidActivityBackPressedEventData,
        Application,
        ApplicationSettings,
        CoreTypes,
        File,
        ObservableArray,
        Page,
        TouchAnimationOptions,
        Utils
    } from '@nativescript/core';
    import { ImageSource } from '@nativescript/core/image-source';
    import dayjs from 'dayjs';
    import { onDestroy, onMount } from 'svelte';
    import { closeModal, showModal } from 'svelte-native';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import { CropView } from '~/CropView';
    import { l, lc, onLanguageChanged } from '~/helpers/locale';
    import { OCRDocument, OCRPage, PageData } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { getColorMatrix, hideLoading, importAndScanImage, showLoading } from '~/utils/ui';
    import { accentColor, primaryColor } from '~/variables';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import CropEditPage from './CropEditPage.svelte';
    import DocumentsList from './DocumentsList.svelte';

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
    let cropView: NativeViewElementNode<CropView>;
    let fullImageView: NativeViewElementNode<Img>;
    let smallImageView: NativeViewElementNode<Img>;
    // let collectionView: NativeViewElementNode<CollectionView>;

    export let modal = false;
    export let document: OCRDocument;
    let newDocument = !document;

    let contours: [number, number][][] = null;
    let pages: ObservableArray<OCRPage>;
    let nbPages = 0;
    let takingPicture = false;
    let croppedImagePath: string = null;
    let smallImagePath: string = null;
    let croppedImageRotation: number = 0;
    let colorType = ApplicationSettings.getString('defaultColorType', null);
    let flashMode = 0;
    let torchEnabled = false;
    let batchMode = ApplicationSettings.getBoolean('batchMode', false);
    let canSaveDoc = false;
    let cameraScreenRatio = 1;
    let showingFullScreenImage = false;
    let editing = false;

    const startOnCam = ApplicationSettings.getBoolean('startOnCam', START_ON_CAM) && !modal;
    $: ApplicationSettings.setBoolean('batchMode', batchMode);

    onLanguageChanged((lang) => {
        console.log('refresh triggered by lang change');
    });

    // interface Option {
    //     icon: string;
    //     id: string;
    //     text: string;
    // }
    async function showDocumentsList() {
        return navigate({ page: DocumentsList as any });
    }

    async function showOptions() {
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: ActionSheet as any,
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
                        const doc = await importAndScanImage();
                        const page = (await import('~/components/PDFView.svelte')).default;
                        await navigate({
                            page: page as any,
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

    function onImageTap(e, item) {
        setCurrentImage(e.object.src);
    }

    let editingImage: ImageSource;
    // let quads;
    let currentQuad;

    async function processAndAddImage(imagePath) {
        if (!File.exists(imagePath)) {
            console.error('cant find image', imagePath);
            return;
        }
        try {
            stopPreview();
            showLoading(l('computing'));
            editingImage = await ImageSource.fromFile(imagePath);
            let corners;
            if (__ANDROID__) {
                corners = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.getJSONDocumentCorners(editingImage.android, 600, 0);
            }
            const quads = JSON.parse(corners);
            console.log('processAndAddImage', imagePath, quads);

            if (quads.length === 0) {
                showSnack({ message: lc('no_document_found') });
                startPreview();
                clearImages();
                return;
            }
            addCurrentImageToDocument(imagePath, quads);
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
            startPreview();
        } finally {
            takingPicture = false;
            hideLoading();
        }
    }
    async function takePicture() {
        console.log('takePicture', takingPicture);
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
            const file: File = (await cameraPreview.nativeView.takePicture({
                // savePhotoToDisk: true,
                // pictureSize: { width: test.width, height: test.height },
                captureMode: 0
                // captureMode: batchMode ? 1 : 0
            })) as any;
            await processAndAddImage(file.path);
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
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
        onNavigatedTo();
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        Application.on(Application.backgroundEvent, onBackground);
        Application.on(Application.foregroundEvent, onForeground);
        console.log('onMount', documentsService.started);

        if (documentsService.started) {
            startPreview();
        } else {
            documentsService.once('started', startPreview);
        }
        // documentsService.start().catch(showError);
        // switchTorch();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        Application.off(Application.backgroundEvent, onBackground);
        Application.off(Application.foregroundEvent, onForeground);
    });
    function onNavigatedFrom() {
        DEV_LOG && console.log('onNavigatedFrom');
        if (torchEnabled) {
            switchTorch();
        }
        stopPreview();
        if (document) {
            // we need to clear the current document which was not saved
            //especially memory images
            document.removeFromDisk();
            document = null;
        }
    }
    function startPreview() {
        console.log('startPreview');
        cameraPreview?.nativeView.startPreview();
    }
    function stopPreview() {
        cameraPreview?.nativeView.stopPreview();
        if (cropView?.nativeView) {
            cropView.nativeView.quads = null;
        }
    }
    function onNavigatedTo() {
        DEV_LOG && console.log('onNavigatedTo', !!cameraPreview);
        (async () => {
            try {
                const result = await request('camera');
                console.log('result', result);
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
    $: DEV_LOG && console.log('flashMode', flashMode);
    async function saveCurrentDocument() {
        DEV_LOG && console.log('saveCurrentDocument', newDocument);
        if (document) {
            document.save();
            if (newDocument && startOnCam) {
                    documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
                    // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
                    const page = (await import('~/components/PDFView.svelte')).default;
                    navigate({
                        page: page as any,
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
            clearImages();
            document = null;
            croppedImageRotation = 0;
            nbPages = 0;
            pages = new ObservableArray([]);
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
        if (editingImage) {
            if (__ANDROID__) {
                editingImage?.android.recycle();
            }
            editingImage = null;
        }
        smallImagePath = null;
        croppedImagePath = null;
    }

    async function addCurrentImageToDocument(sourceImagePath, quads) {
        try {
            if (!editingImage) {
                return;
            }
            console.log('addCurrentImageToDocument', editingImage, quads, processor);
            let images /* : android.graphics.Bitmap[] */;
            if (__ANDROID__) {
                images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify(quads));
            }
            console.log('images', images, images.length);
            const pagesToAdd: PageData[] = [];
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                pagesToAdd.push({
                    image,
                    crop: quads[index],
                    sourceImagePath,
                    width: __ANDROID__ ? image.getWidth() : image.size.width,
                    height: __ANDROID__ ? image.getHeight() : image.size.height,
                    rotation: editingImage.rotationAngle
                });
            }
            if (!document) {
                document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
            } else {
                await document.addPages(pagesToAdd);
            }
            if (!pages) {
                pages = document.getObservablePages();
            }
            if (__ANDROID__) {
                for (let index = 0; index < images.length; index++) {
                    images[index].recycle();
                }
            }
            images = null;
            nbPages = pages.length;
            console.log('addPages done', nbPages, pages.getItem(pages.length - 1));
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
                console.log('applyProcessor');
                //@ts-ignore
                processor = new com.akylas.documentscanner.CustomImageAnalysisCallback(Utils.android.getApplicationContext(), cropView.nativeView.nativeViewProtected);
                cameraPreview.nativeView.processor = processor;
            } else {
                //@ts-ignore
                processor = OpencvDocumentProcessDelegate.alloc().initWithCropView(cropView.nativeView.nativeViewProtected);
                cameraPreview.nativeView.processor = processor;
            }
            if (documentsService.started) {
                processAndAddImage('/storage/9016-4EF8/Android/data/com.akylas.documentscanner/files/data/1696507798228/1696507798273_0/PIC_20231005140955.jpg');
                // toggleEditing();
            } else {
                documentsService.once('started', () => {
                    processAndAddImage('/storage/9016-4EF8/Android/data/com.akylas.documentscanner/files/data/1696507798228/1696507798273_0/PIC_20231005140955.jpg');
                    // toggleEditing();
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    function onFinishEditing() {
        console.log('onFinishEditing', editing);
        toggleEditing();
    }
    function onCroppedImageChanged() {
        //current cropped image was modified
        smallImageView?.nativeView?.updateImageUri();
    }

    function toggleEditing() {
        editing = !editing;
        if (torchEnabled) {
            switchTorch();
        }
        if (editing) {
            stopPreview();
        } else {
            startPreview();
        }
    }
</script>

<page bind:this={page} actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout rows="auto,*">
        <cameraView rowSpan="2" bind:this={cameraPreview} {flashMode} on:layoutChanged={onCameraLayoutChanged} enablePinchZoom={true} autoFocus={true} on:loaded={applyProcessor} />
        <cropview rowSpan="2" bind:this={cropView} colors={[primaryColor]} strokeWidth={3} fillAlpha={120} />
        <!-- <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} /> -->
        <CActionBar title={null} backgroundColor="transparent" modalWindow={true}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-document" on:tap={showDocumentsList} visibility={startOnCam ? 'visible' : 'collapsed'} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-dots-vertical" on:tap={showOptions} visibility={startOnCam ? 'visible' : 'collapsed'} />
        </CActionBar>

        <gridLayout row={1} rows="*,auto" padding="10">
            <gridlayout>
                <stacklayout verticalAlignment="center" horizontalAlignment="left">
                    <mdbutton variant="flat" class="icon-btn" color="white" text="mdi-flash " on:tap={() => (flashMode = (flashMode + 1) % 5)} />
                    <mdbutton color={torchEnabled ? accentColor : 'white'} variant="flat" class="icon-btn" text="mdi-flashlight" on:tap={switchTorch} />
                    <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-camera" on:tap={toggleCamera} />
                </stacklayout>
                <mdbutton
                    color="white"
                    variant="flat"
                    class="icon-btn"
                    text={batchMode ? 'mdi-image-multiple' : 'mdi-image'}
                    on:tap={() => (batchMode = !batchMode)}
                    horizontalAlignment="left"
                    verticalAlignment="bottom"
                />
            </gridlayout>

            <image
                bind:this={smallImageView}
                rowSpan={2}
                stretch="aspectFit"
                imageRotation={croppedImageRotation}
                colorMatrix={getColorMatrix(colorType)}
                verticalAlignment="bottom"
                horizontalAlignment="left"
                width={80}
                height={80}
                src={smallImagePath}
                on:tap={toggleEditing}
            />

            <image
                bind:this={fullImageView}
                rowSpan={2}
                stretch="aspectFit"
                colorMatrix={getColorMatrix(colorType)}
                src={croppedImagePath}
                on:tap={() => setCurrentImage(null)}
                isUserInteractionEnabled={showingFullScreenImage}
                imageRotation={croppedImageRotation}
            />

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
                <gridlayout touchAnimation={touchAnimationShrink} backgroundColor={primaryColor} width={54} height={54} borderRadius={27} on:tap={takePicture} />
                <label color="white" fontSize={20} textAlignment="center" verticalAlignment="middle" visibility={nbPages ? 'visible' : 'hidden'} text={nbPages + ''} />
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
                class="floating-btn"
                variant="text"
                row={1}
                elevation={0}
                rippleColor="white"
                verticalAlignment="center"
                horizontalAlignment="right"
                text="mdi-check"
                on:tap={() => saveCurrentDocument()}
                visibility={canSaveDoc ? 'visible' : 'hidden'}
            />
        </gridLayout>
        <CropEditPage
            rowSpan={2}
            visibility={editing ? 'visible' : 'collapsed'}
            {editingImage}
            {croppedImagePath}
            quad={currentQuad}
            bind:croppedImageRotation
            bind:colorType
            on:finished={onFinishEditing}
            on:croppedImageChanged={onCroppedImageChanged}
        />
    </gridlayout>
</page>
