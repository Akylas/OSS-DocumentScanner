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

        // Create the document
        const doc = await documentsService.documentRepository.createDocument({
            id: docId,
            name,
            extra: {
                color: pass.passData.backgroundColor
            },
            ...(folder ? { folders: [folder.id] } : {})
        } as any);

        // Create a page for this pass (no imagePath needed - pass renders directly)
        const pageId = `${docId}_0`;
        const docFolder = doc.folderPath;
        const pageFolder = docFolder.getFolder(pageId);
        const pkpassFolder = pageFolder.getFolder('pkpass');

        // Copy extracted files to page folder
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
        pass.id = pageId + '_pkpass';
        pass.page_id = pageId;
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

        // Create the page (no image needed)
        const pagesData: PageData[] = [{
            id: pageId
        }];

        // Add page to document
        await doc.addPages(pagesData, false);

        // Load the PKPass into the page
        const loadedPage = doc.pages[0];
        loadedPage.pkpass = pass;

        // Save document
        await doc.save({}, false, false);

        DEV_LOG && console.log('PKPass imported successfully', doc.id, 'page', pageId);

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
 * Import multiple PKPass files and create a document with multiple pages
 * @param pkpassPaths Array of paths to .pkpass files
 * @param folder Optional folder to add the document to
 * @returns Created document with multiple PKPass pages
 */
export async function importPKPassFiles(pkpassPaths: string[], folder?: DocFolder): Promise<OCRDocument> {
    if (!pkpassPaths || pkpassPaths.length === 0) {
        throw new Error('No PKPass files provided');
    }

    // Import first pass to create document
    const doc = await importPKPassFile(pkpassPaths[0], folder);

    // Import remaining passes as additional pages
    for (let i = 1; i < pkpassPaths.length; i++) {
        await addPKPassToDocument(doc, pkpassPaths[i]);
    }

    return doc;
}

/**
 * Add a PKPass as a new page to an existing document
 * @param document Document to add PKPass to
 * @param pkpassPath Path to the .pkpass file
 * @returns Updated document
 */
export async function addPKPassToDocument(document: OCRDocument, pkpassPath: string): Promise<OCRDocument> {
    DEV_LOG && console.log('addPKPassToDocument', document.id, pkpassPath);

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
        // Create a new page for this pass
        const pageId = `${Date.now()}_${document.pages.length}`;
        const docFolder = document.folderPath;
        const pageFolder = docFolder.getFolder(pageId);
        const pkpassFolder = pageFolder.getFolder('pkpass');

        // Copy extracted files to page folder
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
        pass.id = pageId + '_pkpass';
        pass.page_id = pageId;
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

        // Add page to document
        await document.addPage({
            id: pageId
        }, document.pages.length);

        // Load the PKPass into the page
        const loadedPage = document.pages[document.pages.length - 1];
        loadedPage.pkpass = pass;

        // Save document
        await document.save({}, true, true);

        DEV_LOG && console.log('PKPass added to document', document.id, 'page', pageId);

        return document;
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
 * Get PKPass data for a page
 * @param page Page to get PKPass data for
 * @returns PKPass object or null if page doesn't have PKPass data
 */
export function getPKPassForPage(page: OCRPage): PKPass | null {
    // PKPass is now loaded automatically with the page
    return page.pkpass || null;
}

/**
 * Check if a page has PKPass data
 * @param page Page to check
 * @returns true if page has PKPass data
 */
export function hasPKPassData(page: OCRPage): boolean {
    return !!page.pkpass;
}

// Keep for backward compatibility - now checks if document has any pages with PKPass
export function documentHasPKPassData(document: OCRDocument): boolean {
    return document.pages?.some(page => !!page.pkpass) || false;
}
