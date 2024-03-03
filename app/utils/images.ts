import { ImageAsset, ImageSource } from '@nativescript/core';

export async function loadImage(sourceImagePath, maxSize = 4500) {
    // if (__ANDROID__) {
    // we need to use ImageAsset to correctly load images with content:
    // we also need it cause it loads the image "rotated"
    // Another reason is that it is the only way to do it the true async way
    const asset = new ImageAsset(sourceImagePath);
    asset.options = { autoScaleFactor: false, keepAspectRatio: true, maxWidth: maxSize, maxHeight: maxSize };
    const bitmap = await asset.getImage();
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
