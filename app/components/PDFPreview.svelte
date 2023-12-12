<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    let bitmapPaint: Paint;
    const textPaint = new Paint();
    const bgPaint = new Paint();
    bgPaint.color = 'white';
    bgPaint.setShadowLayer(6, 0, 2, '#00000088');
</script>

<script lang="ts">
    import { ApplicationSettings, ContentView, ObservableArray } from '@akylas/nativescript';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { writable } from 'svelte/store';
    import CActionBar from '~/components/CActionBar.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import PDFCanvas from '~/services/pdf/PDFCanvas';
    import PDFExportCanvas from '~/services/pdf/PDFExportCanvas.android';
    import { showError } from '~/utils/error';
    import { hideLoading, showLoading } from '~/utils/ui';
    import { recycleImages } from '~/utils/utils.common';
    import { colors } from '~/variables';

    $: ({ colorPrimary, colorSurface, colorOnSurface, colorOnSurfaceVariant, colorOnSurfaceVariant2, colorSurfaceContainerHigh } = $colors);
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
    // pdfCanvas.updatePages(documents);
    let pager: NativeViewElementNode<Pager>;
    let items: ObservableArray<{ pages: OCRPage[]; loading?: boolean }>;
    let currentPagerIndex = 0;

    const topBarHeight = 50;

    async function loadImagesForPage(pdfPageIndex) {
        const item = items.getItem(pdfPageIndex);
        item.loading = true;
        items.setItem(pdfPageIndex, item);
        await pdfCanvas.loadImagesForPage(pdfPageIndex);
        item.loading = false;
        items.setItem(pdfPageIndex, item);
        if (currentPagerIndex === pdfPageIndex) {
            let view = pager?.nativeElement?.getChildView(pdfPageIndex);
            if (view instanceof ContentView) {
                view = view.content;
            }
            (view as CanvasView)?.invalidate();
        }
    }
    // 10 par 3
    // 10 / 3 => 3
    function refresh() {
        pdfCanvas.updatePages(documents);
        items = new ObservableArray(pdfCanvas.items);
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

    async function exportPDF() {
        try {
            const result = await prompt({
                okButtonText: lc('ok'),
                cancelButtonText: lc('cancel'),
                defaultText: Date.now() + '.pdf',
                hintText: lc('pdf_filename')
            });
            if (result?.result && result?.text?.length) {
                showLoading(l('exporting'));
                const exportDirectory = ApplicationSettings.getString(
                    'pdf_export_directory',
                    android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath()
                );
                const exporter = new PDFExportCanvas();
                const filePath = await exporter.export(documents, exportDirectory, result.text);
                hideLoading();
                const onSnack = await showSnack({ message: lc('pdf_saved', filePath), actionText: lc('open') });
                DEV_LOG && console.log('onSnack', onSnack);
                if (onSnack.reason === 'action') {
                    DEV_LOG && console.log('openFile', filePath);
                    openFile(filePath);
                }
            }
        } catch (error) {
            showError(error);
        }
    }
    async function openPDF() {
        try {
            showLoading(l('exporting'));
            const exporter = new PDFExportCanvas();
            const filePath = await exporter.export(documents);
            hideLoading();
            openFile(filePath);
        } catch (error) {
            showError(error);
        }
    }
</script>

<page id="pdfpreview" actionBarHidden={true} backgroundColor={colorSurfaceContainerHigh}>
    <gridlayout rows="auto,*">
        <drawer row={1}>
            <gridlayout rows="auto,*,auto" prop:mainContent>
                <gridlayout backgroundColor={colorSurface} columns="*,*" padding={5}>
                    <label color={colorOnSurface}>
                        <span text={lc('orientation') + ': '} />
                        <span color={colorOnSurfaceVariant2} text={pdfOrientation} />
                    </label>
                    <label col={1} color={colorOnSurface}>
                        <span text={lc('format') + ': '} />
                        <span color={colorOnSurfaceVariant2} text={pdfFormat} />
                    </label>
                </gridlayout>
                <!-- <gridlayout row={1} rowSpan={2}> -->
                <pager bind:this={pager} {items} orientation="vertical" peaking={50} row={1} selectedIndex={currentPagerIndex} on:selectedIndexChange={onPageIndexChanged}>
                    <Template let:item>
                        <canvasView on:draw={(e) => drawPDFPage(item, e)}>
                            <stacklayout horizontalAlignment="center" verticalAlignment="middle" visibility={item.loading !== false ? 'visible' : 'hidden'}>
                                <label text={lc('images_loading')} />
                                <activityindicator busy={true} />
                            </stacklayout>
                        </canvasView>
                    </Template>
                </pager>
                <!-- </gridlayout> -->

                <!-- <blurview blurRadius={10} rowSpan={3} height={50}  verticalAlignment="bottom"/> -->
                <gridlayout backgroundColor={colorSurfaceContainerHigh} columns="*,*" row={2}>
                    <mdbutton text={lc('export')} on:tap={exportPDF} />
                    <mdbutton col={1} text={lc('open')} on:tap={openPDF} />
                </gridlayout>
            </gridlayout>

            <gridlayout prop:topDrawer backgroundColor={colorSurface} height={200}> </gridlayout>
        </drawer>

        <CActionBar modalWindow={true} title={lc('preview')} />
    </gridlayout>
</page>
