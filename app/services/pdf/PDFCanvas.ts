import { ImageSource } from '@akylas/nativescript';
import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import { lc } from '~/helpers/locale';
import { getColorMatrix } from '~/utils/ui';
import { loadImage } from '~/utils/utils.common';
let bitmapPaint: Paint;
const textPaint = new Paint();
const bgPaint = new Paint();
bgPaint.color = 'white';
bgPaint.setShadowLayer(6, 0, 2, '#00000088');

function ptToPixel(value, dpi) {
    //1pt = 1/72 inch
    //1inch = dpi pixels

    return (value / 72) * dpi;
}

export default class PDFCanvas {
    canvas: Canvas;
    imagesCache: { [k: string]: ImageSource } = {};
    items: { pages: OCRPage[] }[];
    updatePages(documents: OCRDocument[]) {
        const { itemsPerPage } = this.options;

        const pages = documents.reduce((acc, doc) => {
            acc.push(...doc.pages);
            return acc;
        }, []);
        const docPagesLength = pages.length;
        let nbPages = Math.floor(docPagesLength / itemsPerPage);
        nbPages += (docPagesLength - nbPages) % itemsPerPage;
        const newItems = [];
        for (let index = 0; index < docPagesLength; index += itemsPerPage) {
            newItems.push({
                pages: pages.slice(index, index + itemsPerPage)
            });
        }
        this.items = newItems;
    }

    options = {
        pagerPagePaddingHorizontal: 16,
        pagerPagePaddingVertical: 8,
        pdfFormat: 'a4',
        pdfOrientation: 'portrait',
        pagePaddingPt: 10,
        itemsPerPage: 1,
        dpi: 96
    };

