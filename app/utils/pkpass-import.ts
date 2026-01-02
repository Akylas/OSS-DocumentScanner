import { File, Folder, knownFolders, path } from '@nativescript/core';
import { DocFolder, OCRDocument, PageData } from '~/models/OCRDocument';
import { PKPass } from '~/models/PKPass';
import { documentsService } from '~/services/documents';
import { extractAndParsePKPassFile, getPKPassDisplayName, getPKPassPrimaryImage } from '~/utils/pkpass';
import { getFormatedDateForFilename } from '~/utils/utils.common';
import { DOCUMENT_NAME_FORMAT, SETTINGS_DOCUMENT_NAME_FORMAT } from '~/utils/constants';
import { ApplicationSettings, ImageSource } from '@nativescript/core';

/**
 * Import a PKPass file and create a document from it
 * @param pkpassPath Path to the .pkpass file
 * @param folder Optional folder to add the document to
 * @returns Created document with PKPass data
 */
export async function importPKPassFile(pkpassPath: string, folder?: DocFolder): Promise<OCRDocument> {
    DEV_LOG && console.log('importPKPassFile', pkpassPath, folder?.name);

    if (!File.exists(pkpassPath)) {
        throw new Error(`PKPass file not found: ${pkpassPath}`);
    }

    // Parse the PKPass file
    const targetFolderPath = path.join(knownFolders.temp().path, 'pkpass_temp');
    if (Folder.exists(targetFolderPath)) {
        Folder.fromPath(targetFolderPath).removeSync();
    }
    const targetFolder = Folder.fromPath(targetFolderPath, true);
    const parseResult = await extractAndParsePKPassFile(pkpassPath, targetFolder);
    const { extractedPath, pass } = parseResult;

    try {
        // Create a document for this pass
        const date = Date.now();
        const docId = date + '';
        const passDisplayName = getPKPassDisplayName(pass);
        const name = passDisplayName || getFormatedDateForFilename(date, ApplicationSettings.getString(SETTINGS_DOCUMENT_NAME_FORMAT, DOCUMENT_NAME_FORMAT), false);

        DEV_LOG && console.log('Creating document for PKPass', docId, name);

        // Get the primary image for the pass
        const primaryImagePath = getPKPassPrimaryImage(pass);

        // Create page data for the document
        const pagesData: PageData[] = [];

        if (primaryImagePath) {
            // Add the primary image as the first page
            pagesData.push({
                imagePath: primaryImagePath
            });
        } else {
            // If no image, create an empty page (the card will show PKPass data)
            // We still need at least one page for the document structure
            pagesData.push({
                id: `${docId}_0`
            });
        }

        // Create the document
        const doc = await documentsService.documentRepository.createDocument({
            id: docId,
            name,
            extra: {
                pkpass: true, // Mark this document as having PKPass data
                color: pass.passData.backgroundColor
            },
            ...(folder ? { folders: [folder.id] } : {})
        } as any);

        // Add pages
        await doc.addPages(pagesData, false);

        // Move extracted pass data to document folder
        const docFolder = doc.folderPath;
        const pkpassFolder = docFolder.getFolder('pkpass');

        // Copy extracted files to document folder
        const extractedFolder = Folder.fromPath(extractedPath);
        const entities = await extractedFolder.getEntities();
        for (const entity of entities) {
            const destPath = path.join(pkpassFolder.path, entity.name);
            if (entity instanceof File) {
                await entity.copy(destPath);
            }
        }

        // Clean up temp folder
        await extractedFolder.remove();

        // Update pass paths
        pass.document_id = docId;
        pass.passJsonPath = path.join(pkpassFolder.path, 'pass.json');
        pass.imagesPath = pkpassFolder.path;

        // Update images paths
        if (pass.images) {
            const updatedImages = {};
            Object.keys(pass.images).forEach((key) => {
                const imageName = pass.images[key].split('/').pop();
                updatedImages[key] = path.join(pkpassFolder.path, imageName);
            });
            pass.images = updatedImages;
        }

        // Save PKPass to database
        await documentsService.pkpassRepository.createPKPass(pass);

        // Save document
        await doc.save({}, false, false);

        DEV_LOG && console.log('PKPass imported successfully', doc.id);

        return doc;
    } catch (error) {
        // Clean up on error
        try {
            const tempFolder = Folder.fromPath(extractedPath);
            if (Folder.exists(extractedPath)) {
                await tempFolder.remove();
            }
        } catch (cleanupError) {
            console.error('Error cleaning up after PKPass import failure:', cleanupError);
        }
        throw error;
    }
}

/**
 * Get PKPass data for a document
 * @param document Document to get PKPass data for
 * @returns PKPass object or null if document doesn't have PKPass data
 */
export function getPKPassForDocument(document: OCRDocument): PKPass | null {
    // PKPass is now loaded automatically with the document
    return document.pkpass || null;
}

/**
 * Check if a document has PKPass data
 * @param document Document to check
 * @returns true if document has PKPass data
 */
export function hasPKPassData(document: OCRDocument): boolean {
    return !!document.pkpass;
}
