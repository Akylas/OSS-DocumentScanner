<svelte:options accessors />

<script lang="ts">
    import { accentColor } from '~/variables';
    import { l, lc, onLanguageChanged } from '~/helpers/locale';
    import { onDestroy } from 'svelte';

    export let showButton = false;
    export let title = null;
    export let text = null;
    export let progress = null;
    export let onButtonTap = null;

</script>

<template>
    <gesturerootview columns="auto,*" padding={20} rows="auto,auto,auto">
        <label colSpan={2} fontSize={20} fontWeight="bold" padding={10} text={title} textWrap={true} verticalAlignment="middle" visibility={title ? 'visible' : 'hidden'} />
        <activityindicator class="activity-indicator" busy={true} row={1} visibility={progress === null ? 'visible' : 'hidden'} />
        <label col={1} fontSize={16} padding={10} row={1} {text} textWrap={true} verticalAlignment="middle" />
        <progress colSpan={2} color={accentColor} maxValue={100} row={2} value={progress} visibility={progress !== null ? 'visible' : 'hidden'} />
        <mdbutton colSpan={2} color={accentColor} horizontalAlignment="right" row={3} text={lc('cancel')} variant="text" visibility={showButton ? 'visible' : 'collapsed'} on:tap={onButtonTap} />
    </gesturerootview>
</template>
