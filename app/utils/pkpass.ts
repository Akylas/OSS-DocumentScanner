import { Application, Color, File, Folder, GridLayout, ImageSource, Utils, knownFolders, path } from '@nativescript/core';
import { unzip } from 'plugin-zip';
import { PKBarcodeFormat, PKPass, PKPassBarcode, PKPassData, PKPassField, PKPassImages, PKPassStructure, PKPassStyle, PKPassTransitType } from '~/models/PKPass';
import { qrcodeService } from '~/services/qrcode';
import { lang } from '~/helpers/locale';
import { OCRDocument } from '~/models/OCRDocument';
import { loadImage, recycleImages } from './images';
import { Canvas, Paint } from '@nativescript-community/ui-canvas';
import { colors, fonts, screenWidthDips } from '~/variables';
import { get } from 'svelte/store';
import { ComponentInstanceInfo, resolveComponentElement } from './ui';
import { CARD_RATIO } from './constants';
import { GestureRootView } from '@nativescript-community/gesturehandler';
import { tick } from 'svelte';
import { debounce, throttle } from '@nativescript/core/utils';

/**
 * PKPass parser utility
 * Extracts and parses .pkpass files (Apple Wallet passes)
 */

const PASS_JSON_FILE = 'pass.json';
const IMAGE_FILES = [
    'icon.png',
    'icon@2x.png',
    'icon@3x.png',
    'logo.png',
    'logo@2x.png',
    'logo@3x.png',
    'background.png',
    'background@2x.png',
    'background@3x.png',
    'footer.png',
    'footer@2x.png',
    'footer@3x.png',
    'strip.png',
    'strip@2x.png',
    'strip@3x.png',
    'thumbnail.png',
    'thumbnail@2x.png',
    'thumbnail@3x.png'
];

export interface PKPassParseResult {
    pass: PKPass;
    extractedPath: string;
}

/**
 * Load localized strings from .lproj folders in PKPass
 * @param extractPath Path to extracted PKPass contents
 * @returns Object with language codes as keys and localized strings as values
 */
