<script lang="ts">
    import { l } from '@nativescript-community/l';
    import { ObservableArray } from '@nativescript/core';
    import { openFile } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { navigate } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
    import { documentsService } from '~/services/documents';
    import { showError } from '~/utils/error';
    import { getColorMatrix, hideLoading, showLoading } from '~/utils/ui';
    import { accentColor } from '~/variables';
    import CActionBar from './CActionBar.svelte';
    import PdfEdit from './PDFEdit.svelte';

    export let document: OCRDocument;
    // let collectionView: NativeViewElementNode<CollectionView>;
    let items: ObservableArray<OCRPage>;
    $: {
        console.log('updating items');
        items = document.getObservablePages();
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
    function onImageTap(item) {
        const index = items.findIndex((p) => p.id === item.id);
        console.log('onImageTap', index);
        navigate({
            page: PdfEdit,
            // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                document,
                startPageIndex: index
            }
        });
    }

    onDestroy(() => {
        // document.clearObservableArray(items);
    });
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar title={document.name}>
            <mdbutton variant="text" class="actionBarButton" text="mdi-file-pdf-box" on:tap={savePDF} />
            <mdbutton variant="text" class="actionBarButton" text="mdi-content-save" on:tap={saveDocument} />
        </CActionBar>
        <collectionview row={1} {items}>
            <Template let:index let:item>
                <gridLayout padding="4" width="80%" height="200">
                    <image
                        rotate={item.rotation}
                        src={item.getImagePath()}
                        width="100%"
                        height="100%"
                        stretch="aspectFit"
                        rippleColor={accentColor}
                        on:tap={() => onImageTap(item)}
                        colorMatrix={item.colorMatrix || getColorMatrix(item.colorType)}
                    />
                </gridLayout>
            </Template>
        </collectionview>
    </gridlayout>
</page>
