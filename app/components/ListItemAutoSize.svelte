<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { colors, fonts, systemFontScale } from '~/variables';
    const iconPaint = new Paint();
    const linePaint = new Paint();
    linePaint.strokeWidth = 1;
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    let colorOutlineVariant = $colors.colorOutlineVariant;
    let colorOnSurfaceVariant = $colors.colorOnSurfaceVariant;
    let colorOnSurface = $colors.colorOnSurface;
    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors);

    $: linePaint.color = colorOutlineVariant;
    export let showBottomLine: boolean = false;
    export let iconFontSize: number = 24;
    export let rightIconFontSize: number = 30;
    export let fontSize: number = 17;
    export let fontWeight: any = 'bold';
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let titleColor: string = colorOnSurface;
    export let subtitleColor: string = colorOnSurfaceVariant;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let rightIcon: string = null;
    export let rightValue: string | Function = null;
    export let columns: string = 'auto,*,auto';
    export let leftIconFonFamily: string = $fonts.mdi;
    export let rightIconFonFamily: string = $fonts.mdi;
    export let mainCol = 1;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;

    function draw(event: { canvas: Canvas; object: CanvasView }) {
        const canvas = event.canvas;
        const h = canvas.getHeight();
        const w = canvas.getHeight();
        if (leftIcon) {
            iconPaint.textSize = iconFontSize * $systemFontScale;
            iconPaint.color = titleColor;
            iconPaint.fontFamily = leftIconFonFamily;
            event.canvas.drawText(leftIcon, 0, 0, iconPaint);
        }
        if (showBottomLine) {
            event.canvas.drawLine(20, h - 1, w, h - 1, linePaint);
        }
        onDraw?.(event);
    }
</script>

<!-- <gridlayout>
    <gridlayout {columns} rippleColor={colorOnSurface} on:tap={(event) => dispatch('tap', event)} {...$$restProps} padding="10 16 10 16">
        <canvaslabel col={mainCol} color={titleColor} on:draw={onDraw}>
            <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
                <cspan
                    fontFamily={leftIconFonFamily}
                    fontSize={iconFontSize * $systemFontScale}
                    paddingLeft="10"
                    text={leftIcon}
                    visibility={leftIcon ? 'visible' : 'hidden'}
                    width={iconFontSize * 2} />
            </cgroup>
            <cgroup paddingLeft={(leftIcon ? iconFontSize * 2 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
                <cspan fontSize={fontSize * $systemFontScale} {fontWeight} text={title} />
                <cspan color={subtitleColor} fontSize={subtitleFontSize * $systemFontScale} text={subtitle ? '\n' + subtitle : ''} visibility={subtitle ? 'visible' : 'hidden'} />
            </cgroup>
        </canvaslabel>
        <slot />
    </gridlayout>
</gridlayout> -->

<canvasview {columns} padding="10 16 10 16" rippleColor={colorOnSurface} on:tap={(event) => dispatch('tap', event)} on:longPress={(event) => dispatch('longPress', event)}>
    <!-- <label
        fontFamily={leftIconFonFamily}
        fontSize={iconFontSize}
        marginLeft="-10"
        text={leftIcon}
        verticalAlignment="middle"
        visibility={!!leftIcon ? 'visible' : 'collapsed'}
        width={iconFontSize * 2} /> -->
    <label col={mainCol} height={subtitle?.length > 0 ? 'auto' : 40} lineBreak="end" textWrap={true} verticalAlignment="center" verticalTextAlignment="center">
        <cspan color={titleColor} {fontSize} {fontWeight} text={title} />
        <cspan color={subtitleColor} fontSize={subtitleFontSize} text={subtitle ? '\n' + subtitle : null} />
    </label>

    <label col={2} color={subtitleColor} marginLeft={16} textAlignment="right" verticalAlignment="center" visibility={!!rightValue || rightIcon ? 'visible' : 'collapsed'}>
        <cspan fontSize={subtitleFontSize} text={typeof rightValue === 'function' ? rightValue() : rightValue} />
        <cspan fontFamily={rightIconFonFamily} fontSize={rightIconFontSize} text={rightIcon} />
    </label>
    <!-- <label
        col={2}
        color={subtitleColor}
        fontFamily={rightIconFonFamily}
        fontSize={rightIconFontSize}
        horizontalAlignment="right"
        marginLeft={16}
        marginRight={16}
        text={rightIcon}
        verticalAlignment="center"
        visibility={!!rightIcon ? 'visible' : 'hidden'}
        width={25} /> -->
    <slot />
    <!-- <canvasView> -->
    <!-- <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" visibility={showBottomLine ? 'visible' : 'hidden'} /> -->
    <!-- </canvasView> -->
</canvasview>
