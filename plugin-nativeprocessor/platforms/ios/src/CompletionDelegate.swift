import ObjectiveC
import Foundation

@objc(CompletionDelegate)
protocol CompletionDelegate {
  func onComplete(_ result: NSObject?, error:NSError?)
  func onProgress(_ progress: Int)
}
