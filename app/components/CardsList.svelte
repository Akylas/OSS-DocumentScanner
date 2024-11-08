<script context="module" lang="ts">
    import { createNativeAttributedString } from '@nativescript-community/text';
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { SnapPosition } from '@nativescript-community/ui-collectionview';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import {
        AnimationDefinition,
        Application,
        ApplicationSettings,
        Color,
        EventData,
        Frame,
        NavigatedData,
        ObservableArray,
        OrientationChangedEventData,
        Page,
        StackLayout,
        Utils,
        View
    } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import { throttle } from '@nativescript/core/utils';
    import { showError } from '@shared/utils/showError';
    import { fade, goBack, navigate } from '@shared/utils/svelte/ui';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import SyncIndicator from '~/components/common/SyncIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { DocFolder, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import {
        DocumentAddedEventData,
        DocumentDeletedEventData,
        DocumentMovedFolderEventData,
        DocumentUpdatedEventData,
        FOLDER_COLOR_SEPARATOR,
        FolderUpdatedEventData,
        documentsService
    } from '~/services/documents';
    import { shortcutService } from '~/services/shortcuts';
    import { syncService } from '~/services/sync';
    import {
        BOTTOM_BUTTON_OFFSET,
        CARD_RATIO,
        EVENT_DOCUMENT_ADDED,
        EVENT_DOCUMENT_DELETED,
        EVENT_DOCUMENT_MOVED_FOLDER,
        EVENT_DOCUMENT_PAGE_DELETED,
        EVENT_DOCUMENT_PAGE_UPDATED,
        EVENT_DOCUMENT_UPDATED,
        EVENT_FOLDER_UPDATED,
        EVENT_STATE,
        EVENT_SYNC_STATE,
        SETTINGS_START_ON_CAM
    } from '~/utils/constants';
    import {
        detectOCR,
        goToDocumentView,
        goToFolderView,
        importAndScanImage,
        importImageFromCamera,
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
    import { colors, folderBackgroundColor, fontScale, fonts, hasCamera, screenHeightDips, screenWidthDips, startOnCam, windowInset } from '~/variables';
    import ActionBarSearch from './widgets/ActionBarSearch.svelte';
    import EditNameActionBar from './common/EditNameActionBar.svelte';

    const textPaint = new Paint();
    const rowMargin = 8;
    interface Item {
        doc?: OCRDocument;
        folder?: DocFolder;
        selected: boolean;
    }
</script>

<script lang="ts">
    let documents: ObservableArray<Item> = null;
    let folderItems: ObservableArray<Item> = null;
    let nbDocuments: number = 0;
    let showNoDocument = false;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    let lottieView: NativeViewElementNode<LottieView>;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let search: ActionBarSearch;

    let orientation = Application.orientation();
    let itemWidth = (orientation === 'landscape' ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - 2 * rowMargin - $windowInset.left - $windowInset.right;
    let itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;

    export let folder: DocFolder = null;
    export let title = l('cards');
    let folders: DocFolder[];

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

    let syncEnabled = syncService.enabled;

    let lastRefreshFilter = null;
    let showSearch = false;
    let loading = false;
    let nbSelected = 0;
    let ignoreTap = false;
    let editingTitle = false;

    $: if (nbSelected > 0) search.unfocusSearch();

    async function refresh(force = true, filter?: string) {
        if (loading || (!force && lastRefreshFilter === filter)) {
            return;
        }
        lastRefreshFilter = filter;
        loading = true;
        try {
            syncEnabled = syncService.enabled;
            const r = await documentsService.documentRepository.findDocuments({ filter, folder, omitThoseWithFolders: true, order: 'id ASC' });
            folders = filter?.length || folder ? [] : await documentsService.folderRepository.findFolders();

            folderItems = new ObservableArray(
                folders.map(
                    (folder) =>
                        ({
                            folder,
                            selected: false
                        }) as any
                )
            );
            documents = new ObservableArray(
                r.map(
                    (doc) =>
                        ({
                            doc,
                            selected: false
                        }) as any
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
        nbDocuments = documents.length;
        showNoDocument = nbDocuments === 0;
        // console.log('updateNoDocument', showNoDocument);
    }
    function onDocumentAdded(event: DocumentAddedEventData) {
        if ((!event.folder && !folder) || folder?.name === event.folder?.name) {
            documents?.push({
                doc: event.doc,
                selected: false
            } as Item);
            updateNoDocument();
            collectionView?.nativeElement.scrollToIndex(documents.length - 1, true, SnapPosition.END);
            DEV_LOG && console.log('onDocumentAdded', nbDocuments);
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
        DEV_LOG && console.log('onDocumentUpdated', index, event.doc);
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
            const item = folderItems?.getItem(index);
            if (item) {
                item.folder = event.folder;
                folderItems.setItem(index, item);
            }
        }
    }
    async function onDocumentsDeleted(event: DocumentDeletedEventData) {
        for (let i = 0; i < event.documents.length; i++) {
            const id = event.documents[i].id;
            const index = documents.findIndex((item) => item.doc && item.doc.id === id);
            if (index !== -1) {
                documents.splice(index, 1);
                nbSelected -= 1;
            }
        }
        if (!folder && event.folders?.length) {
            for (let i = 0; i < event.folders.length; i++) {
                const name = event.folders[i].split(FOLDER_COLOR_SEPARATOR)[0];
                const index = folderItems.findIndex((item) => item.folder && item.folder.name === name);
                if (index !== -1) {
                    const item = folderItems.getItem(index);
                    const res = await documentsService.folderRepository.findFolder(name);
                    item.folder = res[0];
                    folderItems.setItem(index, folderItems.getItem(index));
                }
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
        DEV_LOG && console.log('CardList onDocumentPageUpdated', index, event.pageIndex, event.imageUpdated);
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
    let syncRunning = false;
    function onSyncState(event: EventData & { state: 'running' | 'finished' }) {
        syncRunning = event.state === 'running';
    }
    // technique for only specific properties to get updated on store change
    let colorPrimaryContainer = $colors.colorPrimaryContainer;
    $: ({
        colorBackground,
        colorError,
        colorOnBackground,
        colorOnPrimary,
        colorOnPrimaryContainer,
        colorOnSecondary,
        colorOnSurfaceVariant,
        colorOutline,
        colorPrimary,
        colorPrimaryContainer,
        colorSurface,
        colorSurfaceContainer,
        colorSurfaceContainerHigh,
        colorSurfaceContainerLow
    } = $colors);

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
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        Application.on('orientationChanged', onOrientationChanged);
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
        Application.off('orientationChanged', onOrientationChanged);
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

    async function onStartCam(inverseUseSystemCamera = false) {
        try {
            await importImageFromCamera({ inverseUseSystemCamera, folder });
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument(importPDFs = true) {
        DEV_LOG && console.log('importDocument', importPDFs);
        try {
            await importAndScanImage({ importPDFs, folder });
        } catch (error) {
            showError(error);
        }
    }
    function onNavigatedTo(e: NavigatedData) {
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
        DEV_LOG && console.log('unselectItem', item);
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
    function onItemLongPress(item: Item, event?) {
        DEV_LOG && console.log('onItemLongPress', nbSelected, item);
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
    async function showImages(item: Item) {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        const doc = item.doc;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: doc.pages.map((page, index) => ({
                    sharedTransitionTag: `document_${doc.id}_${page.id}`,
                    name: page.name || doc.name,
                    image: page.imagePath,
                    ...page
                })),
                startPageIndex: 0
            }
        });
        collectionView?.nativeElement.closeCurrentMenu();
    }
    function animateCards(animOptions, startIndex, endIndex = -1) {
        let index = startIndex;
        const startView = collectionView?.nativeElement.getViewForItemAtIndex(startIndex);

        let foundFirst = false;
        collectionView?.nativeElement.eachChild((child: View) => {
            if (foundFirst) {
                if (endIndex === -1 || index <= endIndex) {
                    child.animate(animOptions);
                    index++;
                }
            } else {
                if (child === startView) {
                    foundFirst = true;
                }
            }
            return true;
        });
    }
    function translateCards(startIndex, endIndex = -1) {
        animateCards(
            {
                duration: 100,
                translate: {
                    x: 0,
                    y: 160
                }
            },
            startIndex,
            endIndex
        );
    }
    function hideCards(startIndex, endIndex = -1) {
        animateCards(
            {
                duration: 100,
                translate: {
                    x: 0,
                    y: 0
                }
            },
            startIndex,
            endIndex
        );
    }
    // let menuShowingIndex = -1;
    // let ignoreNextClose = false;
    function onFullCardItemTouch(item: Item, event) {
        const index = documents.findIndex((d) => d.doc && d.doc.id === item.doc.id);
        handleTouchAction(index, event);
    }
    function handleTouchAction(index, event) {
        // console.info('handleTouchAction', index, event.action);
        // switch (event.action) {
        //     case 'move':
        //         return;
        //     case 'down':
        //         if (menuShowingIndex !== -1) {
        //             // there is going to be a close event from the opened menu let s ignore it
        //             ignoreNextClose = true;
        //         }
        //         if (menuShowingIndex === -1) {
        //             translateCards(index);
        //         } else if (menuShowingIndex < index) {
        //             hideCards(menuShowingIndex, index - 1);
        //             translateCards(index);
        //         } else if (menuShowingIndex > index) {
        //             translateCards(index, menuShowingIndex);
        //         }
        //         menuShowingIndex = index;
        //         break;
        //     case 'up':
        //     case 'cancel':
        //         if (ignoreNextClose) {
        //             ignoreNextClose = false;
        //             return;
        //         }
        //         hideCards(index);
        //         menuShowingIndex = -1;
        //         break;
        // }
    }
    function onItemTouch(item: Item, event) {
        if (__ANDROID__) {
            // const index = documents.findIndex((d) => d.doc.id === item.doc.id);
            switch (event.action) {
                case 'down':
                    (event.object as View).animate({
                        duration: 100,
                        translate: {
                            x: 0,
                            y: -40
                        }
                    });
                    break;

                case 'up':
                case 'cancel':
                    (event.object as View).animate({
                        duration: 100,
                        translate: {
                            x: 0,
                            y: 0
                        }
                    });
                    break;
            }
        }
    }
    const onItemTap = throttle(async function (item: Item) {
        try {
            if (ignoreTap) {
                ignoreTap = false;
                return;
            }
            DEV_LOG && console.log('onItemTap', nbSelected, item);
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
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            } else {
                onGoBack(data);
            }
        });

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
    function getSelectedPagesAndPossibleSingleDocument(): [OCRPage[], OCRDocument?] {
        const selected: OCRPage[] = [];
        const docs: OCRDocument[] = [];
        let doc;
        documents.forEach((d, index) => {
            if (d.doc && d.selected) {
                doc = d.doc;
                docs.push(doc);
                selected.push(...doc.pages);
            }
        });
        return [selected, docs.length === 1 ? docs[0] : undefined];
    }
    async function fullscreenSelectedDocuments() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: (await getSelectedDocuments()).reduce((acc, doc) => {
                    doc.pages.forEach((page) =>
                        acc.push({
                            // sharedTransitionTag: `document_${doc.id}_${page.id}`,
                            name: page.name || doc.name,
                            image: page.imagePath,
                            ...page
                        })
                    );
                    DEV_LOG && console.log('acc', acc.length);
                    return acc;
                }, []),
                startPageIndex: 0
            }
        });
    }
    async function deleteSelectedDocuments() {
        if (nbSelected > 0) {
            try {
                const result = await confirm({
                    title: lc('delete'),
                    message: lc('confirm_delete_documents', nbSelected),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
                if (result) {
                    await documentsService.deleteDocuments(await getSelectedDocuments());
                }
            } catch (error) {
                showError(error);
            }
        }
    }

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
    // async function switchLayout() {
    //     try {
    //         await collectionView?.nativeElement.closeCurrentMenu();
    //         if (viewStyle === 'default') {
    //             viewStyle = 'fullcard';
    //         } else {
    //             viewStyle = 'default';
    //         }
    //         ApplicationSettings.setString('cardViewStyle', viewStyle);
    //         collectionView?.nativeView.refresh();
    //     } catch (error) {
    //         showError(error);
    //     }
    // }
    async function syncDocuments() {
        try {
            if (!syncEnabled) {
                return;
                // return showSyncSettings();
            }
            await syncService.syncDocuments({ force: true, bothWays: true });
        } catch (error) {
            showError(error);
        }
    }
    // async function showSyncSettings() {
    //     try {
    //         const WebdavConfig = (await import('~/components/webdav/WebdavConfig.svelte')).default;
    //         await showBottomSheet({
    //             parent: this,
    //             skipCollapsedState: true,
    //             view: WebdavConfig,
    //             ignoreTopSafeArea: true
    //         });
    //     } catch (error) {
    //         showError(error);
    //     }
    // }

    // function setLottieColor(colorStr) {
    //     if (!colorStr) {
    //         return;
    //     }
    //     const color = new Color(colorStr);
    //     // const nativeKeyPath: any[] = Array.create(java.lang.String, 2);
    //     // nativeKeyPath[0] = 'trans';
    //     // nativeKeyPath[1] = '*';
    //     // const result = lottieView.nativeView.resolveKeyPath(new com.airbnb.lottie.model.KeyPath(nativeKeyPath));
    //     // console.log('resolveKeyPath', result);
    //     // lottieView.setColorValueDelegateForKeyPath(color, ['Rectangle','Rectangle', 'Fill 1']);
    //     // lottieView.setColor(color, ['full', '**']);
    //     // lottieView.setColorValueDelegateForKeyPath(color, ['full', 'Rectangle 3']);
    //     // lottieView.setColor(color, ['bottom-grad', '**']);
    //     // lottieView.setColor(color, ['trans', 'Rectangle', 'Rectangle', 'Fill 1']);
    //     // lottieView.setColor(color, ['full', 'Rectangle 3', '**']);
    //     lottieView?.nativeView?.setColor(color, ['**']);
    // }

    // $: setLottieColor(colorPrimaryContainer);

    // function onLottieLoaded({ object: lottieView }: { object: LottieView }) {
    //     try {
    //         setLottieColor(colorPrimaryContainer);
    //     } catch (error) {
    //         showError(error);
    //     }
    // }
    // function getSize(item: Item) {
    //     return filesize(item.doc.pages.reduce((acc, v) => acc + v.size, 0));
    // }
    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);

    // let lottieLightColor = new Color(colorPrimaryContainer);
    // const
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
    let viewStyle: string = ApplicationSettings.getString('documents_list_view_style', 'full');

    function fullCardDrawerTranslationFunction(side, width, value, delta, progress) {
        const result = {
            mainContent: {
                translateX: side === 'right' ? -delta : delta
            },
            rightDrawer: {
                // translateX: width + (side === 'right' ? -delta : delta)
            },
            leftDrawer: {
                // translateX: (side === 'right' ? -delta : delta) - width
            },
            backDrop: {
                translateX: side === 'right' ? -delta : delta.dev,
                opacity: progress * 0.01
            }
        };

        return result;
    }

    async function showOptions(event) {
        const options = new ObservableArray(
            (folder ? [{ id: 'select_all', name: lc('select_all'), icon: 'mdi-select-all' }] : []).concat(nbSelected === 1 ? [{ id: 'rename', name: lc('rename'), icon: 'mdi-rename' }] : []).concat([
                { icon: 'mdi-folder-swap', id: 'move_folder', name: lc('move_folder') },
                { id: 'share', name: lc('share_images'), icon: 'mdi-share-variant' },
                { id: 'fullscreen', name: lc('show_fullscreen_images'), icon: 'mdi-fullscreen' },
                { id: 'transform', name: lc('transform_images'), icon: 'mdi-auto-fix' },
                { id: 'ocr', name: lc('ocr_document'), icon: 'mdi-text-recognition' },
                { id: 'delete', name: lc('delete'), icon: 'mdi-delete', color: colorError }
            ] as any)
        );
        return showPopoverMenu({
            options,
            anchor: event.object,
            vertPos: VerticalPosition.BELOW,

            onClose: async (item) => {
                switch (item.id) {
                    case 'select_all':
                        selectAll();
                        break;
                    case 'rename':
                        const item = getSelectedItems()[0];
                        const result = await prompt({
                            title: lc('rename'),
                            defaultText: (item.doc || item.folder).name
                        });
                        if (result.result && result.text?.length) {
                            await (item.doc || item.folder).save({
                                name: result.text
                            });
                            if (item.doc) {
                                shortcutService.updateShortcuts(item.doc);
                            }
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
            }
        });
    }
    async function selectViewStyle(event) {
        try {
            // const options = Object.keys(OPTIONS[option]).map((k) => ({ ...OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                options: [
                    { id: 'cardholder', name: lc('cardholder'), icon: 'mdi-view-agenda', color: viewStyle === 'cardholder' ? colorPrimary : undefined },
                    { id: 'full', name: lc('full'), icon: 'mdi-view-split-horizontal', color: viewStyle === 'full' ? colorPrimary : undefined },
                    { id: 'columns', name: lc('columns'), icon: 'mdi-view-grid', color: viewStyle === 'columns' ? colorPrimary : undefined },
                    { id: 'list', name: lc('list'), icon: 'mdi-view-day', color: viewStyle === 'list' ? colorPrimary : undefined }
                ],
                vertPos: VerticalPosition.BELOW,
                anchor: event.object,
                onClose: (item) => {
                    const changed = itemTemplateSelector(viewStyle) !== itemTemplateSelector(item.id);
                    DEV_LOG && console.log('selectViewStyle', viewStyle, item.id, itemTemplateSelector(viewStyle), itemTemplateSelector(item.id), changed);
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

    $: itemWidth = (orientation === 'landscape' ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - $windowInset.left - $windowInset.right;
    $: {
        itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;
        refreshCollectionView();
    }
    $: DEV_LOG && console.log('itemWidth', (orientation === 'landscape' ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin, itemWidth, itemHeight, $windowInset.left, $windowInset.right);

    function onOrientationChanged(event: OrientationChangedEventData) {
        orientation = event.newValue;
        DEV_LOG && console.log('onOrientationChanged', itemWidth, itemHeight);
        // }, 1000);
    }

    function getColWidth(viewStyle) {
        const width = orientation === 'landscape' ? screenHeightDips : screenWidthDips;
        switch (viewStyle) {
            case 'columns':
                return width / 2;
            default:
                return width;
        }
    }

    function getRowHeight(viewStyle, item) {
        const width = orientation === 'landscape' ? screenHeightDips : screenWidthDips;
        switch (viewStyle) {
            case 'full':
            case 'cardholder':
            case 'list':
                return itemHeight;
            case 'columns':
                return orientation === 'landscape' ? itemHeight : (width / 2) * CARD_RATIO;
        }
    }
    function getItemOverlap(viewStyle) {
        switch (viewStyle) {
            case 'full':
                return (item, position) => {
                    if (position === 0 || (orientation === 'landscape' && position === 1)) {
                        return [0, 0, 0, 0];
                    }
                    return [-0.71 * itemHeight, 0, 0, 0];
                };
            case 'cardholder':
                return (item, position) => {
                    if (position === 0 || (orientation === 'landscape' && position === 1)) {
                        return [0, 0, 0, 0];
                    }
                    return [-0.11 * itemHeight, 0, 0, 0];
                };
            default:
                return null;
        }
    }
    function itemTemplateSelector(viewStyle, item?) {
        switch (viewStyle) {
            case 'list':
            case 'columns':
                if (orientation === 'landscape') {
                    return 'columns';
                }
                return viewStyle;
            default:
                return viewStyle;
        }
    }
    function itemTemplateSpanSize(viewStyle, item: Item) {
        if (viewStyle === 'columns' || orientation === 'landscape') {
            return 1;
        }
        return 2;
    }

    async function onAddButton() {
        DEV_LOG && console.log('onAddButton');
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
                );
            const option = await showBottomSheet({
                parent: this,
                view: OptionSelect,
                ignoreTopSafeArea: true,
                props: {
                    rowHeight,
                    height: Math.min(rowHeight * options.length, 400),
                    options
                }
            });
            DEV_LOG && console.log('on add option', option);
            if (option) {
                switch (option.id) {
                    case 'camera':
                        await importImageFromCamera({ inverseUseSystemCamera: false });
                        break;
                    case 'import':
                        await importDocument();
                        break;
                    case 'import_image':
                        await importDocument(false);
                        break;
                }
            }
        } catch (error) {
            showError(error);
        }
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
</script>

<page bind:this={page} id="cardsList" actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatingFrom={() => search.unfocusSearch()}>
    <gridlayout paddingLeft={$windowInset.left} paddingRight={$windowInset.right} rows="auto,auto,*">
        <!-- {/if} -->
        <collectionView
            bind:this={collectionView}
            colWidth={150}
            height={70}
            items={folderItems}
            orientation="horizontal"
            row={1}
            rowHeight={70}
            ios:iosOverflowSafeArea={true}
            visibility={folders?.length ? 'visible' : 'collapsed'}>
            <Template let:item>
                <canvasview
                    backgroundColor={($folderBackgroundColor && item.folder.color) || colorSurfaceContainerHigh}
                    borderColor={colorOutline}
                    borderRadius={12}
                    borderWidth={1}
                    margin="0 8 0 8"
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
        <collectionView
            bind:this={collectionView}
            id="list"
            colWidth="50%"
            itemOverlap={getItemOverlap(viewStyle)}
            ios:iosOverflowSafeArea={true}
            itemTemplateSelector={(item) => itemTemplateSelector(viewStyle, item)}
            items={documents}
            paddingBottom={Math.max($windowInset.bottom, BOTTOM_BUTTON_OFFSET)}
            row={2}
            spanSize={(item) => itemTemplateSpanSize(viewStyle, item)}
            swipeMenuId="swipeMenu"
            on:swipeMenuClose={(e) => handleTouchAction(e.index, { action: 'up' })}>
            <Template key="cardholder" let:item>
                <absolutelayout height={150}>
                    <swipemenu
                        id="swipeMenu"
                        height={getRowHeight('cardholder', item)}
                        openAnimationDuration={100}
                        rightSwipeDistance={0}
                        startingSide={item.startingSide}
                        translationFunction={fullCardDrawerTranslationFunction}
                        width="100%">
                        <gridlayout
                            prop:mainContent
                            backgroundColor={item.doc.pages[0].colors?.[0]}
                            borderRadius={12}
                            boxShadow="0 0 8 rgba(0, 0, 0, 0.8)"
                            margin="50 24 0 24"
                            rippleColor={colorSurface}
                            on:touch={(e) => onItemTouch(item, e)}
                            on:tap={() => onItemTap(item)}
                            on:longPress={(e) => onItemLongPress(item, e)}>
                            <RotableImageView
                                id="imageView"
                                borderRadius={12}
                                decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                                fadeDuration={100}
                                item={item.doc.pages[0]}
                                sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                                stretch="aspectFill" />
                            <gridlayout borderRadius={12}>
                                <SelectedIndicator selected={item.selected} />
                                <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
                            </gridlayout>
                        </gridlayout>
                        <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />
                    </swipemenu>
                    <absolutelayout boxShadow="0 -1 8 rgba(0, 0, 0, 0.8)" height={3} top={150} width="100%" />
                </absolutelayout>
            </Template>
            <Template key="full" let:item>
                <swipemenu
                    id="swipeMenu"
                    height={getRowHeight('full', item)}
                    openAnimationDuration={100}
                    rightDrawerMode="under"
                    rightSwipeDistance={0}
                    startingSide={item.startingSide}
                    translationFunction={fullCardDrawerTranslationFunction}
                    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
                    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
                    <gridlayout
                        prop:mainContent
                        backgroundColor={item.doc.pages[0].colors?.[0]}
                        borderRadius={12}
                        boxShadow="0 0 8 rgba(0, 0, 0, 0.8)"
                        margin="16 16 16 16"
                        on:tap={() => onItemTap(item)}
                        on:longPress={(e) => onItemLongPress(item, e)}>
                        <RotableImageView
                            id="imageView"
                            borderRadius={12}
                            decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                            decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                            fadeDuration={100}
                            item={item.doc.pages[0]}
                            sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                            stretch="aspectFill" />
                        <gridlayout borderRadius={12}>
                            <SelectedIndicator selected={item.selected} />
                            <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
                        </gridlayout>
                    </gridlayout>

                    <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                        <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
                    </stacklayout>
                </swipemenu>
            </Template>
            <Template key="list" let:item>
                <swipemenu
                    id="swipeMenu"
                    height={getRowHeight('list', item)}
                    openAnimationDuration={100}
                    rightDrawerMode="under"
                    rightSwipeDistance={0}
                    startingSide={item.startingSide}
                    translationFunction={fullCardDrawerTranslationFunction}
                    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
                    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
                    <gridlayout
                        prop:mainContent
                        backgroundColor={item.doc.pages[0].colors?.[0]}
                        borderRadius={12}
                        elevation={3}
                        margin={4}
                        on:tap={() => onItemTap(item)}
                        on:longPress={(e) => onItemLongPress(item, e)}>
                        <RotableImageView
                            id="imageView"
                            borderRadius={12}
                            decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                            decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                            fadeDuration={100}
                            item={item.doc.pages[0]}
                            sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                            stretch="aspectFill" />
                        <gridlayout>
                            <SelectedIndicator selected={item.selected} />
                            <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                        </gridlayout>
                    </gridlayout>

                    <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                        <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
                    </stacklayout>
                </swipemenu>
            </Template>
            <Template key="columns" let:item>
                <swipemenu
                    id="swipeMenu"
                    height={getRowHeight('columns', item)}
                    openAnimationDuration={100}
                    rightDrawerMode="under"
                    rightSwipeDistance={0}
                    startingSide={item.startingSide}
                    translationFunction={fullCardDrawerTranslationFunction}
                    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
                    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
                    <gridlayout
                        prop:mainContent
                        backgroundColor={item.doc.pages[0].colors?.[0]}
                        borderRadius={12}
                        elevation={3}
                        margin={4}
                        on:tap={() => onItemTap(item)}
                        on:longPress={(e) => onItemLongPress(item, e)}>
                        <RotableImageView
                            id="imageView"
                            borderRadius={12}
                            decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                            decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                            fadeDuration={100}
                            item={item.doc.pages[0]}
                            sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                            stretch="aspectFill" />
                        <gridlayout>
                            <SelectedIndicator selected={item.selected} />
                            <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                        </gridlayout>
                    </gridlayout>

                    <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                        <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
                    </stacklayout>
                </swipemenu>
            </Template>
        </collectionView>
        <progress backgroundColor="transparent" busy={true} indeterminate={true} row={2} verticalAlignment="top" visibility={loading ? 'visible' : 'hidden'} />
        {#if showNoDocument}
            <flexlayout
                flexDirection="column"
                horizontalAlignment="center"
                marginBottom="30%"
                paddingLeft={16}
                paddingRight={16}
                row={2}
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
                        'scanner|**': lottieLightColor,
                        'lines|**': lottieDarkFColor
                    }}
                    loop={true}
                    src="~/assets/lottie/scanning.lottie" />
                <label
                    color={colorOnSurfaceVariant}
                    flexShrink={0}
                    fontSize={19}
                    text={lc(lastRefreshFilter && showSearch ? lc('no_card_found') : 'no_card_yet')}
                    textAlignment="center"
                    textWrap={true} />
            </flexlayout>
        {/if}
        {#if showActionButton}
            <mdbutton
                bind:this={fabHolder}
                id="fab"
                class="fab"
                horizontalAlignment="right"
                iosIgnoreSafeArea={true}
                margin={`16 16 ${Math.min(60, $windowInset.bottom + 16)} 16`}
                row={2}
                text="mdi-plus"
                verticalAlignment="bottom"
                on:tap={throttle(() => onAddButton(), 500)} />
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
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} titleProps={{ maxLines: 1, autoFontSize: true }}>
                <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
                <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            </CActionBar>
        {/if}
        {#if editingTitle}
            <EditNameActionBar {folder} bind:editingTitle />
        {/if}
    </gridlayout>
</page>
