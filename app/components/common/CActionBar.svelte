<script lang="ts">
    import { Frame } from '@nativescript/core';
    import { showError } from '~/utils/showError';
    import { onMount } from 'svelte';
    import { closeModal, conditionalEvent, fade, goBack } from '~/utils/svelte/ui';
    import { windowInset } from '~/variables';

    export let title: string = null;
    export let showMenuIcon: boolean = false;
    export let canGoBack: boolean = false;
    export let forceCanGoBack: boolean = false;
    export let modalWindow: boolean = false;
    export let disableBackButton: boolean = false;
    export let labelsDefaultVisualState = null;
    export let buttonsDefaultVisualState = null;
    export let clazz: string = '';
    export let onGoBack: Function = null;
    export let onTitleTap: Function = null;
    let menuIcon: string;
    let menuIconVisible: boolean;
    let menuIconVisibility: string;

    onMount(() => {
        const frame = Frame.topmost();
        canGoBack = frame?.canGoBack() || !!frame?.currentEntry;
    });
    function onMenuIcon() {
        try {
            if (onGoBack) {
                onGoBack();
            } else if (modalWindow) {
                closeModal(undefined);
            } else {
                goBack();
            }
        } catch (error) {
            showError(error);
        }
    }
    $: {
        if (modalWindow) {
            menuIcon = 'mdi-close';
        } else {
            menuIcon = forceCanGoBack || canGoBack ? (__IOS__ ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
        }
    }
    $: menuIconVisible = ((forceCanGoBack || canGoBack || modalWindow) && !disableBackButton) || showMenuIcon;
    $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapse';
</script>

<gridlayout class={'actionBar ' + clazz} columns="auto,*, auto" paddingLeft={4} paddingRight={4} rows="*" {...$$restProps} transition:fade={{ duration: 300 }} android:marginTop={$windowInset.top}>
    <label
        class={'actionBarTitle ' + clazz}
        col={1}
        text={title || ''}
        textAlignment="left"
        verticalTextAlignment="center"
        visibility={!!title ? 'visible' : 'hidden'}
        {...$$restProps?.titleProps}
        defaultVisualState={labelsDefaultVisualState}
        use:conditionalEvent={{ condition: !!onTitleTap, event: 'tap', callback: onTitleTap }} />
    <!-- {#if showLogo && !title}
        <label col={1} class="activelook" fontSize="28" color="white" text="logo" verticalAlignment="middle" marginLeft="6" />
    {/if} -->
    <slot name="center" col={1} />
    <stacklayout col={0} orientation="horizontal">
        <slot name="left" />
        <mdbutton class={'actionBarButton ' + clazz} defaultVisualState={buttonsDefaultVisualState} text={menuIcon} variant="text" visibility={menuIconVisibility} on:tap={onMenuIcon} />
    </stacklayout>
    <stacklayout col={2} orientation="horizontal">
        <slot />
    </stacklayout>
</gridlayout>
