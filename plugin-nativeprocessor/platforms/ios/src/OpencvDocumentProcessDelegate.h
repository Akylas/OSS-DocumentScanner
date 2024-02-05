#import <Foundation/Foundation.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#import <Webkit/Webkit.h>
#import "nsdocumentscanner-Swift.h"
#import "OCRDelegate.h"

@interface OpencvDocumentProcessDelegate : NSObject <ProcessRawVideoSampleBufferDelegate>
@property (nullable, retain, nonatomic) NSCropView *cropView;
@property (nullable, retain, nonatomic) AutoScanHandler *innerAutoScanHandler;
@property (nullable, retain, nonatomic) NSObject *autoScanHandler;
@property (nonatomic, assign) NSInteger  previewResizeThreshold;

- (instancetype)initWithCropView:(NSCropView*) view;
- (void) setAutoScanHandler:(NSObject *)value;


+(NSArray*)findDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation;
+(void) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads transforms:(NSString*)transforms delegate:(id<OCRDelegate>)delegate;
+(void)ocrDocument:(UIImage*)image options:(NSString*)options delegate:(id<OCRDelegate>)delegate;
@end
