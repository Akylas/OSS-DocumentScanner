<script lang="ts">
    import ThirdPartySoftwareBottomSheet from './ThirdPartySoftwareBottomSheet.svelte';
    import { share } from '~/utils/share';
    import { mdiFontFamily, primaryColor } from '~/variables';
    import * as EInfo from '@nativescript-community/extendedinfo';
    import { l } from '~/helpers/locale';
    import { openLink, showLoading, hideLoading } from '~/utils/ui';
    import CActionBar from './CActionBar.svelte';
    import { showBottomSheet } from '~/utils/svelte/bottomsheet';
    import { Template } from 'svelte-native/components';
    import { accentColor } from '~/variables';
    import { Mat } from 'nativescript-opencv';
    import { ObservableArray, ImageSource, StackLayout } from '@nativescript/core';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import PdfView from './PDFView.svelte';
    import { navigate } from 'svelte-native';
    import { documentsService } from '~/services/documents';
    import { openUrl, openFile } from '@nativescript/core/utils';
    import { showError } from '~/utils/error';
    import { Imgproc } from 'nativescript-opencv';
    import { Pager } from '@nativescript-community/ui-pager';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { onDestroy } from 'svelte';

    let pager: NativeViewElementNode<Pager>;
    export let document: OCRDocument;
    let items: ObservableArray<OCRPage>;
    $: {
        items = document.getObservablePages();
        currentIndex = startPageIndex;
    }
    export let startPageIndex: number = 0;
    let currentIndex = 0;

    function onImageTap(item) {
        navigate({
            page: PdfView,
            transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                document
            }
        });
    }
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

    async function rotateImageRight() {
        try {
            const current = items.getItem(currentIndex);
            // current.config.rotation = (current.config.rotation) % 360
            await document.updateImageConfig(currentIndex, {
                rotation: (current.rotation + 90) % 360
            });
        } catch (err) {
            showError(err);
        }
    }
    let colorType = 0;
    $: {
        colorType = document.pages[currentIndex].colorType || 0;
    }
    async function setColorType(type: number) {
        colorType = type;
        console.log('setColorType', colorType);
        try {
            await document.updateImageConfig(currentIndex, {
                colorType: type
            });
            // pages.setItem(currentIndex, current);
        } catch (err) {
            showError(err);
        }
    }

    onDestroy(() => {
        // document.clearObservableArray(items);
    });
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*,50" backgroundColor="black">
        <CActionBar title={document.name}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-file-pdf-box" on:tap={savePDF} />
        </CActionBar>
        <pager bind:this={pager} row={1} {items} selectedIndex={startPageIndex} on:selectedIndexChange={onSelectedIndex}>
            <Template let:item let:index>
                <gridLayout width="100%">
                    <image rotate={item.rotation} src={item.getImageSource()} stretch="aspectFit" />
                    <mdbutton
                        color={accentColor}
                        variant="flat"
                        class="icon-btn"
                        text="mdi-share-variant"
                        on:tap={() => share({ image: item.imageSource })}
                        verticalAlignment="bottom"
                        horizontalAlignment="right"
                    />
                </gridLayout>
            </Template>
        </pager>
        <stacklayout orientation="horizontal" row={2}>
            <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-crop" />
            <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-rotate-right" on:tap={() => rotateImageRight()} />
            <mdbutton variant="flat" color="white" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} />
        </stacklayout>
    </gridlayout>
</page>
