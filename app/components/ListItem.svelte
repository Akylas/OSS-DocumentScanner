<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { colors, fonts, systemFontScale } from '~/variables';
    const dispatch = createEventDispatcher();
    let colorOutlineVariant = $colors.colorOutlineVariant;
    let colorOnSurfaceVariant = $colors.colorOnSurfaceVariant;
    let colorPrimary = $colors.colorPrimary;
    let colorOnSurface = $colors.colorOnSurface;
    let colorOnSurfaceDisabled = $colors.colorOnSurfaceDisabled;
    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurfaceVariant, colorPrimary, colorOnSurface, colorOnSurfaceDisabled } = $colors);
    export let showBottomLine: boolean = true;
    export let extraPaddingLeft: number = 0;
    export let iconFontSize: number = 24;
    export let fontSize: number = 17;
    export let fontWeight: string = null;
    export let subtitleFontSize: number = 14;
    export let title: string = null;
    export let titleColor: string = colorOnSurface;
    export let subtitleColor: string = colorOnSurfaceVariant;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let columns: string = '*';
    export let mainCol = 0;
    export let leftIconFonFamily: string = $fonts.mdi;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>



<gridlayout>
    <gridlayout {columns} rippleColor={colorPrimary} on:tap={(event) => dispatch('tap', event)} {...$$restProps} padding="10 16 10 16">
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
    <!-- TODO: refactor i dont like to have to create another gridlayout just for the line(padding issue) -->
    <canvasView visibility={showBottomLine ? 'visible' : 'hidden'}>
        <line color={colorOutlineVariant} height="1" startX="20" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" />
    </canvasView>
</gridlayout>
