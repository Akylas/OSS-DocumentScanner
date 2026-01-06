<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKPass, PKPassStyle, PKPassTransitType } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { Item } from './MainList.svelte';
    import { lang } from '~/helpers/locale';
    import { getFieldTextAlignment, getTransitIcon } from '~/utils/pkpass';

    export let item: Item;
    export let pkpass: PKPass;
    export let itemWidth: number;
    export let layout: string;

    let { colorOnBackground, colorOnPrimary, colorSurface } = $colors;
    $: ({ colorOnBackground, colorOnPrimary, colorSurface } = $colors);

    $: passData = pkpass?.passData;
    $: foregroundColor = passData?.foregroundColor || colorOnBackground;
    $: labelColor = passData.labelColor || colorOnBackground;
    $: backgroundColor = passData?.backgroundColor || colorSurface;
    $: logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo;
    $: iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon;
    $: thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail;
    $: stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip;

    // Get the pass structure and style
    $: passStyle = pkpass?.getPassStyle();

    // Calculate scale factor based on card width (credit card aspect ratio ~1.586:1)
    $: scaleFactor = itemWidth / 320; // Base width 320px

    // Get formatted field value
    function getFieldValue(field: any): string {
        return pkpass.formatFieldValue(field, lang);
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
    const structure = pkpass.getPassStructure();
    const primaryFields = structure?.primaryFields || [];
    const headerFields = structure?.headerFields || [];
    const secondaryFields = structure?.secondaryFields || [];
    const auxiliaryFields = structure?.auxiliaryFields || [];
    const secondaryFieldsCount = secondaryFields.length;
    const primaryFieldsCount = primaryFields.length;
    const headerFieldsCount = headerFields.length;
    const auxiliaryFieldsCount = auxiliaryFields.length;
    const transitType = structure?.transitType;
    const transitIcon = getTransitIcon(transitType);

    // Get organization name
    $: orgName = passData?.organizationName || getLocalizedText(passData?.logoText) || item?.doc?.name || '';

    // Transit icon
</script>

<!-- Credit card sized layout with scalable content -->
<gridlayout {backgroundColor} {...$$restProps}>
    <!-- Content container with proper padding -->
    <gridlayout padding={12 * scaleFactor} rows="auto,*,auto,auto">
        <!-- Top row: Logo/Icon + Name (limited width) + Important right-side data -->
        <gridlayout columns="auto,*,auto" marginBottom={5 * scaleFactor} row={0}>
            <!-- Left: Logo or Icon + Name -->
            <stacklayout col={0} orientation="horizontal" verticalAlignment="center">
                {#if logoImage}
                    <!-- Logo takes priority -->
                    <image height={40 * scaleFactor} marginRight={8 * scaleFactor} src={logoImage} stretch="aspectFit" verticalAlignment="center"/>
                {:else if iconImage}
                    <!-- Icon + Name -->
                    <image height={26 * scaleFactor} marginRight={6 * scaleFactor} src={iconImage} stretch="aspectFit" verticalAlignment="center" width={26 * scaleFactor} />
                    <label color={foregroundColor} fontSize={14 * scaleFactor} fontWeight="bold" maxLines={1} text={orgName} verticalAlignment="center" width={120 * scaleFactor} />
                {:else}
                    <!-- Just name -->
                    <label color={foregroundColor} fontSize={14 * scaleFactor} fontWeight="bold" maxLines={1} text={orgName} verticalAlignment="center" width={120 * scaleFactor} />
                {/if}
            </stacklayout>

            <!-- Right: Important data (header fields like gate, seat, date) -->
            {#if headerFieldsCount > 0}
                <gridlayout class="pass-section" col={2} columns={Array.from('*'.repeat(headerFieldsCount)).join(',')} marginBottom={10* scaleFactor}>
                    {#each structure.headerFields as field, index}
                        {@const textAlignment = getFieldTextAlignment(field, 'right')}
                        <stacklayout class="pass-field" col={index} paddingLeft={index !== 0 ? 12 * scaleFactor : 0}>
                            {#if field.label}
                                <label color={labelColor} fontSize={10 * scaleFactor} fontWeight="500" text={getFieldLabel(field)} {textAlignment} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={13 * scaleFactor} fontWeight="bold" text={getFieldValue(field)} {textAlignment} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}
        </gridlayout>

        <!-- Middle row: Primary fields + Transit icon (for boarding passes) -->
        <gridlayout colSpan={3} columns={transitIcon && primaryFieldsCount === 2 ? '*,auto,*' : '*'} row={1} verticalAlignment="center">
            {#if transitIcon && primaryFieldsCount === 2}
                <!-- Departure -->
                <stacklayout col={0} horizontalAlignment="left" verticalAlignment="center">
                    <label color={labelColor} fontSize={10 * scaleFactor} text={getFieldLabel(primaryFields[0])} textTransform="uppercase" />
                    <label color={foregroundColor} fontSize={28 * scaleFactor} fontWeight="bold" text={getFieldValue(primaryFields[0])} />
                </stacklayout>

                <!-- Transit Icon -->
                <label
                    class="mdi"
                    col={1}
                    color={labelColor}
                    fontSize={32 * scaleFactor}
                    horizontalAlignment="center"
                    marginLeft={16 * scaleFactor}
                    marginRight={16 * scaleFactor}
                    text={transitIcon}
                    verticalAlignment="center" />

                <!-- Arrival -->
                <stacklayout col={2} horizontalAlignment="right" verticalAlignment="center">
                    <label color={labelColor} fontSize={10 * scaleFactor} text={getFieldLabel(primaryFields[1])} textAlignment="right" textTransform="uppercase" />
                    <label color={foregroundColor} fontSize={28 * scaleFactor} fontWeight="bold" text={getFieldValue(primaryFields[1])} textAlignment="right" />
                </stacklayout>
            {:else if primaryFieldsCount > 0}
                <!-- Standard layout for primary fields -->
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(primaryFieldsCount)).join(',')}>
                    {#each primaryFields as field, idx}
                        <stacklayout marginTop={idx > 0 ? 4 * scaleFactor : 0} padding={idx !== 0 && idx !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                            {#if field.label}
                                <label color={labelColor} fontSize={10 * scaleFactor} text={getFieldLabel(field)} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={24 * scaleFactor} fontWeight="bold" maxLines={1} text={getFieldValue(field)} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}
        </gridlayout>

        <!-- Bottom row: Secondary and auxiliary fields -->
        <!-- Left: Secondary fields -->
        {#if secondaryFieldsCount > 0}
            <gridlayout class="pass-section" colSpan={3} columns={Array.from('*'.repeat(secondaryFieldsCount)).join(',')} row={2}>
                {#each secondaryFields as field, index}
                    <stacklayout col={index} padding={index !== 0 && index !== secondaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                        <label color={labelColor} fontSize={9 * scaleFactor} text={getFieldLabel(field)} textTransform="uppercase" />
                        <label color={foregroundColor} fontSize={11 * scaleFactor} fontWeight="600" text={getFieldValue(field)} />
                    </stacklayout>
                {/each}
            </gridlayout>
        {/if}

        <!-- Left: Auxiliary fields -->
        {#if auxiliaryFieldsCount > 0}
            <gridlayout class="pass-section" colSpan={3} columns={Array.from('*'.repeat(auxiliaryFieldsCount)).join(',')} row={3}>
                {#each auxiliaryFields as field, index}
                    <stacklayout col={index} padding={index !== 0 && index !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                        <label color={labelColor} fontSize={9 * scaleFactor} text={getFieldLabel(field)} textTransform="uppercase" />
                        <label color={foregroundColor} fontSize={11 * scaleFactor} fontWeight="600" text={getFieldValue(field)} />
                    </stacklayout>
                {/each}
            </gridlayout>
        {/if}

        <!-- Right: Auxiliary fields -->
        <!-- {#if auxiliaryFieldsCount > 0}
                <stacklayout col={1} horizontalAlignment="right" orientation="horizontal">
                    {#each auxiliaryFields as field, idx}
                        <stacklayout marginLeft={idx > 0 ? 8 * scaleFactor : 0}>
                            <label color={labelColor} fontSize={9 * scaleFactor} text={getFieldLabel(field)} textAlignment="right" />
                            <label color={foregroundColor} fontSize={11 * scaleFactor} fontWeight="600" text={getFieldValue(field)} textAlignment="right" />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if} -->
    </gridlayout>
</gridlayout>
