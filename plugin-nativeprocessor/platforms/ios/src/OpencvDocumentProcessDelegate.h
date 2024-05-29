#import <Foundation/Foundation.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#import <Webkit/Webkit.h>
#import "nsdocumentscanner-Swift.h"

@protocol OnQRCode
- (void)onQRCodes:(NSString* data);
@end

@interface OpencvDocumentProcessDelegate : NSObject <ProcessRawVideoSampleBufferDelegate>
@property (nullable, retain, nonatomic) NSCropView *cropView;
@property (nullable, retain, nonatomic) OnQRCode *onQRCode;
@property (nullable, retain, nonatomic) AutoScanHandler *innerAutoScanHandler;
@property (nullable, retain, nonatomic) NSObject *autoScanHandler;
@property (nonatomic, assign) NSInteger  previewResizeThreshold;
@property (nonatomic, assign) BOOL  detectDocuments;
@property (nonatomic, assign) BOOL  detectQRCode;
@property (nonatomic, assign) NSString*  detectQRCodeOptions;

- (instancetype)initWithCropView:(NSCropView*) view;
- (instancetype)initWithCropView:(NSCropView*) view onQRCode(OnQRCode*)onQRCode;
- (void) setAutoScanHandler:(NSObject *)value;


+(NSArray*)findDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation scale:(CGFloat)scale options:(NSString*)options;

+(void) getJSONDocumentCornersSync:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<CompletionDelegate>)delegate scale:(CGFloat)scale options:(NSString*)options;
+(void) getJSONDocumentCorners:(UIImage*)image  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<CompletionDelegate>)delegate;
+(void) getJSONDocumentCornersFromFile:(NSString*)src  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<CompletionDelegate>)delegate options:(NSString*)options;
+(void) getJSONDocumentCornersFromFile:(NSString*)src  shrunkImageHeight:(CGFloat)shrunkImageHeight imageRotation:(NSInteger)imageRotation delegate:(id<CompletionDelegate>)delegate;
+(void) getJSONDocumentCornersFromFile:(NSString*)src delegate:(id<CompletionDelegate>)delegate options:(NSString*)options;


// PRAGMA: cropDocument
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<CompletionDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName compressFormat:(NSString*)compressFormat compressQuality:(CGFloat)compressQuality;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<CompletionDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName compressFormat:(NSString*)compressFormat;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<CompletionDelegate>)delegate  transforms:(NSString*)transforms saveInFolder:(NSString*)saveInFolder fileName:(NSString*)fileName;
+(void) cropDocumentSync:(UIImage*)image quads:(NSString*)quads delegate:(id<CompletionDelegate>)delegate  transforms:(NSString*)transforms;

// PRAGMA: cropDocumentFromFile
+(void) cropDocumentFromFile:(NSString*) src quads:(NSString*)quads delegate:(id<CompletionDelegate>)delegate options:(NSString*)optionsStr;
+(void) cropDocumentFromFile:(NSString*) src quads:(NSString*)quads  delegate:(id<CompletionDelegate>)delegate;


// PRAGMA: cropDocument
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<CompletionDelegate>)delegate transforms:(NSString*)transforms;
+(void) cropDocument:(UIImage*) image quads:(NSString*)quads  delegate:(id<CompletionDelegate>)delegate;

// PRAGMA: ocrDocument
+(void)ocrDocumentSync:(UIImage*)image options:(NSString*)options delegate:(id<CompletionDelegate>)delegate;

+(void)ocrDocument:(UIImage*)image options:(NSString*)options delegate:(id<CompletionDelegate>)delegate;
+(void)ocrDocumentFromFile:(NSString*)src options:(NSString*)options delegate:(id<CompletionDelegate>)delegate;
@end
