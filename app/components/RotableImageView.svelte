<script lang="ts">
    import { Img } from '@nativescript-community/ui-image';
    import { createEventDispatcher } from 'svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { OCRPage } from '~/models/OCRDocument';
    import { showError } from '~/utils/error';
    import { getColorMatrix } from '~/utils/ui';

    const dispatch = createEventDispatcher();
    export let zoomable = false;
    export let item: OCRPage;
    export let stretch: any = 'aspectFit';

    let SVImageView: NativeViewElementNode<Img>;
    $: item && rotateToRotation(item.newRotation);
    async function rotateToRotation(newRotation) {
        if (!item || newRotation === undefined) {
            return;
        }
        try {
            if (newRotation == item.rotation || !SVImageView) {
                return;
            }
            const imageView = SVImageView.nativeElement;
            await imageView.animate({
                duration: 200,
                imageRotation: newRotation
            } as any);
            if (newRotation === 360) {
                // fix Android rotation going counter clock wise
                imageView['imageRotation'] = item.newRotation = 0;
            }
            dispatch('rotated', { newRotation });
        } catch (err) {
            showError(err);
        }
    }
    function getItemColorMatrix(item) {
        const result = item.colorMatrix || getColorMatrix(item.colorType);
        return result;
    }
</script>

{#if zoomable}
    <zoomimage
        {...$$restProps}
        bind:this={SVImageView}
        id="imageView"
        src={item.getImagePath()}
        {stretch}
        colorMatrix={getItemColorMatrix(item)}
        imageRotation={item.rotation}
        maxZoomScale={10}
        minZoomScale={0.2}
    />
{:else}
    <image {...$$restProps} bind:this={SVImageView} id="imageView" src={item.getImagePath()} {stretch} colorMatrix={getItemColorMatrix(item)} imageRotation={item.rotation} />
{/if}
