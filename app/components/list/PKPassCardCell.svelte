<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKPass, PKPassStyle, PKPassTransitType } from '~/models/PKPass';
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
    $: foregroundColor = passData?.foregroundColor || colorOnBackground;
    $: backgroundColor = passData?.backgroundColor || colorSurface;
    $: logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo;
    $: iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon;
    $: thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail;
    $: stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip;

    // Get the pass structure and style
    $: structure = pkpass?.getPassStructure();
    $: passStyle = pkpass?.getPassStyle();

    // Calculate scale factor based on card width (credit card aspect ratio ~1.586:1)
    $: cardHeight = itemWidth / 1.586;
    $: scaleFactor = itemWidth / 320; // Base width 320px

    // Transit icon for boarding passes
    function getTransitIcon(): string {
        if (passStyle !== PKPassStyle.BoardingPass || !structure?.transitType) {
            return '';
        }
        
        const iconMap = {
            [PKPassTransitType.Air]: 'mdi-airplane',
            [PKPassTransitType.Boat]: 'mdi-ferry',
            [PKPassTransitType.Bus]: 'mdi-bus',
            [PKPassTransitType.Train]: 'mdi-train',
            [PKPassTransitType.Generic]: 'mdi-transit-connection-variant'
        };
        
        return iconMap[structure.transitType] || '';
    }

    // Get formatted field value
    function getFieldValue(field: any): string {
        if (!field) return '';
        const value = typeof field.value === 'string' ? field.value : String(field.value);
        return pkpass.getLocalizedValue(value, lang);
    }

    // Get formatted field label
    function getFieldLabel(field: any): string {
        if (!field) return '';
        const label = field.label || field.key;
        return pkpass.getLocalizedValue(label, lang);
    }

    function getLocalizedText(text: string): string {
        return text ? pkpass.getLocalizedValue(text, lang) : text;
    }

    // Get primary fields for display
    $: primaryFields = structure?.primaryFields || [];
    $: headerFields = structure?.headerFields || [];
    $: secondaryFields = structure?.secondaryFields || [];
    $: auxiliaryFields = structure?.auxiliaryFields || [];
    
    // Get organization name
    $: orgName = passData?.organizationName || getLocalizedText(passData?.logoText) || item?.doc?.name || '';
    
    // Transit icon
    $: transitIcon = getTransitIcon();
</script>

