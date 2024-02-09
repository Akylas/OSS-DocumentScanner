import { Canvas } from '@nativescript-community/ui-canvas/canvas';
import { Folder, knownFolders } from '@nativescript/core';
import type { OCRPage } from '~/models/OCRDocument';
import PDFExportCanvasBase from './PDFExportCanvas.common';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export(pages: OCRPage[], folder = knownFolders.temp().path, filename = Date.now() + '') {
        const start = Date.now();
        const options = this.options;
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

        //     if (!filename.endsWith('.pdf')) {
        //         filename += '.pdf';
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
            // const scale = __IOS_Screen.mainScreen.scale;
            // this.canvas.scale(scale, scale);
            await this.loadImagesForPage(index);
            this.drawPages(index, items[index].pages, false, true);
        }
        UIGraphicsEndPDFContext();

        if (!filename.endsWith('.pdf')) {
            filename += '.pdf';
        }
        const pdfFile = Folder.fromPath(folder).getFile(filename);
        await pdfFile.write(pdfData);

        return pdfFile.path;
        // }
    }
}
