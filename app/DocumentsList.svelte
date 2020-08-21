<script lang="ts">
    import { onMount } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { l } from '~/helpers/locale';
    import { documentsService } from '~/services/documents';
    import { accentColor } from '~/variables';
    import CActionBar from './CActionBar.svelte';
    import OCRDocument from './models/OCRDocument';
    import PdfView from './PDFView.svelte';
    import { navigate } from 'svelte-native';
    import { ObservableArray } from '@nativescript/core';

    let documents: ObservableArray<{ doc: OCRDocument; selected: boolean }> = null;

    // let items: ObservableArray<{
    //     doc: OCRDocument; selected: boolean
    // }> = null;

    async function refresh() {
        const r = await OCRDocument.find({
            order: {
                id: 'DESC',
            },
            take: 10,
        });
        // console.log('documents', r);
        // console.log('pages0', r.map((d) => d.pages));
        await Promise.all(r.map((d) => d.pages[0].getImageSource()));
        // console.log('got documents', r);
        documents = new ObservableArray(
            r.map((s) => ({
                doc: s,
                selected: false,
            }))
        );
    }
    onMount(refresh);

    function onImageTap(item) {
        navigate({
            page: PdfView,
            transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                document: item.doc,
            },
        });
    }
</script>

<page actionBarHidden="true">
    <gridlayout rows="auto,*">
        <CActionBar title={l('documents')} />
        <collectionView row="1" items={documents} colWidth="50%" rowHeight="200">
            <Template let:item>
                <gridLayout rows="*,auto" padding="4" borderRadius="4" margin="4" rippleColor={accentColor} on:tap={() => onImageTap(item)}>
                    <nsimg rotate={item.doc.pages[0].rotation} src={item.doc.pages[0].imageSource} isUserInteractionEnabled="false" />
                    <htmllabel row="1" text={item.doc.name} padding="4" />
                </gridLayout>
            </Template>
        </collectionView>
    </gridlayout>
</page>
