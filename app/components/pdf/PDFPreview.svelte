<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    // let bitmapPaint: Paint;
    // const textPaint = new Paint();
    const bgPaint = new Paint();
    bgPaint.color = 'white';
    bgPaint.setShadowLayer(6, 0, 2, '#00000088');
</script>

<script lang="ts">
    import { ApplicationSettings, ContentView, ObservableArray, knownFolders } from '@akylas/nativescript';
    import DrawerElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { writable } from 'svelte/store';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import PDFCanvas from '~/services/pdf/PDFCanvas';
    import { exportPDFAsync } from '~/services/pdf/PDFExporter';
    import { showError } from '~/utils/error';
    import { hideLoading, showLoading, showPopoverMenu } from '~/utils/ui';
    import { recycleImages } from '~/utils/utils.common';
    import { colors, fonts } from '~/variables';

    $: ({ colorPrimary, colorSurfaceContainer, colorSurface, colorOnSurface, colorOnSurfaceVariant, colorOnSurfaceVariant2, colorSurfaceContainerHigh } = $colors);
    interface Item {
        index: number;
        pages: OCRPage[];
    }

    const pdfCanvas = new PDFCanvas();
    const optionsStore = writable(pdfCanvas.options);
    let { orientation, paper_size, color, items_per_page, page_padding, reduce_image_size, draw_ocr_overlay, draw_ocr_text } = pdfCanvas.options;
    $: ({ orientation, paper_size, color, items_per_page, page_padding, reduce_image_size, draw_ocr_overlay, draw_ocr_text } = $optionsStore);
    optionsStore.subscribe((newValue) => {
        Object.assign(pdfCanvas.options, newValue);
        ApplicationSettings.setString('default_export_options', JSON.stringify(pdfCanvas.options));
    });
    // technique for only specific properties to get updated on store change
    export let documents: OCRDocument[];
    // pdfCanvas.updatePages(documents);
    let pager: NativeViewElementNode<Pager>;
    let drawer: DrawerElement;
    let items: ObservableArray<{ index: number; pages: OCRPage[]; loading?: boolean }>;
    let currentPagerIndex = 0;

    const topBarHeight = 50;

    async function loadImagesForPage(pdfPageIndex) {
        if (!pdfCanvas.needsLoadImage(pdfPageIndex)) {
            return;
        }
        setTimeout(async () => {
            try {
                const item = items.getItem(pdfPageIndex);
                item.loading = true;
                items.setItem(pdfPageIndex, item);
                await pdfCanvas.loadImagesForPage(pdfPageIndex);
                item.loading = false;
                items.setItem(pdfPageIndex, item);
                // if (currentPagerIndex === pdfPageIndex) {
                // let view = pager?.nativeElement?.getChildView(pdfPageIndex);
                // if (view instanceof ContentView) {
                //     view = view.content;
                // }
                // (view as CanvasView)?.invalidate();
                // }
            } catch (error) {
                console.error(error, error.stack);
            }
        }, 0);
    }
    function refresh() {
        pdfCanvas.updatePages(documents);
        items = new ObservableArray(pdfCanvas.items);
    }
    function requestPagesRedraw() {
        pager?.nativeElement?.eachChild((view) => {
            if (view instanceof ContentView) {
                view = view.content;
            }
            (view as CanvasView)?.invalidate();
            return true;
        });
    }
    function drawPDFPage(item: Item, { canvas }: { canvas: Canvas }) {
        pdfCanvas.canvas = canvas;
        pdfCanvas.drawPages(item.index, item.pages);
    }

    onDestroy(() => {
        recycleImages(Object.values(pdfCanvas.imagesCache));
        pdfCanvas.imagesCache = {};
    });

    function onPageIndexChanged(event) {
        currentPagerIndex = event.object.selectedIndex;
        // loadImagesForPage(currentPagerIndex);
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
                    __ANDROID__ ? android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() : knownFolders.externalDocuments().path
                );
                const filePath = await exportPDFAsync(documents, exportDirectory, result.text);
                hideLoading();
                const onSnack = await showSnack({ message: lc('pdf_saved', filePath), actionText: lc('open') });
                if (onSnack.reason === 'action') {
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
            const filePath = await exportPDFAsync(documents);
            hideLoading();
            openFile(filePath);
        } catch (error) {
            showError(error);
        }
    }
    function onItemLoading({ index }) {
        // DEV_LOG && console.log('onItemLoading', index);
        loadImagesForPage(index);
    }
    const OPTIONS = {
        orientation: {
            portrait: { name: lc('portrait') },
            landscape: { name: lc('landscape') }
        },
        paper_size: {
            full: { name: lc('full') },
            a4: { name: lc('a4') },
            a3: { name: lc('a3') }
        },
        color: {
            color: { name: lc('color') },
            black_white: { name: lc('black_white') }
        },
        items_per_page: {
            1: { name: 1 },
            2: { name: 2 },
            3: { name: 3 },
            4: { name: 4 },
            5: { name: 5 },
            6: { name: 6 }
        }
    };
    async function selectOption(option: string, event, valueTransformer?, fullRefresh = true) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(OPTIONS[option]).map((k) => ({ ...OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                options,
                anchor: event.object,
                onClose: (item) => {
                    updateOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
                }
            });
            // await showPopover({
            //     backgroundColor: colorSurfaceContainer,
            //     view: OptionSelect,
            //     anchor: event.object,
            //     horizPos: HorizontalPosition.ALIGN_LEFT,
            //     vertPos: VerticalPosition.CENTER,
            //     props: {
            //         borderRadius: 10,
            //         elevation: 4,
            //         margin: 4,
            //         backgroundColor: colorSurfaceContainer,
            //         containerColumns: 'auto',
            //         rowHeight: 58 * $systemFontScale,
            //         height: Math.min(58 * options.length * $systemFontScale + 8, 300),
            //         width: 150,
            //         options,
            //         onClose: (item) => {
            //             closePopover();
            //             updateOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
            //         }
            //     }
            // });
        } catch (error) {
            showError(error);
        }
    }

    function updateOption(option: string, value, fullRefresh = false) {
        optionsStore.update((state) => {
            state[option] = value;
            return state;
        });
        if (fullRefresh) {
            refresh();
        } else {
            requestPagesRedraw();
        }
    }
    async function selectSilderOption(option: string, event, fullRefresh = false) {
        try {
            const component = (await import('~/components/common/SliderPopover.svelte')).default;

            await showPopover({
                backgroundColor: colorSurfaceContainer,
                view: component,
                anchor: event.object,
                horizPos: HorizontalPosition.ALIGN_LEFT,
                vertPos: VerticalPosition.CENTER,
                props: {
                    min: 0,
                    max: 100,
                    step: 1,
                    width: '80%',
                    value: pdfCanvas.options[option],
                    onChange: (value) => {
                        updateOption(option, value, fullRefresh);
                    }
                }

                // trackingScrollView: 'collectionView'
            });
        } catch (error) {
            showError(error);
        }
    }
