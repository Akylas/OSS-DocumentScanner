<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { EventData } from '@nativescript-community/ui-image';
    import { confirm } from '@nativescript-community/ui-material-dialogs';
    import { Application, ObservableArray, PageTransition, SharedTransition } from '@nativescript/core';
    import { AndroidActivityBackPressedEventData } from '@nativescript/core/application';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy, onMount } from 'svelte';
    import { goBack, navigate } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, showModal } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import Camera from '~/components/Camera.svelte';
    import PdfEdit from '~/components/PDFEdit.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import SelectedIndicator from '~/components/SelectedIndicator.svelte';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { hideLoading, importAndScanImage, showLoading } from '~/utils/ui';
    import { accentColor } from '~/variables';

    interface Item {
        page: OCRPage;
        selected: boolean;
    }

    export let document: OCRDocument;
    let collectionView: NativeViewElementNode<CollectionView>;
    let items: ObservableArray<Item> = null;

    // $: {
    const pages = document.getObservablePages();
    items = pages.map((page) => ({ selected: false, page })) as any as ObservableArray<Item>;
    // pages.on('change', (event)=>{
    //     switch(event.action) {
    //         case ChangeType.Splice:
    //         items.splice(event.index, event.removed.length, event.added)
    //     }
    // });
    // }
    // function onImageUpdated (event: any)  {
    //         const index = event.data.index;
    //         const current = document.pages.getItem(index)
    //         current.config =
    //         const data = {
    //             image: document.images.getItem(index).page,
    //             config: document.imagesConfig[index],
    //         };
    //         console.log('onImageUpdated', event.data.index, document, data);
    //         document.pages.setItem(index, data);
    //     }
    async function saveDocument() {
        try {
            showLoading(l('saving'));
            await document.save();
            hideLoading();
        } catch (err) {
            showError(err);
        }
    }
    async function savePDF() {
        try {
            showLoading(l('exporting'));
            const file = await documentsService.exportPDF(document);
            hideLoading();
            openFile(file.path);
        } catch (err) {
            showError(err);
        }
    }
    async function addPages() {
        try {
            document = await showModal({
                page: Camera as any,
                fullscreen: true,
                props: {
                    modal: true,
                    document
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    async function importDocument() {
        try {
            await importAndScanImage(document);
        } catch (error) {
            showError(error);
        }
    }
    async function deleteDoc() {
        try {
            const result = await confirm({
                title: lc('delete'),
                message: lc('confirm_delete'),
                okButtonText: lc('delete'),
                cancelButtonText: lc('cancel')
            });
            if (result) {
                console.log('deleteDoc')
                try {
                    await documentsService.deleteDocuments([document]);
                    items = null;
                    goBack();
                    console.log('goneBack')
                } catch (err) {
                    console.error(err);
                    //for now ignore typeorm error in delete about _observablesListeners
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    let nbSelected = 0;
    function selectItem(item: Item) {
        if (!item.selected) {
            items.some((d, index) => {
                if (d === item) {
                    nbSelected++;
                    d.selected = true;
                    items.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectItem(item: Item) {
        if (item.selected) {
            items.some((d, index) => {
                if (d === item) {
                    nbSelected--;
                    d.selected = false;
                    items.setItem(index, d);
                    return true;
                }
            });
        }
    }
    function unselectAll() {
        nbSelected = 0;
        items.splice(0, items.length, ...items.map((i) => ({ page: i.page, selected: false })));
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
                const index = items.findIndex((p) => p.page === item.page);
                // console.log('onItemTap', index);
                await navigate({
                    page: PdfEdit as any,
                    transition: SharedTransition.custom(new PageTransition(300)),
                    // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
                    props: {
                        document,
                        startPageIndex: index
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
    async function deleteSelectedPages() {
        if (nbSelected > 0) {
            try {
                const result = await confirm({
                    title: lc('delete'),
                    message: lc('confirm_delete_pages', nbSelected),
                    okButtonText: lc('delete'),
                    cancelButtonText: lc('cancel')
                });
                if (result) {
                    const indexes = [];
                    items.forEach((d, index) => {
                        if (d.selected) {
                            indexes.push(index);
                        }
                    });
                    for (let index = 0; index < indexes.length; index++) {
                        await document.deletePage(indexes[index]);

                        items.splice(indexes[index], 1);
                    }
                    nbSelected = 0;
                }
            } catch (error) {
                showError(error);
            }
        }
    }
    function onPagesAdded(event: EventData & { pages: OCRPage[] }) {
        items.push(...event.pages.map((page) => ({ page, selected: false })));
    }
    function onDocumentPageUpdated(event: EventData & { pageIndex: number }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        const current = items.getItem(index);
        items.setItem(index, { selected: current.selected, page: document.getObservablePages().getItem(index) });
    }
    function onDocumentPageDeleted(event: EventData & { pageIndex: number }) {
        if (event.object !== document) {
            return;
        }
        const index = event.pageIndex;
        items.splice(index, 1);
    }
    onMount(() => {
        console.log(`document_${document.id}`);
        if (__ANDROID__) {
            Application.android.on(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.on('documentPageDeleted', onDocumentPageDeleted);
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        document.on('pagesAdded', onPagesAdded);
        // refresh();
    });
    onDestroy(() => {
        if (__ANDROID__) {
            Application.android.off(Application.android.activityBackPressedEvent, onAndroidBackButton);
        }
        documentsService.off('documentPageDeleted', onDocumentPageDeleted);
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
        document?.off('pagesAdded', onPagesAdded);
    });
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar title={document.name}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-pdf-box" on:tap={savePDF} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-delete" on:tap={nbSelected ? deleteSelectedPages : deleteDoc} />
        </CActionBar>
        <collectionview bind:this={collectionView} row={1} {items} rowHeight={200}>
            <Template let:item>
                <gridLayout borderRadius="4" margin="4" rippleColor={accentColor} on:tap={() => onItemTap(item)} on:longPress={(e) => onItemLongPress(item, e)}>
                    <RotableImageView item={item.page} sharedTransitionTag={`document_${document.id}_${item.page.id}`} />
                    <SelectedIndicator selected={item.selected} />
                </gridLayout>
            </Template>
        </collectionview>

        <stacklayout verticalAlignment="bottom" horizontalAlignment="right" row={1}>
            <mdbutton class="small-floating-btn" text="mdi-file-document-plus-outline" on:tap={importDocument} horizontalAlignment="center" />
            <mdbutton class="floating-btn" text="mdi-plus" on:tap={addPages} margin="8 16 16 16" />
        </stacklayout>
    </gridlayout>
</page>
