<script context="module" lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Pager } from '@nativescript-community/ui-pager';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import {
        AnimationDefinition,
        Application,
        ApplicationSettings,
        Color,
        ContentView,
        EventData,
        ImageSource,
        ObservableArray,
        Page,
        PageTransition,
        SharedTransition,
        StackLayout
    } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { throttle } from '@nativescript/core/utils';
    import { create as createImagePicker } from '@nativescript/imagepicker';
    import { showError } from '@shared/utils/showError';
    import { goBack, navigate, showModal } from '@shared/utils/svelte/ui';
    import dayjs from 'dayjs';
    import { QRCodeData, QRCodeSingleData, detectQRCodeFromFile } from 'plugin-nativeprocessor';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import PageIndicator from '~/components/common/PageIndicator.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import PdfEdit from '~/components/edit/DocumentEdit.svelte';
    import { lc } from '~/helpers/locale';
    import { colorTheme, isDarkTheme, isEInk, onThemeChanged } from '~/helpers/theme';
    import { Document, ExtraFieldType, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import {
        DocumentDeletedEventData,
        DocumentPageDeletedEventData,
        DocumentPageUpdatedEventData,
        DocumentPagesAddedEventData,
        DocumentUpdatedEventData,
        documentsService
    } from '~/services/documents';
    import { qrcodeService } from '~/services/qrcode';
    import { shortcutService } from '~/services/shortcuts';
    import {
        BOTTOM_BUTTON_OFFSET,
        CARD_RATIO,
        DEFAULT_FORCE_WHITE_BACKGROUND_QRCODE,
        EVENT_DOCUMENT_DELETED,
        EVENT_DOCUMENT_PAGES_ADDED,
        EVENT_DOCUMENT_PAGE_DELETED,
        EVENT_DOCUMENT_PAGE_UPDATED,
        EVENT_DOCUMENT_UPDATED,
        FAB_BUTTON_OFFSET,
        QRCODE_RESIZE_THRESHOLD,
        SETTINGS_FORCE_WHITE_BACKGROUND_QRCODE
    } from '~/utils/constants';
    import { recycleImages } from '~/utils/images';
    import { detectOCR, importAndScanImage, importImageFromCamera, onBackButton, pickColor, showImagePopoverMenu, showPDFPopoverMenu, showPopoverMenu, showSnack, transformPages } from '~/utils/ui';
    import { colors, hasCamera, isLandscape, screenHeightDips, screenWidthDips, windowInset } from '~/variables';
    import EditNameActionBar from '../common/EditNameActionBar.svelte';
    import IconButton from '../common/IconButton.svelte';
    import ListItemAutoSize from '../common/ListItemAutoSize.svelte';
    import { requestCameraPermission } from '~/utils/utils.common';

    const rowMargin = 8;
    // -10 show just a bit of the one hidden on the right
    const colWidth = screenWidthDips / 2 - 10;
    const itemHeight = (colWidth - 2 * rowMargin) * CARD_RATIO + 2 * rowMargin;
    interface Item {
        page: OCRPage;
        selected: boolean;
        index: number;
    }
    const QRCODES_TYPE = 'qrcodes';
</script>

<script lang="ts">
    let { colorBackground, colorError, colorOnBackground, colorOnSurfaceVariant, colorOutline, colorSurface, colorSurfaceContainerHigh, colorTertiary } = $colors;
    $: ({ colorBackground, colorError, colorOnBackground, colorOnSurfaceVariant, colorOutline, colorSurface, colorSurfaceContainerHigh, colorTertiary } = $colors);

    const forceWhiteBackgroundForQRCode = ApplicationSettings.getBoolean(SETTINGS_FORCE_WHITE_BACKGROUND_QRCODE, DEFAULT_FORCE_WHITE_BACKGROUND_QRCODE);

    export let document: OCRDocument;
    export let transitionOnBack = true;
    let editingTitle = false;
    let editingUpdates: Partial<Document> = {};
    let topBackgroundColor = isEInk ? 'white' : (editingUpdates?.extra?.color ?? document?.extra?.color ?? document.pages[0]?.colors?.[1] ?? colorTertiary);
    let qrcodes: (QRCodeSingleData & { svg: string; pageIndex: number; pageQRCodeIndex: number; color: string })[];
    let currentQRCodeIndex = 0;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let pager: NativeViewElementNode<Pager>;
    let statusBarStyle;
    // set hasQRCodes as soon as possible to ensure the layout is correct and does not "jump"
    let hasQRCodes = document.pages.some((p) => p.qrcode?.length > 0);

    $: statusBarStyle = new Color(topBackgroundColor).getBrightness() < 145 ? 'dark' : 'light';

    let editing = false;

    onThemeChanged(() => {
        DEV_LOG && console.log('onThemeChanged', $colors.colorOnBackground);
        updateQRCodes();
    });

    function getExtraItems() {
        const result = [];

        let extra = document.extra || {};
        if (extra.color) {
            if (editing && colorTheme !== 'eink') {
                result.push({ type: 'color' });
            }
            extra = { ...extra };
            delete extra.color;
        }
        if (editing) {
            // add qrcodes
            for (let index = 0; index < qrcodes.length; index++) {
                const qrcode = qrcodes[index];
                result.push({
                    type: 'qrcode',
                    ...qrcode
                });
            }
        } else if (hasQRCodes) {
            DEV_LOG && console.log('getExtraItems, qrcodes', hasQRCodes, qrcodes?.length);
            result.push({
                type: QRCODES_TYPE,
                qrcodes
            });
        }
        Object.keys(extra).forEach((k) => {
            result.push({
                name: k,
                extra: { ...(extra[k] as any), name: k }
            });
        });
        return result;
    }
    // $: {
    const pages = document.getObservablePages();
    let items = pages.map((page, index) => ({ selected: false, page, index, document })) as ObservableArray<Item>;
    const extraItems: ObservableArray<any> = new ObservableArray(getExtraItems());
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
    let qrcodeColor;
    let qrcodeBackgroundColor;

    function updateQRCodeColors() {
        qrcodeColor = !isDarkTheme() || !forceWhiteBackgroundForQRCode ? $colors.colorOnBackground : $colors.colorBackground;
        qrcodeBackgroundColor = !isDarkTheme() || !forceWhiteBackgroundForQRCode ? $colors.colorBackground : $colors.colorOnBackground;
    }

    async function updateQRCodes(updateList = true) {
        try {
            updateQRCodeColors();
            const color = qrcodeColor;
            const newQrCodes = [];
            for (let index = 0; index < document.pages.length; index++) {
                const page = document.pages[index];
                if (page.qrcode?.length) {
                    for (let j = 0; j < page.qrcode.length; j++) {
                        const qr = page.qrcode[j];
                        newQrCodes.push({ ...qr, color, svg: await getQRCodeImage(qr, color), pageQRCodeIndex: j, pageIndex: index });
                    }
                }
            }
            DEV_LOG && console.log('updateQRCodes', isDarkTheme(), forceWhiteBackgroundForQRCode, qrcodeColor, newQrCodes.length);
            qrcodes = newQrCodes;
            hasQRCodes = qrcodes?.length > 0;
            if (updateList && !editing) {
                if (hasQRCodes) {
                    if (extraItems.getItem(0)?.type !== QRCODES_TYPE) {
                        extraItems.splice(0, 0, { type: QRCODES_TYPE, qrcodes });
                    } else {
                        extraItems.setItem(0, { type: QRCODES_TYPE, qrcodes });
                    }
                } else {
                    if (extraItems.getItem(0)?.type === QRCODES_TYPE) {
                        extraItems.splice(0, 1);
                    }
                }
            }
            // qrcodes = document.pages.reduce((acc, page) => acc.concat(page.qrcode?.map((qr) => ({ ...qr, color, svg: await getQRCodeImage(qr, color) })) || []), []);
            DEV_LOG && console.log('updateQRCodes', JSON.stringify(qrcodes));
            //we dont recycle images, it will be done in onDestroy
        } catch (error) {
            showError(error);
        }
    }
    updateQRCodes();
    async function getQRCodeImage(qrcode, color) {
        try {
            DEV_LOG && console.log('getQRCodeImage', color, qrcode.text);
            // if (qrcodeSVGs[qrcode.text]) {
            //     return qrcodeSVGs[qrcode.text];
            // }
            return qrcodeService.getQRCodeSVG(qrcode, screenWidthDips, color);
            // qrcodeSVGs[qrcode.text] = (await getQRCodeSVG(qrcode, screenWidthDips, color));
            // return qrcodeSVGs[qrcode.text];
        } catch (error) {
            console.error(error);
        }
    }
    function onSelectedIndex(event) {
        currentQRCodeIndex = event.object.selectedIndex;
    }
    function getSelectedPages() {
        const selected: { page: OCRPage; document: OCRDocument }[] = [];
        items.forEach((d, index) => {
            if (d.selected) {
                selected.push({ page: d.page, document });
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
            const pages = nbSelected > 0 ? getSelectedPages() : document.pages.map((p) => ({ page: p, document }));
            await showPDFPopoverMenu(pages, document, event.object);
        } catch (err) {
            showError(err);
        }
    }
    async function showImageExportPopover(event) {
        return showImagePopoverMenu(getSelectedPages(), event.object);
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
            await importAndScanImage({ document, importPDFs, canGoToView: false });
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
    }
    let ignoreTap = false;
    function onItemLongPress(item: Item, event?) {
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
            } else if (item.page.imagePath) {
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
        if (editingTitle) {
            editingTitle = false;
        } else {
            goBack(
                transitionOnBack
                    ? undefined
                    : {
                          transition: null
                      }
            );
        }
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
                images: getSelectedPages()
                    .filter((p) => p.page.imagePath)
                    .map((p) => ({
                        // sharedTransitionTag: `document_${doc.id}_${page.id}`,
                        name: document.name,
                        image: p.page.imagePath,
                        ...p
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
                    return true;
                }
            } catch (error) {
                showError(error);
            }
        }
    }

    function getImageView(index: number) {
        return collectionView?.nativeView?.getViewForItemAtIndex(index)?.getViewById<Img>('imageView');
    }

    function onPagesAdded(event: DocumentPagesAddedEventData) {
        if (event.doc.id !== document.id) {
            return;
        }
        document = event.doc;
        try {
            if (items) {
                const length = items.length;
                items.push(...event.pages.map((page, index) => ({ page, selected: false, index: length })));
            }
            updateQRCodes();
        } catch (error) {
            showError(error, { silent: true });
        }
    }
    function onDocumentPageUpdated(event: DocumentPageUpdatedEventData) {
        if (event.doc.id !== document.id) {
            return;
        }
        document = event.doc;
        const index = event.pageIndex;
        const current = items.getItem(index);
        if (current) {
            const page = document.getObservablePages().getItem(index);
            DEV_LOG && console.log('view onDocumentPageUpdated', index, event.imageUpdated, current.index);
            items.setItem(index, { ...current, page });
            if (!!event.imageUpdated) {
                const imageView = getImageView(index);
                DEV_LOG && console.log('view onDocumentPageUpdated update image', imageView);
                getImagePipeline().evictFromCache(current.page.imagePath);
                if (imageView) {
                    imageView?.updateImageUri();
                } else if (__IOS__) {
                    collectionView?.nativeElement?.refreshVisibleItems();
                }
            }
        }
    }
    function onDocumentPageDeleted(event: DocumentPageDeletedEventData) {
        if (event.doc.id !== document.id) {
            return;
        }
        document = event.doc;
        const index = event.pageIndex;
        items.splice(index, 1);
        items.forEach((item, index) => (item.index = index + 1));
        updateQRCodes();
    }
    function onDocumentsDeleted(event: DocumentDeletedEventData) {
        if (event.documents.indexOf(document) !== -1) {
            goBack({
                // null is important to say no transition! (override enter transition)
                transition: null
            });
        }
    }
    function onDocumentUpdated(event: DocumentUpdatedEventData) {
        if (document.id === event.doc.id) {
            document = event.doc;
            if (!editing) {
                refreshExtraItems();
            }
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
    // function onOrientationChanged(event: OrientationChangedEventData) {
    //     orientation = event.newValue;
    //     refreshCollectionView();
    //     // }, 1000);
    // }
    onMount(() => {
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        // Application.on('orientationChanged', onOrientationChanged);
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on(EVENT_DOCUMENT_UPDATED, onDocumentUpdated);
        documentsService.on(EVENT_DOCUMENT_DELETED, onDocumentsDeleted);
        documentsService.on(EVENT_DOCUMENT_PAGE_DELETED, onDocumentPageDeleted);
        documentsService.on(EVENT_DOCUMENT_PAGE_UPDATED, onDocumentPageUpdated);
        documentsService.on(EVENT_DOCUMENT_PAGES_ADDED, onPagesAdded);

        shortcutService.updateShortcuts(document);
        // refresh();
    });
    onDestroy(() => {
        clearQRCodeImages();
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
        // Application.off('orientationChanged', onOrientationChanged);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off(EVENT_DOCUMENT_UPDATED, onDocumentUpdated);
        documentsService.off(EVENT_DOCUMENT_DELETED, onDocumentsDeleted);
        documentsService.off(EVENT_DOCUMENT_PAGE_DELETED, onDocumentPageDeleted);
        documentsService.off(EVENT_DOCUMENT_PAGE_UPDATED, onDocumentPageUpdated);
        documentsService.off(EVENT_DOCUMENT_PAGES_ADDED, onPagesAdded);
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
            topBackgroundColor = document.pages[0]?.colors?.[1] || colorTertiary;
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
    function refreshQRCodePager() {
        // pager?.nativeView.refresh();
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
                    try {
                        let result;
                        switch (item.id) {
                            case 'share':
                                result = await showImageExportPopover(event);
                                if (result) {
                                    unselectAll();
                                }
                                break;
                            case 'fullscreen':
                                await fullscreenSelectedPages();
                                unselectAll();
                                break;
                            case 'ocr':
                                result = await detectOCR({ pages: getSelectedPagesWithData() });
                                if (result) {
                                    unselectAll();
                                }
                                break;
                            case 'qrcode':
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

                                unselectAll();
                                break;
                            case 'delete':
                                result = await deleteSelectedPages();
                                if (result) {
                                    unselectAll();
                                }
                                break;
                            case 'transform':
                                result = await transformPages({ pages: getSelectedPagesWithData() });
                                if (result) {
                                    unselectAll();
                                }
                                break;
                        }
                    } catch (error) {
                        showError(error);
                    }
                }
            });
        } else {
            const options = new ObservableArray([
                { id: 'rename', name: lc('rename'), icon: 'mdi-rename' },
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
                        case 'rename':
                            editingTitle = true;
                            break;
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
    async function onAddButton() {
        try {
            const OptionSelect = (await import('~/components/common/OptionSelect.svelte')).default;
            const rowHeight = 58;
            const options = (
                $hasCamera
                    ? [
                          {
                              id: 'camera',
                              name: lc('add_from_camera'),
                              icon: 'mdi-camera'
                          }
                      ]
                    : []
            )
                .concat([
                    {
                        id: 'import',
                        name: lc('import_from_file'),
                        icon: 'mdi-file-document-plus-outline'
                    }
                ])
                .concat(
                    __IOS__
                        ? [
                              {
                                  id: 'import_image',
                                  name: lc('import_from_image'),
                                  icon: 'mdi-image-plus-outline'
                              }
                          ]
                        : []
                )
                .concat([
                    {
                        id: 'add_qrcode_camera',
                        name: lc('add_qrcode_camera'),
                        icon: 'mdi-qrcode-scan'
                    },
                    {
                        id: 'add_qrcode_file',
                        name: lc('add_qrcode_file'),
                        icon: 'mdi-qrcode-plus'
                    },
                    {
                        id: 'add_qrcode_manual',
                        name: lc('add_qrcode_manual'),
                        icon: 'mdi-qrcode-plus'
                    }
                ]);
            const height = Math.min(rowHeight * options.length, 400);
            const option = await showBottomSheet({
                parent: this,
                view: OptionSelect,
                peekHeight: height,
                ignoreTopSafeArea: true,
                props: {
                    rowHeight,
                    height,
                    options
                }
            });
            DEV_LOG && console.log('on add option', option);
            let found = false;
            if (option) {
                switch (option.id) {
                    case 'camera':
                        await importImageFromCamera({ document, inverseUseSystemCamera: false });
                        break;
                    case 'import':
                        await importDocument();
                        break;
                    case 'import_image':
                        await importDocument(false);
                        break;
                    case 'add_qrcode_camera':
                        await requestCameraPermission();
                        const Camera = (await import('~/components/camera/Camera.svelte')).default;
                        const qrcodes: QRCodeData = await showModal({
                            page: Camera,
                            fullscreen: true,
                            props: {
                                QRCodeOnly: true
                            }
                        });
                        if (qrcodes?.length) {
                            //we add the qrcode to the first page (less risk of it being removed with the page)
                            await addQRCodes(qrcodes);
                            found = true;
                        } else {
                            showSnack({ message: lc('no_qrcode_found') });
                        }
                        DEV_LOG && console.log('qrcodes', qrcodes);
                        break;
                    case 'add_qrcode_file':
                        try {
                            const data = await createImagePicker({
                                mediaType: 1,
                                mode: 'multiple'
                            }).present();
                            const qrcodes = (
                                await Promise.all(
                                    data.map((d) =>
                                        detectQRCodeFromFile(d.path, {
                                            resizeThreshold: QRCODE_RESIZE_THRESHOLD
                                        })
                                    )
                                )
                            ).filter((q) => !!q);
                            if (qrcodes?.length) {
                                //we add the qrcode to the first page (less risk of it being removed with the page)
                                await addQRCodes(qrcodes.flat());
                                found = true;
                            } else {
                                showSnack({ message: lc('no_qrcode_found') });
                            }
                        } catch (error) {
                            //cancel will throw, we want to ignore it!
                        }
                        break;
                    case 'add_qrcode_manual': {
                        const result = await qrcodeService.createQRCode();
                        if (result?.text?.length) {
                            await addQRCodes([result]);
                        }
                        break;
                    }
                }
                await updateQRCodes();
                if (found) {
                    setTimeout(() => {
                        pager?.nativeElement?.scrollToIndexAnimated(qrcodes?.length - 1, true);
                    }, 10);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    function addQRCodes(qrcodes: QRCodeData, pageIndex = 0) {
        //we add the qrcode to the first page (less risk of it being removed with the page)
        return document.updatePage(pageIndex, {
            qrcode: (document.pages[pageIndex].qrcode || []).concat(
                qrcodes.map((q) => ({
                    text: q.text,
                    format: q.format,
                    position: q.position
                }))
            )
        });
    }

    async function addOrEditExtraField(item?) {
        try {
            const ExtraFieldPicker = (await import('~/components/widgets/ExtraFieldPicker.svelte')).default;
            const result = await showBottomSheet({
                parent: page,
                skipCollapsedState: true,
                view: ExtraFieldPicker,
                props: { editing: !!item, ...(item?.extra || {}) }
            });
            if (result) {
                DEV_LOG && console.log('addExtraField', result);
                const { name, ...others } = result;
                editingUpdates.extra = editingUpdates.extra || {};
                editingUpdates.extra[name] = others;
                if (item) {
                    const index = extraItems.indexOf(item);
                    extraItems.setItem(index, {
                        name: result.name,
                        extra: result
                    });
                } else {
                    extraItems.splice(extraItems.length - 1, 0, {
                        name: result.name,
                        extra: result
                    });
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    async function showImages() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: document.pages.map((page, index) => ({
                    sharedTransitionTag: `document_${document.id}_${page.id}`,
                    name: document.name,
                    image: page.imagePath,
                    ...page
                })),
                startPageIndex: 0
            }
        });
    }
    function refreshExtraItems() {
        DEV_LOG && console.log('refreshExtraItems');
        extraItems.splice(0, extraItems.length, ...getExtraItems());
    }
    async function startEdit() {
        if (editing === false) {
            editing = true;
            editingTitle = true;
            refreshExtraItems();
        }
    }
    async function cancelEdit() {
        if (editing === true) {
            editingUpdates = {};
            editing = false;
            refreshExtraItems();
            topBackgroundColor = editingUpdates?.extra?.color ?? document?.extra?.color ?? document.pages[0].colors?.[1] ?? colorTertiary;
        }
    }

    async function saveEdit() {
        try {
            DEV_LOG && console.log('saveEdit');
            if (editing || editingTitle) {
                let hasChanged = false;
                if (qrcodesToRemove.length) {
                    DEV_LOG && console.log('qrcodesToRemove');
                    for (let index = 0; index < qrcodesToRemove.length; index++) {
                        const qrcode = qrcodesToRemove[index];
                        const pageIndex = qrcode.pageIndex;
                        const qrcodes = document.pages[pageIndex].qrcode;
                        if (qrcode.pageQRCodeIndex >= 0 && qrcode.pageQRCodeIndex < qrcodes.length) {
                            qrcodes.splice(qrcode.pageQRCodeIndex, 1);
                            await document.updatePage(
                                pageIndex,
                                {
                                    qrcode: qrcodes
                                },
                                false,
                                false
                            );
                        }
                    }
                    hasChanged = true;
                    await updateQRCodes(false);
                }
                DEV_LOG && console.log('saveEdit', 'qrcodesToRemove done');
                const { extra, ...updates } = editingUpdates;
                hasChanged = Object.keys(updates).length > 0;
                if (extra) {
                    updates['extra'] = document.extra || {};
                    const keys = Object.keys(extra);
                    if (keys.length) {
                        keys.forEach((k) => {
                            if (extra[k] === null) {
                                delete updates['extra'][k];
                            } else {
                                updates['extra'][k] = extra[k];
                            }
                        });
                        hasChanged = true;
                    }
                }
                if (hasChanged) {
                    await document.save(updates, true);
                }
                DEV_LOG && console.log('saveEdit', 'document saved');
                editingUpdates = {};
                editing = false;
                refreshExtraItems();
            }
        } catch (error) {
            showError(error);
        }
    }

    function selectTemplate(item, index, items) {
        if (item.type) {
            if (item.type === 'prompt' || item.type === 'slider') {
                return 'default';
            }
            return item.type;
        }
        if (item.icon) {
            return 'leftIcon';
        }
        return 'default';
    }

    function updateExtraItem(item, key = 'key') {
        const index = extraItems.findIndex((it) => it[key] === item[key]);
        if (index !== -1) {
            extraItems.setItem(index, item);
        }
    }
    async function changeColor(item, event) {
        try {
            const currentColor = topBackgroundColor;
            const newColor = await pickColor(currentColor, { anchor: event.object });
            if (newColor) {
                editingUpdates.extra = editingUpdates.extra || {};
                topBackgroundColor = editingUpdates.extra.color = newColor.hex;
                updateExtraItem(item, 'type');
            }
        } catch (error) {
            showError(error);
        }
    }
    function onEditActionBarGoBack() {
        cancelEdit();
    }
    function onEditActionBarSave(newTitle) {
        editingUpdates.name = newTitle;
        saveEdit();
    }
    async function onExtraItemTap(item, event) {
        try {
            switch (item.id) {
                case 'add_extra_field':
                    await addOrEditExtraField();
                    break;
            }
        } catch (error) {
            showError(error);
        }
    }
    async function deleteExtraField(item, event) {
        DEV_LOG && console.log('deleteExtraField', item, !!editingUpdates.extra);
        editingUpdates.extra = editingUpdates.extra || {};
        // we set it to null so that we know we have to remove from document on save
        editingUpdates.extra[item.name] = null;
        const index = extraItems.indexOf(item);
        DEV_LOG && console.log('deleteExtraField1', index, item);
        if (index !== -1) {
            extraItems.splice(index, 1);
        }
    }
    const qrcodesToRemove = [];
    async function deleteCurrentQRCode(item, event) {
        try {
            const qrcode = qrcodes[currentQRCodeIndex];
            const pageIndex = qrcode?.pageIndex ?? -1;

            DEV_LOG && console.log('deleteCurrentQRCode', pageIndex, qrcode);
            if (pageIndex !== -1) {
                qrcodesToRemove.push(qrcode);

                const index = extraItems.indexOf(item);
                if (index !== -1) {
                    extraItems.splice(index, 1);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    function formatItemValue(item) {
        if (item.extra) {
            switch (item.extra.type) {
                case ExtraFieldType.Date:
                    return dayjs(item.extra.value).format(item.extra.format || 'LL');
                default:
                    return item.extra.value;
            }
        }
    }
    async function onExtraFieldTap(item, event) {
        DEV_LOG && console.log('onExtraFieldTap', item);
        if (editing) {
            addOrEditExtraField(item);
        }
    }
    function getItemBackgroundColor(item) {
        return isEInk ? null : item.page.colors?.[0] || document.extra?.color;
    }
    function getItemLabelColor(item) {
        return isEInk ? null : new Color(item.page.colors?.[0] || document.extra?.color).getBrightness() < 145 ? 'white' : 'black';
    }
</script>

<page bind:this={page} id="cardview" actionBarHidden={true} statusBarColor={topBackgroundColor} {statusBarStyle}>
    <gridlayout class="pageContent" backgroundColor={topBackgroundColor} columns={$isLandscape ? 'auto,*' : '*'} rows={$isLandscape ? 'auto,*' : 'auto,auto,*'}>
        <collectionview
            bind:this={collectionView}
            id="view"
            autoReloadItemOnLayout={true}
            colWidth={$isLandscape ? '100%' : '50%'}
            height={$isLandscape ? undefined : itemHeight}
            {items}
            orientation={$isLandscape ? 'vertical' : 'horizontal'}
            paddingBottom={Math.max($windowInset.bottom, BOTTOM_BUTTON_OFFSET)}
            reorderEnabled={true}
            row={1}
            rowHeight={itemHeight}
            visibility={document.pages.length === 1 && !document.pages[0].imagePath ? 'collapsed' : 'visible'}
            width={$isLandscape ? colWidth : undefined}
            on:itemReordered={onItemReordered}
            on:itemReorderStarting={onItemReorderStarting}>
            <Template let:index let:item>
                <gridlayout
                    class="cardItemTemplate"
                    backgroundColor={getItemBackgroundColor(item)}
                    elevation={isEInk ? 0 : 6}
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
                    <label
                        autoFontSize={true}
                        color={getItemLabelColor(item)}
                        fontSize={20}
                        fontWeight="bold"
                        lineBreak="end"
                        margin={16}
                        maxFontSize={20}
                        text={document.name}
                        textAlignment="center"
                        textWrap={true}
                        verticalTextAlignment="center"
                        visibility={item.page.imagePath ? 'hidden' : 'visible'} />
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                    <PageIndicator horizontalAlignment="right" margin={2} rowSpan={2} text={index + 1} on:longPress={() => startDragging(item)} />
                </gridlayout>
            </Template>
        </collectionview>
        <!-- <gridlayout backgroundColor={colorBackground} borderRadius="10 10 0 0" col={$isLandscape ? 1 : 0} row={$isLandscape ? 1 : 2} rows="auto,auto,*"> -->
        <!-- <stacklayout bind:this={fabHolder} horizontalAlignment="right" orientation="horizontal" rowSpan={3} verticalAlignment="bottom" android:marginBottom={$windowInset.bottom}> -->
        <!-- {#if __IOS__}
                    <mdbutton class="small-fab" text="mdi-image-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(false), 500)} />
                {/if}
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-file-document-plus-outline" on:tap={throttle(() => importDocument(), 500)} /> -->
        <!-- </stacklayout> -->
        <gridlayout class="cardViewHolder" col={$isLandscape ? 1 : 0} row={$isLandscape ? 1 : 2}>
            <collectionview bind:this={collectionView} itemTemplateSelector={selectTemplate} items={extraItems} paddingBottom={Math.max($windowInset.bottom + FAB_BUTTON_OFFSET)}>
                <Template key={QRCODES_TYPE} let:item>
                    <gridlayout rows="auto,auto">
                        <pager
                            bind:this={pager}
                            id="pager"
                            height={Math.min(screenHeightDips * 0.3, 300)}
                            items={item.qrcodes}
                            margin={16}
                            selectedIndex={currentQRCodeIndex}
                            visibility={hasQRCodes ? 'visible' : 'collapsed'}
                            on:selectedIndexChange={onSelectedIndex}>
                            <Template let:index let:item>
                                <gridlayout rows="*,auto" on:tap={onQRCodeTap}>
                                    <svgview backgroundColor={qrcodeBackgroundColor} sharedTransitionTag={'qrcode' + index} src={item.svg} stretch="aspectFit" />
                                    <label
                                        fontSize={30}
                                        fontWeight="bold"
                                        ios:linkColor={colorOnBackground}
                                        maxLines={2}
                                        row={1}
                                        selectable={true}
                                        sharedTransitionTag={'qrcodelabel' + index}
                                        text={item?.text}
                                        textAlignment="center" />
                                </gridlayout>
                            </Template>
                        </pager>
                        <!-- <label rowSpan={3} text={lc('no_qrcode')} textAlignment="center" verticalTextAlignment="center" visibility={hasQRCodes ? 'hidden' : 'visible'} /> -->
                        <pagerindicator
                            color={colorSurfaceContainerHigh}
                            horizontalAlignment="center"
                            marginBottom={5}
                            pagerViewId="pager"
                            row={1}
                            selectedColor={colorOnSurfaceVariant}
                            type="worm"
                            verticalAlignment="bottom"
                            visibility={hasQRCodes ? 'visible' : 'collapsed'} />
                    </gridlayout>
                </Template>
                <Template key="color" let:item>
                    <ListItemAutoSize fontSize={20} title={lc('color')} on:tap={(event) => changeColor(item, event)}>
                        <absolutelayout backgroundColor={topBackgroundColor} borderColor={colorOutline} borderRadius="50%" borderWidth={2} col={1} height={40} marginLeft={10} width={40} />
                    </ListItemAutoSize>
                </Template>
                <Template let:item>
                    <gridlayout padding="4 10 4 10">
                        <textview editable={false} hint={item.name} text={formatItemValue(item)} variant="outline" on:tap={(event) => onExtraFieldTap(item, event)} />
                        <IconButton
                            horizontalAlignment="right"
                            marginTop={5}
                            text="mdi-delete"
                            verticalAlignment="center"
                            visibility={editing ? 'visible' : 'collapsed'}
                            on:tap={(event) => deleteExtraField(item, event)} />
                    </gridlayout>
                    <ListItemAutoSize columns="*,auto,auto" fontSize={20} rightValue={formatItemValue(item)} title={item.name}></ListItemAutoSize>
                </Template>
                <Template key="qrcode" let:item>
                    <gridlayout columns="auto,*,auto" height={60} padding="4 0 4 10">
                        <svgview backgroundColor={qrcodeBackgroundColor} src={item.svg} stretch="aspectFit" width={50} />
                        <label col={1} fontSize={17} fontWeight="bold" maxLines={2} paddingLeft={5} text={item?.text} verticalTextAlignment="center" />
                        <IconButton col={2} text="mdi-delete" visibility={editing ? 'visible' : 'hidden'} on:tap={(event) => deleteCurrentQRCode(item, event)} />
                    </gridlayout>
                </Template>
                <Template key="button" let:item>
                    <mdbutton margin={10} text={item.text} on:tap={(event) => onExtraItemTap(item, event)} />
                </Template>
            </collectionview>
        </gridlayout>

        <!-- </gridlayout> -->
        <mdbutton
            col={1}
            margin={10}
            marginBottom={Math.min(60, $windowInset.bottom + 16)}
            row={2}
            text={lc('add_extra_field')}
            verticalAlignment="bottom"
            visibility={editing ? 'visible' : 'collapsed'}
            on:tap={(event) => addOrEditExtraField()} />

        <stacklayout
            bind:this={fabHolder}
            class="fabHolder"
            colSpan={2}
            marginBottom={Math.min(60, $windowInset.bottom + 16)}
            orientation="horizontal"
            row={2}
            visibility={editing ? 'collapsed' : 'visible'}>
            <mdbutton class="small-fab" text="mdi-pencil" verticalAlignment="bottom" on:tap={startEdit} />
            <mdbutton class="small-fab" text="mdi-fullscreen" verticalAlignment="bottom" on:tap={throttle(() => showImages(), 500)} />

            <mdbutton bind:this={fabHolder} id="fab" class="fab" text={editing ? 'mdi-check' : 'mdi-plus'} on:tap={throttle(() => onAddButton(), 500)} />
        </stacklayout>
        <CActionBar
            backgroundColor={topBackgroundColor}
            buttonsDefaultVisualState={statusBarStyle}
            colSpan={2}
            forceCanGoBack={nbSelected > 0}
            labelsDefaultVisualState={statusBarStyle}
            onGoBack={nbSelected ? unselectAll : null}
            onTitleTap={() => (editingTitle = true)}
            title={nbSelected ? lc('selected', nbSelected) : document.name}
            titleProps={{ autoFontSize: true, padding: 0 }}>
            <!-- {#if editing}
                <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-close" variant="text" on:tap={cancelEdit} />
                <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-content-save" variant="text" on:tap={saveEdit} />
            {:else} -->
            <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
            <mdbutton class="actionBarButton" defaultVisualState={statusBarStyle} text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            <!-- {/if} -->
        </CActionBar>
        {#if editingTitle}
            <EditNameActionBar
                autoFocus={!editing}
                backgroundColor={topBackgroundColor}
                buttonsDefaultVisualState={statusBarStyle}
                colSpan={2}
                {document}
                labelsDefaultVisualState={statusBarStyle}
                onGoBack={onEditActionBarGoBack}
                onSave={onEditActionBarSave}
                bind:editingTitle>
            </EditNameActionBar>
        {/if}
    </gridlayout>
</page>
