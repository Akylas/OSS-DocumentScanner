<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { borderColor, iconColor, mdiFontFamily, primaryColor, subtitleColor as defaultSubtitleColor } from '~/variables';

    const dispatch = createEventDispatcher();
    export let title: string = null;
    export let subtitle: string = null;
    export let icon: string = null;
    export let subtitleColor = defaultSubtitleColor;
    export let subtitleMaxLines = 2;
</script>

<gridLayout columns="16,*,auto,16" rippleColor={primaryColor} on:tap={(event) => dispatch('tap', event)} rows="12,auto,12">
    <stackLayout row="1" col="1" verticalAlignment="center">
        <htmllabel fontSize="17" text={title} textWrap="true" verticalTextAlignment="top" maxLines="2" lineBreak="end" />
        <htmllabel visibilty={!!subtitle ? 'visible' : 'collapsed'} fontSize="14" text={subtitle} verticalTextAlignment="top" color={subtitleColor} maxLines={subtitleMaxLines} lineBreak="end" />
    </stackLayout>
    <htmllabel row="1" col="2" visibilty={!!icon ? 'visible' : 'collapsed'} fontFamily={mdiFontFamily} fontSize="24" textAlignment="right" color={iconColor} text={icon} verticalAlignment="center" />

    <absoluteLayout row="2" col="1" colSpan="3" backgroundColor={borderColor} height="1" verticalAlignment="bottom" />
</gridLayout>
