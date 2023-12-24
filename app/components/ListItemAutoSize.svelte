<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { colors, fonts, systemFontScale } from '~/variables';
    const dispatch = createEventDispatcher();
    let colorOutlineVariant = $colors.colorOutlineVariant;
    let colorOnSurfaceVariant = $colors.colorOnSurfaceVariant;
    let colorOnSurface = $colors.colorOnSurface;
    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors);
    export let showBottomLine: boolean = true;
    export let extraPaddingLeft: number = 0;
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
    export let mainCol = 0;
    export let leftIconFonFamily: string = $fonts.mdi;
    export let rightIconFonFamily: string = $fonts.mdi;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
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

<gridlayout {columns} padding="10 16 10 16" rippleColor={colorOnSurface} on:tap={(event) => dispatch('tap', event)} on:longPress={(event) => dispatch('longPress', event)}>
    <label
        fontFamily={leftIconFonFamily}
        fontSize={iconFontSize}
        marginLeft="-10"
        text={leftIcon}
        verticalAlignment="middle"
        visibility={!!leftIcon ? 'visible' : 'collapsed'}
        width={iconFontSize * 2} />
    <stacklayout col={1} height={subtitle?.length > 0 ? 'auto' : 40} marginLeft={10} verticalAlignment="middle">
        <label color={colorOnSurface} {fontSize} {fontWeight} lineBreak="end" maxLines={1} text={title} textWrap="true" />
        <label color={subtitleColor} fontSize={subtitleFontSize} lineBreak="end" text={subtitle} />
    </stacklayout>

    <label
        col={2}
        color={subtitleColor}
        marginLeft={16}
        marginRight={16}
        text={typeof rightValue === 'function' ? rightValue() : rightValue}
        verticalAlignment="center"
        visibility={!!rightValue ? 'visible' : 'collapsed'} />
    <label
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
        width={25} />
    <!-- TODO: refactor i dont like to have to create another gridlayout just for the line(padding issue) -->
    <slot />
    <canvasView visibility={showBottomLine ? 'visible' : 'hidden'}>
        <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" />
    </canvasView>
</gridlayout>
