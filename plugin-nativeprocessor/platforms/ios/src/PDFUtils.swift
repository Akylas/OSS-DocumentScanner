import Foundation
import UIKit
import CoreGraphics


extension CGPDFDictionaryRef {
  func getDictionary(key: String) -> CGPDFDictionaryRef? {
    var dict: CGPDFDictionaryRef?
    let success = CGPDFDictionaryGetDictionary(self, key, &dict)
    guard success else {
      return nil
    }
    return dict
  }
  
  func getName(key: String) -> String? {
    var name: UnsafePointer<Int8>?
    guard CGPDFDictionaryGetName(self, key, &name) else {
      return nil
    }
    return String(cString: name!)
  }
}

extension CGPDFObjectRef {
  func getStream() -> CGPDFStreamRef? {
    var stream: CGPDFStreamRef?
    guard CGPDFObjectGetValue(self, .stream, &stream) else {
      return nil
    }
    return stream
  }
}

@objcMembers
@objc(PDFUtils)
class PDFUtils : NSObject {
  static func extractImageDataFromXObject(object: CGPDFObjectRef) -> Data? {
    guard let stream = object.getStream() else {
      return nil
    }
    
    var fmt: CGPDFDataFormat = .raw
    let streamData: CFData = CGPDFStreamCopyData(stream, &fmt)!;
    return streamData as Data?
  }
  static func importPdfToTempImages(_ pdfPath: String, delegate: CompletionDelegate?, options: String? = nil) {
    DispatchQueue.global(qos: .userInitiated).async {
      let jsonOpts = ImageUtils.toJSON(options)
      var compressFormat = "jpg"
      var compressQuality = 100
      var scale = 2.0
      var importPDFImages = false
      if let jsonOpts = jsonOpts {
        if ((jsonOpts["compressFormat"]) != nil) {
          compressFormat = jsonOpts["compressFormat"] as! String
        }
        if ((jsonOpts["compressQuality"]) != nil) {
          compressQuality = jsonOpts["compressQuality"] as! Int
        }
        if ((jsonOpts["scale"]) != nil) {
          scale = jsonOpts["scale"] as! Double
        }
        if ((jsonOpts["importPDFImages"]) != nil) {
          importPDFImages = jsonOpts["importPDFImages"] as! Bool
        }
      }
      
      let url = NSURL.fileURL(withPath: pdfPath.replacingOccurrences(of: "file://", with: ""))
      let pdfFileName = url.deletingPathExtension().lastPathComponent
      let pdfDocument = CGPDFDocument(url as CFURL)!
      
      let colorSpace = CGColorSpaceCreateDeviceRGB()
      let bitmapInfo = CGImageAlphaInfo.noneSkipLast.rawValue
      let tmpDirURL = FileManager.default.temporaryDirectory
      
      var nbImagesTotal = pdfDocument.numberOfPages
      if(importPDFImages) {
        nbImagesTotal = 0
        for pageNumber in 1...pdfDocument.numberOfPages {
          guard let page = pdfDocument.page(at: pageNumber) else {
            continue
          }
          // Extract resources dictionary
          guard let resources = page.dictionary?.getDictionary(key: "Resources") else {
            return
          }
          
          // Extract XObject dictionary
          guard let xObjects = resources.getDictionary(key: "XObject") else {
            return
          }
          //Enumerate all of the keys in `dict', calling the block-function `block' once for each key/value pair.
          CGPDFDictionaryApplyBlock(xObjects, { key, object, _ in
            var stream: CGPDFStreamRef?
            guard CGPDFObjectGetValue(object, .stream, &stream),
                  let objectStream = stream,
                  let streamDictionary = CGPDFStreamGetDictionary(objectStream) else {
              return true
            }
            
            var subtype: UnsafePointer<Int8>?
            guard CGPDFDictionaryGetName(streamDictionary, "Subtype", &subtype), let subtypeName = subtype else {
              return true
            }
            
            if String(cString: subtypeName) == "Image" {
              nbImagesTotal += 1
            }
            return true
          }, nil)
        }
      }
      
      var urls = [String](repeating: "", count: nbImagesTotal)
      var _error: Error?
      
      var nbImages = 0
      DispatchQueue.concurrentPerform(iterations: pdfDocument.numberOfPages) { i in
        guard _error == nil else { return }   // Page number starts at 1, not 0
        
        let pdfPage = pdfDocument.page(at: i + 1)!
        if (importPDFImages) {
          // Extract resources dictionary
          guard let resources = pdfPage.dictionary?.getDictionary(key: "Resources") else {
            return
          }
          
          // Extract XObject dictionary
          guard let xObjects = resources.getDictionary(key: "XObject") else {
            return
          }
          
          CGPDFDictionaryApplyBlock(xObjects, { key, object, _ in
            var stream: CGPDFStreamRef?
            guard CGPDFObjectGetValue(object, .stream, &stream),
                  let objectStream = stream,
                  let streamDictionary = CGPDFStreamGetDictionary(objectStream) else {
              return true
            }
            
            var subtype: UnsafePointer<Int8>?
            guard CGPDFDictionaryGetName(streamDictionary, "Subtype", &subtype), let subtypeName = subtype else {
              return true
            }
            
            if String(cString: subtypeName) == "Image" {
              // Extract image data
              guard let imageData = extractImageDataFromXObject(object: object) else {
                return true
              }
              
              // Convert image data to UIImage
              if let image = UIImage(data: imageData) {
                let imageURL = tmpDirURL.appendingPathComponent("\(pdfFileName)_\(nbImages+1).\(compressFormat)")
                do {
                  if (compressFormat == "jpg") {
                    try image.jpegData(compressionQuality: CGFloat(compressQuality) / 100.0)?.write(to: imageURL, options: Data.WritingOptions.atomic)
                  } else {
                    try image.pngData()?.write(to: imageURL, options: Data.WritingOptions.atomic)
                  }
                  urls[nbImages] = imageURL.absoluteString
                  nbImages += 1
                } catch {
                  _error = error
                }
              }
            }
            return true
          }, nil)
        } else {
          let mediaBoxRect = pdfPage.getBoxRect(CGPDFBox.mediaBox)
          let width = Int(mediaBoxRect.width * scale)
          let height = Int(mediaBoxRect.height * scale)
          
          let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace, bitmapInfo: bitmapInfo)!
          context.interpolationQuality = .high
          context.setFillColor(UIColor.white.cgColor)
          context.fill(CGRect(x: 0, y: 0, width: width, height: height))
          context.scaleBy(x: scale, y: scale)
          context.drawPDFPage(pdfPage)
          
          let image = UIImage.init(cgImage: context.makeImage()!)
          let imageURL = tmpDirURL.appendingPathComponent("\(pdfFileName)_\(i+1).\(compressFormat)")
          do {
            if (compressFormat == "jpg") {
              try image.jpegData(compressionQuality: CGFloat(compressQuality) / 100.0)?.write(to: imageURL, options: Data.WritingOptions.atomic)
            } else {
              try image.pngData()?.write(to: imageURL, options: Data.WritingOptions.atomic)
            }
            urls[i] = imageURL.absoluteString
          } catch {
            _error = error
          }
        }
      }
      delegate?.onComplete("[\"\(urls.filter({ !$0.isEmpty }).joined(separator: "\",\""))\"]" as NSObject, error: _error as NSError?)
    }
  }
}
