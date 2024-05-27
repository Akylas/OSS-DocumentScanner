<script context="module" lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { throttle } from '@nativescript/core/utils';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { AnimationDefinition, Application, Color, ContentView, EventData, ImageSource, ObservableArray, Page, PageTransition, Screen, SharedTransition, StackLayout } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { QRCodeData, generateQRCodeImage } from 'plugin-nativeprocessor';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import PageIndicator from '~/components/common/PageIndicator.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import PdfEdit from '~/components/edit/DocumentEdit.svelte';
    import { l, lc } from '~/helpers/locale';
    import { currentRealTheme, isDarkTheme, onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { CARD_RATIO, IMAGE_CONTEXT_OPTIONS } from '~/utils/constants';
    import { documentsService } from '~/services/documents';
    import { qrcodeService } from '~/services/qrcode';
    import { showError } from '~/utils/error';
    import { recycleImages } from '~/utils/images';
    import { goBack, navigate } from '~/utils/svelte/ui';
    import {
        detectOCR,
        getColorMatrix,
        hideLoading,
        importAndScanImage,
        importImageFromCamera,
        onBackButton,
        showImagePopoverMenu,
        showLoading,
        showPDFPopoverMenu,
        showPopoverMenu,
        transformPages
    } from '~/utils/ui';
    import { colors, screenHeightDips, screenWidthDips, windowInset } from '~/variables';
    import { getPageColorMatrix } from '~/utils/matrix';
    const screenWidthPixels = Screen.mainScreen.widthPixels;
    const screenHeightPixels = Screen.mainScreen.heightPixels;

    const rowMargin = 8;
    // -10 show just a bit of the one hidden on the right
    const colWidth = screenWidthDips / 2 - 10;
    const itemHeight = (colWidth - 2 * rowMargin) * CARD_RATIO + 2 * rowMargin;
    interface Item {
        page: OCRPage;
        selected: boolean;
        index: number;
    }
    let VIEW_ID = 0;
</script>

<script lang="ts">
    $: qrcodeColorMatrix = isDarkTheme($currentRealTheme) ? [-1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, -1, 0, 0, 1, 1] : [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 1, 1];
    // technique for only specific properties to get updated on store change
    let { colorSurfaceContainerHigh, colorBackground, colorSurfaceContainer, colorPrimary, colorTertiary, colorOutline, colorSurface, colorOnSurface, colorOnSurfaceVariant, colorError } = $colors;
    $: ({ colorSurfaceContainerHigh, colorBackground, colorSurfaceContainer, colorPrimary, colorTertiary, colorOutline, colorSurface, colorOnSurface, colorOnSurfaceVariant, colorError } = $colors);

    export let document: OCRDocument;
    export let transitionOnBack = true;
    let topBackgroundColor = document.pages[0].colors?.[1] || colorTertiary;
    let statusBarStyle: any = new Color(topBackgroundColor).getBrightness() < 128 ? 'dark' : 'light';

    let qrcodes: QRCodeData;
    // let currentQRCodeImage: ImageSource;
    // let currentQRCode: QRCodeSingleData;
    let currentQRCodeIndex = 0;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let pager: NativeViewElementNode<Pager>;
    // let items: ObservableArray<Item> = null;
    onThemeChanged(() => {
        console.log('onThemeChanged', qrcodeColorMatrix);
        pager?.nativeElement.refreshVisibleItems();
    });
    $: console.log('qrcodeColorMatrix', qrcodeColorMatrix);
    // $: {
    const pages = document.getObservablePages();
    let items = pages.map((page, index) => ({ selected: false, page, index })) as any as ObservableArray<Item>;
    // pages.on('change', (event)=>{
    //     switch(event.action) {
    //         case ChangeType.Splice:
    //         items.splice(event.index, event.removed.length, event.added)
    //     }
    // });
    // }
    // function onImageUpdated (event: any)  {
    //         const index = event.data.index;
    //         const current = document.pages.getItem(index)
    //         current.config =
    //         const data = {
    //             image: document.images.getItem(index).page,
    //             config: document.imagesConfig[index],
    //         };
    //         console.log('onImageUpdated', event.data.index, document, data);
    //         document.pages.setItem(index, data);
    //     }

    let qrcodeImages: { [k: string]: ImageSource } = {};
    function clearQRCodeImages(timeout = 0) {
        const toClear = Object.values(qrcodeImages);
        qrcodeImages = {};
        setTimeout(() => {
            recycleImages(toClear);
        }, timeout);
    }

    function updateQRCodes() {
        DEV_LOG &&
            console.log(
                'updateQRCodes',
                document.pages.map((p) => p.imagePath)
            );
        qrcodes = document.pages.reduce((acc, page) => acc.concat(page.qrcode?.map((qr) => ({ ...qr, getImage: () => getQRCodeImage(qr) })) || []), []);
        clearQRCodeImages(100);
    }

    async function getQRCodeImage(qrcode) {
        DEV_LOG && console.log('getQRCodeImage', qrcode.text);
        if (qrcodeImages[qrcode.text]) {
            return qrcodeImages[qrcode.text];
        }
        qrcodeImages[qrcode.text] = await generateQRCodeImage(qrcode.text, qrcode.format, screenWidthPixels, screenHeightPixels * 0.4);
        return qrcodeImages[qrcode.text];
    }
    function onSelectedIndex(event) {
        currentQRCodeIndex = event.object.selectedIndex;
    }
    updateQRCodes();
    async function saveDocument() {
        try {
            showLoading(l('saving'));
            await document.save({}, true);
            hideLoading();
        } catch (err) {
            showError(err);
        }
    }
    function getSelectedPages() {
        const selected = [];
        items.forEach((d, index) => {
            if (d.selected) {
                selected.push(d.page);
            }
        });
        return selected;
    }
    function getSelectedPagesWithData() {
        const selected: { page: OCRPage; pageIndex: number; document: OCRDocument }[] = [];
        items.forEach((d, index) => {
            if (d.selected) {
                selected.push({ page: d.page, document, pageIndex: index });
            }
        });
        return selected;
    }
    async function showPDFPopover(event) {
        try {
            const pages = nbSelected > 0 ? getSelectedPages() : document.pages;
            await showPDFPopoverMenu(pages, document, event.object);
        } catch (err) {
            showError(err);
        }
    }
    async function showImageExportPopover(event) {
        try {
            await showImagePopoverMenu(getSelectedPages(), event.object);
        } catch (err) {
            showError(err);
        }
    }
    async function addPages(inverseUseSystemCamera = false) {
        try {
            await importImageFromCamera({ document, inverseUseSystemCamera });
            updateQRCodes();
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument(importPDFs = true) {
        try {
            await importAndScanImage(document, importPDFs, false);
        } catch (error) {
            showError(error);
        }
    }
    async function deleteDoc() {
        try {
            const result = await confirm({
                title: lc('delete'),
                message: lc('confirm_delete'),
                okButtonText: lc('delete'),
                cancelButtonText: lc('cancel')
            });
            if (result) {
                try {
                    await documentsService.deleteDocuments([document]);
                    items = null;
                    goBack({
                        // null is important to say no transition! (override enter transition)
                        transition: null
                    });
                } catch (err) {
                    console.error(err.err.stack);
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    let nbSelected = 0;
    function selectItem(item: Item) {
        if (!item.selected) {
            items.some((d, index) => {
                if (d === item) {
                    nbSelected++;
                    d.selected = true;
                    items.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectItem(item: Item) {
        if (item.selected) {
            items.some((d, index) => {
                if (d === item) {
                    nbSelected--;
                    d.selected = false;
                    items.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectAll() {
        if (items) {
            nbSelected = 0;
            items.splice(0, items.length, ...items.map((i) => ({ page: i.page, selected: false, index: i.index })));
        }
        // documents?.forEach((d, index) => {
        //         d.selected = false;
        //         documents.setItem(index, d);
        //     });
        // refresh();
    }
    let ignoreTap = false;
    function onItemLongPress(item: Item, event?) {
        // console.log('onItemLongPress', event && event.ios && event.ios.state);
        // if (event && event.ios && event.ios.state !== 1) {
        //     return;
        // }
        // if (event && event.ios) {
        //     ignoreTap = true;
        // }
        // console.log('onItemLongPress', item, Object.keys(event));
        if (item.selected) {
            unselectItem(item);
        } else {
            selectItem(item);
        }
    }
    async function onItemTap(item: Item) {
        DEV_LOG && console.log('onItemTap', ignoreTap, item);
        try {
            if (ignoreTap) {
                ignoreTap = false;
                return;
            }
            if (nbSelected > 0) {
                onItemLongPress(item);
            } else {
                const index = items.findIndex((p) => p.page === item.page);
                DEV_LOG && console.log('index', index);
                navigate({
                    page: PdfEdit,
                    transition:
                        __ANDROID__ && !CARD_APP
                            ? SharedTransition.custom(new PageTransition(300, undefined, 10), {
                                  pageStart: {
                                      sharedTransitionTags: {
                                          [`document_${document.id}_${item.page.id}`]: {}
                                      }
                                  }
                              })
                            : undefined,
                    // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                    props: {
                        document,
                        startPageIndex: index
                    }
                });
            }
        } catch (error) {
            showError(error);
        }
    }
    function onGoBack() {
        goBack(
            transitionOnBack
                ? undefined
                : {
                      transition: null
                  }
        );
    }
    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            data.cancel = true;
            if (nbSelected > 0) {
                unselectAll();
            } else {
                onGoBack();
            }
        });
    async function fullscreenSelectedPages() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: getSelectedPages().map((page) => ({
                    // sharedTransitionTag: `document_${doc.id}_${page.id}`,
                    name: page.name || document.name,
                    image: page.imagePath,
                    ...page
                })),
                startPageIndex: 0
            }
        });
    }
    async function deleteSelectedPages() {
        if (nbSelected > 0) {
            try {
                const result = await confirm({
                    title: lc('delete'),
                    message: lc('confirm_delete_pages', nbSelected),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
                if (result) {
                    const indexes = [];
                    items.forEach((d, index) => {
                        if (d.selected) {
                            indexes.push(index);
                        }
                    });
                    let minDeleteIndex = Number.MAX_SAFE_INTEGER;
                    for (let index = 0; index < indexes.length; index++) {
                        const toRemoveIndex = indexes[index];
                        minDeleteIndex = Math.min(minDeleteIndex, toRemoveIndex);
                        await document.deletePage(toRemoveIndex);

                        items.splice(toRemoveIndex, 1);
                    }
                    refreshCollectionView();
                    nbSelected = 0;
                }
            } catch (error) {
                showError(error);
            }
        }
    }

    function getImageView(index: number) {
        return collectionView?.nativeView?.getViewForItemAtIndex(index)?.getViewById<Img>('imageView');
    }

    function onPagesAdded(event: EventData & { pages: OCRPage[] }) {
        DEV_LOG && console.log('onPagesAdded', VIEW_ID);
        try {
            if (items) {
                const length = items.length;
                items.push(...event.pages.map((page, index) => ({ page, selected: false, index: length })));
            }
        } catch (error) {
            showError(error, { silent: true });
        }
    }
    function onDocumentPageUpdated(event: EventData & { pageIndex: number; imageUpdated: boolean }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        const current = items.getItem(index);
        if (current) {
            const page = document.getObservablePages().getItem(index);
            DEV_LOG && console.log('view onDocumentPageUpdated', index, event.imageUpdated, current.index);
            items.setItem(index, { ...current, page });
            if (!!event.imageUpdated) {
                const imageView = getImageView(index);
                if (imageView) {
                    imageView?.updateImageUri();
                } else {
                    getImagePipeline().evictFromCache(current.page.imagePath);
                }
            }
        }
    }
    function onDocumentPageDeleted(event: EventData & { pageIndex: number }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        items.splice(index, 1);
        items.forEach((item, index) => (item.index = index + 1));
    }
    function onDocumentsDeleted(event: EventData & { documents }) {
        if (event.documents.indexOf(document) !== -1) {
            goBack({
                // null is important to say no transition! (override enter transition)
                transition: null
            });
        }
    }
    function onDocumentUpdated(event: EventData & { doc: OCRDocument }) {
        if (document === event.doc) {
            document = event.doc;
        }
    }

    function onSnackMessageAnimation({ animationArgs }: EventData & { animationArgs: AnimationDefinition[] }) {
        if (fabHolder) {
            const snackAnimation = animationArgs[0];
            animationArgs.push({
                target: fabHolder.nativeView,
                translate: { x: 0, y: snackAnimation.translate.y === 0 ? -70 : 0 },
                duration: snackAnimation.duration
            });
        }
    }

    onMount(() => {
        DEV_LOG && console.log('CardView', 'onMount', VIEW_ID++);
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentUpdated', onDocumentUpdated);
        documentsService.on('documentsDeleted', onDocumentsDeleted);
        documentsService.on('documentPageDeleted', onDocumentPageDeleted);
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        document.on('pagesAdded', onPagesAdded);
        // refresh();
    });
    onDestroy(() => {
        clearQRCodeImages();
        DEV_LOG && console.log('CardView', 'onDestroy', VIEW_ID++, !!document);
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off('documentUpdated', onDocumentUpdated);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
        documentsService.off('documentPageDeleted', onDocumentPageDeleted);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        document?.off('pagesAdded', onPagesAdded);
    });
    // onThemeChanged(refreshCollectionView);

    function startDragging(item: Item) {
        const index = items.findIndex((p) => p.page === item.page);
        collectionView?.nativeElement.startDragging(index);
    }
    async function onItemReordered(e) {
        DEV_LOG && console.log('onItemReordered');
        (e.view as ContentView).content.opacity = 1;
        try {
            await document.movePage(e.index, e.data.targetIndex);
            topBackgroundColor = document.pages[0].colors?.[1] || colorTertiary;
            statusBarStyle = new Color(topBackgroundColor).getBrightness() < 128 ? 'dark' : 'light';
            updateQRCodes();
        } catch (error) {
            showError(error);
        }
    }
    async function onItemReorderStarting(e) {
        (e.view as ContentView).content.opacity = 0.6;
    }

    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);

    async function onQRCodeTap() {
        try {
            await qrcodeService.showQRCode([...pages], document, currentQRCodeIndex);
        } catch (error) {
            showError(error);
        }
    }
    async function showOptions(event) {
        if (nbSelected > 0) {
            const options = new ObservableArray([
                { id: 'share', name: lc('share_images'), icon: 'mdi-share-variant' },
                { id: 'fullscreen', name: lc('show_fullscreen_images'), icon: 'mdi-fullscreen' },
                { id: 'transform', name: lc('transform_images'), icon: 'mdi-auto-fix' },
                { id: 'ocr', name: lc('ocr_document'), icon: 'mdi-text-recognition' },
                { id: 'qrcode', name: lc('detect_qrcode'), icon: 'mdi-qrcode-scan' },
                { id: 'delete', name: lc('delete'), icon: 'mdi-delete', color: colorError }
            ] as any);
            return showPopoverMenu({
                options,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,

                onClose: async (item) => {
                    switch (item.id) {
                        case 'share':
                            showImageExportPopover(event);
                            break;
                        case 'fullscreen':
                            await fullscreenSelectedPages();
                            unselectAll();
                            break;
                        case 'ocr':
                            detectOCR({ pages: getSelectedPagesWithData() });
                            unselectAll();
                            break;
                        case 'qrcode':
                            try {
                                let found = false;
                                await Promise.all(
                                    getSelectedPagesWithData().map((page) =>
                                        qrcodeService.detectQRcode(document, page.pageIndex).then((r) => {
                                            found = found || r?.length > 0;
                                        })
                                    )
                                );
                                if (!found) {
                                    showSnack({ message: lc('no_qrcode_found') });
                                }
                            } catch (error) {
                                showError(error);
                            }
                            unselectAll();
                            break;
                        case 'delete':
                            deleteSelectedPages();
                            break;
                        case 'transform':
                            transformPages({ pages: getSelectedPagesWithData() });
                            unselectAll();
                            break;
                    }
                }
            });
        } else {
            const options = new ObservableArray([
                { id: 'transform', name: lc('transform_images'), icon: 'mdi-auto-fix' },
                { id: 'ocr', name: lc('ocr_document'), icon: 'mdi-text-recognition' },
                { id: 'delete', name: lc('delete'), icon: 'mdi-delete', color: colorError }
            ] as any);
            return showPopoverMenu({
                options,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,

                onClose: async (item) => {
                    switch (item.id) {
                        case 'ocr':
                            await detectOCR({ documents: [document] });
                            unselectAll();
                            break;
                        case 'transform':
                            transformPages({ documents: [document] });
                            unselectAll();
                            break;
                        case 'delete':
                            await deleteDoc();
                            break;
                    }
                }
            });
        }
    }
</script>

<page bind:this={page} id="cardview" actionBarHidden={true} {statusBarStyle}>
    <gridlayout backgroundColor={topBackgroundColor} rows="auto,auto,*">
        <CActionBar
            backgroundColor={topBackgroundColor}
            buttonsDefaultVisualState={statusBarStyle}
            forceCanGoBack={nbSelected > 0}
            labelsDefaultVisualState={statusBarStyle}
            onGoBack={nbSelected ? unselectAll : null}
            title={nbSelected ? lc('selected', nbSelected) : document.name}
            titleProps={{ autoFontSize: true, padding: 0 }}>
            <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
            <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
        </CActionBar>

        <collectionview
            bind:this={collectionView}
            id="view"
            autoReloadItemOnLayout={true}
            {colWidth}
            height={itemHeight}
            iosOverflowSafeArea={true}
            {items}
            orientation="horizontal"
            paddingBottom={88}
            reorderEnabled={true}
            row={1}
            rowHeight={itemHeight}
            on:itemReordered={onItemReordered}
            on:itemReorderStarting={onItemReorderStarting}>
            <Template let:index let:item>
                <gridlayout
                    backgroundColor={item.page.colors?.[0]}
                    borderRadius={12}
                    elevation={6}
                    margin={12}
                    rippleColor={colorSurface}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}>
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        decodeWidth={colWidth}
                        item={item.page}
                        sharedTransitionTag={`document_${document.id}_${item.page.id}`}
                        stretch="aspectFill"
                        width="100%" />
                    <!-- <canvaslabel height="100%" padding="10 0 0 0">
                        <cspan fontSize={14} fontWeight="normal" paddingBottom={20} text={`${item.page.width} x ${item.page.height}`} textAlignment="right" verticalAlignment="bottom" />
                        <cspan fontSize={14} fontWeight="normal" text={filesize(item.page.size)} textAlignment="right" verticalAlignment="bottom" />
                    </canvaslabel> -->
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                    <PageIndicator horizontalAlignment="right" margin={2} rowSpan={2} text={index + 1} on:longPress={() => startDragging(item)} />
                </gridlayout>
            </Template>
        </collectionview>
        <gridlayout backgroundColor={colorBackground} borderRadius="10 10 0 0" padding={16} row={2} rows="auto,auto,*">
            <pager bind:this={pager} id="pager" height={screenHeightDips * 0.4} items={qrcodes} selectedIndex={currentQRCodeIndex} on:selectedIndexChange={onSelectedIndex}>
                <Template let:index let:item>
                    <gridlayout rows="*,auto" on:tap={onQRCodeTap}>
                        <image ios:contextOptions={IMAGE_CONTEXT_OPTIONS} colorMatrix={qrcodeColorMatrix} sharedTransitionTag={'qrcode' + index} src={item.getImage} stretch="aspectFit" />
                        <label fontSize={30} fontWeight="bold" row={1} sharedTransitionTag={'qrcodelabel' + index} text={item?.text} textAlignment="center" />
                    </gridlayout>
                </Template>
            </pager>
            <label text={lc('no_qrcode')} textAlignment="center" verticalTextAlignment="center" visibility={qrcodes.length ? 'hidden' : 'visible'} />
            <pagerindicator
                color={colorSurfaceContainerHigh}
                horizontalAlignment="center"
                marginBottom={10}
                pagerViewId="pager"
                row={1}
                selectedColor={colorOnSurfaceVariant}
                type="worm"
                verticalAlignment="bottom" />
            <stacklayout bind:this={fabHolder} horizontalAlignment="right" orientation="horizontal" rowSpan={3} verticalAlignment="bottom" android:marginBottom={$windowInset.bottom}>
                {#if __IOS__}
                    <mdbutton class="small-fab" text="mdi-image-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(false), 500)} />
                {/if}
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-file-document-plus-outline" on:tap={throttle(() => importDocument(), 500)} />
                <mdbutton class="fab" margin="16 16 16 8" text="mdi-plus" on:tap={throttle(() => addPages(), 500)} on:longPress={() => addPages(true)} />
            </stacklayout>
        </gridlayout>
    </gridlayout>
</page>
