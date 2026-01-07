import { File, Folder, Utils, knownFolders, path } from '@nativescript/core';
import { DocFolder, OCRDocument, OCRPage, PageData } from '~/models/OCRDocument';
import { PKPass } from '~/models/PKPass';
import { DocumentAddedEventData, documentsService } from '~/services/documents';
import { extractAndParsePKPassFile, getPKPassDisplayName, getPKPassPrimaryImage } from '~/utils/pkpass';
import { getFormatedDateForFilename } from '~/utils/utils.common';
import { DOCUMENT_NAME_FORMAT, EVENT_DOCUMENT_ADDED, SETTINGS_DOCUMENT_NAME_FORMAT } from '~/utils/constants';
import { ApplicationSettings, ImageSource } from '@nativescript/core';
import { doInBatch } from '@shared/utils/batch';

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
        const pkPassObj = await documentsService.pkpassRepository.createPKPass(pass);

        // Create the page (no image needed)
        const pagesData: PageData[] = [
            {
                id: pageId,
                pkpass_id: pkPassObj.id,
                extra: {
                    color: pass.passData.backgroundColor
                }
            }
        ];

        // Add page to document
        await doc.addPages(pagesData, false, true);

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
    const date = Date.now();
    const docId = date + '';
    const name = getFormatedDateForFilename(date, ApplicationSettings.getString(SETTINGS_DOCUMENT_NAME_FORMAT, DOCUMENT_NAME_FORMAT), false);
    // DEV_LOG && console.log('createDocument', docId);
    const document = await documentsService.documentRepository.createDocument({ id: docId, name, ...(folder ? { folders: [folder.id] } : {}) } as any);
    DEV_LOG && console.log('importPKPassFiles', pkpassPaths);
    const pages = await doInBatch(pkpassPaths, async (uri, index) => {
        // Copy URI content to temp file if needed
        let pkpassPath = uri;
        if (__ANDROID__ && uri.startsWith('content://')) {
            // Copy content URI to temp file
            const tempDir = knownFolders.temp().path;
            const fileName = `temp_${Date.now()}.pkpass`;
            pkpassPath = path.join(tempDir, fileName);

            const context = Utils.android.getApplicationContext();
            const contentResolver = context.getContentResolver();
            const inputStream = contentResolver.openInputStream(android.net.Uri.parse(uri));
            const outputFile = new java.io.File(pkpassPath);
            const outputStream = new java.io.FileOutputStream(outputFile);

            const buffer = Array.create('byte', 4096);
            let read;
            while ((read = inputStream.read(buffer)) !== -1) {
                outputStream.write(buffer, 0, read);
            }

            inputStream.close();
            outputStream.close();
        } else if (uri.startsWith('file://')) {
            pkpassPath = uri.replace('file://', '');
        }
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
        DEV_LOG && console.log('importPKPassFile', pkpassPath, extractedPath, JSON.stringify(pass));

        // if (!document) {
        //     // Create a document for this pass
        //     const date = Date.now();
        //     const docId = date + '';
        //     const passDisplayName = getPKPassDisplayName(pass);
        //     const name = passDisplayName || getFormatedDateForFilename(date, ApplicationSettings.getString(SETTINGS_DOCUMENT_NAME_FORMAT, DOCUMENT_NAME_FORMAT), false);

        //     DEV_LOG && console.log('Creating document for PKPass', docId, name);

        //     // Create the document
        //     document = await documentsService.documentRepository.createDocument({
        //         id: docId,
        //         name,
        //         extra: {
        //             color: pass.passData.backgroundColor
        //         },
        //         ...(folder ? { folders: [folder.id] } : {})
        //     } as any);
        // }

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
            const pkPassObj = await documentsService.pkpassRepository.createPKPass(pass);
            DEV_LOG && console.log('PKPass added to document', document.id, 'page', pageId);

            // Add page to document
            return await document.addPage(
                {
                    id: pageId,
                    pkpass_id: pkPassObj.id
                },
                document.pages.length,
                (page: OCRPage) => {
                    page.pkpass = pass;
                }
            );
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
        } finally {
            // Clean up temp file if created
            if (pkpassPath !== uri && File.exists(pkpassPath)) {
                File.fromPath(pkpassPath).remove();
            }
        }
    });

    const passDisplayName = getPKPassDisplayName(pages[0].pkpass);
    //     const name = passDisplayName || getFormatedDateForFilename(date, ApplicationSettings.getString(SETTINGS_DOCUMENT_NAME_FORMAT, DOCUMENT_NAME_FORMAT), false);
    DEV_LOG && console.log('PKPasses added to document', document.id, 'pages', pages.length);
    await document.save({ name: passDisplayName }, false, false);
    documentsService.notify({ eventName: EVENT_DOCUMENT_ADDED, doc: document, folder } as DocumentAddedEventData);

    return document;
}

