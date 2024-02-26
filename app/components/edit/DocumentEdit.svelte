<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { EventData, Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { AndroidActivityBackPressedEventData, Application, ImageSource, ObservableArray, Page, PageTransition, Screen, SharedTransition, TextField, View } from '@nativescript/core';
    import { debounce } from '@nativescript/core/utils';
    import { OCRData } from 'plugin-nativeprocessor';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, goBack, showModal } from 'svelte-native/dom';
    import { Writable } from 'svelte/store';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import CropView from '~/components/common/CropView.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import { l, lc } from '~/helpers/locale';
    import { onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { TRANSFORMS_SPLIT } from '~/models/constants';
    import { TRANSFORMS } from '~/models/localized_constant';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { loadImage, recycleImages } from '~/utils/images';
    import { share } from '~/utils/share';
    import { ColorMatricesTypes, copyTextToClipboard, detectOCROnPage, getColorMatrix, hideLoading, showImagePopoverMenu, showLoading, showPDFPopoverMenu, showPopoverMenu } from '~/utils/ui';
    import { colors } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSurfaceContainer, colorBackground } = $colors);

    export let startPageIndex: number = 0;
    export let document: OCRDocument;
    export let transitionOnBack = true;
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
    let currentItem: OCRPage;
    let currentItemOCRData: OCRData;
    let currentItemSubtitle: string;
    let currentSelectedImagePath: string;
    let currentSelectedImageRotation: number;
    let transforms: string[];
    updateCurrentItem(items.getItem(currentIndex));
    const filters = ColorMatricesTypes.map((k) => ({
        ...k,
        text: lc(k.id),
        colorType: k.id
    }));
    let updatingTransform = false;
    let editingTitle = false;
    let editingTitleTextField: NativeViewElementNode<TextField>;
    // const whitepaper = writable(transforms.indexOf('whitepaper') !== -1);
    // const enhanced = writable(transforms.indexOf('enhance') !== -1);

    async function showPDFPopover(event) {
        try {
            await showPDFPopoverMenu(document.pages, document, event.object);
        } catch (err) {
            showError(err);
        }
    }
    async function detectOCR() {
        // let ocrImage;
        try {
            const ocrData = await detectOCROnPage(document, currentIndex);
            if (ocrData) {
                currentItemOCRData = ocrData;
            } else {
                showSnack({ message: lc('no_text_found_in_page') });
            }
        } catch (err) {
            showError(err);
        }
    }

    async function showOCRSettings() {
        try {
            const OCRSettingsBottomSheet = (await import('~/components/ocr/OCRSettingsBottomSheet.svelte')).default;
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
    function updateCurrentItem(item) {
        currentItem = item;
        currentItemSubtitle = `${currentItem.width} x ${currentItem.height}`;
        currentSelectedImagePath = currentItem.imagePath;
        currentSelectedImageRotation = currentItem.rotation || 0;
        currentItemOCRData = currentItem.ocrData;
        transforms = currentItem.transforms?.split(TRANSFORMS_SPLIT) || [];
    }
    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
        updateCurrentItem(items.getItem(currentIndex));
        // $whitepaper = transforms.indexOf('whitepaper') !== -1;
        // $enhanced = transforms.indexOf('enhance') !== -1;
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
            const newRotation = event.newRotation;
            if (newRotation === undefined) {
                return;
            }
            await document.updatePage(
                currentIndex,
                {
                    rotation: newRotation % 360
                },
                false
            );

            currentSelectedImageRotation = item.rotation;
            DEV_LOG && console.log('onImageRotated', currentSelectedImageRotation);
            // items.setItem(currentIndex, item);
        } catch (error) {
            showError(error);
        }
    }
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
    async function showEnhancements(event) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;

            function getData(transformId) {
                const value = transforms.indexOf(transformId) !== -1;
                return { type: 'checkbox', id: transformId, value, data: value };
            }
            await showPopoverMenu({
                options: TRANSFORMS.map((i) => ({
                    ...getData(i.id),
                    ...i
                })),
                vertPos: VerticalPosition.ABOVE,
                anchor: event.object,
                props: {
                    rowHeight: 70,
                    width: Screen.mainScreen.widthDIPs - 50,
                    onCheckBox(item, value, e) {
                        if (updatingTransform) {
                            e.object.checked = !value;
                            return;
                        }
                        updateTransform(value, null, item.id);
                    }
                }
            });
        } catch (error) {
            showError(error);
        }
    }
    async function shareItem(item) {
        try {
            await share({ file: await item.imagePath });
        } catch (error) {
            showError(error);
        }
    }
    async function cropEdit() {
        try {
            const item = items.getItem(currentIndex);

            editingImage = await loadImage(item.sourceImagePath);
            quad = JSON.parse(JSON.stringify(item.crop));
            recrop = true;
        } catch (error) {
            showError(error);
        }
    }
    async function showImageExportPopover(event) {
        try {
            await showImagePopoverMenu([items.getItem(currentIndex)], event.object);
        } catch (err) {
            showError(err);
        }
    }

    async function showCurrentOCRData() {
        try {
            const item = items.getItem(currentIndex);

            const OCRDataBottomSheet = (await import('~/components/ocr/OCRDataView.svelte')).default;
            await showModal({
                page: OCRDataBottomSheet,
                fullscreen: true,
                props: {
                    ocrData: items.getItem(currentIndex).ocrData,
                    imagePath: item.imagePath,
                    // image: editingImage || (await loadImage(item.imagePath)),
                    imageWidth: item.width,
                    imageHeight: item.height,
                    rotation: item.rotation
                    // colorMatrix: getColorMatrix(item.colorType)
                }
            });
        } catch (error) {
            showError(error);
        }
    }
    let ignoreNextCollectionViewRefresh = false;
    const saveCurrentItemColorType = debounce(function (index, colorMatrix) {
        ignoreNextCollectionViewRefresh = true;
        document.updatePage(index, {
            colorMatrix
        });
    }, 500);
    function onColorMatrixChange(colorType, value) {
        const current = items.getItem(currentIndex);
        current.colorType = colorType;
        current.colorMatrix = getColorMatrix(colorType, value);
        items.setItem(currentIndex, current);
        saveCurrentItemColorType(currentIndex, current.colorMatrix);
    }

    async function setColorMatrixLevels(item, event) {
        if (!item.range) {
            return;
        }

        try {
            const component = (await import('~/components/common/SliderPopover.svelte')).default;
            const current = items.getItem(currentIndex);
            const currentValue = current.colorMatrix?.[0] || 1;
            DEV_LOG && console.log('setColorMatrixLevels', currentValue, current.colorMatrix);
            onColorMatrixChange(item.colorType, currentValue);
            await showPopover({
                backgroundColor: colorSurfaceContainer,
                view: component,
                anchor: event.object,
                vertPos: VerticalPosition.ABOVE,
                horizPos: HorizontalPosition.ALIGN_LEFT,
                props: {
                    min: 0.5,
                    max: 2,
                    step: 0.1,
                    width: '80%',
                    value: currentValue,
                    onChange(value) {
                        if (current.colorMatrix?.[0] || 1 !== value) {
                            onColorMatrixChange(item.colorType, value);
                        }
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
            let result;
            const deleteDocument = document.pages.length === 1;
            if (deleteDocument) {
                result = await confirm({
                    title: lc('delete'),
                    message: lc('confirm_delete_document'),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
            } else {
                result = await confirm({
                    title: lc('delete_page', currentIndex),
                    message: lc('confirm_delete_page', currentIndex + 1),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
            }
            if (result) {
                try {
                    if (deleteDocument) {
                        await documentsService.deleteDocuments([document]);
                    } else {
                        await document.deletePage(currentIndex);
                        pager.nativeView.scrollToIndexAnimated(currentIndex, true);
                    }
                } catch (err) {
                    showError(err, err.stack);
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    function isCurrentColorType(i) {
        return currentItem.colorType === i.colorType;
    }

    async function applyImageColorMatrix(i) {
        const current = items.getItem(currentIndex);
        current.colorMatrix = null;
        current.colorType = i.colorType;
        collectionView.nativeView.refreshVisibleItems();
        ignoreNextCollectionViewRefresh = true;
        document.updatePage(
            currentIndex,
            {
                colorType: i.colorType,
                colorMatrix: null
            },
            false
        );
    }

    async function updateImageUris() {
        await getCurrentImageView()?.updateImageUri();
        collectionView?.nativeView.eachChildAsync((c: View) => c.getViewById<Img>('imageView')?.updateImageUri());
        refreshCollectionView();
    }

    async function updateTransform(value: boolean, store: Writable<boolean>, type: string) {
        if (updatingTransform) {
            store.set(!value);
            return;
        }
        updatingTransform = true;
        try {
            const page = items.getItem(currentIndex);
            const currentTransforms = page.transforms?.split(TRANSFORMS_SPLIT) || [];
            if (value) {
                if (currentTransforms.indexOf(type) === -1) {
                    await showLoading(l('computing'));
                    currentTransforms.push(type);
                    await document.updatePageTransforms(currentIndex, currentTransforms.join(TRANSFORMS_SPLIT));
                }
            } else {
                const index = currentTransforms.indexOf(type);
                if (index !== -1) {
                    await showLoading(l('computing'));
                    currentTransforms.splice(index, 1);
                    await document.updatePageTransforms(currentIndex, currentTransforms.join(TRANSFORMS_SPLIT));
                }
            }
            transforms = currentTransforms;
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
            items.setItem(index, items.getItem(index));
            if (!!event.imageUpdated) {
                await updateImageUris();
            } else {
                if (ignoreNextCollectionViewRefresh) {
                    ignoreNextCollectionViewRefresh = false;
                    return;
                }
                refreshCollectionView();
            }
        }
    }

    function onDocumentUpdated(event: EventData & { doc: OCRDocument }) {
        if (document === event.doc) {
            document = event.doc;
        }
    }
    function onDocumentsDeleted(event: EventData & { documents }) {
        if (event.documents.indexOf(document) !== -1) {
            goBack({
                // null is important to say no transition! (override enter transition)
                transition: null
            });
        }
    }
    onMount(() => {
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentUpdated', onDocumentUpdated);
        documentsService.on('documentsDeleted', onDocumentsDeleted);
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off('documentUpdated', onDocumentUpdated);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
    });

    function refreshCollectionView() {
        collectionView?.nativeView?.refreshVisibleItems();
    }

    async function onRecropTapFinish(cancel = false) {
        try {
            if (recrop) {
                // let s see if quads changed and update image
                if (quadChanged && !cancel) {
                    await document.updatePageCrop(currentIndex, quad, editingImage);
                    updateImageUris();
                    quadChanged = false;
                    quads = [];
                }
                recycleImages(editingImage);
                editingImage = null;
                recrop = false;
            }
        } catch (error) {
            showError(error);
        }
    }
    function resetCrop() {
        quad = [
            [0, 0],
            [editingImage.width - 0, 0],
            [editingImage.width - 0, editingImage.height - 0],
            [0, editingImage.height - 0]
        ];
    }
    function refreshPager() {
        pager?.nativeView?.refresh();
    }
    onThemeChanged(refreshPager);

    function onGoBack() {
        if (recrop) {
            onRecropTapFinish(true);
        } else {
            const item = items.getItem(currentIndex);

            //we use a new transition to transition the selected item
            goBack({
                transition:
                    __ANDROID__ && !CARD_APP && transitionOnBack
                        ? SharedTransition.custom(new PageTransition(300, undefined, 10), {
                              pageStart: {
                                  sharedTransitionTags: {
                                      [`document_${document.id}_${item.id}`]: {}
                                  }
                              }
                          })
                        : undefined
            } as any);
        }
    }
    function onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (__ANDROID__) {
            data.cancel = true;
            if (recrop) {
                onRecropTapFinish(true);
            } else {
                onGoBack();
            }
        }
    }

    async function saveDocumentTitle(event) {
        try {
            DEV_LOG && console.log('saveDocumentTitle', editingTitleTextField.nativeElement.text);
            await document.save({
                name: editingTitleTextField.nativeElement.text
            });
            editingTitle = false;
        } catch (error) {
            showError(error);
        }
    }
    async function onTextFieldFocus(event) {
        try {
            const textField = event.object as TextField;
            textField.setSelection(textField.text.length);
            textField.requestFocus();
        } catch (error) {
            showError(error);
        }
    }
    function copyText() {
        try {
            if (currentItemOCRData) {
                copyTextToClipboard(currentItemOCRData.text);
            }
        } catch (error) {
            showError(error);
        }
    }
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
        <mdbutton class="icon-btn" horizontalAlignment="right" row={2} text="mdi-share-variant" variant="text" verticalAlignment="bottom" on:tap={showImageExportPopover} />
        <mdbutton
            class="icon-btn"
            horizontalAlignment="right"
            marginRight={40}
            row={2}
            text="mdi-format-textbox"
            variant="text"
            verticalAlignment="bottom"
            visibility={currentItemOCRData ? 'visible' : 'hidden'}
            on:tap={showCurrentOCRData}
            on:longPress={copyText} />

        <stacklayout orientation="horizontal" row={3}>
            <mdbutton class="icon-btn" text="mdi-crop" variant="text" on:tap={() => cropEdit()} />
            <mdbutton class="icon-btn" text="mdi-rotate-left" variant="text" on:tap={() => rotateImageLeft()} />
            <mdbutton class="icon-btn" text="mdi-rotate-right" variant="text" on:tap={() => rotateImageRight()} />
            <mdbutton class="icon-btn" text="mdi-auto-fix" variant="text" on:tap={showEnhancements} />
            <!-- <checkbox checked={$enhanced} marginLeft={4} text={lc('enhance')} verticalAlignment="middle" on:checkedChange={(e) => ($enhanced = e.value)} /> -->
            <!-- <checkbox checked={$whitepaper} marginLeft={4} text={lc('whitepaper')} verticalAlignment="middle" on:checkedChange={(e) => ($whitepaper = e.value)} /> -->
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={4}>
            <Template let:item>
                <gridlayout id={item.text} padding={2} on:tap={applyImageColorMatrix(item)} on:longPress={(event) => setColorMatrixLevels(item, event)}>
                    <image
                        id="imageView"
                        borderColor={colorPrimary}
                        borderRadius={4}
                        borderWidth={isCurrentColorType(item) ? 3 : 0}
                        colorMatrix={getColorMatrix(item.colorType)}
                        decodeHeight={120}
                        decodeWidth={120}
                        imageRotation={currentSelectedImageRotation}
                        src={currentSelectedImagePath}
                        stretch="aspectFill" />
                    <label
                        backgroundImage="linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)"
                        ios:selectable={true}
                        borderRadius="0 0 4 4"
                        color="white"
                        fontSize={11}
                        fontWeight="500"
                        text={item.text}
                        textAlignment="center"
                        verticalAlignment="bottom" />
                </gridlayout>
            </Template>
        </collectionview>
        <gridlayout backgroundColor="black" row={1} rowSpan={4} rows="*,auto,auto" visibility={recrop ? 'visible' : 'hidden'}>
            <CropView {editingImage} bind:quadChanged bind:quads />
            <label fontSize={13} marginBottom={10} row={1} text={lc('crop_edit_doc')} textAlignment="center" />
            <mdbutton class="fab" elevation={0} horizontalAlignment="center" margin="0" row={2} text="mdi-check" variant="text" on:tap={() => onRecropTapFinish()} />
            <mdbutton class="icon-btn" color="white" horizontalAlignment="right" marginRight={10} row={2} text="mdi-arrow-expand-all" variant="text" verticalAlignment="center" on:tap={resetCrop} />
        </gridlayout>
        <CActionBar {onGoBack} onTitleTap={() => (editingTitle = true)} title={document.name} titleProps={{ autoFontSize: true, padding: 0 }}>
            <mdbutton class="actionBarButton" text="mdi-text-recognition" variant="text" on:tap={showOCRSettings} />
            <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
            <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteCurrentPage} />
        </CActionBar>
        {#if editingTitle}
            <CActionBar forceCanGoBack={true} onGoBack={() => (editingTitle = false)} title={null}>
                <textfield
                    bind:this={editingTitleTextField}
                    slot="center"
                    backgroundColor={colorBackground}
                    col={1}
                    paddingBottom={4}
                    paddingTop={4}
                    text={document.name}
                    verticalTextAlignment="center"
                    on:layoutChanged={onTextFieldFocus} />
                <mdbutton class="actionBarButton" text="mdi-content-save" variant="text" on:tap={saveDocumentTitle} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
