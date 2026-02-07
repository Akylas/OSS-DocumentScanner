<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKPass, PKPassStyle, PKPassTransitType } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { Item } from '../list/MainList.svelte';
    import { lang } from '~/helpers/locale';
    import { getFieldTextAlignment, getTransitIcon } from '~/utils/pkpass';

    export let item: Item = null;
    export let pkpass: PKPass;
    export let itemWidth: number;

    let { colorOnBackground, colorOnPrimary, colorSurface } = $colors;
    $: ({ colorOnBackground, colorOnPrimary, colorSurface } = $colors);

    $: passData = pkpass?.passData;
    $: foregroundColor = passData?.foregroundColor || colorOnBackground;
    $: labelColor = passData.labelColor || colorOnBackground;
    $: backgroundColor = passData?.backgroundColor || colorSurface;
    // Apple PKPass image specifications - prefer @2x for quality
    const logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo; // Max 160x50 points
    const iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon; // 29x29 points
    const thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail; // 90x90 points
    const stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip; // Variable dimensions

    // Get the pass structure and style
    const passStyle = pkpass?.getPassStyle();

    // Calculate scale factor based on card width (credit card aspect ratio ~1.586:1)
    const scaleFactor = itemWidth / 320; // Base width 320px

    // Get formatted field value
    function getFieldValue(field: any): string {
        return pkpass.formatFieldValue(field, lang);
    }

    // Get formatted field label
    function getFieldLabel(field: any): string {
        if (!field) return null;
        const label = field.label || field.key;
        return pkpass.getLocalizedValue(label, lang).toUpperCase() + '\n';
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
<gridlayout {backgroundColor} borderRadius={12} {...$$restProps}>
    <!-- Strip or thumbnail banner at top if available -->
    <image colSpan={3} height={60 * scaleFactor} row={0} src={stripImage || thumbnailImage} stretch="aspectFill" visibility={stripImage || thumbnailImage ? 'visible' : 'collapse'} />

    <!-- Content container with proper padding -->
    <gridlayout padding={12 * scaleFactor} rows="auto,*,auto,auto">
        <!-- Top row: Logo/Icon + Name (limited width) + Important right-side data -->
        <gridlayout columns="auto,*,auto" marginBottom={5 * scaleFactor} row={0}>
            <!-- Left: Logo (max 80px scaled) or Icon (20px scaled) + Name -->
            <stacklayout col={0} orientation="horizontal" verticalAlignment="center">
                <!-- Logo takes priority (Apple spec: max 160x50, scaled to 80px width max for card) -->
                <!-- Icon (Apple spec: 29x29, scaled to ~20px for card) + Name -->
                <image
                    height={(logoImage ? 40 : 20) * scaleFactor}
                    marginRight={(logoImage ? 8 : 6) * scaleFactor}
                    src={logoImage || iconImage}
                    stretch="aspectFit"
                    verticalAlignment="center"
                    visibility={logoImage || iconImage ? 'visible' : 'collapse'}
                    width={(logoImage ? 80 : 20) * scaleFactor} />
                <label
                    color={foregroundColor}
                    fontSize={14 * scaleFactor}
                    fontWeight="bold"
                    maxLines={1}
                    text={orgName}
                    verticalAlignment="center"
                    visibility={!logoImage ? 'visible' : 'collapse'}
                    width={120 * scaleFactor} />
            </stacklayout>

            <!-- Right: Important data (header fields like gate, seat, date) -->
            <gridlayout col={2} columns={Array.from('*'.repeat(headerFieldsCount)).join(',')} marginBottom={10 * scaleFactor} visibility={headerFieldsCount > 0 ? 'visible' : 'collapsed'}>
                {#each { length: 4 } as _, index (index)}
                    {@const field = structure.headerFields[index]}

                    <label col={index} paddingLeft={index !== 0 ? 12 * scaleFactor : 0} textAlignment={getFieldTextAlignment(field, 'right')} visibility={field ? 'visible' : 'collapsed'}>
                        <cspan color={labelColor} fontSize={10 * scaleFactor} fontWeight="500" lineHeight={50} text={getFieldLabel(field)} visibility={field?.label ? 'visible' : 'hidden'} />
                        <cspan color={foregroundColor} fontSize={13 * scaleFactor} fontWeight="bold" text={getFieldValue(field)} />
                    </label>
                {/each}
            </gridlayout>
        </gridlayout>

        <!-- Middle row: Primary fields + Transit icon (for boarding passes) -->
        <gridlayout colSpan={3} columns={transitIcon && primaryFieldsCount === 2 ? '*,auto,*' : '*'} row={1} verticalAlignment="center">
            {#if transitIcon && primaryFieldsCount === 2}
                <!-- Departure -->
                <label col={0} horizontalAlignment="left" verticalAlignment="center">
                    <cspan color={labelColor} fontSize={10 * scaleFactor} lineHeight={50} text={getFieldLabel(primaryFields[0])} />
                    <cspan color={foregroundColor} fontSize={28 * scaleFactor} fontWeight="bold" text={getFieldValue(primaryFields[0])} />
                </label>

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
                <label col={2} horizontalAlignment="right" textAlignment="right" verticalAlignment="center">
                    <cspan color={labelColor} fontSize={10 * scaleFactor} lineHeight={50} text={getFieldLabel(primaryFields[1])} />
                    <cspan color={foregroundColor} fontSize={28 * scaleFactor} fontWeight="bold" text={getFieldValue(primaryFields[1])} />
                </label>
            {:else if primaryFieldsCount > 0}
                <!-- Standard layout for primary fields -->
                <gridlayout columns={Array.from('*'.repeat(primaryFieldsCount)).join(',')}>
                    {#each { length: 4 } as _, index (index)}
                        {@const field = primaryFields[index]}
                        <label marginTop={index > 0 ? 4 * scaleFactor : 0} padding={index !== 0 && index !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                            <cspan color={labelColor} fontSize={10 * scaleFactor} lineHeight={50} text={getFieldLabel(field)} visibility={field?.label ? 'visible' : 'hidden'} />
                            <cspan color={foregroundColor} fontSize={24 * scaleFactor} fontWeight="bold" text={getFieldValue(field)} />
                        </label>
                    {/each}
                </gridlayout>
            {/if}
        </gridlayout>

        <!-- Bottom row: Secondary and auxiliary fields -->
        <!-- Left: Secondary fields -->
        <gridlayout colSpan={3} columns={Array.from('*'.repeat(secondaryFieldsCount)).join(',')} row={2} visibility={secondaryFieldsCount > 0 ? 'visible' : 'collapsed'}>
            {#each { length: 4 } as _, index (index)}
                {@const field = secondaryFields[index]}
                <label col={index} padding={index !== 0 && index !== secondaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                    <cspan color={labelColor} fontSize={9 * scaleFactor} lineHeight={50} text={getFieldLabel(field)} />
                    <cspan color={foregroundColor} fontSize={11 * scaleFactor} fontWeight="600" text={getFieldValue(field)} />
                </label>
            {/each}
        </gridlayout>

        <!-- Left: Auxiliary fields -->
        <gridlayout colSpan={3} columns={Array.from('*'.repeat(auxiliaryFieldsCount)).join(',')} row={3} visibility={auxiliaryFieldsCount > 0 ? 'visible' : 'collapsed'}>
            {#each { length: 4 } as _, index (index)}
                {@const field = auxiliaryFields[index]}
                <label col={index} padding={index !== 0 && index !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                    <cspan color={labelColor} fontSize={9 * scaleFactor} lineHeight={50} text={getFieldLabel(field)} />
                    <cspan color={foregroundColor} fontSize={11 * scaleFactor} fontWeight="600" text={getFieldValue(field)} />
                </label>
            {/each}
        </gridlayout>

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
