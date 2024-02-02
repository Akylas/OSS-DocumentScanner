
#import "OpencvDocumentProcessDelegate.h"
#import <opencv2/opencv.hpp>
#import <DocumentDetector.h>
#import <DocumentOCR.h>
#import <QuartzCore/QuartzCore.h>

@implementation OpencvDocumentProcessDelegate

- (instancetype)initWithCropView:(NSCropView*) view{
  self.cropView = view;
  self.previewResizeThreshold = 300;
  self.autoScanHandler = nil;
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

void UIImageToMat(const UIImage* image, cv::Mat& m, bool alphaExist = false) {
  CGImageRef imageRef = image.CGImage;
  CGImageToMat(imageRef, m, alphaExist);
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

+(NSArray*)findDocumentCornersInMat:(cv::Mat)mat  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation {
  detector::DocumentDetector docDetector(mat, shrunkImageHeight, (int)imageRotation);
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
    return objcScanPointsList;
  } else {
    return nil;
  }
}
+(NSArray*)findDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation {
  cv::Mat mat;
  UIImageToMat(image, mat);
  return [self findDocumentCornersInMat:mat shrunkImageHeight:shrunkImageHeight imageRotation:imageRotation];
}

+(void) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate
{
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      NSArray* quads = [OpencvDocumentProcessDelegate findDocumentCorners:image shrunkImageHeight:shrunkImageHeight imageRotation:imageRotation];
      NSMutableArray* result = [NSMutableArray arrayWithCapacity:[quads count]];
      [quads enumerateObjectsUsingBlock:^(NSArray*  _Nonnull quad, NSUInteger idx, BOOL * _Nonnull stop) {
        // sort by Y
        NSArray* sortedQuadsY = [quad sortedArrayUsingComparator:^NSComparisonResult(NSValue*  _Nonnull obj1, NSValue*  _Nonnull obj2) {
          CGFloat y1 = [obj1 CGPointValue].y;
          CGFloat y2 = [obj2 CGPointValue].y;
          if (y1 > y2) {
            return (NSComparisonResult)NSOrderedDescending;
          } else if (y1 < y2) {
            return (NSComparisonResult)NSOrderedAscending;
          }
          return (NSComparisonResult)NSOrderedSame;
        }];
        // split by chunk of 2
        // sort by X
        NSArray* chunk1 =[[sortedQuadsY subarrayWithRange:NSMakeRange(0, 2)] sortedArrayUsingComparator:^NSComparisonResult(NSValue*  _Nonnull obj1, NSValue*  _Nonnull obj2) {
          CGFloat x1 = [obj1 CGPointValue].x;
          CGFloat x2 = [obj2 CGPointValue].x;
          if (x1 > x2) {
            return (NSComparisonResult)NSOrderedDescending;
          } else if (x1 < x2) {
            return (NSComparisonResult)NSOrderedAscending;
          }
          return (NSComparisonResult)NSOrderedSame;
        }];
        // sort by reversed X
        NSArray* chunk2 = [[sortedQuadsY subarrayWithRange:NSMakeRange(2, 2)] sortedArrayUsingComparator:^NSComparisonResult(NSValue*  _Nonnull obj1, NSValue*  _Nonnull obj2) {
          CGFloat x1 = [obj2 CGPointValue].x;
          CGFloat x2 = [obj1 CGPointValue].x;
          if (x1 > x2) {
            return (NSComparisonResult)NSOrderedDescending;
          } else if (x1 < x2) {
            return (NSComparisonResult)NSOrderedAscending;
          }
          return (NSComparisonResult)NSOrderedSame;
        }];
        NSMutableArray* result2 = [NSMutableArray arrayWithCapacity:[quads count]];
        [chunk1 enumerateObjectsUsingBlock:^(NSValue*  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
          [result2 addObject:[NSString stringWithFormat:@"[%f,%f]",[obj CGPointValue].x, [obj CGPointValue].y ]];
        }];
        [chunk2 enumerateObjectsUsingBlock:^(NSValue*  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
          [result2 addObject:[NSString stringWithFormat:@"[%f,%f]",[obj CGPointValue].x, [obj CGPointValue].y ]];
        }];
        [result addObject:[NSString stringWithFormat:@"[%@]", [result2 componentsJoinedByString:@","]]];
      }];
      NSString* stringResult = [NSString stringWithFormat:@"[%@]", [result componentsJoinedByString:@","]];
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:stringResult error:nil];
        
      });
    }
    @catch (NSException *exception) {
      NSMutableDictionary *info = [exception.userInfo mutableCopy]?:[[NSMutableDictionary alloc] init];
      
      [info addEntriesFromDictionary: [exception dictionaryWithValuesForKeys:@[@"ExceptionName", @"ExceptionReason", @"ExceptionCallStackReturnAddresses", @"ExceptionCallStackSymbols"]]];
      [info addEntriesFromDictionary:@{NSLocalizedDescriptionKey: exception.name, NSLocalizedFailureReasonErrorKey:exception.reason }];
      NSError* err = [NSError errorWithDomain:@"OCRError" code:-10 userInfo:info];
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:nil error:err];
        
      });
    }
  });
  
  
}


