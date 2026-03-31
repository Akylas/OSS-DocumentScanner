
import Foundation
import AVFoundation
import CryptoKit

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

    static func generateCodeChallenge(_ codeVerifier: String) -> String {
        // Convert string to Data
        let data = Data(codeVerifier.utf8)

        // SHA-256 hash
        let hash = SHA256.hash(data: data)

        // Convert to Data
        let hashData = Data(hash)

        // Base64 encode
        let base64 = hashData.base64EncodedString()

        // Convert to Base64 URL-safe (no padding)
        let base64url = base64
            .replacingOccurrences(of: "=", with: "")
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")

        return base64url
    }
}