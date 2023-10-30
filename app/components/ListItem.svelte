<script lang="ts">
    import { Canvas, CanvasView } from '@nativescript-community/ui-canvas';
    import { createEventDispatcher } from 'svelte';
    import { borderColor, mdiFontFamily, primaryColor, subtitleColor } from '~/variables';
    const dispatch = createEventDispatcher();

    export let showBottomLine: boolean = true;
    export let extraPaddingLeft: number = 0;
    export let title: string = null;
    export let subtitle: string = null;
    export let leftIcon: string = null;
    export let leftIconFonFamily: string = mdiFontFamily;
    export let onDraw: (event: { canvas: Canvas; object: CanvasView }) => void = null;
</script>

<gridlayout rippleColor={primaryColor} on:tap={(event) => dispatch('tap', event)}>
    <canvaslabel padding="16" on:draw={onDraw}>
        <cgroup paddingBottom={subtitle ? 10 : 0} verticalAlignment="middle">
            <cspan fontFamily={leftIconFonFamily} fontSize="24" paddingLeft="10" text={leftIcon} visibility={leftIcon ? 'visible' : 'hidden'} width="40" />
        </cgroup>
        <cgroup paddingLeft={(leftIcon ? 40 : 0) + extraPaddingLeft} textAlignment="left" verticalAlignment="middle">
            <cspan fontSize="16" fontWeight="bold" text={title} />
            <cspan color={$subtitleColor} fontSize="13" text={subtitle ? '\n' + subtitle : ''} />
        </cgroup>
        <line color={$borderColor} height="1" startX="0" startY="0" stopX="100%" stopY="0" strokeWidth="1" verticalAlignment="bottom" visibility={showBottomLine ? 'visible' : 'hidden'} />
    </canvaslabel>
</gridlayout>
