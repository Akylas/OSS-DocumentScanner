<script lang="ts">
    import { request } from '@nativescript-community/perms';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img } from '@nativescript-community/ui-image';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { Application, Color, ContentView, EventData, ImageSource, ObservableArray, PageTransition, Screen, SharedTransition } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { QRCodeData, QRCodeSingleData, generateQRCodeImage } from 'plugin-nativeprocessor';
    import { onDestroy, onMount } from 'svelte';
    import { goBack, navigate } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, showModal } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import Camera from '~/components/Camera.svelte';
    import PdfEdit from '~/components/DocumentEdit.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import SelectedIndicator from '~/components/SelectedIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { hideLoading, importAndScanImage, showLoading } from '~/utils/ui';
    import { recycleImages } from '~/utils/utils.common';
    import { colors, screenWidthDips } from '~/variables';
    import PageIndicator from './PageIndicator.svelte';
    export const screenWidthPixels = Screen.mainScreen.widthPixels;
    export const screenHeightPixels = Screen.mainScreen.heightPixels;

    const rowMargin = 8;
    const colWidth = screenWidthDips / 2;
    const itemHeight = (colWidth - 2 * rowMargin) * 0.584 + 2 * rowMargin;

    const qrcodeColorMatrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 1, 1];
    // technique for only specific properties to get updated on store change
    $: ({ colorSurfaceContainerHigh, colorBackground, colorSurfaceContainer, colorPrimary, colorTertiary, colorOutline, colorSurface, colorOnSurfaceVariant } = $colors);
    interface Item {
        page: OCRPage;
        selected: boolean;
        index: number;
    }

    export let document: OCRDocument;
    const topBackgroundColor = document.pages[0].colors?.[1] || colorTertiary;
    const statusBarStyle = new Color(topBackgroundColor).isDark() ? 'dark' : 'light';
    const defaultVisualState = statusBarStyle === 'dark' ? 'black' : null;

    let qrcodes: QRCodeData;
    let currentQRCodeImage: ImageSource;
    let currentQRCode: QRCodeSingleData;
    const currentQRCodeIndex = 0;
    let collectionView: NativeViewElementNode<CollectionView>;
    // let items: ObservableArray<Item> = null;

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

    function updateQRCodes() {
        qrcodes = document.pages.reduce((acc, page) => acc.concat(page.qrcode || []), []);

        if (qrcodes.length) {
            currentQRCode = qrcodes[currentQRCodeIndex];
            generateQRCodeImage(currentQRCode.text, currentQRCode.format, screenWidthPixels, screenWidthPixels * 0.4)
                .then((result) => {
                    const oldImage = currentQRCodeImage;
                    currentQRCodeImage = result;
                    if (oldImage) {
                        recycleImages(oldImage);
                    }
                })
                .catch(showError);
        }
    }
    updateQRCodes();
    async function saveDocument() {
        try {
            showLoading(l('saving'));
            await document.save();
            hideLoading();
        } catch (err) {
            showError(err);
        }
    }
    async function showPDFPopover(event) {
        try {
            const component = (await import('~/components/PDFExportPopover.svelte')).default;
            await showPopover({
                view: component,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                props: {
                    document
                }
            });
        } catch (err) {
            showError(err);
        }
    }
    async function addPages() {
        try {
            await request('camera');
            document = await showModal({
                page: Camera,
                fullscreen: true,
                props: {
                    modal: true,
                    document
                }
            });
            updateQRCodes();
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage(document);
            if (doc) {
                const component = (await import('~/components/DocumentEdit.svelte')).default;
                navigate({
                    page: component,
                    props: {
                        document,
                        startPageIndex: document.pages.length - 1
                    }
                });
            }
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
                    goBack();
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
        nbSelected = 0;
        items.splice(0, items.length, ...items.map((i) => ({ page: i.page, selected: false, index: i.index })));
        // documents?.forEach((d, index) => {
        //         d.selected = false;
        //         documents.setItem(index, d);
        //     });
        // refresh();
    }
    let ignoreTap = false;
    function onItemLongPress(item: Item, event?) {
        // console.log('onItemLongPress', event && event.ios && event.ios.state);
        if (event && event.ios && event.ios.state !== 1) {
            return;
        }
        if (event && event.ios) {
            ignoreTap = true;
        }
        // console.log('onItemLongPress', item, Object.keys(event));
        if (item.selected) {
            unselectItem(item);
        } else {
            selectItem(item);
        }
    }
    async function onItemTap(item: Item) {
        try {
            if (ignoreTap) {
                ignoreTap = false;
                return;
            }
            if (nbSelected > 0) {
                onItemLongPress(item);
            } else {
                const index = items.findIndex((p) => p.page === item.page);
                navigate({
                    page: PdfEdit,
                    transition: __ANDROID__
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
    function onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (__ANDROID__) {
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            }
        }
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
        const length = items.length;
        items.push(...event.pages.map((page, index) => ({ page, selected: false, index: length })));
    }
    function onDocumentPageUpdated(event: EventData & { pageIndex: number; imageUpdated: boolean }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        const current = items.getItem(index);
        const page = document.getObservablePages().getItem(index);
        items.setItem(index, { selected: current.selected, page, index: current.index });
        DEV_LOG && console.log('view onDocumentPageUpdated', index, event.imageUpdated);
        if (!!event.imageUpdated) {
            const imageView = getImageView(index);
            imageView?.updateImageUri();
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
    onMount(() => {
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageDeleted', onDocumentPageDeleted);
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        document.on('pagesAdded', onPagesAdded);
        // refresh();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
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
        (e.view as ContentView).content.opacity = 1;
        try {
            await document.movePage(e.index, e.data.targetIndex);
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
            const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
            navigate({
                page: component,
                transition: __ANDROID__
                    ? SharedTransition.custom(new PageTransition(300, undefined, 10), {
                          //   pageStart: {
                          //       sharedTransitionTags: {
                          //           [`document_${document.id}_${item.page.id}`]: {}
                          //       }
                          //   }
                      })
                    : undefined,
                // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                props: {
                    backgroundColor: 'white',
                    statusBarStyle: 'light',
                    images: qrcodes.map((qrcode, index) => ({
                        name: pages.getItem(index).name || document.name,
                        subtitle: qrcode.text,
                        sharedTransitionTag: 'qrcode' + index,
                        labelSharedTransitionTag: 'qrcodelabel' + index,
                        colorMatrix: qrcodeColorMatrix,
                        margin: '0 10 0 10',
                        image: (orientation) => {
                            if (orientation === 'landscape') {
                                return generateQRCodeImage(qrcode.text, qrcode.format, screenHeightPixels, screenWidthPixels);
                            }
                            return generateQRCodeImage(qrcode.text, qrcode.format, screenWidthPixels, screenWidthPixels);
                        }
                    })),
                    startPageIndex: 0
                }
            });
        } catch (error) {
            showError(error);
        }
    }
</script>

<page id="cardview" actionBarHidden={true} statusBarColor={topBackgroundColor} {statusBarStyle}>
    <gridlayout backgroundColor={topBackgroundColor} rows="auto,auto,*">
        <CActionBar
            backgroundColor="transparent"
            buttonsDefaultVisualState={defaultVisualState}
            forceCanGoBack={nbSelected > 0}
            labelsDefaultVisualState={defaultVisualState}
            onGoBack={nbSelected ? unselectAll : null}
            title={nbSelected ? lc('selected', nbSelected) : document.name}
            titleProps={{ autoFontSize: true, padding: 0 }}>
            <mdbutton class="actionBarButton" {defaultVisualState} text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
            <mdbutton class="actionBarButton" {defaultVisualState} text="mdi-delete" variant="text" on:tap={nbSelected ? deleteSelectedPages : deleteDoc} />
        </CActionBar>

        <collectionview
            bind:this={collectionView}
            id="view"
            autoReloadItemOnLayout={true}
            {colWidth}
            height={itemHeight}
            {items}
            orientation="horizontal"
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
                    <RotableImageView id="imageView" borderRadius={12} item={item.page} sharedTransitionTag={`document_${document.id}_${item.page.id}`} stretch="aspectFill" width="100%" />
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
            <stacklayout visibility={currentQRCode ? 'visible' : 'hidden'}>
                <image
                    colorMatrix={qrcodeColorMatrix}
                    height={screenWidthDips * 0.4}
                    sharedTransitionTag={'qrcode' + currentQRCodeIndex}
                    src={currentQRCodeImage}
                    stretch="aspectFit"
                    verticalAlignment="top"
                    width="100%"
                    on:tap={onQRCodeTap} />
                <label fontSize={30} fontWeight="bold" row={1} sharedTransitionTag={'qrcodelabel' + currentQRCodeIndex} text={currentQRCode?.text} textAlignment="center" />
            </stacklayout>
            <stacklayout horizontalAlignment="right" orientation="horizontal" rowSpan={3} verticalAlignment="bottom">
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-file-document-plus-outline" on:tap={importDocument} />
                <mdbutton class="fab" text="mdi-plus" on:tap={addPages} />
            </stacklayout>
        </gridlayout>
    </gridlayout>
</page>
