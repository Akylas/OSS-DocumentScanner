<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKBarcodeFormat, PKPass, PKPassBarcode, PKPassField, PKPassStructure, PKPassTransitType } from '~/models/PKPass';
    import { colors, windowInset } from '~/variables';
    import { qrcodeService } from '~/services/qrcode';
    import { getBarcodeSVG, getFieldTextAlignment, getTransitIcon } from '~/utils/pkpass';
    import { lang } from '~/helpers/locale';
    import { isEInk } from '@shared/helpers/theme';

    export let pkpass: PKPass;

    let { colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors;
    $: ({ colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors);

    const passData = pkpass.passData;
    const structure = pkpass.getPassStructure();
    const primaryBarcode = pkpass.getPrimaryBarcode();
    const transitType = structure?.transitType;
    const transitIcon = getTransitIcon(transitType);
    const headerFieldsCount = structure?.headerFields?.length ?? 0;
    const secondaryFieldsCount = structure?.secondaryFields?.length ?? 0;
    const primaryFieldsCount = structure?.primaryFields.length ?? 0;
    const auxiliaryFieldsCount = structure?.auxiliaryFields.length ?? 0;

    $: foregroundColor = passData.foregroundColor || colorOnBackground;
    $: backgroundColor = passData.backgroundColor || colorSurface;
    $: labelColor = passData.labelColor || colorOnBackground;
    // Apple PKPass image specifications - prefer @2x for quality
    $: logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo; // Max 160x50 points
    $: iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon; // 29x29 points
    $: stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip; // Variable by device/type
    $: backgroundImage = pkpass?.images?.background2x || pkpass?.images?.background; // 180x220 points
    $: thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail; // 90x90 points
    $: footerImage = pkpass?.images?.footer2x || pkpass?.images?.footer; // 286x15 points
    const orgName = passData?.organizationName || getLocalizedText(passData?.logoText) || '';

    let barcodeSvg: string | undefined;
    $: if (primaryBarcode && foregroundColor) {
        getBarcodeSVG({ barcode: primaryBarcode, foregroundColor }).then((svg) => (barcodeSvg = svg));
    }

    function renderFieldValue(field: PKPassField): string {
        const value = pkpass.formatFieldValue(field, lang);
        return value;
    }

    function renderFieldLabel(field: PKPassField): string {
        return field.label ? pkpass.getLocalizedValue(field.label, lang) : '';
    }

    function getLocalizedText(text: string): string {
        return text ? pkpass.getLocalizedValue(text, lang) : text;
    }
</script>

<gridlayout {backgroundColor} borderRadius={8} elevation={isEInk ? 0 : 2} margin={16} marginBottom={$windowInset.bottom + 16} rows="auto,auto,*,auto">
    <!-- Background image if available (180x220 points per Apple spec) -->
    {#if backgroundImage}
        <image colSpan={4} height="220" rowSpan={4} src={backgroundImage} stretch="aspectFill" opacity="0.3" />
    {/if}

    <!-- Header section with icon, logo, and thumbnail -->
    <stacklayout padding="16" row={0}>
        <gridlayout columns="auto,*,auto,auto" verticalAlignment="center">
            <!-- Icon on the left (29x29 points per Apple spec) -->
            <!-- {#if iconImage}
                <image col={0} height={29} marginRight={6} src={iconImage} stretch="aspectFit" verticalAlignment="center" width={29} />
            {/if} -->

            <!-- Logo (max 160x50 points per Apple spec) -->
            {#if logoImage}
                <image col={0} height={50} marginRight={8} src={logoImage} stretch="aspectFit" verticalAlignment="center" />
            {:else if !iconImage}
                <!-- Just name if no icon or logo -->
                <label col={0} color={foregroundColor} fontSize={14} fontWeight="bold" maxLines={1} text={orgName} verticalAlignment="center" />
            {:else}
                <!-- Name next to icon -->
                <label col={0} color={foregroundColor} fontSize={14} fontWeight="bold" maxLines={1} text={orgName} verticalAlignment="center" width={120} />
            {/if}

            <!-- Thumbnail on the right (90x90 points per Apple spec) -->
            {#if thumbnailImage}
                <image col={3} height={90} src={thumbnailImage} stretch="aspectFit" width={90} />
            {/if}

            <!-- Header fields -->
            {#if headerFieldsCount > 0}
                <gridlayout class="pass-section" col={2} columns={Array.from('*'.repeat(headerFieldsCount)).join(',')} marginBottom={16}>
                    {#each structure.headerFields as field, index}
                        {@const textAlignment = getFieldTextAlignment(field, 'right')}
                        <stacklayout class="pass-field" col={index} paddingLeft={index !== 0 ? 10 : 0}>
                            {#if field.label}
                                <label color={labelColor} fontSize={13} fontWeight="500" text={renderFieldLabel(field)} {textAlignment} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={17} fontWeight="bold" text={renderFieldValue(field)} {textAlignment} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}
        </gridlayout>

        <label
            color={labelColor}
            fontSize="14"
            marginTop="4"
            text={passData.organizationName}
            textAlignment="center"
            visibility={passData.logoText !== passData.organizationName ? 'visible' : 'collapsed'} />
    </stacklayout>

    <!-- Strip image behind primary fields (variable dimensions per Apple spec) -->
    {#if stripImage}
        <image height="150" row={1} src={stripImage} stretch="aspectFill" />
    {/if}

    <!-- Main content -->
    <scrollview row={2}>
        <stacklayout padding={16}>
            <!-- Primary fields -->
            {#if primaryFieldsCount > 0}
                {#if transitIcon && primaryFieldsCount === 2}
                    <!-- Boarding pass with transit icon between two primary fields -->
                    <gridlayout class="pass-section" columns="*,auto,*" marginBottom={16}>
                        <!-- Left primary field (departure) -->
                        <stacklayout class="pass-field primary-field" col={0}>
                            {#if structure.primaryFields[0].label}
                                <label color={labelColor} fontSize={12} fontWeight="500" text={renderFieldLabel(structure.primaryFields[0])} textAlignment="left" textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={32} text={renderFieldValue(structure.primaryFields[0])} textAlignment="left" />
                        </stacklayout>

                        <!-- Transit icon in center -->
                        <label class="mdi" col={1} color={labelColor} fontSize={50} marginLeft={16} marginRight={16} text={transitIcon} textAlignment="center" verticalAlignment="center" />

                        <!-- Right primary field (arrival) -->
                        <stacklayout class="pass-field primary-field" col={2}>
                            {#if structure.primaryFields[1].label}
                                <label color={labelColor} fontSize={12} fontWeight="500" text={renderFieldLabel(structure.primaryFields[1])} textAlignment="right" textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize="32" text={renderFieldValue(structure.primaryFields[1])} textAlignment="right" />
                        </stacklayout>
                    </gridlayout>
                {:else}
                    <!-- Default primary fields layout (no transit icon or different field count) -->
                    <gridlayout class="pass-section" columns={Array.from('*'.repeat(primaryFieldsCount)).join(',')}>
                        {#each structure.primaryFields as field, index}
                            {@const textAlignment = getFieldTextAlignment(field)}
                            <stacklayout class="pass-field primary-field" col={index} marginBottom="16">
                                {#if field.label}
                                    <label color={labelColor} fontSize={12} fontWeight="500" text={renderFieldLabel(field)} {textAlignment} textTransform="uppercase" />
                                {/if}
                                <label color={foregroundColor} fontSize={32} text={renderFieldValue(field)} {textAlignment} />
                            </stacklayout>
                        {/each}
                    </gridlayout>
                {/if}
            {/if}

            <!-- Secondary fields -->
            {#if secondaryFieldsCount > 0}
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(secondaryFieldsCount)).join(',')} marginTop={16} padding={4}>
                    {#each structure.secondaryFields as field, index}
                        {@const textAlignment = getFieldTextAlignment(field)}
                        <stacklayout class="pass-field" col={index} padding={index !== 0 && index !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                            {#if field.label}
                                <label color={labelColor} fontSize={11} fontWeight="500" text={renderFieldLabel(field)} {textAlignment} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={18} text={renderFieldValue(field)} {textAlignment} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Auxiliary fields -->
            {#if auxiliaryFieldsCount > 0}
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(auxiliaryFieldsCount)).join(',')} marginTop={16}>
                    {#each structure.auxiliaryFields as field, index}
                        {@const textAlignment = getFieldTextAlignment(field)}
                        <stacklayout class="pass-field" col={index} padding={index !== 0 && index !== auxiliaryFieldsCount - 1 ? '0 10 0 10' : 0}>
                            {#if field.label}
                                <label color={labelColor} fontSize={10} fontWeight="500" text={renderFieldLabel(field)} {textAlignment} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={14} text={renderFieldValue(field)} {textAlignment} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Barcode -->
            {#if barcodeSvg}
                <stacklayout
                    class="pass-section"
                    backgroundColor={foregroundColor && new Color(foregroundColor).getBrightness() < 145 ? '#ffffff' : 'transparent'}
                    borderRadius={4}
                    horizontalAlignment="center"
                    marginTop={24}
                    padding={8}>
                    <svgview src={barcodeSvg} stretch="aspectFit" width="50%" />
                    {#if primaryBarcode?.altText}
                        <label color={foregroundColor} fontSize="12" marginTop="8" text={primaryBarcode.altText} textAlignment="center" />
                    {/if}
                </stacklayout>
            {/if}

            <!-- Back fields (additional info) -->
            {#if structure?.backFields && structure.backFields.length > 0}
                <stacklayout class="pass-section" marginTop={24}>
                    <label color={labelColor} fontSize="16" fontWeight="bold" marginBottom="12" text="Additional Information" />
                    {#each structure.backFields as field}
                        <stacklayout class="pass-field" marginBottom={12}>
                            {#if field.label}
                                <label color={labelColor} fontSize={12} fontWeight="500" text={renderFieldLabel(field)} textTransform="uppercase" />
                            {/if}
                            <label color={foregroundColor} fontSize={14} html={renderFieldValue(field)} />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if}

            <!-- Expiration/Relevant date info -->
            {#if passData.expirationDate}
                <stacklayout backgroundColor={colorSurfaceContainerHigh} borderRadius={8} marginTop={16} padding={12}>
                    <label
                        color={pkpass.isExpired() ? '#ff5252' : foregroundColor}
                        fontSize="12"
                        text={pkpass.isExpired() ? 'This pass has expired' : `Expires: ${new Date(passData.expirationDate).toLocaleDateString()}`}
                        textAlignment="center" />
                </stacklayout>
            {/if}

            {#if pkpass.isVoided()}
                <stacklayout backgroundColor="#ff5252" borderRadius={8} marginTop={8} padding={12}>
                    <label color="#ffffff" fontSize={14} fontWeight="bold" text="This pass has been voided" textAlignment="center" />
                </stacklayout>
            {/if}
        </stacklayout>
    </scrollview>

    <!-- Footer image if available (286x15 points per Apple spec) -->
    {#if footerImage}
        <image height={15} margin={8} row={3} src={footerImage} stretch="aspectFill" width="286" />
    {/if}
</gridlayout>
