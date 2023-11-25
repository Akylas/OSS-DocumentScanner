#import <Foundation/Foundation.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#import <Webkit/Webkit.h>
#import "nsdocumentscanner-Swift.h"
#import "NSCropView.h"
#import "OCRDelegate.h"

@interface OpencvDocumentProcessDelegate : NSObject <ProcessRawVideoSampleBufferDelegate>
@property (strong, nonatomic) NSCropView *cropView;
@property (nonatomic, assign) NSInteger  previewResizeThreshold;

- (instancetype)initWithCropView:(NSCropView*) view;


+(NSArray*)findDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation;
+(void) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads transforms:(NSString*)transforms delegate:(id<OCRDelegate>)delegate;
+(void)ocrDocument:(UIImage*)image options:(NSString*)options delegate:(id<OCRDelegate>)delegate;
@end
