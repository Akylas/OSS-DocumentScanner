import { ImageSource, Utils } from '@nativescript/core';

export async function loadImage(imagePath, loadOptions: { width?; height?; resizeThreshold?; sourceWidth?; sourceHeight?; jpegQuality? } = {}) {
    loadOptions.resizeThreshold = loadOptions.resizeThreshold || 4500;
    if (__IOS__) {
        return new ImageSource(ImageUtils.readImageFromFileStringOptions(imagePath, JSON.stringify(loadOptions)));
    } else {
        return new ImageSource(com.akylas.documentscanner.utils.ImageUtil.Companion.readBitmapFromFile(Utils.android.getApplicationContext(), imagePath, JSON.stringify(loadOptions)));
    }
    // const asset = new ImageAsset(imagePath);
    // asset.options = { autoScaleFactor: false, keepAspectRatio: true, width: Math.round(reqWidth), height: Math.round(reqHeight) };
    // DEV_LOG && console.log('loadImage', sourceWidth, sourceHeight, resizeThreshold, imageScale, reqWidth, reqHeight, asset.options);
    // const bitmap = await asset.getImage();
    // return new ImageSource(bitmap);
}

export function recycleImages(...args) {
    // DEV_LOG && console.log('recycleImages', args.length, new Error().stack);
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
                    arg[j]?.recycle?.();
                }
            } else if (arg.android) {
                arg.android.recycle?.();
            } else {
                arg.recycle?.();
            }
        }
    }
}
