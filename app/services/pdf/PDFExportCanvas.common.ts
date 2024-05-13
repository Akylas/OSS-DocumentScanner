import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import type { OCRPage } from '~/models/OCRDocument';
import { getColorMatrix, getPageColorMatrix } from '~/utils/matrix';
import { lc } from '~/helpers/locale';
import { loadImage, recycleImages } from '~/utils/images';
import PDFCanvas from './PDFCanvas';
import { File, ImageSource } from '@nativescript/core';

export async function getTransformedImage(page: OCRPage) {
    const width = page.width * page.scale;
    const height = page.height * page.scale;
    const pageCanvas = new Canvas(width, height);
    const imageSource = await loadImage(page.imagePath, { sourceWidth: page.width, sourceHeight: page.height });
    if (isNaN(imageSource.width)) {
        throw new Error(lc('error_loading_image', page.imagePath, File.exists(page.imagePath)));
    }
    DEV_LOG && console.log('getTransformedImage', JSON.stringify(page));
    const colorMatrix = getPageColorMatrix(page);
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
