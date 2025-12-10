export interface ZipUtils {
    zipFolder(sourcePath: string, zipPath: string): void;
    unzipFile(zipPath: string, destPath: string): void;
}

export const zipUtils: ZipUtils;
