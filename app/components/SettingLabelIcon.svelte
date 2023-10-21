<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { borderColor, subtitleColor as defaultSubtitleColor, iconColor, mdiFontFamily, primaryColor } from '~/variables';

    const dispatch = createEventDispatcher();
    export let title: string = null;
    export let subtitle: string = null;
    export let icon: string = null;
    export let subtitleColor = defaultSubtitleColor;
    export let subtitleMaxLines = 2;
</script>

<gridlayout columns="16,*,auto,16" rippleColor={primaryColor} rows="12,auto,12" on:tap={(event) => dispatch('tap', event)}>
    <stacklayout col={1} row={1} verticalAlignment="middle">
        <label fontSize="17" lineBreak="end" maxLines={2} text={title} textWrap="true" verticalTextAlignment="top" />
        <label color={$subtitleColor} fontSize="14" lineBreak="end" maxLines={subtitleMaxLines} text={subtitle} verticalTextAlignment="top" visibility={!!subtitle ? 'visible' : 'collapsed'} />
    </stacklayout>
    <label col={2} color={$iconColor} fontFamily={mdiFontFamily} fontSize="24" row={1} text={icon} textAlignment="right" verticalAlignment="middle" visibility={!!icon ? 'visible' : 'collapsed'} />

    <absoluteLayout backgroundColor={$borderColor} col={1} colSpan="3" height="1" row={2} verticalAlignment="bottom" />
</gridlayout>
