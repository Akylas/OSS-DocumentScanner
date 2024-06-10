<script context="module" lang="ts">
    import { colors } from '~/variables';
</script>

<script lang="ts">
    export let visible: boolean = false;
    export let selected: boolean = false;
    export let size = 30;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnSurfaceVariant, colorPrimary, colorSurfaceContainerHighest } = $colors);
</script>

<canvasview
    backgroundColor={selected ? colorPrimary : colorSurfaceContainerHighest}
    height={size}
    horizontalAlignment="right"
    verticalAlignment="bottom"
    visibility={visible ? 'visible' : 'hidden'}
    width={size}
    {...$$restProps}
    margin={-size / 2}
    rotate="45" />
