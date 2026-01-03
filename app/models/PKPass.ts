import { Observable } from '@nativescript/core';

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
            includeBackFields?: boolean;
            backgroundColor?: string;
            width?: number;
            height?: number;
        } = {}
    ): Promise<void> {
        const { Canvas, LayoutAlignment, Paint, StaticLayout } = await import('@nativescript-community/ui-canvas');
        const { loadImage, recycleImages } = await import('~/utils/images');
        const { getSVGFromQRCode } = await import('plugin-nativeprocessor');
        const { lang } = await import('~/helpers/locale');
        const { path } = await import('@nativescript/core');

        const { backgroundColor = this.passData.backgroundColor || '#ffffff', height = options.includeBackFields ? 1200 : 800, includeBackFields = false, width = 600 } = options;

        const canvasWidth = canvas.getWidth?.() || width;
        const canvasHeight = canvas.getHeight?.() || height;

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

        let y = 20; // Starting Y position
        const padding = 20;
        const sectionSpacing = 30;

        // Get pass structure and style
        const structure = this.getPassStructure();
        const style = this.getPassStyle();

        try {
            // 1. Draw strip or background image if available
            if (this.images.strip) {
                const stripPath = path.join(this.imagesPath, this.images.strip);
                const stripImage = await loadImage(stripPath, { width: canvasWidth, height: 150 });
                canvas.drawBitmap(stripImage, 0, y, imagePaint);
                recycleImages(stripImage);
                y += 150 + 10;
            } else if (this.images.background && style !== PKPassStyle.BoardingPass) {
                const bgPath = path.join(this.imagesPath, this.images.background);
                const bgImage = await loadImage(bgPath, { width: canvasWidth, height: canvasHeight });
                canvas.drawBitmap(bgImage, 0, 0, imagePaint);
                recycleImages(bgImage);
            }

            // 2. Draw header section (icon, logo, thumbnail)
            const headerY = y;
            let logoX = padding;

            // Draw icon if available
            if (this.images.icon) {
                const iconPath = path.join(this.imagesPath, this.images.icon);
                const iconImage = await loadImage(iconPath, { width: 30, height: 30 });
                canvas.drawBitmap(iconImage, padding, headerY, imagePaint);
                recycleImages(iconImage);
                logoX += 40;
            }

            // Draw logo if available
            if (this.images.logo) {
                const logoPath = path.join(this.imagesPath, this.images.logo);
                const logoImage = await loadImage(logoPath, { width: 120, height: 40 });
                canvas.drawBitmap(logoImage, logoX, headerY, imagePaint);
                recycleImages(logoImage);
            }

            // Draw thumbnail if available (right side)
            if (this.images.thumbnail) {
                const thumbPath = path.join(this.imagesPath, this.images.thumbnail);
                const thumbImage = await loadImage(thumbPath, { width: 50, height: 50 });
                canvas.drawBitmap(thumbImage, canvasWidth - 50 - padding, headerY, imagePaint);
                recycleImages(thumbImage);
            }

            // Draw logo text if available
            if (this.passData.logoText) {
                fgPaint.textSize = 14;
                const logoText = this.getLocalizedValue(this.passData.logoText, lang);
                canvas.drawText(logoText, logoX, headerY + 55, fgPaint);
            }

            y = headerY + 70;

            // 3. Draw header fields
            if (structure?.headerFields?.length) {
                y = this.drawFieldGroup(canvas, structure.headerFields, y, canvasWidth, padding, labelPaint, fgPaint, 12, 16, lang);
                y += sectionSpacing;
            }

            // 4. Draw primary fields (larger text)
            if (structure?.primaryFields?.length) {
                y = this.drawFieldGroup(canvas, structure.primaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 14, 28, lang);
                y += sectionSpacing;
            }

            // 5. Draw secondary fields
            if (structure?.secondaryFields?.length) {
                y = this.drawFieldGroup(canvas, structure.secondaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 12, 18, lang);
                y += sectionSpacing;
            }

            // 6. Draw auxiliary fields
            if (structure?.auxiliaryFields?.length) {
                y = this.drawFieldGroup(canvas, structure.auxiliaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 10, 14, lang);
                y += sectionSpacing;
            }

            // 7. Draw barcode if available
            const barcode = this.getPrimaryBarcode();
            if (barcode) {
                try {
                    // Map PKPass barcode format to our format
                    let barcodeFormat = 'QRCode';
                    switch (barcode.format) {
                        case PKBarcodeFormat.QR:
                            barcodeFormat = 'QRCode';
                            break;
                        case PKBarcodeFormat.PDF417:
                            barcodeFormat = 'PDF417';
                            break;
                        case PKBarcodeFormat.Aztec:
                            barcodeFormat = 'Aztec';
                            break;
                        case PKBarcodeFormat.Code128:
                            barcodeFormat = 'Code128';
                            break;
                    }

                    const barcodeWidth = Math.min(300, canvasWidth - 2 * padding);
                    const svgString = await getSVGFromQRCode(barcode.message, barcodeFormat, barcodeWidth, {
                        color: this.passData.foregroundColor || '#000000'
                    });

                    // Draw barcode alt text if available
                    if (barcode.altText) {
                        fgPaint.textSize = 12;
                        const textWidth = fgPaint.measureText(barcode.altText);
                        canvas.drawText(barcode.altText, (canvasWidth - textWidth) / 2, y + barcodeWidth + 20, fgPaint);
                    }

                    y += barcodeWidth + 40;
                } catch (error) {
                    console.error('Error rendering barcode:', error);
                }
            }

            // 8. Draw back fields if requested
            if (includeBackFields && structure?.backFields?.length) {
                y += sectionSpacing;
                // Draw separator line
                const separatorPaint = new Paint();
                separatorPaint.color = this.passData.foregroundColor || '#cccccc';
                separatorPaint.strokeWidth = 1;
                canvas.drawLine(padding, y, canvasWidth - padding, y, separatorPaint);
                y += sectionSpacing;

                y = this.drawFieldGroup(canvas, structure.backFields, y, canvasWidth, padding, labelPaint, fgPaint, 12, 16, lang);
            }
        } catch (error) {
            console.error('Error rendering PKPass to canvas:', error);
            // Draw error message
            fgPaint.textSize = 16;
            canvas.drawText('Error rendering pass', padding, 50, fgPaint);
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
        const { Paint } = require('@nativescript-community/ui-canvas');
        const y = startY;
        const fieldWidth = (canvasWidth - 2 * padding - (fields.length - 1) * 10) / fields.length;

        fields.forEach((field, index) => {
            const x = padding + index * (fieldWidth + 10);

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

        return y + labelSize + valueSize + 10;
    }

    /**
     * Format field value based on style attributes
     */
    private formatFieldValue(field: PKPassField, currentLang: string): string {
        let value = String(field.value);
        value = this.getLocalizedValue(value, currentLang);

        // Handle date/time formatting
        if (field.dateStyle || field.timeStyle) {
            try {
                const date = new Date(field.value as string);
                if (!isNaN(date.getTime())) {
                    const options: Intl.DateTimeFormatOptions = {};
                    
                    // Map PKPass date styles to Intl.DateTimeFormat options
                    if (field.dateStyle && field.dateStyle !== 'PKDateStyleNone') {
                        const dateStyleMap = {
                            'PKDateStyleShort': 'short',
                            'PKDateStyleMedium': 'medium',
                            'PKDateStyleLong': 'long',
                            'PKDateStyleFull': 'full'
                        };
                        options.dateStyle = dateStyleMap[field.dateStyle] as any;
                    }
                    
                    if (field.timeStyle && field.timeStyle !== 'PKDateStyleNone') {
                        const timeStyleMap = {
                            'PKDateStyleShort': 'short',
                            'PKDateStyleMedium': 'medium',
                            'PKDateStyleLong': 'long',
                            'PKDateStyleFull': 'full'
                        };
                        options.timeStyle = timeStyleMap[field.timeStyle] as any;
                    }
                    
                    // Handle timezone
                    if (!field.ignoresTimeZone) {
                        options.timeZone = undefined; // Use local timezone
                    } else {
                        options.timeZone = 'UTC';
                    }
                    
                    value = new Intl.DateTimeFormat(currentLang, options).format(date);
                }
            } catch (e) {
                console.warn('Error formatting date/time:', e);
            }
        }
        
        // Handle number formatting
        if (field.numberStyle && typeof field.value === 'number') {
            try {
                const options: Intl.NumberFormatOptions = {};
                
                if (field.numberStyle === 'PKNumberStylePercent') {
                    options.style = 'percent';
                } else if (field.numberStyle === 'PKNumberStyleScientific') {
                    options.notation = 'scientific';
                } else if (field.currencyCode) {
                    options.style = 'currency';
                    options.currency = field.currencyCode;
                }
                
                value = new Intl.NumberFormat(currentLang, options).format(field.value as number);
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
