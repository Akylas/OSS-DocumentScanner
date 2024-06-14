import Foundation
import UIKit

extension UIImage.Orientation {
    init(_ cgOrientation: CGImagePropertyOrientation) {
        switch cgOrientation {
            case .up: self = .up
            case .upMirrored: self = .upMirrored
            case .down: self = .down
            case .downMirrored: self = .downMirrored
            case .left: self = .left
            case .leftMirrored: self = .leftMirrored
            case .right: self = .right
            case .rightMirrored: self = .rightMirrored
        }
    }
}
@objcMembers
@objc(ImageUtils)
class ImageUtils : NSObject {
  
  static func toJSON(_ str: String?) -> NSDictionary? {
    guard let data = str?.data(using: .utf8, allowLossyConversion: false) else { return nil }
    return try? (JSONSerialization.jsonObject(with: data, options: .mutableContainers) as! NSDictionary?)
  }
  class LoadImageOptions {
    var width = 0.0
    var maxWidth = 0.0
    var height = 0.0
    var maxHeight = 0.0
    var keepAspectRatio = true
    var autoScaleFactor = true
    
    func initWithJSONOptions(_ jsonOpts:NSDictionary?){
      if let jsonOpts = jsonOpts {
        if ((jsonOpts["resizeThreshold"]) != nil) {
          maxWidth = jsonOpts["resizeThreshold"] as! Double
          maxHeight = maxWidth
        } else if ((jsonOpts["maxSize"]) != nil) {
          maxWidth = jsonOpts["maxSize"] as! Double
          maxHeight = maxWidth
        }
        if ((jsonOpts["width"]) != nil) {
          width = jsonOpts["width"] as! Double
        } else if ((jsonOpts["maxWidth"]) != nil) {
          maxWidth = jsonOpts["maxWidth"] as! Double
        }
        if ((jsonOpts["height"]) != nil) {
          height = jsonOpts["height"] as! Double
        } else if ((jsonOpts["maxHeight"]) != nil) {
          maxHeight = jsonOpts["maxHeight"] as! Double
        }
        if ((jsonOpts["keepAspectRatio"]) != nil) {
          keepAspectRatio = jsonOpts["keepAspectRatio"] as! Bool
        }
        if ((jsonOpts["autoScaleFactor"]) != nil) {
          autoScaleFactor = jsonOpts["autoScaleFactor"] as! Bool
        }
      }
    }
    
    init(_ optionsStr:String?) {
      initWithJSONOptions(toJSON(optionsStr))
    }
    init( jsonOpts:NSDictionary?) {
      initWithJSONOptions(jsonOpts)
    }
  }
  class ImageAssetOptions {
    var width = 0.0
    var height = 0.0
    var keepAspectRatio = true
    var autoScaleFactor = true
    init (_ size: CGSize, options: LoadImageOptions?) {
      width = size.width
      height = size.height
      if (options != nil) {
        if (options!.width > 0) {
          width = options!.width
        }
        if (options!.height > 0) {
          height = options!.height
        }
        if (options!.maxWidth > 0) {
          width = min(
            width,
            options!.maxWidth
          )
        }
        if (options!.maxHeight > 0) {
          height = min(
            height,
            options!.maxHeight
          )
        }
        keepAspectRatio = options!.keepAspectRatio
        autoScaleFactor = options!.autoScaleFactor
      }
    }
  }
  
  static func getAspectSafeDimensions(
    _ sourceWidth: Double,
    _ sourceHeight: Double,
    _ reqWidth: Double,
    _ reqHeight: Double
  ) -> CGSize {
    let widthCoef = sourceWidth / reqWidth
    let heightCoef = sourceHeight / reqHeight
    let aspectCoef = max(widthCoef, heightCoef)
    return CGSize(width: floor((sourceWidth / aspectCoef)), height: floor((sourceHeight / aspectCoef)))
  }
  static func getRequestedImageSize(_ size: CGSize, _ options: ImageAssetOptions) -> CGSize {
    var reqWidth = options.width
    if (reqWidth <= 0) {
      reqWidth = size.width
    }
    var reqHeight = options.height
    if (reqHeight <= 0) {
      reqHeight = size.height
    }
    if (options.keepAspectRatio) {
      let size2 = getAspectSafeDimensions(
        size.width,
        size.height,
        reqWidth,
        reqHeight
      )
      reqWidth = size2.width
      reqHeight = size2.height
    }
    return CGSize(width: reqWidth, height: reqHeight)
  }
  
  // this scales an image but also return the image "rotated"
  // based on imageOrientation
  static func scaleImage(_ image: UIImage, _ scaledImageSize: CGSize) -> UIImage? {
    // Create a graphics context
    UIGraphicsBeginImageContextWithOptions(scaledImageSize, false, image.scale)
    // Draw the image in the new size
    image.draw(in: CGRect(
      origin: .zero,
      size: scaledImageSize
    ))
    // Get the resized, scaled, and rotated image from the context
    let resizedScaledRotatedImage = UIGraphicsGetImageFromCurrentImageContext()
    
    // End the graphics context
    UIGraphicsEndImageContext()
    
    return resizedScaledRotatedImage
  }
  
  static func getImageSize(_ src: String) -> Dictionary<String, Any>? {
    let url = NSURL.fileURL(withPath: src.replacingOccurrences(of: "file://", with: ""))
    let imageSource = CGImageSourceCreateWithURL(url as CFURL, nil);
    if (imageSource == nil) {
      // Error loading image
      return nil;
    }
    
    let options = [kCGImageSourceShouldCache:false];
    let imageProperties = CGImageSourceCopyPropertiesAtIndex(imageSource!, 0, options as CFDictionary) as! [NSString: Any]? ;
    var result: Dictionary<String, Any>?;
    if (imageProperties != nil) {
      let width = imageProperties![kCGImagePropertyPixelWidth] as! Double;
      let height = imageProperties![kCGImagePropertyPixelHeight] as! Double;
      let orientation = imageProperties![kCGImagePropertyOrientation] as? Int;
      let uiOrientation = UIImage.Orientation.init(CGImagePropertyOrientation(rawValue: UInt32(orientation ?? 1))!);
      var degrees: Int = 0
      switch uiOrientation {
      case .down, .downMirrored:
        degrees = 180
        break
      case .right, .rightMirrored:
        degrees = -90
        break
      case .left, .leftMirrored:
        degrees = 90
        break
      default:
        degrees = 0
      }
      result = ["width": width, "height": height, "rotation":degrees];
    }
    return result;
  }
  
  
  static func readImageFromFile(_ src: String, options: NSDictionary?) -> UIImage? {
    let image = UIImage(contentsOfFile: src.replacingOccurrences(of: "file://", with: ""))
    if let image {
      let size = image.size
      let imageOrientation = image.imageOrientation
      let loadImageOptions = LoadImageOptions(jsonOpts: options)
      let opts = ImageAssetOptions(size, options: loadImageOptions)
      let requestedSize = getRequestedImageSize(size, opts)
      var result: UIImage? = image
      if (requestedSize.width != size.width || requestedSize.height != size.height || imageOrientation != .up) {
        result = scaleImage(image, requestedSize )
      }
      if (options?["jpegQuality"] != nil) {
        result = UIImage.init(data: result!.jpegData(compressionQuality: CGFloat((options!["jpegQuality"] as! Int)) / 100.0)!)
      }
      
      return result
    }
    return nil
    
  }
  
  static func readImageFromFile(_ src: String, stringOptions: String?) -> UIImage? {
    let options = toJSON(stringOptions)
    return readImageFromFile(src, options: options)
  }
  
  
}
