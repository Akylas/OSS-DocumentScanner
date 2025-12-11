import { ApplicationSettings, File, Folder, knownFolders, path } from '@nativescript/core';
import dayjs from 'dayjs';
import { DOCUMENT_DATA_FILENAME, EVENT_DOCUMENT_ADDED, FOLDERS_DATA_FILENAME } from '~/utils/constants';
import { basename } from '~/utils/path';
import { unzip, zip } from 'plugin-zip';
import { restoreSettings } from '~/utils/settings';
import { DocumentsService } from './documents';
import { copyFolderContent } from '~/utils/file';
import { DocFolder } from '~/models/OCRDocument';

const BACKUP_FILENAME_PREFIX = `${__APP_ID__}_backup_`;

export class BackupService {
    static async createBackup(documentsService: DocumentsService, zipPath: string): Promise<boolean> {
        const tempBackupDir = knownFolders.temp().getFolder(`backup_${Date.now()}`, true);

        try {
            // Create a temporary directory structure for backup
            // 1. Copy all documents data
            const dataFolder = documentsService.dataFolder;
            const localDocuments = await documentsService.documentRepository.findDocuments();
            const backupDataFolder = tempBackupDir.getFolder('data', true);
            for (let index = 0; index < localDocuments.length; index++) {
                const document = localDocuments[index];
                const docFolder = dataFolder.getFolder(document.id);
                await this.copyFolderRecursive(docFolder.path, path.join(backupDataFolder.path, document.id));

                await File.fromPath(path.join(backupDataFolder.path, document.id, DOCUMENT_DATA_FILENAME)).writeText(document.toString(), 'utf8');
            }

            // 2. Export folders.json
            const folders = await documentsService.folderRepository.search();
            const foldersData = JSON.stringify(folders.map((f) => f.toJSON()));
            await File.fromPath(path.join(tempBackupDir.path, FOLDERS_DATA_FILENAME)).writeText(foldersData, 'utf8');

            // 3. Export settings
            // const settingsData = ApplicationSettings.getAllJSON();
            // DEV_LOG && console.log('settingsData', settingsData);
            // await File.fromPath(path.join(tempBackupDir.path, 'settings.json')).writeText(settingsData, 'utf8');
            // DEV_LOG && console.log('settingsData test', settingsData, path.join(tempBackupDir.path, 'settings.json'), File.fromPath(path.join(tempBackupDir.path, 'settings.json')).readTextSync());

            // 4. Create ZIP file
            const zipFileName = `${BACKUP_FILENAME_PREFIX}${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
            const outputZipPath = Folder.fromPath(zipPath).getFile(zipFileName, true).path;

            await zip({ directory: tempBackupDir.path, archive: outputZipPath });

            // Clean up temp files
            await tempBackupDir.remove();
            // await File.fromPath(tempZipPath).remove();

            return true;
        } catch (error) {
            // Clean up on error
            if (Folder.exists(tempBackupDir.path)) {
                await tempBackupDir.remove();
            }
            throw error;
        }
    }

    static async restoreBackup(documentsService: DocumentsService, zipPath: string): Promise<void> {
        const tempRestoreDir = knownFolders.temp().getFolder(`restore_${Date.now()}`);

        try {
            // 1. Unzip to temp directory
            await unzip({ archive: zipPath, directory: tempRestoreDir.path });

            // 2. Restore settings
            // const settingsFile = tempRestoreDir.getFile('settings.json');
            // if (File.exists(settingsFile.path)) {
            //     await restoreSettings(settingsFile.path);

            // }

            // // 3. Clear existing documents
            // const existingDocs = await documentsService.documentRepository.search();
            // if (existingDocs.length > 0) {
            //     await documentsService.deleteDocuments(existingDocs);
            // }

            // 4. Restore folders
            const foldersFile = tempRestoreDir.getFile(FOLDERS_DATA_FILENAME);
            if (File.exists(foldersFile.path)) {
                const foldersData = JSON.parse(foldersFile.readTextSync());
                for (const folderData of foldersData) {
                    try {
                        const existing = await documentsService.folderRepository.existsById(folderData.id);
                        DEV_LOG && console.log('existing', existing);
                        if (existing) {
                            // we already have this one
                            continue;
                        }
                        await documentsService.folderRepository.create(folderData);
                    } catch (error) {
                        DEV_LOG && console.error('Error creating folder:', error);
                    }
                }
            }

            // 5. Restore documents
            const backupDataFolder = tempRestoreDir.getFolder('data');
            if (Folder.exists(backupDataFolder.path)) {
                const docDirs = await backupDataFolder.getEntities();
                for (const docDir of docDirs) {
                    if (docDir instanceof Folder) {
                        await this.restoreDocument(documentsService, docDir);
                    }
                }
            }

            // Clean up
            await tempRestoreDir.remove();
        } catch (error) {
            // Clean up on error
            if (Folder.exists(tempRestoreDir.path)) {
                await tempRestoreDir.remove();
            }
            throw error;
        }
    }

    private static async restoreDocument(documentsService: DocumentsService, docFolder: Folder): Promise<void> {
        const dataFile = docFolder.getFile(DOCUMENT_DATA_FILENAME);
        if (!File.exists(dataFile.path)) {
            return;
        }

        const docData = JSON.parse(dataFile.readTextSync());
        const { db_version, folders, pages, ...docProps } = docData;
        const existing = await documentsService.documentRepository.existsById(docProps.id);
        DEV_LOG && console.log('existing', existing);
        if (existing) {
            // we already have this one
            return;
        }
        try {
            // Create document
            const doc = await documentsService.documentRepository.createDocument({
                ...docProps,
                folders,
                _synced: 0
            });

            // Copy document data folder
            const targetDocFolder = documentsService.dataFolder.getFolder(doc.id);
            await this.copyFolderRecursive(docFolder.path, targetDocFolder.path);

            // Add pages with corrected paths
            if (pages && pages.length > 0) {
                pages.forEach((page) => {
                    const pageDataFolder = targetDocFolder.getFolder(page.id);
                    page.sourceImagePath = path.join(pageDataFolder.path, basename(page.sourceImagePath));
                    page.imagePath = path.join(pageDataFolder.path, basename(page.imagePath));
                });
                await doc.addPages(pages, true, true);
            }
            let folder: DocFolder;
            if (folders) {
                folder = await documentsService.folderRepository.get(folders[0]);
            }
            documentsService.notify({ eventName: EVENT_DOCUMENT_ADDED, doc, folder });
        } catch (error) {
            DEV_LOG && console.error('Error restoring document:', docProps.id, error);
            throw error;
        }
    }

    private static async copyFolderRecursive(srcPath: string, dstPath: string): Promise<void> {
        return copyFolderContent(srcPath, dstPath);
    }
}
