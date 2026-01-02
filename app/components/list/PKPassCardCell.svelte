<script lang="ts">
    import { Color } from '@nativescript/core';
    import { PKPass } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { Item } from './MainList.svelte';
    
    export let item: Item;
    export let pkpass: PKPass | null;
    export let itemWidth: number;
    export let layout: string;
    
    let { colorOnPrimary } = $colors;
    $: ({ colorOnPrimary } = $colors);
    
    const passData = pkpass?.passData;
    
    // Get background color from pass or use default
    function getBackgroundColor(): string {
        if (!passData?.backgroundColor) {
            return colorOnPrimary;
        }
        
        // Parse rgb(r, g, b) format
        const rgbMatch = passData.backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            return new Color(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])).hex;
        }
        
        return passData.backgroundColor;
    }
    
    function getForegroundColor(): string {
        if (!passData?.foregroundColor) {
            return '#ffffff';
        }
        
        const rgbMatch = passData.foregroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            return new Color(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])).hex;
        }
        
        return passData.foregroundColor;
    }
    
    // Get primary field value
    function getPrimaryValue(): string {
        const structure = pkpass?.getPassStructure();
        if (structure?.primaryFields && structure.primaryFields.length > 0) {
            const field = structure.primaryFields[0];
            return typeof field.value === 'string' ? field.value : String(field.value);
        }
        return '';
    }
    
    function getLogoImage(): string | undefined {
        return pkpass?.images?.logo2x || pkpass?.images?.logo;
    }
</script>

{#if pkpass}
    <gridlayout backgroundColor={getBackgroundColor()} borderRadius="12" padding="12">
        <!-- Logo or strip image at top -->
        {#if getLogoImage()}
            <image 
                src={getLogoImage()} 
                row={0}
                height="40"
                stretch="aspectFit"
                horizontalAlignment="center"
                marginBottom="8" />
        {/if}
        
        <!-- Organization name -->
        <label 
            text={passData.organizationName || passData.logoText || item.doc.name}
            color={getForegroundColor()}
            fontSize="16"
            fontWeight="bold"
            textAlignment="center"
            textWrap={true}
            maxLines="2"
            marginTop={getLogoImage() ? 48 : 0} />
        
        <!-- Primary value -->
        {#if getPrimaryValue()}
            <label 
                text={getPrimaryValue()}
                color={getForegroundColor()}
                fontSize="24"
                fontWeight="bold"
                textAlignment="center"
                marginTop={getLogoImage() ? 80 : 32} />
        {/if}
    </gridlayout>
{:else}
    <!-- Fallback if PKPass not loaded yet -->
    <gridlayout backgroundColor={colorOnPrimary} borderRadius="12" padding="16">
        <label 
            text={item.doc.name}
            color="#ffffff"
            fontSize="16"
            fontWeight="bold"
            textAlignment="center"
            textWrap={true} />
    </gridlayout>
{/if}
