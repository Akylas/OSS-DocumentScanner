<script lang="ts">
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { AWebView } from '@nativescript-community/ui-webview';
    import { Page } from '@nativescript/core';
    import { OCRData } from 'plugin-nativeprocessor';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { showError } from '~/utils/showError';
    import { copyTextToClipboard } from '~/utils/ui';

    export let ocrData: OCRData;
    export let imagePath: string;
    export let rotation: number = 0;
    // export let image: ImageSource;
    // export let rotation: number;
    export let colorMatrix: number[] = null;
    export let imageWidth: number;
    export let imageHeight: number;
    let webView: NativeViewElementNode<AWebView>;

    // console.log('ocrData', JSON.stringify(ocrData));
    function onWebViewLoadFinished() {
        try {
            webView?.nativeView.executeJavaScript(`document.updateOCRData('${imagePath}', ${imageWidth}, ${imageHeight}, ${rotation}, ${JSON.stringify(ocrData)})`);
        } catch (error) {
            showError(error);
        }
    }

    let showTextView = true;
    // const showlabelsOnImage = true;
    let page: NativeViewElementNode<Page>;
    // let canvasView: NativeViewElementNode<CanvasView>;
    // const padding = 20;
    // let drawingRatio: number;
    // const currentImageMatrix: Matrix = new Matrix();
    // let currentPinchPanMatrix: Matrix = new Matrix();
    // const bitmapPaint = new Paint();
    // if (colorMatrix) {
    //     bitmapPaint.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
    // }

    const showWithCustomFontSize = false;

    // ocrData.blocks.forEach((b) => {
    //     console.log(JSON.stringify(b));
    // });

    function toggleShowTextView() {
        if (showTextView) {
            showTextView = false;
        } else {
            showTextView = true;
            // TODO: reset pan/zoom Matrix
        }
    }

    // $: updateMatrix(canvasView);

    let text = ocrData.text;

    $: text = showWithCustomFontSize
        ? createNativeAttributedString({
              spans: ocrData.blocks.map((b) => ({
                  text: b.text + '\n',
                  fontSize: (b.fontSize * ocrData.imageHeight) / 300, //in pixels in image size
                  fontWeight: b.fontWeight,
                  fontStyle: b.fontStyle,
                  textDecoration: b.textDecoration
              }))
          })
        : ocrData.text;

    // function updateMatrix(cvView = canvasView) {
    //     try {
    //         const canvas = cvView?.nativeView;
    //         if (!canvas || !image) {
    //             return;
    //         }
    //         // editingImageShader = new BitmapShader(image, TileMode.CLAMP, TileMode.CLAMP);
    //         // shaderPaint.setShader(editingImageShader);
    //         const w = Utils.layout.toDeviceIndependentPixels(canvas.getMeasuredWidth()) - 2 * padding;
    //         const h = Utils.layout.toDeviceIndependentPixels(canvas.getMeasuredHeight()) - 2 * padding;
    //         if (w <= 0 || h <= 0) {
    //             return;
    //         }
    //         const canvasRatio = w / h;
    //         let imageWidth = image.width;
    //         let imageHeight = image.height;
    //         const needRotation = rotation && rotation % 180 !== 0;
    //         // const needRotation = false ;
    //         if (needRotation) {
    //             imageWidth = image.height;
    //             imageHeight = image.width;
    //         }
    //         const imageRatio = imageWidth / imageHeight;
    //         let cx = padding;
    //         let cy = padding;
    //         if (imageRatio < canvasRatio) {
    //             drawingRatio = h / imageHeight;
    //             cx += (w - h * imageRatio) / 2;
    //         } else {
    //             drawingRatio = w / imageWidth;
    //             cy += (h - w / imageRatio) / 2;
    //         }
    //         console.log('imageRatio', drawingRatio, imageRatio, canvasRatio, w, h, imageWidth, imageHeight, cx, cy);
    //         currentImageMatrix.reset();
    //         if (needRotation) {
    //             currentImageMatrix.postTranslate(-image.width / 2, -image.height / 2);
    //             currentImageMatrix.postRotate(rotation);
    //             currentImageMatrix.postTranslate(image.height / 2, image.width / 2);
    //         }
    //         // console.log('updateMatrix', imageWidth, imageHeight, editingImage.rotationAngle, needRotation, editingImage.rotationAngle % 180, imageRatio, canvasRatio, drawingRatio, cx, cy,  quads)
    //         currentImageMatrix.postScale(drawingRatio, drawingRatio);
    //         currentImageMatrix.postTranslate(cx, cy);
    //         // inversedCurrentMatrix = new Matrix();
    //         canvas.invalidate();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // function updatePinchPanMatrix() {
    //     // console.log('updatePinchPanMatrix');
    //     const matrix = new Matrix();
    //     matrix.postScale(scale, scale, scaleFocusX, scaleFocusY);
    //     matrix.postTranslate(translationX / textOnImageScale, translationY / textOnImageScale);
    //     currentPinchPanMatrix = matrix;
    //     // canvasView?.nativeView?.invalidate();
    // }
    // function onCanvasDraw({ canvas }: { canvas: Canvas }) {
    //     // canvas.save();
    //     canvas.concat(currentPinchPanMatrix);
    //     canvas.concat(currentImageMatrix);

    //     canvas.drawBitmap(image, 0, 0, bitmapPaint);
    // }

    // let startTranslationX = 0;
    // let startTranslationY = 0;
    // let translationX = 0;
    // let translationY = 0;
    // function onPan(e) {
    //     if (e.state === 1) {
    //         startTranslationX = translationX;
    //         startTranslationY = translationY;
    //     } else if (e.state === 2) {
    //         const width = Utils.layout.toDeviceIndependentPixels(e.object.getMeasuredWidth());
    //         const scaledImageWidth = imageWidth * scale * textOnImageScale;
    //         const height = Utils.layout.toDeviceIndependentPixels(e.object.getMeasuredHeight());
    //         const scaledImageHeight = imageHeight * scale * textOnImageScale;
    //         console.log('translationX', width, scaledImageWidth);
    //         console.log('translationy', height, scaledImageHeight, startTranslationY + e.deltaY);
    //         translationX = Math.max(Math.min(startTranslationX + e.deltaX, 0), -(scaledImageWidth - width));
    //         translationY = Math.max(Math.min(startTranslationY + e.deltaY, scaledImageHeight - height), -(scaledImageHeight - height));
    //         // translationY = Math.max(startTranslationY + e.deltaY, 0);
    //         page?.nativeView.clearFocus();
    //         updatePinchPanMatrix();
    //     }
    //     // console.log('onPan', Date.now(), e.state, e.deltaX, e.deltaY, e.constructor.name, e.extraData?.numberOfPointers, Object.keys(e));
    // }
    // let scale = 1;
    // let startScale = 1;
    // let scaleFocusX = 0;
    // let scaleFocusY = 0;
    // function onPinch(e) {
    //     if (e.state === 1) {
    //         startScale = scale;
    //     } else if (e.state === 2) {
    //         scale = Math.max(startScale * e.scale, 1);
    //         // translationX = -e.getFocusX();
    //         // translationY = -e.getFocusY();
    //         scaleFocusX = e.getFocusX() / Utils.layout.toDeviceIndependentPixels(e.object.getMeasuredWidth());
    //         scaleFocusY = e.getFocusY() / Utils.layout.toDeviceIndependentPixels(e.object.getMeasuredHeight());
    //         console.log('onPinch', scaleFocusX, scaleFocusY, imageWidth, imageHeight, textOnImageScale);
    //         page?.nativeView.clearFocus();
    //         updatePinchPanMatrix();
    //     }
    //     // console.log('onPinch', Date.now(), e.scale, e.constructor.name, e.extraData?.numberOfPointers, Object.keys(e));
    // }
    // let textOnImageScale = 1;
    // function updateTextOnImageScale(e) {
    //     textOnImageScale = Utils.layout.toDeviceIndependentPixels(e.object.getMeasuredWidth()) / imageWidth;
    //     // console.log('updateTextOnImageScale', imageWidth, e.object.getMeasuredWidth(), textOnImageScale);
    // }

    function copyText() {
        try {
            copyTextToClipboard(text);
        } catch (error) {
            showError(error);
        }
    }
