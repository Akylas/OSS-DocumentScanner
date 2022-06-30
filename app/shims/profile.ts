export function profile(nameFnOrTarget?: string | Function | Object, fnOrKey?: Function | string | symbol, descriptor?: PropertyDescriptor, attrs?: any): any {
    return typeof nameFnOrTarget === 'function' ? nameFnOrTarget : fnOrKey;
}

export function level() {
    return 0;
}
