<script lang="ts">
    import { Pager } from '@nativescript-community/ui-pager';
    import { ApplicationSettings, Page } from '@nativescript/core';
    import { QRCodeData } from 'plugin-nativeprocessor';
    import { closeModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import CropView from '~/components/common/CropView.svelte';
    import { lc } from '~/helpers/locale';
    import { DOCUMENT_NOT_DETECTED_MARGIN } from '~/models/constants';
    import { navigationBarHeight } from '~/variables';

    let page: NativeViewElementNode<Page>;
    let pager: NativeViewElementNode<Pager>;

    export let items: {
        imagePath: string;
        imageWidth: number;
        imageHeight: number;
        imageRotation: number;
        quads;
        qrcode?: QRCodeData;
    }[] = [];
    // export let editingImage;
    // export let quads;
    // export let qrcode: QRCodeData = null;
    function onTapFinish() {
        closeModal(items);
    }
    let currentIndex = 0;
    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
    }
    function changePage(delta) {
        currentIndex += delta;
    }

    function resetCrop() {
        const item = items[currentIndex];
        // const editingImage = item.editingImage;
        item.quads = item.quads.map((quad) => [
            [0, 0],
            [item.imageWidth - 0, 0],
            [item.imageWidth - 0, item.imageHeight - 0],
            [0, item.imageHeight - 0]
        ]);
        pager.nativeView.refreshVisibleItems();
    }
</script>

<page bind:this={page} id="modalImport" actionBarHidden={true} statusBarStyle="dark">
    <gridlayout backgroundColor="black" rows="auto,*,auto,auto,auto" android:paddingBottom={$navigationBarHeight}>
        <pager bind:this={pager} id="pager" disableSwipe={true} {items} row={1} selectedIndex={currentIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <CropView {...item} rowSpan={2} />
            </Template>
        </pager>
        <mdbutton
            class="icon-btn"
            color="white"
            fontSize={46}
            horizontalAlignment="left"
            row={1}
            text="mdi-chevron-left"
            variant="text"
            verticalAlignment="center"
            visibility={currentIndex > 0 ? 'visible' : 'hidden'}
            on:tap={() => changePage(-1)} />
        <mdbutton
            class="icon-btn"
            color="white"
            fontSize={46}
            horizontalAlignment="right"
            row={1}
            text="mdi-chevron-right"
            variant="text"
            verticalAlignment="center"
            visibility={currentIndex < items.length - 1 ? 'visible' : 'hidden'}
            on:tap={() => changePage(1)} />
        <pagerindicator horizontalAlignment="center" marginBottom={10} pagerViewId="pager" row={2} type="worm" verticalAlignment="bottom" />
        <label color="white" fontSize={13} marginBottom={10} row={3} text={lc('crop_edit_doc')} textAlignment="center" textWrap={true} />
        <mdbutton class="fab" elevation={0} horizontalAlignment="center" row={4} text="mdi-check" variant="text" on:tap={onTapFinish} />
        <mdbutton class="icon-btn" color="white" horizontalAlignment="right" marginRight={10} row={4} text="mdi-arrow-expand-all" variant="text" verticalAlignment="center" on:tap={resetCrop} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true} title={null} />
    </gridlayout>
</page>
