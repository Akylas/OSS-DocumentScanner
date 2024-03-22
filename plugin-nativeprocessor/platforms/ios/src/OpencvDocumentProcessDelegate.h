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

+(void) getJSONDocumentCornersSync:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate;
+(void) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate;
+(void) getJSONDocumentCornersFromFile:(NSString*)src  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate options:(NSString*)options;
+(void) getJSONDocumentCornersFromFile:(NSString*)src  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<OCRDelegate>)delegate;


// PRAGMA: cropDocument
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<OCRDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName compressFormat:(NSString*)compressFormat compressQuality:(CGFloat)compressQuality;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<OCRDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName compressFormat:(NSString*)compressFormat;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<OCRDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<OCRDelegate>)delegate  transforms:(NSString*)transforms;

// PRAGMA: cropDocumentFromFile
+(void) cropDocumentFromFile:(NSString*) src quads:(NSString*)quads delegate:(id<OCRDelegate>)delegate options:(NSString*)optionsStr;
+(void) cropDocumentFromFile:(NSString*) src quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate;


// PRAGMA: cropDocument
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate transforms:(NSString*)transforms;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<OCRDelegate>)delegate;

// PRAGMA: ocrDocument
+(void)ocrDocumentSync:(UIImage*)image options:(NSString*)options delegate:(id<OCRDelegate>)delegate;

+(void)ocrDocument:(UIImage*)image options:(NSString*)options delegate:(id<OCRDelegate>)delegate;
+(void)ocrDocumentFromFile:(NSString*)src options:(NSString*)options delegate:(id<OCRDelegate>)delegate;
@end
