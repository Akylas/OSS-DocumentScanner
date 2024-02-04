import UIKit
import AVFoundation

@objcMembers
@objc(NSCropView)
class NSCropView: UIView {
  
  class LimitedSizeDictionary<Key: Hashable, Value> {
    private var dictionary: [Key: Value] = [:]
    private var orderQueue: [Key] = []
    private let maxSize: Int
    
    init(maxSize: Int) {
      self.maxSize = maxSize
    }
    
    func removeValue( forKey key: Key) {
      
      dictionary.removeValue(forKey: key)
      if orderQueue.contains(key) {
        if let index = orderQueue.firstIndex(of: key) {
          orderQueue.remove(at: index)
        }
      }
    }
    func setValue(_ value: Value, forKey key: Key) {
      if orderQueue.contains(key) {
        // Move the key to the end of the queue (most recently used)
        if let index = orderQueue.firstIndex(of: key) {
          orderQueue.remove(at: index)
        }
      } else {
        // Check if the dictionary has reached its maxSize
        if orderQueue.count >= maxSize {
          let oldestKey = orderQueue.removeFirst()
          dictionary.removeValue(forKey: oldestKey)
        }
      }
      
      // Set the new value and update the orderQueue
      dictionary[key] = value
      orderQueue.append(key)
    }
    
    func getValue(forKey key: Key) -> Value? {
      return dictionary[key]
    }
    
    var allValues: [Value] {
      return orderQueue.compactMap { dictionary[$0] }
    }
    
    var count: Int {
      return orderQueue.count
    }
  }
  
  private var autoScanProgress = LimitedSizeDictionary<Int64, Int>(maxSize: 10)
  
