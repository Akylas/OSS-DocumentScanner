<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { ImageAsset, ImageSource, ObservableArray } from '@nativescript/core';
    import { layout, openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import { l, lc } from '~/helpers/locale';
    import { IMG_FORMAT, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { ColorMatricesTypes, getColorMatrix, hideLoading, showLoading } from '~/utils/ui';
    import CropView from '~/components/CropView.svelte';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { loadImage } from '~/utils/utils';

    export let startPageIndex: number = 0;
    export let document: OCRDocument;
    let pager: NativeViewElementNode<Pager>;
    let collectionView: NativeViewElementNode<CollectionView>;

    const items: ObservableArray<OCRPage> = document.getObservablePages();
    let recrop = false;
    let editingImage: ImageSource;
    let quad;
    let quads;
    $: quads = [quad];
    $: console.log('quads', quads);
    let quadChanged = false;
    let currentIndex = startPageIndex;
    const firstItem = items.getItem(currentIndex);
    let currentItemSubtitle = `${firstItem.width} x ${firstItem.height}`;
    let currentSelectedImagePath = firstItem.getImagePath();
    let currentSelectedImageRotation = firstItem.rotation;
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
    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
        const item = items.getItem(currentIndex);
        currentItemSubtitle = `${item.width} x ${item.height}`;
        currentSelectedImagePath = item.getImagePath();
        currentSelectedImageRotation = item.rotation;
        currentIndex = event.object.selectedIndex;
        console.log('onSelectedIndex', currentIndex, currentSelectedImagePath, currentSelectedImageRotation);
        refreshCollectionView();
    }
    function onFirstLayout(item, e) {
        console.log('onFirstLayout');
        if (item.rotation % 180 === 90) {
            const currentWidth = layout.toDeviceIndependentPixels(e.object.getMeasuredWidth());
            const currentHeight = layout.toDeviceIndependentPixels(e.object.getMeasuredHeight());
            const delta = item.rotation % 180 === 0 ? 0 : (currentWidth - currentHeight) / 2;
            Object.assign(e.object, {
                translateX: delta,
                translateY: -delta,
                width: currentHeight,
                height: currentWidth
            });
        }
    }

    async function onImageRotated(item, event) {
        try {
            const newRotation = event.detail.detail.newRotation;
            if (newRotation === undefined) {
                return;
            }
            await document.updatePage(currentIndex, {
                rotation: newRotation % 360
            });

            currentSelectedImageRotation = item.rotation;
            items.setItem(currentIndex, item);
            refreshCollectionView();
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
    async function rotateImageLeft() {
        try {
            const current = items.getItem(currentIndex);
            console.log('current', current.rotation);
            applyRotation((current.rotation ?? 0) - 90);
        } catch (error) {
            showError(error);
        }
    }
    async function rotateImageRight() {
        try {
            const current = items.getItem(currentIndex);
            applyRotation((current.rotation ?? 0) + 90);
        } catch (error) {
            showError(error);
        }
    }
    async function shareItem(item) {
        try {
            share({ file: await item.getImagePath() });
        } catch (error) {
            showError(error);
        }
    }
    async function cropEdit() {
        try {
            const item = items.getItem(currentIndex);

            editingImage = await loadImage(item.sourceImagePath);
            // editingImage = await ImageSource.fromFile(item.sourceImagePath);
            console.log('cropEdit', item.crop);

            quad = item.crop;
            recrop = true;
        } catch (error) {
            showError(error);
        }
    }

    async function shareCurrentItem() {
        shareItem(items.getItem(currentIndex));
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
                view: SliderPopover as any,
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
                        console.log('changed', value);
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
                message: lc('confirm_delete'),
                okButtonText: lc('delete'),
                cancelButtonText: lc('cancel')
            });
            console.log('delete, confirmed', result);
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

    const filters = ColorMatricesTypes.map((k) => ({
        id: k,
        text: lc(k),
        colorType: k
    }));

    function refreshCollectionView() {
        collectionView?.nativeView?.refreshVisibleItems();
    }

    async function onRecropTapFinish() {
        console.log('onTapFinish', recrop, quadChanged);
        if (recrop) {
            // let s see if quads changed and update image
            if (quadChanged) {
                let images;
                if (__ANDROID__) {
                    images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify([quad]));
                }
                const croppedImagePath = items.getItem(currentIndex).imagePath;
                await new ImageSource(images[0]).saveToFileAsync(croppedImagePath, IMG_FORMAT, 100);
                console.log('onImage Changed', croppedImagePath);
                //we remove from cache so that everything gets updated
                getImagePipeline().evictFromCache(croppedImagePath);
                getCurrentImageView().updateImageUri();
                refreshCollectionView();
                quadChanged = false;
                editingImage = null;
                quads = [];
            }
            recrop = false;
        }
    }
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*,auto,auto">
        <CActionBar title={document.name}>
            <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={savePDF} />
            <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteCurrentPage} />
        </CActionBar>
        <pager bind:this={pager} {items} row={1} selectedIndex={startPageIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <gridlayout width="100%">
                    <RotableImageView id={'imageView'} {item} sharedTransitionTag={`document_${document.id}_${item.id}`} zoomable={true} on:rotated={(e) => onImageRotated(item, e)} />
                </gridlayout>
            </Template>
        </pager>
        <label fontSize={14} horizontalAlignment="left" padding={10} row={1} text={currentItemSubtitle} verticalAlignment="bottom" />
        <mdbutton class="icon-btn" horizontalAlignment="right" row={1} text="mdi-share-variant" variant="text" verticalAlignment="bottom" on:tap={() => shareCurrentItem()} />

        <stacklayout orientation="horizontal" row={2}>
            <mdbutton class="icon-btn" text="mdi-crop" variant="text" on:tap={() => cropEdit()} />
            <mdbutton class="icon-btn" text="mdi-rotate-left" variant="text" on:tap={() => rotateImageLeft()} />
            <mdbutton class="icon-btn" text="mdi-rotate-right" variant="text" on:tap={() => rotateImageRight()} />
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={3}>
            <Template let:item>
                <gridlayout padding={4} rows="*,24" on:tap={applyImageTransform(item)}>
                    <image colorMatrix={getColorMatrix(item.colorType)} imageRotation={currentSelectedImageRotation} src={currentSelectedImagePath} />
                    <label color="white" fontSize={10} row={1} text={item.text} textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
        <gridlayout backgroundColor="black" row={1} rowSpan={3} rows="*,auto" visibility={recrop ? 'visible' : 'hidden'}>
            <CropView {editingImage} bind:quadChanged bind:quads />
            <mdbutton  class="floating-btn" elevation={0} horizontalAlignment="center" margin="0" rippleColor="white" row={2} text="mdi-check" variant="text" on:tap={onRecropTapFinish} />
        </gridlayout>
    </gridlayout>
</page>
