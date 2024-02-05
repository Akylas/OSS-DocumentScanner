import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { ImageAsset, ImageSource } from '@nativescript/core';
import { SDK_VERSION, copyToClipboard } from '@nativescript/core/utils';
import { lc } from '~/helpers/locale';

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}
