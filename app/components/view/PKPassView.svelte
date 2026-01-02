<script lang="ts">
    import { Color } from '@nativescript/core';
    import { PKPass, PKPassField, PKPassBarcode, PKBarcodeFormat, PKPassStructure } from '~/models/PKPass';
    import { colors } from '~/variables';
    import { qrcodeService } from '~/services/qrcode';
    
    export let pkpass: PKPass;
    
    let { colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors;
    $: ({ colorOnBackground, colorSurface, colorSurfaceContainerHigh } = $colors);
    
    const passData = pkpass.passData;
    const structure = pkpass.getPassStructure();
    const primaryBarcode = pkpass.getPrimaryBarcode();
    
    // Parse colors from PKPass
    function parsePassColor(colorString: string | undefined, defaultColor: string): string {
        if (!colorString) return defaultColor;
        
        // PKPass uses rgb(r, g, b) format
        const rgbMatch = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            return new Color(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])).hex;
        }
        
        return colorString;
    }
    
    const backgroundColor = parsePassColor(passData.backgroundColor, colorSurface);
    const foregroundColor = parsePassColor(passData.foregroundColor, colorOnBackground);
    const labelColor = parsePassColor(passData.labelColor, colorOnBackground);
    
    async function getBarcodeImage(barcode: PKPassBarcode): Promise<string | undefined> {
        if (!barcode) return undefined;
        
        try {
            // Convert PKPass barcode format to QRCodeData format
            const qrcodeData = {
                text: barcode.message,
                format: barcode.format.replace('PKBarcodeFormat', ''),
                position: null
            };
            
            return await qrcodeService.getQRCodeSVG(qrcodeData, 300, foregroundColor);
        } catch (error) {
            console.error('Error generating barcode image:', error);
            return undefined;
        }
    }
    
    let barcodeSvg: string | undefined = undefined;
    if (primaryBarcode) {
        getBarcodeImage(primaryBarcode).then(svg => barcodeSvg = svg);
    }
    
    function renderFieldValue(field: PKPassField): string {
        if (typeof field.value === 'string') {
            return field.value;
        }
        return String(field.value);
    }
</script>

<gridlayout rows="auto,auto,*,auto" backgroundColor={backgroundColor}>
    <!-- Header section with logo -->
    <stacklayout row={0} padding="16">
        {#if pkpass.images.logo || pkpass.images.logo2x}
            <image 
                src={pkpass.images.logo2x || pkpass.images.logo} 
                height="50"
                stretch="aspectFit"
                horizontalAlignment="center" />
        {/if}
        {#if passData.logoText}
            <label 
                text={passData.logoText}
                color={foregroundColor}
                fontSize="24"
                fontWeight="bold"
                textAlignment="center"
                marginTop={pkpass.images.logo || pkpass.images.logo2x ? 8 : 0} />
        {/if}
        <label 
            text={passData.organizationName}
            color={labelColor}
            fontSize="14"
            textAlignment="center"
            marginTop="4"
            visibility={passData.logoText !== passData.organizationName ? 'visible' : 'collapsed'} />
    </stacklayout>
    
    <!-- Strip image if available -->
    {#if pkpass.images.strip || pkpass.images.strip2x}
        <image 
            row={1}
            src={pkpass.images.strip2x || pkpass.images.strip}
            stretch="aspectFill"
            height="150" />
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
                                <label 
                                    text={field.label}
                                    color={labelColor}
                                    fontSize="12"
                                    fontWeight="500" />
                            {/if}
                            <label 
                                text={renderFieldValue(field)}
                                color={foregroundColor}
                                fontSize="32"
                                fontWeight="bold"
                                textWrap={true} />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if}
            
            <!-- Secondary fields -->
            {#if structure?.secondaryFields && structure.secondaryFields.length > 0}
                <gridlayout columns="*,*" class="pass-section" marginTop="16">
                    {#each structure.secondaryFields as field, index}
                        <stacklayout col={index} class="pass-field">
                            {#if field.label}
                                <label 
                                    text={field.label}
                                    color={labelColor}
                                    fontSize="11"
                                    fontWeight="500" />
                            {/if}
                            <label 
                                text={renderFieldValue(field)}
                                color={foregroundColor}
                                fontSize="18"
                                fontWeight="bold"
                                textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}
            
            <!-- Auxiliary fields -->
            {#if structure?.auxiliaryFields && structure.auxiliaryFields.length > 0}
                <gridlayout columns="*,*,*" class="pass-section" marginTop="16">
                    {#each structure.auxiliaryFields as field, index}
                        <stacklayout col={index} class="pass-field">
                            {#if field.label}
                                <label 
                                    text={field.label}
                                    color={labelColor}
                                    fontSize="10"
                                    fontWeight="500" />
                            {/if}
                            <label 
                                text={renderFieldValue(field)}
                                color={foregroundColor}
                                fontSize="14"
                                textWrap={true} />
                        </stacklayout>
                    {/each}
                </gridlayout>
            {/if}
            
            <!-- Barcode -->
            {#if barcodeSvg}
                <stacklayout class="pass-section" marginTop="24" padding="16" backgroundColor={foregroundColor === '#ffffff' ? '#000000' : '#ffffff'} borderRadius="8">
                    <svgview 
                        src={barcodeSvg}
                        height="150"
                        stretch="aspectFit" />
                    {#if primaryBarcode?.altText}
                        <label 
                            text={primaryBarcode.altText}
                            color={foregroundColor === '#ffffff' ? '#ffffff' : '#000000'}
                            fontSize="12"
                            textAlignment="center"
                            marginTop="8" />
                    {/if}
                </stacklayout>
            {/if}
            
            <!-- Back fields (additional info) -->
            {#if structure?.backFields && structure.backFields.length > 0}
                <stacklayout class="pass-section" marginTop="24">
                    <label 
                        text="Additional Information"
                        color={labelColor}
                        fontSize="16"
                        fontWeight="bold"
                        marginBottom="12" />
                    {#each structure.backFields as field}
                        <stacklayout class="pass-field" marginBottom="12">
                            {#if field.label}
                                <label 
                                    text={field.label}
                                    color={labelColor}
                                    fontSize="12"
                                    fontWeight="500" />
                            {/if}
                            <label 
                                text={renderFieldValue(field)}
                                color={foregroundColor}
                                fontSize="14"
                                textWrap={true} />
                        </stacklayout>
                    {/each}
                </stacklayout>
            {/if}
            
            <!-- Expiration/Relevant date info -->
            {#if passData.expirationDate}
                <stacklayout marginTop="16" padding="12" backgroundColor={colorSurfaceContainerHigh} borderRadius="8">
                    <label 
                        text={pkpass.isExpired() ? 'This pass has expired' : `Expires: ${new Date(passData.expirationDate).toLocaleDateString()}`}
                        color={pkpass.isExpired() ? '#ff5252' : foregroundColor}
                        fontSize="12"
                        textAlignment="center" />
                </stacklayout>
            {/if}
            
            {#if pkpass.isVoided()}
                <stacklayout marginTop="8" padding="12" backgroundColor="#ff5252" borderRadius="8">
                    <label 
                        text="This pass has been voided"
                        color="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        textAlignment="center" />
                </stacklayout>
            {/if}
        </stacklayout>
    </scrollview>
    
    <!-- Footer image if available -->
    {#if pkpass.images.footer || pkpass.images.footer2x}
        <image 
            row={3}
            src={pkpass.images.footer2x || pkpass.images.footer}
            stretch="aspectFit"
            height="40"
            margin="8" />
    {/if}
</gridlayout>
