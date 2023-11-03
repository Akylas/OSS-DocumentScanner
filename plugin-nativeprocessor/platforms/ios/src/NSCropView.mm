#import "NSCropView.h"

@implementation NSCropView

- (instancetype)initWithFrame:(CGRect)frame
{
  self =  [super initWithFrame:frame];
  self.backgroundColor = UIColor.clearColor;
  self.opaque = NO;
  self.colors = [NSArray arrayWithObjects:[UIColor blueColor]];
  return self;
}

// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
  
  if (self.quads && [self.quads count] > 0) {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGFloat imageRatio = self.imageSize.width / self.imageSize.height;
    CGFloat viewRatio = self.bounds.size.width / self.bounds.size.height;
    CGFloat ratio;
    CGFloat deltaX = 0;
    CGFloat deltaY = 0;
    
    CGFloat addedDeltaY = 35;
    if (imageRatio < viewRatio) {
      ratio = self.bounds.size.width /self.imageSize.width;
      deltaY += (self.bounds.size.height - self.imageSize.height * ratio) / 2;
    } else {
      ratio = self.bounds.size.height/self.imageSize.height ;
      deltaX += (self.bounds.size.width - self.imageSize.width * ratio) / 2;
    }
//    if (self.image) {
//      [self.image drawInRect:CGRectMake(deltaX, deltaY - addedDeltaY, self.bounds.size.width - 2*deltaX , self.bounds.size.height - 2* deltaY) blendMode:kCGBlendModeNormal alpha:0.5];
//
//    }
    CGContextTranslateCTM(context,  deltaX, deltaY - addedDeltaY);
    CGContextSetLineWidth(context, self.strokeWidth);
    [self.quads enumerateObjectsUsingBlock:^(NSArray*  _Nonnull quad, NSUInteger idx, BOOL * _Nonnull stop) {
      CGContextSetStrokeColorWithColor(context, ((UIColor*)[self.colors objectAtIndex:( idx % [self.colors count] )]).CGColor);
      CGPoint startPoint = [((NSValue*)[quad objectAtIndex:0]) CGPointValue];
      CGContextMoveToPoint(context, startPoint.x * ratio, startPoint.y * ratio); //start at this point
      [quad enumerateObjectsUsingBlock:^(NSValue*  _Nonnull value, NSUInteger idx, BOOL * _Nonnull stop) {
        CGPoint point = [value CGPointValue];
        CGContextAddLineToPoint(context, point.x * ratio, point.y * ratio); //start at this point
      }];
      CGContextAddLineToPoint(context, startPoint.x * ratio, startPoint.y * ratio); //start at this point
    }];
    CGContextStrokePath(context);
  }
}


@end
