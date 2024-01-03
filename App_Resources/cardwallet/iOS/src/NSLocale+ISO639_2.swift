//
//  NSLocale+ISO639_2.swift
//  nsdocumentscanner
//
//  Created by Martin Guillon on 03/01/2024.
//  Copyright © 2024 NativeScript. All rights reserved.
//

import Foundation


@objc(NSLocale)
extension NSLocale {
  static let sISO639_2Dictionary: NSDictionary? = {
    let bundleURL:URL! =  Bundle.main.url(forResource:"iso639_2", withExtension:"bundle")
    let bundle:Bundle! = Bundle(url: bundleURL)
    let plistPath:String! = bundle.path(forResource: "iso639_1_to_iso639_2", ofType:"plist")
    return NSDictionary(contentsOfFile: plistPath)
  }()
  class func ISO639_2Dictionary() -> NSDictionary! {
    return sISO639_2Dictionary;
  }

  @objc
  func ISO639_2LanguageCode() -> String! {
    let ISO639_1LanguageCode:String! = self.object(forKey: NSLocale.Key.languageCode) as? String
    let ISO639_2LanguageCode:String? = NSLocale.ISO639_2Dictionary().object(forKey: ISO639_1LanguageCode!) as? String
    if (ISO639_2LanguageCode == nil) {return ISO639_1LanguageCode}
    return ISO639_2LanguageCode
  }
}
