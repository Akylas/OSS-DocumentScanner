import { File, Folder, knownFolders, path } from '@nativescript/core';
import { unzip } from 'plugin-zip';
import { PKPass, PKPassBarcode, PKPassData, PKPassImages } from '~/models/PKPass';
import { qrcodeService } from '~/services/qrcode';
import { lang } from '~/helpers/locale';

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
    DEV_LOG && console.log('parsePKPassFile', pkpassFilePath, targetFolder.path);

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

        DEV_LOG && console.log('PKPass extracted to', extractPath);

        // Read pass.json
        const passJsonPath = path.join(extractPath, PASS_JSON_FILE);
        if (!File.exists(passJsonPath)) {
            throw new Error('pass.json not found in PKPass file');
        }

        const passJsonFile = File.fromPath(passJsonPath);
        const passJsonContent = await passJsonFile.readText();
        const passData: PKPassData = JSON.parse(passJsonContent);

        DEV_LOG && console.log('PKPass data parsed', passData.organizationName, passData.description);

        // Load all localizations from .lproj folders
        const allLocalizations = loadPKPassLocalizations(extractPath);
        DEV_LOG && console.log('PKPass localizations found:', Object.keys(allLocalizations));

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
                DEV_LOG && console.log('Found image:', key, imagePath);
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

export async function getBarcodeImage({ barcode, foregroundColor, width = 300 }: { barcode: PKPassBarcode; foregroundColor; width?: number }): Promise<string | undefined> {
    if (!barcode) return undefined;

    try {
        // Convert PKPass barcode format to QRCodeData format
        const qrcodeData = {
            text: barcode.message,
            format: barcode.format.replace('PKBarcodeFormat', '').replace('QR', 'QRCode'),
            position: null
        };
        DEV_LOG && console.log('getBarcodeImage', barcode, qrcodeData);
        return await qrcodeService.getQRCodeSVG(qrcodeData, width, foregroundColor);
    } catch (error) {
        console.error('Error generating barcode image:', error);
        return undefined;
    }
}
