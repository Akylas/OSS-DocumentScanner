<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { ObservableArray } from '@nativescript/core';
    import { layout, openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { ColorMatricesTypes, getColorMatrix, hideLoading, showLoading } from '~/utils/ui';

    let pager: NativeViewElementNode<Pager>;
    let collectionView: NativeViewElementNode<CollectionView>;
    export let document: OCRDocument;
    let items: ObservableArray<OCRPage> = document.getObservablePages();
    console.log('items', items.length);
    export let startPageIndex: number = 0;
    let currentIndex = startPageIndex;
    const firstItem = items.getItem(currentIndex);
    let currentItemSubtitle = `${firstItem.width} x ${firstItem.height}`;

    let currentSelectedImagePath = firstItem.getImagePath();
    let currentSelectedImageRotation = firstItem.rotation;
    console.log('currentSelectedImageRotation', currentSelectedImageRotation);
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
        const newRotation = event.detail.detail.newRotation;
        if (newRotation === undefined) {
            return;
        }
        await document.updateImageConfig(currentIndex, {
            rotation: newRotation % 360
        });

        currentSelectedImageRotation = item.rotation;
        console.log('currentSelectedImageRotation changed', currentSelectedImageRotation);
        items.setItem(currentIndex, item);
        refreshCollectionView();
    }
    let colorType = 0;
    // $: {
    //     colorType = document.pages[currentIndex].colorType || 0;
    // }
    async function setColorType(type: number) {
        colorType = type;
        try {
            await document.updateImageConfig(currentIndex, {
                colorType: type
                // colorMatrix: getColorMatrix(type)
            });
            // pages.setItem(currentIndex, current);
        } catch (err) {
            showError(err);
        }
    }

    function applyRotation(newRotation) {
        console.log('applyRotation', newRotation);
        pager?.nativeView?.getChildView(currentIndex)?.getViewById('imageView').notify({ eventName: 'rotateAnimated', rotation: newRotation });
        // current['newRotation'] = (current['newRotation'] ?? current.rotation) + 90;
        // items.setItem(currentIndex, current);
    }
    async function rotateImageLeft() {
        const current = items.getItem(currentIndex);
        console.log('current', current.rotation);
        return applyRotation((current.rotation ?? 0) - 90);
    }
    async function rotateImageRight() {
        const current = items.getItem(currentIndex);
        return applyRotation((current.rotation ?? 0) + 90);
    }
    async function shareItem(item) {
        try {
            share({ file: await item.getImagePath() });
        } catch (error) {
            showError(error);
        }
    }

    async function shareCurrentItem() {
        shareItem(items.getItem(currentIndex));
    }

    async function setBlackWhiteLevel(event) {
        const current = items.getItem(currentIndex);
        if (current.colorType !== ColorType.BLACK_WHITE) {
            return;
        }

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
                        document.updateImageConfig(currentIndex, {
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
            const current = items.getItem(currentIndex);
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
                    //for now ignore typeorm error in delete about _observablesListeners
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    async function applyImageTransform(i) {
        const current = items.getItem(currentIndex);
        current.colorType = i.colorType;
        document.updateImageConfig(currentIndex, {
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
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*,auto,auto">
        <CActionBar title={document.name}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-pdf-box" on:tap={savePDF} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-delete" on:tap={deleteCurrentPage} />
        </CActionBar>
        <pager bind:this={pager} row={1} {items} selectedIndex={startPageIndex} on:selectedIndexChange={onSelectedIndex} transformers="zoomOut">
            <Template let:item>
                <gridLayout width="100%">
                    <RotableImageView id="imageView" zoomable={true} {item} on:rotated={(e) => onImageRotated(item, e)} sharedTransitionTag={`document_${document.id}_${item.id}`} />
                </gridLayout>
            </Template>
        </pager>
        <label padding={10} text={currentItemSubtitle} horizontalAlignment="left" row={1} verticalAlignment="bottom" fontSize={14} />
        <mdbutton variant="text" row={1} class="icon-btn" text="mdi-share-variant" on:tap={() => shareCurrentItem()} verticalAlignment="bottom" horizontalAlignment="right" />

        <stacklayout orientation="horizontal" row={2}>
            <mdbutton variant="text" class="icon-btn" text="mdi-crop" />
            <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-left" on:tap={() => rotateImageLeft()} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-right" on:tap={() => rotateImageRight()} />
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <collectionview bind:this={collectionView} height={85} row={3} items={filters} colWidth={60} orientation="horizontal">
            <Template let:item>
                <gridlayout rows="*,24" on:tap={applyImageTransform(item)} padding={4}>
                    <image src={currentSelectedImagePath} imageRotation={currentSelectedImageRotation} colorMatrix={getColorMatrix(item.colorType)} />
                    <label text={item.text} row={1} fontSize={10} color="white" textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
    </gridlayout>
</page>
