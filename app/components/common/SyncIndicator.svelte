<script lang="ts">
    import { colors } from '~/variables';
    export let visible: boolean = false;
    export let selected: boolean = false;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnSurfaceVariant, colorPrimary, colorSurfaceContainerHighest } = $colors);
</script>

<absolutelayout
    backgroundColor={selected ? colorPrimary : colorSurfaceContainerHighest}
    borderRadius="50%"
    height={10}
    horizontalAlignment="right"
    verticalAlignment="top"
    visibility={visible ? 'visible' : 'hidden'}
    width={10}
    {...$$restProps} />
