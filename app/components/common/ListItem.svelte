<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { colors, fontScale, fonts } from '~/variables';
    $: ({ colorOnSurface, colorOnSurfaceVariant, colorPrimary, colorOutlineVariant } = $colors);
    const dispatch = createEventDispatcher();
    // technique for only specific properties to get updated on store change
    export let showBottomLine: boolean = false;
    export let extraPaddingLeft: number = 0;
    export let iconFontSize: number = 24;
    export let fontSize: number = 17;
    export let fontWeight: string | number = 500;
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let columns: string = '*';
    export let mainCol = 0;
    export let leftIconFonFamily: string = $fonts.mdi;
    export let color: string = colorOnSurface;
    export let subtitleColor: string = null;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>

<canvasview {columns} padding="0 16 0 16" rippleColor={colorPrimary} on:tap={(event) => dispatch('tap', event)} {...$$restProps}>
    <canvaslabel col={mainCol} color={color || colorOnSurface} on:draw={onDraw}>
        <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
            <cspan fontFamily={leftIconFonFamily} fontSize={iconFontSize * $fontScale} paddingLeft="10" text={leftIcon} visibility={leftIcon ? 'visible' : 'hidden'} width={iconFontSize * 2} />
        </cgroup>
        <cgroup paddingLeft={(leftIcon ? iconFontSize * 2 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
            <cspan fontSize={fontSize * $fontScale} {fontWeight} text={title} />
            <cspan color={subtitleColor || colorOnSurfaceVariant} fontSize={subtitleFontSize * $fontScale} text={subtitle ? '\n' + subtitle : ''} visibility={subtitle ? 'visible' : 'hidden'} />
        </cgroup>
    </canvaslabel>
    <slot />
    {#if showBottomLine}
        <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" />
    {/if}
</canvasview>
