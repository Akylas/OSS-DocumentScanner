import { Canvas } from '@nativescript-community/ui-canvas/canvas';
import { Folder, Screen, knownFolders } from '@nativescript/core';
import PDFExportCanvasBase from './PDFExportCanvas.common';
import { PDFExportOptions } from './PDFCanvas';
import { PDF_EXT } from '~/utils/constants';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export({ pages, folder = knownFolders.temp().path, filename = Date.now() + PDF_EXT, options = this.options }: PDFExportOptions) {
        const start = Date.now();
        // const options = this.options;
        if (options.paper_size === 'full') {
            // we enforce 1 item per page
            options.items_per_page = 1;
        }
        this.updatePages(pages);
        const pdfData = NSMutableData.alloc().init();
        // const canvas = new Canvas(0, 0);
        // UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, null);
        // if (options.paper_size === 'full') {
        //     // in full we use pdfbox for now as
        //     // pdf are compressed
        //     let page: OCRPage;
        //     const items = this.items;
        //     for (let index = 0; index < items.length; index++) {
        //         page = items[index].pages[0];
        //         let width = page.width;
        //         let height = page.height;
        //         if (page.rotation % 180 !== 0) {
        //             width = page.height;
        //             height = page.width;
        //         }
        //         width *= page.scale;
        //         height *= page.scale;
        //         const pageRect = CGRectMake(0, 0, width, height);
        //         UIGraphicsBeginPDFPageWithInfo(pageRect, null);
        //         const context = UIGraphicsGetCurrentContext();
        //         canvas['setContext'](context, width, height);
        //         const actualBitmap = await getTransformedBitmap(page);

        //         canvas.drawBitmap(actualBitmap, 0, 0, null);
        //         recycleImages(actualBitmap);
        //     }
        //     UIGraphicsEndPDFContext();

        //     if (!filename.endsWith(PDF_EXT)) {
        //         filename += PDF_EXT;
        //     }
        //     const pdfFile = Folder.fromPath(folder).getFile(filename);
        //     await pdfFile.write(pdfData);

        //     return pdfFile.path;
        // } else {
        this.canvas = new Canvas();
        // const pdfData = NSMutableData.alloc().init();
        // const canvas = new Canvas(0, 0);
        UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, null);

        const items = this.items;
        for (let index = 0; index < items.length; index++) {
            const pages = items[index].pages;
            let pageWidth, pageHeight;
            switch (options.paper_size) {
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
                case 'full':
                    pageWidth = pages[0].width;
                    pageHeight = pages[0].height;
                    if (options.imageSizeThreshold) {
                        const minSize = Math.max(pageWidth, pageHeight);
                        if (minSize > options.imageSizeThreshold) {
                            const resizeScale = (1.0 * minSize) / options.imageSizeThreshold;
                            pageWidth = pageWidth / resizeScale;
                            pageHeight = pageHeight / resizeScale;
                        }
                    }
                    break;

                default:
                    break;
            }
            if (options.paper_size !== 'full' && options.orientation === 'landscape') {
                const temp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = temp;
            }
            const pageRect = CGRectMake(0, 0, pageWidth, pageHeight);
            UIGraphicsBeginPDFPageWithInfo(pageRect, null);
            const context = UIGraphicsGetCurrentContext();
            this.canvas.setContext(context, pageWidth, pageHeight);
            await this.drawPages(index, items[index].pages);
        }
        UIGraphicsEndPDFContext();

        if (!filename.endsWith(PDF_EXT)) {
            filename += PDF_EXT;
        }
        const pdfFile = Folder.fromPath(folder).getFile(filename);
        await pdfFile.write(pdfData);
        DEV_LOG && console.log('export PDF done', filename, Date.now() - start, 'ms');
        return pdfFile.path;
        // }
    }
}
