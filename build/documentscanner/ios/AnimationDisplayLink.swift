//
//  AnimationDisplayLink.swift
//  
//
//  Created by Martin Guillon on 02/02/2024.
//

import Foundation

class AnimationDisplayLink : NSObject {
    var animationDuration: CGFloat
    var animationHandler: (percent: CGFloat) -> ()
    var completionHandler: (() -> ())?

    private var startTime: CFAbsoluteTime!
    private var displayLink: CADisplayLink!

    init(duration: CGFloat, animationHandler: (percent: CGFloat)->(), completionHandler: (()->())? = nil) {
        animationDuration = duration
        self.animationHandler = animationHandler
        self.completionHandler = completionHandler

        super.init()

        startDisplayLink()
    }

    private func startDisplayLink () {
        startTime = CFAbsoluteTimeGetCurrent()
        displayLink = CADisplayLink(target: self, selector: "handleDisplayLink:")
        displayLink.addToRunLoop(NSRunLoop.currentRunLoop(), forMode: NSRunLoopCommonModes)
    }

    private func stopDisplayLink() {
        displayLink.invalidate()
        displayLink = nil
    }

    func handleDisplayLink(displayLink: CADisplayLink) {
        let elapsed = CFAbsoluteTimeGetCurrent() - startTime
        var percent = CGFloat(elapsed) / animationDuration

        if percent >= 1.0 {
            stopDisplayLink()
            animationHandler(percent: 1.0)
            completionHandler?()
        } else {
            animationHandler(percent: percent)
        }
    }
}
