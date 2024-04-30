import Foundation
import UIKit
import CoreGraphics

@objcMembers
@objc(PDFUtils)
class PDFUtils : NSObject {
  
  static func importPdfToTempImages(_ pdfPath: String, delegate: CompletionDelegate?, options: String? = nil) {
    DispatchQueue.global(qos: .userInitiated).async {
      let jsonOpts = ImageUtils.toJSON(options)
      var compressFormat = "jpg"
      var compressQuality = 100
      var scale = 2.0
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
      }
      
      let url = NSURL.fileURL(withPath: pdfPath.replacingOccurrences(of: "file://", with: ""))
      let pdfFileName = url.deletingPathExtension().lastPathComponent
      let pdfDocument = CGPDFDocument(url as CFURL)!
      let colorSpace = CGColorSpaceCreateDeviceRGB()
      let bitmapInfo = CGImageAlphaInfo.noneSkipLast.rawValue
      let tmpDirURL = FileManager.default.temporaryDirectory
      
      var urls = [String](repeating: "", count: pdfDocument.numberOfPages)
      var _error: Error?
        DispatchQueue.concurrentPerform(iterations: pdfDocument.numberOfPages) { i in
        guard _error == nil else { return }   // Page number starts at 1, not 0
        let pdfPage = pdfDocument.page(at: i + 1)!
        
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
      delegate?.onComplete("[\"\(urls.joined(separator: "\",\""))\"]" as NSObject, error: _error as NSError?)
    }
  }
}
