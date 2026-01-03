<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKPass } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { Item } from './MainList.svelte';
    import { lang } from '~/helpers/locale';

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

    // Get the pass structure
    $: structure = pkpass?.getPassStructure();

    // Get primary field value (most important info - shown at top for stacking)
    function getPrimaryValue(): string {
        if (structure?.primaryFields && structure.primaryFields.length > 0) {
            const field = structure.primaryFields[0];
            const value = typeof field.value === 'string' ? field.value : String(field.value);
            return pkpass.getLocalizedValue(value, lang);
        }
        return '';
    }

    // Get secondary info (shown below primary for stacking)
    function getSecondaryInfo(): string {
        if (structure?.secondaryFields && structure.secondaryFields.length > 0) {
            const parts = structure.secondaryFields.map((field) => {
                const value = typeof field.value === 'string' ? field.value : String(field.value);
                return pkpass.getLocalizedValue(value, lang);
            });
            return parts.join(' • ');
        }
        return '';
    }

    // Get header field value (often shows important context like gate number or seat)
    function getHeaderInfo(): string {
        if (structure?.headerFields && structure.headerFields.length > 0) {
            const parts = structure.headerFields.map((field) => {
                const value = typeof field.value === 'string' ? field.value : String(field.value);
                return pkpass.getLocalizedValue(value, lang);
            });
            return parts.join(' • ');
        }
        return '';
    }

    function getLocalizedText(text: string): string {
        return text ? pkpass.getLocalizedValue(text, lang) : text;
    }
</script>

{#if pkpass}
    <gridlayout {backgroundColor} borderRadius="12" padding="12" rows="auto,auto,auto,auto,auto">
        <!-- Strip or thumbnail image at top if available -->
        {#if stripImage}
            <image borderRadius="8 8 0 0" height="60" horizontalAlignment="stretch" marginBottom="8" row={0} src={stripImage} stretch="aspectFill" />
        {:else if thumbnailImage}
            <image height="60" horizontalAlignment="center" marginBottom="8" row={0} src={thumbnailImage} stretch="aspectFit" />
        {/if}

        <!-- Organization name with logo/icon - MOST VISIBLE for stacking -->
        <gridlayout columns="auto,*" marginBottom="8" row={1}>
            {#if iconImage}
                <image col={0} height="24" marginRight="8" src={iconImage} stretch="aspectFit" verticalAlignment="center" width="24" />
            {/if}
            <label col={1} color={foregroundColor} fontSize={16} fontWeight="bold" maxLines={1} text={passData.organizationName || getLocalizedText(passData.logoText) || item.doc.name} verticalAlignment="center" />
        </gridlayout>

        <!-- Primary value - LARGE and PROMINENT for stacking -->
        {#if getPrimaryValue()}
            <label color={foregroundColor} fontSize="24" fontWeight="bold" marginBottom="4" maxLines={1} row={2} text={getPrimaryValue()} textWrap={false} />
        {/if}

        <!-- Header info (gate, seat, etc.) - Important context visible when stacked -->
        {#if getHeaderInfo()}
            <label color={foregroundColor} fontSize="14" fontWeight="600" marginBottom="4" opacity="0.9" row={3} text={getHeaderInfo()} />
        {/if}

        <!-- Secondary info - Additional details visible when partially stacked -->
        {#if getSecondaryInfo()}
            <label color={foregroundColor} fontSize="12" opacity="0.7" row={4} text={getSecondaryInfo()} />
        {/if}
    </gridlayout>
{:else}
    <!-- Fallback if PKPass not loaded yet -->
    <gridlayout backgroundColor={colorOnPrimary} borderRadius="12" padding="16">
        <label color="#ffffff" fontSize="16" fontWeight="bold" text={item.doc.name} textAlignment="center" textWrap={true} />
    </gridlayout>
{/if}
