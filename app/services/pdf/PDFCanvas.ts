import { Canvas, ColorMatrixColorFilter, LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
import { ApplicationSettings, ImageSource, Screen, Utils } from '@nativescript/core';
import type { OCRDocument, OCRPage } from '~/models/OCRDocument';
import { getColorMatrix } from '~/utils/matrix';
import { loadImage, recycleImages } from '~/utils/images';
import { DEFAULT_PDF_OPTIONS } from '~/models/constants';
let bitmapPaint: Paint;
const textPaint = new Paint();

const textOverlayPaint = new Paint();
textOverlayPaint.color = '#00000077';
const bgPaint = new Paint();
bgPaint.color = 'white';
bgPaint.setShadowLayer(6, 0, 2, '#00000088');

function ptToPixel(value, dpi) {
    //1pt = 1/72 inch
    //1inch = dpi pixels

    return (value / 72) * dpi;
}

export interface PDFCanvasItem {
    pages: OCRPage[];
    index;
    number;
    loading?: boolean;
}

export default class PDFCanvas {
    canvas: Canvas;
    imagesCache: { [k: string]: ImageSource } = {};
    items: PDFCanvasItem[];
    updatePages(pages: OCRPage[]) {
        let { items_per_page } = this.options;
        if (this.options.paper_size === 'full') {
            items_per_page = 1;
        }

        // const pages = documents.reduce((acc, doc) => {
        //     acc.push(...doc.pages);
        //     return acc;
        // }, []);
        const docPagesLength = pages.length;
        let nbPages = Math.floor(docPagesLength / items_per_page);
        nbPages += (docPagesLength - nbPages) % items_per_page;
        const newItems = [];
        for (let index = 0; index < docPagesLength; index += items_per_page) {
            const item = {
                index,
                pages: pages.slice(index, index + items_per_page)
            } as PDFCanvasItem;
            // item.loading = this.needsLoadImage(index, item);
            newItems.push(item);
        }
        this.items = newItems;
    }

    options: {
        reduce_image_size: boolean;
        pagerPagePaddingHorizontal: number;
        pagerPagePaddingVertical: number;
        paper_size: string;
        color: string;
        orientation: string;
        page_padding: number;
        items_per_page: number;
        dpi: number;
        draw_ocr_text: boolean;
        draw_ocr_overlay: boolean;
    } = JSON.parse(ApplicationSettings.getString('default_export_options', DEFAULT_PDF_OPTIONS));

    async loadImagesForPage(pdfPageIndex) {
        const item = this.items[pdfPageIndex];
        for (let index = 0; index < item.pages.length; index++) {
            const src = item.pages[index].imagePath;
            if (!this.imagesCache[src]) {
                this.imagesCache[src] = await loadImage(src);
            }
        }
    }
    needsLoadImage(pdfPageIndex, item?) {
        item = item || this.items[pdfPageIndex];
        for (let index = 0; index < item.pages.length; index++) {
            const src = item.pages[index].imagePath;
            if (!this.imagesCache[src]) {
                return true;
            }
        }
        return false;
    }
    draw() {
        this.items.forEach((item, index) => {
            this.drawPages(index, item.pages);
        });
    }
    updateBitmapPaint(page: OCRPage) {
        DEV_LOG && console.log('updateBitmapPaint', this.options.color, page);
        if (this.options.color === 'black_white') {
            if (!bitmapPaint) {
                bitmapPaint = new Paint();
            }
            bitmapPaint.setColorFilter(new ColorMatrixColorFilter(getColorMatrix('grayscale')));
        } else if (page.colorType || page.colorMatrix) {
            const matrix = page.colorMatrix || getColorMatrix(page.colorType);
            if (matrix) {
                if (!bitmapPaint) {
                    bitmapPaint = new Paint();
                }
                bitmapPaint.setColorFilter(new ColorMatrixColorFilter(matrix));
            } else if (bitmapPaint) {
                bitmapPaint.setColorFilter(null);
            }
        } else if (bitmapPaint) {
            bitmapPaint.setColorFilter(null);
        }
    }
    drawImageOnCanvas(canvas: Canvas, page: OCRPage, toDrawWidth, toDrawHeight, forExport) {
        const dpi = this.options.dpi;
        const src = page.imagePath;
        let imageWidth = page.width;
        let imageHeight = page.height;
        if (page.rotation % 180 !== 0) {
            imageWidth = page.height;
            imageHeight = page.width;
        }
        // DEV_LOG && console.log('drawImageOnCanvas', toDrawWidth, toDrawHeight, imageWidth, imageHeight, this.imagesCache[src]);
        if (forExport && this.options.reduce_image_size) {
            // size is in PT we need to transform to pixels to reduce file size
            const canvasWidth = ptToPixel(Utils.layout.toDevicePixels(toDrawWidth), dpi);
            const canvasHeight = ptToPixel(Utils.layout.toDevicePixels(toDrawHeight), dpi);
            const pageCanvas = new Canvas(canvasWidth, canvasHeight);
            this.updateBitmapPaint(page);
            const resizeImageScale = canvasWidth / imageWidth;
            pageCanvas.scale(resizeImageScale, resizeImageScale, 0, 0);
            if (page.rotation !== 0) {
                const ddx = Math.min(imageWidth, imageHeight) / 2;
                pageCanvas.rotate(page.rotation, ddx, ddx);
            }
            pageCanvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
            const resizedImage = pageCanvas.getImage();

            const imageScale = toDrawWidth / canvasWidth;
            // now we draw the resized and transformed image
            canvas.save();
            canvas.scale(imageScale, imageScale, 0, 0);
            canvas.drawBitmap(resizedImage, 0, 0, bitmapPaint);
            canvas.restore();
            recycleImages(resizedImage);
        } else {
            canvas.save();
            if (page.rotation !== 0) {
                const ddx = Math.min(toDrawWidth, toDrawHeight) / 2;
                canvas.rotate(page.rotation, ddx, ddx);
            }
            const imageScale = toDrawWidth / imageWidth;
            canvas.scale(imageScale, imageScale, 0, 0);
            this.updateBitmapPaint(page);

            canvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
            canvas.restore();
        }
        if (this.options.draw_ocr_text && page.ocrData) {
            const ocrScale = toDrawWidth / page.ocrData.imageWidth;
            canvas.scale(ocrScale, ocrScale, 0, 0);
            const drawOverlay = this.options.draw_ocr_overlay && !forExport;
            textPaint.color = drawOverlay ? 'white' : !PRODUCTION && DEV_LOG ? '#ff000088' : '#ffffff01';
            page.ocrData.blocks.forEach((block) => {
                canvas.save();
                // TODO: understand why that kind of scale is necessary
                textPaint.textSize = (block.fontSize || 16) * Screen.mainScreen.scale * (forExport ? 1.4 : 1.8);
                const staticLayout = new StaticLayout(block.text, textPaint, block.box.width, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
                if (drawOverlay) {
                    canvas.drawRect(block.box.x, block.box.y, block.box.x + block.box.width, block.box.y + block.box.height, textOverlayPaint);
                }
                canvas.translate(block.box.x, block.box.y);
                staticLayout.draw(canvas);
                canvas.restore();
            });
        }
    }
    drawPages(pdfPageIndex: number, pages: OCRPage[], isLoading = false, forExport = false) {
        const { pagerPagePaddingHorizontal, pagerPagePaddingVertical, paper_size, dpi, page_padding, orientation, items_per_page } = this.options;
        const pagePadding = ptToPixel(page_padding, dpi);
        const canvas = this.canvas;
        const w = canvas.getWidth() - 2 * (forExport ? 1 : pagerPagePaddingHorizontal);
        const h = canvas.getHeight() - 2 * (forExport ? 1 : pagerPagePaddingVertical);
        // DEV_LOG && console.log('drawPages', pages.length, this.options, canvas.getWidth(), canvas.getHeight(), w, h);

        let dx = forExport ? 0 : pagerPagePaddingHorizontal;
        let dy = forExport ? 0 : pagerPagePaddingVertical;
        const nbItems = pages.length;
        const srcs = pages.map((page) => page.imagePath);
        // console.log('drawPDFPage', w, h, nbItems, srcs);
        isLoading = isLoading || srcs.some((src) => !this.imagesCache[src]);
        canvas.translate(dx, dy);
        const canvasRatio = w / h;
        if (paper_size === 'full') {
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

            // const src = page.imagePath;
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

            const pageDx = w / 2 - toDrawWidth / 2;
            const pageDy = h / 2 - toDrawHeight / 2;
            canvas.translate(pageDx, pageDy);
            if (!forExport) {
                canvas.drawRect(0, 0, toDrawWidth, toDrawHeight, bgPaint);
            }

            if (isLoading) {
                return;
            }
            // if (page.rotation !== 0) {
            //     const ddx = Math.min(toDrawWidth, toDrawHeight) / 2;
            //     canvas.rotate(page.rotation, ddx, ddx);
            // }
            // const imageScale = toDrawWidth / imageWidth;
            // canvas.scale(imageScale, imageScale, 0, 0);
            // if (page.colorType || page.colorMatrix) {
            //     if (!bitmapPaint) {
            //         bitmapPaint = new Paint();
            //     }
            //     bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
            // } else if (bitmapPaint) {
            //     bitmapPaint.setColorFilter(null);
            // }
            // canvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
            this.drawImageOnCanvas(canvas, page, toDrawWidth, toDrawHeight, forExport);
        } else {
            let pageRatio = 1;
            switch (paper_size) {
                case 'a4':
                default:
                    pageRatio = 595 / 842;
                    break;
            }
            if (orientation === 'landscape') {
                pageRatio = 1 / pageRatio;
            }
            let availableWidth;
            let availableHeight;
            // console.log('pageRatio', pageRatio, canvasRatio);
            if (pageRatio > canvasRatio) {
                availableWidth = w;
                availableHeight = w / pageRatio;
                dy += (h - availableHeight) / 2;
            } else {
                availableWidth = h * pageRatio;
                availableHeight = h;
                dx += (w - availableWidth) / 2;
            }

            const pageDx = w / 2 - availableWidth / 2;
            const pageDy = h / 2 - availableHeight / 2;
            canvas.translate(pageDx, pageDy);
            if (!forExport) {
                canvas.drawRect(0, 0, availableWidth, availableHeight, bgPaint);
            }
            if (isLoading) {
                // canvas.drawText(lc('loading_images'), 0, 100, textPaint);
                return;
            }
            // compute space diivision
            let columns = nbItems > 2 ? 2 : 1;
            let rows = nbItems > 2 ? Math.ceil(nbItems / 2) : nbItems;
            // console.log('columns', columns, rows);
            if (orientation === 'landscape') {
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
            // console.log('rows', rows, columns, shared, widthPerColumn, widthPerRow);
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
                    // const src = page.imagePath;

                    let itemAvailableWidth = widthPerColumn - 2 * pagePadding;
                    const itemAvailableHeight = widthPerRow - 2 * pagePadding;
                    if (last && columns * rows > nbItems) {
                        itemAvailableWidth = 2 * widthPerColumn - 2 * pagePadding;
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
                    // if (page.rotation !== 0) {
                    //     const ddx = Math.min(toDrawWidth, toDrawHeight) / 2;
                    //     canvas.rotate(page.rotation, ddx, ddx);
                    // }
                    // const imageScale = toDrawWidth / imageWidth;
                    // canvas.scale(imageScale, imageScale, 0, 0);
                    // if (page.colorType || page.colorMatrix) {
                    //     if (!bitmapPaint) {
                    //         bitmapPaint = new Paint();
                    //     }
                    //     bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
                    // } else if (bitmapPaint) {
                    //     bitmapPaint.setColorFilter(null);
                    // }
                    // canvas.drawBitmap(this.imagesCache[src], 0, 0, bitmapPaint);
                    this.drawImageOnCanvas(canvas, page, toDrawWidth, toDrawHeight, forExport);
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
