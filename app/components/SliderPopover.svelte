<script lang="ts" context="module">
    import { widgetBackgroundColor } from '~/variables';
</script>

<script lang="ts">
    export let icon: string = null;
    export let title: string = null;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let value = 0;
    export let backgroundColor = $widgetBackgroundColor;
    export let onChange = null;
    export let formatter = (value) => value + '';

    function onValueChange(event) {
        if (onChange) {
            onChange(event.value);
        }
    }
</script>

<gridLayout>
    <gridLayout rows="auto,auto" columns="auto,*,auto" padding="0 10 0 10" borderRadius="4" {backgroundColor} margin="2" elevation="2">
        {#if icon}
            <label class="icon-label" text={icon} marginTop="0" />
        {/if}
        {#if title}
            <label text={title} col={1} verticalTextAlignment="center" marginTop="0" />
        {/if}
        <label text={formatter(min)} row={1} verticalTextAlignment="center" textAlignment="center" />
        <label text={formatter(max)} row={1} col={2} verticalTextAlignment="center" textAlignment="center" />
        <slider row={1} col={1} {value} on:valueChange={onValueChange} minValue={min} maxValue={max} stepSize={step} />
    </gridLayout>
</gridLayout>
