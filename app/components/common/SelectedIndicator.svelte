<script lang="ts">
    import { colors, fonts } from '~/variables';
    export let selected: boolean = false;
    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorOnPrimary } = $colors);
</script>

<label
    backgroundColor={colorPrimary}
    borderRadius={13}
    color={colorOnPrimary}
    fontFamily={$fonts.mdi}
    fontSize={18}
    height={26}
    horizontalAlignment="left"
    margin={5}
    rowSpan={2}
    text="mdi-check"
    textAlignment="center"
    verticalAlignment="top"
    verticalTextAlignment="center"
    visibility={selected ? 'visible' : 'hidden'}
    width={26}
    {...$$restProps} />
