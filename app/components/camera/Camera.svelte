<script lang="ts">
    import { CameraView } from '@nativescript-community/ui-cameraview';
    import { Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
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
    import { l } from '~/helpers/locale';
    import { OCRDocument, PageData, TRANSFORMS_SPLIT } from '~/models/OCRDocument';
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
    let cameraPreview: NativeViewElementNode<CameraView>;
    let cropView: NativeViewElementNode<CropView>;
    let fullImageView: NativeViewElementNode<Img>;
    let smallImageView: NativeViewElementNode<Img>;

    const cameraOptionsStore = writable<{ aspectRatio: string; stretch: string; viewsize: string }>(
        JSON.parse(ApplicationSettings.getString('camera_settings', '{"aspectRatio":"4:3", "stretch":"aspectFit","viewsize":"limited"}'))
    );
    cameraOptionsStore.subscribe((newValue) => {
        console.log('cameraOptionsStore changed', newValue);
        ApplicationSettings.setString('camera_settings', JSON.stringify(newValue));
    });
    $: ({ aspectRatio, stretch, viewsize } = $cameraOptionsStore);

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
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: CameraSettingsBottomSheet,
            backgroundOpacity: 0.8,
            closeCallback: (result, bottomsheetComponent: CameraSettingsBottomSheet) => {
                transforms = bottomsheetComponent.transforms;
                colorType = bottomsheetComponent.colorType;
                ApplicationSettings.setString('defaultColorType', colorType);
                ApplicationSettings.setString('defaultTransforms', transforms.join(TRANSFORMS_SPLIT));
            },
            props: {
                cameraOptionsStore,
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
            // stopPreview();
            showLoading(l('computing'));
            // editingImage = await loadImage(imagePath);
            editingImage = new ImageSource(image);
            // eslint-disable-next-line prefer-const
            let quads = await getJSONDocumentCorners(editingImage, 300, 0);

            if (quads.length === 0) {
                let items = [
                    {
                        editingImage,
                        quads: [
                            [
                                [100, 100],
                                [editingImage.width - 100, 100],
                                [editingImage.width - 100, editingImage.height - 100],
                                [100, editingImage.height - 100]
                            ]
                        ] as [number, number][][]
                    }
                ];
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
            if (quads?.length) {
                await addCurrentImageToDocument(image, quads);
                return true;
            }
            return false;
        } catch (err) {
            console.error(err, err.stack);
            showError(err);
        } finally {
            takingPicture = false;
            // startPreview();
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
                // returnImageProxy: true,
                // pictureSize: { width: test.width, height: test.height },
                captureMode: 1
                // captureMode: batchMode ? 1 : 0
            });
            const didAdd = await processAndAddImage(image);
            if (didAdd && !batchMode) {
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
        // croppedImageRotation = 0;
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
            cameraPreview?.nativeView.startPreview();
        }
    }
    function stopPreview() {
        if (previewStarted) {
            previewStarted = false;
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
        // DEV_LOG && console.log('onBackground', !!cameraPreview);
        stopPreview();
    }
    function onForeground() {
        DEV_LOG && console.log('onForeground', !!cameraPreview);
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
        // if (pagesToAdd) {
        //     recycleImages(pagesToAdd.map((d) => d.image));
        // }
        // croppedImage = null;
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
                [qrcode, colors] = await Promise.all([detectQRCode(images[0], { resizeThreshold: 900 }), getColorPalette(images[0])]);
                DEV_LOG && console.log('qrcode and colors', qrcode, colors);
            }
            // const start = Date.now();
            // const qrCode = await detectQRCode(images[0], {});
            // console.log('detected qrcode', qrCode, Date.now() - start, 'ms');
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

            //TODO:
            // if (!document) {
            //     document = await OCRDocument.createDocument(dayjs().format('L LTS'), pagesToAdd);
            // } else {
            //     await document.addPages(pagesToAdd);
            // }
            // if (!pages) {
            //     pages = document.getObservablePages();
            // }
            // recycleImages(images);
            images = null;
            nbPages = pagesToAdd.length;
            startPreview();
            // if (editing) {
            //     toggleEditing();
            // }
            const lastPage = pagesToAdd[pagesToAdd.length - 1];
            currentQuad = lastPage.crop;
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
        cameraScreenRatio = cameraPreview.nativeElement.getMeasuredWidth() / cameraPreview.nativeElement.getMeasuredHeight();
    }
    function focusCamera(e) {
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
            processor['previewResizeThreshold'] = ApplicationSettings.getNumber('previewResizeThreshold', 200);
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
    // function onCroppedImageChanged() {
    //     //current cropped image was modified
    //     smallImageView?.nativeView?.updateImageUri();
    // }

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
</script>

<page bind:this={page} id="camera" actionBarHidden={true} statusBarColor="black" statusBarStyle="dark" on:navigatedTo={onNavigatedTo} on:navigatedFrom={onNavigatedFrom}>
    <gridlayout backgroundColor="black" paddingBottom={30} rows="auto,*,auto,auto">
        <cameraView
            bind:this={cameraPreview}
            {aspectRatio}
            autoFocus={true}
            enablePinchZoom={true}
            {flashMode}
            rowSpan={viewsize === 'full' ? 4 : 2}
            {stretch}
            on:layoutChanged={onCameraLayoutChanged}
            on:loaded={applyProcessor}
            on:tap={focusCamera} />
        <cropview bind:this={cropView} colors={[colorPrimary]} fillAlpha={120} rowSpan="2" strokeWidth={3} />
        <!-- <canvasView bind:this={canvasView} rowSpan="2" on:draw={onCanvasDraw} on:tap={focusCamera} /> -->
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true}>
            <mdbutton class="actionBarButton" defaultVisualState="black" text="mdi-file-document" variant="text" visibility={startOnCam ? 'visible' : 'collapsed'} on:tap={showDocumentsList} />
            <mdbutton class="actionBarButton" defaultVisualState="black" text="mdi-cogs" variant="text" visibility={startOnCam ? 'visible' : 'collapsed'} on:tap={showSettings} />
        </CActionBar>

        <!-- <gridlayout padding="10" row={1} rows="*,auto"> -->
        <stacklayout horizontalAlignment="left" orientation="horizontal" row={2} verticalAlignment="center">
            <mdbutton class="icon-btn" color="white" text={getFlashIcon(flashMode)} variant="text" on:tap={() => (flashMode = (flashMode + 1) % 4)} />
            <mdbutton class="icon-btn" color={torchEnabled ? colorPrimary : 'white'} text="mdi-flashlight" variant="text" on:tap={switchTorch} />
            <mdbutton class="icon-btn" color="white" text="mdi-camera-flip" variant="text" on:tap={toggleCamera} />
        </stacklayout>
        <mdbutton class="icon-btn" color="white" horizontalAlignment="right" row={2} text="mdi-tune" variant="text" visibility={startOnCam ? 'collapsed' : 'visible'} on:tap={showCameraSettings} />

        <gridlayout columns="60,*,auto,*,60" row={3}>
            <mdbutton
                class="icon-btn"
                color="white"
                horizontalAlignment="left"
                marginLeft={10}
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
            <gridlayout borderColor="white" borderRadius="50%" borderWidth={3} col={2} height={70} horizontalAlignment="center" opacity={takingPicture ? 0.6 : 1} verticalAlignment="center" width={70}>
                <gridlayout
                    backgroundColor={colorPrimary}
                    borderRadius="50%"
                    height={54}
                    horizontalAlignment="center"
                    ignoreTouchAnimation={false}
                    touchAnimation={touchAnimationShrink}
                    width={54}
                    on:tap={takePicture} />
                <label color="white" fontSize={20} text={nbPages + ''} textAlignment="center" verticalAlignment="middle" visibility={nbPages ? 'visible' : 'hidden'} />
            </gridlayout>

            <mdbutton
                class="fab"
                col={3}
                elevation={0}
                horizontalAlignment="center"
                rippleColor="white"
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
            visibility={editing ? 'visible' : 'collapsed'}
            bind:croppedImageRotation
            bind:colorType
            on:finished={onFinishEditing} /> -->
    </gridlayout>
</page>
