<script lang="ts">
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { DocumentScanner } from '@nativescript-community/document-scanner';
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
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { importAndScanImage, timeout } from '~/utils/ui';
    import { accentColor, backgroundColor, subtitleColor, textColor, widgetBackgroundColor } from '~/variables';

    interface Item {
        doc: OCRDocument;
        selected: boolean;
    }
    let documents: ObservableArray<Item> = null;
    let page: NativeViewElementNode<Page>;
    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refresh() {
        // console.log('pages0', r.map((d) => d.pages));
        try {
            const r = await OCRDocument.find({
                order: {
                    id: 'DESC'
                },
                take: 50
            });

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
    function onDocumentsDeleted(event: EventData & { docs: OCRDocument[] }) {
        for (let index = documents.length - 1; index >= 0; index--) {
            if (event.docs.indexOf(documents.getItem(index).doc) !== -1) {
                documents.splice(index, 1);
                nbSelected -= 1;
            }
        }
    }
    function onDocumentPageUpdated(event: EventData & { pageIndex: number }) {
        let index = -1;
        if (event.pageIndex === 0) {
            documents.some((d, i) => {
                if (d.doc === (event.object as any)) {
                    index = i;
                    return true;
                }
            });
            if (index >= 0) {
                documents.setItem(index, documents.getItem(index));
            }
        }
    }
    onMount(() => {
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        documentsService.on('documentPageDeleted', onDocumentPageUpdated);
        documentsService.on('documentAdded', onDocumentAdded);
        documentsService.on('documentsDeleted', onDocumentsDeleted);
        // refresh();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageDeleted', onDocumentPageUpdated);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        documentsService.off('documentAdded', onDocumentAdded);
        documentsService.off('documentsDeleted', onDocumentsDeleted);
    });

    let showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);

    async function onStartCam() {
        try {
            const document = await showModal({
                page: Camera as any,
                fullscreen: true
            });
            if (document) {
                const PDFView = (await import('~/components/PDFView.svelte')).default;
                navigate({
                    page: PDFView as any,
                    transition: SharedTransition.custom(new PageTransition(300)),
                    props: {
                        document: document
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
            //         page: PDFView as any,
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
        //     page: Camera as any,
        //     fullscreen: true
        // });
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage();
            if (!doc) {
                return;
            }
            await timeout(10);
            const component = (await import('~/components/PDFEdit.svelte')).default;
            await navigate({
                page: component as any,
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
                await navigate({
                    page: component as any,
                    transition: SharedTransition.custom(new PageTransition(300)),
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
    async function showOptions() {
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: ActionSheet as any,
            props: {
                options: [
                    {
                        icon: 'mdi-cogs',
                        id: 'preferences',
                        text: l('preferences')
                    },
                    {
                        icon: 'mdi-information-outline',
                        id: 'about',
                        text: l('about')
                    }
                ]
            }
        });
        if (result) {
            switch (result.id) {
                case 'preferences':
                    prefs.openSettings();
                    break;

                case 'about':
                    const About = require('~/components/About.svelte').default;
                    showModal({ page: About, animated: true, fullscreen: true });
                    break;
            }
        }
    }
</script>

<page actionBarHidden={true} on:navigatedTo={onNavigatedTo} bind:this={page}>
    <gridlayout rows="auto,*">
        <CActionBar title={nbSelected ? l('selected', nbSelected) : l('documents')} onGoBack={nbSelected ? unselectAll : null} forceCanGoBack={nbSelected > 0}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-delete" on:tap={deleteSelectedDocuments} visibility={nbSelected ? 'visible' : 'hidden'} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-dots-vertical" on:tap={showOptions} />
        </CActionBar>
        <collectionView row={1} items={documents} colWidth="50%" rowHeight="180">
            <Template let:item>
                <gridLayout
                    rows="*,auto"
                    borderRadius="4"
                    margin="8"
                    clipToBounds={true}
                    rippleColor={accentColor}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}
                    elevation="2"
                    backgroundColor={$widgetBackgroundColor}
                    >/
                    <RotableImageView item={item.doc.pages[0]} sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`} />
                    <canvaslabel row={1} padding="10" height={60} color={$textColor}>
                        <cspan text={item.doc.name} fontSize={12} />
                        <!-- <cspan text={dayjs(item.doc.createdDate).format('L LT')} paddingTop={16} fontSize={10} color={$subtitleColor} /> -->
                        <cspan text={lc('nb_pages', item.doc.pages.length)} paddingTop={29} fontSize={10} color={$subtitleColor} />
                    </canvaslabel>
                    <SelectedIndicator rowSpan={2} selected={item.selected} />
                </gridLayout>
            </Template>
        </collectionView>
        {#if showActionButton}
            <stacklayout verticalAlignment="bottom" horizontalAlignment="right" row={1}>
                <mdbutton class="small-floating-btn" text="mdi-image-plus" on:tap={importDocument} horizontalAlignment="center" />
                <mdbutton class="floating-btn" text="mdi-camera" on:tap={onStartCam} margin="8 16 16 16" />
            </stacklayout>
        {/if}
    </gridlayout>
</page>
