<script lang="ts">
    import { Color } from '@nativescript/core';
    import { Frame } from '@nativescript/core/ui/frame';
    import { onMount } from 'svelte';
    import { closeModal, goBack } from 'svelte-native';
    export let title: string;
    // export let showLogo = false;
    export let backgroundColor: Color | string = undefined;
    export let showMenuIcon: boolean = false;
    export let canGoBack: boolean = false;
    export let forceCanGoBack: boolean = false;
    export let modalWindow: boolean = false;
    export let disableBackButton: boolean = false;
    export let onGoBack: Function = null;
    let menuIcon: string;
    let menuIconVisible: boolean;
    let menuIconVisibility: string;

    onMount(() => {
        canGoBack = Frame.topmost() && (Frame.topmost().canGoBack() || !!Frame.topmost().currentEntry);
    });
    function onMenuIcon() {
        try {
            if (onGoBack) {
                onGoBack();
            } else if (modalWindow) {
                closeModal(undefined);
            } else {
                console.log('goBack');
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
            menuIcon = forceCanGoBack || canGoBack ? (global.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
        }
    }
    $: menuIconVisible = ((forceCanGoBack || canGoBack || modalWindow) && !disableBackButton) || showMenuIcon;
    $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapsed';
</script>

<gridLayout class="actionBar" columns="auto,*, auto" rows="*" paddingLeft="10" paddingRight="10" {backgroundColor}>
    <label col={1} class="actionBarTitle" textAlignment="left" visibility={!!title ? 'visible' : 'hidden'} text={title || ''} verticalTextAlignment="center" />
    <!-- {#if showLogo && !title}
        <label col={1} class="activelook" fontSize="28" color="white" text="logo" verticalAlignment="center" marginLeft="6" />
    {/if} -->
    <stackLayout col={0} orientation="horizontal">
        <slot name="left" />
        <mdbutton variant="text" visibility={menuIconVisibility} class="actionBarButton" text={menuIcon} on:tap={onMenuIcon} />
    </stackLayout>
    <stackLayout col={2} orientation="horizontal">
        <slot />
    </stackLayout>
</gridLayout>
