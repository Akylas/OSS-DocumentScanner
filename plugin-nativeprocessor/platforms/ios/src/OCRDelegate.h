#import <Foundation/Foundation.h>

@protocol OCRDelegate
- (void)onComplete:(NSObject*)result error:(NSError*)error;

- (void)onProgress:(NSUInteger)progress;

@end