  var fillAlpha: CGFloat = 0
  var colors: [UIColor] = [UIColor.blue]
  private var mQuads:[[NSValue]]?
  var quads: [[NSValue]]? {
    get {
      return self.mQuads
    }
    set {
      DispatchQueue.main.async() {
//        self.mQuads = newValue
//        self.setNeedsDisplay()
        self.setQuadsAnimated(points: newValue)
      }
    }
  }
  var imageSize: CGSize = CGSize.zero
  private var _videoGravity: AVLayerVideoGravity = AVLayerVideoGravity.resizeAspectFill
  public var videoGravity: String {
    get {
      return (_videoGravity ).rawValue
    }
    set {
      self._videoGravity = AVLayerVideoGravity(rawValue: newValue)
    }
  }
  var strokeWidth: CGFloat = 1.0
  var drawFill: Bool = true
  var animationDuration = 50.0
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    backgroundColor = UIColor.clear
    isOpaque = false
    fillAlpha = 0
    colors = [UIColor.blue]
  }
  
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    backgroundColor = UIColor.clear
    isOpaque = false
    fillAlpha = 0
    colors = [UIColor.blue]
  }
  
  override func draw(_ rect: CGRect) {

    guard let quads = animationQuads ??  mQuads, quads.count > 0 else {
      return
    }
    
    guard let context = UIGraphicsGetCurrentContext() else {
      return
    }
    
    let imageRatio = self.imageSize.width / self.imageSize.height
    let viewRatio = self.bounds.size.width / self.bounds.size.height
    var ratio: CGFloat
    var deltaX: CGFloat = 0
    var deltaY: CGFloat = 0
    
    let addedDeltaY: CGFloat = 35
    if (_videoGravity == AVLayerVideoGravity.resizeAspectFill) {
      if imageRatio < viewRatio {
        ratio = self.bounds.size.width / self.imageSize.width
        deltaY += (self.bounds.size.height - self.imageSize.height * ratio) / 2
      } else {
        ratio = self.bounds.size.height / self.imageSize.height
        deltaX += (self.bounds.size.width - self.imageSize.width * ratio) / 2
      }
    } else {
      if imageRatio >= viewRatio {
        ratio = self.bounds.size.width / self.imageSize.width
        deltaY += (self.bounds.size.height - self.imageSize.height * ratio) / 2
      } else {
        ratio = self.bounds.size.height / self.imageSize.height
        deltaX += (self.bounds.size.width - self.imageSize.width * ratio) / 2
      }
    }
    
    context.translateBy(x: deltaX, y: deltaY - addedDeltaY)
    context.setLineWidth(strokeWidth)
    context.setLineJoin(.round)
    
    quads.enumerated().forEach { (idx, quad) in
      context.setStrokeColor(colors[idx % colors.count].cgColor)
      
      if let startPoint = quad.first?.cgPointValue {
        context.move(to: CGPoint(x: startPoint.x * ratio, y: startPoint.y * ratio))
        
        quad.forEach { value in
          let point = value.cgPointValue
          context.addLine(to: CGPoint(x: point.x * ratio, y: point.y * ratio))
        }
        
        if let startPoint = quad.first?.cgPointValue {
          context.addLine(to: CGPoint(x: startPoint.x * ratio, y: startPoint.y * ratio))
        }
        context.closePath()
        let path = context.path
        var rect = path!.boundingBoxOfPath
        context.strokePath()
        let hash = AutoScanHandler.getHash(points: mQuads![idx])
        let progress = autoScanProgress.getValue(forKey: hash)
        if (progress != nil) {
          let unwrappedProgress = progress!
          let fillColor = colors[idx % colors.count].withAlphaComponent(fillAlpha / 255)
          context.setFillColor(fillColor.cgColor)
          let newHeight = rect.size.height * CGFloat(unwrappedProgress) / 100.0
          let y = rect.origin.y + rect.size.height - newHeight
          rect = CGRect(x: rect.origin.x, y: y, width: rect.size.width, height: newHeight)
          context.clip(to: rect)
          context.addPath(path!)
          context.fillPath()
          context.resetClip()
        } else if (drawFill) {
          if fillAlpha > 0 {
            context.addPath(path!)
            let fillColor = colors[idx % colors.count].withAlphaComponent(fillAlpha / 255)
            context.setFillColor(fillColor.cgColor)
            context.fillPath()
          }
        }
      }
    }
  }
  func replaceProgressHash(oldHash: Int64, newHash: Int64) {
    let currentValue = autoScanProgress.getValue(forKey: oldHash)
    if (currentValue != nil) {
      autoScanProgress.setValue(currentValue!, forKey: newHash)
    }
  }
  
  func updateProgress(hash: Int64, progress: Int) {
    if (progress == 0 || progress == 100) {
      autoScanProgress.removeValue(forKey: hash)
    } else {
      autoScanProgress.setValue(progress, forKey: hash);
    }
    setNeedsDisplay()
  }
  
  
  func interpolatePoint(point1: NSValue, point2: NSValue, value: CGFloat)-> CGPoint {
    return CGPoint(x: (point1.cgPointValue.x + (value)*(point2.cgPointValue.x - point1.cgPointValue.x)), y: (point1.cgPointValue.y + (value)*(point2.cgPointValue.y - point1.cgPointValue.y)))
  }
  
  private var mAnimator: AnimationDisplayLink?
  private var animationQuads: [[NSValue]]?
  private var startAnimationQuads: [[NSValue]]?
  func setQuadsAnimated(points: [[NSValue]]?) {
    if (mAnimator != nil) {
      mAnimator!.cancel()
      mAnimator = nil
    }
    if (mQuads == nil || points == nil || points!.count == 0 || points!.count != mQuads!.count) {
      self.mQuads = points
      setNeedsDisplay()
      return;
    }
    
    startAnimationQuads = animationQuads ?? self.mQuads
    animationQuads = nil
    self.mQuads = points
    let endQuads = self.mQuads!
    mAnimator = AnimationDisplayLink(duration: animationDuration / 1000.0, animationHandler: { percent in
      self.animationQuads = []
      endQuads.enumerated().forEach { (idx, quad) in
        let startAnimationQuad = self.startAnimationQuads![idx]
        self.animationQuads?.append([
          NSValue(cgPoint: self.interpolatePoint(point1: startAnimationQuad[0], point2: quad[0],value: percent)),
          NSValue(cgPoint: self.interpolatePoint(point1: startAnimationQuad[1], point2: quad[1],value: percent)),
          NSValue(cgPoint: self.interpolatePoint(point1: startAnimationQuad[2], point2: quad[2],value: percent)),
          NSValue(cgPoint: self.interpolatePoint(point1: startAnimationQuad[3], point2: quad[3],value: percent))])
      }
      self.setNeedsDisplay()
    }, completionHandler: { finished in
      self.animationQuads = nil
      self.startAnimationQuads = nil
      self.setNeedsDisplay()
    })
    mAnimator?.start()
  }
}