+(void) cropDocument:(UIImage*) image quads:(NSString*)quads transforms:(NSString*)transforms delegate:(id<OCRDelegate>)delegate {
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      NSError *error = nil;
      NSArray* quadsArray = [NSJSONSerialization JSONObjectWithData:[quads dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];
      NSMutableArray* images = [NSMutableArray array];
      //  std::vector<std::vector<cv::Point>> scanPointsList;
      cv::Mat srcBitmapMat;
      UIImageToMat(image, srcBitmapMat);
      
      for (NSArray* quad in quadsArray) {
        std::vector<cv::Point> points;
        for (NSArray* point in quad) {
          cv::Point cvpoint([[point objectAtIndex:0] intValue], [[point objectAtIndex:1] intValue]);
          points.push_back(cvpoint);
        };
        cv::Point leftTop = points[0];
        cv::Point  rightTop = points[1];
        cv::Point rightBottom = points[2];
        cv::Point  leftBottom = points[3];
        int newWidth = (cv::norm(leftTop-rightTop) + cv::norm(leftBottom-rightBottom)) / 2.0f;
        int newHeight = (cv::norm(leftTop-leftBottom) + cv::norm(rightTop-rightBottom)) / 2.0f;
        
        Mat dstBitmapMat;
        dstBitmapMat = Mat::zeros(newHeight, newWidth, srcBitmapMat.type());
        
        std::vector<Point2f> srcTriangle;
        std::vector<Point2f> dstTriangle;
        
        srcTriangle.push_back(Point2f(leftTop.x, leftTop.y));
        srcTriangle.push_back(Point2f(rightTop.x, rightTop.y));
        srcTriangle.push_back(Point2f(leftBottom.x, leftBottom.y));
        srcTriangle.push_back(Point2f(rightBottom.x, rightBottom.y));
        
        dstTriangle.push_back(Point2f(0, 0));
        dstTriangle.push_back(Point2f(newWidth, 0));
        dstTriangle.push_back(Point2f(0, newHeight));
        dstTriangle.push_back(Point2f(newWidth, newHeight));
        
        Mat transform = getPerspectiveTransform(srcTriangle, dstTriangle);
        cv::warpPerspective(srcBitmapMat, dstBitmapMat, transform, dstBitmapMat.size());
        if (transforms != nil) {
          std::string transformsStd = std::string([transforms UTF8String]);
          if (transformsStd.length() > 0)
          {
            detector::DocumentDetector::applyTransforms(dstBitmapMat, transformsStd);
          }
        }
        
        [images addObject:MatToUIImage(dstBitmapMat)];
      };
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:images error:nil];
        
      });
    }
    @catch (NSException *exception) {
      NSMutableDictionary *info = [exception.userInfo mutableCopy]?:[[NSMutableDictionary alloc] init];
      
      [info addEntriesFromDictionary: [exception dictionaryWithValuesForKeys:@[@"ExceptionName", @"ExceptionReason", @"ExceptionCallStackReturnAddresses", @"ExceptionCallStackSymbols"]]];
      [info addEntriesFromDictionary:@{NSLocalizedDescriptionKey: exception.name, NSLocalizedFailureReasonErrorKey:exception.reason }];
      NSError* err = [NSError errorWithDomain:@"OCRError" code:-10 userInfo:info];
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:nil error:err];
        
      });
    }
  });
}


+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate {
  
  [self cropDocument:image quads:quads transforms:nil delegate:delegate];
}


- (void)cameraView:(NSCameraView *)cameraView willProcessRawVideoSampleBuffer:(CMSampleBufferRef)sampleBuffer onQueue:(dispatch_queue_t)queue
{
  cv::Mat mat = [self matFromBuffer:sampleBuffer];
  NSArray* points = [OpencvDocumentProcessDelegate findDocumentCornersInMat:mat shrunkImageHeight:self.previewResizeThreshold imageRotation:0];
  if ([self.autoScanHandler isKindOfClass: [AutoScanHandler class]]) {
    [((AutoScanHandler*)self.autoScanHandler) processWithPoints: points];
  }
  
  
  self.cropView.videoGravity = cameraView.videoGravity;
  self.cropView.imageSize = CGSizeMake(mat.size().width, mat.size().height);
  self.cropView.quads = points;
  
  mat.release();
}
- (void)cameraView:(NSCameraView *)cameraView renderToCustomContextWithImageBuffer:(CVPixelBufferRef)imageBuffer onQueue:(dispatch_queue_t)queue {
  // we do nothing here
}
+(void)ocrDocument:(UIImage*)image options:(NSString*)options delegate:(id<OCRDelegate>)delegate {
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      cv::Mat srcBitmapMat;
      UIImageToMat(image, srcBitmapMat);
      std::optional<std::function<void(int)>> progressLambda = [&](int progress)
      {
        [delegate onProgress:progress];
      };
      
      std::string result = detector::DocumentOCR::detectText(srcBitmapMat, std::string([options UTF8String]), progressLambda);
      
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:[NSString stringWithUTF8String:result.c_str()] error:nil];
        
      });
    }
    @catch (NSException *exception) {
      NSMutableDictionary *info = [exception.userInfo mutableCopy]?:[[NSMutableDictionary alloc] init];
      
      [info addEntriesFromDictionary: [exception dictionaryWithValuesForKeys:@[@"ExceptionName", @"ExceptionReason", @"ExceptionCallStackReturnAddresses", @"ExceptionCallStackSymbols"]]];
      [info addEntriesFromDictionary:@{NSLocalizedDescriptionKey: exception.name, NSLocalizedFailureReasonErrorKey:exception.reason }];
      NSError* err = [NSError errorWithDomain:@"OCRError" code:-10 userInfo:info];
      dispatch_async(dispatch_get_main_queue(), ^(void) {
        [delegate onComplete:nil error:err];
        
      });
    }
    
  });
}
@end
