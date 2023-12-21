// NSLocale+ISO639_2.m
//
// NSLocale category to get an ISO 639.2 language code
//
// The MIT License (MIT)
//
// Copyright (c) 2014 Almer Lucke
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE


#import "NSLocale+ISO639_2.h"

@implementation NSLocale (ISO639_2)

+ (NSDictionary *)ISO639_2Dictionary
{
    static dispatch_once_t onceToken;
    static NSDictionary *sISO639_2Dictionary = nil;
    
    dispatch_once(&onceToken, ^{
        NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:@"iso639_2" withExtension:@"bundle"];
        NSBundle *bundle = [NSBundle bundleWithURL:bundleURL];
        NSString *plistPath = [bundle pathForResource:@"iso639_1_to_iso639_2" ofType:@"plist"];
        
        sISO639_2Dictionary = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    });
    
    return sISO639_2Dictionary;
}

- (NSString *)ISO639_2LanguageCode
{
    NSString *ISO639_1LanguageCode = [self objectForKey:NSLocaleLanguageCode];
    NSString *ISO639_2LanguageCode = [[[self class] ISO639_2Dictionary] objectForKey:ISO639_1LanguageCode];
    
    if (!ISO639_2LanguageCode) return ISO639_1LanguageCode;
    
    return ISO639_2LanguageCode;
}

@end
