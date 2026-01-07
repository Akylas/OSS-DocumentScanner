import { Observable } from '@nativescript/core';
import dayjs from 'dayjs';
import { formatCurrency } from '~/helpers/locale';
import { loadImage, recycleImages } from '~/utils/images';
import { getBarcodeImage, getBarcodeSVG } from '~/utils/pkpass';

/**
 * PKPass model representing an Apple Wallet Pass
 * Based on Apple's PassKit specification
 */

export enum PKPassStyle {
    BoardingPass = 'boardingPass',
    Coupon = 'coupon',
    EventTicket = 'eventTicket',
    Generic = 'generic',
    StoreCard = 'storeCard'
}

export enum PKPassTransitType {
    Air = 'PKTransitTypeAir',
    Boat = 'PKTransitTypeBoat',
    Bus = 'PKTransitTypeBus',
    Generic = 'PKTransitTypeGeneric',
    Train = 'PKTransitTypeTrain'
}

export enum PKBarcodeFormat {
    QR = 'PKBarcodeFormatQR',
    PDF417 = 'PKBarcodeFormatPDF417',
    Aztec = 'PKBarcodeFormatAztec',
    Code128 = 'PKBarcodeFormatCode128'
}

export interface PKPassBarcode {
    format: PKBarcodeFormat;
    message: string;
    messageEncoding: string;
    altText?: string;
}

export interface PKPassField {
    key: string;
    label?: string;
    value: string | number;
    textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
    changeMessage?: string;
    dataDetectorTypes?: string[];
    // Date/time formatting
    dateStyle?: 'PKDateStyleNone' | 'PKDateStyleShort' | 'PKDateStyleMedium' | 'PKDateStyleLong' | 'PKDateStyleFull';
    timeStyle?: 'PKDateStyleNone' | 'PKDateStyleShort' | 'PKDateStyleMedium' | 'PKDateStyleLong' | 'PKDateStyleFull';
    isRelative?: boolean;
    ignoresTimeZone?: boolean;
    // Number formatting
    numberStyle?: 'PKNumberStyleDecimal' | 'PKNumberStylePercent' | 'PKNumberStyleScientific' | 'PKNumberStyleSpellOut';
    currencyCode?: string;
}

export interface PKPassLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
    relevantText?: string;
}

export interface PKPassStructure {
    headerFields?: PKPassField[];
    primaryFields?: PKPassField[];
    secondaryFields?: PKPassField[];
    auxiliaryFields?: PKPassField[];
    backFields?: PKPassField[];
    transitType?: PKPassTransitType;
}

export interface PKPassData {
    // Standard keys
    formatVersion: number;
    passTypeIdentifier: string;
    serialNumber: string;
    teamIdentifier: string;
    organizationName: string;
    description: string;

    // Visual appearance
    logoText?: string;
    foregroundColor?: string;
    backgroundColor?: string;
    labelColor?: string;

    // Relevance
    locations?: PKPassLocation[];
    relevantDate?: string;
    expirationDate?: string;
    voided?: boolean;

    // Barcode
    barcode?: PKPassBarcode;
    barcodes?: PKPassBarcode[];

    // Pass structure (one of these will be present based on style)
    boardingPass?: PKPassStructure;
    coupon?: PKPassStructure;
    eventTicket?: PKPassStructure;
    generic?: PKPassStructure;
    storeCard?: PKPassStructure;

    // Web service
    webServiceURL?: string;
    authenticationToken?: string;

    // Localization support (added by parser)
    _allLocalizations?: { [languageCode: string]: { [key: string]: string } }; // All available localizations
}

export interface PKPassImages {
    icon?: string;
    icon2x?: string;
    icon3x?: string;
    logo?: string;
    logo2x?: string;
    logo3x?: string;
    background?: string;
    background2x?: string;
    background3x?: string;
    footer?: string;
    footer2x?: string;
    footer3x?: string;
    strip?: string;
    strip2x?: string;
    strip3x?: string;
    thumbnail?: string;
    thumbnail2x?: string;
    thumbnail3x?: string;
}

export class PKPass extends Observable {
    id: string;
    page_id: string; // Changed from document_id to page_id

    // PKPass data
    passData: PKPassData;
    images: PKPassImages;

    // Storage paths
    passJsonPath?: string;
    imagesPath?: string;

    // Metadata
    createdDate: number;
    modifiedDate?: number;

