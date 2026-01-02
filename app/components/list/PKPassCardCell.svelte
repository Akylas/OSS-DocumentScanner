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
    <gridlayout {backgroundColor} borderRadius="12" padding="12">
        <!-- Logo or strip image at top -->
        {#if logoImage}
            <image height="40" horizontalAlignment="center" marginBottom="8" row={0} src={path.join(pkpass.imagesPath, logoImage)} stretch="aspectFit" />
        {/if}

        <!-- Organization name -->
        <label
            color={foregroundColor}
            fontSize={16}
            fontWeight="bold"
            marginTop={logoImage ? 48 : 0}
            maxLines={2}
            text={passData.organizationName || passData.logoText || item.doc.name}
            textAlignment="center"
            textWrap={true} />

        <!-- Primary value -->
        {#if getPrimaryValue()}
            <label color={foregroundColor} fontSize="24" fontWeight="bold" marginTop={logoImage ? 80 : 32} text={getPrimaryValue()} textAlignment="center" />
        {/if}
    </gridlayout>
{:else}
    <!-- Fallback if PKPass not loaded yet -->
    <gridlayout backgroundColor={colorOnPrimary} borderRadius="12" padding="16">
        <label color="#ffffff" fontSize="16" fontWeight="bold" text={item.doc.name} textAlignment="center" textWrap={true} />
    </gridlayout>
{/if}
