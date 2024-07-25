<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { colors, fontScale } from '~/variables';
    const iconPaint = new Paint();
    // iconPaint.setTextAlign(Align.CENTER);
    const linePaint = new Paint();
    linePaint.strokeWidth = 1;
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    // technique for only specific properties to get updated on store change
    let { colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors;
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors);

    $: linePaint.color = colorOutlineVariant;
    export let showBottomLine: boolean = false;
    // export let iconFontSize: number = 24;
    export let fontSize: number = 17;
    export let fontWeight: any = 'normal';
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let titleColor: string = null;
    export let color: string = null;
    export let subtitleColor: string = null;
    export let subtitle: string = null;
    // export let leftIcon: string = null;
    export let rightValue: string | Function = null;
    // const leftColumn = iconFontSize * 1.4 * $fontScale;
    export let columns: string = '*,auto';
    // export let leftIconFonFamily: string = $fonts.mdi;
    export let mainCol = 0;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;

    function draw(event: { canvas: Canvas; object: CanvasView }) {
        const canvas = event.canvas;
        const h = canvas.getHeight();
        const w = canvas.getHeight();

        if (showBottomLine) {
            event.canvas.drawLine(20, h - 1, w, h - 1, linePaint);
        }
        // if (leftIcon) {
        //     const fontSize = iconFontSize * $fontScale;
        //     iconPaint.textSize = fontSize;
        //     iconPaint.color = titleColor || color || colorOnSurface;
        //     iconPaint.fontFamily = leftIconFonFamily;
        //     const staticLayout = new StaticLayout(leftIcon, iconPaint, leftColumn, LayoutAlignment.ALIGN_CENTER, 1, 0, true);
        //     canvas.translate(6, h / 2 - staticLayout.getHeight() / 2);
        //     // canvas.drawRect(0,0,leftColumn,  staticLayout.getHeight(), iconPaint);
        //     staticLayout.draw(canvas);
        // }
        onDraw?.(event);
    }

    $: addedPadding = (subtitle?.length > 0 ? 6 : 10) + (__ANDROID__ ? 8 : 12);
</script>

<!-- <gridlayout>
    <gridlayout {columns} rippleColor={colorOnSurface} on:tap={(event) => dispatch('tap', event)} {...$$restProps} padding="10 16 10 16">
        <canvaslabel col={mainCol} color={titleColor} on:draw={onDraw}>
            <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
                <cspan
                    fontFamily={leftIconFonFamily}
                    fontSize={iconFontSize * $fontScale}
                    paddingLeft="10"
                    text={leftIcon}
                    visibility={leftIcon ? 'visible' : 'hidden'}
                    width={iconFontSize * 2} />
            </cgroup>
            <cgroup paddingLeft={(leftIcon ? iconFontSize * 2 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
                <cspan fontSize={fontSize * $fontScale} {fontWeight} text={title} />
                <cspan color={subtitleColor} fontSize={subtitleFontSize * $fontScale} text={subtitle ? '\n' + subtitle : ''} visibility={subtitle ? 'visible' : 'hidden'} />
            </cgroup>
        </canvaslabel>
        <slot />
    </gridlayout>
</gridlayout> -->

<canvasview
    {columns}
    padding="0 16 0 16"
    rippleColor={color || colorOnSurface}
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
        visibility={!!leftIcon ? 'visible' : 'collapse'}
        width={iconFontSize * 2} /> -->
    <label
        col={mainCol}
        disableCss={true}
        lineBreak="end"
        paddingBottom={addedPadding}
        paddingTop={addedPadding}
        textWrap={true}
        verticalAlignment="center"
        verticalTextAlignment="center"
        {...$$restProps.titleProps || {}}>
        <cspan color={titleColor || color || colorOnSurface} fontSize={fontSize * $fontScale} {fontWeight} text={title} />
        <cspan color={subtitleColor || colorOnSurfaceVariant} fontSize={subtitleFontSize * $fontScale} text={subtitle ? '\n' + subtitle : null} />
    </label>

    <label
        col={1}
        color={subtitleColor}
        disableCss={true}
        fontSize={subtitleFontSize * $fontScale}
        marginLeft={16}
        text={typeof rightValue === 'function' ? rightValue() : rightValue}
        textAlignment="right"
        verticalAlignment="middle"
        visibility={!!rightValue ? 'visible' : 'collapse'}
        on:tap={(event) => dispatch('rightIconTap', event)} />
    <slot />
</canvasview>