    constructor(id: string, pageId: string) {
        super();
        this.id = id;
        this.page_id = pageId;
        this.createdDate = Date.now();
    }

    getPassStyle(): PKPassStyle {
        if (this.passData.boardingPass) return PKPassStyle.BoardingPass;
        if (this.passData.coupon) return PKPassStyle.Coupon;
        if (this.passData.eventTicket) return PKPassStyle.EventTicket;
        if (this.passData.storeCard) return PKPassStyle.StoreCard;
        return PKPassStyle.Generic;
    }

    getPassStructure(): PKPassStructure | undefined {
        const style = this.getPassStyle();
        switch (style) {
            case PKPassStyle.BoardingPass:
                return this.passData.boardingPass;
            case PKPassStyle.Coupon:
                return this.passData.coupon;
            case PKPassStyle.EventTicket:
                return this.passData.eventTicket;
            case PKPassStyle.StoreCard:
                return this.passData.storeCard;
            case PKPassStyle.Generic:
                return this.passData.generic;
        }
    }

    getPrimaryBarcode(): PKPassBarcode | undefined {
        // iOS 9+ uses barcodes array, older uses barcode
        if (this.passData.barcodes && this.passData.barcodes.length > 0) {
            return this.passData.barcodes[0];
        }
        return this.passData.barcode;
    }

    getAllBarcodes(): PKPassBarcode[] {
        const barcodes: PKPassBarcode[] = [];
        if (this.passData.barcodes) {
            barcodes.push(...this.passData.barcodes);
        } else if (this.passData.barcode) {
            barcodes.push(this.passData.barcode);
        }
        return barcodes;
    }

    isExpired(): boolean {
        if (!this.passData.expirationDate) {
            return false;
        }
        return new Date(this.passData.expirationDate) < new Date();
    }

    isVoided(): boolean {
        return this.passData.voided === true;
    }

    /**
     * Get localized value for a given key based on current app language
     * @param key The key to localize
     * @param currentLang Current app language (from ~/helpers/locale)
     * @returns Localized value or the original key if no localization found
     */
    getLocalizedValue(key: string, currentLang: string): string {
        if (!key || !this.passData._allLocalizations) {
            return key;
        }

        const localizations = this.passData._allLocalizations;

        // Normalize current language (handle both 'en_US' and 'en-US' formats)
        const normalizedLang = currentLang.replace('_', '-').toLowerCase();
        const langCode = normalizedLang.split('-')[0]; // Get base language code (e.g., 'en' from 'en-US')

        // Try exact match first (e.g., 'en-US')
        if (localizations[normalizedLang] && localizations[normalizedLang][key]) {
            return localizations[normalizedLang][key];
        }

        // Try base language code (e.g., 'en')
        if (localizations[langCode] && localizations[langCode][key]) {
            return localizations[langCode][key];
        }

        // Try locale-specific variants (e.g., 'en_US', 'en-GB')
        for (const localeKey of Object.keys(localizations)) {
            const keyLower = localeKey.toLowerCase();
            if ((keyLower.startsWith(langCode + '-') || keyLower.startsWith(langCode + '_')) && localizations[localeKey][key]) {
                return localizations[localeKey][key];
            }
        }

        // Fall back to 'en' if available
        if (localizations['en'] && localizations['en'][key]) {
            return localizations['en'][key];
        }

        // Fall back to first available localization
        for (const localeKey of Object.keys(localizations)) {
            if (localizations[localeKey][key]) {
                return localizations[localeKey][key];
            }
        }

        // Return original key if no localization found
        return key;
    }

