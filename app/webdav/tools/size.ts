import { File } from '@nativescript/core';
import { isArrayBuffer } from '../compat/arrayBuffer';
import { isBuffer } from '../compat/buffer';
import { BufferLike } from '../types';
function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s;
}
export function calculateDataLength(data: string | BufferLike | File): number {
    if (data instanceof File) {
        return data.size;
    } else if (isArrayBuffer(data)) {
        return (data as ArrayBuffer).byteLength;
    } else if (isBuffer(data)) {
        return (data as Buffer).length;
    } else if (typeof data === 'string') {
        return byteLength(data);
    }
    throw new Error('Cannot calculate data length: Invalid type');
}
