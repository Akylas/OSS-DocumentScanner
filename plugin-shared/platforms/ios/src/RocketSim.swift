import Foundation
import UIKit

@objcMembers
@objc(RocketSim)
class RocketSim : NSObject {
    static func loadRocketSimConnect() {
#if NOT_PRODUCTION
    guard (Bundle(path: "/Applications/RocketSim.app/Contents/Frameworks/RocketSimConnectLinker.nocache.framework")?.load() == true) else {
        print("Failed to load linker framework")
        return
    }
    print("RocketSim Connect successfully linked")
#endif
    }
}