    /**
     * Render PKPass to a canvas for export to PDF or image
     * @param canvas Canvas element to render to
     * @param options Rendering options
     * @returns Promise that resolves when rendering is complete
     */
    async renderToCanvas(
        canvas: any,
        options: {
            layout?: 'card' | 'full'; // Card for compact credit-card sized, full for complete details
            includeBackFields?: boolean;
            backgroundColor?: string;
            width?: number;
            height?: number;
        } = {}
    ): Promise<void> {
        const { Canvas, LayoutAlignment, Paint, StaticLayout } = await import('@nativescript-community/ui-canvas');
        const { loadImage, recycleImages } = await import('~/utils/images');
        const { getBarcodeImage } = await import('~/utils/pkpass');
        const { lang } = await import('~/helpers/locale');
        const { path } = await import('@nativescript/core');

        const { backgroundColor = this.passData.backgroundColor || '#ffffff', includeBackFields = false, layout = 'full', width = 600 } = options;

        // Calculate dimensions based on layout
        const baseWidth = 600;
        const scaleFactor = width / baseWidth;

        // Credit card aspect ratio: 1.586:1
        const cardHeight = Math.round(width / 1.586);

        // For full layout, compute height dynamically based on content
        let computedHeight = 0;
        if (layout === 'card') {
            computedHeight = cardHeight;
        } else {
            // Estimate height for full layout
            computedHeight = this.computeFullLayoutHeight(scaleFactor, includeBackFields);
        }

        const canvasWidth = width;
        const canvasHeight = options.height || computedHeight;

        // Create paints for rendering
        const bgPaint = new Paint();
        bgPaint.color = backgroundColor;

        const fgPaint = new Paint();
        fgPaint.color = this.passData.foregroundColor || '#000000';
        fgPaint.setAntiAlias(true);

        const labelPaint = new Paint();
        labelPaint.color = this.passData.labelColor || this.passData.foregroundColor || '#666666';
        labelPaint.setAntiAlias(true);

        const imagePaint = new Paint();
        imagePaint.setAntiAlias(true);

        // Draw background
        canvas.drawRect(0, 0, canvasWidth, canvasHeight, bgPaint);

        const y = 20 * scaleFactor; // Starting Y position with scaling
        const padding = 20 * scaleFactor;
        const sectionSpacing = 30 * scaleFactor;

        // Get pass structure and style
        const structure = this.getPassStructure();
        const style = this.getPassStyle();

        try {
            if (layout === 'card') {
                // Card layout: compact credit-card sized rendering
                await this.renderCardLayout(canvas, canvasWidth, canvasHeight, scaleFactor, structure, style, padding, labelPaint, fgPaint, imagePaint, lang);
            } else {
                // Full layout: comprehensive pass view
                await this.renderFullLayout(canvas, canvasWidth, canvasHeight, scaleFactor, structure, style, padding, sectionSpacing, includeBackFields, labelPaint, fgPaint, imagePaint, lang);
            }
        } catch (error) {
            console.error('Error rendering PKPass to canvas:', error);
            // Draw error message
            fgPaint.textSize = 16 * scaleFactor;
            canvas.drawText('Error rendering pass', padding, 50 * scaleFactor, fgPaint);
        }
    }

    /**
     * Compute height for full layout based on content
     */
    private computeFullLayoutHeight(scaleFactor: number, includeBackFields: boolean): number {
        const structure = this.getPassStructure();
        let height = 100 * scaleFactor; // Initial padding and header

        // Strip image (Apple spec: variable, using 150px as scaled average)
        // or background image (Apple spec: 180x220 points)
        if (this.images.strip || this.images.strip2x) {
            height += 150 * scaleFactor + 10 * scaleFactor;
        } else if ((this.images.background || this.images.background2x) && this.getPassStyle() !== PKPassStyle.BoardingPass) {
            // Background typically used as backdrop, not adding to height
        }

        // Header section with images (icon: 29x29, logo: 160x50, thumbnail: 90x90)
        height += 90 * scaleFactor; // Max of icon/logo/thumbnail heights

        // Header fields
        if (structure?.headerFields?.length) {
            height += 50 * scaleFactor;
        }

        // Primary fields
        if (structure?.primaryFields?.length) {
            height += 70 * scaleFactor;
        }

        // Secondary fields
        if (structure?.secondaryFields?.length) {
            height += 50 * scaleFactor;
        }

        // Auxiliary fields
        if (structure?.auxiliaryFields?.length) {
            height += 50 * scaleFactor;
        }

        // Barcode
        const barcode = this.getPrimaryBarcode();
        if (barcode) {
            height += 350 * scaleFactor; // Barcode + alt text
        }

        // Back fields
        if (includeBackFields && structure?.backFields?.length) {
            height += 60 * scaleFactor; // Separator
            height += structure.backFields.length * 40 * scaleFactor;
        }

        // Footer image (Apple spec: 286x15 points)
        if (this.images.footer || this.images.footer2x) {
            height += 25 * scaleFactor; // Footer image + spacing
        }

        height += 50 * scaleFactor; // Bottom padding

        return Math.round(height);
    }

