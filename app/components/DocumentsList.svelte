<script context="module" lang="ts">
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { AnimationDefinition, Application, ApplicationSettings, Color, EventData, NavigatedData, ObservableArray, Page, StackLayout, Utils, View } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import { throttle } from '@nativescript/core/utils';
    import dayjs from 'dayjs';
    import { filesize } from 'filesize';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import PageIndicator from '~/components/common/PageIndicator.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import SyncIndicator from '~/components/common/SyncIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { DocFolder, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { DocumentAddedEventData, DocumentDeletedEventData, DocumentMovedFolderEventData, DocumentUpdatedEventData, FolderUpdatedEventData, documentsService } from '~/services/documents';
    import { syncService } from '~/services/sync';
    import {
        BOTTOM_BUTTON_OFFSET,
        EVENT_DOCUMENT_ADDED,
        EVENT_DOCUMENT_DELETED,
        EVENT_DOCUMENT_MOVED_FOLDER,
        EVENT_DOCUMENT_PAGE_DELETED,
        EVENT_DOCUMENT_PAGE_UPDATED,
        EVENT_DOCUMENT_UPDATED,
        EVENT_FOLDER_UPDATED,
        EVENT_STATE,
        EVENT_SYNC_STATE
    } from '~/utils/constants';
    import { showError } from '~/utils/showError';
    import { fade, navigate } from '~/utils/svelte/ui';
    import {
        detectOCR,
        goToDocumentView,
        goToFolderView,
        importAndScanImage,
        importImageFromCamera,
        onAndroidNewItent,
        onBackButton,
        promptForFolder,
        showImagePopoverMenu,
        showPDFPopoverMenu,
        showPopoverMenu,
        showSettings,
        transformPages
    } from '~/utils/ui';
    import { colors, fontScale, fonts, hasCamera, onFolderBackgroundColorChanged, screenWidthDips, windowInset } from '~/variables';

    const textPaint = new Paint();
    const IMAGE_DECODE_WIDTH = Utils.layout.toDevicePixels(200);

    interface Item {
        doc?: OCRDocument;
        folder?: DocFolder;
        selected: boolean;
    }
</script>

<script lang="ts">
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import ActionBarSearch from './widgets/ActionBarSearch.svelte';
    import { folderBackgroundColor } from '~/variables';

    // technique for only specific properties to get updated on store change
    let {
        colorError,
        colorOnBackground,
        colorOnSurface,
        colorOnSurfaceVariant,
        colorOnTertiaryContainer,
        colorOutline,
        colorPrimaryContainer,
        colorSurface,
        colorSurfaceContainer,
        colorSurfaceContainerHigh,
        colorTertiaryContainer
    } = $colors;
    $: ({
        colorError,
        colorOnBackground,
        colorOnSurface,
        colorOnSurfaceVariant,
        colorOnTertiaryContainer,
        colorOutline,
        colorPrimaryContainer,
        colorSurface,
        colorSurfaceContainer,
        colorSurfaceContainerHigh,
        colorTertiaryContainer
    } = $colors);

    let documents: ObservableArray<Item> = null;
    let nbDocuments: number = 0;
    let showNoDocument = false;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let lottieView: NativeViewElementNode<LottieView>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let search: ActionBarSearch;

    export let folder: DocFolder = null;
    export let title = l('documents');
    let folders: DocFolder[];

    $: if (folder) {
        DEV_LOG && console.log('updating folder title', folder);

        title = createNativeAttributedString({
            spans: [
                {
                    fontFamily: $fonts.mdi,
                    color: folder.color || colorOutline,
                    verticalAlignment: 'center',
                    text: 'mdi-folder  '
                },
                {
                    verticalAlignment: 'center',
                    text: folder.name
                }
            ]
        });
    }

    let viewStyle: string = ApplicationSettings.getString('documents_list_view_style', 'expanded');
    $: condensed = viewStyle === 'condensed';
    const syncEnabled = syncService.enabled;
    let syncRunning = false;
    $: DEV_LOG && console.log('syncEnabled', syncEnabled);

    let lastRefreshFilter = null;
    let showSearch = false;
    let loading = false;
    let nbSelected = 0;
    let ignoreTap = false;
    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;
    $: if (nbSelected > 0) search.unfocusSearch();

    async function refresh(force = true, filter?: string) {
        if (loading || (!force && lastRefreshFilter === filter)) {
            return;
        }
        lastRefreshFilter = filter;
        nbSelected = 0;
        loading = true;
        try {
            DEV_LOG && console.log('DocumentsList', 'refresh', filter);
            const r = await documentsService.documentRepository.findDocuments({ filter, folder, omitThoseWithFolders: true });
            DEV_LOG && console.log('r', r.length);

            folders = filter?.length || folder ? [] : await documentsService.folderRepository.findFolders();
            documents = new ObservableArray(
                folders
                    .map((folder) => ({ folder, selected: false }))
                    .concat(
                        r.map(
                            (doc) =>
                                ({
                                    doc,
                                    selected: false
                                }) as any
                        )
                    )
            );
            updateNoDocument();

            // if (DEV_LOG) {
            //     const component = (await import('~/components/PDFPreview.svelte')).default;
            //     await showModal({
            //         page: component,
            //         animated: true,
            //         fullscreen: true,
            //         props: {
            //             documents: [documents.getItem(0).doc]
            //         }
            //     });
            // }
            // await Promise.all(r.map((d) => d.pages[0]?.imagePath));
        } catch (error) {
            showError(error);
        } finally {
            loading = false;
        }
    }
    const refreshSimple = () => refresh();

    function updateNoDocument() {
        nbDocuments = documents?.length ?? 0;
        showNoDocument = nbDocuments === 0;
    }
    function onDocumentAdded(event: DocumentAddedEventData) {
        if ((!event.folder && !folder) || folder?.id === event.folder?.id) {
            DEV_LOG && console.log('onDocumentAdded', nbDocuments);
            documents?.unshift({
                doc: event.doc,
                selected: false
            } as Item);
            updateNoDocument();
            collectionView?.nativeElement.scrollToIndex(0, false);
        } else if (!folder && event.folder) {
            refresh();
        }
    }

    function onDocumentMovedFolder(event: DocumentMovedFolderEventData) {
        // TODO: for now we refresh otherwise the order might be lost
        DEV_LOG && console.log('onDocumentMovedFolder', folder?.id, event.folder?.id, event.oldFolder?.id);
        if (!folder && (!event.folder || !event.oldFolder)) {
            // if (!event.folder) {
            //     const index = documents.findIndex(d=>d.doc && d.doc.id === event.object.id)
            //     if (index === -1) {
            //         documents.push
            //     }
            // }
            refresh();
        } else if (folder && (folder.name === event.folder?.name || folder.name === event.oldFolder?.name)) {
            refresh();
        }
    }

    function onDocumentUpdated(event: DocumentUpdatedEventData) {
        let index = -1;
        documents?.some((d, i) => {
            if (d.doc && d.doc.id === event.doc.id) {
                index = i;
                return true;
            }
        });
        DEV_LOG && console.log('onDocumentUpdated', event.doc._synced, event.doc.id, index, event.doc.pages.length);
        if (index >= 0) {
            const item = documents?.getItem(index);
            if (item) {
                item.doc = event.doc;
                documents.setItem(index, item);
            }
        }
    }
    function onFolderUpdated(event: FolderUpdatedEventData) {
        let index = -1;
        documents?.some((d, i) => {
            if (d.folder && d.folder.id === event.folder.id) {
                index = i;
                return true;
            }
        });
        DEV_LOG && console.log('onFolderUpdated', event.folder);
        if (index >= 0) {
            const item = documents?.getItem(index);
            if (item) {
                item.folder = event.folder;
                documents.setItem(index, item);
            }
        }
    }
    function onDocumentsDeleted(event: DocumentDeletedEventData) {
        for (let index = documents.length - 1; index >= 0; index--) {
            if (event.documents.indexOf(documents.getItem(index).doc) !== -1) {
                documents.splice(index, 1);
                nbSelected -= 1;
            }
        }
        updateNoDocument();
    }
    function getImageView(index: number) {
        const view = collectionView?.nativeView?.getViewForItemAtIndex(index);
        DEV_LOG && console.log('getImageView', index, view);
        return view?.getViewById<Img>('imageView');
    }

    function onDocumentPageUpdated(event: EventData & { pageIndex: number; imageUpdated: boolean }) {
        // let index = -1;
        const document = event.object as OCRDocument;
        const index = documents?.findIndex((d) => d.doc && d.doc.id === document.id);
        if (index >= 0) {
            if (event.pageIndex === 0) {
                if (!!event.imageUpdated) {
                    const imageView = getImageView(index);
                    DEV_LOG && console.log('list onDocumentPageUpdated image clean', index, imageView);
                    const page = document.pages[event.pageIndex];
                    getImagePipeline().evictFromCache(page.imagePath);
                    if (imageView) {
                        imageView?.updateImageUri();
                    } else if (__IOS__) {
                        collectionView?.nativeElement?.refreshVisibleItems();
                    }
                }
            }
            const item = documents?.getItem(index);
            if (item) {
                item.doc = document;
                documents.setItem(index, item);
            }
        }
    }
    function onSyncState(event: EventData & { state: 'running' | 'finished' }) {
        syncRunning = event.state === 'running';
    }

    function onSnackMessageAnimation({ animationArgs }: EventData & { animationArgs: AnimationDefinition[] }) {
        if (fabHolder) {
            const snackAnimation = animationArgs[0];
            animationArgs.push({
                duration: snackAnimation.duration,
                target: fabHolder.nativeView,
                translate: { x: 0, y: snackAnimation.translate.y === 0 ? -70 : 0 }
            });
        }
    }

    onMount(() => {
        DEV_LOG && console.log('DocumentList', 'onMount', documentsService.id);
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
            Application.android.on(Application.android.activityNewIntentEvent, onAndroidNewItent);
            const intent = Application.android['startIntent'];
            if (intent) {
                onAndroidNewItent({ intent } as any);
            }
        }
        documentsService.on(EVENT_DOCUMENT_PAGE_UPDATED, onDocumentPageUpdated);
        documentsService.on(EVENT_DOCUMENT_PAGE_DELETED, onDocumentPageUpdated);
        documentsService.on(EVENT_DOCUMENT_ADDED, onDocumentAdded);
        documentsService.on(EVENT_DOCUMENT_UPDATED, onDocumentUpdated);
        documentsService.on(EVENT_DOCUMENT_DELETED, onDocumentsDeleted);
        documentsService.on(EVENT_DOCUMENT_MOVED_FOLDER, onDocumentMovedFolder);
        documentsService.on(EVENT_FOLDER_UPDATED, onFolderUpdated);
        syncService.on(EVENT_SYNC_STATE, onSyncState);
        syncService.on(EVENT_STATE, refreshSimple);
        // refresh();
    });
    onDestroy(() => {
        DEV_LOG && console.log('DocumentList', 'onDestroy');
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
            Application.android.off(Application.android.activityNewIntentEvent, onAndroidNewItent);
        }
        documentsService.off(EVENT_DOCUMENT_PAGE_UPDATED, onDocumentPageUpdated);
        documentsService.off(EVENT_DOCUMENT_PAGE_DELETED, onDocumentPageUpdated);
        documentsService.off(EVENT_DOCUMENT_UPDATED, onDocumentUpdated);
        documentsService.off(EVENT_DOCUMENT_ADDED, onDocumentAdded);
        documentsService.off(EVENT_DOCUMENT_DELETED, onDocumentsDeleted);
        documentsService.off(EVENT_DOCUMENT_MOVED_FOLDER, onDocumentMovedFolder);
        documentsService.off(EVENT_FOLDER_UPDATED, onFolderUpdated);
        syncService.off(EVENT_SYNC_STATE, onSyncState);
        syncService.off(EVENT_STATE, refreshSimple);
    });

    const showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);

    async function onStartCam(inverseUseSystemCamera = false) {
        try {
            await importImageFromCamera({ folder, inverseUseSystemCamera });
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument(importPDFs = true) {
        DEV_LOG && console.log('importDocument', importPDFs);
        try {
            await importAndScanImage({ folder, importPDFs });
        } catch (error) {
            showError(error);
        }
    }
    async function onNavigatedTo(e: NavigatedData) {
        if (!e.isBackNavigation) {
            if (documentsService.started) {
                refresh();
            } else {
                documentsService.once('started', refreshSimple);
            }
        }
    }
    function selectItem(item: Item) {
        if (!item.selected) {
            documents?.some((d, index) => {
                if (d === item) {
                    nbSelected++;
                    d.selected = true;
                    documents.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectItem(item: Item) {
        if (item.selected) {
            documents?.some((d, index) => {
                if (d === item) {
                    nbSelected--;
                    d.selected = false;
                    documents.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectAll() {
        nbSelected = 0;
        if (documents) {
            documents.splice(0, documents.length, ...documents.map((i) => ({ ...i, selected: false })));
        }
    }
    function selectAll() {
        if (documents) {
            documents.splice(0, documents.length, ...documents.map((i) => ({ ...i, selected: true })));
            nbSelected = documents.length;
        }
    }
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
            // console.log('onItemTap', event && event.ios && event.ios.state, selectedSessions.length);
            if (nbSelected > 0) {
                onItemLongPress(item);
            } else if (item.doc) {
                await goToDocumentView(item.doc);
            } else if (item.folder) {
                await goToFolderView(item.folder);
            }
        } catch (error) {
            showError(error);
        }
    }
    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            }
        });

    async function fullscreenSelectedDocuments() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: (await getSelectedDocuments()).reduce((acc, doc) => {
                    doc.pages.forEach((page) =>
                        acc.push({
                            image: page.imagePath,
                            // sharedTransitionTag: `document_${doc.id}_${page.id}`,
                            name: page.name || doc.name,
                            ...page
                        })
                    );
                    return acc;
                }, []),
                startPageIndex: 0
            }
        });
    }

    async function getSelectedDocuments() {
        const selected: OCRDocument[] = [];
        for (let index = 0; index < documents.length; index++) {
            const d = documents.getItem(index);
            if (d.selected) {
                if (d.doc) {
                    selected.push(d.doc);
                } else if (d.folder) {
                    selected.push(...(await documentsService.documentRepository.findDocuments({ folder: d.folder })));
                }
            }
        }
        return selected;
    }
    function getSelectedPagesAndPossibleSingleDocument(): [OCRPage[], OCRDocument?] {
        const selected: OCRPage[] = [];
        const docs: OCRDocument[] = [];
        let doc;
        documents.forEach((d, index) => {
            if (d.selected) {
                doc = d.doc;
                docs.push(doc);
                selected.push(...doc.pages);
            }
        });
        return [selected, docs.length === 1 ? docs[0] : undefined];
    }
    async function deleteSelectedDocuments() {
        if (nbSelected > 0) {
            try {
                const result = await confirm({
                    cancelButtonText: lc('cancel'),
                    message: lc('confirm_delete_documents', nbSelected),
                    okButtonText: lc('delete'),
                    title: lc('delete')
                });
                if (result) {
                    await documentsService.deleteDocuments(await getSelectedDocuments());
                }
            } catch (error) {
                showError(error);
            }
        }
    }

    async function selectViewStyle(event) {
        try {
            // const options = Object.keys(OPTIONS[option]).map((k) => ({ ...OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                anchor: event.object,
                onClose: (item) => {
                    viewStyle = item.id;
                    refresh();
                    ApplicationSettings.setString('documents_list_view_style', viewStyle);
                },
                options: [
                    { id: 'default', name: lc('expanded') },
                    { id: 'condensed', name: lc('condensed') }
                ],
                vertPos: VerticalPosition.BELOW
            });
        } catch (error) {
            showError(error);
        }
    }
    async function syncDocuments() {
        try {
            if (syncEnabled) {
                await syncService.syncDocuments({ bothWays: true, force: true });
            }
        } catch (error) {
            showError(error);
        }
    }
    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);
    onFolderBackgroundColorChanged(refreshCollectionView);

    let lottieDarkFColor;
    let lottieLightColor;
    $: {
        if (colorPrimaryContainer) {
            lottieDarkFColor = new Color(colorPrimaryContainer);
            const realTheme = getRealTheme();
            if (realTheme === 'light') {
                lottieLightColor = new Color(colorPrimaryContainer).darken(10);
            } else {
                lottieLightColor = new Color(colorPrimaryContainer).lighten(10);
            }
        }
    }
    function getItemImageHeight(viewStyle) {
        return (condensed ? 44 : 94) * $fontScale;
    }
    function getItemRowHeight(viewStyle) {
        return condensed ? 80 : 150;
    }
    function getFolderRowHeight(viewStyle) {
        return condensed ? 80 : 70;
    }
    function getImageMargin(viewStyle) {
        return 10;
        // switch (viewStyle) {
        //     case 'condensed':
        //         return 10;
        //     default:
        //         return 10;
        // }
    }

    $: textPaint.color = colorOnBackground || 'black';
    $: textPaint.textSize = (condensed ? 11 : 14) * $fontScale;

    function drawRoundRect(canvas: Canvas, text: string, availableWidth, x, y) {
        canvas.save();
        textPaint.color = colorOnTertiaryContainer;
        const staticLayout = new StaticLayout(' ' + text + ' ', textPaint, availableWidth, LayoutAlignment.ALIGN_NORMAL, 1, 0, false);
        const width = staticLayout.getLineWidth(0);
        const height = staticLayout.getHeight();
        canvas.translate(x, y - height);
        textPaint.setColor(colorTertiaryContainer);
        canvas.drawRoundRect(-4, -1, width + 4, height + 1, height / 2, height / 2, textPaint);
        textPaint.color = colorOnTertiaryContainer;
        staticLayout.draw(canvas);
        canvas.restore();
    }

    function onFolderCanvasDraw(item: Item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const dx = 16;
        const { folder } = item;
        // textPaint.color = colorOnSurfaceVariant;
        // canvas.drawText(
        //     filesize(
        //         item.doc.pages.reduce((acc, v) => acc + v.size, 0),
        //         { output: 'string' }
        //     ),
        //     dx,
        //     h - (condensed ? 0 : 16) - 10,
        //     textPaint
        // );
        textPaint.color = colorOnBackground;
        const topText = createNativeAttributedString({
            spans: [
                {
                    fontFamily: $fonts.mdi,
                    fontSize: 20 * $fontScale,
                    color: !$folderBackgroundColor && folder.color ? folder.color : colorOutline,
                    lineHeight: 24 * $fontScale,
                    text: 'mdi-folder '
                },
                {
                    fontSize: 16 * $fontScale,
                    fontWeight: 'bold',
                    lineBreak: 'end',
                    lineHeight: 18 * $fontScale,
                    text: folder.name
                },
                {
                    fontSize: 14 * $fontScale,
                    color: colorOutline,
                    lineHeight: (condensed ? 14 : 20) * $fontScale,
                    text: '\n' + lc('documents_count', item.folder.count)
                }
            ]
        });
        canvas.save();
        const staticLayout = new StaticLayout(topText, textPaint, w - dx, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
        canvas.translate(dx, 16);
        staticLayout.draw(canvas);
        canvas.restore();

        // drawRoundRect(canvas, lc('documents_count', item.folder.count), w - dx, dx, h - 10);

        // if (item.folder.size) {
        //     drawRoundRect(canvas, filesize(item.folder.size, { output: 'string' }), w - dx, dx, h - 33 * $fontScale);
        // }
    }
    function onCanvasDraw(item: Item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const dx = 10 + getItemImageHeight(viewStyle) + 16;
        textPaint.color = colorOnSurfaceVariant;
        const { doc } = item;
        canvas.drawText(
            filesize(
                doc.pages.reduce((acc, v) => acc + v.size, 0),
                { output: 'string' }
            ),
            dx,
            h - (condensed ? 0 : 16) - 10,
            textPaint
        );
        textPaint.color = colorOnBackground;
        const topText = createNativeAttributedString({
            spans: [
                {
                    fontSize: 16 * $fontScale,
                    fontWeight: 'bold',
                    lineBreak: 'end',
                    lineHeight: 18 * $fontScale,
                    text: doc.name
                },
                {
                    color: colorOnSurfaceVariant,
                    fontSize: 14 * $fontScale,
                    lineHeight: (condensed ? 14 : 20) * $fontScale,
                    text: '\n' + dayjs(doc.createdDate).format('L LT')
                }
            ]
        });
        const staticLayout = new StaticLayout(topText, textPaint, w - dx, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
        canvas.translate(dx, (condensed ? 0 : 10) + 10);
        staticLayout.draw(canvas);
    }

    // #region Options
    async function showPDFPopover(event) {
        try {
            const data = getSelectedPagesAndPossibleSingleDocument();
            await showPDFPopoverMenu(data[0], data[1], event.object);
        } catch (err) {
            showError(err);
        }
    }

    async function showImageExportPopover(event) {
        try {
            const data = getSelectedPagesAndPossibleSingleDocument();

            await showImagePopoverMenu(data[0], event.object);
        } catch (err) {
            showError(err);
        }
    }
    async function showOptions(event) {
        const options = new ObservableArray(
            (folder ? [{ id: 'select_all', name: lc('select_all'), icon: 'mdi-select-all' }] : []).concat(nbSelected === 1 ? [{ icon: 'mdi-rename', id: 'rename', name: lc('rename') }] : []).concat([
                { icon: 'mdi-folder-swap', id: 'move_folder', name: lc('move_folder') },
                { icon: 'mdi-share-variant', id: 'share', name: lc('share_images') },
                { icon: 'mdi-fullscreen', id: 'fullscreen', name: lc('show_fullscreen_images') },
                { icon: 'mdi-auto-fix', id: 'transform', name: lc('transform_images') },
                { icon: 'mdi-text-recognition', id: 'ocr', name: lc('ocr_document') },
                { color: colorError, icon: 'mdi-delete', id: 'delete', name: lc('delete') }
            ] as any)
        );
        return showPopoverMenu({
            anchor: event.object,
            onClose: async (item) => {
                try {
                    switch (item.id) {
                        case 'select_all':
                            selectAll();
                            break;
                        case 'rename':
                            const doc = getSelectedDocuments()[0];
                            const result = await prompt({
                                defaultText: doc.name,
                                title: lc('rename')
                            });
                            if (result.result && result.text?.length) {
                                await doc.save({
                                    name: result.text
                                });
                            }
                            break;
                        case 'share':
                            showImageExportPopover(event);
                            break;
                        case 'fullscreen':
                            await fullscreenSelectedDocuments();
                            unselectAll();
                            break;
                        case 'ocr':
                            await detectOCR({ documents: await getSelectedDocuments() });
                            unselectAll();
                            break;
                        case 'transform':
                            await transformPages({ documents: await getSelectedDocuments() });
                            unselectAll();
                            break;
                        case 'delete':
                            deleteSelectedDocuments();
                            break;
                        case 'move_folder':
                            const selected = await getSelectedDocuments();
                            let defaultFolder;
                            // if (selected.length === 1) {
                            //     defaultGroup = selected[0].groups?.[0];
                            // }
                            const folder = await promptForFolder(
                                defaultFolder,
                                Object.values(folders).filter((g) => g.name !== 'none')
                            );
                            if (typeof folder === 'string') {
                                // console.log('group2', typeof group, `"${group}"`, selected.length);
                                for (let index = 0; index < selected.length; index++) {
                                    const doc = selected[index];
                                    await doc.setFolder(folder === 'none' ? undefined : folder);
                                }
                            }

                            break;
                    }
                } catch (error) {
                    showError(error);
                }
            },
            options,

            vertPos: VerticalPosition.BELOW
        });
    }
    function itemTemplateSelector(item: Item, index, items) {
        if (item.folder) {
            return 'folder';
        }
        return 'default';
    }
    function itemTemplateSpanSize(item: Item, index, items) {
        if (item.folder) {
            return 1;
        }
        return 2;
    }

    async function pickFolderColor(event) {
        try {
            const ColorPickerView = (await import('~/components/common/ColorPickerView.svelte')).default;
            // const result: any = await showModal({ page: Settings, fullscreen: true, props: { position } });
            const anchorView = event.object as View;
            const color: string = await showPopover({
                backgroundColor: colorSurfaceContainer,
                vertPos: VerticalPosition.BELOW,
                horizPos: HorizontalPosition.RIGHT,
                view: ColorPickerView,
                anchor: anchorView,
                props: {
                    borderRadius: 10,
                    elevation: __ANDROID__ ? 3 : 0,
                    margin: 4,
                    width: screenWidthDips * 0.7,
                    backgroundColor: colorSurfaceContainer,
                    defaultColor: folder.color
                }
            });
            DEV_LOG && console.log('pickFolderColor', color);
            if (color) {
                await folder.save({ color });
                DEV_LOG && console.log('updating folder', folder);
                folder = folder; //for svelte to pick up change
            }
        } catch (error) {
            showError(error);
        }
    }
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatingFrom={() => search.unfocusSearch()}>
    <gridlayout paddingLeft={$windowInset.left} paddingRight={$windowInset.right} rows="auto,*">
        <!-- {/if} -->
        <collectionView
            bind:this={collectionView}
            colWidth="50%"
            iosOverflowSafeArea={true}
            {itemTemplateSelector}
            items={documents}
            paddingBottom={Math.max($windowInset.bottom, BOTTOM_BUTTON_OFFSET)}
            row={1}
            spanSize={itemTemplateSpanSize}>
            <Template let:item>
                <canvasview
                    backgroundColor={colorSurfaceContainerHigh}
                    borderRadius={12}
                    fontSize={14 * $fontScale}
                    height={getItemRowHeight(viewStyle) * $fontScale}
                    margin={8}
                    rippleColor={colorSurface}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    on:draw={(e) => onCanvasDraw(item, e)}>
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        decodeWidth={IMAGE_DECODE_WIDTH}
                        horizontalAlignment="left"
                        item={item.doc.pages[0]}
                        marginBottom={getImageMargin(viewStyle)}
                        marginLeft={10}
                        marginTop={getImageMargin(viewStyle)}
                        sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0]?.id}`}
                        stretch="aspectFill"
                        width={getItemImageHeight(viewStyle)} />
                    <SelectedIndicator horizontalAlignment="left" margin={10} selected={item.selected} />
                    <SyncIndicator synced={item.doc._synced} visible={syncEnabled} />
                    <PageIndicator horizontalAlignment="right" margin={10} text={item.doc.pages.length} />
                </canvasview>
            </Template>
            <Template key="folder" let:item>
                <canvasview
                    backgroundColor={($folderBackgroundColor && item.folder.color) || colorSurfaceContainerHigh}
                    borderColor={colorOutline}
                    borderRadius={12}
                    borderWidth={1}
                    fontSize={14 * $fontScale}
                    height={getFolderRowHeight(viewStyle) * $fontScale}
                    margin="4 8 4 8"
                    rippleColor={colorSurface}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    on:draw={(e) => onFolderCanvasDraw(item, e)}>
                    <SelectedIndicator horizontalAlignment="right" margin={10} selected={item.selected} verticalAlignment="top" />
                    <!-- <SyncIndicator synced={item.doc._synced} visible={syncEnabled} /> -->
                    <!-- <PageIndicator horizontalAlignment="right" margin={10} text={item.doc.pages.length} /> -->
                </canvasview>
            </Template>
        </collectionView>
        <progress backgroundColor="transparent" busy={true} indeterminate={true} row={1} verticalAlignment="top" visibility={loading ? 'visible' : 'hidden'} />
        {#if showNoDocument}
            <flexlayout
                flexDirection="column"
                horizontalAlignment="center"
                marginBottom="30%"
                paddingLeft={16}
                paddingRight={16}
                row={1}
                verticalAlignment="center"
                width="80%"
                transition:fade={{ duration: 200 }}>
                <lottie
                    bind:this={lottieView}
                    async={true}
                    autoPlay={true}
                    flexShrink={2}
                    keyPathColors={{
                        'background|**': lottieDarkFColor,
                        'full|**': lottieLightColor,
                        'lines|**': lottieDarkFColor,
                        'scanner|**': lottieLightColor
                    }}
                    loop={true}
                    src="~/assets/lottie/scanning.lottie" />
                <label
                    color={colorOnSurfaceVariant}
                    flexShrink={0}
                    fontSize={19}
                    text={lastRefreshFilter && showSearch ? lc('no_document_found') : lc('no_document_yet')}
                    textAlignment="center"
                    textWrap={true} />
            </flexlayout>
        {/if}
        {#if showActionButton}
            <stacklayout bind:this={fabHolder} horizontalAlignment="right" marginBottom={Math.min(60, $windowInset.bottom + 16)} orientation="horizontal" row={1} verticalAlignment="bottom">
                {#if __IOS__}
                    <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-image-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(false), 500)} />
                {/if}
                <mdbutton
                    class={$hasCamera ? 'small-fab' : 'fab'}
                    horizontalAlignment="center"
                    text="mdi-file-document-plus-outline"
                    verticalAlignment="center"
                    on:tap={throttle(() => importDocument(), 500)} />
                {#if $hasCamera}
                    <mdbutton id="fab" class="fab" margin="0 16 0 16" text="mdi-camera" verticalAlignment="center" on:tap={throttle(() => onStartCam(), 500)} on:longPress={() => onStartCam(true)} />
                {/if}
            </stacklayout>
        {/if}

        <CActionBar {title}>
            <mdbutton
                class="actionBarButton"
                class:infinite-rotate={syncRunning}
                isEnabled={!syncRunning}
                text="mdi-autorenew"
                variant="text"
                visibility={syncEnabled ? 'visible' : 'collapse'}
                on:tap={syncDocuments} />
            <mdbutton class="actionBarButton" text="mdi-magnify" variant="text" on:tap={() => search.showSearchTF()} />
            <mdbutton class="actionBarButton" text="mdi-view-dashboard" variant="text" on:tap={selectViewStyle} />

            {#if folder}
                <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-palette" variant="text" on:tap={pickFolderColor} />
            {:else}
                <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-cogs" variant="text" on:tap={() => showSettings()} />
            {/if}
            <ActionBarSearch bind:this={search} slot="center" {refresh} bind:visible={showSearch} />
        </CActionBar>
        <!-- {#if nbSelected > 0} -->
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} titleProps={{ autoFontSize: true, maxLines: 1 }}>
                <!-- <mdbutton class="actionBarButton" text="mdi-share-variant" variant="text" visibility={nbSelected ? 'visible' : 'collapse'} on:tap={showImageExportPopover} /> -->
                <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
                <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
