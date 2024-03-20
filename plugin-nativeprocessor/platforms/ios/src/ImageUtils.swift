import Foundation
import UIKit

@objcMembers
@objc(ImageUtils)
class ImageUtils : NSObject {

    static func loadImage(_ src: String, options: String?) -> UIImage {
        let image = UIImage(contentsOfFile: src)
        // TODO: parse options to support resizing
        return image
    }
}