    async loadImagesForPage(pdfPageIndex) {
        const item = this.items[pdfPageIndex];
        for (let index = 0; index < item.pages.length; index++) {
            const src = item.pages[index].getImagePath();
            if (!this.imagesCache[src]) {
                this.imagesCache[src] = await loadImage(src);
            }
        }
    }
    draw() {
        this.items.forEach((item) => {
            this.drawPages(item.pages);
        });
    }
    drawPages(pages: OCRPage[], forExport = false) {
        const { pagerPagePaddingHorizontal, pagerPagePaddingVertical, pdfFormat, dpi, pagePaddingPt, pdfOrientation, itemsPerPage } = this.options;
        const pagePadding = ptToPixel(pagePaddingPt, dpi);
        const canvas = this.canvas;
        const w = canvas.getWidth() - 2 * (forExport ? 1 : pagerPagePaddingHorizontal);
        const h = canvas.getHeight() - 2 * (forExport ? 1 : pagerPagePaddingVertical);

        let dx = forExport ? 0 : pagerPagePaddingHorizontal;
        let dy = forExport ? 0 : pagerPagePaddingVertical;
        const nbItems = pages.length;
        const srcs = pages.map((page) => page.getImagePath());
        console.log('drawPDFPage', w, h, nbItems, srcs);
        const isLoading = srcs.some((src) => !this.imagesCache[src]);
        canvas.translate(dx, dy);
        const canvasRatio = w / h;
        if (pdfFormat === 'full') {
            // we only support 1 item per page for this
            const page = pages[0];
            let imageWidth = page.width;
            let imageHeight = page.height;
            if (page.rotation % 180 !== 0) {
                imageWidth = page.height;
                imageHeight = page.width;
            }
            imageWidth *= page.scale;
            imageHeight *= page.scale;
            const pageRatio = imageWidth / imageHeight;

            const src = page.getImagePath();
            let toDrawWidth;
            let toDrawHeight;
            let scale;
            if (pageRatio > canvasRatio) {
                toDrawWidth = w;
                toDrawHeight = w / pageRatio;
                scale = toDrawWidth / imageWidth;
            } else {
                toDrawWidth = h * pageRatio;
                toDrawHeight = h;
                scale = toDrawHeight / imageHeight;
            }

            canvas.translate(w / 2 - toDrawWidth / 2, h / 2 - toDrawHeight / 2);
            if (!forExport) {
                canvas.drawRect(0, 0, toDrawWidth, toDrawHeight, bgPaint);
            }

            if (isLoading) {
                canvas.drawText(lc('loading_images'), 0, 100, textPaint);
                return;
            }
            if (page.rotation !== 0) {
                const ddx = Math.min(toDrawWidth, toDrawHeight) / 2;
                canvas.rotate(page.rotation, ddx, ddx);
                // canvas.translate(ddx, ddy);
                // canvas.translate(ddx, -ddy);
            }
            canvas.scale(toDrawWidth / imageWidth, toDrawWidth / imageWidth, 0, 0);
            if (page.colorType || page.colorMatrix) {
                if (!bitmapPaint) {
                    bitmapPaint = new Paint();
                }
                bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
            } else if (bitmapPaint) {
                bitmapPaint.setColorFilter(null);
            }
            canvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
        } else if (pdfFormat === 'a4') {
            let a4Ratio = 595 / 842;
            if (pdfOrientation === 'landscape') {
                a4Ratio = 1 / a4Ratio;
            }
            let availableWidth;
            let availableHeight;
            console.log('a4Ratio', a4Ratio, canvasRatio);
            if (a4Ratio > canvasRatio) {
                availableWidth = w;
                availableHeight = w / a4Ratio;
                dy += (h - availableHeight) / 2;
            } else {
                availableWidth = h * a4Ratio;
                availableHeight = h;
                dx += (w - availableWidth) / 2;
            }
            console.log('availableWidth', dx, dy, pagePadding, availableWidth, availableHeight);
            if (!forExport) {
                canvas.drawRect(w / 2 - availableWidth / 2, h / 2 - availableHeight / 2, w / 2 + availableWidth / 2, h / 2 + availableHeight / 2, bgPaint);
            }
            if (isLoading) {
                canvas.drawText(lc('loading_images'), 0, 100, textPaint);
                return;
            }
            // compute space diivision
            let columns = nbItems > 2 ? 2 : 1;
            let rows = nbItems > 2 ? Math.ceil(nbItems / 2) : nbItems;
            console.log('columns', columns, rows);
            if (pdfOrientation === 'landscape') {
                const temp = columns;
                columns = rows;
                rows = temp;
            }
            const shared = Math.min(rows, columns);
            const widthPerColumn = availableWidth / columns;
            const widthPerRow = availableHeight / rows;
            let ddx = 0;
            let ddy = 0;
            let toDrawWidth;
            let toDrawHeight;
            console.log('rows', rows, columns, shared, widthPerColumn, widthPerRow);
            let index = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    const last = index === nbItems - 1;

                    const page = pages[i * shared + j];
                    let imageWidth = page.width;
                    let imageHeight = page.height;
                    if (page.rotation % 180 !== 0) {
                        imageWidth = page.height;
                        imageHeight = page.width;
                    }
                    const pageRatio = imageWidth / imageHeight;
                    const src = page.getImagePath();

                    let itemAvailableWidth = widthPerColumn - 2 * pagePadding;
                    let itemAvailableHeight = widthPerRow - 2 * pagePadding;
                    if (last && columns * rows > nbItems) {
                        if (pdfOrientation === 'landscape') {
                            itemAvailableHeight = 2 * widthPerRow - 2 * pagePadding;
                        } else {
                            itemAvailableWidth = 2 * widthPerColumn - 2 * pagePadding;
                        }
                    }
                    const itemRatio = widthPerColumn / widthPerRow;
                    if (pageRatio > itemRatio) {
                        toDrawWidth = itemAvailableWidth;
                        toDrawHeight = itemAvailableWidth / pageRatio;
                    } else {
                        toDrawHeight = itemAvailableHeight;
                        toDrawWidth = itemAvailableHeight * pageRatio;
                    }
                    canvas.save();
                    canvas.translate(ddx + pagePadding, ddy + pagePadding);
                    // canvas.drawRect(0, 0, itemAvailableWidth, itemAvailableHeight, bgPaint);
                    canvas.translate(itemAvailableWidth / 2 - toDrawWidth / 2, itemAvailableHeight / 2 - toDrawHeight / 2);

                    // canvas.drawRect(0, 0, toDrawWidth, toDrawHeight, bgPaint);
                    if (page.rotation !== 0) {
                        const ddx = Math.min(toDrawWidth, toDrawHeight) / 2;
                        canvas.rotate(page.rotation, ddx, ddx);
                        // canvas.translate(ddx, ddy);
                        // canvas.translate(ddx, -ddy);
                    }
                    canvas.scale(toDrawWidth / imageWidth, toDrawWidth / imageWidth, 0, 0);
                    if (page.colorType || page.colorMatrix) {
                        if (!bitmapPaint) {
                            bitmapPaint = new Paint();
                        }
                        bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
                    } else if (bitmapPaint) {
                        bitmapPaint.setColorFilter(null);
                    }
                    canvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
                    // canvas.drawBitmap(
                    //     imagesCache[src],
                    //     new Rect(0, 0, imageWidth, imageHeight),
                    //     new Rect(
                    //         ddx + pagePadding + itemAvailableWidth / 2 - toDrawWidth / 2,
                    //         ddy + pagePadding + itemAvailableHeight / 2 - toDrawHeight / 2,
                    //         ddx + pagePadding + itemAvailableWidth / 2 + toDrawWidth / 2,
                    //         ddy + pagePadding + itemAvailableHeight / 2 + toDrawHeight / 2
                    //     ),
                    //     null
                    // );
                    canvas.restore();
                    if (last) {
                        break;
                    }
                    // for those same size!
                    ddx += widthPerColumn;
                    index++;
                }
                ddy += widthPerRow;
                ddx = 0;
            }
            // }
        }
    }
}
