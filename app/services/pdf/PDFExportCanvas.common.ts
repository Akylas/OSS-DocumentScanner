import { lc } from '@nativescript-community/l';
import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import { File, ImageSource } from '@nativescript/core';
import type { OCRPage } from '~/models/OCRDocument';
import { loadImage, recycleImages } from '~/utils/images';
import { getPageColorMatrix } from '~/utils/matrix';
import PDFCanvas from './PDFCanvas';

export async function getTransformedImage(page: OCRPage, options: { width?; height?; scale?; colorMatrix?; rotation?; brightness?; contrast? } = {}, loadOptions = {}) {
    // DEV_LOG && console.log('getTransformedImage', JSON.stringify(page), JSON.stringify(options), JSON.stringify(loadOptions));
    const imageSource = await loadImage(page.imagePath, { sourceWidth: page.width, sourceHeight: page.height, ...loadOptions });
    if (isNaN(imageSource.width)) {
        throw new Error(lc('error_loading_image', page.imagePath, File.exists(page.imagePath)));
    }
    // DEV_LOG && console.log('getTransformedImage', JSON.stringify(page), options, loadOptions);
    const colorMatrix = options?.colorMatrix || getPageColorMatrix(page, undefined, options?.brightness, options?.contrast);
    const rotation = options?.rotation || page.rotation;
    if (colorMatrix || rotation || options.width || options.height) {
        const scale = options.scale || page.scale;
        const width = options.width || imageSource.width * scale;
        const height = options.height || imageSource.height * scale;
        const imageScale = width / imageSource.width;
        let rotateWidth = width;
        let rotateHeight = height;
        if (rotation % 180 !== 0) {
            const oldWidth = rotateWidth;
            rotateWidth = rotateHeight;
            rotateHeight = oldWidth;
        }
        const pageCanvas = new Canvas(rotateWidth, rotateHeight);
        const bitmapPaint: Paint = new Paint();
        if (__ANDROID__) {
            pageCanvas.setDensity(imageSource.android.getDensity());
        }
        if (colorMatrix) {
            bitmapPaint.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
        }

        pageCanvas.translate(rotateWidth / 2, rotateHeight / 2);
        pageCanvas.rotate(page.rotation, 0, 0);
        pageCanvas.scale(scale, scale, 0, 0);
        pageCanvas.drawBitmap(imageSource, -imageSource.width / 2, -imageSource.height / 2, bitmapPaint);
        recycleImages(imageSource);
        return new ImageSource(pageCanvas.getImage());
    }
    return imageSource;
}

export default class PDFExportCanvasBase extends PDFCanvas {}
