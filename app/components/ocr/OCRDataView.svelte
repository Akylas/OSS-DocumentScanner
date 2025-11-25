<script lang="ts">
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { AWebView } from '@nativescript-community/ui-webview';
    import { Color, Page } from '@nativescript/core';
    import { OCRData } from 'plugin-nativeprocessor';
    import { NativeViewElementNode } from '@nativescript-community/svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { showError } from '@shared/utils/showError';
    import { copyTextToClipboard } from '~/utils/ui';
    import { colorTheme, isEInk } from '~/helpers/theme';
    import { colors } from '~/variables';

    let { colorBackground, colorOnBackground } = $colors;
    // technique for only specific properties to get updated on store change
    $: ({ colorBackground, colorOnBackground } = $colors);
    const visualState = isEInk ? colorBackground : 'black';
    const textColor = isEInk ? colorOnBackground : 'white';

    export let ocrData: OCRData;
    export let imagePath: string;
    export let rotation: number = 0;
    // export let image: ImageSource;
    // export let rotation: number;
    export let imageWidth: number;
    export let imageHeight: number;
    let webView: NativeViewElementNode<AWebView>;

    // console.log('ocrData', JSON.stringify(ocrData));
    function onWebViewLoadFinished() {
        try {
            webView?.nativeView.registerLocalResource('ocrimage', imagePath);
            // iOS seems to that timeout or sometimes the first opening wont show the data
            setTimeout(() => {
                webView?.nativeView.executeJavaScript(`document.updateOCRData('x-local://ocrimage', ${imageWidth}, ${imageHeight}, ${rotation}, ${JSON.stringify(ocrData)})`);
            }, 10);
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
    function copyText() {
        try {
            copyTextToClipboard(text);
        } catch (error) {
            showError(error);
        }
    }
</script>

<page bind:this={page} actionBarHidden={true} backgroundColor={visualState} statusBarStyle={isEInk ? undefined : 'dark'}>
    <gridlayout class="pageContent" rows="auto,*">
        <awebview
            bind:this={webView}
            backgroundColor={visualState}
            debugMode={!PRODUCTION}
            displayZoomControls={false}
            mediaPlaybackRequiresUserAction={false}
            normalizeUrls={false}
            row={1}
            src={`~/assets/webpdfviewer/index.html?textColor=${textColor}`}
            webConsoleEnabled={!PRODUCTION}
            on:loadFinished={onWebViewLoadFinished} />

        <textview
            backgroundColor={new Color(visualState).setAlpha(200).hex}
            color={textColor}
            editable={false}
            fontSize={16}
            row={1}
            {text}
            variant="none"
            visibility={showTextView ? 'visible' : 'hidden'} />
        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState={visualState} modalWindow={true} title={null}>
            <mdbutton class="actionBarButton" color={textColor} text="mdi-content-copy" variant="text" on:tap={copyText} />
            <mdbutton class="actionBarButton" color={textColor} text="mdi-image-text" variant="text" on:tap={toggleShowTextView} />
        </CActionBar>
    </gridlayout>
</page>
