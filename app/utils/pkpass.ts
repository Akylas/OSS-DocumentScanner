import { File, Folder, knownFolders, path, Device } from '@nativescript/core';
import { unzip } from 'plugin-zip';
import { PKPass, PKPassBarcode, PKPassData, PKPassImages } from '~/models/PKPass';
import { qrcodeService } from '~/services/qrcode';
import { getCurrentISO3Language } from '~/helpers/locale';

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
 * Get the best matching localization for current device language
 * @param localizations All available localizations
 * @param currentLang Current device language (e.g., 'en', 'fr', 'de')
 * @returns Best matching localized strings or empty object
 */
function getBestMatchingLocalization(localizations: { [languageCode: string]: { [key: string]: string } }, currentLang: string): { [key: string]: string } {
    if (!localizations || Object.keys(localizations).length === 0) {
        return {};
    }
    
    // Normalize current language (handle both 'en_US' and 'en-US' formats)
    const normalizedLang = currentLang.replace('_', '-').toLowerCase();
    const langCode = normalizedLang.split('-')[0]; // Get base language code (e.g., 'en' from 'en-US')
    
    // Try exact match first (e.g., 'en-US')
    if (localizations[normalizedLang]) {
        return localizations[normalizedLang];
    }
    
    // Try base language code (e.g., 'en')
    if (localizations[langCode]) {
        return localizations[langCode];
    }
    
    // Try locale-specific variants (e.g., 'en_US', 'en-GB')
    for (const key of Object.keys(localizations)) {
        const keyLower = key.toLowerCase();
        if (keyLower.startsWith(langCode + '-') || keyLower.startsWith(langCode + '_')) {
            return localizations[key];
        }
    }
    
    // Fall back to 'en' if available
    if (localizations['en']) {
        return localizations['en'];
    }
    
    // Fall back to first available localization
    const firstKey = Object.keys(localizations)[0];
    return localizations[firstKey];
}

/**
 * Apply localization to pass data
 * @param passData Original pass data
 * @param localizedStrings Localized strings for current language
 * @returns Pass data with localized strings applied
 */
function applyLocalizationToPassData(passData: PKPassData, localizedStrings: { [key: string]: string }): PKPassData {
    if (!localizedStrings || Object.keys(localizedStrings).length === 0) {
        return passData;
    }
    
    // Create a deep copy to avoid modifying original
    const localizedPassData = JSON.parse(JSON.stringify(passData));
    
    // Helper function to localize a field value
    const localizeValue = (value: any): any => {
        if (typeof value === 'string' && localizedStrings[value]) {
            return localizedStrings[value];
        }
        return value;
    };
    
    // Localize top-level strings
    if (localizedPassData.logoText) {
        localizedPassData.logoText = localizeValue(localizedPassData.logoText);
    }
    if (localizedPassData.description) {
        localizedPassData.description = localizeValue(localizedPassData.description);
    }
    
    // Localize field structures (boardingPass, eventTicket, etc.)
    const passStructures = [
        'boardingPass',
        'coupon',
        'eventTicket',
        'generic',
        'storeCard'
    ];
    
    for (const structureType of passStructures) {
        if (localizedPassData[structureType]) {
            const structure = localizedPassData[structureType];
            const fieldTypes = ['headerFields', 'primaryFields', 'secondaryFields', 'auxiliaryFields', 'backFields'];
            
            for (const fieldType of fieldTypes) {
                if (structure[fieldType] && Array.isArray(structure[fieldType])) {
                    structure[fieldType] = structure[fieldType].map(field => ({
                        ...field,
                        label: localizeValue(field.label),
                        value: localizeValue(field.value)
                    }));
                }
            }
        }
    }
    
    // Store all localizations in passData for future use
    localizedPassData._localizations = localizedStrings;
    
    return localizedPassData;
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
        let passData: PKPassData = JSON.parse(passJsonContent);

        DEV_LOG && console.log('PKPass data parsed', passData.organizationName, passData.description);

        // Load all localizations from .lproj folders
        const allLocalizations = loadPKPassLocalizations(extractPath);
        DEV_LOG && console.log('PKPass localizations found:', Object.keys(allLocalizations));
        
        // Get current device language
        const currentLang = Device.language;
        DEV_LOG && console.log('Device language:', currentLang);
        
        // Get best matching localization
        const localizedStrings = getBestMatchingLocalization(allLocalizations, currentLang);
        
        // Apply localization to pass data
        if (Object.keys(localizedStrings).length > 0) {
            passData = applyLocalizationToPassData(passData, localizedStrings);
            DEV_LOG && console.log('Applied localization with', Object.keys(localizedStrings).length, 'strings');
        }
        
        // Store all localizations in passData for language switching
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
