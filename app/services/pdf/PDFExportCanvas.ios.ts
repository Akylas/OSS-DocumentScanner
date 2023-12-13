import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import PDFCanvas from './PDFCanvas';
import { Canvas, ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import { loadImage, recycleImages } from '~/utils/utils.common';
import { getColorMatrix } from '~/utils/ui';
import { File, Folder, Screen, Utils, knownFolders, path } from '@nativescript/core';

export default class PDFExportCanvas extends PDFCanvas {
    async getTransformedBitmap(page: OCRPage) {
        const width = page.width * page.scale;
        const height = page.height * page.scale;
        const pageCanvas = new Canvas(width, height);
        const imageSource = await loadImage(page.getImagePath());
        let bitmapPaint: Paint = null;
        if (page.colorType || page.colorMatrix) {
            if (!bitmapPaint) {
                bitmapPaint = new Paint();
            }
            bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
        }
        pageCanvas.translate(width / 2, height / 2);
        pageCanvas.rotate(page.rotation, 0, 0);
        pageCanvas.scale(page.scale, page.scale, 0, 0);
        pageCanvas.drawBitmap(imageSource.ios, -page.width / 2, -page.height / 2, bitmapPaint?.['getNative']());
        recycleImages(imageSource);
        return pageCanvas.getImage();
    }
    async export(documents: OCRDocument[], folder = knownFolders.temp().path, filename = Date.now() + '') {
        const start = Date.now();
        const options = this.options;
        if (options.pdfFormat === 'full') {
            // we enforce 1 item per page
            options.itemsPerPage = 1;
        }
        this.updatePages(documents);
        const pdfData = NSMutableData.alloc().init();
        const canvas = new Canvas(0, 0);
        UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, null);
        if (options.pdfFormat === 'full') {
            // in full we use pdfbox for now as
            // pdf are compressed
            let page: OCRPage;
            const items = this.items;
            for (let index = 0; index < items.length; index++) {
                page = items[index].pages[0];
                let width = page.width;
                let height = page.height;
                if (page.rotation % 180 !== 0) {
                    width = page.height;
                    height = page.width;
                }
                width *= page.scale;
                height *= page.scale;
                const pageRect = CGRectMake(0, 0, width, height);
                UIGraphicsBeginPDFPageWithInfo(pageRect, null);
                const context = UIGraphicsGetCurrentContext();
                canvas['setContext'](context, width, height);
                const actualBitmap = await this.getTransformedBitmap(page);

                canvas.drawBitmap(actualBitmap, 0, 0, null);
                recycleImages(actualBitmap);
            }
            UIGraphicsEndPDFContext();

            if (!filename.endsWith('.pdf')) {
                filename += '.pdf';
            }
            const pdfFile = Folder.fromPath(folder).getFile(filename);
            await pdfFile.write(pdfData);

            return pdfFile.path;
        } else {
            //@ts-ignore
            this.canvas = new Canvas();
            const pdfData = NSMutableData.alloc().init();
            const canvas = new Canvas(0, 0);
            UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, null);
            const items = this.items;
            for (let index = 0; index < items.length; index++) {
                let pageWidth, pageHeight;
                switch (options.pdfFormat) {
                    case 'a5':
                        pageWidth = 420;
                        pageHeight = 595;
                        break;
                    case 'a4':
                        pageWidth = 595;
                        pageHeight = 842;
                        break;
                    case 'a3':
                        pageWidth = 842;
                        pageHeight = 1191;
                        break;

                    default:
                        break;
                }
                if (options.pdfOrientation === 'landscape') {
                    const temp = pageWidth;
                    pageWidth = pageHeight;
                    pageHeight = temp;
                }
                const pageRect = CGRectMake(0, 0, pageWidth, pageHeight);
                UIGraphicsBeginPDFPageWithInfo(pageRect, null);
                const context = UIGraphicsGetCurrentContext();
                canvas['setContext'](context, pageWidth, pageHeight);
                const scale = Screen.mainScreen.scale;
                this.canvas.scale(scale, scale);
                await this.loadImagesForPage(index);
                this.drawPages(items[index].pages, true);
            }
            UIGraphicsEndPDFContext();

            if (!filename.endsWith('.pdf')) {
                filename += '.pdf';
            }
            const pdfFile = Folder.fromPath(folder).getFile(filename);
            await pdfFile.write(pdfData);

            return pdfFile.path;
        }
    }
}
