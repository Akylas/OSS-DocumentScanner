import { Canvas } from '@nativescript-community/ui-canvas/canvas';
import { Folder, Screen, knownFolders } from '@nativescript/core';
import PDFExportCanvasBase from './PDFExportCanvas.common';
import { PDFExportOptions } from './PDFCanvas';
import { PDF_EXT } from '~/utils/constants';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export({ filename = Date.now() + PDF_EXT, folder = knownFolders.temp().path, options = this.options, pages }: PDFExportOptions) {
        const start = Date.now();
        if (options.paper_size === 'full') {
            // we enforce 1 item per page
            options.items_per_page = 1;
        }
        this.updatePages(pages.map((p) => p.page));
        const pdfData = NSMutableData.alloc().init();
        this.canvas = new Canvas();
        let documentInfo = null;
        if (options.password) {
            documentInfo = {};
            documentInfo[kCGPDFContextUserPassword] = options.password;
        }
        UIGraphicsBeginPDFContextToData(pdfData, CGRectZero, documentInfo);

        const items = this.items;
        let hasPages = false;
        for (let index = 0; index < items.length; index++) {
            const pages = items[index].pages;
            if (!pages[0]) {
                continue;
            }
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
            hasPages = (await this.drawPages(index, items[index].pages)) || hasPages;
        }
        UIGraphicsEndPDFContext();
        if (!hasPages) {
            return;
        }

        if (!filename.endsWith(PDF_EXT)) {
            filename += PDF_EXT;
        }
        const pdfFile = Folder.fromPath(folder).getFile(filename);
        await pdfFile.write(pdfData);
        DEV_LOG && console.log('export PDF done', filename, Date.now() - start, 'ms');
        return pdfFile.path;
    }
}
