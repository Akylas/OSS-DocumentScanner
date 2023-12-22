import { Canvas } from '@nativescript-community/ui-canvas';
import { Screen, Utils, knownFolders, path } from '@nativescript/core';
import { IMG_COMPRESS, OCRDocument } from '~/models/OCRDocument';
import { recycleImages } from '~/utils/utils.common';
import PDFExportCanvasBase from './PDFExportCanvas.common';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export(documents: OCRDocument[], folder = knownFolders.temp().path, filename = Date.now() + '') {
        const start = Date.now();
        const options = this.options;
        if (options.paper_size === 'full') {
            // we enforce 1 item per page
            options.items_per_page = 1;
        }
        this.updatePages(documents);
        // if (options.paper_size === 'full') {
        //     // in full we use pdfbox for now as
        //     // pdf are compressed
        //     const pdfDocument = new com.tom_roush.pdfbox.pdmodel.PDDocument();
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
        //         // const pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(width * page.scale, height * page.scale, index + 1).create();
        //         const pdfpage = new com.tom_roush.pdfbox.pdmodel.PDPage(new com.tom_roush.pdfbox.pdmodel.common.PDRectangle(0, 0, width, height));
        //         const contentStream = new com.tom_roush.pdfbox.pdmodel.PDPageContentStream(pdfDocument, pdfpage);
        //         // const pdfpage = pdfDocument.startPage(pageInfo);
        //         const actualBitmap = await this.getTransformedBitmap(page);

        //         const ximage = com.tom_roush.pdfbox.pdmodel.graphics.image.JPEGFactory.createFromImage(pdfDocument, actualBitmap, 0.75, 72);
        //         // You may want to call PDPage.getCropBox() in order to place your image
        //         // somewhere inside this page rect with (x, y) and (width, height).
        //         contentStream.drawImage(ximage, 0, 0);
        //         contentStream.close();
        //         pdfDocument.addPage(pdfpage);
        //         recycleImages(actualBitmap);
        //     }

        //     const pdfFile = knownFolders.temp().getFile(filename);
        //     const newFile = new java.io.File(pdfFile.path);
        //     pdfDocument.save(newFile);
        //     DEV_LOG && console.log('pdfFile', folder, filename, pdfFile.size, pdfFile.path, File.exists(path.join(folder, filename)), Date.now() - start, 'ms');
        //     pdfDocument.close();
        //     recycleImages(Object.values(this.imagesCache));
        //     if (folder !== pdfFile.parent.path) {
        //         const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(folder));
        //         const outfile = outdocument.createFile('application/pdf', filename);
        //         DEV_LOG && console.log('outfile', outfile.getUri().toString());
        //         await new Promise((resolve, reject) => {
        //             org.nativescript.widgets.Async.File.copy(
        //                 pdfFile.path,
        //                 outfile.getUri().toString(),
        //                 new org.nativescript.widgets.Async.CompleteCallback({
        //                     onComplete: resolve,
        //                     onError: (err) => reject(new Error(err))
        //                 }),
        //                 Utils.android.getApplicationContext()
        //             );
        //         });
        //         return outfile.getUri().toString();
        //     }

        //     return pdfFile.path;
        // } else {
        this.canvas = new Canvas();
        const pdfDocument = new android.graphics.pdf.PdfDocument();
        const items = this.items;
        for (let index = 0; index < items.length; index++) {
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

                default:
                    break;
            }
            if (options.orientation === 'landscape') {
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
            this.drawPages(index, items[index].pages, true);
            pdfDocument.finishPage(page);
        }
        recycleImages(Object.values(this.imagesCache));

        // we need to compress the pdf
        const tempFile = knownFolders.temp().getFile(filename);
        const stream = new java.io.FileOutputStream(tempFile.path);
        pdfDocument.writeTo(stream);
        pdfDocument.close();
        if (folder.startsWith('content://')) {
            const tempFile2 = knownFolders.temp().getFile('compressed.pdf');
            com.akylas.documentscanner.PDFUtils.compressPDF(tempFile.path, tempFile2.path, IMG_COMPRESS);
            const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(folder));
            const outfile = outdocument.createFile('application/pdf', filename);
            await tempFile2.copy(outfile.getUri().toString());
            return outdocument.getUri().toString();
        } else {
            const outputPath = path.join(folder, filename);
            com.akylas.documentscanner.PDFUtils.compressPDF(tempFile.path, outputPath, IMG_COMPRESS);
            return outputPath;
        }
        // }
    }
}
