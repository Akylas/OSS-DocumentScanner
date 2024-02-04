//
//  Dictionary_extension.swift
//  nsdocumentscanner
//
//  Created by Martin Guillon on 02/02/2024.
//  Copyright © 2024 NativeScript. All rights reserved.
//

import Foundation
extension Dictionary where Value: Equatable {
    subscript(firstKeyFor value: Value) -> Key?  { first { $0.value == value }?.key }
    func allKeys(for value: Value) -> [Key] { compactMap { $0.value == value ? $0.key : nil } }
  
}
