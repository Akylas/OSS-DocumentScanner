<script lang="ts">
    import { Img } from '@nativescript-community/ui-image';
    import { ImageSource, Screen } from '@nativescript/core';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { onDestroy } from 'svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { OCRPage } from '~/models/OCRDocument';
    import { showError } from '~/utils/error';
    import { getColorMatrix } from '~/utils/ui';
    import { recycleImages } from '~/utils/images';
    import { IMAGE_DECODE_HEIGHT } from '~/models/constants';

    const dispatch = createEventDispatcher();
    export let zoomable = false;
    export let item: OCRPage & { image?: ImageSource };
    export let stretch: any = 'aspectFit';
    export let imageFunctionArg = null;

    let SVImageView: NativeViewElementNode<Img>;
    // $: item && rotateToRotation(item.newRotation);
    export async function rotateToRotation(newRotation, animated = false) {
        if (!item || newRotation === undefined) {
            return;
        }
        try {
            const imageView = SVImageView?.nativeElement;
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
    let imageToDestroy;
    function getImageSrc(item) {
        if (imageToDestroy) {
            const toRelease = imageToDestroy;
            setTimeout(() => {
                recycleImages(toRelease);
            }, 10);
            imageToDestroy = null;
        }
        if (item.image) {
            if (typeof item.image === 'function') {
                // TODO: it is a promise!
                let result = item.image(imageFunctionArg);
                if (result instanceof Promise) {
                    result = result.then((r) => {
                        imageToDestroy = r;
                        return r;
                    });
                } else {
                    imageToDestroy = result;
                }
                return result;
            }
            return item.image;
        }
        return item.imagePath;
    }

    onDestroy(() => {
        if (imageToDestroy) {
            recycleImages(imageToDestroy);
            imageToDestroy = null;
        }
    });
</script>

{#if zoomable}
    <zoomimage
        {...$$restProps}
        bind:this={SVImageView}
        colorMatrix={getItemColorMatrix(item)}
        decodeWidth={IMAGE_DECODE_HEIGHT}
        imageRotation={item.rotation}
        maxZoom={10}
        src={getImageSrc(item)}
        {stretch}
        on:rotateAnimated={(e) => rotateToRotation(e.rotation, true)} />
{:else}
    <image
        {...$$restProps}
        bind:this={SVImageView}
        colorMatrix={getItemColorMatrix(item)}
        imageRotation={item.rotation}
        src={getImageSrc(item)}
        {stretch}
        on:rotateAnimated={(e) => rotateToRotation(e.rotation, true)} />
{/if}
