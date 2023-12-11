<script context="module" lang="ts">
    import { Canvas, CanvasView, ColorMatrixColorFilter, LayoutAlignment, Paint, Rect, StaticLayout } from '@nativescript-community/ui-canvas';
    let bitmapPaint: Paint;
    const textPaint = new Paint();
    const bgPaint = new Paint();
    bgPaint.color = 'white';
    bgPaint.setShadowLayer(6, 0, 2, '#00000088');
</script>

<script lang="ts">
    import { ContentView, ImageSource } from '@akylas/nativescript';
    import { Pager } from '@nativescript-community/ui-pager';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import { lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { loadImage, recycleImages } from '~/utils/utils.common';
    import { colors } from '~/variables';
    import { getColorMatrix } from '~/utils/ui';
    import PDFCanvas from '~/services/pdf/PDFCanvas';
    import { writable } from 'svelte/store';

    $: ({ colorPrimary, colorSurface, colorOnSurface, colorOnSurfaceVariant } = $colors);
    interface Item {
        pages: OCRPage[];
    }

    const pdfCanvas = new PDFCanvas();
    const optionsStore = writable(pdfCanvas.options);
    let { pdfOrientation, pdfFormat } = pdfCanvas.options;
    $: ({ pdfOrientation, pdfFormat } = $optionsStore);
    optionsStore.subscribe((newValue) => {
        Object.assign(pdfCanvas.options, newValue);
    });
    // technique for only specific properties to get updated on store change
    export let documents: OCRDocument[];
    pdfCanvas.updatePages(documents);
    let pager: NativeViewElementNode<Pager>;
    let items = pdfCanvas.items;
    let currentPagerIndex = 0;

    const topBarHeight = 50;

    async function loadImagesForPage(pdfPageIndex) {
        await pdfCanvas.loadImagesForPage(pdfPageIndex);
        if (currentPagerIndex === pdfPageIndex) {
            let view = pager?.nativeElement?.getChildView(pdfPageIndex);
            if (view instanceof ContentView) {
                view = view.content;
            }
            console.log('test', view);
            (view as CanvasView)?.invalidate();
        }
    }
    // 10 par 3
    // 10 / 3 => 3
    function refresh() {
        pdfCanvas.updatePages(documents);
        items = pdfCanvas.items;
        loadImagesForPage(currentPagerIndex);
        // onPageIndexChanged({ object: pager?.nativeElement });
    }
    function drawPDFPage(item: Item, { canvas }: { canvas: Canvas }) {
        pdfCanvas.canvas = canvas;
        pdfCanvas.drawPages(item.pages);
    }

    onDestroy(() => {
        recycleImages(Object.values(pdfCanvas.imagesCache));
        pdfCanvas.imagesCache = {};
    });

    function onPageIndexChanged(event) {
        console.log('onPageIndexChanged', event.object.selectedIndex, Object.keys(event));
        currentPagerIndex = event.object.selectedIndex;
        loadImagesForPage(currentPagerIndex);
    }
    refresh();
</script>

<page id="pdfpreview" actionBarHidden={true} backgroundColor="#eff4f2">
    <gridlayout columns="*,*" rows="auto,*,auto">
        <drawer colSpan={2} row={1}>
            <gridlayout rows="auto,*" prop:mainContent>
                <gridlayout backgroundColor={colorSurface} columns="*,*" paddingBottom={5}>
                    <label color={colorOnSurface}>
                        <span text={lc('orientation') + ': '} />
                        <span color={colorOnSurfaceVariant} text={pdfOrientation} />
                    </label>
                    <label col={1} color={colorOnSurface}>
                        <span text={lc('format') + ': '} />
                        <span color={colorOnSurfaceVariant} text={pdfFormat} />
                    </label>
                </gridlayout>
                <pager bind:this={pager} {items} orientation="vertical" peaking={50} row={1} selectedIndex={currentPagerIndex} on:selectedIndexChange={onPageIndexChanged}>
                    <Template let:item>
                        <canvasView on:draw={(e) => drawPDFPage(item, e)} />
                    </Template>
                </pager>
            </gridlayout>

            <gridlayout prop:topDrawer backgroundColor={colorSurface}> </gridlayout>
        </drawer>

        <mdbutton row={2} text={lc('export')} />
        <mdbutton col={1} row={2} text={lc('open')} />

        <CActionBar colSpan={2} modalWindow={true} title={lc('preview')} />
    </gridlayout>
</page>
