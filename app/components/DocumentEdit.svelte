<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { EventData, Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { File, ImageSource, ObservableArray, Page, View, path } from '@nativescript/core';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, showModal } from 'svelte-native/dom';
    import { Writable, writable } from 'svelte/store';
    import CActionBar from '~/components/CActionBar.svelte';
    import CropView from '~/components/CropView.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import { l, lc } from '~/helpers/locale';
    import { onThemeChanged } from '~/helpers/theme';
    import { IMG_COMPRESS, IMG_FORMAT, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { ocrService } from '~/services/ocr';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { notifyWhenChanges } from '~/utils/svelte/store';
    import { ColorMatricesTypes, getColorMatrix, hideLoading, showLoading, timeout, updateLoadingProgress } from '~/utils/ui';
    import { loadImage, recycleImages } from '~/utils/utils.common';
    import { colors } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary } = $colors);

    export let startPageIndex: number = 0;
    export let document: OCRDocument;
    let pager: NativeViewElementNode<Pager>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let page: NativeViewElementNode<Page>;

    const items: ObservableArray<OCRPage> = document.getObservablePages();
    let recrop = false;
    let editingImage: ImageSource;
    let quad;
    let quads;
    $: quads = quad ? [quad] : [];
    let quadChanged = false;
    let currentIndex = startPageIndex;
    const firstItem = items.getItem(currentIndex);
    let currentItemOCRData = firstItem.ocrData;
    let currentItemSubtitle = `${firstItem.width} x ${firstItem.height}`;
    let currentSelectedImagePath = firstItem.getImagePath();
    let currentSelectedImageRotation = firstItem.rotation || 0;
    const transforms = firstItem.transforms?.split(',') || [];
    const whitepaper = writable(transforms.indexOf('whitepaper') !== -1);
    const enhanced = writable(transforms.indexOf('enhance') !== -1);
    async function savePDF() {
        try {
            showLoading(l('exporting'));
            const file = await documentsService.exportPDF(document);
            hideLoading();
            openFile(file.path);
        } catch (err) {
            showError(err);
        }
    }
    async function detectOCR() {
        let ocrImage;
        try {
            if (!(await ocrService.checkOrDownload(ocrService.dataType, ocrService.languages, false))) {
                return;
            }
            showLoading({ text: l('ocr_computing', 0), progress: 0 });
            const ocrData = await ocrService.ocrPage(document, currentIndex, (progress: number) => {
                console.log('ocrPage progress', progress);
                updateLoadingProgress({ progress, text: l('ocr_computing', progress) });
            });
            if (ocrData) {
                currentItemOCRData = ocrData;
            } else {
                showSnack({ message: lc('no_text_found_in_page') });
            }
        } catch (err) {
            showError(err);
        } finally {
            hideLoading();
            recycleImages(ocrImage);
        }
    }

    async function showOCRSettings() {
        try {
            const OCRSettingsBottomSheet = (await import('~/components/OCRSettingsBottomSheet.svelte')).default;
            const shouldStart = await showBottomSheet({
                parent: page,
                view: OCRSettingsBottomSheet,
                props: {}
            });
            if (shouldStart) {
                detectOCR();
            }
        } catch (error) {
            showError(error);
        }
    }
    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
        const item = items.getItem(currentIndex);
        currentItemSubtitle = `${item.width} x ${item.height}`;
        currentSelectedImagePath = item.getImagePath();
        currentSelectedImageRotation = item.rotation || 0;
        currentItemOCRData = item.ocrData;
        const transforms = item.transforms?.split(',') || [];
        $whitepaper = transforms.indexOf('whitepaper') !== -1;
        $enhanced = transforms.indexOf('enhance') !== -1;
        console.log('onSelectedIndex', currentIndex, currentSelectedImagePath, currentSelectedImageRotation);
        refreshCollectionView();
    }
    // function onFirstLayout(item, e) {
    //     console.log('onFirstLayout');
    //     if (item.rotation % 180 === 90) {
    //         const currentWidth = layout.toDeviceIndependentPixels(e.object.getMeasuredWidth());
    //         const currentHeight = layout.toDeviceIndependentPixels(e.object.getMeasuredHeight());
    //         const delta = item.rotation % 180 === 0 ? 0 : (currentWidth - currentHeight) / 2;
    //         Object.assign(e.object, {
    //             translateX: delta,
    //             translateY: -delta,
    //             width: currentHeight,
    //             height: currentWidth
    //         });
    //     }
    // }

    async function onImageRotated(item, event) {
        try {
            const newRotation = event.detail.detail.newRotation;
            if (newRotation === undefined) {
                return;
            }
            await document.updatePage(
                currentIndex,
                {
                    rotation: newRotation % 360
                },
                __IOS__
            );

            currentSelectedImageRotation = item.rotation;
            console.log('onImageRotated', currentSelectedImageRotation);
            // items.setItem(currentIndex, item);
        } catch (error) {
            showError(error);
        }
    }
    const colorType = 0;
    // $: {
    //     colorType = document.pages[currentIndex].colorType || 0;
    // }
    // async function setColorType(type: number) {
    //     colorType = type;
    //     try {
    //         await document.updatePage(currentIndex, {
    //             colorType: type
    //             // colorMatrix: getColorMatrix(type)
    //         });
    //         // pages.setItem(currentIndex, current);
    //     } catch (err) {
    //         showError(err);
    //     }
    // }

    function getCurrentImageView() {
        return pager?.nativeView?.getChildView(currentIndex)?.getViewById<Img>('imageView');
    }

    function applyRotation(newRotation) {
        getCurrentImageView().notify({ eventName: 'rotateAnimated', rotation: newRotation });
    }
    function getCurrentRotation() {
        const current = items.getItem(currentIndex);
        return current.rotation && !isNaN(current.rotation) ? current.rotation : 0;
    }
    async function rotateImageLeft() {
        try {
            applyRotation(getCurrentRotation() - 90);
        } catch (error) {
            showError(error);
        }
    }
    async function rotateImageRight() {
        try {
            applyRotation(getCurrentRotation() + 90);
        } catch (error) {
            showError(error);
        }
    }
    async function showEnhancements() {
        try {
            const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            await showBottomSheet({
                view: OptionSelect,
                disableDimBackground: true,
                props: {
                    rowHeight: 58,
                    height: 200,
                    options: [
                        { type: 'checkbox', name: lc('enhance'), id: 'enhance', value: transforms.indexOf('enhance') !== -1 },
                        { type: 'checkbox', name: lc('whitepaper'), id: 'whitepaper', data: $whitepaper, value: transforms.indexOf('whitepaper') !== -1 },
                        { type: 'checkbox', name: lc('color'), data: $enhanced, id: 'color', value: transforms.indexOf('color') !== -1 }
                    ],
                    onCheckBox(item, value, e) {
                        if (updatingTransform) {
                            e.checked = !value;
                            return;
                        }
                        updateTransform(value, null, item.id + '_100');
                    }
                },
                trackingScrollView: 'collectionView'
            });
        } catch (error) {
            showError(error);
        }
    }
    async function shareItem(item) {
        try {
            await share({ file: await item.getImagePath() });
        } catch (error) {
            showError(error);
        }
    }
    async function cropEdit() {
        try {
            const item = items.getItem(currentIndex);

            editingImage = await loadImage(item.sourceImagePath);
            // editingImage = await ImageSource.fromFile(item.sourceImagePath);

            quad = item.crop;
            recrop = true;
        } catch (error) {
            showError(error);
        }
    }

    async function shareCurrentItem() {
        try {
            shareItem(items.getItem(currentIndex));
        } catch (error) {
            showError(error);
        }
    }
    async function saveCurrentImage() {
        if (__ANDROID__) {
            try {
                const imagePath = items.getItem(currentIndex).imagePath;
                const file = File.fromPath(imagePath);
                const destinationPath = path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(), file.name);
                await (await ImageSource.fromFile(imagePath)).saveToFileAsync(destinationPath, IMG_FORMAT, IMG_COMPRESS);
            } catch (error) {
                showError(error);
            }
        } else {
            try {
                const imagePath = items.getItem(currentIndex).imagePath;
                const imageSource = await ImageSource.fromFile(imagePath);
                await new Promise<void>((resolve, reject) => {
                    PHPhotoLibrary.sharedPhotoLibrary().performChangesCompletionHandler(
                        () => {
                            PHAssetChangeRequest.creationRequestForAssetFromImage(imageSource.ios);
                        },
                        (success, err) => {
                            if (success) {
                                resolve();
                            } else {
                                reject(err);
                            }
                        }
                    );
                });
                showSnack({ message: l('image_saved_gallery') });
            } catch (error) {
                showError(error);
            }
        }
    }

    async function showCurrentOCRData() {
        try {
            const item = items.getItem(currentIndex);

            const OCRDataBottomSheet = (await import('~/components/OCRDataView.svelte')).default;
            await showModal({
                page: OCRDataBottomSheet,
                fullscreen: true,
                props: {
                    ocrData: items.getItem(currentIndex).ocrData,
                    imagePath: item.imagePath
                    // image: editingImage || (await loadImage(item.imagePath)),
                    // imageWidth: item.width,
                    // imageHeight: item.height,
                    // // rotation: item.rotation,
                    // colorMatrix: getColorMatrix(item.colorType)
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    async function setBlackWhiteLevel(event) {
        const current = items.getItem(currentIndex);
        // if (current.colorType !== ColorType.BLACK_WHITE) {
        //     return;
        // }

        const currentValue = current.colorMatrix[0];
        try {
            const SliderPopover = (await import('~/components/SliderPopover.svelte')).default;
            showPopover({
                view: SliderPopover,
                anchor: event.object,
                vertPos: VerticalPosition.ABOVE,
                props: {
                    min: 0.5,
                    max: 2,
                    step: 0.1,
                    title: 'black_white_level',
                    icon: 'mdi-brightness-6',
                    value: currentValue,
                    onChange(value) {
                        document.updatePage(currentIndex, {
                            colorMatrix: getColorMatrix(current.colorType, value)
                        });
                    }
                }
            });
        } catch (err) {
            showError(err);
        }
    }
    onDestroy(() => {
        // document.clearObservableArray(items);
    });

    async function deleteCurrentPage() {
        try {
            const result = await confirm({
                title: lc('delete_page', currentIndex),
                message: lc('confirm_delete_page', currentIndex + 1),
                okButtonText: lc('delete'),
                cancelButtonText: lc('cancel')
            });
            if (result) {
                try {
                    await document.deletePage(currentIndex);
                    pager.nativeView.scrollToIndexAnimated(currentIndex, true);
                    // startPageIndex = currentIndex -= 1;
                } catch (err) {
                    console.error(err.err.stack);
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    async function applyImageTransform(i) {
        const current = items.getItem(currentIndex);
        current.colorType = i.colorType;
        document.updatePage(currentIndex, {
            colorType: i.colorType,
            colorMatrix: null
        });
    }

    async function updateImageUris() {
        DEV_LOG && console.log('updateImageUris');
        await getCurrentImageView()?.updateImageUri();
        collectionView?.nativeView.eachChildAsync((c: View) => c.getViewById<Img>('imageView')?.updateImageUri());
        refreshCollectionView();
    }

    const filters = ColorMatricesTypes.map((k) => ({
        id: k,
        text: lc(k),
        colorType: k
    }));
    let updatingTransform = false;
    async function updateTransform(value: boolean, store: Writable<boolean>, type: string) {
        if (updatingTransform) {
            store.set(!value);
            return;
        }
        updatingTransform = true;
        try {
            const page = items.getItem(currentIndex);
            const currentTransforms = page.transforms?.split(',') || [];
            if (value) {
                if (currentTransforms.indexOf(type) === -1) {
                    await showLoading(l('computing'));
                    currentTransforms.push(type);
                    await document.updatePageTransforms(currentIndex, currentTransforms.join(','));
                }
            } else {
                const index = currentTransforms.indexOf(type);
                if (index !== -1) {
                    await showLoading(l('computing'));
                    currentTransforms.splice(index, 1);
                    await document.updatePageTransforms(currentIndex, currentTransforms.join(','));
                }
            }
        } catch (error) {
            showError(error);
        } finally {
            updatingTransform = false;
            hideLoading();
        }
    }

    async function onDocumentPageUpdated(event: EventData & { pageIndex: number; imageUpdated: boolean }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        if (index === currentIndex) {
            DEV_LOG && console.log('edit onDocumentPageUpdated', index, event.imageUpdated);
            // TODO: fix the pager something is wrong if we
            if (!!event.imageUpdated) {
                await updateImageUris();
            } else {
                items.setItem(index, items.getItem(index));
                refreshCollectionView();
            }
        }
    }
    onMount(() => {
        notifyWhenChanges(enhanced, (value) => {
            updateTransform(value, enhanced, 'enhance');
        });
        notifyWhenChanges(whitepaper, (value) => {
            updateTransform(value, whitepaper, 'whitepaper');
        });
        // $:

        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
    });
    onDestroy(() => {
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
    });

    function refreshCollectionView() {
        collectionView?.nativeView?.refreshVisibleItems();
    }

    async function onRecropTapFinish() {
        try {
            if (recrop) {
                // let s see if quads changed and update image
                if (quadChanged) {
                    await document.updatePageCrop(currentIndex, quad, editingImage);
                    updateImageUris();
                    quadChanged = false;
                    recycleImages(editingImage);
                    editingImage = null;
                    quads = [];
                }
                recrop = false;
            }
        } catch (error) {
            showError(error);
        }
    }
    function refreshPager() {
        console.log('refreshPager');
        pager?.nativeView?.refresh();
    }
    onThemeChanged(refreshPager);
</script>

<page bind:this={page} id="pdfEdit" actionBarHidden={true}>
    <gridlayout rows="auto,*,auto,auto,auto">
        <pager bind:this={pager} {items} row={1} selectedIndex={startPageIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <gridlayout width="100%">
                    <RotableImageView id="imageView" {item} sharedTransitionTag={`document_${document.id}_${item.id}`} zoomable={true} on:rotated={(e) => onImageRotated(item, e)} />
                </gridlayout>
            </Template>
        </pager>
        <label fontSize={14} horizontalAlignment="left" padding={10} row={2} text={currentItemSubtitle} verticalTextAlignment="center" />
        <mdbutton
            class="icon-btn"
            horizontalAlignment="right"
            row={2}
            text="mdi-share-variant"
            variant="text"
            verticalAlignment="bottom"
            on:tap={() => shareCurrentItem()}
            on:longPress={() => saveCurrentImage()} />
        <mdbutton
            class="icon-btn"
            horizontalAlignment="right"
            marginRight={40}
            row={2}
            text="mdi-format-textbox"
            variant="text"
            verticalAlignment="bottom"
            visibility={currentItemOCRData ? 'visible' : 'hidden'}
            on:tap={() => showCurrentOCRData()} />

        <stacklayout orientation="horizontal" row={3}>
            <mdbutton class="icon-btn" text="mdi-crop" variant="text" on:tap={() => cropEdit()} />
            <mdbutton class="icon-btn" text="mdi-rotate-left" variant="text" on:tap={() => rotateImageLeft()} />
            <mdbutton class="icon-btn" text="mdi-rotate-right" variant="text" on:tap={() => rotateImageRight()} />
            <mdbutton class="icon-btn" text="mdi-auto-fix" variant="text" on:tap={() => showEnhancements()} />
            <checkbox checked={$enhanced} marginLeft={4} text={lc('enhance')} verticalAlignment="middle" on:checkedChange={(e) => ($enhanced = e.value)} />
            <checkbox checked={$whitepaper} marginLeft={4} text={lc('whitepaper')} verticalAlignment="middle" on:checkedChange={(e) => ($whitepaper = e.value)} />
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={4}>
            <Template let:item>
                <gridlayout id={item.text} padding={4} rows="*,25" on:tap={applyImageTransform(item)}>
                    <image
                        id="imageView"
                        colorMatrix={getColorMatrix(item.colorType)}
                        decodeHeight={120}
                        decodeWidth={120}
                        imageRotation={currentSelectedImageRotation}
                        src={currentSelectedImagePath} />
                    <label fontSize={10} row={1} text={item.text} textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
        <gridlayout backgroundColor="black" row={1} rowSpan={4} rows="*,auto" visibility={recrop ? 'visible' : 'hidden'}>
            <CropView {editingImage} bind:quadChanged bind:quads />
            <mdbutton class="fab" elevation={0} horizontalAlignment="center" margin="0" rippleColor="white" row={2} text="mdi-check" variant="text" on:tap={onRecropTapFinish} />
        </gridlayout>
        <CActionBar title={document.name} titleProps={{ autoFontSize: true, padding: 0 }}>
            <mdbutton class="actionBarButton" text="mdi-text-recognition" variant="text" on:tap={showOCRSettings} />
            <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={savePDF} />
            <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteCurrentPage} />
        </CActionBar>
    </gridlayout>
</page>
