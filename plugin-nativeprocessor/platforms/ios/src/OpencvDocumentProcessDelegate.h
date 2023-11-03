#import <Foundation/Foundation.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#import "nsdocumentscanner-Swift.h"
#import "NSCropView.h"

@interface OpencvDocumentProcessDelegate : NSObject <ProcessRawVideoSampleBufferDelegate>
@property (strong, nonatomic) NSCropView *cropView;
@property (nonatomic, assign) NSInteger  previewResizeThreshold;

- (instancetype)initWithCropView:(NSCropView*) view;


+(NSArray*)findDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation;
+(NSString*) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation;
+(NSArray*) cropDocument:(UIImage*) image quads:(NSString*)quads transforms:(NSString*)transforms;
+(NSArray*) cropDocument:(UIImage*) image quads:(NSString*)quads;
@end
