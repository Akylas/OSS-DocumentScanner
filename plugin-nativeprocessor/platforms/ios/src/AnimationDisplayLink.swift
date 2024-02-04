//
//  AnimationDisplayLink.swift
//
//
//  Created by Martin Guillon on 02/02/2024.
//

import Foundation
import QuartzCore
import UIKit

class AnimationDisplayLink : NSObject {
  var animationDuration: CGFloat
  var animationHandler: (_ percent: CGFloat) -> ()
  var completionHandler: ((_ finished: Bool) -> ())?
  
  private var startTime: CFAbsoluteTime?
  private var displayLink: CADisplayLink?
  
  init(duration: CGFloat, animationHandler: @escaping (_ percent: CGFloat)->(), completionHandler: ((_ finished: Bool)->())? = nil) {
    self.animationDuration = duration
    self.animationHandler = animationHandler
    self.completionHandler = completionHandler
    
    super.init()
    
  }
  
  public func start () {
    if (displayLink == nil) {
      displayLink = CADisplayLink(target: self, selector: #selector(handleDisplayLink))
      displayLink?.preferredFramesPerSecond = UIScreen.main.maximumFramesPerSecond
      startTime = CACurrentMediaTime()
      displayLink!.add(to: RunLoop.current, forMode: .common)
    }
  }
  
  func stop() {
    if (displayLink != nil) {
      displayLink!.invalidate()
      displayLink = nil
    }
  }
  
  @objc func handleDisplayLink(displayLink: CADisplayLink) {
    let now = CACurrentMediaTime()
   if (now >= displayLink.targetTimestamp) {
        return
    }
    let elapsed = now - startTime!
    let percent = (elapsed) / animationDuration
    if percent >= 1.0 {
      stop()
      animationHandler(1.0)
      completionHandler?(true)
    } else {
      animationHandler(percent)
    }
  }
  func cancel() {
    stop()
    completionHandler?(false)
  }
}
