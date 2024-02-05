import Foundation
import UIKit

@objcMembers
@objc(AutoScanHandler)
class AutoScanHandler : NSObject {
  var distanceThreshold: CGFloat = 50.0
  var preAutoScanDelay: TimeInterval = 1.0
  var autoScanDuration: CGFloat = 1000.0
  private var _enabled: Bool = true
  var enabled: Bool {
    set { 
      if (newValue != _enabled) {
        _enabled = newValue
        self.cropView?.drawFill = !_enabled
        if (!_enabled) {
          self.clearAll()
        }
      }
    }
    get { return _enabled }
  }
  
  
  private var currentPoints: [[NSValue]]?
  private var hashMapping: [Int64: Int64] = [:]
  private var autoScanJobs: [Int64: DispatchWorkItem] = [:]
  private var preAutoScanJobs: [Int64: DispatchWorkItem] = [:]
  
  private let scope = DispatchQueue(label: "AutoScanHandlerQueue", attributes: .concurrent)
  
  var cropView: NSCropView?
  var onAutoScan: OnAutoScan?
  
  init(cropView: NSCropView? = nil, onAutoScan: OnAutoScan? = nil) {
    self.cropView = cropView
    self.onAutoScan = onAutoScan
    cropView?.drawFill = !self._enabled
  }
  
  func replaceHash(oldValue: Int64, newValue: Int64) {
    if let originalHash = hashMapping[oldValue] {
      hashMapping.removeValue(forKey: oldValue)
      hashMapping[newValue] = originalHash
    } else {
      hashMapping[newValue] = oldValue
    }
  }
  
  func clearAll() {
    //        scope.sync() {
    autoScanJobs.forEach { it in
      it.value.cancel()
      let hash = it.key
      let progressHash = hashMapping[firstKeyFor:hash] ?? hash
      DispatchQueue.main.async() {
        self.cropView?.updateProgress(hash: progressHash, progress: 0)
      }
    }
    autoScanJobs.removeAll()
    
    preAutoScanJobs.values.forEach { $0.cancel() }
    preAutoScanJobs.removeAll()
    
    currentPoints = nil
  }
  
  func process(points: [[NSValue]]?) {
    //        scope.sync() {
    guard _enabled else { return }
    
    if let points = points, !points.isEmpty {
      if currentPoints == nil {
        points.forEach { startAutoScanPreJob(points: $0) }
      } else {
        var mutableList = points
        currentPoints?.forEach { existingPointList in
          let hash = AutoScanHandler.getHash(points: existingPointList)
          let originalHash = hashMapping[hash] ?? hash
          
          var found = false
          
          for comparingPointList in mutableList {
            let distance = max(
              abs(existingPointList[0].cgPointValue.x - comparingPointList[0].cgPointValue.x),
              abs(existingPointList[1].cgPointValue.y - comparingPointList[1].cgPointValue.y),
              abs(existingPointList[2].cgPointValue.x - comparingPointList[2].cgPointValue.x),
              abs(existingPointList[3].cgPointValue.y - comparingPointList[3].cgPointValue.y)
            )
            
            if distance < distanceThreshold {
              if autoScanJobs[originalHash] == nil && preAutoScanJobs[originalHash] == nil {
                mutableList.removeAll { $0 == comparingPointList }
              } else {
                let newHash = AutoScanHandler.getHash(points: comparingPointList)
                DispatchQueue.main.async() {
                  self.cropView?.replaceProgressHash(oldHash: hash, newHash: newHash)
                }
                replaceHash(oldValue: hash, newValue: newHash)
                mutableList.removeAll { $0 == comparingPointList }
              }
              found = true
              break
            }
          }
          
          if !found {
            if let job = autoScanJobs[originalHash] {
              job.cancel()
              autoScanJobs.removeValue(forKey: originalHash)
              DispatchQueue.main.async() {
                self.cropView?.updateProgress(hash: hash, progress: 0)
              }
            }
            
            if let job = preAutoScanJobs[originalHash] {
              job.cancel()
              preAutoScanJobs.removeValue(forKey: originalHash)
            }
          }
        }
        
        mutableList.forEach { startAutoScanPreJob(points: $0) }
      }
    } else if (currentPoints != nil) {
      clearAll()
    }
    
    currentPoints = points
    //        }
  }
  
  func startAutoScanPreJob(points: [NSValue]) {
    let hash = AutoScanHandler.getHash(points: points)
    let delayMs = TimeInterval(self.preAutoScanDelay / 1000.0)
    let workItem = DispatchWorkItem { [weak self] in
      guard let self = self else { return }
      Thread.sleep(forTimeInterval: delayMs)
      if (preAutoScanJobs[hash] != nil) {
        self.startAutoScanJob(points: points)
        self.preAutoScanJobs.removeValue(forKey: hash)
      }
    }
    scope.async(execute: workItem)
    preAutoScanJobs[hash] = workItem
  }
  
  func startAutoScanJob(points: [NSValue]) {
    let hash = AutoScanHandler.getHash(points: points)
    let delayMs = TimeInterval(autoScanDuration / 1000.0 / 100.0)
    
    let workItem = DispatchWorkItem { [weak self] in
      guard let self = self else { return }
      let cropView = self.cropView
      for i in 0...100 {
        Thread.sleep(forTimeInterval: delayMs)
        let updateKey = hashMapping[firstKeyFor: hash] ?? hash
        DispatchQueue.main.async() {
          cropView?.updateProgress(hash: updateKey, progress: i)
        }
      }
      
      if (self.autoScanJobs[hash] != nil) {
        let originalKey = hashMapping[firstKeyFor: hash]
        if (_enabled && originalKey != nil) {
          if let onAutoScan = self.onAutoScan {
            let jsonArray = try? JSONSerialization.data(withJSONObject: points.map { [$0.cgPointValue.x, $0.cgPointValue.y] })
            if let jsonArray = jsonArray, let result = String(data: jsonArray, encoding: .utf8) {
              DispatchQueue.main.async() {
                onAutoScan.onAutoScan(result)
              }
            }
          }
        }
        
        self.autoScanJobs.removeValue(forKey: hash)
        let updateKey = originalKey ?? hash
        DispatchQueue.main.async() {
          cropView?.updateProgress(hash: updateKey, progress: 0)
        }
      }
      
    }
    
    autoScanJobs[hash] = workItem
    scope.async(execute: workItem)
  }
  static func getPointHash(_ point: CGPoint) -> Int {
    return Int(31 * point.x + point.y)
  }
  static func getHash(points: [NSValue]) -> Int64 {
    return Int64(AutoScanHandler.getPointHash(points[0].cgPointValue) +
                 1_000_0 * AutoScanHandler.getPointHash(points[1].cgPointValue) +
                 1_000_00 * AutoScanHandler.getPointHash(points[2].cgPointValue) +
                 1_000_000 * AutoScanHandler.getPointHash(points[3].cgPointValue))
  }
}
