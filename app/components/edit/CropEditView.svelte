<script lang="ts">
    import { Pager } from '@nativescript-community/ui-pager';
    import { AndroidActivityBackPressedEventData, Application, GridLayout, Page, confirm } from '@nativescript/core';
    import { closeModal } from 'svelte-native';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import CropView from '~/components/common/CropView.svelte';
    import { lc } from '~/helpers/locale';
    import { ImportImageData } from '~/models/OCRDocument';
    import { windowInset } from '~/variables';

    let page: NativeViewElementNode<Page>;
    let pager: NativeViewElementNode<Pager>;
    let cropView: CropView;

    export let cropItem: ImportImageData;
    export let quad;
    export let quadChanged = false;
    let quads;
    $: quads = quad ? [quad] : [];
    // export let editingImage;
    // export let quads;
    // export let qrcode: QRCodeData = null;
    function onRecropTapFinish() {
        closeModal(quadChanged ? quads[0] : undefined);
    }

    function resetCrop() {
        const shouldInverse = cropItem.imageRotation % 180 !== 0;
        const imageWidth = shouldInverse ? cropItem.imageHeight : cropItem.imageWidth;
        const imageHeight = shouldInverse ? cropItem.imageWidth : cropItem.imageHeight;
        quad = [
            [0, 0],
            [imageWidth - 0, 0],
            [imageWidth - 0, imageHeight - 0],
            [0, imageHeight - 0]
        ];
    }
    async function onUndo() {
        cropView?.applyUndo();
    }
    async function onRedo() {
        cropView?.applyRedo();
    }
    async function onUndosChanged() {
        //trigger update
        cropItem = cropItem;
    }
</script>

<page bind:this={page} id="modalImport" actionBarHidden={true} statusBarStyle="dark">
    <gridlayout backgroundColor="black" rows="auto,*,auto,auto" android:paddingBottom={$windowInset.bottom}>
        <CropView bind:this={cropView} {...cropItem ? cropItem : null} row={1} bind:quadChanged bind:quads on:undosChanged={onUndosChanged} />
        <label color="white" fontSize={13} padding={10} row={2} text={lc('crop_edit_doc')} textAlignment="center" textWrap={true} />
        <mdbutton class="fab" elevation={0} horizontalAlignment="center" margin="0" row={3} text="mdi-check" variant="text" on:tap={() => onRecropTapFinish()} />
        <mdbutton class="icon-btn" color="white" horizontalAlignment="right" marginRight={10} row={3} text="mdi-arrow-expand-all" variant="text" verticalAlignment="center" on:tap={resetCrop} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true} title={null}>
            <mdbutton class="actionBarButton" defaultVisualState="black" isEnabled={cropItem?.undos.length > 0} text="mdi-undo" variant="text" on:tap={onUndo} />
            <mdbutton class="actionBarButton" defaultVisualState="black" isEnabled={cropItem?.redos.length > 0} text="mdi-redo" variant="text" on:tap={onRedo} />
        </CActionBar>
    </gridlayout>
</page>