</script>

<page id="pdfpreview" actionBarHidden={true} backgroundColor={colorSurfaceContainerHigh} screenOrientation="all">
    <gridlayout rows="auto,*">
        <drawer bind:this={drawer} row={1}>
            <gridlayout rows="auto,*,auto" prop:mainContent>
                <gridlayout backgroundColor={colorSurface} columns="*,*" padding={5} rows="auto,auto" on:tap={() => drawer?.open()}>
                    <label color={colorOnSurface} fontSize={15}>
                        <span text={lc('orientation') + ': '} />
                        <span color={colorOnSurfaceVariant2} fontWeight="bold" text={OPTIONS['orientation'][orientation].name} />
                    </label>
                    <label col={1} color={colorOnSurface} fontSize={15}>
                        <span text={lc('paper_size') + ': '} />
                        <span color={colorOnSurfaceVariant2} fontWeight="bold" text={OPTIONS['paper_size'][paper_size].name} />
                    </label>
                    <label colSpan={2} color={colorOnSurface} fontFamily={$fonts.mdi} fontSize={32} row={1} text="mdi-chevron-down" textAlignment="center" />
                </gridlayout>
                <!-- <gridlayout row={1} rowSpan={2}> -->
                <pager
                    bind:this={pager}
                    id="pager"
                    {items}
                    orientation="horizontal"
                    pagesCount={1}
                    peaking={30}
                    preserveIndexOnItemsChange={true}
                    row={1}
                    rowSpan={2}
                    selectedIndex={currentPagerIndex}
                    on:selectedIndexChange={onPageIndexChanged}
                    on:itemLoading={onItemLoading}>
                    <Template let:item>
                        <canvasView on:draw={(e) => drawPDFPage(item, e)}>
                            <stacklayout horizontalAlignment="center" verticalAlignment="middle" visibility={item.loading ? 'visible' : 'hidden'}>
                                <label color="black" text={lc('images_loading')} />
                                <activityindicator busy={true} />
                            </stacklayout>
                        </canvasView>
                    </Template>
                </pager>
                <checkbox checked={draw_ocr_overlay} row={1} text={lc('draw_ocr_overlay')} verticalAlignment="top" on:checkedChange={(e) => updateOption('draw_ocr_overlay', e.value)} />

                <pagerindicator horizontalAlignment="center" marginBottom={10} pagerViewId="pager" row={1} type="worm" verticalAlignment="bottom" />
                <!-- </gridlayout> -->

                <!-- <blurview blurRadius={10} rowSpan={3} height={50}  verticalAlignment="bottom"/> -->
                <gridlayout backgroundColor={colorSurfaceContainerHigh} columns="*,*" row={2}>
                    <mdbutton text={lc('export')} on:tap={exportPDF} />
                    <mdbutton col={1} text={lc('open')} on:tap={openPDF} />
                </gridlayout>
            </gridlayout>

            <gridlayout prop:topDrawer , backgroundColor={colorSurface} columns="*,*" height={230} rows="*,*,*,*,auto">
                <textfield editable={false} hint={lc('orientation')} margin="4 10 4 10" padding="0 20 0 20" text={orientation} variant="outline" on:tap={(e) => selectOption('orientation', e)} />
                <textfield col={1} editable={false} hint={lc('paper_size')} margin="4 10 4 10" padding="0 20 0 20" text={paper_size} variant="outline" on:tap={(e) => selectOption('paper_size', e)} />

                <textfield editable={false} hint={lc('color')} margin="4 10 4 10" padding="0 20 0 20" row={1} text={color} variant="outline" on:tap={(e) => selectOption('color', e)} />
                <textfield
                    col={1}
                    editable={false}
                    hint={lc('items_per_page')}
                    margin="4 10 4 10"
                    padding="0 20 0 20"
                    row={1}
                    text={items_per_page}
                    variant="outline"
                    on:tap={(e) => selectOption('items_per_page', e, parseInt)} />
                <textfield
                    editable={false}
                    hint={lc('page_padding')}
                    margin="4 10 4 10"
                    padding="0 20 0 20"
                    row={2}
                    text={page_padding}
                    variant="outline"
                    on:tap={(e) => selectSilderOption('page_padding', e)} />
                <checkbox checked={reduce_image_size} col={1} row={2} text={lc('reduce_image_size')} verticalAlignment="bottom" on:checkedChange={(e) => updateOption('reduce_image_size', e.value)} />
                <checkbox checked={draw_ocr_text} row={3} text={lc('draw_ocr_text')} verticalAlignment="bottom" on:checkedChange={(e) => updateOption('draw_ocr_text', e.value)} />
                <label colSpan={2} color={colorOnSurface} fontFamily={$fonts.mdi} fontSize={32} row={4} text="mdi-chevron-up" textAlignment="center" on:tap={() => drawer?.close()} />
            </gridlayout>
        </drawer>

        <CActionBar modalWindow={true} title={lc('preview')} />
    </gridlayout>
</page>
