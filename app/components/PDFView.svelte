<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img } from '@nativescript-community/ui-image';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Application, ContentView, EventData, NavigatedData, ObservableArray, PageTransition, SharedTransition } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy, onMount } from 'svelte';
    import { goBack, navigate } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, showModal } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import Camera from '~/components/Camera.svelte';
    import PdfEdit from '~/components/PDFEdit.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import SelectedIndicator from '~/components/SelectedIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { hideLoading, importAndScanImage, showLoading } from '~/utils/ui';
    import { colors, fonts, screenWidthDips } from '~/variables';
    import PageIndicator from './PageIndicator.svelte';
    import { filesize } from 'filesize';
    import { onThemeChanged } from '~/helpers/theme';

    const rowMargin = 8;
    const itemHeight = screenWidthDips / 2 - rowMargin * 2 + 140;

    // technique for only specific properties to get updated on store change
    $: ({ colorSurfaceContainerHigh, colorSurfaceContainer, colorPrimary, colorOutline, colorSurface, colorOnSurfaceVariant } = $colors);

    interface Item {
        page: OCRPage;
        selected: boolean;
        index: number;
    }

    export let document: OCRDocument;
    let collectionView: NativeViewElementNode<CollectionView>;
    let items: ObservableArray<Item> = null;

    // $: {
    const pages = document.getObservablePages();
    items = pages.map((page, index) => ({ selected: false, page, index })) as any as ObservableArray<Item>;
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
    async function saveDocument() {
        try {
            showLoading(l('saving'));
            await document.save();
            hideLoading();
        } catch (err) {
            showError(err);
        }
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
    async function addPages() {
        try {
            document = await showModal({
                page: Camera,
                fullscreen: true,
                props: {
                    modal: true,
                    document
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage(document);
            if (doc) {
                const component = (await import('~/components/PDFEdit.svelte')).default;
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
</script>

<page id="pdfView" actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar forceCanGoBack={nbSelected > 0} onGoBack={nbSelected ? unselectAll : null} title={nbSelected ? lc('selected', nbSelected) : document.name} titleProps={{ autoFontSize: true }}>
            <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={savePDF} />
            <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={nbSelected ? deleteSelectedPages : deleteDoc} />
        </CActionBar>

        <collectionview
        id="edit"
            bind:this={collectionView}
            colWidth="50%"
            {items}
            reorderEnabled={true}
            row={1}
            rowHeight={itemHeight}
            on:itemReordered={onItemReordered}
            on:itemReorderStarting={onItemReorderStarting}>
            <Template let:item>
                <!-- <gridlayout
                    backgroundColor={colorSurfaceContainer}
                    borderColor={colorOutline}
                    borderRadius={12}
                    borderWidth={1}
                    clipToBounds={true}
                    margin={8}
                    rippleColor={colorPrimary}
                    rows="*,auto"
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}>
                    <RotableImageView id="imageView" item={item.page} rowSpan={2} sharedTransitionTag={`document_${document.id}_${item.page.id}`} />
                    <SelectedIndicator selected={item.selected} />
                    <canvaslabel backgroundColor="#00000088" color="white" height={30} padding="5" row={1}>
                        <cspan fontSize={12} text={`${item.page.width} x ${item.page.height}`} />
                        <cspan fontFamily={$fonts.mdi} fontSize={20} text="mdi-text-recognition" textAlignment="right" visibility={item.page.ocrData ? 'visible' : 'hidden'} />
                    </canvaslabel>
                </gridlayout> -->

                <gridlayout
                    backgroundColor={colorSurfaceContainerHigh}
                    borderColor={colorOutline}
                    borderRadius={12}
                    borderWidth={0}
                    margin={8}
                    padding={10}
                    rippleColor={colorSurface}
                    rows="*,40"
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    >/
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        horizontalAlignment="center"
                        item={item.page}
                        sharedTransitionTag={`document_${document.id}_${item.page.id}`}
                        stretch="aspectFit"
                        verticalAlignment="center" />
                    <canvaslabel height="100%" padding="10 0 0 0" row={1}>
                        <cspan fontSize={14} fontWeight="normal" paddingBottom={20} text={`${item.page.width} x ${item.page.height}`} textAlignment="right" verticalAlignment="bottom" />
                        <cspan fontSize={14} fontWeight="normal" text={filesize(item.page.size)} textAlignment="right" verticalAlignment="bottom" />
                        <!-- <cspan color={colorOnSurfaceVariant} fontSize={12} paddingTop={36} text={dayjs(item.doc.createdDate).format('L LT')} /> -->
                        <!-- <cspan color={colorOnSurfaceVariant} fontSize={12} paddingTop={50} text={lc('nb_pages', item.doc.pages.length)} /> -->
                    </canvaslabel>
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                    <PageIndicator rowSpan={2} text={item.index + 1} />
                </gridlayout>
            </Template>
        </collectionview>

        <stacklayout horizontalAlignment="right" orientation="horizontal" row={1} verticalAlignment="bottom">
            <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-file-document-plus-outline" on:tap={importDocument} />
            <mdbutton class="fab" margin="8 16 16 16" text="mdi-plus" on:tap={addPages} />
        </stacklayout>
    </gridlayout>
</page>
