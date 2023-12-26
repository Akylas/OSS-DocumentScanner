<script lang="ts">
    import { lc } from '@nativescript-community/l';
    import { Matrix, Paint, Style } from '@nativescript-community/ui-canvas';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Img, getImagePipeline } from '@nativescript-community/ui-image';
    import { ImageSource, View, querySelectorAll } from '@nativescript/core';
    import { createEventDispatcher } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CropView from '~/components/CropView.svelte';
    import { IMG_COMPRESS, IMG_FORMAT } from '~/models/OCRDocument';
    import { ColorMatricesType, ColorMatricesTypes, getColorMatrix } from '~/utils/ui';
    import { colors } from '~/variables';
    import RotableImageView from './RotableImageView.svelte';
    import { recycleImages } from '~/utils/utils.common';
    import { cropDocument } from 'plugin-nativeprocessor';

    let recrop = false;
    let topView: NativeViewElementNode<View>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let rotableImageView: RotableImageView;

    const dispatch = createEventDispatcher<{
        finished: null;
        croppedImageChanged: null;
    }>();

    export let croppedImagePath: string;
    export let colorType: ColorMatricesType = null;
    export let croppedImageRotation: number = 0;
    export let editingImage: ImageSource;
    export let quad;
    let quads;
    $: quads = [quad];
    let quadChanged = false;

    let item;
    $: {
        item = {
            image: croppedImagePath,
            rotation: croppedImageRotation,
            colorType
        };
        refreshCollectionView();
    }

    async function onTapFinish() {
        if (recrop) {
            // let s see if quads changed and update image
            if (quadChanged) {
                const images = await cropDocument(editingImage, [quad]);
                await new ImageSource(images[0]).saveToFileAsync(croppedImagePath, IMG_FORMAT, IMG_COMPRESS);
                recycleImages(images);

                //we remove from cache so that everything gets updated
                // if (__IOS__) {
                //     // TODO: fix why do we need to clear the whole cache? wrong cache key?
                //     getImagePipeline().clearCaches();
                // } else {
                //     getImagePipeline().evictFromCache(croppedImagePath);
                // }
                croppedImagePath = croppedImagePath;
                const views = querySelectorAll(topView.nativeView, 'imageRotation');
                views.forEach((view) => (view as Img).updateImageUri());
                refreshCollectionView();
                dispatch('croppedImageChanged');
                quadChanged = false;
            }
            recrop = false;
        } else {
            dispatch('finished');
        }
    }

    async function applyRotation(newRotation: number) {
        try {
            await rotableImageView.rotateToRotation(newRotation, true);
        } catch (error) {
            console.error(error);
        }
        croppedImageRotation = item.rotation = newRotation;
        refreshCollectionView();
    }

    function refreshCollectionView() {
        collectionView?.nativeView?.refreshVisibleItems();
    }

    async function rotateImageLeft() {
        return applyRotation((item.rotation ?? 0) - 90);
    }
    async function rotateImageRight() {
        return applyRotation((item.rotation ?? 0) + 90);
    }

    async function applyImageTransform(i) {
        colorType = item.colorType = i.colorType;
    }

    const filters = ColorMatricesTypes.map((k) => ({
        id: k,
        text: lc(k.id),
        colorType: k
    }));
</script>

<gridlayout bind:this={topView} backgroundColor="black" rows="*,auto,auto" {...$$restProps}>
    <RotableImageView bind:this={rotableImageView} {item} zoomable={true} />
    <CropView {editingImage} rowSpan={2} visibility={recrop ? 'visible' : 'hidden'} bind:quadChanged bind:quads />
    <gridlayout row="1" rows="auto,auto" visibility={recrop ? 'collapsed' : 'visible'}>
        <stacklayout orientation="horizontal" verticalAlignment="top">
            <mdbutton class="icon-btn" text="mdi-crop" variant="text" on:tap={() => (recrop = true)} />
            <mdbutton class="icon-btn" text="mdi-rotate-left" variant="text" on:tap={() => rotateImageLeft()} />
            <mdbutton class="icon-btn" text="mdi-rotate-right" variant="text" on:tap={() => rotateImageRight()} />
        </stacklayout>
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={1}>
            <Template let:item>
                <gridlayout padding={4} rows="*,24" on:tap={applyImageTransform(item)}>
                    <image colorMatrix={getColorMatrix(item.colorType)} imageRotation={croppedImageRotation} src={croppedImagePath} />
                    <label color="white" fontSize={10} row={1} text={item.text} textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
    </gridlayout>
    <mdbutton class="fab" elevation={0} horizontalAlignment="center" row={2} text="mdi-check" variant="text" verticalAlignment="bottom" on:tap={onTapFinish} />
</gridlayout>
