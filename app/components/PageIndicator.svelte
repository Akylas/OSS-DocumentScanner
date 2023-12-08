<script lang="ts">
    import { colors, fonts, systemFontScale } from '~/variables';
    export let text: string;
    export let defaultPadding = 6;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnPrimary, colorPrimary } = $colors);
</script>

<label
    backgroundColor={colorPrimary}
    borderRadius="50%"
    color={colorOnPrimary}
    fontSize={14}
    fontWeight="bold"
    height={20 * $systemFontScale}
    horizontalAlignment="left"
    paddingLeft={defaultPadding * $systemFontScale}
    paddingRight={defaultPadding * $systemFontScale}
    rowSpan={2}
    {text}
    textAlignment="center"
    verticalAlignment="bottom"
    verticalTextAlignment="center"
    on:longPress
    {...$$restProps} />
