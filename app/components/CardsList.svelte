<script lang="ts">
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { SnapPosition } from '@nativescript-community/ui-collectionview';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { AnimationDefinition, Application, ApplicationSettings, Color, EventData, NavigatedData, ObservableArray, Page, StackLayout, Utils, View } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import { throttle } from '@nativescript/core/utils';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import SyncIndicator from '~/components/common/SyncIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { DocumentAddedEventData, DocumentDeletedEventData, DocumentUpdatedEventData, documentsService } from '~/services/documents';
    import { syncService } from '~/services/sync';
    import {
        CARD_RATIO,
        EVENT_DOCUMENT_ADDED,
        EVENT_DOCUMENT_DELETED,
        EVENT_DOCUMENT_PAGE_DELETED,
        EVENT_DOCUMENT_PAGE_UPDATED,
        EVENT_DOCUMENT_UPDATED,
        EVENT_STATE,
        EVENT_SYNC_STATE
    } from '~/utils/constants';
    import { showError } from '~/utils/showError';
    import { fade, navigate } from '~/utils/svelte/ui';
    import {
        detectOCR,
        goToDocumentView,
        importAndScanImage,
        importImageFromCamera,
        onAndroidNewItent,
        onBackButton,
        showImagePopoverMenu,
        showPDFPopoverMenu,
        showPopoverMenu,
        showSettings,
        transformPages
    } from '~/utils/ui';
    import { colors, hasCamera, screenHeightDips, screenWidthDips, windowInset } from '~/variables';

    const orientation = Application.orientation();
    const rowMargin = 8;
    const itemWidth = (orientation === 'landscape' ? screenHeightDips : screenWidthDips) - 2 * rowMargin;
    const itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;

    interface Item {
        doc: OCRDocument;
        selected: boolean;
    }
    let documents: ObservableArray<Item> = null;
    let nbDocuments: number = 0;
    let showNoDocument = false;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    let lottieView: NativeViewElementNode<LottieView>;
    let fabHolder: NativeViewElementNode<StackLayout>;

    let syncEnabled = syncService.enabled;
    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refreshSyncState() {
        try {
            syncEnabled = syncService.enabled;
            const r = await documentsService.documentRepository.search({
                orderBy: CARD_APP ? SqlQuery.createFromTemplateString`id ASC` : SqlQuery.createFromTemplateString`id DESC`
                // , postfix: SqlQuery.createFromTemplateString`LIMIT 50`
            });
            // const r = await OCRDocument.find({
            //     order: {
            //         id: 'DESC'
            //     },
            //     take: 50
            // });
            documents = new ObservableArray(
                r.map((doc) => ({
                    doc,
                    selected: false
                }))
            );
            updateNoDocument();
            // await Promise.all(r.map((d) => d.pages[0]?.imagePath));
        } catch (error) {
            showError(error);
        }
    }

    function updateNoDocument() {
        nbDocuments = documents.length;
        showNoDocument = nbDocuments === 0;
        // console.log('updateNoDocument', showNoDocument);
    }
    function onDocumentAdded(event: DocumentAddedEventData) {
        documents[CARD_APP ? 'push' : 'unshift']({
            doc: event.doc,
            selected: false
        } as Item);
        updateNoDocument();
        collectionView?.nativeElement.scrollToIndex(documents.length - 1, true, SnapPosition.END);
        DEV_LOG && console.log('onDocumentAdded', nbDocuments);
    }
    function onDocumentUpdated(event: DocumentUpdatedEventData) {
        let index = -1;
        documents.some((d, i) => {
            if (d.doc.id === event.doc.id) {
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
    function onDocumentsDeleted(event: DocumentDeletedEventData) {
        for (let index = documents.length - 1; index >= 0; index--) {
            const item = documents.getItem(index);
            if (event.documents.indexOf(item.doc) !== -1) {
                documents.splice(index, 1);
                if (item.selected) {
                    nbSelected -= 1;
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
        const index = documents.findIndex((d) => d.doc.id === document.id);
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
        colorSurfaceContainerHigh,
        colorOnBackground,
        colorOnPrimary,
        colorPrimary,
        colorSurfaceContainerLow,
        colorOnSecondary,
        colorSurfaceContainer,
        colorOnSurfaceVariant,
        colorOutline,
        colorSurface,
        colorPrimaryContainer,
        colorOnPrimaryContainer,
        colorError
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
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
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
        syncService.on(EVENT_SYNC_STATE, onSyncState);
        syncService.on(EVENT_STATE, refreshSyncState);
        // refresh();
    });
    onDestroy(() => {
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
            Application.android.off(Application.android.activityNewIntentEvent, onAndroidNewItent);
        }
        documentsService.on(EVENT_DOCUMENT_PAGE_UPDATED, onDocumentPageUpdated);
        documentsService.off(EVENT_DOCUMENT_PAGE_DELETED, onDocumentPageUpdated);
        documentsService.off(EVENT_DOCUMENT_UPDATED, onDocumentUpdated);
        documentsService.off(EVENT_DOCUMENT_ADDED, onDocumentAdded);
        documentsService.off(EVENT_DOCUMENT_DELETED, onDocumentsDeleted);
        syncService.off(EVENT_SYNC_STATE, onSyncState);
        syncService.off(EVENT_STATE, refreshSyncState);
    });

    const showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);

    async function onStartCam(inverseUseSystemCamera = false) {
        try {
            await importImageFromCamera({ inverseUseSystemCamera });
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument(importPDFs = true) {
        DEV_LOG && console.log('importDocument', importPDFs);
        try {
            await importAndScanImage(null, importPDFs);
        } catch (error) {
            showError(error);
        }
    }
    function onNavigatedTo(e: NavigatedData) {
        if (!e.isBackNavigation) {
            if (documentsService.started) {
                refreshSyncState();
            } else {
                documentsService.once('started', refreshSyncState);
            }
        }
    }
    let nbSelected = 0;
    function selectItem(item: Item) {
        if (!item.selected) {
            documents.some((d, index) => {
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
            documents.some((d, index) => {
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
        if (documents) {
            nbSelected = 0;
            documents.splice(0, documents.length, ...documents.map((i) => ({ doc: i.doc, selected: false })));
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
        const index = documents.findIndex((d) => d.doc.id === item.doc.id);
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
            // console.log('onItemTap', event && event.ios && event.ios.state, selectedSessions.length);
            if (nbSelected > 0) {
                onItemLongPress(item);
            } else {
                await goToDocumentView(item.doc);
            }
        } catch (error) {
            showError(error);
        }
    }, 500);

    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            }
        });

    function getSelectedDocuments() {
        const selected = [];
        documents.forEach((d, index) => {
            if (d.selected) {
                selected.push(d.doc);
            }
        });
        DEV_LOG && console.log('getSelectedDocuments', selected.length);
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
    async function fullscreenSelectedDocuments() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: getSelectedDocuments().reduce((acc, doc) => {
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
                    await documentsService.deleteDocuments(getSelectedDocuments());
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
        const options = new ObservableArray([
            { id: 'share', name: lc('share_images'), icon: 'mdi-share-variant' },
            { id: 'fullscreen', name: lc('show_fullscreen_images'), icon: 'mdi-fullscreen' },
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
                    case 'fullscreen':
                        await fullscreenSelectedDocuments();
                        unselectAll();
                        break;
                    case 'ocr':
                        await detectOCR({ documents: getSelectedDocuments() });
                        unselectAll();
                        break;
                    case 'transform':
                        await transformPages({ documents: getSelectedDocuments() });
                        unselectAll();
                        break;
                    case 'delete':
                        deleteSelectedDocuments();
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

    function getColWidth(viewStyle) {
        switch (viewStyle) {
            case 'columns':
                return screenWidthDips / 2;
            default:
                return screenWidthDips;
        }
    }
    function getRowHeight(viewStyle) {
        switch (viewStyle) {
            case 'full':
            case 'list':
                return itemHeight;
            case 'cardholder':
                return 150;
            case 'columns':
                return (screenWidthDips / 2) * CARD_RATIO;
        }
    }
    function getItemOverlap(viewStyle) {
        switch (viewStyle) {
            case 'full':
                return '-180 0 0 0';
            case 'cardholder':
                return '-30 0 0 0';
            default:
                return '0 0 0 0';
        }
    }
    function itemTemplateSelector(viewStyle, item?) {
        switch (viewStyle) {
            case 'columns':
            case 'list':
                return 'list';
            default:
                return viewStyle;
        }
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
            // .concat([
            //     {
            //         id: 'add_manual',
            //         name: lc('add_manual_card'),
            //         icon: 'mdi-plus'
            //     }
            // ]);
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
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo}>
    <gridlayout rows="auto,*">
        <!-- {/if} -->
        <collectionView
            bind:this={collectionView}
            id="list"
            colWidth={getColWidth(viewStyle)}
            itemOverlap={getItemOverlap(viewStyle)}
            itemTemplateSelector={(item) => itemTemplateSelector(viewStyle, item)}
            items={documents}
            paddingBottom={100}
            row={1}
            rowHeight={getRowHeight(viewStyle)}
            swipeMenuId="swipeMenu"
            on:swipeMenuClose={(e) => handleTouchAction(e.index, { action: 'up' })}>
            <Template key="cardholder" let:item>
                <absolutelayout height="150">
                    <swipemenu
                        id="swipeMenu"
                        height={itemHeight}
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

                    <!-- <canvaslabel col={1} padding="16 0 0 16">
                        <cgroup>
                            <cspan color={colorOnBackground} fontSize={16} fontWeight="bold" lineBreak="end" lineHeight={18} text={item.doc.name} />
                            <cspan color={colorOnSurfaceVariant} fontSize={14} lineHeight={26} text={'\n' + dayjs(item.doc.createdDate).format('L LT')} />
                        </cgroup>

                        <cspan color={colorOnSurfaceVariant} fontSize={14} paddingBottom={0} text={getSize(item)} verticalAlignment="bottom" />
                    </canvaslabel> -->
                    <!-- <PageIndicator horizontalAlignment="right" text={item.doc.pages.length} /> -->
                </swipemenu>
            </Template>
            <Template key="list" let:item>
                <swipemenu
                    id="swipeMenu"
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

                    <!-- <canvaslabel col={1} padding="16 0 0 16">
                        <cgroup>
                            <cspan color={colorOnBackground} fontSize={16} fontWeight="bold" lineBreak="end" lineHeight={18} text={item.doc.name} />
                            <cspan color={colorOnSurfaceVariant} fontSize={14} lineHeight={26} text={'\n' + dayjs(item.doc.createdDate).format('L LT')} />
                        </cgroup>

                        <cspan color={colorOnSurfaceVariant} fontSize={14} paddingBottom={0} text={getSize(item)} verticalAlignment="bottom" />
                    </canvaslabel> -->
                    <!-- <PageIndicator horizontalAlignment="right" text={item.doc.pages.length} /> -->
                </swipemenu>
            </Template>
        </collectionView>
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
                        'scanner|**': lottieLightColor,
                        'lines|**': lottieDarkFColor
                    }}
                    loop={true}
                    src="~/assets/lottie/scanning.lottie" />
                <label color={colorOnSurfaceVariant} flexShrink={0} fontSize={19} text={lc('no_card_yet')} textAlignment="center" textWrap={true} />
            </flexlayout>
        {/if}
        {#if showActionButton}
            <!-- <stacklayout
                bind:this={fabHolder}
                horizontalAlignment="right"
                iosIgnoreSafeArea={true}
                orientation="horizontal"
                row={1}
                verticalAlignment="bottom"
                android:marginBottom={$windowInset.bottom}> -->
            <!-- {#if __IOS__}
                    <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-image-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(false), 500)} />
                {/if}
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-file-document-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(), 500)} /> -->
            <mdbutton
                bind:this={fabHolder}
                id="fab"
                class="fab"
                horizontalAlignment="right"
                iosIgnoreSafeArea={true}
                margin={`16 16 ${$windowInset.bottom + 16} 16`}
                row={1}
                text="mdi-plus"
                verticalAlignment="bottom"
                on:tap={throttle(() => onAddButton(), 500)} />
            <!-- </stacklayout> -->
        {/if}

        <CActionBar title={l('cards')}>
            <mdbutton
                class="actionBarButton"
                class:infinite-rotate={syncRunning}
                isEnabled={!syncRunning}
                text="mdi-autorenew"
                variant="text"
                visibility={syncEnabled ? 'visible' : 'collapse'}
                on:tap={syncDocuments} />

            <mdbutton class="actionBarButton" text="mdi-view-dashboard" variant="text" on:tap={selectViewStyle} />
            <mdbutton class="actionBarButton" text="mdi-cogs" variant="text" on:tap={() => showSettings()} />
        </CActionBar>
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} titleProps={{ maxLines: 1, autoFontSize: true }}>
                <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
                <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
