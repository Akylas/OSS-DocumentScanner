<script context="module" lang="ts">
    import { debounce, throttle } from '@nativescript/core/utils';
    import { request } from '@nativescript-community/perms';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { TextField } from '@nativescript-community/ui-material-textfield';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { AnimationDefinition, Application, ContentView, EventData, ObservableArray, Page, PageTransition, SharedTransition, StackLayout } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { filesize } from 'filesize';
    import { onDestroy, onMount } from 'svelte';
    import { goBack, navigate } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, showModal } from 'svelte-native/dom';
    import Camera from '~/components/camera/Camera.svelte';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import PageIndicator from '~/components/common/PageIndicator.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import PdfEdit from '~/components/edit/DocumentEdit.svelte';
    import { l, lc } from '~/helpers/locale';
    import { onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { ocrService } from '~/services/ocr';
    import { PermissionError, showError } from '~/utils/error';
    import {
        detectOCR,
        detectOCROnPage,
        hideLoading,
        hideSnackMessage,
        importAndScanImage,
        showImagePopoverMenu,
        showLoading,
        showPDFPopoverMenu,
        showPopoverMenu,
        showSnackMessage,
        transformPages,
        updateSnackMessage
    } from '~/utils/ui';
    import { colors, fontScale, screenWidthDips } from '~/variables';
    const rowMargin = 8;
    const itemHeight = screenWidthDips / 2 - rowMargin * 2 + 140;
    interface Item {
        page: OCRPage;
        selected: boolean;
        index: number;
    }

    let VIEW_ID = 0;
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    $: ({ colorSurfaceContainerHigh, colorError, colorSurfaceContainer, colorPrimary, colorOutline, colorSurface, colorOnSurfaceVariant, colorBackground } = $colors);

    export let document: OCRDocument;
    export let transitionOnBack = true;
    let collectionView: NativeViewElementNode<CollectionView>;
    let page: NativeViewElementNode<Page>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let nbSelected = 0;
    let editingTitle = false;
    let editingTitleTextField: NativeViewElementNode<TextField>;
    let ignoreTap = false;
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
    async function saveDocument() {
        try {
            showLoading(l('saving'));
            await document.save({}, true);
            hideLoading();
        } catch (err) {
            showError(err);
        }
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
    async function addPages() {
        try {
            const result = await request('camera');
            if (result[0] !== 'authorized') {
                throw new PermissionError(lc('camera_permission_needed'));
            }
            const oldPagesNumber = document.pages.length;
            const doc: OCRDocument = await showModal({
                page: Camera,
                fullscreen: true,
                props: {
                    modal: true,
                    document
                }
            });
            // if more than 1 page was imported stay here so that the user sees the added pages
            if (doc && doc.pages.length - oldPagesNumber === 1) {
                const component = (await import('~/components/edit/DocumentEdit.svelte')).default;
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

    async function importPages() {
        try {
            const oldPagesNumber = document.pages.length;
            const doc = await importAndScanImage(document);
            // if more than 1 page was imported stay here so that the user sees the added pages
            if (doc && doc.pages.length - oldPagesNumber === 1) {
                const component = (await import('~/components/edit/DocumentEdit.svelte')).default;
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

    function startDragging(item: Item) {
        const index = items.findIndex((p) => p.page === item.page);
        collectionView?.nativeElement.startDragging(index);
    }
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
    async function onPan(item: Item, event) {
        const extraData = event.eventData.extraData;
        if (Math.abs(extraData.velocityX) > 1000 || Math.abs(extraData.velocityY) > 1000 || Math.abs(extraData.translationX) > 100 || Math.abs(extraData.translationY) > 100) {
            event.handler?.cancel();
            return;
        }

        if (Math.abs(extraData.translationX) > 30 || Math.abs(extraData.translationY) > 30) {
            event.handler?.cancel();
            startDragging(item);
        }
    }
    const onItemTap = throttle(async function(item: Item) {
        DEV_LOG && console.log('onItemTap', Date.now());
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
    }, 500);
    function onGoBack() {
        goBack(
            transitionOnBack
                ? undefined
                : {
                      transition: null
                  }
        );
    }
    function onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (__ANDROID__) {
            data.cancel = true;
            if (nbSelected > 0) {
                unselectAll();
            } else {
                onGoBack();
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
                    DEV_LOG && console.log('deleting pages', indexes, items.length);
                    for (let index = indexes.length - 1; index >= 0; index--) {
                        const toRemoveIndex = indexes[index];
                        await document.deletePage(toRemoveIndex);
                    }
                    // refreshCollectionView();
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
            const length = items.length;
            items.push(...event.pages.map((page, index) => ({ page, selected: false, index: length })));
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
            items.setItem(index, { selected: current.selected, page, index: current.index });
            DEV_LOG && console.log('view onDocumentPageUpdated', index, current.index, event.imageUpdated);
            if (!!event.imageUpdated) {
                const imageView = getImageView(index);
                imageView?.updateImageUri();
            }
        }
    }
    function onDocumentPageDeleted(event: EventData & { pageIndex: number }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        items.splice(index, 1);
        for (let i = index; i < items.length; i++) {
            const item = items.getItem(i);
            item.index -= 1;
            items.setItem(i, item);
        }
    }
    function onDocumentUpdated(event: EventData & { doc: OCRDocument }) {
        if (document === event.doc) {
            document = event.doc;
        }
    }
    function onDocumentsDeleted(event: EventData & { documents }) {
        if (event.documents.indexOf(document) !== -1) {
            goBack({
                // null is important to say no transition! (override enter transition)
                transition: null
            });
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
        DEV_LOG && console.log('DocumentView', 'onMount', VIEW_ID++);
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
        items = null;
        DEV_LOG && console.log('DocumentView', 'onDestroy', VIEW_ID, !!document);
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off('documentUpdated', onDocumentUpdated);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
        documentsService.off('documentPageDeleted', onDocumentPageDeleted);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        document.off('pagesAdded', onPagesAdded);
    });
    // onThemeChanged(refreshCollectionView);

    async function onItemReordered(e) {
        const view = (e.view as ContentView).content;
        view.animate({ duration: 100, opacity: 1, scale: { x: 1, y: 1 } });
        try {
            await document.movePage(e.index, e.data.targetIndex);
            collectionView?.nativeView?.refreshVisibleItems();
        } catch (error) {
            showError(error);
        }
    }
    async function onItemReorderStarting(e) {
        const view = (e.view as ContentView).content;
        view.animate({ duration: 100, opacity: 0.8, scale: { x: 1.05, y: 1.05 } });
    }

    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);

    async function saveDocumentTitle(event) {
        try {
            DEV_LOG && console.log('saveDocumentTitle', editingTitleTextField.nativeElement.text);
            await document.save({
                name: editingTitleTextField.nativeElement.text
            });
            editingTitle = false;
        } catch (error) {
            showError(error);
        }
    }
    async function onTextFieldFocus(event) {
        try {
            const textField = event.object as TextField;
            textField.setSelection(textField.text.length);
            textField.requestFocus();
        } catch (error) {
            showError(error);
        }
    }
    async function showOptions(event) {
        if (nbSelected > 0) {
            const options = new ObservableArray([
                { id: 'share', name: lc('share_images'), icon: 'mdi-share-variant' },
                // { id: 'fullscreen', name: lc('show_fullscreen_images'), icon: 'mdi-fullscreen' },
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
                        case 'share':
                            showImageExportPopover(event);
                            break;
                        // case 'fullscreen':
                        //     fullscreenSelectedDocuments();
                        //     break;
                        case 'ocr':
                            await detectOCR({ pages: getSelectedPagesWithData() });
                            unselectAll();
                            break;
                        case 'delete':
                            deleteSelectedPages();
                            break;
                        case 'transform':
                            await transformPages({ pages: getSelectedPagesWithData() });
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
                            await transformPages({ documents: [document] });
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

<page bind:this={page} id="pdfView" actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar
            forceCanGoBack={nbSelected > 0}
            onGoBack={nbSelected ? unselectAll : null}
            onTitleTap={() => (editingTitle = true)}
            title={nbSelected ? lc('selected', nbSelected) : document.name}
            titleProps={{ autoFontSize: true, padding: 0 }}>
            <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
            <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
        </CActionBar>
        {#if editingTitle}
            <CActionBar forceCanGoBack={true} onGoBack={() => (editingTitle = false)} title={null}>
                <textfield
                    bind:this={editingTitleTextField}
                    slot="center"
                    backgroundColor={colorBackground}
                    col={1}
                    paddingBottom={4}
                    paddingTop={4}
                    text={document.name}
                    verticalTextAlignment="center"
                    on:layoutChanged={onTextFieldFocus} />
                <mdbutton class="actionBarButton" text="mdi-content-save" variant="text" on:tap={saveDocumentTitle} />
            </CActionBar>
        {/if}

        <collectionview
            bind:this={collectionView}
            id="view"
            autoReloadItemOnLayout={true}
            colWidth="50%"
            {items}
            paddingBottom={88}
            reorderEnabled={true}
            row={1}
            rowHeight={itemHeight}
            on:itemReordered={onItemReordered}
            on:itemReorderStarting={onItemReorderStarting}>
            <Template let:index let:item>
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
                    rows={`*,${40 * $fontScale}`}
                    on:tap={() => onItemTap(item)}
                    on:pan={(e) => onPan(item, e)}
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
                    <canvaslabel color={colorOnSurfaceVariant} fontSize={14 * $fontScale} height="100%" padding="10 0 0 0" row={1}>
                        <cspan text={`${item.page.width} x ${item.page.height}\n${filesize(item.page.size)}`} textAlignment="left" verticalAlignment="bottom" />
                        <!-- <cspan color={colorOnSurfaceVariant} fontSize={12} paddingTop={36} text={dayjs(item.doc.createdDate).format('L LT')} /> -->
                        <!-- <cspan color={colorOnSurfaceVariant} fontSize={12} paddingTop={50} text={lc('nb_pages', item.doc.pages.length)} /> -->
                    </canvaslabel>
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                    <PageIndicator rowSpan={2} text={index + 1} on:longPress={() => startDragging(item)} />
                </gridlayout>
            </Template>
        </collectionview>

        <stacklayout bind:this={fabHolder} horizontalAlignment="right" orientation="horizontal" row={1} verticalAlignment="bottom">
            <mdbutton class="small-fab" text="mdi-file-document-plus-outline" verticalAlignment="center" on:tap={importPages} />
            <mdbutton class="fab" margin="8 16 16 16" text="mdi-plus" on:tap={addPages} />
        </stacklayout>
    </gridlayout>
</page>
