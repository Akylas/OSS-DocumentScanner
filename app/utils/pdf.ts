import { Color, File, Folder, ImageAsset, ImageSource, knownFolders, path } from '@nativescript/core';
// global['btoa'] = encode;
// global['atob'] = decode;
global['u8'] = {};
global['window'] = {
    saveAs: () => {},
    document: {
        createElementNS: () => ({} as any),
    },
} as any;
global['document'] = {
    createElement: (str) => ({} as any),
} as any;
global['navigator'] = {} as any;
global['saveAs'] = () => {};
// import { decode, encode } from 'base-64';
import { ImageOptions, jsPDFOptions, jsPDF as jsPDFType } from 'jspdf';

const jsPDF: typeof jsPDFType = require('jspdf').jsPDF;

export interface PDFType {
    written: boolean;
    message: string;
}

export interface PageSettings {
    images?: { image?: ImageSource; path?: string; options: Omit<ImageOptions, 'imageData'> }[];
    texts?: { fontColor?: Color; fontSize?; data; x; y }[];
}
/*
 * Create a PDF file with the given settings, text, and images
 * @param fileSettings Settings for writing pdf to file.
 * @param textArray Array of text, position, fonts for placement in PDF
 * @param images Array of images and their placement in the PDF
 * @returns Promise<PDFType> Indicating if the file was written or failed with a message.
 */
export async function createPDF(fileSettings: jsPDFOptions, pages: PageSettings[]): Promise<jsPDFType> {
    const doc = new jsPDF(fileSettings);
    let page: PageSettings;
    for (let index = 0; index < pages.length; index++) {
        page = pages[index];
        if (index > 0) {
            doc.addPage();
        }
        if (page.texts) {
            for (const x of page.texts) {
                if (x.fontColor !== undefined && x.fontColor !== null) {
                    doc.setTextColor(x.fontColor.hex);
                } else {
                    doc.setTextColor(0, 0, 0);
                }
                if (x.fontSize) {
                    doc.setFontSize(x.fontSize);
                }

                doc.text(x.data, x.x, x.y);
            }
        }

        if (page.images) {
            for (const img of page.images) {
                let imgSource = img.image;
                if (!imgSource && img.path) {
                    const fle = knownFolders.currentApp().getFile(img.path);
                    const imageAsset = new ImageAsset(fle.path);

                    imgSource = await ImageSource.fromAsset(imageAsset);
                }
                if (imgSource) {
                    let imgString = imgSource.toBase64String('jpg');
                    const width = doc.internal.pageSize.getWidth();
                    const left = 15, top = 40;
                    const maxWidth = width - left * 2;
                    const newWidth = imgSource.width < maxWidth ? imgSource.width : maxWidth;
                    const newHeight = (imgSource.height * newWidth) / imgSource.width;
                    // const stream = new java.io.ByteArrayOutputStream();
                    // const bmp = imgSource.android as android.graphics.Bitmap;
                    // const iBytes = bmp.getWidth() * bmp.getHeight() * 4;
                    // const buffer = java.nio.ByteBuffer.allocate(iBytes);
                    // bmp.copyPixelsToBuffer(buffer);
                    // bmp.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);
                    // const aBuffer = ArrayBuffer.from(buffer);
                    // const inputAs8 = new Uint8Array(aBuffer);
                    imgString = 'data:image/jpeg;base64,' + imgSource.toBase64String('jpeg');
                    const opts = { ...img.options };
                    console.log('opts', left, top, newWidth, newHeight, opts, imgString);
                    // console.log('imgString', imgString);
                    doc.addImage(imgString, 'JPEG', left, top, newWidth, newHeight, undefined, 'FAST' as any, 0);
                }
            }
        }
    }
    // output the entire pdf file to data uri string
    doc.save();
    return doc;
}
