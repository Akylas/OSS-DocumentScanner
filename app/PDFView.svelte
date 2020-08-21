<script lang="ts">
    import { Template } from 'svelte-native/components';
    import { accentColor } from '~/variables';
    import CActionBar from './CActionBar.svelte';
    import OCRDocument from './models/OCRDocument';
    import PdfEdit from './PDFEdit.svelte';
    import { navigate } from 'svelte-native';
    import { documentsService } from './services/documents';
    import { openUrl, openFile } from '@nativescript/core/utils';
    import { showError } from './utils/error';
    import { showLoading, hideLoading } from './utils/ui';
    import { l } from 'nativescript-l';
    import { Observable, ObservableArray } from '@nativescript/core';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import OCRPage from './models/OCRPage';
import { onDestroy } from 'svelte';

    export let document: OCRDocument;
    // let collectionView: NativeViewElementNode<CollectionView>;
    let items: ObservableArray<OCRPage>;
    $: {
        document.getObservablePages().then(r=> items = r)
    }
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
    function onImageTap(image, index) {
        navigate({
            page: PdfEdit,
            transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                document,
                startPageIndex: index,
            },
        });
    }

    onDestroy(() => {
        document.clearObservableArray(items);
    });
</script>

<page actionBarHidden="true">
    <gridlayout rows="auto,*">
        <CActionBar title={document.name}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-pdf-box" on:tap={savePDF} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-content-save" on:tap={saveDocument} />
        </CActionBar>
        <collectionview row="1" {items}>
            <Template let:index let:item>
                <gridLayout padding="4" width="80%" height="200">
                    <nsimg rotate={item.rotation} src={item.imageSource} width="100%" rippleColor={accentColor} on:tap={() => onImageTap(item, index)} />
                </gridLayout>
            </Template>
        </collectionview>
    </gridlayout>
</page>
