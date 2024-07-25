import { Canvas } from '@nativescript-community/ui-canvas/canvas';
import { Screen, Utils, knownFolders, path } from '@nativescript/core';
import { IMG_COMPRESS, PDF_EXT } from '~/utils/constants';
import { recycleImages } from '~/utils/images';
import PDFExportCanvasBase from './PDFExportCanvas.common';
import { PDFExportOptions } from './PDFCanvas';
import { getColorMatrix } from '~/utils/matrix';

export default class PDFExportCanvas extends PDFExportCanvasBase {
    async export({ pages, folder = knownFolders.temp().path, filename = Date.now() + PDF_EXT, compress = false }: PDFExportOptions) {
        const start = Date.now();
        pages.forEach((page) => {
            if (page.colorType && !page.colorMatrix) {
                page.colorMatrix = getColorMatrix(page.colorType);
            }
        });
        const options = JSON.stringify({ ...this.options, text_scale: Screen.mainScreen.scale * 1.4, pages });
        DEV_LOG && console.log('PDFExportCanvas', 'export', folder, filename, compress, options);
        const outputPath = com.akylas.documentscanner.utils.PDFUtils.Companion.generatePDF(Utils.android.getApplicationContext(), folder, filename, options);
        DEV_LOG && console.log('PDFExportCanvas', 'export done', JSON.stringify(this.options), options.length, Date.now() - start, 'ms');
        return outputPath;

        // const options = this.options;
        // if (options.paper_size === 'full') {
        //     // we enforce 1 item per page
        //     options.items_per_page = 1;
        // }
        // this.updatePages(pages);
        // this.canvas = new Canvas();
        // const pdfDocument = new android.graphics.pdf.PdfDocument();
        // const items = this.items;
        // for (let index = 0; index < items.length; index++) {
        //     const pages = items[index].pages;
        //     let pageWidth, pageHeight;
        //     switch (options.paper_size) {
        //         case 'a5':
        //             pageWidth = 420;
        //             pageHeight = 595;
        //             break;
        //         case 'a4':
        //             pageWidth = 595;
        //             pageHeight = 842;
        //             break;
        //         case 'a3':
        //             pageWidth = 842;
        //             pageHeight = 1191;
        //             break;

        //         case 'full':
        //             pageWidth = pages[0].width;
        //             pageHeight = pages[0].height;
        //             break;

        //         default:
        //             break;
        //     }
        //     if (options.paper_size !== 'full' && options.orientation === 'landscape') {
        //         const temp = pageWidth;
        //         pageWidth = pageHeight;
        //         pageHeight = temp;
        //     }
        //     const pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(pageWidth, pageHeight, index).create();
        //     const page = pdfDocument.startPage(pageInfo);
        //     this.canvas.setNative(page.getCanvas());
        //     const scale = Screen.mainScreen.scale;
        //     this.canvas.scale(scale, scale);
        //     await this.loadImagesForPage(index);
        //     this.drawPages(index, items[index].pages, false, true);
        //     pdfDocument.finishPage(page);
        // }
        // DEV_LOG && console.log('PDFExportCanvas', 'export 1', Date.now() - start, 'ms');
        // recycleImages(Object.values(this.imagesCache));
        // DEV_LOG && console.log('PDFExportCanvas', 'export 2', Date.now() - start, 'ms');

        // if (!compress) {
        //     if (folder.startsWith('content://')) {
        //         const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(folder));
        //         const outfile = outdocument.createFile('application/pdf', filename);
        //         const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
        //         pdfDocument.writeTo(stream);
        //         pdfDocument.close();
        //         DEV_LOG && console.log('PDFExportCanvas', 'export 3', Date.now() - start, 'ms');
        //         return outdocument.getUri().toString();
        //     } else {
        //         const pdfFile = new java.io.File(path.join(folder, filename));
        //         const stream = new java.io.FileOutputStream(pdfFile);
        //         pdfDocument.writeTo(stream);
        //         pdfDocument.close();
        //         DEV_LOG && console.log('PDFExportCanvas', 'export 3', Date.now() - start, 'ms');
        //         return pdfFile.getPath();
        //     }
        // } else {
        //     // we need to compress the pdf
        //     const tempFile = knownFolders.temp().getFile(filename);

        //     const stream = new java.io.FileOutputStream(tempFile.path);
        //     pdfDocument.writeTo(stream);
        //     pdfDocument.close();
        //     DEV_LOG && console.log('PDFExportCanvas', 'export 3', Date.now() - start, 'ms');
        //     if (folder.startsWith('content://')) {
        //         const tempFile2 = knownFolders.temp().getFile('compressed.pdf');
        //         DEV_LOG && console.log('compressPDF', tempFile.path, tempFile2.path);
        //         com.akylas.documentscanner.utils.PDFUtils.Companion.compressPDF(tempFile.path, tempFile2.path, IMG_COMPRESS);
        //         const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(folder));
        //         let outfile = outdocument.createFile('application/pdf', filename);
        //         if (outfile == null) {
        //             outfile = outdocument.findFile(filename);
        //         }
        //         if (!outfile) {
        //             throw new Error(`error creating file "${filename}" in "${folder}"`);
        //         }
        //         await tempFile2.copy(outfile.getUri().toString());
        //         DEV_LOG && console.log('PDFExportCanvas', 'export 4', Date.now() - start, 'ms');
        //         return outdocument.getUri().toString();
        //     } else {
        //         let outputPath;
        //         if (knownFolders.temp().path === folder) {
        //             outputPath = path.join(folder, Date.now() + '_1.pdf');
        //         } else {
        //             outputPath = path.join(folder, filename);
        //         }
        //         try {
        //             DEV_LOG && console.log('compressPDF', tempFile.path, outputPath);
        //             com.akylas.documentscanner.utils.PDFUtils.Companion.compressPDF(tempFile.path, outputPath, IMG_COMPRESS);
        //             DEV_LOG && console.log('PDFExportCanvas', 'export 4', Date.now() - start, 'ms');
        //         } catch (error) {
        //             tempFile.copySync(outputPath);
        //             console.error('compressPDF error', error, error.stack);
        //             throw error;
        //         }
        //         return outputPath;
        //     }
        // }
    }
}
