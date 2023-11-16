<script lang="ts">
    import { colors } from '~/variables';
    export let visible: boolean = false;
    export let selected: boolean = false;
</script>

<absolutelayout
    backgroundColor={selected ? $colors.colorPrimary : $colors.colorOnSurfaceVariant}
    borderRadius={10}
    height={10}
    horizontalAlignment="right"
    margin={10}
    rowSpan={2}
    verticalAlignment="bottom"
    visibility={visible ? 'visible' : 'hidden'}
    width={10}
    {...$$restProps} />
