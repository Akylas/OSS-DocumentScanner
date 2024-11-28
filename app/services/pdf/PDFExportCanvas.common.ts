import { lc } from '@nativescript-community/l';
import { Canvas, ColorMatrixColorFilter, LayoutAlignment, Paint, Rect, StaticLayout } from '@nativescript-community/ui-canvas';
import { Color, File, ImageSource, Utils } from '@nativescript/core';
import type { OCRDocument, OCRPage } from '~/models/OCRDocument';
import { loadImage, recycleImages } from '~/utils/images';
import { getPageColorMatrix } from '~/utils/matrix';
import PDFCanvas from './PDFCanvas';
import { CARD_RATIO } from '~/utils/constants';
import { createView } from '@shared/utils/ui';
import { Label } from '@nativescript-community/ui-label';
import { colors } from '~/variables';
import { get } from 'svelte/store';
import { maxDate } from '@akylas/nativescript/ui/date-picker';

const textPaint = new Paint();
textPaint.setTextSize(40);
textPaint.setFontWeight('bold');
function calculateMaxTextSize({
    maxFontSize,
    maxHeight,
    maxWidth,
    minFontSize,
    paint,
    startFontSize,
    step = 2,
    text
}: {
    text;
    paint: Paint;
    startFontSize;
    minFontSize;
    maxFontSize;
    step?;
    maxWidth: number;
    maxHeight: number;
}) {
    if (text == null || paint == null) return 0;
    const bound = new Rect(0, 0, 0, 0);
    let size = Math.max(startFontSize, minFontSize);
    let oldSize = size;
    paint.setTextSize(size);
    paint.getTextBounds(text, 0, text.length, bound);
    DEV_LOG && console.log('calculateMaxTextSize start ', startFontSize, size, bound.width(), bound.height());
    if (bound.width() > maxWidth && bound.height() > maxHeight) {
        while (((bound.width() > maxWidth && bound.height() > maxHeight) || size > maxFontSize) && size >= minFontSize) {
            size -= step;
            paint.setTextSize(size);
        }
        return size;
    } else {
        while (size < maxFontSize && bound.width() < maxWidth && bound.height() < maxHeight) {
            oldSize = size;
            size += step;
            paint.setTextSize(size);
        }
        return oldSize;
    }
}

export async function getTransformedImage({
    document,
    loadOptions = {},
    options = {},
    page
}: {
    page: OCRPage;
    options?: { width?; height?; scale?; colorMatrix?; rotation?; brightness?; contrast? };
    loadOptions?;
    document?: OCRDocument;
}) {
    DEV_LOG && console.log('getTransformedImage', JSON.stringify(page), JSON.stringify(options), JSON.stringify(loadOptions));
    if (page.imagePath) {
        const imageSource = await loadImage(page.imagePath, { sourceWidth: page.width, sourceHeight: page.height, ...loadOptions });
        if (isNaN(imageSource.width)) {
            throw new Error(lc('error_loading_image', page.imagePath, File.exists(page.imagePath)));
        }
        const colorMatrix = options?.colorMatrix || getPageColorMatrix(page, undefined, options?.brightness, options?.contrast);
        const rotation = options?.rotation || page.rotation;
        if (colorMatrix || rotation || options.width || options.height) {
            const scale = options.scale || page.scale;
            const width = options.width || imageSource.width * scale;
            const height = options.height || imageSource.height * scale;
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
    } else if (CARD_APP && document) {
        const backgroundColor = new Color(page.colors?.[0] || document.extra?.color || get(colors).colorPrimary);
        DEV_LOG && console.log('draw image', !!document, typeof document.name, document.name, page);
        const padding = 16;
        const width = 800;
        const height = width * CARD_RATIO;
        const canvas = new Canvas(width, height);
        let textColor = 'black';
        if (document.extra?.color) {
            canvas.drawColor(backgroundColor);
            textColor = backgroundColor.getBrightness() < 145 ? 'white' : 'black';
        }
        textPaint.color = textColor;
        const fontSize = calculateMaxTextSize({
            text: document.name,
            paint: textPaint,
            maxWidth: width - 2 * padding,
            maxHeight: height - 2 * padding,
            minFontSize: 40,
            maxFontSize: 100,
            startFontSize: 80
        });
        DEV_LOG && console.log('calculateMaxTextSize', fontSize);
        textPaint.setTextSize(fontSize);
        const staticLayout = new StaticLayout(document.name, textPaint, width - 2 * padding, LayoutAlignment.ALIGN_CENTER, 1, 0, true);
        canvas.translate(padding, height / 2 - staticLayout.getHeight() / 2);
        staticLayout.draw(canvas);
        return new ImageSource(canvas.getImage());
    }
}

export default class PDFExportCanvasBase extends PDFCanvas {}
