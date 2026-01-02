<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKPass } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { Item } from './MainList.svelte';

    export let item: Item;
    export let pkpass: PKPass;
    export let itemWidth: number;
    export let layout: string;

    let { colorOnBackground, colorOnPrimary, colorSurface } = $colors;
    $: ({ colorOnBackground, colorOnPrimary, colorSurface } = $colors);

    $: passData = pkpass?.passData;
    $: foregroundColor = passData.foregroundColor || colorOnBackground;
    $: backgroundColor = passData.backgroundColor || colorSurface;
    $: logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo;
    $: iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon;
    $: thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail;
    $: stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip;

    // Get primary field value
    function getPrimaryValue(): string {
        const structure = pkpass?.getPassStructure();
        if (structure?.primaryFields && structure.primaryFields.length > 0) {
            const field = structure.primaryFields[0];
            return typeof field.value === 'string' ? field.value : String(field.value);
        }
        return '';
    }
</script>

{#if pkpass}
    <gridlayout {backgroundColor} borderRadius="12" padding="12" rows="auto,auto,auto">
        <!-- Strip or thumbnail image at top if available -->
        {#if stripImage}
            <image height="60" horizontalAlignment="stretch" row={0} src={path.join(pkpass.imagesPath, stripImage)} stretch="aspectFill" borderRadius="8 8 0 0" marginBottom="8" />
        {:else if thumbnailImage}
            <image height="60" horizontalAlignment="center" row={0} src={path.join(pkpass.imagesPath, thumbnailImage)} stretch="aspectFit" marginBottom="8" />
        {/if}

        <!-- Header with icon and logo -->
        <gridlayout columns="auto,*,auto" row={1} marginBottom="8">
            <!-- Icon on the left -->
            {#if iconImage}
                <image col={0} height="24" src={path.join(pkpass.imagesPath, iconImage)} stretch="aspectFit" width="24" verticalAlignment="center" />
            {/if}
            <!-- Logo in the center -->
            {#if logoImage}
                <image col={1} height="30" horizontalAlignment="center" marginLeft={iconImage ? 4 : 0} src={path.join(pkpass.imagesPath, logoImage)} stretch="aspectFit" />
            {/if}
        </gridlayout>

        <!-- Organization name and primary value -->
        <stacklayout row={2}>
            <label
                color={foregroundColor}
                fontSize={14}
                fontWeight="bold"
                maxLines={2}
                text={passData.organizationName || passData.logoText || item.doc.name}
                textAlignment="center"
                textWrap={true} />

            <!-- Primary value -->
            {#if getPrimaryValue()}
                <label color={foregroundColor} fontSize="20" fontWeight="bold" marginTop="4" text={getPrimaryValue()} textAlignment="center" />
            {/if}
        </stacklayout>
    </gridlayout>
{:else}
    <!-- Fallback if PKPass not loaded yet -->
    <gridlayout backgroundColor={colorOnPrimary} borderRadius="12" padding="16">
        <label color="#ffffff" fontSize="16" fontWeight="bold" text={item.doc.name} textAlignment="center" textWrap={true} />
    </gridlayout>
{/if}
