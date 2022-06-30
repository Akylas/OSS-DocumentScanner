<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { l } from '~/helpers/locale';
    import { documentsService } from '~/services/documents';
    import { accentColor } from '~/variables';
    import CActionBar from './CActionBar.svelte';
    import { OCRDocument } from '~/models/OCRDocument';
    import PdfView from './PDFView.svelte';
    import { navigate } from 'svelte-native';
    import { EventData, ObservableArray } from '@nativescript/core';

    let documents: ObservableArray<{ doc: OCRDocument; selected: boolean }> = null;

    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refresh() {
        const r = await OCRDocument.find({
            order: {
                id: 'DESC'
            },
            take: 10
        });
        console.log('documents', r);
        // console.log('pages0', r.map((d) => d.pages));
        try {
            await Promise.all(r.map((d) => d.pages[0]?.getImageSource()));
            console.log('getImageSource', 'done');
        } catch (error) {
            console.error(error);
        }
        console.log('got documents', r.length);
        documents = new ObservableArray(
            r.filter(s=>!!s.pages[0]?.imageSource).map((s) => ({
                doc: s,
                selected: false
            }))
        );
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
        documentsService.on('documentPageUpdated', onDocumentPageUpdated);
        refresh();
    });
    onDestroy(() => {
        documentsService.off('documentPageUpdated', onDocumentPageUpdated);
    });

    function onImageTap(item) {
        navigate({
            page: PdfView,
            transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                document: item.doc
            }
        });
    }
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar title={l('documents')} />
        <collectionView row={1} items={documents} colWidth="50%" rowHeight="200">
            <Template let:item>
                <gridLayout rows="*,auto" padding="4" borderRadius="4" margin="4" rippleColor={accentColor} on:tap={() => onImageTap(item)}>
                    <image rotate={item.doc.pages[0].rotation} src={item.doc.pages[0].imageSource} isUserInteractionEnabled="false" />
                    <label row={1} text={item.doc.name} padding="4" />
                </gridLayout>
            </Template>
        </collectionView>
    </gridlayout>
</page>
