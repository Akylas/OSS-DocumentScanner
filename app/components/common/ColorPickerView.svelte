<script context="module" lang="ts">
    const AVAILABLE_COLORS = ['#ff5800', '#ffbf00', '#37e7b7', '#00df89', '#7ecbff', '#f4f7fa', '#a7b5c2', '#ff0034', '#ff789e', '#b700ee'];
    import { closePopover } from '@nativescript-community/ui-popover/svelte';
    import { colors, fonts } from '~/variables';

    const BUTTON_WIDTH = 40;
    const BUTTON_MARGIN = 4;
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    const { colorOutline } = $colors;
    export let defaultColor: string;
    export let width;
    const actualWidth = Math.floor(width / (BUTTON_WIDTH + 2 * BUTTON_MARGIN)) * (BUTTON_WIDTH + 2 * BUTTON_MARGIN);
    function selectColor(color) {
        closePopover(color);
    }
</script>

<gesturerootview columns="auto" rows="auto">
    <wraplayout width={actualWidth} {...$$restProps}>
        {#each AVAILABLE_COLORS as color}
            <gridlayout
                backgroundColor={color}
                borderColor={colorOutline}
                borderRadius={6}
                borderWidth={color === defaultColor ? 2 : 0}
                height={BUTTON_WIDTH}
                margin={BUTTON_MARGIN}
                width={BUTTON_WIDTH}>
                <label
                    color={colorOutline}
                    fontFamily={$fonts.mdi}
                    fontSize={24}
                    text={color === defaultColor ? 'mdi-check' : null}
                    textAlignment="center"
                    verticalTextAlignment="center"
                    on:tap={() => selectColor(color)} />
            </gridlayout>
        {/each}
    </wraplayout>
</gesturerootview>
