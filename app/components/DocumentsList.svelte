<script context="module" lang="ts">
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { request } from '@nativescript-community/perms';
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { CollectionView, SnapPosition } from '@nativescript-community/ui-collectionview';
    import { Img } from '@nativescript-community/ui-image';
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import {
        AnimationDefinition,
        Application,
        ApplicationSettings,
        Color,
        EventData,
        NavigatedData,
        ObservableArray,
        Page,
        PageTransition,
        SharedTransition,
        StackLayout,
        Utils
    } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData, AndroidActivityNewIntentEventData } from '@nativescript/core/application/application-interfaces';
    import dayjs from 'dayjs';
    import { filesize } from 'filesize';
    import { onDestroy, onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import Camera from '~/components/camera/Camera.svelte';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import PageIndicator from '~/components/common/PageIndicator.svelte';
    import RotableImageView from '~/components/common/RotableImageView.svelte';
    import SelectedIndicator from '~/components/common/SelectedIndicator.svelte';
    import SyncIndicator from '~/components/common/SyncIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { syncService } from '~/services/sync';
    import { PermissionError, showError } from '~/utils/error';
    import { fade, navigate, showModal } from '~/utils/svelte/ui';
    import { detectOCR, importAndScanImage, importAndScanImageFromUris, onBackButton, showImagePopoverMenu, showPDFPopoverMenu, showPopoverMenu, showSettings, transformPages } from '~/utils/ui';
    import { colors, fontScale, navigationBarHeight } from '~/variables';

    const textPaint = new Paint();
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    let { colorPrimaryContainer, colorOnBackground } = $colors;
    $: ({
        colorSurfaceContainerHigh,
        colorOnBackground,
        colorSurfaceContainerLow,
        colorOnSecondary,
        colorSurfaceContainer,
        colorOnSurfaceVariant,
        colorOutline,
        colorOutlineVariant,
        colorSurface,
        colorPrimaryContainer,
        colorOnPrimaryContainer,
        colorError
    } = $colors);

    interface Item {
        doc: OCRDocument;
        selected: boolean;
    }
    let documents: ObservableArray<Item> = null;
    let nbDocuments: number = 0;
    let showNoDocument = false;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let lottieView: NativeViewElementNode<LottieView>;
    let fabHolder: NativeViewElementNode<StackLayout>;

    let viewStyle: string = ApplicationSettings.getString('documents_list_view_style', 'expanded');
    $: condensed = viewStyle === 'condensed';
    let syncEnabled = syncService.enabled;
    let syncRunning = false;
    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refresh() {
        try {
            syncEnabled = syncService.enabled;
            DEV_LOG && console.log('syncEnabled', syncEnabled);
            const r = await documentsService.documentRepository.search({
                orderBy: SqlQuery.createFromTemplateString`id DESC`
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
            console.error(error, error.stack);
        }
    }

    function updateNoDocument() {
        nbDocuments = documents.length;
        showNoDocument = nbDocuments === 0;
    }
    function onDocumentAdded(event: EventData & { doc }) {
        documents?.unshift({
            doc: event.doc,
            selected: false
        } as Item);
        updateNoDocument();
        collectionView?.nativeElement.scrollToIndex(0, false);
        DEV_LOG && console.log('onDocumentAdded', nbDocuments);
    }
    function onDocumentUpdated(event: EventData & { doc: OCRDocument }) {
        let index = -1;
        documents?.some((d, i) => {
            if (d.doc.id === event.doc.id) {
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
        // let index = -1;
        const document = event.object as OCRDocument;
        if (event.pageIndex === 0) {
            const index = documents.findIndex((d) => d.doc === document);
            // documents.some((d, i) => {
            //     if (d.doc === (event.object as any)) {
            //         index = i;
            //         return true;
            //     }
            // });
            if (index >= 0) {
                documents.setItem(index, documents.getItem(index));
                if (!!event.imageUpdated) {
                    getImageView(index)?.updateImageUri();
                }
            }
        }
    }
    function onSyncState(event: EventData & { state: 'running' | 'finished' }) {
        syncRunning = event.state === 'running';
        DEV_LOG && console.log('syncState', event.state, syncRunning);
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
        DEV_LOG && console.log('DocumentList', 'onMount');
        Application.on('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            const intent = Application.android['startIntent'];
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
            Application.android.on(Application.android.activityNewIntentEvent, onAndroidNewItent);
            if (intent) {
                onAndroidNewItent({ intent } as any);
            }
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
        DEV_LOG && console.log('DocumentList', 'onDestroy');
        Application.off('snackMessageAnimation', onSnackMessageAnimation);
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
            Application.android.off(Application.android.activityNewIntentEvent, onAndroidNewItent);
        }
        documentsService.on('documentPageDeleted', onDocumentPageUpdated);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        documentsService.off('documentUpdated', onDocumentUpdated);
        documentsService.off('documentAdded', onDocumentAdded);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
        syncService.off('syncState', onSyncState);
        syncService.off('state', refresh);
    });

    const showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);
    async function goToView(doc: OCRDocument) {
        const page = (await import('~/components/view/DocumentView.svelte')).default;
        return navigate({
            page,
            transition: __ANDROID__ && !CARD_APP ? SharedTransition.custom(new PageTransition(300, null, 10)) : undefined,
            props: {
                document: doc
            }
        });
    }
    async function onStartCam() {
        try {
            const result = await request('camera');
            if (result[0] !== 'authorized') {
                throw new PermissionError(lc('camera_permission_needed'));
            }
            const document: OCRDocument = await showModal({
                page: Camera,
                fullscreen: true
            });
            if (document) {
                if (document.pages.length === 1) {
                    const component = (await import('~/components/edit/DocumentEdit.svelte')).default;
                    navigate({
                        page: component,
                        props: {
                            document,
                            transitionOnBack: false
                        }
                    });
                } else {
                    await goToView(document);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage();
            if (!doc) {
                return;
            }
            const component =
                doc.pages.length > 1
                    ? (await import(CARD_APP ? '~/components/view/CardView.svelte' : '~/components/view/DocumentView.svelte')).default
                    : (await import('~/components/edit/DocumentEdit.svelte')).default;
            navigate({
                page: component,
                props: {
                    document: doc,
                    transitionOnBack: false
                }
            });
        } catch (error) {
            showError(error);
        }
    }
    async function onNavigatedTo(e: NavigatedData) {
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
    const onAndroidBackButton = (data: AndroidActivityBackPressedEventData) =>
        onBackButton(page?.nativeView, () => {
            if (nbSelected > 0) {
                data.cancel = true;
                unselectAll();
            }
        });
    async function onAndroidNewItent(event: AndroidActivityNewIntentEventData) {
        if (__ANDROID__) {
            try {
                const uris = [];
                const intent = event.intent as android.content.Intent;
                switch (intent.getAction()) {
                    case 'android.intent.action.SEND':
                        const imageUri = intent.getParcelableExtra('android.intent.extra.STREAM') as android.net.Uri;
                        if (imageUri) {
                            uris.push(imageUri.toString());
                        }
                        break;
                    case 'android.intent.action.SEND_MULTIPLE':
                        const imageUris = intent.getParcelableArrayListExtra('android.intent.extra.STREAM') as java.util.ArrayList<android.net.Uri>;
                        if (imageUris) {
                            for (let index = 0; index < imageUris.size(); index++) {
                                uris.push(imageUris.get(index).toString());
                            }
                        }
                }
                if (uris.length) {
                    const doc = await importAndScanImageFromUris(uris);
                    if (!doc) {
                        return;
                    }
                    const component =
                        doc.pages.length > 1
                            ? (await import(CARD_APP ? '~/components/view/CardView.svelte' : '~/components/view/DocumentView.svelte')).default
                            : (await import('~/components/edit/DocumentEdit.svelte')).default;
                    navigate({
                        page: component,
                        props: {
                            document: doc
                        }
                    });
                }
            } catch (error) {
                showError(error);
            }
        }
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
                    return acc;
                }, []),
                startPageIndex: 0
            }
        });
    }

    function getSelectedDocuments() {
        const selected = [];
        documents.forEach((d, index) => {
            if (d.selected) {
                selected.push(d.doc);
            }
        });
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
    async function selectViewStyle(event) {
        try {
            // const options = Object.keys(OPTIONS[option]).map((k) => ({ ...OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                options: [
                    { id: 'default', name: lc('expanded') },
                    { id: 'condensed', name: lc('condensed') }
                ],
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                onClose: (item) => {
                    viewStyle = item.id;
                    ApplicationSettings.setString('documents_list_view_style', viewStyle);
                }
            });
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
            const WebdavConfig = (await import('~/components/webdav/WebdavConfig.svelte')).default;
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
    function getItemImageHeight(viewStyle) {
        return (condensed ? 44 : 94) * $fontScale;
    }
    function getItemRowHeight(viewStyle) {
        return condensed ? 80 : 150;
    }
    function getImageMargin(viewStyle) {
        switch (viewStyle) {
            case 'condensed':
                return 0;

            default:
                return 10;
        }
    }

    $: textPaint.color = colorOnBackground || 'black';
    $: textPaint.textSize = (condensed ? 11 : 14) * $fontScale;

    function onCanvasDraw(item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        // const w2 = w / 2;
        // const h2 = h / 2;
        const dx = 10 + getItemImageHeight(viewStyle) + 16;
        textPaint.color = colorOnSurfaceVariant;
        canvas.drawText(filesize(item.doc.pages.reduce((acc, v) => acc + v.size, 0)), dx, h - (condensed ? 0 : 16) - 10, textPaint);
        textPaint.color = colorOnBackground;
        const topText = createNativeAttributedString({
            spans: [
                {
                    fontSize: 16 * $fontScale,
                    fontWeight: 'bold',
                    lineBreak: 'end',
                    lineHeight: 18 * $fontScale,
                    text: item.doc.name
                },
                {
                    fontSize: 14 * $fontScale,
                    color: colorOnSurfaceVariant,
                    lineHeight: (condensed ? 14 : 20) * $fontScale,
                    text: '\n' + dayjs(item.doc.createdDate).format('L LT')
                }
            ]
        });
        const staticLayout = new StaticLayout(topText, textPaint, w - dx, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
        canvas.translate(dx, (condensed ? 0 : 10) + 10);
        staticLayout.draw(canvas);
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
                        detectOCR({ documents: getSelectedDocuments() });
                        unselectAll();
                        break;
                    case 'transform':
                        transformPages({ documents: getSelectedDocuments() });
                        unselectAll();
                        break;
                    case 'delete':
                        deleteSelectedDocuments();
                        break;
                }
            }
        });
    }
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo}>
    <gridlayout rows="auto,*">
        <!-- {/if} -->
        <collectionView bind:this={collectionView} items={documents} paddingBottom={88} row={1} rowHeight={getItemRowHeight(viewStyle) * $fontScale}>
            <Template let:item>
                <canvasview
                    backgroundColor={colorSurfaceContainerHigh}
                    borderRadius={12}
                    fontSize={14 * $fontScale}
                    margin={8}
                    padding={10}
                    rippleColor={colorSurface}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    on:draw={(e) => onCanvasDraw(item, e)}>
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        decodeWidth={Utils.layout.toDevicePixels(100)}
                        horizontalAlignment="left"
                        item={item.doc.pages[0]}
                        marginBottom={getImageMargin(viewStyle)}
                        marginTop={getImageMargin(viewStyle)}
                        sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                        stretch="aspectFill"
                        width={getItemImageHeight(viewStyle)} />
                    <SelectedIndicator horizontalAlignment="left" margin={2} selected={item.selected} />
                    <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                    <PageIndicator horizontalAlignment="right" text={item.doc.pages.length} />
                </canvasview>
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
                <label color={colorOnSurfaceVariant} flexShrink={0} fontSize={19} text={lc('no_document_yet')} textAlignment="center" textWrap={true} />
            </flexlayout>
        {/if}
        {#if showActionButton}
            <stacklayout bind:this={fabHolder} horizontalAlignment="right" iosIgnoreSafeArea={true} row={1} verticalAlignment="bottom" android:marginBottom={$navigationBarHeight}>
                <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-image-plus" on:tap={importDocument} />
                <mdbutton id="fab" class="fab" margin="8 16 16 16" text="mdi-camera" on:tap={onStartCam} />
            </stacklayout>
        {/if}

        <CActionBar title={l('documents')}>
            <mdbutton
                class="actionBarButton"
                isEnabled={!syncRunning}
                text="mdi-sync"
                variant="text"
                visibility={syncEnabled ? 'visible' : 'collapse'}
                on:tap={syncDocuments}
                on:longPress={showSyncSettings} />
            <mdbutton class="actionBarButton" text="mdi-view-dashboard" variant="text" on:tap={selectViewStyle} />
            <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-cogs" variant="text" on:tap={showSettings} />
        </CActionBar>
        <!-- {#if nbSelected > 0} -->
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} titleProps={{ maxLines: 1, autoFontSize: true }}>
                <!-- <mdbutton class="actionBarButton" text="mdi-share-variant" variant="text" visibility={nbSelected ? 'visible' : 'collapse'} on:tap={showImageExportPopover} /> -->
                <mdbutton class="actionBarButton" text="mdi-file-pdf-box" variant="text" on:tap={showPDFPopover} />
                <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
