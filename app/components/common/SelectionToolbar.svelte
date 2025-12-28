<script lang="ts">
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { ObservableArray } from '@nativescript/core';
    import { onMount } from 'svelte';
    import { showPopoverMenu } from '~/utils/ui';
    import { animateVisibility } from '~/utils/transitions';
    import { colors, windowInset } from '~/variables';
    import type { OptionType } from './OptionSelect.svelte';

    export let options: OptionType[] | ObservableArray<OptionType> = [];
    export let maxVisibleActions: number = 4;
    export let onAction: (option: OptionType) => void | Promise<void> = null;
    export let visible: boolean = true;

    $: ({ colorSurfaceContainerHigh, colorOnSurface } = $colors);

    // Split options into visible and overflow
    $: visibleOptions = options.slice(0, maxVisibleActions);
    $: overflowOptions = options.slice(maxVisibleActions);
    $: hasOverflow = overflowOptions.length > 0;

    async function handleAction(option: OptionType) {
        if (onAction) {
            await onAction(option);
        }
    }

    async function showMoreOptions(event) {
        const result = await showPopoverMenu({
            anchor: event.object,
            options: new ObservableArray(overflowOptions),
            vertPos: VerticalPosition.ABOVE,
            onClose: async (item) => {
                await handleAction(item);
            }
        });
    }
</script>

<gridlayout
    class="selectionToolbar"
    backgroundColor={colorSurfaceContainerHigh}
    columns={hasOverflow ? 'auto,*,auto' : '*'}
    elevation={8}
    horizontalAlignment="stretch"
    paddingBottom={$windowInset.bottom}
    paddingLeft={8}
    paddingRight={8}
    paddingTop={8}
    verticalAlignment="bottom"
    use:animateVisibility={{ visible, type: 'slideVertical', config: { duration: 300, distance: 100 } }}>
    <stacklayout col={hasOverflow ? 1 : 0} horizontalAlignment="center" orientation="horizontal">
        {#each visibleOptions as option, index}
            <mdbutton
                class="selectionToolbarButton"
                color={option.color || colorOnSurface}
                text={option.icon}
                variant="text"
                on:tap={() => handleAction(option)} />
        {/each}
    </stacklayout>
    {#if hasOverflow}
        <mdbutton
            class="selectionToolbarButton"
            col={2}
            color={colorOnSurface}
            text="mdi-dots-vertical"
            variant="text"
            on:tap={showMoreOptions} />
    {/if}
</gridlayout>
