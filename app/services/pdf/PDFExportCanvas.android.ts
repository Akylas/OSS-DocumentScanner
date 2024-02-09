import { Canvas } from '@nativescript-community/ui-canvas/canvas';
import { Screen, Utils, knownFolders, path } from '@nativescript/core';
import type { OCRPage } from '~/models/OCRDocument';
import { IMG_COMPRESS } from '~/models/constants';
import { recycleImages } from '~/utils/images';
import PDFExportCanvasBase from './PDFExportCanvas.common';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export(pages: OCRPage[], folder = knownFolders.temp().path, filename = Date.now() + '.pdf') {
        const start = Date.now();
        const options = this.options;
        if (options.paper_size === 'full') {
            // we enforce 1 item per page
            options.items_per_page = 1;
        }
        this.updatePages(pages);
        this.canvas = new Canvas();
        const pdfDocument = new android.graphics.pdf.PdfDocument();
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
            const pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(pageWidth, pageHeight, index).create();
            const page = pdfDocument.startPage(pageInfo);
            this.canvas.setNative(page.getCanvas());
            const scale = Screen.mainScreen.scale;
            this.canvas.scale(scale, scale);
            await this.loadImagesForPage(index);
            this.drawPages(index, items[index].pages, false, true);
            pdfDocument.finishPage(page);
        }
        recycleImages(Object.values(this.imagesCache));

        // we need to compress the pdf
        const tempFile = knownFolders.temp().getFile(filename);
        const stream = new java.io.FileOutputStream(tempFile.path);
        pdfDocument.writeTo(stream);
        pdfDocument.close();
        DEV_LOG && console.log('tempFile', tempFile.path, tempFile.size);
        if (folder.startsWith('content://')) {
            const tempFile2 = knownFolders.temp().getFile('compressed.pdf');
            DEV_LOG && console.log('compressPDF', tempFile.path, tempFile2.path);
            com.akylas.documentscanner.PDFUtils.compressPDF(tempFile.path, tempFile2.path, IMG_COMPRESS);
            const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(folder));
            const outfile = outdocument.createFile('application/pdf', filename);
            await tempFile2.copy(outfile.getUri().toString());
            return outdocument.getUri().toString();
        } else {
            let outputPath;
            if (knownFolders.temp().path === folder) {
                outputPath = path.join(folder, Date.now() + '_1.pdf');
            } else {
                outputPath = path.join(folder, filename);
            }
            try {
                DEV_LOG && console.log('compressPDF', tempFile.path, outputPath);
                com.akylas.documentscanner.PDFUtils.compressPDF(tempFile.path, outputPath, IMG_COMPRESS);
            } catch (error) {
                tempFile.copySync(outputPath);
                console.error('compressPDF error', error, error.stack);
                throw error;
            }
            return outputPath;
        }
        // }
    }
}
