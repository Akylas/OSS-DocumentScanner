import type { ZipUtils } from './zip';

// Note: This iOS implementation requires SSZipArchive to be added as a CocoaPod dependency
// Add to App_Resources/iOS/Podfile:
// pod 'SSZipArchive'

class ZipUtilsImpl implements ZipUtils {
    zipFolder(sourcePath: string, zipPath: string): void {
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
                const error = new interop.Reference<NSError>();
                fileManager.removeItemAtPathError(zipPath, error);
                if (error.value) {
                    throw new Error(`Failed to remove existing zip: ${error.value.localizedDescription}`);
                }
            }
            
            const coordinator = NSFileCoordinator.alloc().initWithFilePresenter(null);
            const error = new interop.Reference<NSError>();
            
            coordinator.coordinateReadingItemAtURLOptionsErrorByAccessor(
                sourceURL,
                NSFileCoordinatorReadingOptions.ForUploading,
                error,
                (newURL: NSURL) => {
                    const copyError = new interop.Reference<NSError>();
                    // newURL points to a zipped version of the source
                    fileManager.copyItemAtURLToURLError(newURL, zipURL, copyError);
                    if (copyError.value) {
                        throw new Error(`Failed to copy zip: ${copyError.value.localizedDescription}`);
                    }
                }
            );
            
            if (error.value) {
                throw new Error(`Failed to create zip: ${error.value.localizedDescription}`);
            }
        }
    }

    unzipFile(zipPath: string, destPath: string): void {
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

export const zipUtils = new ZipUtilsImpl();
