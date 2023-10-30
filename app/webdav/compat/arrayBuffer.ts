const hasArrayBuffer = typeof ArrayBuffer === 'function';
const { toString: objToString } = Object.prototype;

// Taken from: https://github.com/fengyuanchen/is-array-buffer/blob/master/src/index.js
export function isArrayBuffer(value: any): boolean {
    return hasArrayBuffer && (value instanceof ArrayBuffer || objToString.call(value) === '[object ArrayBuffer]');
}