    /**
     * Render card layout (compact)
     */
    private async renderCardLayout(
        canvas: any,
        canvasWidth: number,
        canvasHeight: number,
        scaleFactor: number,
        structure: any,
        style: any,
        padding: number,
        labelPaint: any,
        fgPaint: any,
        imagePaint: any,
        currentLang: string
    ): Promise<void> {
        const { loadImage, recycleImages } = await import('~/utils/images');
        const { path } = await import('@nativescript/core');

        let y = padding;

        // Top row: Logo or Icon + Name, and header fields
        const headerY = y;
        const logoX = padding;

        // Apple spec: prefer @2x images for quality
        const logo2x = this.images.logo2x || this.images.logo;
        const icon2x = this.images.icon2x || this.images.icon;

        // Draw logo (Apple spec: max 160x50, scaled to 80px width for card) or icon (Apple spec: 29x29, scaled to ~20px)
        if (logo2x) {
            const logoPath = path.join(this.imagesPath, logo2x);
            // Apple spec: max 160x50 points, scale proportionally for card
            const logoImage = await loadImage(logoPath, { width: Math.round(80 * scaleFactor), height: Math.round(40 * scaleFactor) });
            canvas.drawBitmap(logoImage, logoX, headerY, imagePaint);
            recycleImages(logoImage);
        } else if (icon2x) {
            const iconPath = path.join(this.imagesPath, icon2x);
            // Apple spec: 29x29 points, scaled to ~20px for card
            const iconImage = await loadImage(iconPath, { width: Math.round(20 * scaleFactor), height: Math.round(20 * scaleFactor) });
            canvas.drawBitmap(iconImage, logoX, headerY, imagePaint);
            recycleImages(iconImage);

            // Draw organization name next to icon
            fgPaint.textSize = 14 * scaleFactor;
            canvas.drawText(this.passData.organizationName || '', logoX + 26 * scaleFactor, headerY + 15 * scaleFactor, fgPaint);
        } else {
            // Just name
            fgPaint.textSize = 14 * scaleFactor;
            canvas.drawText(this.passData.organizationName || '', logoX, headerY + 15 * scaleFactor, fgPaint);
        }

        // Draw header fields on the right
        if (structure?.headerFields?.length) {
            const headerFieldsX = canvasWidth - padding - 100 * scaleFactor;
            let fieldY = headerY;
            for (const field of structure.headerFields) {
                labelPaint.textSize = 11 * scaleFactor;
                const label = this.getLocalizedValue(field.label || field.key, currentLang);
                canvas.drawText(label, headerFieldsX, fieldY, labelPaint);

                fgPaint.textSize = 14 * scaleFactor;
                const value = this.formatFieldValue(field, currentLang);
                canvas.drawText(value, headerFieldsX, fieldY + 15 * scaleFactor, fgPaint);

                fieldY += 30 * scaleFactor;
            }
        }

        y += 50 * scaleFactor;

        // Middle row: Primary fields with optional transit icon
        const transitType = structure?.transitType;
        if (transitType && structure?.primaryFields?.length === 2) {
            // Boarding pass layout with transit icon
            const fieldWidth = (canvasWidth - 2 * padding - 50 * scaleFactor) / 2;

            // Left field (departure)
            labelPaint.textSize = 10 * scaleFactor;
            const leftLabel = this.getLocalizedValue(structure.primaryFields[0].label || '', currentLang);
            canvas.drawText(leftLabel, padding, y, labelPaint);

            fgPaint.textSize = 28 * scaleFactor;
            const leftValue = this.formatFieldValue(structure.primaryFields[0], currentLang);
            canvas.drawText(leftValue, padding, y + 35 * scaleFactor, fgPaint);

            // Transit icon (center) - simplified, just text representation
            fgPaint.textSize = 32 * scaleFactor;
            canvas.drawText('→', padding + fieldWidth, y + 20 * scaleFactor, fgPaint);

            // Right field (arrival)
            labelPaint.textSize = 10 * scaleFactor;
            const rightLabel = this.getLocalizedValue(structure.primaryFields[1].label || '', currentLang);
            const rightLabelWidth = labelPaint.measureText(rightLabel);
            canvas.drawText(rightLabel, canvasWidth - padding - rightLabelWidth, y, labelPaint);

            fgPaint.textSize = 28 * scaleFactor;
            const rightValue = this.formatFieldValue(structure.primaryFields[1], currentLang);
            const rightValueWidth = fgPaint.measureText(rightValue);
            canvas.drawText(rightValue, canvasWidth - padding - rightValueWidth, y + 35 * scaleFactor, fgPaint);

            y += 60 * scaleFactor;
        } else if (structure?.primaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.primaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 10 * scaleFactor, 24 * scaleFactor, currentLang);
        }

