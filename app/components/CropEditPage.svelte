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
    import { IMG_FORMAT } from '~/models/OCRDocument';
    import { ColorMatricesType, ColorMatricesTypes, getColorMatrix } from '~/utils/ui';
    import { primaryColor } from '~/variables';
    import RotableImageView from './RotableImageView.svelte';

    let recrop = false;
    let topView: NativeViewElementNode<View>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let rotableImageView: RotableImageView;
    let prevTouchPoint;
    let currentMatrix: Matrix;
    let inversedCurrentMatrix: Matrix;
    let drawingRatio: number;
    // let closestQuadIndex = -1;
    let closestCornerIndex = -1;
    const cornersPaint = new Paint();
    cornersPaint.color = primaryColor;
    cornersPaint.setStrokeWidth(14);
    cornersPaint.style = Style.STROKE;
    const shaderPaint = new Paint();
    shaderPaint.style = Style.FILL;

    const dispatch = createEventDispatcher<{
        finished: null;
        croppedImageChanged: null;
    }>();

    export let editingImage: ImageSource;
    export let croppedImagePath: string;
    export let colorType: ColorMatricesType = null;
    export let croppedImageRotation: number = 0;
    export let quad;
    let quads = [quad];
    let quadChanged = false;
    let mappedQuad;

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
        console.log('onTapFinish', recrop, quadChanged);
        if (recrop) {
            // let s see if quads changed and update image
            if (quadChanged) {
                let images;
                if (__ANDROID__) {
                    images = com.akylas.documentscanner.CustomImageAnalysisCallback.Companion.cropDocument(editingImage.android, JSON.stringify([quad]));
                }
                await new ImageSource(images[0]).saveToFileAsync(croppedImagePath, IMG_FORMAT, 100);
                console.log('onImage Changed', croppedImagePath);
                //we remove from cache so that everything gets updated
                getImagePipeline().evictFromCache(croppedImagePath);
                croppedImagePath = croppedImagePath;
                const views = querySelectorAll(topView.nativeView, 'imageRotation');
                console.log('views', views);
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
        text: lc(k),
        colorType: k
    }));
</script>

<gridlayout bind:this={topView} rows="*,auto" backgroundColor="black" {...$$restProps}>
    <RotableImageView bind:this={rotableImageView} {item} zoomable={true} />
    <CropView bind:quadChanged bind:quads {editingImage} visibility={recrop ? 'visible' : 'hidden'} />
    <gridlayout row="1" rows="auto,auto,auto">
        <stacklayout orientation="horizontal" verticalAlignment="top" visibility={recrop ? 'hidden' : 'visible'}>
            <mdbutton variant="flat" class="icon-btn" text="mdi-crop" on:tap={() => (recrop = true)} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-left" on:tap={() => rotateImageLeft()} />
            <mdbutton variant="flat" class="icon-btn" text="mdi-rotate-right" on:tap={() => rotateImageRight()} />
        </stacklayout>
        <collectionview bind:this={collectionView} height={85} row={1} items={filters} colWidth={60} orientation="horizontal" visibility={recrop ? 'hidden' : 'visible'}>
            <Template let:item>
                <gridlayout rows="*,24" on:tap={applyImageTransform(item)} padding={4}>
                    <image src={croppedImagePath} imageRotation={croppedImageRotation} colorMatrix={getColorMatrix(item.colorType)} />
                    <label text={item.text} row={1} fontSize={10} color="white" textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
        <mdbutton
            row={2}
            class="floating-btn"
            margin="0"
            rippleColor="white"
            elevation={0}
            variant="text"
            verticalAlignment="bottom"
            horizontalAlignment="center"
            text="mdi-check"
            on:tap={onTapFinish}
        />
    </gridlayout>
</gridlayout>
