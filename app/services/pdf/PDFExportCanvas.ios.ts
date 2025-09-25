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
                case 'letter':
                    pageWidth = 612;
                    pageHeight = 792;
                    break;
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
        const Nfolder = Folder.fromPath(folder);
        let nURL: NSURL;

        // on IOS we need to use startAccessingSecurityScopedResource if we write in non local app sandbox paths (like NSDocumentsDirectory, NSCachesDirectory)
        if (__IOS__) {
            nURL = NSURL.fileURLWithPathIsDirectory(Nfolder.path, true);
            nURL.startAccessingSecurityScopedResource();
        }
        const pdfFile = Nfolder.getFile(filename, false);
        await pdfFile.write(pdfData);

        nURL?.stopAccessingSecurityScopedResource();
        DEV_LOG && console.log('export PDF done', filename, nURL, Date.now() - start, 'ms');
        return pdfFile.path;
    }
}
