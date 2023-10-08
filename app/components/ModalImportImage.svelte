<script lang="ts">
    import { Page } from '@nativescript/core';
    import { closeModal } from 'svelte-native';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CropView from '~/components/CropView.svelte';
    import CActionBar from '~/components/CActionBar.svelte';

    let page: NativeViewElementNode<Page>;
    export let editingImage;
    export let quads;
    console.log('quads2', quads)

    function onTapFinish() {
        closeModal(quads);
    }
</script>

<page bind:this={page} actionBarHidden={true}>
    <gridlayout rows="auto,*,auto">
        <CActionBar title={null} backgroundColor="transparent" modalWindow={true} />
        <CropView rowSpan={3} {editingImage} bind:quads />
        <mdbutton row={2} class="floating-btn" margin="0" rippleColor="white" elevation={0} variant="text" horizontalAlignment="center" text="mdi-check" on:tap={onTapFinish} />
    </gridlayout>
</page>
