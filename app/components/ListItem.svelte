<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { borderColor, mdiFontFamily, primaryColor, subtitleColor } from '~/variables';
    const dispatch = createEventDispatcher();

    export let showBottomLine: boolean = true;
    export let showSymbol: boolean = false;
    export let extraPaddingLeft: number = 0;
    export let title: string = null;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let leftIconFonFamily: string = mdiFontFamily;
    export let symbol: string = null;
    export let symbolColor: string = null;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>

<gridlayout rippleColor={primaryColor} on:tap={(event) => dispatch('tap', event)}>
    <canvaslabel padding="16" on:draw={onDraw}>
        <symbolshape visibility={showSymbol ? 'visible' : 'hidden'} {symbol} color={symbolColor} width="34" height="34" verticalAligment="middle" />
        <cgroup verticalAlignment="middle" paddingBottom={subtitle ? 10 : 0}>
            <cspan visibility={leftIcon ? 'visible' : 'hidden'} paddingLeft="10" width="40" text={leftIcon} fontFamily={leftIconFonFamily} fontSize="24" />
        </cgroup>
        <cgroup paddingLeft={(leftIcon ? 40 : 0) + extraPaddingLeft} verticalAlignment="middle" textAlignment="left">
            <cspan text={title} fontWeight="bold" fontSize="16" />
            <cspan text={subtitle ? '\n' + subtitle : ''} color={$subtitleColor} fontSize="13" />
        </cgroup>
        <line visibility={showBottomLine ? 'visible' : 'hidden'} height="1" color={$borderColor} strokeWidth="1" startX="0" verticalAlignment="bottom" startY="0" stopX="100%" stopY="0" />
    </canvaslabel>
</gridlayout>
