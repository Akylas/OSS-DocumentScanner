<script lang="ts">
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Application, ApplicationSettings, EventData, NavigatedData, ObservableArray, Page, PageTransition, Screen, SharedTransition } from '@nativescript/core';
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
    import { colors, screenWidthDips } from '~/variables';
    import SqlQuery from '@akylas/kiss-orm/dist/Queries/SqlQuery';
    import { syncService } from '~/services/sync';
    import { Img } from '@nativescript-community/ui-image';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { closePopover, showPopover } from '@nativescript-community/ui-popover/svelte';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';

    const rowMargin = 8;
    const itemHeight = screenWidthDips / 2 - rowMargin * 2 + 100;

    interface Item {
        doc: OCRDocument;
        selected: boolean;
    }
    let documents: ObservableArray<Item> = null;
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;

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
            // await Promise.all(r.map((d) => d.pages[0]?.imagePath));
            // console.log('getImageSource', 'done');
        } catch (error) {
            console.error(error);
        }
    }
    function onDocumentAdded(event: EventData & { doc }) {
        documents.unshift({
            doc: event.doc,
            selected: false
        } as Item);
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
    function onDocumentsDeleted(event: EventData & { docs: OCRDocument[] }) {
        for (let index = documents.length - 1; index >= 0; index--) {
            if (event.docs.indexOf(documents.getItem(index).doc) !== -1) {
                documents.splice(index, 1);
                nbSelected -= 1;
            }
        }
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
                    const imageView = getImageView(index);
                    imageView?.updateImageUri();
                }
            }
        }
    }
    let syncRunning = false;
    function onSyncState(event: EventData & { state: 'running' | 'finished' }) {
        syncRunning = event.state === 'running';
        DEV_LOG && console.log('syncState', event.state, syncRunning);
    }
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

    async function onStartCam() {
        try {
            const document = await showModal({
                page: Camera,
                fullscreen: true
            });
            if (document) {
                const PDFView = (await import('~/components/PDFView.svelte')).default;
                navigate({
                    page: PDFView,
                    transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300)) : undefined,
                    props: {
                        document
                    }
                });
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
            //     const PDFView = (await import('~/components/PDFView.svelte')).default;
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
            // await timeout(10);
            const component = (await import('~/components/PDFEdit.svelte')).default;
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
                const component = (await import('~/components/PDFView.svelte')).default;
                navigate({
                    page: component,
                    transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, null, 10)) : undefined,
                    props: {
                        document: item.doc
                    }
                });
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
                view: OptionSelect,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                horizPos: HorizontalPosition.ALIGN_RIGHT,
                props: {
                    width: 200,
                    fontSize: 16,
                    backgroundColor: $colors.colorSurfaceContainer,
                    iconFontSize: 24,
                    showBorders: false,
                    rowHeight: 48,
                    height: options.length * 48 + 16,
                    fontWeight: 'normal',
                    containerColumns: 'auto',
                    onClose: closePopover,
                    margin: 4,
                    borderRadius: 4,
                    elevation: 3,
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
    async function syncDocuments() {
        try {
            if (!syncEnabled) {
                return;
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
</script>

<page bind:this={page} id="documentList" actionBarHidden={true} on:navigatedTo={onNavigatedTo}>
    <gridlayout rows="auto,*">
        <!-- {/if} -->
        <collectionView bind:this={collectionView} colWidth="50%" items={documents} row={1} rowHeight={itemHeight}>
            <Template let:item>
                <!-- TODO: make this a canvas -->
                <gridlayout
                    backgroundColor={$colors.colorSurfaceContainer}
                    borderColor={$colors.colorOutline}
                    borderRadius={12}
                    borderWidth={1}
                    margin={8}
                    rippleColor={$colors.colorSurface}
                    rows="*,100"
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    >/
                    <RotableImageView id="imageView" borderRadius={12} item={item.doc.pages[0]} sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`} stretch="aspectFill" />
                    <canvaslabel height="100%" padding="16" row={1}>
                        <cspan fontSize={14} fontWeight="bold" text={item.doc.name} />
                        <cspan color={$colors.colorOnSurfaceVariant} fontSize={12} paddingTop={36} text={dayjs(item.doc.createdDate).format('L LT')} />
                        <cspan color={$colors.colorOnSurfaceVariant} fontSize={12} paddingTop={50} text={lc('nb_pages', item.doc.pages.length)} />
                    </canvaslabel>
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                    <SyncIndicator rowSpan={2} selected={item.doc._synced === 1} visible={syncEnabled} />
                </gridlayout>
            </Template>
        </collectionView>
        <label fontSize={17} row={1} text={lc('no_document_yet')} textAlignment="center" verticalAlignment="middle" visibility={documents?.length ? 'hidden' : 'visible'} />
        {#if showActionButton}
            <stacklayout horizontalAlignment="right" row={1} verticalAlignment="bottom">
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
            <mdbutton class="actionBarButton" text="mdi-dots-vertical" variant="text" on:tap={showOptions} />
        </CActionBar>
        <!-- {#if nbSelected > 0} -->
        <CActionBar forceCanGoBack={true} onGoBack={unselectAll} title={l('selected', nbSelected)} visibility={nbSelected > 0 ? 'visible' : 'collapsed'}>
            <mdbutton class="actionBarButton" text="mdi-delete" variant="text" on:tap={deleteSelectedDocuments} />
        </CActionBar>
    </gridlayout>
</page>
