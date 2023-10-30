<script lang="ts">
    import { Page } from '@nativescript/core';
    import { closeModal } from 'svelte-native';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CropView from '~/components/CropView.svelte';
    import CActionBar from '~/components/CActionBar.svelte';

    let page: NativeViewElementNode<Page>;
    export let editingImage;
    export let quads;

    function onTapFinish() {
        closeModal(quads);
    }
</script>

<page bind:this={page} actionBarHidden={true}>
    <gridlayout backgroundColor="black" rows="auto,*,auto">
        <CropView {editingImage} row={1} bind:quads />
        <mdbutton class="floating-btn" elevation={0} horizontalAlignment="center" margin="0" rippleColor="white" row={2} text="mdi-check" variant="text" on:tap={onTapFinish} />
        <CActionBar clazz="ns-dark" modalWindow={true} title={null} />
    </gridlayout>
</page>
