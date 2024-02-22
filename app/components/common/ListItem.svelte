<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { colors, fontScale, fonts } from '~/variables';
    const dispatch = createEventDispatcher();
    let colorOutlineVariant = $colors.colorOutlineVariant;
    let colorOnSurfaceVariant = $colors.colorOnSurfaceVariant;
    let colorOnSurface = $colors.colorOnSurface;
    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors);
    export let showBottomLine: boolean = true;
    export let extraPaddingLeft: number = 0;
    export let iconFontSize: number = 24;
    export let fontSize: number = 17;
    export let fontWeight: string = 'bold';
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let color: string = null;
    export let titleColor: string = null;
    export let subtitleColor: string = null;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let columns: string = '*';
    export let mainCol = 0;
    export let leftIconFonFamily: string = $fonts.mdi;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>

<canvasView {columns} padding="0 16 0 16" rippleColor={colorOnSurface} on:tap={(event) => dispatch('tap', event)} {...$$restProps}>
    <canvaslabel col={mainCol} color={titleColor || color || colorOnSurface} on:draw={onDraw}>
        <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
            <cspan fontFamily={leftIconFonFamily} fontSize={iconFontSize * $fontScale} paddingLeft="10" text={leftIcon} visibility={leftIcon ? 'visible' : 'hidden'} width={iconFontSize * 2} />
        </cgroup>
        <cgroup paddingLeft={(leftIcon ? iconFontSize * 2 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
            <cspan fontSize={fontSize * $fontScale} {fontWeight} text={title} />
            <cspan color={subtitleColor || colorOnSurfaceVariant} fontSize={subtitleFontSize * $fontScale} text={subtitle ? '\n' + subtitle : ''} visibility={subtitle ? 'visible' : 'hidden'} />
        </cgroup>
    </canvaslabel>
    <slot />
    <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" visibility={showBottomLine ? 'visible' : 'hidden'} />
</canvasView>
