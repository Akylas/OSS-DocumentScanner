<script context="module" lang="ts">
    import { Align, Canvas, CanvasView, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { colors, fonts, systemFontScale } from '~/variables';
    const iconPaint = new Paint();
    iconPaint.setTextAlign(Align.CENTER);
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
    export let fontSize: number = 17;
    export let fontWeight: any = 'bold';
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let titleColor: string = null;
    export let subtitleColor: string = null;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let rightValue: string | Function = null;
    export let columns: string = leftIcon ? `${iconFontSize * 2},*,auto` : 'auto,*,auto';
    export let leftIconFonFamily: string = $fonts.mdi;
    export let mainCol = 1;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;

    function draw(event: { canvas: Canvas; object: CanvasView }) {
        const canvas = event.canvas;
        const h = canvas.getHeight();
        const w = canvas.getHeight();

        if (showBottomLine) {
            event.canvas.drawLine(20, h - 1, w, h - 1, linePaint);
        }
        if (leftIcon) {
            const fontSize = iconFontSize * $systemFontScale;
            iconPaint.textSize = fontSize;
            iconPaint.color = titleColor;
            iconPaint.fontFamily = leftIconFonFamily;
            const staticLayout = new StaticLayout(leftIcon, iconPaint, w, LayoutAlignment.ALIGN_CENTER, 1, 0, true);
            canvas.translate(fontSize / 2, h / 2 - staticLayout.getHeight() / 2);
            staticLayout.draw(canvas);
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

<canvasview
    {columns}
    padding="10 16 10 16"
    rippleColor={colorOnSurface}
    on:tap={(event) => dispatch('tap', event)}
    on:longPress={(event) => dispatch('longPress', event)}
    on:draw={draw}
    {...$$restProps}>
    <!-- <label
        fontFamily={leftIconFonFamily}
        fontSize={iconFontSize}
        marginLeft="-10"
        text={leftIcon}
        verticalAlignment="middle"
        visibility={!!leftIcon ? 'visible' : 'collapsed'}
        width={iconFontSize * 2} /> -->
    <label col={mainCol} {fontSize} height={subtitle?.length > 0 ? 'auto' : 40} lineBreak="end" textWrap={true} verticalAlignment="center" verticalTextAlignment="center">
        <cspan color={titleColor || colorOnSurface} {fontWeight} text={title} />
        <cspan color={subtitleColor || colorOnSurfaceVariant} fontSize={subtitleFontSize} text={subtitle ? '\n' + subtitle : null} />
    </label>

    <label
        col={2}
        color={subtitleColor}
        marginLeft={16}
        textAlignment="right"
        verticalAlignment="center"
        visibility={!!rightValue ? 'visible' : 'visible'}
        on:tap={(event) => dispatch('rightTap', event)}>
        <cspan fontSize={subtitleFontSize} text={typeof rightValue === 'function' ? rightValue() : rightValue} />
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
