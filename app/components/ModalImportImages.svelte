<script lang="ts">
    import { Page } from '@nativescript/core';
    import { closeModal } from 'svelte-native';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CropView from '~/components/common/CropView.svelte';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { QRCodeData } from 'plugin-nativeprocessor';
    import { Template } from 'svelte-native/components';
    import { Pager } from '@nativescript-community/ui-pager';

    let page: NativeViewElementNode<Page>;
    let pager: NativeViewElementNode<Pager>;

    export let items: {
        editingImage;
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
</script>

<page bind:this={page} id="modalImport" actionBarHidden={true} statusBarColor="black" statusBarStyle="dark">
    <gridlayout backgroundColor="black" rows="auto,*,auto,auto">
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
        <mdbutton class="fab" elevation={0} horizontalAlignment="center" rippleColor="white" row={3} text="mdi-check" variant="text" on:tap={onTapFinish} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true} title={null} />
    </gridlayout>
</page>
