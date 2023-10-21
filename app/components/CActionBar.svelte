<script lang="ts">
    import { Color } from '@nativescript/core';
    import { Frame } from '@nativescript/core/ui/frame';
    import { onMount } from 'svelte';
    import { closeModal, goBack } from 'svelte-native';
import { showError } from '~/utils/error';
    export let title: string;
    // export let showLogo = false;
    export let backgroundColor: Color | string = null;
    export let showMenuIcon: boolean = false;
    export let canGoBack: boolean = false;
    export let forceCanGoBack: boolean = false;
    export let modalWindow: boolean = false;
    export let disableBackButton: boolean = false;
    export let clazz: string = '';
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
            menuIcon = forceCanGoBack || canGoBack ? (__IOS__ ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
        }
    }
    $: menuIconVisible = ((forceCanGoBack || canGoBack || modalWindow) && !disableBackButton) || showMenuIcon;
    $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapsed';
</script>

<gridlayout class={'actionBar ' + clazz} {backgroundColor} columns="auto,*, auto" paddingLeft="10" paddingRight="10" rows="*">
    <label class={'actionBarTitle ' + clazz } col={1} text={title || ''} textAlignment="left" verticalTextAlignment="center" visibility={!!title ? 'visible' : 'hidden'} />
    <!-- {#if showLogo && !title}
        <label col={1} class="activelook" fontSize="28" color="white" text="logo" verticalAlignment="middle" marginLeft="6" />
    {/if} -->
    <stacklayout col={0} orientation="horizontal">
        <slot name="left" />
        <mdbutton class={'actionBarButton ' + clazz} text={menuIcon} variant="text" visibility={menuIconVisibility} on:tap={onMenuIcon} />
    </stacklayout>
    <stacklayout col={2} orientation="horizontal">
        <slot />
    </stacklayout>
</gridlayout>
