<script context="module" lang="ts">
    import { Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { conditionalEvent } from '~/utils/svelte/ui';
    import { actionBarButtonHeight, colors, fonts } from '~/variables';
    const iconPaint = new Paint();
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    $: ({ colorOnSurface, colorOnSurfaceVariant, colorPrimary } = $colors);

    export let isVisible = true;
    export let isHidden = false;
    export let white = false;
    export let isEnabled = true;
    export let small = false;
    export let gray = false;
    export let isSelected = false;
    export let text = null;
    export let fontFamily = $fonts.mdi;
    export let selectedColor = white ? 'white' : colorPrimary;
    export let color = null;
    export let onLongPress: Function = null;
    export let fontSize = 0;
    export let size: any = small ? 30 : $actionBarButtonHeight;
    export let tooltip = null;
    export let rounded = true;
    export let shape = null;
    export let height = null;
    export let width = null;

    iconPaint.fontFamily = $fonts.mdi;

    let canvas: NativeViewElementNode<CanvasView>;

    // let actualColor = null;
    // $: actualColor = white ? 'white' : !isEnabled || gray ? $subtitleColor : color;
    $: actualColor = color || (!isEnabled || gray ? colorOnSurfaceVariant : colorOnSurface);
    $: actualLongPress =
        onLongPress || tooltip
            ? (event) => {
                  if (event.ios && event.ios.state !== 3) {
                      return;
                  }
                  if (onLongPress) {
                      onLongPress(event);
                  } else {
                      //   showToolTip(tooltip);
                  }
              }
            : null;
    $: refresh(text);

    function refresh(...args) {
        canvas?.nativeView?.redraw();
    }
    function onCanvasDraw({ canvas, object }: { canvas: Canvas; object: CanvasView }) {
        iconPaint.fontFamily = fontFamily;
        iconPaint.textSize = fontSize ? fontSize : small ? 16 : 24;
        iconPaint.color = isEnabled ? (isSelected ? selectedColor : actualColor) : 'lightgray';
        const w = canvas.getWidth();
        const w2 = w / 2;
        const h2 = canvas.getHeight() / 2;
        const staticLayout = new StaticLayout(text, iconPaint, w, LayoutAlignment.ALIGN_CENTER, 1, 0, true);
        canvas.translate(0, h2 - staticLayout.getHeight() / 2);
        staticLayout.draw(canvas);
        // canvas.drawText(text, w2, w2+ textSize/3, iconPaint);
    }
</script>

<canvas
    bind:this={canvas}
    borderRadius={shape === 'round' || (rounded && !shape) ? size / 2 : null}
    disableCss={true}
    rippleColor={actualColor}
    visibility={isVisible ? 'visible' : isHidden ? 'hidden' : 'collapsed'}
    on:draw={onCanvasDraw}
    {...$$restProps}
    height={height || size}
    width={width || size}
    on:tap
    use:conditionalEvent={{ condition: !!actualLongPress, event: 'longPress', callback: actualLongPress }} />
<!-- <mdbutton
    {isEnabled}
    {text}
    variant="text"
    shape={shape || (rounded ? 'round' : null)}
    disableCss={true}
    rippleColor={actualColor}
    {fontFamily}
    visibility={isVisible ? 'visible' : isHidden ? 'hidden' : 'collapsed'}
    color={isSelected ? selectedColor : actualColor}
    {...$$restProps}
    on:tap
    on:longPress={actualLongPress}
    width={width || size}
    height={height || size}
    fontSize={fontSize ? fontSize : small ? 16 : 24}
/> -->
