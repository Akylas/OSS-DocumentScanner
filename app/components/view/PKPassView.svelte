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
    $: DEV_LOG && console.log('pkpass', pkpass.imagesPath, logoImage, stripImage, iconImage, backgroundImage, thumbnailImage, pkpass.images, JSON.stringify(pkpass.passData));

    const secondaryFieldsCount = structure?.secondaryFields?.length ?? 0;
    const primaryFieldsCount = structure?.primaryFields.length ?? 0;
    const auxiliaryFieldsCount = structure?.auxiliaryFields.length ?? 0;

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
                <image col={0} height="30" src={iconImage} stretch="aspectFit" width="30" />
            {/if}
            <!-- Logo in the center -->
            {#if logoImage}
                <image col={1} height="50" horizontalAlignment="center" marginLeft={iconImage ? 8 : 0} marginRight={iconImage ? 8 : 0} src={logoImage} stretch="aspectFit" />
            {/if}
            <!-- Thumbnail on the right (optional, for event tickets typically) -->
            {#if thumbnailImage}
                <image col={2} height="50" src={thumbnailImage} stretch="aspectFit" width="50" />
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
    {#if stripImage || backgroundImage}
        <image height="150" row={1} src={stripImage || backgroundImage} stretch="aspectFill" />
    {/if}

    <!-- Main content -->
    <scrollview row={2}>
        <stacklayout padding="16">
            <!-- Primary fields -->
            {#if primaryFieldsCount > 0}
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(primaryFieldsCount)).join(',')}>
                    {#each structure.primaryFields as field, index}
                        {@const textAlignment = index === primaryFieldsCount - 1 ? 'right' : index === 0 ? 'left' : 'center'}
                        <stacklayout class="pass-field primary-field" col={index} marginBottom="16">
                            {#if field.label}
                                <label color={labelColor} fontSize="12" fontWeight="500" text={renderFieldLabel(field)} {textAlignment} />
                            {/if}
                            <label color={foregroundColor} fontSize="32" fontWeight="bold" text={renderFieldValue(field)} {textAlignment} textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Secondary fields -->
            {#if secondaryFieldsCount > 0}
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(secondaryFieldsCount)).join(',')} marginTop="16">
                    {#each structure.secondaryFields as field, index}
                        {@const textAlignment = index === secondaryFieldsCount - 1 ? 'right' : index === 0 ? 'left' : 'center'}
                        <stacklayout class="pass-field" col={index}>
                            {#if field.label}
                                <label color={labelColor} fontSize="11" fontWeight="500" text={renderFieldLabel(field)} {textAlignment} />
                            {/if}
                            <label color={foregroundColor} fontSize="18" fontWeight="bold" text={renderFieldValue(field)} {textAlignment} textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Auxiliary fields -->
            {#if auxiliaryFieldsCount > 0}
                <gridlayout class="pass-section" columns={Array.from('*'.repeat(auxiliaryFieldsCount)).join(',')} marginTop="16">
                    {#each structure.auxiliaryFields as field, index}
                        {@const textAlignment = index === auxiliaryFieldsCount - 1 ? 'right' : index === 0 ? 'left' : 'center'}
                        <stacklayout class="pass-field" col={index}>
                            {#if field.label}
                                <label color={labelColor} fontSize="10" fontWeight="500" text={renderFieldLabel(field)} {textAlignment} />
                            {/if}
                            <label color={foregroundColor} fontSize="14" text={renderFieldValue(field)} {textAlignment} textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}

            <!-- Barcode -->
            {#if barcodeSvg}
                <stacklayout class="pass-section" backgroundColor={foregroundColor === '#ffffff' ? '#000000' : '#ffffff'} borderRadius="4" horizontalAlignment="center" marginTop="24" padding="8">
                    <svgview src={barcodeSvg} stretch="aspectFit" width="50%" />
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
                            <label color={foregroundColor} fontSize="14" html={renderFieldValue(field)} textWrap={true} />
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
