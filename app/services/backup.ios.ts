import { ApplicationSettings, File, Folder, knownFolders, path } from '@nativescript/core';
import { saveFile } from '@nativescript-community/ui-document-picker';
import dayjs from 'dayjs';
import { documentsService } from './documents';
import { DOCUMENT_DATA_FILENAME, FOLDERS_DATA_FILENAME } from '~/utils/constants';
import type { BackupService as IBackupService } from './backup';

const BACKUP_FILENAME_PREFIX = `${__APP_ID__}_backup_`;

// Note: This iOS implementation requires SSZipArchive to be added as a CocoaPod dependency
// Add to App_Resources/iOS/Podfile:
// pod 'SSZipArchive'

export class BackupService implements IBackupService {
    private static instance: BackupService;

    static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }

    async createBackup(): Promise<string> {
        const tempBackupDir = knownFolders.temp().getFolder(`backup_${Date.now()}`);
        
        try {
            // Create a temporary directory structure for backup
            // 1. Copy all documents data
            const dataFolder = documentsService.dataFolder;
            const backupDataFolder = tempBackupDir.getFolder('data');
            await this.copyFolderRecursive(dataFolder.path, backupDataFolder.path);
            
            // 2. Export folders.json
            const folders = await documentsService.folderRepository.search();
            const foldersData = JSON.stringify(folders.map(f => f.toJSON()));
            File.fromPath(path.join(tempBackupDir.path, FOLDERS_DATA_FILENAME)).writeTextSync(foldersData);
            
            // 3. Export settings
            const settingsData = ApplicationSettings.getAllJSON();
            File.fromPath(path.join(tempBackupDir.path, 'settings.json')).writeTextSync(settingsData);
            
            // 4. Create ZIP file
            const zipFileName = `${BACKUP_FILENAME_PREFIX}${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.zip`;
            const tempZipPath = path.join(knownFolders.temp().path, zipFileName);
            
            this.zipFolder(tempBackupDir.path, tempZipPath);
            
            // 5. Save the zip file using document picker
            const result = await saveFile({
                name: zipFileName,
                path: tempZipPath
            });
            
            // Clean up temp files
            await tempBackupDir.remove();
            await File.fromPath(tempZipPath).remove();
            
            return result;
        } catch (error) {
            // Clean up on error
            if (Folder.exists(tempBackupDir.path)) {
                await tempBackupDir.remove();
            }
            throw error;
        }
    }

    async restoreBackup(zipPath: string): Promise<void> {
        const tempRestoreDir = knownFolders.temp().getFolder(`restore_${Date.now()}`);
        
        try {
            // 1. Unzip to temp directory
            this.unzipFile(zipPath, tempRestoreDir.path);
            
            // 2. Restore settings
            const settingsFile = tempRestoreDir.getFile('settings.json');
            if (File.exists(settingsFile.path)) {
                const settingsData = settingsFile.readTextSync();
                const settings = JSON.parse(settingsData);
                
                const userDefaults = ApplicationSettings.getNative() as NSUserDefaults;
                const domain = NSBundle.mainBundle.bundleIdentifier;
                userDefaults.removePersistentDomainForName(domain);
                
                Object.keys(settings).forEach((k) => {
                    if (k.startsWith('_')) {
                        return;
                    }
                    const value = settings[k];
                    const type = typeof value;
                    switch (type) {
                        case 'boolean':
                            userDefaults.setBoolForKey(value, k);
                            break;
                        case 'number':
                            userDefaults.setDoubleForKey(value, k);
                            break;
                        case 'string':
                            userDefaults.setObjectForKey(value, k);
                            break;
                    }
                });
            }
            
            // 3. Clear existing documents
            const existingDocs = await documentsService.documentRepository.search();
            for (const doc of existingDocs) {
                await documentsService.deleteDocument(doc);
            }
            
            // 4. Restore folders
            const foldersFile = tempRestoreDir.getFile(FOLDERS_DATA_FILENAME);
            if (File.exists(foldersFile.path)) {
                const foldersData = JSON.parse(foldersFile.readTextSync());
                for (const folderData of foldersData) {
                    try {
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
                        await this.restoreDocument(docDir);
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

    private async restoreDocument(docFolder: Folder): Promise<void> {
        const dataFile = docFolder.getFile(DOCUMENT_DATA_FILENAME);
        if (!File.exists(dataFile.path)) {
            return;
        }
        
        const docData = JSON.parse(dataFile.readTextSync());
        const { pages, folders, ...docProps } = docData;
        
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
            
            // Add pages
            if (pages && pages.length > 0) {
                const updatedPages = pages.map(page => ({
                    ...page,
                    sourceImagePath: path.join(targetDocFolder.path, page.id, path.basename(page.sourceImagePath)),
                    imagePath: path.join(targetDocFolder.path, page.id, path.basename(page.imagePath))
                }));
                await doc.addPages(updatedPages, true, true);
            }
        } catch (error) {
            DEV_LOG && console.error('Error restoring document:', docProps.id, error);
            throw error;
        }
    }

    private async copyFolderRecursive(srcPath: string, dstPath: string): Promise<void> {
        const srcFolder = Folder.fromPath(srcPath);
        const dstFolder = Folder.fromPath(dstPath);
        
        const entities = await srcFolder.getEntities();
        for (const entity of entities) {
            if (entity instanceof File) {
                await entity.copy(path.join(dstPath, entity.name));
            } else if (entity instanceof Folder) {
                const newDstFolder = dstFolder.getFolder(entity.name);
                await this.copyFolderRecursive(entity.path, newDstFolder.path);
            }
        }
    }

    private zipFolder(sourcePath: string, zipPath: string): void {
        // Use SSZipArchive if available
        if (typeof SSZipArchive !== 'undefined') {
            const success = SSZipArchive.createZipFileAtPathWithContentsOfDirectory(zipPath, sourcePath);
            if (!success) {
                throw new Error('Failed to create zip file');
            }
        } else {
            // Fallback to NSFileCoordinator (creates a zip with ForUploading option)
            const fileManager = NSFileManager.defaultManager;
            const sourceURL = NSURL.fileURLWithPath(sourcePath);
            const zipURL = NSURL.fileURLWithPath(zipPath);
            
            // Remove existing zip if it exists
            if (fileManager.fileExistsAtPath(zipPath)) {
                fileManager.removeItemAtPathError(zipPath);
            }
            
            const coordinator = NSFileCoordinator.alloc().initWithFilePresenter(null);
            const error = new interop.Reference<NSError>();
            
            coordinator.coordinateReadingItemAtURLOptionsErrorByAccessor(
                sourceURL,
                NSFileCoordinatorReadingOptions.ForUploading,
                error,
                (newURL: NSURL) => {
                    // newURL points to a zipped version of the source
                    fileManager.copyItemAtURLToURLError(newURL, zipURL);
                }
            );
            
            if (error.value) {
                throw new Error(`Failed to create zip: ${error.value.localizedDescription}`);
            }
        }
    }

    private unzipFile(zipPath: string, destPath: string): void {
        const fileManager = NSFileManager.defaultManager;
        
        // Ensure destination exists
        fileManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(destPath, true, null);
        
        // Use SSZipArchive if available
        if (typeof SSZipArchive !== 'undefined') {
            const success = SSZipArchive.unzipFileAtPathToDestination(zipPath, destPath);
            if (!success) {
                throw new Error('Failed to unzip file');
            }
        } else {
            // Fallback: Since we don't have a native unzip without SSZipArchive,
            // we need to throw an error indicating the library is needed
            throw new Error('SSZipArchive is required for backup/restore on iOS. Please add it to your Podfile.');
        }
    }
}

export const backupService = BackupService.getInstance();
