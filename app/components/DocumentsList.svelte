<script context="module" lang="ts">
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { AnimationDefinition, Application, ApplicationSettings, Color, EventData, NavigatedData, ObservableArray, Page, StackLayout, Utils } from '@nativescript/core';
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
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { DocumentAddedEventData, DocumentDeletedEventData, DocumentUpdatedEventData, documentsService } from '~/services/documents';
    import { syncService } from '~/services/sync';
    import { EVENT_DOCUMENT_ADDED, EVENT_DOCUMENT_DELETED, EVENT_DOCUMENT_PAGE_DELETED, EVENT_DOCUMENT_PAGE_UPDATED, EVENT_DOCUMENT_UPDATED, EVENT_STATE, EVENT_SYNC_STATE } from '~/utils/constants';
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
    import { colors, fontScale, hasCamera, windowInset } from '~/variables';

    const textPaint = new Paint();
    const IMAGE_DECODE_WIDTH = Utils.layout.toDevicePixels(200);
</script>

<script lang="ts">
    import ActionBarSearch from './widgets/ActionBarSearch.svelte';

    // technique for only specific properties to get updated on store change
    let { colorBackground, colorPrimaryContainer, colorOnBackground } = $colors;
    $: ({ colorBackground, colorSurfaceContainerHigh, colorOnBackground, colorOnSurfaceVariant, colorSurface, colorPrimaryContainer, colorError } = $colors);

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
    let search: ActionBarSearch;

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
        loading = true;
        try {
            DEV_LOG && console.log('DocumentsList', 'refresh', filter);
            let r: OCRDocument[];
            if (filter?.length) {
                r = await documentsService.documentRepository.search({
                    select: SqlQuery.createFromTemplateString`DISTINCT d.*`,
                    postfix: SqlQuery.createFromTemplateString` d \nJOIN Page p ON p.document_id = d.id`,
                    orderBy: SqlQuery.createFromTemplateString`id DESC`,
                    where: new SqlQuery([
                        `p.name LIKE '%${filter}%'
   OR d.name LIKE '%${filter}%' OR p.ocrData LIKE '%${filter}%'`
                    ])
                });
            } else {
                r = await documentsService.documentRepository.search({
                    orderBy: SqlQuery.createFromTemplateString`id DESC`
                });
            }
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
        DEV_LOG && console.log('onDocumentAdded', nbDocuments);
        documents?.unshift({
            doc: event.doc,
            selected: false
        } as Item);
        updateNoDocument();
        collectionView?.nativeElement.scrollToIndex(0, false);
    }
    function onDocumentUpdated(event: DocumentUpdatedEventData) {
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
        const index = documents.findIndex((d) => d.doc.id === document.id);
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
                target: fabHolder.nativeView,
                translate: { x: 0, y: snackAnimation.translate.y === 0 ? -70 : 0 },
                duration: snackAnimation.duration
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
        syncService.off(EVENT_SYNC_STATE, onSyncState);
        syncService.off(EVENT_STATE, refreshSimple);
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
            } else {
                await goToDocumentView(item.doc);
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
            if (syncEnabled) {
                await syncService.syncDocuments({ force: true, bothWays: true });
            }
        } catch (error) {
            showError(error);
        }
    }
    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);

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

    function onCanvasDraw(item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const dx = 10 + getItemImageHeight(viewStyle) + 16;
        textPaint.color = colorOnSurfaceVariant;
        canvas.drawText(
            filesize(
                item.doc.pages.reduce((acc, v) => acc + v.size, 0),
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
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo} on:navigatingFrom={() => search.unfocusSearch()}>
    <gridlayout paddingLeft={$windowInset.left} paddingRight={$windowInset.right} rows="auto,*">
        <!-- {/if} -->
        <collectionView bind:this={collectionView} iosOverflowSafeArea={true} items={documents} paddingBottom={100} row={1} rowHeight={getItemRowHeight(viewStyle) * $fontScale}>
            <Template let:item>
                <canvasview
                    backgroundColor={colorSurfaceContainerHigh}
                    borderRadius={12}
                    fontSize={14 * $fontScale}
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
                        'scanner|**': lottieLightColor,
                        'lines|**': lottieDarkFColor
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
            <stacklayout bind:this={fabHolder} horizontalAlignment="right" marginBottom={$windowInset.bottom + 16} orientation="horizontal" row={1} verticalAlignment="bottom">
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

        <CActionBar title={l('documents')}>
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
            <mdbutton class="actionBarButton" accessibilityValue="settingsBtn" text="mdi-cogs" variant="text" on:tap={() => showSettings()} />
            <ActionBarSearch bind:this={search} slot="center" {refresh} bind:visible={showSearch} />
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
