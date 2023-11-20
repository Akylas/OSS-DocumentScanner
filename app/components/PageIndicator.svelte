<script lang="ts">
    import { colors, fonts } from '~/variables';
    export let text: string;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnPrimary, colorPrimary } = $colors);
</script>

<label
    backgroundColor={colorPrimary}
    borderRadius="50%"
    color={colorOnPrimary}
    fontSize={14}
    fontWeight="bold"
    height={20}
    horizontalAlignment="left"
    paddingLeft={6}
    paddingRight={6}
    rowSpan={2}
    {text}
    textAlignment="center"
    verticalAlignment="bottom"
    verticalTextAlignment="center"
    {...$$restProps} />
