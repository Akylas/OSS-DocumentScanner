<script lang="ts">
    import { Img } from '@nativescript-community/ui-image';
    import { ImageSource } from '@nativescript/core';
    import { createEventDispatcher } from 'svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { OCRPage } from '~/models/OCRDocument';
    import { showError } from '~/utils/error';
    import { getColorMatrix } from '~/utils/ui';

    const dispatch = createEventDispatcher();
    export let zoomable = false;
    export let item: OCRPage & { image?: ImageSource };
    export let stretch: any = 'aspectFit';

    let SVImageView: NativeViewElementNode<Img>;
    // $: item && rotateToRotation(item.newRotation);
    export async function rotateToRotation(newRotation, animated = false) {
        console.log('rotateToRotation', newRotation, item.rotation, animated, !!item);
        if (!item || newRotation === undefined) {
            return;
        }
        try {
            const imageView = SVImageView?.nativeElement;
            console.log('rotateToRotation', item.rotation, newRotation, animated, imageView)
            if (newRotation === item.rotation || !imageView) {
                return;
            }
            if (__ANDROID__ && animated) {
                await imageView.animate({
                    duration: 200,
                    imageRotation: newRotation
                } as any);
            }
            imageView['imageRotation'] = item.rotation = newRotation % 360;
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
        colorMatrix={getItemColorMatrix(item)}
        imageRotation={item.rotation}
        maxZoom={10}
        src={item.image || item.getImagePath?.()}
        {stretch}
        on:rotateAnimated={(e) => rotateToRotation(e.rotation, true)} />
{:else}
    <image
        {...$$restProps}
        bind:this={SVImageView}
        colorMatrix={getItemColorMatrix(item)}
        imageRotation={item.rotation}
        src={item.image || item.getImagePath?.()}
        {stretch}
        on:rotateAnimated={(e) => rotateToRotation(e.rotation, true)} />
{/if}
