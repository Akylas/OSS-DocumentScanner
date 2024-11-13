<script lang="ts">
    import { colors, fontScale, fonts } from '~/variables';
    export let text: string;
    export let defaultPadding = 6;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnPrimary, colorPrimary } = $colors);
</script>

<label
    class="pageIndicator"
    borderRadius={10 * $fontScale}
    height={20 * $fontScale}
    horizontalAlignment="right"
    paddingLeft={defaultPadding * $fontScale}
    paddingRight={defaultPadding * $fontScale}
    {text}
    verticalAlignment="bottom"
    verticalTextAlignment="center"
    on:longPress
    {...$$restProps} />