</script>

<page bind:this={page} actionBarHidden={true} backgroundColor="black" statusBarStyle="dark">
    <gridlayout rows="auto,*">
        <!-- <absolutelayout row={1} on:layoutChanged={updateTextOnImageScale} on:pinch={onPinch} on:pan={onPan}>
            <absolutelayout
                height={imageHeight}
                originX={0}
                originY={0}
                scaleX={scale * textOnImageScale}
                scaleY={scale * textOnImageScale}
                translateX={translationX}
                translateY={translationY}
                width={imageWidth}>
                <image id="imageView" {colorMatrix} height={imageHeight} imageRotation={rotation} src={imagePath} width={imageWidth} />
                {#if showlabelsOnImage}
                    {#each ocrData.blocks as item}
                        <label
                            autoFontSize={true}
                            backgroundColor="#00000088"
                            color="white"
                            fontSize={item.fontSize * 4}
                            height={item.box.height}
                            left={item.box.x}
                            selectable={true}
                            text={item.text}
                            top={item.box.y}
                            width={item.box.width} />
                    {/each}
                {/if}
            </absolutelayout>
        </absolutelayout> -->
        <!-- svelte-ignore missing-declaration -->
        <awebview
            bind:this={webView}
            backgroundColor="black"
            debugMode={!PRODUCTION}
            displayZoomControls={false}
            mediaPlaybackRequiresUserAction={false}
            normalizeUrls={false}
            row={1}
            src="~/assets/webpdfviewer/index.html"
            webConsoleEnabled={!PRODUCTION}
            on:loadFinished={onWebViewLoadFinished} />

        <textview backgroundColor="#000000cc" color="white" editable={false} fontSize={16} row={1} {text} visibility={showTextView ? 'visible' : 'hidden'} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState="black" modalWindow={true} title={null}>
            <mdbutton class="actionBarButton" color="white" text="mdi-content-copy" variant="text" on:tap={copyText} />
            <mdbutton class="actionBarButton" color="white" text="mdi-image-text" variant="text" on:tap={toggleShowTextView} />
        </CActionBar>
    </gridlayout>
</page>