{#if pkpass}
    <!-- Credit card sized layout with scalable content -->
    <gridlayout {backgroundColor} borderRadius={12 * scaleFactor} height={cardHeight} width={itemWidth}>
        <!-- Content container with proper padding -->
        <gridlayout padding={12 * scaleFactor} rows="auto,*,auto">
            <!-- Top row: Logo/Icon + Name (limited width) + Important right-side data -->
            <gridlayout columns="auto,*,auto" row={0}>
                <!-- Left: Logo or Icon + Name -->
                <stacklayout col={0} orientation="horizontal" verticalAlignment="center">
                    {#if logoImage}
                        <!-- Logo takes priority -->
                        <image height={24 * scaleFactor} marginRight={8 * scaleFactor} src={logoImage} stretch="aspectFit" verticalAlignment="center" width={80 * scaleFactor} />
                    {:else if iconImage}
                        <!-- Icon + Name -->
                        <image height={20 * scaleFactor} marginRight={6 * scaleFactor} src={iconImage} stretch="aspectFit" verticalAlignment="center" width={20 * scaleFactor} />
                        <label 
                            color={foregroundColor} 
                            fontSize={12 * scaleFactor} 
                            fontWeight="bold" 
                            maxLines={1} 
                            text={orgName}
                            textWrap={false}
                            verticalAlignment="center"
                            maxWidth={120 * scaleFactor} />
                    {:else}
                        <!-- Just name -->
                        <label 
                            color={foregroundColor} 
                            fontSize={12 * scaleFactor} 
                            fontWeight="bold" 
                            maxLines={1} 
                            text={orgName}
                            textWrap={false}
                            verticalAlignment="center"
                            maxWidth={120 * scaleFactor} />
                    {/if}
                </stacklayout>

                <!-- Right: Important data (header fields like gate, seat, date) -->
                {#if headerFields.length > 0}
                    <stacklayout col={2} horizontalAlignment="right" orientation="horizontal" verticalAlignment="center">
                        {#each headerFields as field, idx}
                            <stacklayout marginLeft={idx > 0 ? 8 * scaleFactor : 0} verticalAlignment="center">
                                <label 
                                    color={foregroundColor} 
                                    fontSize={9 * scaleFactor} 
                                    opacity="0.7" 
                                    text={getFieldLabel(field)}
                                    textAlignment="right" />
                                <label 
                                    color={foregroundColor} 
                                    fontSize={12 * scaleFactor} 
                                    fontWeight="bold" 
                                    text={getFieldValue(field)}
                                    textAlignment="right" />
                            </stacklayout>
                        {/each}
                    </stacklayout>
                {/if}
            </gridlayout>

            <!-- Middle row: Primary fields + Transit icon (for boarding passes) -->
            <gridlayout col={0} columns={transitIcon && primaryFields.length === 2 ? 'auto,auto,auto' : '*'} row={1} verticalAlignment="center">
                {#if transitIcon && primaryFields.length === 2}
                    <!-- Departure -->
                    <stacklayout col={0} horizontalAlignment="left" verticalAlignment="center">
                        <label 
                            color={foregroundColor} 
                            fontSize={10 * scaleFactor} 
                            opacity="0.7" 
                            text={getFieldLabel(primaryFields[0])} />
                        <label 
                            color={foregroundColor} 
                            fontSize={28 * scaleFactor} 
                            fontWeight="bold" 
                            text={getFieldValue(primaryFields[0])} />
                    </stacklayout>

                    <!-- Transit Icon -->
                    <label 
                        class="mdi" 
                        col={1} 
                        color={foregroundColor} 
                        fontSize={32 * scaleFactor} 
                        horizontalAlignment="center" 
                        marginLeft={16 * scaleFactor}
                        marginRight={16 * scaleFactor}
                        text={transitIcon}
                        verticalAlignment="center" />

                    <!-- Arrival -->
                    <stacklayout col={2} horizontalAlignment="right" verticalAlignment="center">
                        <label 
                            color={foregroundColor} 
                            fontSize={10 * scaleFactor} 
                            opacity="0.7" 
                            text={getFieldLabel(primaryFields[1])}
                            textAlignment="right" />
                        <label 
                            color={foregroundColor} 
                            fontSize={28 * scaleFactor} 
                            fontWeight="bold" 
                            text={getFieldValue(primaryFields[1])}
                            textAlignment="right" />
                    </stacklayout>
                {:else if primaryFields.length > 0}
                    <!-- Standard layout for primary fields -->
                    <stacklayout col={0} verticalAlignment="center">
                        {#each primaryFields as field, idx}
                            <stacklayout marginTop={idx > 0 ? 4 * scaleFactor : 0}>
                                {#if field.label}
                                    <label 
                                        color={foregroundColor} 
                                        fontSize={10 * scaleFactor} 
                                        opacity="0.7" 
                                        text={getFieldLabel(field)} />
                                {/if}
                                <label 
                                    color={foregroundColor} 
                                    fontSize={24 * scaleFactor} 
                                    fontWeight="bold" 
                                    maxLines={1}
                                    text={getFieldValue(field)}
                                    textWrap={false} />
                            </stacklayout>
                        {/each}
                    </stacklayout>
                {/if}
            </gridlayout>

            <!-- Bottom row: Secondary and auxiliary fields -->
            <gridlayout col={0} columns="*,auto" row={2}>
                <!-- Left: Secondary fields -->
                {#if secondaryFields.length > 0}
                    <stacklayout col={0} orientation="horizontal">
                        {#each secondaryFields as field, idx}
                            <stacklayout marginRight={idx < secondaryFields.length - 1 ? 12 * scaleFactor : 0}>
                                <label 
                                    color={foregroundColor} 
                                    fontSize={9 * scaleFactor} 
                                    opacity="0.7" 
                                    text={getFieldLabel(field)} />
                                <label 
                                    color={foregroundColor} 
                                    fontSize={11 * scaleFactor} 
                                    fontWeight="600" 
                                    text={getFieldValue(field)} />
                            </stacklayout>
                        {/each}
                    </stacklayout>
                {/if}

                <!-- Right: Auxiliary fields -->
                {#if auxiliaryFields.length > 0}
                    <stacklayout col={1} horizontalAlignment="right" orientation="horizontal">
                        {#each auxiliaryFields as field, idx}
                            <stacklayout marginLeft={idx > 0 ? 8 * scaleFactor : 0}>
                                <label 
                                    color={foregroundColor} 
                                    fontSize={9 * scaleFactor} 
                                    opacity="0.7" 
                                    text={getFieldLabel(field)}
                                    textAlignment="right" />
                                <label 
                                    color={foregroundColor} 
                                    fontSize={11 * scaleFactor} 
                                    fontWeight="600" 
                                    text={getFieldValue(field)}
                                    textAlignment="right" />
                            </stacklayout>
                        {/each}
                    </stacklayout>
                {/if}
            </gridlayout>
        </gridlayout>
    </gridlayout>
{:else}
    <!-- Fallback if PKPass not loaded yet -->
    <gridlayout backgroundColor={colorOnPrimary} borderRadius="12" height={cardHeight} padding="16" width={itemWidth}>
        <label color="#ffffff" fontSize="16" fontWeight="bold" text={item?.doc?.name || ''} textAlignment="center" textWrap={true} />
    </gridlayout}
{/if}
