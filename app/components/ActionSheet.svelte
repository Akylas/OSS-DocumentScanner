<script lang="ts">
    import { onMount } from 'svelte';
    import { accentColor } from '~/variables';
    import { closeBottomSheet } from '~/utils/svelte/bottomsheet';
    export let options;
    export let title = null;

    function selectOption(option) {
        closeBottomSheet(option);
    }
</script>

<stacklayout class="bottomsheet">
    {#if title}
        <label paddingLeft="16" fontSize="17" color="#757575" text={title} height="56" verticalTextAlignment="center" />
    {/if}
    {#each options as item}
        <stacklayout rippleColor={accentColor} paddingTop="5" paddingBottom="5" orientation="horizontal" on:tap={() => selectOption(item)} height="56">
            <label paddingLeft="16" class="mdi" fontSize="24" text={item.icon} width="56" verticalAlignment="center" />
            <label fontSize="17" text={item.text} verticalAlignment="center" />
        </stacklayout>
    {/each}
</stacklayout>
