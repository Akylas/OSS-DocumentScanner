
import Foundation
import AVFoundation

// MARK: - FileManager

extension FileManager {

    /// Returns the available user designated storage space in bytes.
    ///
    /// - Returns: Number of available bytes in storage.
    public class func availableStorageSpaceInBytes() -> UInt64 {
        do {
            if let lastPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).last {
                let attributes = try FileManager.default.attributesOfFileSystem(forPath: lastPath)
                if let freeSize = attributes[FileAttributeKey.systemFreeSize] as? UInt64 {
                    return freeSize
                }
            }
        } catch {
            print("could not determine user attributes of file system")
            return 0
        }
        return 0
    }

}


@objcMembers
@objc(IOSSharedUtils)
class IOSSharedUtils : NSObject {
    static func checkAvailableStorage(_ sizeBytes: UInt64) -> Bool {
        return FileManager.availableStorageSpaceInBytes() > sizeBytes
    }
}