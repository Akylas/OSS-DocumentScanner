<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    import DrawerElement from '@nativescript-community/ui-collectionview-swipemenu/svelte';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { AndroidActivityBackPressedEventData, Application, ApplicationSettings, ContentView, ObservableArray, Page, Screen, View, knownFolders } from '@nativescript/core';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { writable } from 'svelte/store';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { PDF_OPTIONS } from '~/models/localized_constant';
    import PDFCanvas, { PDFCanvasItem } from '~/services/pdf/PDFCanvas';
    import { exportPDFAsync } from '~/services/pdf/PDFExporter';
    import { showError } from '~/utils/error';
    import { recycleImages } from '~/utils/images';
    import { getColorMatrix, hideLoading, showLoading, showPopoverMenu, showSettings, showSliderPopover } from '~/utils/ui';
    import { colors, fonts, navigationBarHeight, screenHeightDips, screenRatio, screenWidthDips } from '~/variables';
    // let bitmapPaint: Paint;
    // const textPaint = new Paint();
    const bgPaint = new Paint();
    bgPaint.color = 'white';
    bgPaint.setShadowLayer(6, 0, 2, '#00000088');
    const PAGER_PEAKING = 30;
    const PAGER_PAGE_PADDING = 16;
</script>

<script lang="ts">
    $: ({ colorPrimary, colorSurfaceContainer, colorSurface, colorOnSurface, colorOnSurfaceVariant, colorOnSurfaceVariant2, colorSurfaceContainerHigh } = $colors);

    const pdfCanvas = new PDFCanvas();
    const optionsStore = writable(pdfCanvas.options);
    let { orientation, paper_size, color, items_per_page, page_padding, draw_ocr_overlay, draw_ocr_text } = pdfCanvas.options;
    $: ({ orientation, paper_size, color, items_per_page, page_padding, draw_ocr_overlay, draw_ocr_text } = $optionsStore);
    optionsStore.subscribe((newValue) => {
        // DEV_LOG && console.log('saving options', newValue);
        Object.assign(pdfCanvas.options, newValue);
        ApplicationSettings.setString('default_export_options', JSON.stringify(pdfCanvas.options));
    });
    export let pages: OCRPage[];
    export let document: OCRDocument = null;
    let pager: NativeViewElementNode<Pager>;
    let drawer: DrawerElement;
    let items: ObservableArray<PDFCanvasItem>;
    let currentPagerIndex = 0;

    async function loadImagesForPage(pdfPageIndex) {
        const item = items.getItem(pdfPageIndex);
        if (item.loading || !pdfCanvas.needsLoadImage(pdfPageIndex)) {
            return;
        }
        DEV_LOG && console.log('loadImagesForPage', pdfPageIndex);
        setTimeout(async () => {
            try {
                const item = items.getItem(pdfPageIndex);
                if (!item.loading) {
                    item.loading = true;
                    items.setItem(pdfPageIndex, item);
                }
                await pdfCanvas.loadImagesForPage(pdfPageIndex);
                // iOS needs a bit of time or it will break UICollectionView
                setTimeout(() => {
                    item.loading = false;
                    items.setItem(pdfPageIndex, item);
                }, 10);
            } catch (error) {
                console.error(error, error.stack);
            }
        }, 0);
    }
    function refresh() {
        pdfCanvas.updatePages(pages);
        items = new ObservableArray(pdfCanvas.items);
        DEV_LOG && console.log('refresh');
    }
    function requestPagesRedraw() {
        pager?.nativeElement?.refreshVisibleItems();
        pager?.nativeElement?.eachChild((view) => {
            if (view instanceof ContentView) {
                view = view.content;
            }
            (view as CanvasView)?.requestLayout();
            return true;
        });
    }
    function drawPDFPage(item: PDFCanvasItem, { canvas }: { canvas: Canvas }) {
        pdfCanvas.canvas = canvas;
        pdfCanvas.drawPages(item.index, item.pages, item.loading);
    }

    onDestroy(() => {
        recycleImages(Object.values(pdfCanvas.imagesCache));
        pdfCanvas.imagesCache = {};
    });

    function onPageIndexChanged(event) {
        // DEV_LOG && console.log('onPageIndexChanged', event.object.selectedIndex, new Error().stack);
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
                const filePath = await exportPDFAsync({ pages, document, folder: exportDirectory, filename: result.text });
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
            const filePath = await exportPDFAsync({ pages, document });
            hideLoading();
            openFile(filePath);
        } catch (error) {
            showError(error);
        }
    }
    // DEV_LOG && console.log('onItemLoading', index);
    function onItemLoading({ index, view }) {
        // const item = items.getItem(index);
        // if (!item.loading && !pdfCanvas.needsLoadImage(index)) {
        //     if (view instanceof ContentView) {
        //         view = view.content;
        //     }
        //     (view as CanvasView)?.invalidate();
        // } else {
        //     loadImagesForPage(index);
        // }
    }

    async function selectOption(option: string, event, valueTransformer?, fullRefresh = true) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(PDF_OPTIONS[option]).map((k) => ({ ...PDF_OPTIONS[option][k], id: k }));
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
            //         rowHeight: 58 * $fontScale,
            //         height: Math.min(58 * options.length * $fontScale + 8, 300),
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
        try {
            DEV_LOG && console.log('updateOption', option, value);
            optionsStore.update((state) => {
                state[option] = value;
                return state;
            });
            if (fullRefresh) {
                refresh();
            } else {
                requestPagesRedraw();
            }
        } catch (error) {
            showError(error);
        }
    }
    async function selectSilderOption(option: string, event, fullRefresh = false) {
        try {
            await showSliderPopover({
                debounceDuration: 0,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                value: pdfCanvas.options[option],
                onChange(value) {
                    updateOption(option, value, fullRefresh);
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    const tMargin = '4 10 4 10';
    const tPadding = '10 20 10 20';
    const tWidth = (Screen.mainScreen.widthDIPs - 41) / 2;
    const tHeight = 'auto';

    function getPageImageOptions(templatePagesCount: number, item: PDFCanvasItem, pageIndex: number, index?: number) {
        const page = item.pages[pageIndex];
        const result =
            orientation === 'landscape'
                ? {
                      row: pageIndex % 2,
                      col: templatePagesCount > 2 ? Math.floor(pageIndex / 2) : pageIndex % 2,
                      rowSpan: pageIndex === item.pages.length - 1 && pageIndex % 2 === 0 && templatePagesCount % 2 === 1 ? 2 : 1
                  }
                : {
                      row: templatePagesCount > 2 ? Math.floor(pageIndex / 2) : pageIndex % 2,
                      col: pageIndex % 2,
                      colSpan: pageIndex === item.pages.length - 1 && pageIndex % 2 === 0 && templatePagesCount % 2 === 1 ? 2 : 1
                  };
        if (!page) {
            return result;
        }
        Object.assign(result, {
            margin: paper_size === 'full' ? 0 : page_padding,
            src: page.imagePath,
            imageRotation: page.rotation,
            colorMatrix: color === 'black_white' ? getColorMatrix('grayscale') : page.colorMatrix || getColorMatrix(page.colorType)
        });
        // DEV_LOG && console.log('getPageImageOptions', templatePagesCount, pageIndex, index, orientation, paper_size, result);
        return result;
    }
    function itemTemplateSelector(item: PDFCanvasItem) {
        // DEV_LOG && console.log('itemTemplateSelector', items_per_page, paper_size, item.pages.length);
        return (paper_size === 'full' ? 1 : items_per_page) + '';
    }
    function getPageLayoutProps(item: PDFCanvasItem, templatePagesCount: number) {
        if (paper_size === 'full') {
            return {
                rows: '*',
                columns: '*',
                horizontalAlignment: 'center',
                verticalAlignment: 'middle'
            };
        }
        let pageRatio = 1;
        switch (paper_size) {
            case 'a4':
            default:
                pageRatio = 595 / 842;
                break;
        }
        if (orientation === 'landscape') {
            pageRatio = 1 / pageRatio;
        }
        const count = templatePagesCount > 2 ? Math.floor((templatePagesCount + 1) / 2) : templatePagesCount;
        const result =
            orientation === 'landscape'
                ? { columns: new Array(count).fill('*').join(','), rows: templatePagesCount >= 3 ? '*,*' : '*' }
                : { rows: new Array(count).fill('*').join(','), columns: templatePagesCount >= 3 ? '*,*' : '*' };
        if (pageRatio > screenRatio || pageRatio > 1) {
            const width = screenWidthDips - 2 * PAGER_PEAKING - 2 * PAGER_PAGE_PADDING;
            Object.assign(result, {
                horizontalAlignment: 'center',
                verticalAlignment: 'middle',
                width,
                height: width / pageRatio
                // height: Math.round(pageRatio > 1 ? 100 / pageRatio : 100 * pageRatio) + '%'
            });
        } else {
            const height = screenHeightDips - 2 * PAGER_PAGE_PADDING;
            Object.assign(result, {
                width: height * pageRatio,
                verticalAlignment: 'middle',
                height,
                horizontalAlignment: 'center'
            });
        }
        // DEV_LOG && console.log('getPageLayoutProps', templatePagesCount, orientation, paper_size, result);
        return result;
    }
    async function showPDFSettings() {
        showSettings({
            subSettingsOptions: 'pdf'
        });
    }

</script>

<!-- we use a frame to be able to navigate to settings from the modal-->
<frame id="modal-frame">
    <page id="pdfpreview" actionBarHidden={true} backgroundColor={colorSurfaceContainerHigh} screenOrientation="all">
        <gridlayout rows="auto,*">
            <drawer bind:this={drawer} row={1}>
                <gridlayout rows="auto,*,auto" prop:mainContent android:paddingBottom={$navigationBarHeight}>
                    <gridlayout backgroundColor={colorSurface} columns="*,*" padding={5} rows="auto,auto" on:tap={() => drawer?.open()}>
                        <label color={colorOnSurface} fontSize={15}>
                            <span text={lc('orientation') + ': '} />
                            <span color={colorOnSurfaceVariant2} fontWeight="bold" text={PDF_OPTIONS['orientation'][orientation].name} />
                        </label>
                        <label col={1} color={colorOnSurface} fontSize={15}>
                            <span text={lc('paper_size') + ': '} />
                            <span color={colorOnSurfaceVariant2} fontWeight="bold" text={PDF_OPTIONS['paper_size'][paper_size].name} />
                        </label>
                        <label colSpan={2} color={colorOnSurface} fontFamily={$fonts.mdi} fontSize={32} row={1} text="mdi-chevron-down" textAlignment="center" />
                    </gridlayout>
                    <pager
                        bind:this={pager}
                        id="pager"
                        {itemTemplateSelector}
                        {items}
                        orientation="horizontal"
                        pagesCount={1}
                        peaking={PAGER_PEAKING}
                        preserveIndexOnItemsChange={true}
                        row={1}
                        selectedIndex={currentPagerIndex}
                        on:selectedIndexChange={onPageIndexChanged}
                        on:itemLoading={onItemLoading}>
                        {#each { length: 6 } as _, i}
                            <Template key={`${i + 1}`} let:index let:item>
                                <gridlayout padding={PAGER_PAGE_PADDING}>
                                    <gridlayout backgroundColor="white" boxShadow="0 0 6 rgba(0, 0, 0, 0.8)" {...getPageLayoutProps(item, i + 1)}>
                                        {#each { length: i + 1 } as _, j}
                                            <image {...getPageImageOptions(i + 1, item, j, index)} horizontalAlignment="center" stretch="aspectFit" verticalAlignment="middle" />
                                        {/each}
                                    </gridlayout>
                                </gridlayout>
                            </Template>
                        {/each}
                    </pager>
                    <!-- <checkbox checked={draw_ocr_overlay} margin={14} row={1} text={lc('draw_ocr_overlay')} verticalAlignment="top" on:checkedChange={(e) => updateOption('draw_ocr_overlay', e.value)} /> -->

                    <pagerindicator horizontalAlignment="center" marginBottom={10} pagerViewId="pager" row={1} type="worm" verticalAlignment="bottom" />
                    <gridlayout backgroundColor={colorSurfaceContainerHigh} columns="*,*" row={2}>
                        <mdbutton text={lc('export')} on:tap={exportPDF} />
                        <mdbutton col={1} text={lc('open')} on:tap={openPDF} />
                    </gridlayout>
                </gridlayout>

                <wraplayout prop:topDrawer backgroundColor={colorSurface}>
                    <textfield
                        editable={false}
                        height={tHeight}
                        hint={lc('orientation')}
                        margin={tMargin}
                        padding={tPadding}
                        text={PDF_OPTIONS['orientation'][orientation].name}
                        variant="outline"
                        width={tWidth}
                        on:tap={(e) => selectOption('orientation', e)} />
                    <textfield
                        editable={false}
                        height={tHeight}
                        hint={lc('paper_size')}
                        margin={tMargin}
                        padding={tPadding}
                        text={PDF_OPTIONS['paper_size'][paper_size].name}
                        variant="outline"
                        width={tWidth}
                        on:tap={(e) => selectOption('paper_size', e)} />

                    <textfield
                        editable={false}
                        height={tHeight}
                        hint={lc('color')}
                        margin={tMargin}
                        padding={tPadding}
                        text={PDF_OPTIONS['color'][color].name}
                        variant="outline"
                        width={tWidth}
                        on:tap={(e) => selectOption('color', e)} />
                    <textfield
                        editable={false}
                        height={tHeight}
                        hint={lc('items_per_page')}
                        margin={tMargin}
                        padding={tPadding}
                        text={PDF_OPTIONS['items_per_page'][items_per_page].name}
                        variant="outline"
                        width={tWidth}
                        on:tap={(e) => selectOption('items_per_page', e, parseInt)} />
                    <textfield
                        editable={false}
                        height={tHeight}
                        hint={lc('page_padding')}
                        margin={tMargin}
                        padding={tPadding}
                        text={page_padding}
                        variant="outline"
                        width={tWidth}
                        on:tap={(e) => selectSilderOption('page_padding', e)} />
                    <!-- <checkbox
                    checked={reduce_image_size}
                    height={tHeight}
                    margin={tMargin}
                    text={lc('reduce_image_size')}
                    verticalAlignment="center"
                    width={tWidth}
                    on:checkedChange={(e) => updateOption('reduce_image_size', e.value)}
                    ios:margin={14} /> -->
                    <checkbox
                        checked={draw_ocr_text}
                        height={tHeight}
                        margin={tMargin}
                        text={lc('draw_ocr_text')}
                        verticalAlignment="center"
                        width={tWidth}
                        on:checkedChange={(e) => updateOption('draw_ocr_text', e.value)}
                        ios:margin={14} />
                    <label color={colorOnSurface} fontFamily={$fonts.mdi} fontSize={32} text="mdi-chevron-up" textAlignment="center" width="100%" on:tap={() => drawer?.close()} />
                </wraplayout>
            </drawer>

            <CActionBar modalWindow={true} title={lc('preview')}>
                <mdbutton class="actionBarButton" text="mdi-cog" variant="text" on:tap={showPDFSettings} />
            </CActionBar>
        </gridlayout>
    </page>
</frame>
