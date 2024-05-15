<script context="module" lang="ts">
    import PopoverBackgroundView from '~/components/common/PopoverBackgroundView.svelte';
</script>

<script lang="ts">
    export let icon: string = null;
    export let title: string = null;
    export let min = 0;
    export let max = 1;
    export let step = 0.01;
    export let value = 0;
    export let onChange = null;
    export let formatter = null;

    function onValueChange(event) {
        if (onChange) {
            onChange(event.value);
        }
    }
</script>

<PopoverBackgroundView columns="auto,*,auto" rows="auto,auto" {...$$restProps}>
    {#if icon}
        <label class="icon-label" marginTop={0} text={icon} />
    {/if}
    {#if title}
        <label col={1} text={title} verticalTextAlignment="center" />
    {/if}
    <label row={1} text={(formatter?.(min) || min) + ''} textAlignment="center" verticalTextAlignment="center" />
    <label col={2} row={1} text={(formatter?.(max) || max) + ''} textAlignment="center" verticalTextAlignment="center" />
    <slider col={1} maxValue={max} minValue={min} row={1} stepSize={step} {value} on:valueChange={onValueChange} />
</PopoverBackgroundView>
