<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { colors, fonts, systemFontScale } from '~/variables';
    const dispatch = createEventDispatcher();

    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface } = $colors);

    export let showBottomLine: boolean = true;
    export let extraPaddingLeft: number = 0;
    export let iconFontSize: number = 24;
    export let fontSize: number = 17;
    export let fontWeight: string = null;
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let color: string = colorOnSurface;
    export let subtitleColor: string = colorOnSurfaceVariant;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let columns: string = '*';
    export let leftIconFonFamily: string = $fonts.mdi;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>

<gridlayout {columns} rippleColor={colorPrimary} on:tap={(event) => dispatch('tap', event)}>
    <canvaslabel padding={16} on:draw={onDraw}>
        <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
            <cspan fontFamily={leftIconFonFamily} fontSize={iconFontSize * $systemFontScale} paddingLeft="10" text={leftIcon} visibility={leftIcon ? 'visible' : 'hidden'} width={iconFontSize * 2} />
        </cgroup>
        <cgroup {color} paddingLeft={(leftIcon ? iconFontSize * 2 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
            <cspan fontSize={fontSize * $systemFontScale} {fontWeight} text={title} />
            <cspan color={subtitleColor} fontSize={subtitleFontSize * $systemFontScale} text={subtitle ? '\n' + subtitle : ''} visibility={subtitle ? 'visible' : 'hidden'} />
        </cgroup>
        <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" visibility={showBottomLine ? 'visible' : 'hidden'} />
    </canvaslabel>
    <slot />
</gridlayout>
