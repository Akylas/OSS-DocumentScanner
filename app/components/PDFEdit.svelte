<script lang="ts">
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { ObservableArray } from '@nativescript/core';
    import { layout, openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { goBack } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { l, lc } from '~/helpers/locale';
    import { ColorType, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { getColorMatrix, hideLoading, showLoading } from '~/utils/ui';
    import CActionBar from './CActionBar.svelte';
    import RotableImageView from './RotableImageView.svelte';

    let pager: NativeViewElementNode<Pager>;
    export let document: OCRDocument;
    let items: ObservableArray<OCRPage>;
    $: {
        items = document.getObservablePages();
    }
    export let startPageIndex: number = 0;
    let currentIndex = startPageIndex;
    console.log('currentIndex', currentIndex, startPageIndex);

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
        if (event.detail.newRotation === undefined) {
            return;
        }
        await document.updateImageConfig(currentIndex, {
            rotation: event.detail.newRotation % 360
        });
        items.setItem(currentIndex, item);
    }
    let colorType = 0;
    $: {
        colorType = document.pages[currentIndex].colorType || 0;
    }
    async function setColorType(type: number) {
        colorType = type;
        try {
            await document.updateImageConfig(currentIndex, {
                colorType: type,
                colorMatrix: getColorMatrix(type)
            });
            // pages.setItem(currentIndex, current);
        } catch (err) {
            showError(err);
        }
    }

    function rotateImageRight() {
        const current = items.getItem(currentIndex);
        current['newRotation'] = current.rotation + 90;
        items.setItem(currentIndex, current);
    }
    async function shareItem(item) {
        try {
            share({ file: await item.getImagePath() });
        } catch (error) {
            showError(error);
        }
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
    function getItemColorMatrix(item) {
        const result = item.colorMatrix || getColorMatrix(item.colorType);
        return result;
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
                } catch (err) {
                    //for now ignore typeorm error in delete about _observablesListeners
                }
            }
        } catch (err) {
            showError(err);
        }
    }
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*,50">
        <CActionBar title={document.name}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-pdf-box" on:tap={savePDF} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-delete" on:tap={deleteCurrentPage} />
        </CActionBar>
        <pager bind:this={pager} row={1} {items} selectedIndex={startPageIndex} on:selectedIndexChange={onSelectedIndex}>
            <Template let:item let:index>
                <gridLayout width="100%">
                    <RotableImageView zoomable={true} {item} on:rotated={(e) => onImageRotated(item, e)} />

                    <label padding={10} text={`${item.width} x ${item.height}`} verticalAlignment="bottom" fontSize={14} />
                    <mdbutton variant="flat" class="icon-btn" text="mdi-share-variant" on:tap={() => shareItem(item)} verticalAlignment="bottom" horizontalAlignment="right" />
                </gridLayout>
            </Template>
        </pager>
        <stacklayout orientation="horizontal" row={2}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-crop" />
            <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-right" on:tap={() => rotateImageRight()} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} />
        </stacklayout>
    </gridlayout></page
>
