<script context="module" lang="ts">
    import { colors } from '~/variables';
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    $: ({ colorSurfaceContainer } = $colors);
    export let icon: string = null;
    export let title: string = null;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let value = 0;
    export let backgroundColor = colorSurfaceContainer;
    export let onChange = null;
    export let formatter = (value) => value + '';

    function onValueChange(event) {
        if (onChange) {
            onChange(event.value);
        }
    }
</script>

<gridlayout>
    <gridlayout {backgroundColor} borderRadius="4" columns="auto,*,auto" elevation="2" margin="2" padding="0 10 0 10" rows="auto,auto">
        {#if icon}
            <label class="icon-label" marginTop="0" text={icon} />
        {/if}
        {#if title}
            <label col={1} marginTop="0" text={title} verticalTextAlignment="center" />
        {/if}
        <label row={1} text={formatter(min)} textAlignment="center" verticalTextAlignment="center" />
        <label col={2} row={1} text={formatter(max)} textAlignment="center" verticalTextAlignment="center" />
        <slider col={1} maxValue={max} minValue={min} row={1} stepSize={step} {value} on:valueChange={onValueChange} />
    </gridlayout>
</gridlayout>
