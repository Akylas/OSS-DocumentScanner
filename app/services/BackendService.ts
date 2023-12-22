/* eslint-disable no-redeclare */
import { ApplicationSettings, Observable } from '@nativescript/core';

export const stringProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    target[innerKey] = ApplicationSettings.getString(actualkey);

    // property getter
    const getter = function () {
        return this[innerKey];
    };

    // property setter
    const setter = function (newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined || newVal === null) {
            return ApplicationSettings.remove(actualkey);
        }
        return ApplicationSettings.setString(actualkey, newVal);
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
};
export const objectProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;

    const savedValue = ApplicationSettings.getString(actualkey);
    target[innerKey] = savedValue !== undefined ? JSON.parse(savedValue) : undefined;

    // property getter
    const getter = function () {
        return this[innerKey];
    };

    // property setter
    const setter = function (newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined || newVal === null) {
            return ApplicationSettings.remove(actualkey);
        }
        return ApplicationSettings.setString(actualkey, JSON.stringify(newVal));
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
};

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
            return ApplicationSettings.remove(actualkey);
        }
        return setFunc(actualkey, newVal);
    };
}
function nativePropertyGenerator<T>(target: Object, key: any, options: PropertyDecoratorOptions<T>, getFunc: Function, setFunc: Function) {
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    const savedValue = getFunc(actualkey);
    if ((savedValue === undefined || savedValue === null) && options.hasOwnProperty('default')) {
        target[innerKey] = options.default;
    } else {
        target[innerKey] = savedValue;
    }
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: createGetter<T>(actualkey, innerKey, options),
        set: createSetter<T>(actualkey, innerKey, options, setFunc)
    });
}
export function booleanProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function booleanProperty(options: PropertyDecoratorOptions<boolean>): (target: any, k?, desc?: PropertyDescriptor) => any;
export function booleanProperty(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator<boolean>(target, key, args[0] || {}, ApplicationSettings.getBoolean, ApplicationSettings.setBoolean);
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator<boolean>(args[startIndex], args[startIndex + 1], options || {}, ApplicationSettings.getBoolean, ApplicationSettings.setBoolean);
    }
}
export const numberProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    target[innerKey] = ApplicationSettings.getNumber(actualkey);

    // property getter
    const getter = function () {
        return this[innerKey];
    };

    // property setter
    const setter = function (newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined || newVal === null) {
            return ApplicationSettings.remove(actualkey);
        }
        return ApplicationSettings.setNumber(actualkey, newVal);
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });
};

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService extends Observable {}
