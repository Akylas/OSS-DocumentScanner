<script lang="ts">
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { Application, ApplicationSettings, Color, EventData, NavigatedData, ObservableArray, Page, PageTransition, Screen, SharedTransition, Utils, View } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import dayjs from 'dayjs';
    import { onDestroy, onMount } from 'svelte';
    import { navigate, showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import ActionSheet from '~/components/ActionSheet.svelte';
    import CActionBar from '~/components/CActionBar.svelte';
    import Camera from '~/components/Camera.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import SelectedIndicator from '~/components/SelectedIndicator.svelte';
    import SyncIndicator from '~/components/SyncIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { importAndScanImage, showPopoverMenu, timeout } from '~/utils/ui';
    import { colors, screenHeightDips, screenWidthDips } from '~/variables';
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { syncService } from '~/services/sync';
    import { Img } from '@nativescript-community/ui-image';
    import { CollectionView, SnapPosition } from '@nativescript-community/ui-collectionview';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { closePopover, showPopover } from '@nativescript-community/ui-popover/svelte';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { fade } from '~/utils/svelte/ui';
    import PageIndicator from './PageIndicator.svelte';
    import { filesize } from 'filesize';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { log } from 'console';
    import { request } from '@nativescript-community/perms';

    const orientation = Application.orientation();
    const rowMargin = 8;
    const itemWidth = (orientation === 'landscape' ? screenHeightDips : screenWidthDips) - 2 * rowMargin;
    const itemHeight = itemWidth * 0.584 + 2 * rowMargin;

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

    let syncEnabled = syncService.enabled;
    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refresh() {
        try {
            syncEnabled = syncService.enabled;
            DEV_LOG && console.log('syncEnabled', syncEnabled);
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
            console.error(error);
        }
    }

    function updateNoDocument() {
        nbDocuments = documents.length;
        showNoDocument = nbDocuments === 0;
        // console.log('updateNoDocument', showNoDocument);
    }
    function onDocumentAdded(event: EventData & { doc }) {
        documents[CARD_APP ? 'push' : 'unshift']({
            doc: event.doc,
            selected: false
        } as Item);
        updateNoDocument();
        collectionView?.nativeElement.scrollToIndex(documents.length - 1, true, SnapPosition.END);
        DEV_LOG && console.log('onDocumentAdded', nbDocuments);
    }
    function onDocumentUpdated(event: EventData & { doc }) {
        let index = -1;
        documents.some((d, i) => {
            if (d.doc.id === event.doc.id) {
                index = i;
                return true;
            }
        });
        DEV_LOG && console.log('onDocumentUpdated', event.doc, index);
        if (index >= 0) {
            documents.setItem(index, documents.getItem(index));
        }
    }
    function onDocumentsDeleted(event: EventData & { documents: OCRDocument[] }) {
        for (let index = documents.length - 1; index >= 0; index--) {
            if (event.documents.indexOf(documents.getItem(index).doc) !== -1) {
                documents.splice(index, 1);
                nbSelected -= 1;
            }
        }
        updateNoDocument();
    }
    function getImageView(index: number) {
        return collectionView?.nativeView?.getViewForItemAtIndex(index)?.getViewById<Img>('imageView');
    }

    function onDocumentPageUpdated(event: EventData & { pageIndex: number; imageUpdated: boolean }) {
        let index = -1;
        DEV_LOG && console.log('onDocumentPageUpdated', event.pageIndex, event.imageUpdated);
        if (event.pageIndex === 0) {
            documents.some((d, i) => {
                if (d.doc === (event.object as any)) {
                    index = i;
                    return true;
                }
            });
            if (index >= 0) {
                documents.setItem(index, documents.getItem(index));
                if (!!event.imageUpdated) {
                    getImageView(index)?.updateImageUri();
                }
            }
        }
    }
    let syncRunning = false;
    function onSyncState(event: EventData & { state: 'running' | 'finished' }) {
        syncRunning = event.state === 'running';
        DEV_LOG && console.log('syncState', event.state, syncRunning);
    }
    // technique for only specific properties to get updated on store change
    let colorPrimaryContainer = $colors.colorPrimaryContainer;
    $: ({
        colorBackground,
        colorSurfaceContainerHigh,
        colorOnBackground,
        colorSurfaceContainerLow,
        colorOnSecondary,
        colorSurfaceContainer,
        colorOnSurfaceVariant,
        colorOutline,
        colorSurface,
        colorPrimaryContainer,
        colorOnPrimaryContainer
    } = $colors);

    onMount(() => {
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        documentsService.on('documentPageDeleted', onDocumentPageUpdated);
        documentsService.on('documentAdded', onDocumentAdded);
        documentsService.on('documentUpdated', onDocumentUpdated);
        documentsService.on('documentsDeleted', onDocumentsDeleted);
        syncService.on('syncState', onSyncState);
        syncService.on('state', refresh);
        // refresh();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageDeleted', onDocumentPageUpdated);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        documentsService.off('documentUpdated', onDocumentUpdated);
        documentsService.off('documentAdded', onDocumentAdded);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
        syncService.off('syncState', onSyncState);
    });

    const showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);

    async function goToView(doc: OCRDocument) {
        const page = (await import('~/components/CardView.svelte')).default;
        return navigate({
            page,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, null, 10)) : undefined,
            props: {
                document: doc
            }
        });
    }

    async function onStartCam() {
        try {
            const result = await request('camera');
            const document: OCRDocument = await showModal({
                page: Camera,
                fullscreen: true
            });
            if (document) {
                await goToView(document);
            }
            // const documentScanner = new DocumentScanner({
            //     showColorFilters: false,
            //     maxNumSimultaneousDocuments: 1
            // });

            // const result = await documentScanner.startScan();
            // if (result?.length) {
            //     const document = await OCRDocument.createDocument(
            //         dayjs().format('L LT'),
            //         __ANDROID__ ? result.map((s) => ({ ...s, colorType: 1, imagePath: s.imagePath.replace('file://', '') })) : result.map((s) => ({ ...s, colorType: 1 }))
            //     );
            //     document.save();
            //     documentsService.notify({ eventName: 'documentAdded', object: this, doc: document });
            //     // const images = data.nativeDatas.images.map((image, i) => ({ image, mat: data.nativeDatas.mats[i] }));
            //     const PDFView = (await import('~/components/DocumentView.svelte')).default;
            //     navigate({
            //         page: PDFView,
            //         transition: SharedTransition.custom(new PageTransition(300)),
            //         props: {
            //             document: document
            //         }
            //     });
            // }
        } catch (error) {
            showError(error);
        }
        // showModal({
        //     page: Camera,
        //     fullscreen: true
        // });
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage();
            if (!doc) {
                return;
            }
            const component = (await import('~/components/DocumentEdit.svelte')).default;
            navigate({
                page: component,
                props: {
                    document: doc
                }
            });
        } catch (error) {
            showError(error);
        }
    }
    function onNavigatedTo(e: NavigatedData) {
        if (!e.isBackNavigation) {
            if (documentsService.started) {
                refresh();
            } else {
                documentsService.once('started', refresh);
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
        nbSelected = 0;
        documents.splice(0, documents.length, ...documents.map((i) => ({ doc: i.doc, selected: false })));
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
                    image: page.getImagePath(),
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
    async function onItemTap(item: Item) {
        try {
            if (ignoreTap) {
                ignoreTap = false;
                return;
            }
            // console.log('onItemTap', event && event.ios && event.ios.state, selectedSessions.length);
            if (nbSelected > 0) {
                onItemLongPress(item);
            } else {
                await goToView(item.doc);
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
                    const selected = [];
                    documents.forEach((d, index) => {
                        if (d.selected) {
                            selected.push(d.doc);
                        }
                    });
                    await documentsService.deleteDocuments(selected);
                }
            } catch (error) {
                showError(error);
            }
        }
    }
    async function showOptions(event) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = [
                {
                    icon: 'mdi-view-dashboard',
                    id: 'layout',
                    name: l('change_layout')
                },
                {
                    icon: 'mdi-cogs',
                    id: 'preferences',
                    name: l('preferences')
                }
            ];
            const result = await showPopoverMenu<{ icon: string; id: string; text: string }>({
                options,
                vertPos: VerticalPosition.BELOW,
                horizPos: HorizontalPosition.ALIGN_RIGHT,
                anchor: event.object,
                // onClose: (item) => {
                //     updateOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
                // }
                props: {
                    rowHeight: 48,
                    fontWeight: 'normal',
                    containerColumns: 'auto'
                }
            });
            // const result: { icon: string; id: string; text: string } = await showPopover({
            //     backgroundColor: colorSurfaceContainer,
            //     view: OptionSelect,
            //     anchor: event.object,
            //     vertPos: VerticalPosition.BELOW,
            //     transparent: true,
            //     hideArrow: true,
            //     horizPos: HorizontalPosition.ALIGN_RIGHT,
            //     props: {
            //         borderRadius: 10,
            //         elevation: 4,
            //         margin: 4,
            //         backgroundColor: colorSurfaceContainer,
            //         width: 200,
            //         rowHeight: 48,
            //         height: options.length * 48 + 16,
            //         fontWeight: 'normal',
            //         containerColumns: 'auto',
            //         onClose: closePopover,
            //         options
            //     }
            // });
            if (result) {
                switch (result.id) {
                    case 'layout':
                        await collectionView?.nativeElement.closeCurrentMenu();
                        if (viewStyle === 'default') {
                            viewStyle = 'fullcard';
                        } else {
                            viewStyle = 'default';
                        }
                        ApplicationSettings.setString('cardViewStyle', viewStyle);
                        collectionView?.nativeView.refresh();
                        break;
                    case 'about':
                        const About = (await import('~/components/About.svelte')).default;
                        showModal({ page: About, animated: true, fullscreen: true });
                        // navigate({ page: About });
                        break;

                    case 'preferences':
                        const Settings = (await import('~/components/Settings.svelte')).default;
                        navigate({ page: Settings });
                        break;
                }
            }
        } catch (error) {
            showError(error);
        }
    }
    async function showSettings() {
        try {
            const Settings = (await import('~/components/Settings.svelte')).default;
            navigate({ page: Settings });
        } catch (error) {
            showError(error);
        }
    }
    async function syncDocuments() {
        try {
            if (!syncEnabled) {
                return showSyncSettings();
            }
            await syncService.syncDocuments(true);
        } catch (error) {
            showError(error);
        }
    }
    async function showSyncSettings() {
        try {
            const WebdavConfig = (await import('~/components/WebdavConfig.svelte')).default;
            await showBottomSheet({
                parent: this,
                skipCollapsedState: true,
                view: WebdavConfig,
                ignoreTopSafeArea: true
            });
        } catch (error) {
            showError(error);
        }
    }

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
    function getSize(item: Item) {
        return filesize(item.doc.pages.reduce((acc, v) => acc + v.size, 0));
    }
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
    let viewStyle: string = ApplicationSettings.getString('cardViewStyle', 'default');

    function fullCardDrawerTranslationFunction(side, width, value, delta, progress) {
        const result = {
            mainContent: {
                translateX: side === 'right' ? -delta : delta
            },
            rightDrawer: {
                translateX: width + (side === 'right' ? -delta : delta)
            },
            leftDrawer: {
                translateX: (side === 'right' ? -delta : delta) - width
            },
            backDrop: {
                translateX: side === 'right' ? -delta : delta,
                opacity: progress * 0.01
            }
        };

        return result;
    }
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo}>
    <gridlayout rows="auto,*">
        <!-- {/if} -->
        <collectionView
            bind:this={collectionView}
            itemOverlap={viewStyle === 'fullcard' ? '-180 0 0 0' : '-30 0 0 0'}
            itemTemplateSelector={() => viewStyle}
            items={documents}
            row={1}
            rowHeight={viewStyle === 'fullcard' ? itemHeight : 150}
            swipeMenuId="swipeMenu"
            on:swipeMenuClose={(e) => handleTouchAction(e.index, { action: 'up' })}>
            <Template let:item>
                <!-- TODO: make this a canvas -->
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
                                decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                                decodeWidth={Utils.layout.toDevicePixels(itemWidth) * 0.584}
                                fadeDuration={100}
                                item={item.doc.pages[0]}
                                sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                                stretch="aspectFill" />
                            <gridlayout style="z-index:10;" margin="10 20 0 0">
                                <SelectedIndicator selected={item.selected} />
                                <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                            </gridlayout>
                        </gridlayout>
                        <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />
                    </swipemenu>
                    <absolutelayout boxShadow="0 -1 8 rgba(0, 0, 0, 0.8)" height={3} top={150} width="100%" />
                </absolutelayout>
            </Template>
            <Template key="fullcard" let:item>
                <!-- TODO: make this a canvas -->
                <swipemenu
                    id="swipeMenu"
                    openAnimationDuration={100}
                    rightSwipeDistance={0}
                    startingSide={item.startingSide}
                    translationFunction={fullCardDrawerTranslationFunction}
                    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
                    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
                    <gridlayout
                        prop:mainContent
                        backgroundColor={item.doc.pages[0].colors?.[0]}
                        borderRadius={12}
                        dynamicElevationOffset={3}
                        elevation={6}
                        margin="16 16 16 16"
                        on:tap={() => onItemTap(item)}
                        on:longPress={(e) => onItemLongPress(item, e)}>
                        <RotableImageView
                            id="imageView"
                            borderRadius={12}
                            decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                            decodeWidth={Utils.layout.toDevicePixels(itemWidth) * 0.584}
                            fadeDuration={100}
                            item={item.doc.pages[0]}
                            sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                            stretch="aspectFill" />
                        <gridlayout style="z-index:10;" margin="10 20 0 0">
                            <SelectedIndicator selected={item.selected} />
                            <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                        </gridlayout>
                    </gridlayout>

                    <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />

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
            <gridlayout marginBottom={150} paddingLeft={16} paddingRight={16} row={1} rows="auto,auto" verticalAlignment="center" transition:fade={{ duration: 200 }}>
                <lottie
                    bind:this={lottieView}
                    autoPlay={true}
                    keyPathColors={{
                        'background|**': lottieDarkFColor,
                        'full|**': lottieLightColor,
                        'scanner|**': lottieLightColor,
                        'lines|**': lottieDarkFColor
                    }}
                    loop={true}
                    marginBottom={20}
                    src="~/assets/lottie/scanning.lottie"
                    width="80%" />
                <label color={colorOnSurfaceVariant} fontSize={19} text={lc('no_document_yet')} textAlignment="center" textWrap={true} verticalAlignment="bottom" width="80%" />
            </gridlayout>
        {/if}
        {#if showActionButton}
            <stacklayout horizontalAlignment="right" iosIgnoreSafeArea={true} row={1} verticalAlignment="bottom">
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-image-plus" on:tap={importDocument} />
                <mdbutton id="fab" class="fab" margin="8 16 16 16" text="mdi-camera" on:tap={onStartCam} />
            </stacklayout>
        {/if}

        <CActionBar title={l('cards')}>
            <mdbutton
                class="actionBarButton"
                defaultVisualState={syncEnabled ? 'normal' : 'disabled'}
                isEnabled={!syncRunning}
                text="mdi-sync"
                variant="text"
                on:tap={syncDocuments}
                on:longPress={showSyncSettings} />
            <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
        </CActionBar>
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)}>
                <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteSelectedDocuments} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
