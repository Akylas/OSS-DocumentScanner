import { ApplicationSettings, File, Folder, Utils, knownFolders, path } from '@nativescript/core';
import { saveFile } from '@nativescript-community/ui-document-picker';
import dayjs from 'dayjs';
import { documentsService } from './documents';
import { DOCUMENT_DATA_FILENAME, FOLDERS_DATA_FILENAME } from '~/utils/constants';
import { basename } from '~/utils/path';
import type { BackupService as IBackupService } from './backup';

const BACKUP_FILENAME_PREFIX = `${__APP_ID__}_backup_`;

export class BackupService implements IBackupService {
    private static instance: BackupService;

    static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }

    async createBackup(): Promise<string> {
        const context = Utils.android.getApplicationContext();
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
                path: tempZipPath,
                forceSAF: true
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
                
                const nativePref = ApplicationSettings.getNative() as android.content.SharedPreferences;
                const editor = nativePref.edit();
                editor.clear();
                
                Object.keys(settings).forEach((k) => {
                    if (k.startsWith('_')) {
                        return;
                    }
                    const value = settings[k];
                    const type = typeof value;
                    switch (type) {
                        case 'boolean':
                            editor.putBoolean(k, value);
                            break;
                        case 'number':
                            editor.putLong(k, java.lang.Double.doubleToRawLongBits(double(value)));
                            break;
                        case 'string':
                            editor.putString(k, value);
                            break;
                    }
                });
                editor.apply();
            }
            
            // 3. Clear existing documents (optional - could add a flag for this)
            const existingDocs = await documentsService.documentRepository.search();
            if (existingDocs.length > 0) {
                await documentsService.deleteDocuments(existingDocs);
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
            
            // Add pages with corrected paths
            if (pages && pages.length > 0) {
                pages.forEach((page) => {
                    const pageDataFolder = targetDocFolder.getFolder(page.id);
                    page.sourceImagePath = path.join(pageDataFolder.path, basename(page.sourceImagePath));
                    page.imagePath = path.join(pageDataFolder.path, basename(page.imagePath));
                });
                await doc.addPages(pages, true, true);
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
        const context = Utils.android.getApplicationContext();
        const sourceFile = new java.io.File(sourcePath);
        const zipFile = new java.io.File(zipPath);
        
        const fos = new java.io.FileOutputStream(zipFile);
        const zos = new java.util.zip.ZipOutputStream(fos);
        
        try {
            this.zipFolderRecursive(sourceFile, sourceFile.getPath(), zos);
        } finally {
            zos.close();
            fos.close();
        }
    }

    private zipFolderRecursive(folder: java.io.File, basePath: string, zos: java.util.zip.ZipOutputStream): void {
        const files = folder.listFiles();
        if (!files) return;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.isDirectory()) {
                this.zipFolderRecursive(file, basePath, zos);
            } else {
                const relativePath = file.getPath().substring(basePath.length() + 1);
                const entry = new java.util.zip.ZipEntry(relativePath);
                zos.putNextEntry(entry);
                
                const fis = new java.io.FileInputStream(file);
                const buffer = Array.create('byte', 1024);
                let length;
                while ((length = fis.read(buffer)) > 0) {
                    zos.write(buffer, 0, length);
                }
                fis.close();
                zos.closeEntry();
            }
        }
    }

    private unzipFile(zipPath: string, destPath: string): void {
        const zipFile = new java.io.File(zipPath);
        const destDir = new java.io.File(destPath);
        
        if (!destDir.exists()) {
            destDir.mkdirs();
        }
        
        const zis = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFile));
        let entry: java.util.zip.ZipEntry;
        
        try {
            while ((entry = zis.getNextEntry()) !== null) {
                const newFile = new java.io.File(destDir, entry.getName());
                
                if (entry.isDirectory()) {
                    newFile.mkdirs();
                } else {
                    new java.io.File(newFile.getParent()).mkdirs();
                    
                    const fos = new java.io.FileOutputStream(newFile);
                    const buffer = Array.create('byte', 1024);
                    let length;
                    while ((length = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, length);
                    }
                    fos.close();
                }
                zis.closeEntry();
            }
        } finally {
            zis.close();
        }
    }
}

export const backupService = BackupService.getInstance();
