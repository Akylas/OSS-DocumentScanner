<script lang="ts">
    import { Color, path } from '@nativescript/core';
    import { PKBarcodeFormat, PKPass, PKPassBarcode, PKPassField, PKPassStructure } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { qrcodeService } from '~/services/qrcode';
    import { getBarcodeImage } from '~/utils/pkpass';
    import { lang } from '~/helpers/locale';

    export let pkpass: PKPass;

    let { colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors;
    $: ({ colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors);

    const passData = pkpass.passData;
    const structure = pkpass.getPassStructure();
    const primaryBarcode = pkpass.getPrimaryBarcode();

    $: foregroundColor = passData.foregroundColor || colorOnBackground;
    $: backgroundColor = passData.backgroundColor || colorSurface;
    $: labelColor = passData.labelColor || colorOnBackground;
    $: logoImage = pkpass?.images?.logo2x || pkpass?.images?.logo;
    $: iconImage = pkpass?.images?.icon2x || pkpass?.images?.icon;
    $: stripImage = pkpass?.images?.strip2x || pkpass?.images?.strip;
    $: backgroundImage = pkpass?.images?.background2x || pkpass?.images?.background;
    $: thumbnailImage = pkpass?.images?.thumbnail2x || pkpass?.images?.thumbnail;
    $: DEV_LOG && console.log('pkpass', pkpass.imagesPath, logoImage, stripImage, iconImage, backgroundImage, thumbnailImage, pkpass.images,  JSON.stringify(pkpass.passData));

    let barcodeSvg: string | undefined;
    if (primaryBarcode) {
        getBarcodeImage({ barcode: primaryBarcode, foregroundColor }).then((svg) => (barcodeSvg = svg));
    }

    function renderFieldValue(field: PKPassField): string {
        const value = typeof field.value === 'string' ? field.value : String(field.value);
        return pkpass.getLocalizedValue(value, lang);
    }
    
    function renderFieldLabel(field: PKPassField): string {
        return field.label ? pkpass.getLocalizedValue(field.label, lang) : '';
    }
    
    function getLocalizedText(text: string): string {
        return text ? pkpass.getLocalizedValue(text, lang) : text;
    }
</script>

<gridlayout {backgroundColor} rows="auto,auto,*,auto">
    <!-- Header section with logo and icon -->
    <stacklayout padding="16" row={0}>
        <gridlayout columns="auto,*,auto" verticalAlignment="center">
            <!-- Icon on the left -->
            {#if iconImage}
                <image col={0} height="30" src={path.join(pkpass.imagesPath, iconImage)} stretch="aspectFit" width="30" />
            {/if}
            <!-- Logo in the center -->
            {#if logoImage}
                <image col={1} height="50" horizontalAlignment="center" marginLeft={iconImage ? 8 : 0} marginRight={iconImage ? 8 : 0} src={path.join(pkpass.imagesPath, logoImage)} stretch="aspectFit" />
            {/if}
            <!-- Thumbnail on the right (optional, for event tickets typically) -->
            {#if thumbnailImage}
                <image col={2} height="50" src={path.join(pkpass.imagesPath, thumbnailImage)} stretch="aspectFit" width="50" />
            {/if}
        </gridlayout>
        {#if passData.logoText}
            <label color={foregroundColor} fontSize="24" fontWeight="bold" marginTop={logoImage || iconImage ? 8 : 0} text={getLocalizedText(passData.logoText)} textAlignment="center" />
        {/if}
        <label
            color={labelColor}
            fontSize="14"
            marginTop="4"
            text={passData.organizationName}
            textAlignment="center"
            visibility={passData.logoText !== passData.organizationName ? 'visible' : 'collapsed'} />
    </stacklayout>

    <!-- Strip or background image if available -->
    {#if stripImage}
        <image height="150" row={1} src={path.join(pkpass.imagesPath, stripImage)} stretch="aspectFill" />
    {:else if backgroundImage}
        <image height="150" row={1} src={path.join(pkpass.imagesPath, backgroundImage)} stretch="aspectFill" />
    {/if}

    <!-- Main content -->
    <scrollview row={2}>
        <stacklayout padding="16">
            <!-- Primary fields -->
            {#if structure?.primaryFields && structure.primaryFields.length > 0}
                <stacklayout class="pass-section">
                    {#each structure.primaryFields as field}
                        <stacklayout class="pass-field primary-field" marginBottom="16">
                            {#if field.label}
                                <label color={labelColor} fontSize="12" fontWeight="500" text={renderFieldLabel(field)} />
                            {/if}
                            <label color={foregroundColor} fontSize="32" fontWeight="bold" text={renderFieldValue(field)} textWrap={true} />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if}

            <!-- Secondary fields -->
            {#if structure?.secondaryFields && structure.secondaryFields.length > 0}
                <gridlayout class="pass-section" columns="*,*" marginTop="16">
                    {#each structure.secondaryFields as field, index}
                        <stacklayout class="pass-field" col={index}>
                            {#if field.label}
                                <label color={labelColor} fontSize="11" fontWeight="500" text={renderFieldLabel(field)} />
                            {/if}
                            <label color={foregroundColor} fontSize="18" fontWeight="bold" text={renderFieldValue(field)} textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Auxiliary fields -->
            {#if structure?.auxiliaryFields && structure.auxiliaryFields.length > 0}
                <gridlayout class="pass-section" columns="*,*,*" marginTop="16">
                    {#each structure.auxiliaryFields as field, index}
                        <stacklayout class="pass-field" col={index}>
                            {#if field.label}
                                <label color={labelColor} fontSize="10" fontWeight="500" text={renderFieldLabel(field)} />
                            {/if}
                            <label color={foregroundColor} fontSize="14" text={renderFieldValue(field)} textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Barcode -->
            {#if barcodeSvg}
                <stacklayout class="pass-section" backgroundColor={foregroundColor === '#ffffff' ? '#000000' : '#ffffff'} borderRadius="8" horizontalAlignment="center" marginTop="24" padding="16">
                    <svgview height="150" src={barcodeSvg} stretch="aspectFit" />
                    {#if primaryBarcode?.altText}
                        <label color={foregroundColor === '#ffffff' ? '#ffffff' : '#000000'} fontSize="12" marginTop="8" text={primaryBarcode.altText} textAlignment="center" />
                    {/if}
                </stacklayout>
            {/if}

            <!-- Back fields (additional info) -->
            {#if structure?.backFields && structure.backFields.length > 0}
                <stacklayout class="pass-section" marginTop="24">
                    <label color={labelColor} fontSize="16" fontWeight="bold" marginBottom="12" text="Additional Information" />
                    {#each structure.backFields as field}
                        <stacklayout class="pass-field" marginBottom="12">
                            {#if field.label}
                                <label color={labelColor} fontSize="12" fontWeight="500" text={renderFieldLabel(field)} />
                            {/if}
                            <label color={foregroundColor} fontSize="14" text={renderFieldValue(field)} textWrap={true} />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if}

            <!-- Expiration/Relevant date info -->
            {#if passData.expirationDate}
                <stacklayout backgroundColor={colorSurfaceContainerHigh} borderRadius="8" marginTop="16" padding="12">
                    <label
                        color={pkpass.isExpired() ? '#ff5252' : foregroundColor}
                        fontSize="12"
                        text={pkpass.isExpired() ? 'This pass has expired' : `Expires: ${new Date(passData.expirationDate).toLocaleDateString()}`}
                        textAlignment="center" />
                </stacklayout>
            {/if}

            {#if pkpass.isVoided()}
                <stacklayout backgroundColor="#ff5252" borderRadius="8" marginTop="8" padding="12">
                    <label color="#ffffff" fontSize="14" fontWeight="bold" text="This pass has been voided" textAlignment="center" />
                </stacklayout>
            {/if}
        </stacklayout>
    </scrollview>

    <!-- Footer image if available -->
    {#if pkpass.images.footer || pkpass.images.footer2x}
        <image height="40" margin="8" row={3} src={pkpass.images.footer2x || pkpass.images.footer} stretch="aspectFit" />
    {/if}
</gridlayout>
