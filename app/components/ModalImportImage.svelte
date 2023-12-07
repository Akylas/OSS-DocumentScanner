<script lang="ts">
    import { Page } from '@nativescript/core';
    import { closeModal } from 'svelte-native';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CropView from '~/components/CropView.svelte';
    import CActionBar from '~/components/CActionBar.svelte';
    import { QRCodeData } from 'plugin-nativeprocessor';

    let page: NativeViewElementNode<Page>;
    export let editingImage;
    export let quads;
    export let qrcode: QRCodeData = null;
    function onTapFinish() {
        closeModal(quads);
    }
</script>

<page bind:this={page} id="modalImport" actionBarHidden={true} statusBarColor="black" statusBarStyle="dark">
    <gridlayout backgroundColor="black" rows="auto,*,auto">
        <CropView {editingImage} {qrcode} rowSpan={2} bind:quads />
        <mdbutton class="fab" elevation={0} horizontalAlignment="center" rippleColor="white" row={2} text="mdi-check" variant="text" on:tap={onTapFinish} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true} title={null} />
    </gridlayout>
</page>
