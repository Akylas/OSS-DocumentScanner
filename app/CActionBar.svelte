<script lang="typescript">
    import { onMount } from 'svelte';
    import { closeModal, goBack } from 'svelte-native';
    import { Frame } from '@nativescript/core/ui/frame';
    export let title: string;
    // export let showLogo = false;
    export let showMenuIcon:boolean = false;
    export let canGoBack:boolean = false;
    export let modalWindow:boolean = false;
    export let disableBackButton :boolean = false;
    export let onClose: Function = null;
    let menuIcon: string;
    let menuIconVisible: boolean;
    let menuIconVisibility: string;

    onMount(() => (canGoBack = Frame.topmost() && Frame.topmost().canGoBack()));
    function onMenuIcon() {
        if (modalWindow) {
            onClose ? onClose() : closeModal(undefined);
        } else {
            goBack();
        }
    }
    $: {
        if (modalWindow) {
            menuIcon = 'mdi-close';
        } else {
            menuIcon = canGoBack ? (global.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
        }
    }
    $: menuIconVisible = ((canGoBack || modalWindow) && !disableBackButton) || showMenuIcon;
    $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapsed';
</script>

<gridLayout class="actionBar" columns="auto,*, auto" rows="*" paddingLeft="5" paddingRight="5">
    <htmllabel col="1" colSpan="3" class="actionBarTitle" textAlignment="left" visibility={!!title ? 'visible' : 'hidden'} text={title || ''} verticalTextAlignment="center" />
    <!-- {#if showLogo && !title}
        <label col="1" class="activelook" fontSize="28" color="white" text="logo" verticalAlignment="center" marginLeft="6" />
    {/if} -->
    <stackLayout col="0" orientation="horizontal">
        <slot name="left" />
        <mdbutton variant="flat" visibility={menuIconVisibility} class="icon-btn" text={menuIcon} on:tap={onMenuIcon} />
    </stackLayout>
    <stackLayout col="2" orientation="horizontal">
        <slot />
    </stackLayout>
</gridLayout>
