export function isBuffer(value: any): boolean {
    return value != null && value.constructor != null && typeof value.constructor.isBuffer === 'function' && value.constructor.isBuffer(value);
}
