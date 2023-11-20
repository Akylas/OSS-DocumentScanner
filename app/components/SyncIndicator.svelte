<script lang="ts">
    import { colors } from '~/variables';
    export let visible: boolean = false;
    export let selected: boolean = false;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnSurfaceVariant, colorPrimary } = $colors);
</script>

<absolutelayout
    backgroundColor={selected ? colorPrimary : colorOnSurfaceVariant}
    borderRadius={10}
    height={10}
    horizontalAlignment="right"
    margin={10}
    rowSpan={2}
    verticalAlignment="bottom"
    visibility={visible ? 'visible' : 'hidden'}
    width={10}
    {...$$restProps} />
