<script context="module" lang="ts">
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { AnimationDefinition, Application, ApplicationSettings, Color, EventData, Frame, NavigatedData, ObservableArray, Page, StackLayout } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import { throttle } from '@nativescript/core/utils';
    import { showError } from '@shared/utils/showError';
    import { fade, goBack, navigate } from '@shared/utils/svelte/ui';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import EditNameActionBar from '~/components/common/EditNameActionBar.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import ActionBarSearch from '~/components/widgets/ActionBarSearch.svelte';
    import { l, lc } from '~/helpers/locale';
    import { colorTheme, getRealTheme, isEInk, onThemeChanged } from '~/helpers/theme';
    import { DocFolder, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import {
        DocumentAddedEventData,
        DocumentDeletedEventData,
        DocumentMovedFolderEventData,
        DocumentPageUpdatedEventData,
        DocumentUpdatedEventData,
        FolderUpdatedEventData,
        documentsService
    } from '~/services/documents';
    import { syncService, syncServicesStore } from '~/services/sync';
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
    import {
        detectOCR,
        goToDocumentView,
        goToFolderView,
        importAndScanImage,
        onAndroidNewItent,
        onBackButton,
        pickFolderColor,
        promptForFolderName,
        showImagePopoverMenu,
        showPDFPopoverMenu,
        showPopoverMenu,
        showSettings,
        transformPages
    } from '~/utils/ui';
    import { colors, folderBackgroundColor, fontScale, fonts, onFolderBackgroundColorChanged, startOnCam, windowInset } from '~/variables';

    const textPaint = new Paint();

    export interface Item {
        type?: string;
        doc?: OCRDocument;
        folder?: DocFolder;
        selected: boolean;
        startingSide?: string;
    }
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    let { colorError, colorOnBackground, colorOnSurfaceVariant, colorOutline, colorPrimary, colorPrimaryContainer, colorSurface, colorSurfaceContainerHigh } = $colors;
    $: ({ colorError, colorOnBackground, colorOnSurfaceVariant, colorOutline, colorPrimary, colorPrimaryContainer, colorSurface, colorSurfaceContainerHigh } = $colors);

    let folders: DocFolder[] = [];
    export let collectionViewOptions = {};
    export let documents: ObservableArray<Item> = null;
    export let folderItems: ObservableArray<Item> = null;
    let nbDocuments: number = 0;
    let showNoDocument = false;
    let page: NativeViewElementNode<Page>;
    export let collectionView: NativeViewElementNode<CollectionView>;
    let foldersCollectionView: NativeViewElementNode<CollectionView>;
    // let lottieView: NativeViewElementNode<LottieView>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let search: ActionBarSearch;

    export let folder: DocFolder = null;
    export let title: string;
    export let itemTemplateSelector = (viewStyle, item?: Item) => item?.type || 'default';
    export let viewStyles: { [k: string]: { name: string; icon?: string; type?: string; boxType?: string } };
    export let viewStyleChanged = (oldValue, newValue) => newValue !== oldValue;
    export let defaultOrder = 'id DESC';
    export let defaultViewStyle = 'expanded';
    export let syncEnabled = syncService.enabled;
    export let viewStyle: string = ApplicationSettings.getString('documents_list_view_style', defaultViewStyle);

    $: if ($syncServicesStore) {
        syncEnabled = syncService.enabled;
    }
    $: if (folder) {
        DEV_LOG && console.log('updating folder title', folder);
        title = createNativeAttributedString({
            spans: [
                {
                    fontFamily: $fonts.mdi,
                    color: folder.color || colorOutline,
                    fontSize: 24,
                    text: 'mdi-folder  '
                },
                {
                    text: folder.name
                }
            ]
        });
    }

    let syncRunning = false;
    $: DEV_LOG && console.log('syncEnabled', syncEnabled);

    let lastRefreshFilter = null;
    let showSearch = false;
    let loading = false;
    let nbSelected = 0;
    let ignoreTap = false;
    let editingTitle = false;

    $: if (nbSelected > 0) search.unfocusSearch();

    async function refresh(force = true, filter?: string) {
        DEV_LOG && console.log('refresh', force, filter);
        if (loading || (!force && lastRefreshFilter === filter)) {
            return;
        }
        lastRefreshFilter = filter;
        nbSelected = 0;
        loading = true;
        try {
            DEV_LOG && console.log('DocumentsList', 'refresh', folder, filter);
            const r = await documentsService.documentRepository.findDocuments({ filter, folder, omitThoseWithFolders: true, order: defaultOrder });

            folders = filter?.length || folder ? [] : await documentsService.folderRepository.findFolders();
            DEV_LOG && console.log('folders', JSON.stringify(folders));
            folderItems = new ObservableArray(
                folders
                    .filter((f) => f.count > 0)
                    .map(
                        (folder) =>
                            ({
                                folder,
                                selected: false
                            }) as any
                    )
            );
            documents = new ObservableArray(
                (folderItems.length ? [{ type: 'folders', selected: false }] : []).concat(
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
        if ((!event.folder && !folder) || folder?.name === event.folder?.name) {
            DEV_LOG && console.log('onDocumentAdded', nbDocuments);
            // find the first document index to add the new doc just before
            const index = documents?.findIndex((d) => !!d.doc);
            if (index !== -1) {
                documents?.splice(index, 0, {
                    doc: event.doc,
                    selected: false
                } as Item);
                collectionView?.nativeElement.scrollToIndex(index, false);
            } else {
                refresh();
            }
            updateNoDocument();
        } else if (!folder && event.folder) {
            refresh();
        }
    }

    function onDocumentMovedFolder(event: DocumentMovedFolderEventData) {
        // TODO: for now we refresh otherwise the order might be lost
        // DEV_LOG && console.log('onDocumentMovedFolder', folder?.id, event.folder?.id, event.oldFolderId, !!folder, folder?.id === event.oldFolderId, typeof folder?.id, typeof event.oldFolderId);
        if (!folder && (!event.folder || !event.oldFolderId)) {
            refresh();
        } else if (!!folder && (folder.id === event.folder?.id || folder.id === event.oldFolderId)) {
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
        DEV_LOG && console.log('onFolderUpdated', event.folder);
        if (event.folder && folder && event.folder.id === folder?.id) {
            folder = event.folder;
        }
        let index = -1;
        folderItems?.some((d, i) => {
            if (d.folder && d.folder.id === event.folder.id) {
                index = i;
                return true;
            }
        });
        if (index >= 0) {
            const item = folderItems.getItem(index);
            if (item) {
                item.folder = event.folder;
                folderItems.setItem(index, item);
            }
        }
    }
    async function onDocumentsDeleted(event: DocumentDeletedEventData) {
        DEV_LOG &&
            console.log(
                'onDocumentsDeleted',
                event.documents.map((d) => d.id),
                event.folders
            );
        for (let i = 0; i < event.documents.length; i++) {
            const id = event.documents[i].id;
            const index = documents.findIndex((item) => item.doc && item.doc.id === id);
            if (index !== -1) {
                documents.splice(index, 1);
                if (nbSelected > 0) {
                    nbSelected = Math.max(nbSelected - 1, 0);
                }
            }
        }
        if (!folder && event.folders?.length) {
            for (let i = 0; i < event.folders.length; i++) {
                const folderId = event.folders[i];
                const index = folderItems.findIndex((item) => item.folder && item.folder.id === folderId);
                if (index !== -1) {
                    const item = folderItems.getItem(index);
                    const res = await documentsService.folderRepository.findFolderById(folderId);
                    item.folder = res[0];
                    if (item.folder.count > 0) {
                        folderItems.setItem(index, folderItems.getItem(index));
                    } else {
                        folderItems.splice(index, 1);
                    }
                }
            }
            if (folderItems.length === 0) {
                documents.splice(0, 1);
            }
        }
        updateNoDocument();
    }
    function getImageView(index: number) {
        const view = collectionView?.nativeView?.getViewForItemAtIndex(index);
        return view?.getViewById<Img>('imageView');
    }

    function onDocumentPageUpdated(event: DocumentPageUpdatedEventData) {
        // let index = -1;
        const document = event.doc;
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
        DEV_LOG && console.log('MainList', 'onMount', documentsService.id);
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
    });
    onDestroy(() => {
        DEV_LOG && console.log('MainList', 'onDestroy');
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

    const showActionButton = !startOnCam;

    export async function importDocument(importPDFs = true) {
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
            if (item.folder) {
                folderItems?.some((d, index) => {
                    if (d === item) {
                        nbSelected += d.folder.count;
                        d.selected = true;
                        folderItems.setItem(index, d);
                        return true;
                    }
                });
            } else {
                documents?.some((d, index) => {
                    if (d === item) {
                        nbSelected += 1;
                        d.selected = true;
                        documents.setItem(index, d);
                        return true;
                    }
                });
            }
        }
    }

    function unselectItem(item: Item) {
        // DEV_LOG && console.log('unselectItem', item);
        if (item.selected) {
            if (item.folder) {
                folderItems?.some((d, index) => {
                    if (d === item) {
                        nbSelected -= d.folder.count;
                        d.selected = false;
                        folderItems.setItem(index, d);
                        return true;
                    }
                });
            } else {
                documents?.some((d, index) => {
                    if (d === item) {
                        nbSelected -= 1;
                        d.selected = false;
                        documents.setItem(index, d);
                        return true;
                    }
                });
            }
        }
    }
    function unselectAll() {
        nbSelected = 0;
        if (documents) {
            documents.splice(0, documents.length, ...documents.map((i) => ({ ...i, selected: false })));
        }
        if (folderItems) {
            folderItems.splice(0, folderItems.length, ...folderItems.map((i) => ({ ...i, selected: false })));
        }
    }
    function selectAll() {
        let newCount = documents.length;
        if (documents) {
            documents.splice(0, documents.length, ...documents.map((i) => ({ ...i, selected: true })));
        }
        if (folderItems) {
            folderItems.splice(
                0,
                folderItems.length,
                ...folderItems.map((i) => {
                    newCount += i.folder.count;
                    return { ...i, selected: false };
                })
            );
        }
        nbSelected = newCount;
    }
    export function onItemLongPress(item: Item, event?) {
        if (item.selected) {
            unselectItem(item);
        } else {
            selectItem(item);
        }
    }
    export const onItemTap = throttle(async function (item: Item) {
        try {
            if (ignoreTap) {
                ignoreTap = false;
                return;
            }
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
    }, 500);

    function onGoBack(data) {
        if (editingTitle) {
            if (data) {
                data.cancel = true;
            }
            editingTitle = false;
        } else if (showSearch) {
            if (data) {
                data.cancel = true;
            }
            search.hideSearch();
        }
    }
    function actionBarOnGoBack() {
        if (showSearch) {
            search.hideSearch();
        } else if (Frame.topmost().canGoBack()) {
            goBack();
        }
    }
    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            DEV_LOG && console.log('onBackButton');
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            } else {
                onGoBack(data);
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
                            name: doc.name,
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
                }
            }
        }
        for (let index = 0; index < folderItems.length; index++) {
            const d = folderItems.getItem(index);
            if (d.selected) {
                if (d.folder) {
                    selected.push(...(await documentsService.documentRepository.findDocuments({ folder: d.folder })));
                }
            }
        }
        return selected;
    }
    function getSelectedItems() {
        const selected: Item[] = [];
        for (let index = 0; index < folderItems.length; index++) {
            const d = folderItems.getItem(index);
            if (d.selected) {
                selected.push(d);
            }
        }
        for (let index = 0; index < documents.length; index++) {
            const d = documents.getItem(index);
            if (d.selected) {
                selected.push(d);
            }
        }
        return selected;
    }
    function getSelectedPagesAndPossibleSingleDocument(): [{ page: OCRPage; document: OCRDocument }[], OCRDocument?] {
        const selected: { page: OCRPage; document: OCRDocument }[] = [];
        const docs: OCRDocument[] = [];
        let doc;
        documents.forEach((d, index) => {
            if (d.doc && d.selected) {
                doc = d.doc;
                docs.push(doc);
                selected.push(...doc.pages.map((page) => ({ page, document: doc })));
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
                return true;
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
                options: Object.keys(viewStyles).map((k) => ({
                    id: k,
                    ...viewStyles[k],
                    value: viewStyle === k,
                    color: viewStyle === k ? colorPrimary : undefined
                })),
                vertPos: VerticalPosition.BELOW,
                onClose: (item) => {
                    const changed = viewStyleChanged(item.id, viewStyle);

                    viewStyle = item.id;
                    ApplicationSettings.setString('documents_list_view_style', viewStyle);
                    if (changed) {
                        collectionView?.nativeView.refresh();
                    }
                }
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
    export function refreshCollectionView() {
        DEV_LOG && console.log('refreshCollectionView');
        foldersCollectionView?.nativeView?.refresh();
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

    function onFolderCanvasDraw(item: Item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const dx = 10;
        const { folder } = item;
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
                    lineHeight: 20 * $fontScale,
                    text: '\n' + lc('documents_count', item.folder.count)
                }
            ]
        });
        canvas.save();
        const staticLayout = new StaticLayout(topText, textPaint, w - dx, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
        canvas.translate(dx, h / 2 - staticLayout.getHeight() / 2);
        staticLayout.draw(canvas);
        canvas.restore();
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
        return showImagePopoverMenu(getSelectedPagesAndPossibleSingleDocument()[0], event.object);
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
                    let result;
                    switch (item.id) {
                        case 'select_all':
                            selectAll();
                            break;
                        case 'rename':
                            const item = getSelectedItems()[0];
                            result = await prompt({
                                title: lc('rename'),
                                defaultText: (item.doc || item.folder).name
                            });
                            if (result.result && result.text?.length) {
                                await (item.doc || item.folder).save({
                                    name: result.text
                                });
                            }
                            break;
                        case 'share':
                            result = await showImageExportPopover(event);
                            if (result) {
                                unselectAll();
                            }
                            break;
                        case 'fullscreen':
                            await fullscreenSelectedDocuments();
                            unselectAll();
                            break;
                        case 'ocr':
                            result = await detectOCR({ documents: await getSelectedDocuments() });
                            if (result) {
                                unselectAll();
                            }
                            break;
                        case 'transform':
                            result = await transformPages({ documents: await getSelectedDocuments() });
                            if (result) {
                                unselectAll();
                            }
                            break;
                        case 'delete':
                            result = await deleteSelectedDocuments();
                            if (result) {
                                unselectAll();
                            }
                            break;
                        case 'move_folder':
                            const selected = await getSelectedDocuments();
                            let defaultFolder;
                            DEV_LOG && console.log('move_folder', folders);
                            const folderName = await promptForFolderName(
                                defaultFolder,
                                Object.values(folders).filter((g) => g.name !== 'none')
                            );
                            if (typeof folderName === 'string') {
                                for (let index = 0; index < selected.length; index++) {
                                    const doc = selected[index];
                                    await doc.setFolder({ folderName: folderName === 'none' ? undefined : folderName });
                                }
                                unselectAll();
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
    function itemTemplateSpanSize(item: Item, index, items) {
        if (item.folder) {
            return 1;
        }
        return 2;
    }

    async function setFolderColor(event) {
        try {
            const color: string = await pickFolderColor(folder, event);
            if (color) {
                folder = folder; //for svelte to pick up change
            }
        } catch (error) {
            showError(error);
        }
    }
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatingFrom={() => search.unfocusSearch()}>
    <gridlayout class="pageContent" rows="auto,*">
        <collectionView
            bind:this={collectionView}
            colWidth="50%"
            ios:iosOverflowSafeArea={true}
            itemTemplateSelector={(item) => itemTemplateSelector(viewStyle, item)}
            ios:layoutHorizontalAlignment="left"
            ios:layoutStyle="align"
            items={documents}
            paddingBottom={Math.max($windowInset.bottom, BOTTOM_BUTTON_OFFSET)}
            row={1}
            spanSize={itemTemplateSpanSize}
            {...collectionViewOptions}>
            <Template key="folders" let:item>
                <collectionView
                    bind:this={foldersCollectionView}
                    colWidth={150}
                    height={70}
                    items={folderItems}
                    orientation="horizontal"
                    row={1}
                    ios:iosOverflowSafeArea={true}
                    visibility={folders?.length ? 'visible' : 'collapsed'}>
                    <Template let:item>
                        <canvasview
                            backgroundColor={($folderBackgroundColor && item.folder.color) || isEInk ? 'transparent' : colorSurfaceContainerHigh}
                            borderColor={colorOutline}
                            borderRadius={12}
                            borderWidth={1}
                            margin="4 8 0 8"
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
            </Template>
            <slot></slot>
        </collectionView>
        <progress backgroundColor="transparent" busy={true} indeterminate={true} row={2} verticalAlignment="top" visibility={loading ? 'visible' : 'hidden'} />
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
            <slot name="fab" />
        {/if}

        <CActionBar modalWindow={showSearch} onGoBack={actionBarOnGoBack} onTitleTap={folder ? () => (editingTitle = true) : null} {title}>
            <mdbutton
                class="actionBarButton"
                class:infinite-rotate={syncRunning}
                isEnabled={!syncRunning}
                text="mdi-autorenew"
                variant="text"
                visibility={syncEnabled ? 'visible' : 'collapse'}
                on:tap={syncDocuments} />
            <mdbutton class="actionBarButton" text="mdi-magnify" variant="text" on:tap={() => search.showSearch()} />
            <mdbutton class="actionBarButton" text="mdi-view-dashboard" variant="text" on:tap={selectViewStyle} />
            {#if folder}
                <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-palette" variant="text" on:tap={setFolderColor} />
            {:else}
                <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-cogs" variant="text" on:tap={() => showSettings()} />
            {/if}
            <ActionBarSearch bind:this={search} slot="center" {refresh} bind:visible={showSearch} />
        </CActionBar>
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} titleProps={{ autoFontSize: true, maxLines: 1 }}>
                <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
                <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            </CActionBar>
        {/if}
        {#if editingTitle}
            <EditNameActionBar {folder} bind:editingTitle />
        {/if}
    </gridlayout>
</page>
