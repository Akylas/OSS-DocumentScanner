import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import type { OCRPage } from '~/models/OCRDocument';
import { getColorMatrix } from '~/utils/matrix';
import { loadImage, recycleImages } from '~/utils/images';
import PDFCanvas from './PDFCanvas';
import { ImageSource } from '@nativescript/core';

export async function getTransformedImage(page: OCRPage) {
    const width = page.width * page.scale;
    const height = page.height * page.scale;
    const pageCanvas = new Canvas(width, height);
    const imageSource = await loadImage(page.imagePath, { sourceWidth: page.width, sourceHeight: page.height });
    DEV_LOG && console.log('getTransformedImage', JSON.stringify(page));
    const colorMatrix = page.colorMatrix || getColorMatrix(page.colorType);
    if (colorMatrix) {
        const bitmapPaint: Paint = new Paint();
        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(colorMatrix));

        pageCanvas.translate(width / 2, height / 2);
        pageCanvas.rotate(page.rotation, 0, 0);
        pageCanvas.scale(page.scale, page.scale, 0, 0);
        pageCanvas.drawBitmap(imageSource, -page.width / 2, -page.height / 2, bitmapPaint);
        recycleImages(imageSource);
        return new ImageSource(pageCanvas.getImage());
    }
    return imageSource;
}

export default class PDFExportCanvasBase extends PDFCanvas {}
