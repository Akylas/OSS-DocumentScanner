<script lang="ts">
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { AndroidApplication, Application, ApplicationSettings, EventData, NavigatedData, ObservableArray, Page } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
    import { onDestroy, onMount } from 'svelte';
    import { navigate, showModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
import { NativeViewElementNode } from 'svelte-native/dom';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { prefs } from '~/services/preferences';
    import { showError } from '~/utils/error';
    import { getColorMatrix, importAndScanImage, timeout } from '~/utils/ui';
    import { accentColor, primaryColor } from '~/variables';
    import ActionSheet from './ActionSheet.svelte';
    import CActionBar from './CActionBar.svelte';
    import Camera from './Camera.svelte';
    import PdfEdit from './PDFEdit.svelte';
    import RotableImageView from './RotableImageView.svelte';

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
        const r = await OCRDocument.find({
            order: {
                id: 'DESC'
            },
            take: 50
        });
        // console.log('pages0', r.map((d) => d.pages));
        try {
            // await Promise.all(r.map((d) => d.pages[0]?.imagePath));
            // console.log('getImageSource', 'done');
        } catch (error) {
            console.error(error);
        }
        documents = new ObservableArray(
            r.map((s) => ({
                doc: s,
                selected: false
            }))
        );
    }
    function onDocumentAdded(event: EventData & { doc }) {
        documents.unshift({
            doc: event.doc,
            selected: false
        } as Item);
    }
    function onDocumentPageUpdated(event: EventData & { pageIndex: number }) {
        let index = -1;
        if (event.pageIndex === 0) {
            documents.some((d, i) => {
                if (d.doc === event.object) {
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
            Application.android.on(AndroidApplication.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        documentsService.on('documentAdded', onDocumentAdded);
        // refresh();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(AndroidApplication.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        documentsService.off('documentAdded', onDocumentAdded);
    });

    let showActionButton = !ApplicationSettings.getBoolean('startOnCam', START_ON_CAM);

    function onStartCam() {
        showModal({
            page: Camera,
            fullscreen: true
        });
    }

    async function importDocument() {
        try {
            const doc = await importAndScanImage();
            await timeout(10);
            await navigate({
                page: PdfEdit,
                // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
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
            refresh();
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
    function onItemTap(item: Item) {
        if (ignoreTap) {
            ignoreTap = false;
            return;
        }
        // console.log('onItemTap', event && event.ios && event.ios.state, selectedSessions.length);
        if (nbSelected > 0) {
            onItemLongPress(item);
        } else {
            navigate({
                page: PdfEdit,
                // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                props: {
                    document: item.doc
                }
            });
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
                    message: lc('confirm_delete_sessions', nbSelected),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
                console.log('delete, confirmed', result);
                if (result) {
                    const indexes = [];
                    const selected = [];
                    documents.forEach((d, index) => {
                        if (d.selected) {
                            indexes.push(index);
                            selected.push(d.doc);
                        }
                    });
                    await OCRDocument.delete(selected);
                    indexes.reverse().forEach((index) => {
                        documents.splice(index, 1);
                    });
                    nbSelected = 0;
                    // this.refresh();
                    // });
                }
            } catch (error) {
                showError(error);
            }
        }
    }
    async function showOptions() {
        const result: { icon: string; id: string; text: string } = await showBottomSheet({
            parent: page,
            view: ActionSheet,
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
                    const About = require('./About.svelte').default;
                    showModal({ page: About, animated: true, fullscreen: true });
                    break;
            }
        }
    }
</script>

<page actionBarHidden={true} on:navigatedTo={onNavigatedTo} bind:this={page}>
    <gridlayout rows="auto,*">
        <CActionBar title={nbSelected ? l('selected', nbSelected) : l('documents')} onGoBack={unselectAll} forceCanGoBack={nbSelected}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-delete" on:tap={deleteSelectedDocuments} visibility={nbSelected ? 'visible' : 'hidden'} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-dots-vertical" on:tap={showOptions} />
        </CActionBar>
        <collectionView row={1} items={documents} colWidth="50%" rowHeight="200">
            <Template let:item>
                <gridLayout rows="*,auto" padding="4" borderRadius="4" margin="4" rippleColor={accentColor} on:tap={() => onItemTap(item)} on:longPress={(e) => onItemLongPress(item, e)}>
                    <RotableImageView item={item.doc.pages[0]} />
                    <label row={1} text={item.doc.name} padding="4" />
                    <label
                        rowSpan={2}
                        class="mdi"
                        backgroundColor={primaryColor}
                        color="white"
                        text="mdi-check"
                        fontSize={16}
                        width={20}
                        height={20}
                        borderRadius={10}
                        textAlignment="center"
                        verticalTextAlignment="center"
                        verticalAlignment="bottom"
                        horizontalAlignment="right"
                        margin={10}
                        visibility={item.selected ? 'visible' : 'hidden'}
                    />
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
