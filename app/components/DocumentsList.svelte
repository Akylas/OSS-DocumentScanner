<script lang="ts">
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { LottieView } from '@nativescript-community/ui-lottie';
    import { Application, ApplicationSettings, Color, EventData, NavigatedData, ObservableArray, Page, PageTransition, Screen, SharedTransition, Utils } from '@nativescript/core';
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
    import { importAndScanImage, timeout } from '~/utils/ui';
    import { colors, screenWidthDips, systemFontScale } from '~/variables';
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { syncService } from '~/services/sync';
    import { Img } from '@nativescript-community/ui-image';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { closePopover, showPopover } from '@nativescript-community/ui-popover/svelte';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { fade } from '~/utils/svelte/ui';
    import PageIndicator from './PageIndicator.svelte';
    import { filesize } from 'filesize';
    import { getRealTheme, onThemeChanged } from '~/helpers/theme';
    import { log } from 'console';
    import { request } from '@nativescript-community/perms';

    const rowMargin = 8;
    const itemHeight = screenWidthDips / 2 - rowMargin * 2 + 100;

    const lottieAlpha = __IOS__ ? 100 : 255;

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

    let syncEnabled = syncService.enabled;
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
            console.error(error);
        }
    }

    function updateNoDocument() {
        nbDocuments = documents.length;
        showNoDocument = nbDocuments === 0;
    }
    function onDocumentAdded(event: EventData & { doc }) {
        documents.unshift({
            doc: event.doc,
            selected: false
        } as Item);
        updateNoDocument();
        DEV_LOG && console.log('onDocumentAdded', nbDocuments);
    }
    function onDocumentUpdated(event: EventData & { doc: OCRDocument }) {
        let index = -1;
        documents.some((d, i) => {
            if (d.doc.id === event.doc.id) {
                index = i;
                return true;
            }
        });
        DEV_LOG && console.log('onDocumentUpdated', event.doc._synced, event.doc, index, event.doc.pages.length);
        if (index >= 0) {
            const item = documents.getItem(index);
            item.doc = event.doc;
            documents.setItem(index, item);
        }
    }
    function onDocumentsDeleted(event: EventData & { docs: OCRDocument[] }) {
        for (let index = documents.length - 1; index >= 0; index--) {
            if (event.docs.indexOf(documents.getItem(index).doc) !== -1) {
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
        const page = (await import('~/components/DocumentView.svelte')).default;
        return navigate({
            page,
            transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, null, 10)) : undefined,
            props: {
                document: doc
            }
        });
    }
    async function onStartCam() {
        try {
            const result = await request('camera');
            if (result[0] !== 'authorized') {
                throw new Error(lc('camera_permission_needed'));
            }
            const document: OCRDocument = await showModal({
                page: Camera,
                fullscreen: true
            });
            if (document) {
                if (document.pages.length === 1) {
                    const component = (await import('~/components/DocumentEdit.svelte')).default;
                    navigate({
                        page: component,
                        props: {
                            document
                        }
                    });
                } else {
                    await goToView(document);
                }
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
    async function fullscreenSelectedDocuments() {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        const selected: OCRDocument[] = [];
        documents.forEach((d, index) => {
            if (d.selected) {
                selected.push(d.doc);
            }
        });
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: selected.reduce((acc, doc) => {
                    doc.pages.forEach((page) =>
                        acc.push({
                            // sharedTransitionTag: `document_${doc.id}_${page.id}`,
                            name: page.name || doc.name,
                            image: page.getImagePath(),
                            ...page
                        })
                    );
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
            const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = [
                {
                    icon: 'mdi-cogs',
                    id: 'preferences',
                    name: l('preferences')
                },
                {
                    icon: 'mdi-information-outline',
                    id: 'about',
                    name: l('about')
                }
            ];
            const result: { icon: string; id: string; text: string } = await showPopover({
                backgroundColor: colorSurfaceContainer,
                view: OptionSelect,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                transparent: true,
                hideArrow: true,
                horizPos: HorizontalPosition.ALIGN_RIGHT,
                props: {
                    borderRadius: 10,
                    elevation: 4,
                    margin: 4,
                    backgroundColor: colorSurfaceContainer,
                    width: 200,
                    rowHeight: 48,
                    height: options.length * 48 + 16,
                    fontWeight: 'normal',
                    containerColumns: 'auto',
                    onClose: closePopover,
                    options
                }
            });
            if (result) {
                switch (result.id) {
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
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo}>
    <gridlayout rows="auto,*">
        <!-- {/if} -->
        <collectionView bind:this={collectionView} items={documents} row={1} rowHeight={150 * $systemFontScale}>
            <Template let:item>
                <!-- TODO: make this a canvas -->
                <gridlayout
                    backgroundColor={colorSurfaceContainerHigh}
                    borderRadius={12}
                    columns="auto,*"
                    margin="8 16 8 16"
                    padding={10}
                    rippleColor={colorSurface}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    >/
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        height={114}
                        item={item.doc.pages[0]}
                        sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                        stretch="aspectFill"
                        verticalAlignment="center"
                        width={114} />
                    <canvaslabel col={1} fontSize={14 * $systemFontScale} padding="4 0 6 16">
                        <cgroup>
                            <cspan fontSize={16 * $systemFontScale} fontWeight="bold" lineBreak="end" lineHeight={18 * $systemFontScale} text={item.doc.name} />
                            <cspan color={colorOnSurfaceVariant} lineHeight={26 * $systemFontScale} text={'\n' + dayjs(item.doc.createdDate).format('L LT')} />
                        </cgroup>

                        <cspan color={colorOnSurfaceVariant} text={getSize(item)} verticalAlignment="bottom" />
                    </canvaslabel>
                    <SelectedIndicator selected={item.selected} />
                    <SyncIndicator col={1} selected={item.doc._synced === 1} visible={syncEnabled} />
                    <PageIndicator col={1} horizontalAlignment="right" text={item.doc.pages.length} />
                </gridlayout>
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

        <CActionBar title={l('documents')}>
            <mdbutton
                class="actionBarButton"
                defaultVisualState={syncEnabled ? 'normal' : 'disabled'}
                isEnabled={!syncRunning}
                text="mdi-sync"
                variant="text"
                on:tap={syncDocuments}
                on:longPress={showSyncSettings} />
            <mdbutton class="actionBarButton" text="mdi-cogs" variant="text" on:tap={showSettings} />
        </CActionBar>
        <!-- {#if nbSelected > 0} -->
        {#if nbSelected > 0}
            <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)}>
                <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteSelectedDocuments} />
                <mdbutton class="actionBarButton" text="mdi-fullscreen" variant="text" on:tap={fullscreenSelectedDocuments} />
            </CActionBar>
        {/if}
    </gridlayout>
</page>
