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
        document.getObservablePages().then((r) => ((items = r), (currentIndex = startPageIndex)));
    }
    export let startPageIndex: number = 0;
    let currentIndex;

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

    async function setColorType(type: number) {
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
        document.clearObservableArray(items);
    });
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*,200">
        <CActionBar title={document.name}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-file-pdf-box" on:tap={savePDF} />
        </CActionBar>
        <pager bind:this={pager} row={1} {items} selectedIndex={startPageIndex} on:selectedIndexChange={onSelectedIndex}>
            <Template let:item let:index>
                <gridLayout width="100%">
                    <image rotate={item.rotation} src={item.imageSource} stretch="aspectFit" />
                </gridLayout>
            </Template>
        </pager>
        <tabs row={2}>
            <tabStrip>
                <tabStripItem>
                    <label text={l('edit')} />
                    <image src="font://mdi-pencil" class="mdi" />
                </tabStripItem>
                <tabStripItem>
                    <label text={l('filters')} />
                    <image src="font://mdi-eyedropper-variant" class="mdi" />
                </tabStripItem>
            </tabStrip>

            <tabContentItem>
                <stackLayout orientation="horizontal">
                    <mdbutton variant="flat" class="icon-btn" text="mdi-crop" />
                    <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-right" on:tap={() => rotateImageRight()} />
                </stackLayout>
            </tabContentItem>
            <tabContentItem>
                <stackLayout orientation="horizontal">

                    <mdbutton variant="outline" text={l('none')} on:tap={() => setColorType(0)} />
                    <mdbutton variant="outline" text={l('gray')} on:tap={() => setColorType(1)} />
                    <mdbutton variant="outline" text={l('black_and_white')} on:tap={() => setColorType(2)} />
                </stackLayout>
            </tabContentItem>
        </tabs>
    </gridlayout>
</page>
