import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import { OCRPage } from '~/models/OCRDocument';
import { getColorMatrix } from '~/utils/ui';
import { loadImage, recycleImages } from '~/utils/utils.common';
import PDFCanvas from './PDFCanvas';
import { ImageSource } from '@akylas/nativescript';

export async function getTransformedImage(page: OCRPage) {
    const width = page.width * page.scale;
    const height = page.height * page.scale;
    const pageCanvas = new Canvas(width, height);
    const imageSource = await loadImage(page.getImagePath());
    if (page.colorType || page.colorMatrix) {
        const bitmapPaint: Paint = new Paint();
        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));

        pageCanvas.translate(width / 2, height / 2);
        pageCanvas.rotate(page.rotation, 0, 0);
        pageCanvas.scale(page.scale, page.scale, 0, 0);
        pageCanvas.drawBitmap(imageSource.android, -page.width / 2, -page.height / 2, bitmapPaint);
        recycleImages(imageSource);
        return new ImageSource(pageCanvas.getImage());
    }
    return imageSource;
}

export default class PDFExportCanvasBase extends PDFCanvas {}
