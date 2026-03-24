// import { getBoolean, getNumber, getString, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';
import { Observable } from '@nativescript/core/data/observable';
import { getBoolean, getNumber, getString, hasKey, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';

interface PropertyDecoratorOptions<T> {
    default?: T;
}
function createGetter<T>(actualkey: string, innerKey: string, options: PropertyDecoratorOptions<T>) {
    return function () {
        return this[innerKey] as T;
    };
}
function createSetter<T>(actualkey: string, innerKey: string, options: PropertyDecoratorOptions<T>, setFunc: Function) {
    return function (newVal: T) {
        this[innerKey] = newVal;
        if (newVal === undefined || newVal === null) {
            return remove(actualkey);
        }
        return setFunc(actualkey, newVal, options);
    };
}
function nativePropertyGenerator<T>(target: object, key: any, options: PropertyDecoratorOptions<T>, getFunc: Function, setFunc: Function) {
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    const savedValue = getFunc(actualkey, options);
    if ((savedValue === undefined || savedValue === null) && options.hasOwnProperty('default')) {
        target[innerKey] = options.default;
    } else {
        target[innerKey] = savedValue;
    }
    Object.defineProperty(target, key, {
        get: createGetter<T>(actualkey, innerKey, options),
        set: createSetter<T>(actualkey, innerKey, options, setFunc),
        enumerable: true,
        configurable: true
    });
}
export function booleanProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function booleanProperty(options: PropertyDecoratorOptions<boolean>): (target: any, k?, desc?: PropertyDescriptor) => any;
export function booleanProperty(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator<boolean>(target, key, args[0] || {}, getBoolean, setBoolean);
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator<boolean>(args[startIndex], args[startIndex + 1], options || {}, getBoolean, setBoolean);
    }
}

export function numberProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function numberProperty(options: PropertyDecoratorOptions<boolean>): (target: any, k?, desc?: PropertyDescriptor) => any;
export function numberProperty(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator<number>(target, key, args[0] || {}, getNumber, setNumber);
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator<number>(args[startIndex], args[startIndex + 1], options || {}, getNumber, setNumber);
    }
}

export function stringProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function stringProperty(options: PropertyDecoratorOptions<boolean>): (target: any, k?, desc?: PropertyDescriptor) => any;
export function stringProperty(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator<string>(target, key, args[0] || {}, getString, setString);
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator<string>(args[startIndex], args[startIndex + 1], options || {}, getString, setString);
    }
}

function objectGetter<T>(key, options: PropertyDecoratorOptions<T>) {
    if (hasKey(key)) {
        return JSON.parse(getString(key));
    }
    return options?.default;
}
function objectSetter<T>(key, value: T, options: PropertyDecoratorOptions<T>) {
    setString(key, JSON.stringify(value));
}
export function objectProperty<T>(target: any, k?, desc?: PropertyDescriptor): any;
export function objectProperty<T>(options: PropertyDecoratorOptions<boolean>): (target: any, k?, desc?: PropertyDescriptor) => any;
export function objectProperty<T>(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator<T>(target, key, args[0] || {}, objectGetter, objectSetter);
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator<T>(args[startIndex], args[startIndex + 1], options || {}, objectGetter, objectSetter);
    }
}

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService extends Observable {}
