#import <Foundation/Foundation.h>

@protocol OCRDelegate
- (void)onComplete:(NSString*)result error:(NSError*)error;

- (void)onProgress:(NSUInteger)progress;

@end
