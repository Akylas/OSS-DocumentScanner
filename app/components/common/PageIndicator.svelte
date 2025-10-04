<script lang="ts">
    import { colors } from '~/variables';
    export let text: string;
    export let defaultPadding = 6;
    export let scale = 1;
    // technique for only specific properties to get updated on store change
    $: ({ colorOnPrimary, colorPrimary } = $colors);
</script>

<label
    class="pageIndicator"
    borderRadius={10 * scale}
    height={20 * scale}
    horizontalAlignment="right"
    paddingLeft={defaultPadding * scale}
    paddingRight={defaultPadding * scale}
    {text}
    verticalAlignment="bottom"
    verticalTextAlignment="center"
    on:longPress
    {...$$restProps} />
