
#import "OpencvDocumentProcessDelegate.h"
#import <opencv2/opencv.hpp>
#import "src/include/DocumentDetector.h"
#import <QuartzCore/QuartzCore.h>

@implementation OpencvDocumentProcessDelegate

- (instancetype)initWithCropView:(NSCropView*) view {
  self.cropView = view;
  self.previewResizeThreshold = 300;
  return [self init];
}

CGImageRef MatToCGImage(const cv::Mat& image) {
  NSData *data = [NSData dataWithBytes:image.data
                                length:image.step.p[0] * image.rows];
  
  CGColorSpaceRef colorSpace;
  
  if (image.elemSize() == 1) {
    colorSpace = CGColorSpaceCreateDeviceGray();
  } else {
    colorSpace = CGColorSpaceCreateDeviceRGB();
  }
  
  CGDataProviderRef provider =
  CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
  
  // Preserve alpha transparency, if exists
  bool alpha = image.channels() == 4;
  CGBitmapInfo bitmapInfo = (alpha ? kCGImageAlphaLast : kCGImageAlphaNone) | kCGBitmapByteOrderDefault;
  
  // Creating CGImage from cv::Mat
  CGImageRef imageRef = CGImageCreate(image.cols,
                                      image.rows,
                                      8 * image.elemSize1(),
                                      8 * image.elemSize(),
                                      image.step.p[0],
                                      colorSpace,
                                      bitmapInfo,
                                      provider,
                                      NULL,
                                      false,
                                      kCGRenderingIntentDefault
                                      );
  
  CGDataProviderRelease(provider);
  CGColorSpaceRelease(colorSpace);
  
  return imageRef;
}

UIImage* MatToUIImage(const cv::Mat& image) {
  // Creating CGImage from cv::Mat
  CGImageRef imageRef = MatToCGImage(image);
  
  // Getting UIImage from CGImage
  UIImage *uiImage = [UIImage imageWithCGImage:imageRef];
  CGImageRelease(imageRef);
  
  return uiImage;
}

void CGImageToMat(const CGImageRef image, cv::Mat& m, bool alphaExist) {
  CGColorSpaceRef colorSpace = CGImageGetColorSpace(image);
  CGFloat cols = CGImageGetWidth(image), rows = CGImageGetHeight(image);
  CGContextRef contextRef;
  CGBitmapInfo bitmapInfo = kCGImageAlphaPremultipliedLast;
  if (CGColorSpaceGetModel(colorSpace) == kCGColorSpaceModelMonochrome)
  {
    m.create(rows, cols, CV_8UC1); // 8 bits per component, 1 channel
    bitmapInfo = kCGImageAlphaNone;
    if (!alphaExist)
      bitmapInfo = kCGImageAlphaNone;
    else
      m = cv::Scalar(0);
    contextRef = CGBitmapContextCreate(m.data, m.cols, m.rows, 8,
                                       m.step[0], colorSpace,
                                       bitmapInfo);
  }
  else if (CGColorSpaceGetModel(colorSpace) == kCGColorSpaceModelIndexed)
  {
    // CGBitmapContextCreate() does not support indexed color spaces.
    colorSpace = CGColorSpaceCreateDeviceRGB();
    m.create(rows, cols, CV_8UC4); // 8 bits per component, 4 channels
    if (!alphaExist)
      bitmapInfo = kCGImageAlphaNoneSkipLast |
      kCGBitmapByteOrderDefault;
    else
      m = cv::Scalar(0);
    contextRef = CGBitmapContextCreate(m.data, m.cols, m.rows, 8,
                                       m.step[0], colorSpace,
                                       bitmapInfo);
    CGColorSpaceRelease(colorSpace);
  }
  else
  {
    m.create(rows, cols, CV_8UC4); // 8 bits per component, 4 channels
    if (!alphaExist)
      bitmapInfo = kCGImageAlphaNoneSkipLast |
      kCGBitmapByteOrderDefault;
    else
      m = cv::Scalar(0);
    contextRef = CGBitmapContextCreate(m.data, m.cols, m.rows, 8,
                                       m.step[0], colorSpace,
                                       bitmapInfo);
  }
  CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows),
                     image);
  CGContextRelease(contextRef);
}
-(UIImage*) imageFromCIImage:(CIImage*)cmage {
  CIContext *context = [CIContext contextWithOptions:nil];
  CGImageRef cgImage = [context createCGImage:cmage fromRect:[cmage extent]];
  UIImage* uiImage = [UIImage imageWithCGImage:cgImage];
  CGImageRelease(cgImage);
  return uiImage;
}