        y += 20 * scaleFactor;

        // Bottom row: Secondary and auxiliary fields
        if (structure?.secondaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.secondaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 9 * scaleFactor, 11 * scaleFactor, currentLang);
            y += 10 * scaleFactor;
        }

        if (structure?.auxiliaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.auxiliaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 9 * scaleFactor, 11 * scaleFactor, currentLang);
        }
    }

    /**
     * Render full layout (comprehensive)
     */
    private async renderFullLayout(
        canvas: any,
        canvasWidth: number,
        canvasHeight: number,
        scaleFactor: number,
        structure: any,
        style: any,
        padding: number,
        sectionSpacing: number,
        includeBackFields: boolean,
        labelPaint: any,
        fgPaint: any,
        imagePaint: any,
        currentLang: string
    ): Promise<void> {
        const { path } = await import('@nativescript/core');

        let y = 20 * scaleFactor;

        // Apple spec: prefer @2x images for quality
        const strip2x = this.images.strip2x || this.images.strip;
        const background2x = this.images.background2x || this.images.background;
        const icon2x = this.images.icon2x || this.images.icon;
        const logo2x = this.images.logo2x || this.images.logo;
        const thumbnail2x = this.images.thumbnail2x || this.images.thumbnail;
        const footer2x = this.images.footer2x || this.images.footer;

        // 1. Draw strip image behind primary fields (Apple spec: variable dimensions)
        // iPhone 6+: 375x98 (events), 375x144 (gift/coupon), 375x123 (other)
        // Earlier: 320x84 (events), 320x110 (square barcode), 320x123 (other)
        if (strip2x) {
            const stripPath = path.join(this.imagesPath, strip2x);
            const stripImage = await loadImage(stripPath, { width: canvasWidth, height: Math.round(150 * scaleFactor) });
            canvas.drawBitmap(stripImage, 0, y, imagePaint);
            recycleImages(stripImage);
            y += Math.round(150 * scaleFactor) + Math.round(10 * scaleFactor);
        } else if (background2x && style !== PKPassStyle.BoardingPass) {
            // Background image (Apple spec: 180x220 points) - not typically used with strip
            // Draw as backdrop if no strip and not boarding pass
            const bgPath = path.join(this.imagesPath, background2x);
            const bgImage = await loadImage(bgPath, { width: canvasWidth, height: canvasHeight });
            canvas.drawBitmap(bgImage, 0, 0, imagePaint);
            recycleImages(bgImage);
        }

        // 2. Draw header section (icon, logo, thumbnail per Apple specs)
        const headerY = y;
        let logoX = padding;

        // Draw icon if available (Apple spec: 29x29 points)
        if (icon2x) {
            const iconPath = path.join(this.imagesPath, icon2x);
            const iconImage = await loadImage(iconPath, { width: Math.round(29 * scaleFactor), height: Math.round(29 * scaleFactor) });
            canvas.drawBitmap(iconImage, padding, headerY, imagePaint);
            recycleImages(iconImage);
            logoX += Math.round(35 * scaleFactor);
        }

        // Draw logo if available (Apple spec: max 160x50 points)
        if (logo2x) {
            const logoPath = path.join(this.imagesPath, logo2x);
            const logoImage = await loadImage(logoPath, { width: Math.round(160 * scaleFactor), height: Math.round(50 * scaleFactor) });
            canvas.drawBitmap(logoImage, logoX, headerY, imagePaint);
            recycleImages(logoImage);
        }

        // Draw thumbnail if available (Apple spec: 90x90 points)
        if (thumbnail2x) {
            const thumbPath = path.join(this.imagesPath, thumbnail2x);
            const thumbImage = await loadImage(thumbPath, { width: Math.round(90 * scaleFactor), height: Math.round(90 * scaleFactor) });
            canvas.drawBitmap(thumbImage, canvasWidth - Math.round(90 * scaleFactor) - padding, headerY, imagePaint);
            recycleImages(thumbImage);
        }

        // Draw logo text if available
        if (this.passData.logoText) {
            fgPaint.textSize = 14 * scaleFactor;
            const logoText = this.getLocalizedValue(this.passData.logoText, currentLang);
            canvas.drawText(logoText, logoX, headerY + Math.round(55 * scaleFactor), fgPaint);
        }

        y = headerY + Math.round(70 * scaleFactor);

        // 3. Draw header fields
        if (structure?.headerFields?.length) {
            y = this.drawFieldGroup(canvas, structure.headerFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 16 * scaleFactor, currentLang);
            y += sectionSpacing;
        }

        // 4. Draw primary fields (larger text)
        if (structure?.primaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.primaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 14 * scaleFactor, 28 * scaleFactor, currentLang);
            y += sectionSpacing;
        }

        // 5. Draw secondary fields
        if (structure?.secondaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.secondaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 18 * scaleFactor, currentLang);
            y += sectionSpacing;
        }

        // 6. Draw auxiliary fields
        if (structure?.auxiliaryFields?.length) {
            y = this.drawFieldGroup(canvas, structure.auxiliaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 10 * scaleFactor, 14 * scaleFactor, currentLang);
            y += sectionSpacing;
        }

        // 7. Draw barcode if available
        const barcode = this.getPrimaryBarcode();
        if (barcode) {
            try {
                const barcodeWidth = Math.min(Math.round(300 * scaleFactor), canvasWidth - 2 * padding);
                const barcodeImage = await getBarcodeImage({ barcode, foregroundColor: this.passData.foregroundColor || '#000000', width: barcodeWidth });

                if (barcodeImage) {
                    // Center the barcode
                    const barcodeX = (canvasWidth - barcodeWidth) / 2;
                    canvas.drawBitmap(barcodeImage, barcodeX, y, imagePaint);
                    recycleImages(barcodeImage);

                    const barcodeHeight = Math.round(barcodeWidth * 0.8); // Approximate barcode height
                    y += barcodeHeight + Math.round(10 * scaleFactor);

                    // Draw barcode alt text if available
                    if (barcode.altText) {
                        fgPaint.textSize = 12 * scaleFactor;
                        const textWidth = fgPaint.measureText(barcode.altText);
                        canvas.drawText(barcode.altText, (canvasWidth - textWidth) / 2, y + Math.round(10 * scaleFactor), fgPaint);
                        y += Math.round(30 * scaleFactor);
                    }
                }
            } catch (error) {
                console.error('Error rendering barcode:', error);
            }
        }

        // 8. Draw back fields if requested
        if (includeBackFields && structure?.backFields?.length) {
            y += sectionSpacing;
            // Draw separator line
            const { Paint } = await import('@nativescript-community/ui-canvas');
            const separatorPaint = new Paint();
            separatorPaint.color = this.passData.foregroundColor || '#cccccc';
            separatorPaint.strokeWidth = 1;
            canvas.drawLine(padding, y, canvasWidth - padding, y, separatorPaint);
            y += sectionSpacing;

            y = this.drawFieldGroup(canvas, structure.backFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 16 * scaleFactor, currentLang);
        }

        // 9. Draw footer image if available (Apple spec: 286x15 points)
        if (footer2x) {
            try {
                const footerPath = path.join(this.imagesPath, footer2x);
                const footerImage = await loadImage(footerPath, { width: Math.round(286 * scaleFactor), height: Math.round(15 * scaleFactor) });
                // Center footer image
                const footerX = (canvasWidth - Math.round(286 * scaleFactor)) / 2;
                canvas.drawBitmap(footerImage, footerX, y, imagePaint);
                recycleImages(footerImage);
            } catch (error) {
                console.error('Error rendering footer image:', error);
            }
        }
    }

    /**
     * Helper method to draw a group of fields
     */
    private drawFieldGroup(
        canvas: any,
        fields: PKPassField[],
        startY: number,
        canvasWidth: number,
        padding: number,
        labelPaint: any,
        valuePaint: any,
        labelSize: number,
        valueSize: number,
        currentLang: string
    ): number {
        const y = startY;
        const fieldSpacing = 10;
        const fieldWidth = (canvasWidth - 2 * padding - (fields.length - 1) * fieldSpacing) / fields.length;

        fields.forEach((field, index) => {
            const x = padding + index * (fieldWidth + fieldSpacing);

            // Draw label
            labelPaint.textSize = labelSize;
            const label = this.getLocalizedValue(field.label || field.key, currentLang);

            // Handle label alignment
            let labelX = x;
            if (field.textAlignment === 'PKTextAlignmentRight') {
                const labelWidth = labelPaint.measureText(label);
                labelX = x + fieldWidth - labelWidth;
            } else if (field.textAlignment === 'PKTextAlignmentCenter') {
                const labelWidth = labelPaint.measureText(label);
                labelX = x + (fieldWidth - labelWidth) / 2;
            }
            canvas.drawText(label, labelX, y, labelPaint);

            // Format and draw value
            valuePaint.textSize = valueSize;
            const formattedValue = this.formatFieldValue(field, currentLang);

            // Handle value alignment
            let valueX = x;
            if (field.textAlignment === 'PKTextAlignmentRight') {
                const valueWidth = valuePaint.measureText(formattedValue);
                valueX = x + fieldWidth - valueWidth;
            } else if (field.textAlignment === 'PKTextAlignmentCenter') {
                const valueWidth = valuePaint.measureText(formattedValue);
                valueX = x + (fieldWidth - valueWidth) / 2;
            }
            canvas.drawText(formattedValue, valueX, y + labelSize + 5, valuePaint);
        });

        return y + labelSize + valueSize + 15;
    }

    /**
     * Format field value based on style attributes
     */
    public formatFieldValue(field: PKPassField, currentLang: string): string {
        let value = String(field.value);
        // Handle date/time formatting
        if (field.dateStyle || field.timeStyle) {
            let date = dayjs(field.value as string);
            if (!isNaN(date.valueOf())) {
                const options: Intl.DateTimeFormatOptions = {};

                // Map PKPass date styles to Intl.DateTimeFormat options
                if (field.dateStyle && field.dateStyle !== 'PKDateStyleNone') {
                    const dateStyleMap = {
                        PKDateStyleShort: 'L',
                        PKDateStyleMedium: 'll',
                        PKDateStyleLong: 'LL',
                        PKDateStyleFull: 'dddd, MMMM D, YYYY'
                    };
                    options.dateStyle = dateStyleMap[field.dateStyle] as any;
                }

                if (field.timeStyle && field.timeStyle !== 'PKDateStyleNone') {
                    const timeStyleMap = {
                        PKDateStyleShort: 'LT',
                        PKDateStyleMedium: 'LTS',
                        PKDateStyleLong: 'LTS',
                        PKDateStyleFull: 'LTS'
                    };
                    options.timeStyle = timeStyleMap[field.timeStyle] as any;
                }
                if (field.ignoresTimeZone) {
                    date = dayjs.utc(field.value);
                }
                return date.format(options.timeStyle);
            }
        }
        value = this.getLocalizedValue(value, currentLang);

        // Handle number formatting
        if (field.numberStyle && typeof field.value === 'number') {
            try {
                const options: Intl.NumberFormatOptions = {};

                if (field.numberStyle === 'PKNumberStylePercent') {
                    value = value + '%';
                } else if (field.numberStyle === 'PKNumberStyleScientific') {
                    // options.notation = 'scientific';
                } else if (field.currencyCode) {
                    options.style = 'currency';
                    value = formatCurrency(field.value, field.currencyCode);
                } else {
                }
            } catch (e) {
                console.warn('Error formatting number:', e);
            }
        }

        return value;
    }

    static fromJSON(jsonObj: any): PKPass {
        const pass = new PKPass(jsonObj.id, jsonObj.page_id || jsonObj.document_id); // Support both old and new schema
        Object.assign(pass, {
            passData: typeof jsonObj.passData === 'string' ? JSON.parse(jsonObj.passData) : jsonObj.passData,
            images: typeof jsonObj.images === 'string' ? JSON.parse(jsonObj.images) : jsonObj.images,
            passJsonPath: jsonObj.passJsonPath,
            imagesPath: jsonObj.imagesPath,
            createdDate: jsonObj.createdDate,
            modifiedDate: jsonObj.modifiedDate
        });
        return pass;
    }

    toJSON() {
        return {
            id: this.id,
            page_id: this.page_id,
            passData: this.passData,
            images: this.images,
            passJsonPath: this.passJsonPath,
            imagesPath: this.imagesPath,
            createdDate: this.createdDate,
            modifiedDate: this.modifiedDate
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }
}