function loadPKPassLocalizations(extractPath: string): { [languageCode: string]: { [key: string]: string } } {
    const localizations: { [languageCode: string]: { [key: string]: string } } = {};

    try {
        const extractFolder = Folder.fromPath(extractPath);
        const entities = extractFolder.getEntitiesSync();
        for (const entity of entities) {
            const entityName = entity.name;
            // Check if it's a .lproj folder
            if (entityName.endsWith('.lproj') && entity instanceof Folder) {
                const languageCode = entityName.replace('.lproj', '');
                const stringsFilePath = path.join(entity.path, 'pass.strings');

                if (File.exists(stringsFilePath)) {
                    try {
                        const stringsFile = File.fromPath(stringsFilePath);
                        const stringsContent = stringsFile.readTextSync();

                        // Parse .strings file (format: "key" = "value";)
                        const strings: { [key: string]: string } = {};
                        const regex = /"([^"]+)"\s*=\s*"([^"]*)"\s*;/g;
                        let match;

                        while ((match = regex.exec(stringsContent)) !== null) {
                            strings[match[1]] = match[2];
                        }

                        if (Object.keys(strings).length > 0) {
                            localizations[languageCode] = strings;
                            DEV_LOG && console.log(`Loaded ${Object.keys(strings).length} localized strings for ${languageCode}`);
                        }
                    } catch (error) {
                        console.error(`Error parsing pass.strings for ${languageCode}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading PKPass localizations:', error);
    }

    return localizations;
}

/**
 * Parse a .pkpass file and extract its contents
 * @param pkpassFilePath Path to the .pkpass file
 * @param targetFolder Folder where to extract the pass data
 * @returns PKPassParseResult with the parsed pass and extraction path
 */
export async function extractAndParsePKPassFile(pkpassFilePath: string, targetFolder: Folder): Promise<PKPassParseResult> {
    if (!File.exists(pkpassFilePath)) {
        throw new Error(`PKPass file not found: ${pkpassFilePath}`);
    }

    // Create a unique folder for this pass
    const passId = Date.now().toString();
    const extractPath = path.join(targetFolder.path, passId);
    const extractFolder = Folder.fromPath(extractPath);

    try {
        // Extract the .pkpass file (which is a ZIP archive)
        await unzip({
            archive: pkpassFilePath,
            directory: extractPath
        });

        // Read pass.json
        const passJsonPath = path.join(extractPath, PASS_JSON_FILE);
        if (!File.exists(passJsonPath)) {
            throw new Error('pass.json not found in PKPass file');
        }

        const passJsonFile = File.fromPath(passJsonPath);
        const passJsonContent = await passJsonFile.readText();
        const passData: PKPassData = JSON.parse(passJsonContent);

        // Load all localizations from .lproj folders
        const allLocalizations = loadPKPassLocalizations(extractPath);

        // Store all localizations in passData
        if (Object.keys(allLocalizations).length > 0) {
            passData._allLocalizations = allLocalizations;
        }

        // Extract image paths
        const images: PKPassImages = {};
        for (const imageFile of IMAGE_FILES) {
            const imagePath = path.join(extractPath, imageFile);
            if (File.exists(imagePath)) {
                const key = imageFile.replace('.png', '').replace('@2x', '2x').replace('@3x', '3x');
                images[key] = imagePath;
            }
        }

        // Create PKPass object
        const pass = new PKPass(passId, ''); // document_id will be set by caller
        pass.passData = passData;
        pass.images = images;
        pass.passJsonPath = passJsonPath;
        pass.imagesPath = extractPath;

        return {
            pass,
            extractedPath: extractPath
        };
    } catch (error) {
        // Clean up on error
        try {
            if (Folder.exists(extractPath)) {
                await extractFolder.remove();
            }
        } catch (cleanupError) {
            console.error('Error cleaning up after PKPass parse failure:', cleanupError);
        }
        throw error;
    }
}

/**
 * Get the display name for a PKPass
 * @param pass PKPass object
 * @returns Display name
 */
export function getPKPassDisplayName(pass: PKPass): string {
    const { passData } = pass;

    // Try to get a meaningful name from the pass
    if (passData.logoText) {
        return passData.logoText;
    }

    if (passData.organizationName) {
        return passData.organizationName;
    }

    return passData.description || 'Pass';
}

/**
 * Get the primary image for a PKPass (for display in lists)
 * @param pass PKPass object
 * @returns Path to primary image
 */
export function getPKPassPrimaryImage(pass: PKPass): string | undefined {
    const { images } = pass;

    // Priority order for primary image
    const imagePriority = [
        images.strip2x,
        images.strip,
        images.strip3x,
        images.background2x,
        images.background,
        images.background3x,
        images.logo2x,
        images.logo,
        images.logo3x,
        images.icon2x,
        images.icon,
        images.icon3x
    ];

    for (const imagePath of imagePriority) {
        if (imagePath && File.exists(imagePath)) {
            return imagePath;
        }
    }

    return undefined;
}

/**
 * Get the icon image for a PKPass
 * @param pass PKPass object
 * @returns Path to icon image
 */
export function getPKPassIconImage(pass: PKPass): string | undefined {
    const { images } = pass;

    if (images.icon2x && File.exists(images.icon2x)) {
        return images.icon2x;
    }
    if (images.icon && File.exists(images.icon)) {
        return images.icon;
    }
    if (images.icon3x && File.exists(images.icon3x)) {
        return images.icon3x;
    }

    return undefined;
}

/**
 * Validate if a file is a valid .pkpass file
 * @param filePath Path to file
 * @returns true if file appears to be a valid .pkpass file
 */
export function isPKPassFile(filePath: string): boolean {
    if (!File.exists(filePath)) {
        return false;
    }

    // Check file extension
    return filePath.toLowerCase().endsWith('.pkpass');
}

export function getFieldTextAlignment(field: PKPassField, defaultValue = 'left'): 'left' | 'right' | 'center' | 'initial' {
    if (!field) {
        return;
    }
    if (field.textAlignment) {
        return field.textAlignment.slice(15).toLowerCase() as any;
    }
    return defaultValue as any;
}

export function getBarcodeFormat(barcode: PKPassBarcode) {
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
    return barcodeFormat;
}

export async function getBarcodeSVG({ barcode, foregroundColor, width = 300 }: { barcode: PKPassBarcode; foregroundColor; width?: number }) {
    if (!barcode) return undefined;
    const barcodeFormat = getBarcodeFormat(barcode);
    try {
        // Convert PKPass barcode format to QRCodeData format
        const qrcodeData = {
            text: barcode.message,
            format: barcodeFormat,
            position: null
        };
        return await qrcodeService.getQRCodeSVG(qrcodeData, width, new Color(foregroundColor));
    } catch (error) {
        console.error('Error generating barcode image:', error);
        return undefined;
    }
}
export async function getBarcodeImage({ barcode, foregroundColor, height, width = 300 }: { barcode: PKPassBarcode; foregroundColor; width?: number; height?: number }) {
    if (!barcode) return undefined;
    try {
        // Convert PKPass barcode format to QRCodeData format
        const qrcodeData = {
            text: barcode.message,
            format: getBarcodeFormat(barcode),
            position: null
        };
        DEV_LOG && console.log('getBarcodeImage', barcode, qrcodeData);
        return await qrcodeService.getQRCodeImage(qrcodeData, width, height ?? width, new Color(foregroundColor));
    } catch (error) {
        console.error('Error generating barcode image:', error);
        return undefined;
    }
}

// Keep for backward compatibility - now checks if document has any pages with PKPass
export function documentHasPKPassData(document: OCRDocument): boolean {
    return document.pages?.some((page) => !!page.pkpass) || false;
}

/**
 * Get Material Design Icon for transit type
 * Used to display an icon between primary fields on boarding passes
 */
export function getTransitIcon(transitType?: PKPassTransitType): string | undefined {
    if (!transitType) return undefined;

    switch (transitType) {
        case PKPassTransitType.Air:
            return 'mdi-airplane';
        case PKPassTransitType.Boat:
            return 'mdi-ferry';
        case PKPassTransitType.Bus:
            return 'mdi-bus';
        case PKPassTransitType.Train:
            return 'mdi-train';
        case PKPassTransitType.Generic:
            return 'mdi-transit-connection-variant';
        default:
            return undefined;
    }
}

export async function pkpassToImage(
    pkpass: PKPass,
    options: {
        layout?: 'logo' | 'card' | 'full'; // Card for compact credit-card sized, full for complete details
        includeBackFields?: boolean;
        backgroundColor?: string;
        width?: number;
        height?: number;
        // rendering scale (dpi multiplier). 1 = native points, 2 = double resolution, etc.
        scale?: number;
    } = {}
) {
    const component = (options?.layout === 'full' ? await import('~/components/pkpass/PKPassView.svelte') : await import('~/components/pkpass/PKPassCardCell.svelte')).default;
    const primaryBarcode = pkpass.getPrimaryBarcode();
    const foregroundColor = pkpass.passData.foregroundColor || get(colors).colorOnBackground;
    let barcodeSvg;
    if (primaryBarcode && foregroundColor) {
        barcodeSvg = await getBarcodeSVG({ barcode: primaryBarcode, foregroundColor });
    }
    const itemWidth = screenWidthDips;
    const scale = (options.scale ?? options?.width) ? options?.width / itemWidth : 1;
    const componentInstanceInfo = resolveComponentElement(component, {
        pkpass,
        itemWidth,
        document: null,
        forImageRendering: true,
        barcodeSvg,
        ...(options?.layout === 'full'
            ? {
                  width: itemWidth,
                  verticalAlignment: 'top',
                  includeBackFields: false,
                  iosOverflowSafeArea:false,
                  iosIgnoreSafeArea:false
              }
            : {
                  width: itemWidth,
                  height: itemWidth * CARD_RATIO
              })
    }) as ComponentInstanceInfo<GridLayout, any>;
    const view = componentInstanceInfo.element.nativeElement;
    const gesturerootview = new GestureRootView();
    // gesturerootview.parent = Application.getRootView()
    const rootView = Application.getRootView();
    gesturerootview.addChild(view);
    if (__ANDROID__) {
        gesturerootview.visibility = 'collapsed';
    }
    (rootView as GridLayout).addChild(gesturerootview);
    const imageSource = await new Promise<ImageSource>((resolve) => {
        const onLayoutChanged = (event) => {
            const nView = view.nativeView;
            if (__ANDROID__) {
                // create a higher-resolution bitmap and scale the canvas so view is rendered at higher DPI
                const w = Math.max(1, Math.round(nView.getWidth() * scale));
                const h = Math.max(1, Math.round(nView.getHeight() * scale));
                const bmp = android.graphics.Bitmap.createBitmap(w, h, android.graphics.Bitmap.Config.ARGB_8888);
                // Set density so Android knows this is a high-DPI bitmap (improves image scaling/filtering)
                const metrics = Utils.android.getApplicationContext().getResources().getDisplayMetrics();
                // bmp.setDensity(metrics.densityDpi * scale);
                const canvas = new android.graphics.Canvas(bmp);
                canvas.setDensity(metrics.densityDpi);
                // scale so that drawing commands map correctly (view draws in logical pixels)
                canvas.scale(scale, scale);
                // nView.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
                nView.draw(canvas);
                resolve(new ImageSource(bmp));
            } else {
                const size = nView.frame.size;
                try {
                    // Use UIGraphicsBeginImageContextWithOptions to specify the scale (dpi multiplier)
                    UIGraphicsBeginImageContextWithOptions(size, false, 2);
                    nView.drawViewHierarchyInRectAfterScreenUpdates(CGRectMake(0, 0, size.width, size.height), true);
                    const imageFromContext = UIGraphicsGetImageFromCurrentImageContext();
                    UIGraphicsEndImageContext();
                    resolve(new ImageSource(imageFromContext));
                } catch (err) {
                    DEV_LOG && console.log(err, err.stack);
                    // fallback to previous renderer if anything goes wrong
                    const renderer = new UIGraphicsImageRenderer({ size });
                    const image = renderer.imageWithActions((context) => {
                        nView.drawViewHierarchyInRectAfterScreenUpdates(CGRectMake(0, 0, size.width, size.height), true);
                    });
                    resolve(new ImageSource(image));
                }
            }
        };
        view.once('layoutChanged', onLayoutChanged);
        gesturerootview.measure(Utils.layout.makeMeasureSpec(0, Utils.layout.UNSPECIFIED), Utils.layout.makeMeasureSpec(0, Utils.layout.UNSPECIFIED));

        gesturerootview.layout(0, 0, gesturerootview.getMeasuredWidth(), gesturerootview.getMeasuredHeight());
    });
    (rootView as GridLayout).removeChild(gesturerootview);
    componentInstanceInfo.element.nativeElement._tearDownUI();
    componentInstanceInfo.viewInstance?.$destroy();
    DEV_LOG && console.log('imageSource', imageSource.width, imageSource.height);
    return imageSource;
}

/**
 * Render PKPass to a canvas for export to PDF or image
 * @param canvas Canvas element to render to
 * @param options Rendering options
 * @returns Promise that resolves when rendering is complete
 */
export async function renderPKPassToCanvas(
    pkpass: PKPass,
    canvas: any,
    options: {
        layout?: 'card' | 'full'; // Card for compact credit-card sized, full for complete details
        includeBackFields?: boolean;
        backgroundColor?: string;
        width?: number;
        height?: number;
    } = {}
): Promise<void> {
    const passData = pkpass.passData;
    const { backgroundColor = passData.backgroundColor || '#ffffff', includeBackFields = false, layout = 'full', width = 600 } = options;

    // Calculate dimensions based on layout
    const baseWidth = 600;
    const scaleFactor = width / baseWidth;
    DEV_LOG && console.log('renderToCanvas', width, scaleFactor);

    // Credit card aspect ratio: 1.586:1
    const cardHeight = Math.round(width / 1.586);

    // For full layout, compute height dynamically based on content
    let computedHeight = 0;
    if (layout === 'card') {
        computedHeight = cardHeight;
    } else {
        // Estimate height for full layout
        computedHeight = computeFullLayoutHeight(pkpass, scaleFactor, includeBackFields);
    }

    const canvasWidth = width;
    const canvasHeight = options.height || computedHeight;

    // Create paints for rendering
    const bgPaint = new Paint();
    bgPaint.color = backgroundColor;

    const fgPaint = new Paint();
    fgPaint.color = passData.foregroundColor || '#000000';
    fgPaint.setAntiAlias(true);

    const iconPaint = new Paint();
    iconPaint.color = passData.foregroundColor || '#000000';
    iconPaint.fontFamily = get(fonts).mdi;
    iconPaint.setAntiAlias(true);

    const labelPaint = new Paint();
    labelPaint.color = passData.labelColor || passData.foregroundColor || '#666666';
    labelPaint.setAntiAlias(true);

    const imagePaint = new Paint();
    imagePaint.setAntiAlias(true);

    // Draw background
    canvas.drawRect(0, 0, canvasWidth, canvasHeight, bgPaint);

    const padding = 20 * scaleFactor;
    const sectionSpacing = 30 * scaleFactor;

    // Get pass structure and style
    const structure = pkpass.getPassStructure();
    const style = pkpass.getPassStyle();

    try {
        if (layout === 'card') {
            // Card layout: compact credit-card sized rendering
            await renderCardLayout({ pkpass, canvas, canvasWidth, canvasHeight, scaleFactor, structure, style, padding, labelPaint, fgPaint, imagePaint, iconPaint, lang });
        } else {
            // Full layout: comprehensive pass view
            await renderFullLayout({
                pkpass,
                canvas,
                canvasWidth,
                canvasHeight,
                scaleFactor,
                structure,
                style,
                padding,
                sectionSpacing,
                includeBackFields,
                labelPaint,
                fgPaint,
                imagePaint,
                iconPaint,
                lang
            });
        }
    } catch (error) {
        console.error('Error rendering PKPass to canvas:', error, error.stack);
        // Draw error message
        fgPaint.textSize = 16 * scaleFactor;
        canvas.drawText('Error rendering pass', padding, 50 * scaleFactor, fgPaint);
    }
}

/**
 * Compute height for full layout based on content
 */
function computeFullLayoutHeight(pkpass: PKPass, scaleFactor: number, includeBackFields: boolean): number {
    const structure = pkpass.getPassStructure();
    let height = 100 * scaleFactor; // Initial padding and header

    // Strip image (Apple spec: variable, using 150px as scaled average)
    // or background image (Apple spec: 180x220 points)
    if (pkpass.images.strip || pkpass.images.strip2x) {
        height += 150 * scaleFactor + 10 * scaleFactor;
    } else if ((pkpass.images.background || pkpass.images.background2x) && pkpass.getPassStyle() !== PKPassStyle.BoardingPass) {
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
    const barcode = pkpass.getPrimaryBarcode();
    if (barcode) {
        height += 350 * scaleFactor; // Barcode + alt text
    }

    // Back fields
    if (includeBackFields && structure?.backFields?.length) {
        height += 60 * scaleFactor; // Separator
        height += structure.backFields.length * 40 * scaleFactor;
    }

    // Footer image (Apple spec: 286x15 points)
    if (pkpass.images.footer || pkpass.images.footer2x) {
        height += 25 * scaleFactor; // Footer image + spacing
    }

    height += 50 * scaleFactor; // Bottom padding

    return Math.round(height);
}

/**
 * Render card layout (compact)
 */
async function renderCardLayout({
    canvas,
    canvasHeight,
    canvasWidth,
    fgPaint,
    iconPaint,
    imagePaint,
    labelPaint,
    lang,
    padding,
    pkpass,
    scaleFactor,
    structure,
    style
}: {
    pkpass: PKPass;
    canvas: Canvas;
    canvasWidth: number;
    canvasHeight: number;
    scaleFactor: number;
    structure: PKPassStructure;
    style: PKPassStyle;
    padding: number;
    labelPaint: Paint;
    fgPaint: Paint;
    iconPaint: Paint;
    imagePaint: Paint;
    lang: string;
}): Promise<void> {
    let y = padding;

    // Top row: Logo or Icon + Name, and header fields
    const headerY = y;
    const logoX = padding;

    // Apple spec: prefer @2x images for quality
    const logo2x = pkpass.images.logo2x || pkpass.images.logo;
    const icon2x = pkpass.images.icon2x || pkpass.images.icon;

    // Draw logo (Apple spec: max 160x50, scaled to 80px width for card) or icon (Apple spec: 29x29, scaled to ~20px)
    if (logo2x) {
        // Apple spec: max 160x50 points, scale proportionally for card
        const logoImage = await loadImage(logo2x, { width: Math.round(80 * scaleFactor), height: Math.round(40 * scaleFactor) });
        canvas.drawBitmap(logoImage, logoX, headerY, imagePaint);
        recycleImages(logoImage);
    } else if (icon2x) {
        // Apple spec: 29x29 points, scaled to ~20px for card
        const iconImage = await loadImage(icon2x, { width: Math.round(20 * scaleFactor), height: Math.round(20 * scaleFactor) });
        canvas.drawBitmap(iconImage, logoX, headerY, imagePaint);
        recycleImages(iconImage);

        // Draw organization name next to icon
        fgPaint.textSize = 14 * scaleFactor;
        canvas.drawText(pkpass.passData.organizationName || '', logoX + 26 * scaleFactor, headerY + 15 * scaleFactor, fgPaint);
    } else {
        // Just name
        fgPaint.textSize = 14 * scaleFactor;
        canvas.drawText(pkpass.passData.organizationName || '', logoX, headerY + 15 * scaleFactor, fgPaint);
    }

    // Draw header fields on the right
    if (structure?.headerFields?.length) {
        const headerFieldsX = canvasWidth - padding - 100 * scaleFactor;
        let fieldY = headerY;
        for (const field of structure.headerFields) {
            labelPaint.textSize = 11 * scaleFactor;
            const label = pkpass.getLocalizedValue(field.label || field.key, lang);
            canvas.drawText(label, headerFieldsX, fieldY, labelPaint);

            fgPaint.textSize = 14 * scaleFactor;
            const value = pkpass.formatFieldValue(field, lang);
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
        const leftLabel = pkpass.getLocalizedValue(structure.primaryFields[0].label || '', lang);
        canvas.drawText(leftLabel, padding, y, labelPaint);

        fgPaint.textSize = 28 * scaleFactor;
        const leftValue = pkpass.formatFieldValue(structure.primaryFields[0], lang);
        canvas.drawText(leftValue, padding, y + 35 * scaleFactor, fgPaint);

        const transitIcon = getTransitIcon(transitType);
        // Transit icon (center) - simplified, just text representation
        iconPaint.textSize = 32 * scaleFactor;
        canvas.drawText(transitIcon, padding + fieldWidth, y + 20 * scaleFactor, iconPaint);

        // Right field (arrival)
        labelPaint.textSize = 10 * scaleFactor;
        const rightLabel = pkpass.getLocalizedValue(structure.primaryFields[1].label || '', lang);
        const rightLabelWidth = labelPaint.measureText(rightLabel);
        canvas.drawText(rightLabel, canvasWidth - padding - rightLabelWidth, y, labelPaint);

        fgPaint.textSize = 28 * scaleFactor;
        const rightValue = pkpass.formatFieldValue(structure.primaryFields[1], lang);
        const rightValueWidth = fgPaint.measureText(rightValue);
        canvas.drawText(rightValue, canvasWidth - padding - rightValueWidth, y + 35 * scaleFactor, fgPaint);

        y += 60 * scaleFactor;
    } else if (structure?.primaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.primaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 10 * scaleFactor, 24 * scaleFactor, lang);
    }

    y += 20 * scaleFactor;

    // Bottom row: Secondary and auxiliary fields
    if (structure?.secondaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.secondaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 9 * scaleFactor, 11 * scaleFactor, lang);
        y += 10 * scaleFactor;
    }

    if (structure?.auxiliaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.auxiliaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 9 * scaleFactor, 11 * scaleFactor, lang);
    }
}

/**
 * Render full layout (comprehensive)
 */
async function renderFullLayout({
    canvas,
    canvasHeight,
    canvasWidth,
    fgPaint,
    iconPaint,
    imagePaint,
    includeBackFields,
    labelPaint,
    lang,
    padding,
    pkpass,
    scaleFactor,
    sectionSpacing,
    structure,
    style
}: {
    pkpass: PKPass;
    canvas: Canvas;
    canvasWidth: number;
    canvasHeight: number;
    scaleFactor: number;
    structure: PKPassStructure;
    style: PKPassStyle;
    padding: number;
    labelPaint: Paint;
    fgPaint: Paint;
    iconPaint: Paint;
    sectionSpacing: number;
    includeBackFields: boolean;
    imagePaint: Paint;
    lang: string;
}): Promise<void> {
    let y = 20 * scaleFactor;

    // Apple spec: prefer @2x images for quality
    const strip2x = pkpass.images.strip2x || pkpass.images.strip;
    const background2x = pkpass.images.background2x || pkpass.images.background;
    const icon2x = pkpass.images.icon2x || pkpass.images.icon;
    const logo2x = pkpass.images.logo2x || pkpass.images.logo;
    const thumbnail2x = pkpass.images.thumbnail2x || pkpass.images.thumbnail;
    const footer2x = pkpass.images.footer2x || pkpass.images.footer;

    // 1. Draw strip image behind primary fields (Apple spec: variable dimensions)
    // iPhone 6+: 375x98 (events), 375x144 (gift/coupon), 375x123 (other)
    // Earlier: 320x84 (events), 320x110 (square barcode), 320x123 (other)
    if (strip2x) {
        const stripImage = await loadImage(strip2x, { width: canvasWidth, height: Math.round(150 * scaleFactor) });
        canvas.drawBitmap(stripImage, 0, y, imagePaint);
        recycleImages(stripImage);
        y += Math.round(150 * scaleFactor) + Math.round(10 * scaleFactor);
    } else if (background2x && style !== PKPassStyle.BoardingPass) {
        // Background image (Apple spec: 180x220 points) - not typically used with strip
        // Draw as backdrop if no strip and not boarding pass
        const bgImage = await loadImage(background2x, { width: canvasWidth, height: canvasHeight });
        canvas.drawBitmap(bgImage, 0, 0, imagePaint);
        recycleImages(bgImage);
    }

    // 2. Draw header section (icon, logo, thumbnail per Apple specs)
    const headerY = y;
    let logoX = padding;

    // Draw icon if available (Apple spec: 29x29 points)
    if (icon2x) {
        const iconImage = await loadImage(icon2x, { width: Math.round(29 * scaleFactor), height: Math.round(29 * scaleFactor) });
        DEV_LOG && console.log('rendering icon', icon2x, iconImage.android, File.exists(icon2x));
        canvas.drawBitmap(iconImage, padding, headerY, imagePaint);
        recycleImages(iconImage);
        logoX += Math.round(35 * scaleFactor);
    }

    // Draw logo if available (Apple spec: max 160x50 points)
    if (logo2x) {
        const logoImage = await loadImage(logo2x, { width: Math.round(160 * scaleFactor), height: Math.round(50 * scaleFactor) });
        canvas.drawBitmap(logoImage, logoX, headerY, imagePaint);
        recycleImages(logoImage);
    }

    // Draw thumbnail if available (Apple spec: 90x90 points)
    if (thumbnail2x) {
        const thumbImage = await loadImage(thumbnail2x, { width: Math.round(90 * scaleFactor), height: Math.round(90 * scaleFactor) });
        canvas.drawBitmap(thumbImage, canvasWidth - Math.round(90 * scaleFactor) - padding, headerY, imagePaint);
        recycleImages(thumbImage);
    }

    // Draw logo text if available
    if (pkpass.passData.logoText) {
        fgPaint.textSize = 14 * scaleFactor;
        const logoText = pkpass.getLocalizedValue(pkpass.passData.logoText, lang);
        canvas.drawText(logoText, logoX, headerY + Math.round(55 * scaleFactor), fgPaint);
    }

    y = headerY + Math.round(70 * scaleFactor);

    // 3. Draw header fields
    if (structure?.headerFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.headerFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 16 * scaleFactor, lang);
        y += sectionSpacing;
    }

    // 4. Draw primary fields (larger text)
    if (structure?.primaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.primaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 14 * scaleFactor, 28 * scaleFactor, lang);
        y += sectionSpacing;
    }

    // 5. Draw secondary fields
    if (structure?.secondaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.secondaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 18 * scaleFactor, lang);
        y += sectionSpacing;
    }

    // 6. Draw auxiliary fields
    if (structure?.auxiliaryFields?.length) {
        y = drawFieldGroup(pkpass, canvas, structure.auxiliaryFields, y, canvasWidth, padding, labelPaint, fgPaint, 10 * scaleFactor, 14 * scaleFactor, lang);
        y += sectionSpacing;
    }

    // 7. Draw barcode if available
    const barcode = pkpass.getPrimaryBarcode();
    if (barcode) {
        try {
            const barcodeWidth = Math.min(Math.round(300 * scaleFactor), canvasWidth - 2 * padding);
            const barcodeImage = await getBarcodeImage({ barcode, foregroundColor: pkpass.passData.foregroundColor || '#000000', width: barcodeWidth });

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
        separatorPaint.color = pkpass.passData.foregroundColor || '#cccccc';
        separatorPaint.strokeWidth = 1;
        canvas.drawLine(padding, y, canvasWidth - padding, y, separatorPaint);
        y += sectionSpacing;

        y = drawFieldGroup(pkpass, canvas, structure.backFields, y, canvasWidth, padding, labelPaint, fgPaint, 12 * scaleFactor, 16 * scaleFactor, lang);
    }

    // 9. Draw footer image if available (Apple spec: 286x15 points)
    if (footer2x) {
        try {
            const footerImage = await loadImage(footer2x, { width: Math.round(286 * scaleFactor), height: Math.round(15 * scaleFactor) });
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
function drawFieldGroup(
    pkpass: PKPass,
    canvas: Canvas,
    fields: PKPassField[],
    startY: number,
    canvasWidth: number,
    padding: number,
    labelPaint: Paint,
    valuePaint: Paint,
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
        const label = pkpass.getLocalizedValue(field.label || field.key, currentLang);

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
        const formattedValue = pkpass.formatFieldValue(field, currentLang);

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
