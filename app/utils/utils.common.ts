import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { ImageAsset, ImageSource } from '@nativescript/core';
import { SDK_VERSION, copyToClipboard } from '@nativescript/core/utils';
import { lc } from '~/helpers/locale';
import { showToast } from './utils';

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}

export async function loadImage(sourceImagePath) {
    // if (__ANDROID__) {
    // we need to use ImageAsset to correctly load images with content:
    // we also need it cause it loads the image "rotated"
    const asset = new ImageAsset(sourceImagePath);
    asset.options = { autoScaleFactor: false };
    const bitmap = await new Promise((resolve, reject) => {
        asset.getImageAsync((image, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(image);
            }
        });
    });
    return new ImageSource(bitmap);
    // } else {
    //     return ImageSource.fromFile(sourceImagePath);
    // }
}

export function recycleImages(...args) {
    if (__ANDROID__) {
        for (let index = 0; index < args.length; index++) {
            const arg = args[index];
            if (!arg) {
                continue;
            }
            // this first test detect android native arrays
            if (Array.isArray(arg)) {
                recycleImages(...arg);
            } else if (typeof arg === 'object' && arg.length > 0) {
                for (let j = 0; j < arg.length; j++) {
                    arg[j]?.recycle();
                }
            } else if (arg.android) {
                arg.android.recycle();
            } else {
                arg.recycle();
            }
        }
    }
}

export function copyTextToClipboard(text) {
    copyToClipboard(text);
    showToast(lc('copied'));
}
