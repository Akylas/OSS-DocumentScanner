export function decodeHTMLEntities(text: string): string {
    // Node
    return text;
    // return new TextDecoder('utf-8').decode(text);
}
export function fromBase64(value: string) {
    if (__IOS__) {
        const data = NSData.alloc().initWithBase64EncodedStringOptions(value, 0 as any);
        return NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding);
    }
    if (__ANDROID__) {
        const text = new java.lang.String(value);
        const data = text.getBytes('UTF-8');
        return new java.lang.String(android.util.Base64.decode(data, android.util.Base64.DEFAULT));
    }
}

export function toBase64(value: string): string {
    if (__IOS__) {
        const text = NSString.stringWithString(value);
        const data = text.dataUsingEncoding(NSUTF8StringEncoding);
        return data.base64EncodedStringWithOptions(0 as any);
    }
    if (__ANDROID__) {
        return android.util.Base64.encodeToString(new java.lang.String(value).getBytes('UTF-8'), android.util.Base64.NO_WRAP);
    }
}
