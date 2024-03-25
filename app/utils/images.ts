import { ImageAsset, ImageSource, Utils } from '@nativescript/core';
import { getImageSize } from './utils.ios';

export async function loadImage(
    imagePath,
    {
        imageSizeThreshold = 4500,
        imageScale = 1,
        reqWidth,
        reqHeight,
        imageWidth,
        imageHeight,
        jpegQuality
    }: { reqWidth?; reqHeight?; imageSizeThreshold?; imageScale?; imageWidth?; imageHeight?; jpegQuality? } = {}
) {
    // we need to use ImageAsset to correctly load images with content:
    // we also need it cause it loads the image "rotated"
    // Another reason is that it is the only way to do it the true async way
    if (!imageWidth || !imageHeight) {
        const size = getImageSize(imagePath);
        imageWidth = size.width;
        imageHeight = size.height;
    }
    reqWidth = reqWidth || imageWidth;
    reqHeight = reqHeight || imageHeight;
    if (imageSizeThreshold !== 0) {
        const minSize = Math.max(reqWidth, reqHeight);
        if (minSize > imageSizeThreshold) {
            const resizeScale = (1.0 * minSize) / imageSizeThreshold;
            reqWidth = reqWidth / resizeScale;
            reqHeight = reqHeight / resizeScale;
        }
    }
    if (imageScale !== 1.0) {
        reqWidth = reqWidth * imageScale;
        reqHeight = reqHeight * imageScale;
    }
    const loadOptions = JSON.stringify({
        width: Math.round(reqWidth),
        height: Math.round(reqHeight),
        jpegQuality
    });
    if (__IOS__) {
        return new ImageSource(ImageUtils.readImageFromFileStringOptions(imagePath, loadOptions));
    } else {
        return new ImageSource(com.akylas.documentscanner.utils.ImageUtil.Companion.readBitmapFromFile(Utils.android.getApplicationContext(), imagePath, loadOptions));
    }
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
