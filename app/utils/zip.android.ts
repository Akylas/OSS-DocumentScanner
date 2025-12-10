import type { ZipUtils } from './zip';

class ZipUtilsImpl implements ZipUtils {
    zipFolder(sourcePath: string, zipPath: string): void {
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
                try {
                    const buffer = Array.create('byte', 1024);
                    let length;
                    while ((length = fis.read(buffer)) > 0) {
                        zos.write(buffer, 0, length);
                    }
                } finally {
                    fis.close();
                }
                zos.closeEntry();
            }
        }
    }

    unzipFile(zipPath: string, destPath: string): void {
        const zipFile = new java.io.File(zipPath);
        const destDir = new java.io.File(destPath);
        
        if (!destDir.exists()) {
            destDir.mkdirs();
        }
        
        const zis = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFile));
        let entry: java.util.zip.ZipEntry;
        
        try {
            while ((entry = zis.getNextEntry()) !== null) {
                const entryName = entry.getName();
                
                // Security: Prevent zip slip vulnerability by validating paths
                if (entryName.indexOf('..') !== -1) {
                    throw new Error('Invalid zip entry path: ' + entryName);
                }
                
                const newFile = new java.io.File(destDir, entryName);
                
                // Additional security check: ensure the file is within destDir
                const canonicalDestPath = destDir.getCanonicalPath();
                const canonicalNewFilePath = newFile.getCanonicalPath();
                if (!canonicalNewFilePath.startsWith(canonicalDestPath + java.io.File.separator) && 
                    !canonicalNewFilePath.equals(canonicalDestPath)) {
                    throw new Error('Invalid zip entry path: ' + entryName);
                }
                
                if (entry.isDirectory()) {
                    newFile.mkdirs();
                } else {
                    new java.io.File(newFile.getParent()).mkdirs();
                    
                    const fos = new java.io.FileOutputStream(newFile);
                    try {
                        const buffer = Array.create('byte', 1024);
                        let length;
                        while ((length = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, length);
                        }
                    } finally {
                        fos.close();
                    }
                }
                zis.closeEntry();
            }
        } finally {
            zis.close();
        }
    }
}

export const zipUtils = new ZipUtilsImpl();