- (cv::Mat)matFromBuffer:(CMSampleBufferRef)buffer {
  CVImageBufferRef pixelBuffer = CMSampleBufferGetImageBuffer(buffer);
  CIImage *ciImage = [CIImage imageWithCVPixelBuffer:pixelBuffer];
  UIImage* uiImage = [self imageFromCIImage:ciImage];
  cv::Mat image;
  CGImageAlphaInfo ainfo = CGImageGetAlphaInfo( uiImage.CGImage );
  CGImageToMat(uiImage.CGImage, image,  ainfo != kCGImageAlphaNone);
  return image;
}

- (cv::Mat) matFromImageBuffer: (CVImageBufferRef) buffer {
    cv::Mat mat ;
    CVPixelBufferLockBaseAddress(buffer, 0);
    void *address = CVPixelBufferGetBaseAddress(buffer);
    int width = (int) CVPixelBufferGetWidth(buffer);
    int height = (int) CVPixelBufferGetHeight(buffer);
    mat = cv::Mat(height, width, CV_8UC4, address, CVPixelBufferGetBytesPerRow(buffer));
    CVPixelBufferUnlockBaseAddress(buffer, 0);
    return mat;
}

- (cv::Mat)matFromSampleBuffer:(CMSampleBufferRef)sampleBuffer {
    CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
    CVPixelBufferLockBaseAddress(imageBuffer, 0);
    
    void* bufferAddress;
    size_t width;
    size_t height;
    size_t bytesPerRow;
    
    int format_opencv;
    
    OSType format = CVPixelBufferGetPixelFormatType(imageBuffer);
    if (format == kCVPixelFormatType_420YpCbCr8BiPlanarFullRange) {
        
        format_opencv = CV_8UC1;
        
        bufferAddress = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 0);
        width = CVPixelBufferGetWidthOfPlane(imageBuffer, 0);
        height = CVPixelBufferGetHeightOfPlane(imageBuffer, 0);
        bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(imageBuffer, 0);
        
    } else { // expect kCVPixelFormatType_32BGRA
        
        format_opencv = CV_8UC4;
        
        bufferAddress = CVPixelBufferGetBaseAddress(imageBuffer);
        width = CVPixelBufferGetWidth(imageBuffer);
        height = CVPixelBufferGetHeight(imageBuffer);
        bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
        
    }
    
    // delegate image processing to the delegate
    cv::Mat image((int)height, (int)width, format_opencv, bufferAddress, bytesPerRow);
    
    CVPixelBufferUnlockBaseAddress(imageBuffer, 0);
    return image;
}

- (void)cameraView:(NSCameraView *)cameraView willProcessRawVideoSampleBuffer:(CMSampleBufferRef)sampleBuffer onQueue:(dispatch_queue_t)queue
{
  cv::Mat mat = [self matFromBuffer:sampleBuffer];
  detector::DocumentDetector docDetector(mat, previewResizeThreshold, 0);
  std::vector<std::vector<cv::Point>> scanPointsList = docDetector.scanPoint();
  unsigned long count = scanPointsList.size();
  if (count > 0) {
    NSMutableArray* objcScanPointsList = [[NSMutableArray alloc] initWithCapacity:count];
    for (int i = 0; i < count; i++) {
      std::vector<cv::Point> quad = scanPointsList[i];
      NSMutableArray* objcQuad =[[NSMutableArray alloc] initWithCapacity:quad.size()];
      for (int j = 0; j < quad.size(); j++) {
        [objcQuad addObject:[NSValue valueWithCGPoint:CGPointMake(quad[j].x, quad[j].y)]];
      }
      [objcScanPointsList addObject:objcQuad];
    }
    self.cropView.quads = objcScanPointsList;
  } else {
    self.cropView.quads = nil;
  }
  self.cropView.imageSize = CGSizeMake(mat.size().width, mat.size().height);
  mat.release();
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.cropView setNeedsDisplay];
  });
}
- (void)cameraView:(NSCameraView *)cameraView renderToCustomContextWithImageBuffer:(CVPixelBufferRef)imageBuffer onQueue:(dispatch_queue_t)queue {
  // we do nothing here
}

@end
