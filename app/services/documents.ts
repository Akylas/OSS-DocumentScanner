import { Folder, ObservableArray, knownFolders, path } from '@nativescript/core';
import { Observable } from '@nativescript/core/data/observable';
// import { createPDF } from '~/utils/pdf';
import { jsPDF as jsPDFType } from 'jspdf';
import { installMixins } from '@akylas/nativescript-sqlite/typeorm';
import { Imgcodecs, Mat } from 'nativescript-opencv';
import { Connection, createConnection } from '@akylas/typeorm/browser';
// import OCRDocument, { ImageConfig } from '~/models/Document';
import OCRDocument from '~/models/OCRDocument';
import OCRImage from '~/models/OCRImage';
import OCRPage from '~/models/OCRPage';
import { DEV_LOG, clog } from '~/utils/logging';
import OCRRawImage from '~/models/OCRRawImage';
global['window'] = {
    saveAs: () => {},
    document: {
        createElementNS: () => ({} as any),
    },
} as any;
const jsPDF: typeof jsPDFType = require('jspdf').jsPDF;

export class DocumentsService extends Observable {
    log(...args) {
        clog('[' + this.constructor.name + ']', ...args);
    }
    dataFolder: Folder;
    connection: Connection;
    async start() {
        this.dataFolder = knownFolders.documents().getFolder('data');
        const filePath = path.join(knownFolders.documents().path, 'db.sqlite');
        // this.log('DBHandler', 'start', filePath);
        installMixins();
        // return Promise.resolve().then(() => {

        this.connection = await createConnection({
            database: filePath,
            type: 'nativescript' as any,
            entities: [OCRDocument, OCRPage, OCRImage, OCRRawImage],
            logging: DEV_LOG,
        });
        await this.connection.synchronize(DEV_LOG);

    }
    stop() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
        // return Promise.resolve().then(() => this.connection.close());
    }

    saveImages(folder: Folder, images: ObservableArray<Mat>, prefix: string = '') {
        for (let index = 0; index < images.length; index++) {
            const mat = images.getItem(index);
            this.saveImage(folder, mat, index, prefix);
        }
    }
    saveImage(folder: Folder, mat: Mat, index: number, prefix: string = '') {
        // console.log('imwrite', path.join(folder.path, `${prefix}_${index}.jpg`), mat);
        Imgcodecs.imwrite(path.join(folder.path, `${prefix ? prefix + '_' : ''}${index}.jpg`), mat);
    }

    async saveDocument(doc: OCRDocument) {
        doc.save();
    }
    // async getDocuments() {
    //     const result: OCRDocument[] = [];
    //     const folders = await this.dataFolder.getEntities();
    //     console.log('getDocuments', folders);
    //     for (const f of folders) {
    //         const docFolder = this.dataFolder.getFolder(f.name);
    //         const folderEntities = await docFolder.getEntities();
    //         console.log('folderEntities', docFolder, folderEntities);
    //         const doc = new OCRDocument();
    //         const jsonData = JSON.parse(await docFolder.getFile('config.json').readText());
    //         console.log('jsonData', JSON.stringify(jsonData));
    //         doc.id = jsonData.id;
    //         doc.name = jsonData.name;
    //         doc.pages = new ObservableArray(
    //             jsonData.imagesConfig.map((c, index) => {
    //                 const mat = Imgcodecs.imread(docFolder.getFile(`${index}.jpg`).path);
    //                 return {
    //                     config: c,
    //                     mat,
    //                     image: new ImageSource(imageFromMat(mat)),
    //                 };
    //             })
    //         );

    //         if (doc.id) {
    //             result.push(doc);
    //         }
    //     }
    //     return result;
    // }

    async exportPDF(document: OCRDocument) {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        const start = Date.now();
        console.log('exportPDF', document);
        const pages =  document.pages;
        let page: OCRPage;
        // let page: { image: ImageSource; config: ImageConfig };
        let image: OCRImage;
        for (let index = 0; index < pages.length; index++) {
            page = pages[index];
            image =  await page.image;
            // if (!image || (global.isAndroid && !image.android) || (global.isIOS && !image.ios)) {
            //     continue;
            // }
            // const options = page.config || {
            //     rotation: 0,
            // };

            if (index > 0) {
                pdf.addPage();
            }
            const width = pdf.internal.pageSize.getWidth();
            const left = 15,
                top = 40;
            const maxWidth = width - left * 2;
            const newWidth = image.width < maxWidth ? image.width : maxWidth;
            const newHeight = (image.height * newWidth) / image.width;
            // if (global.isAndroid) {
            //     const bmp = image.android as android.graphics.Bitmap;
            //     const stream = new java.io.ByteArrayOutputStream();
            //     bmp.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);
            //     const inputAs8 = Uint8Array.from(stream.toByteArray());
            //     pdf.addImage(inputAs8, 'JPEG', left, top, newWidth, newHeight, null, 'NONE' as any, options.rotation);
            // } else {
            const data = new Uint8Array(image.data);
            pdf.addImage(data, 'JPEG', left, top, newWidth, newHeight, null, 'NONE' as any, page.rotation);
            // }
        }
        const pdfFile = this.dataFolder.getFile(document.id + '.pdf');
        const fileData = pdf.output('arraybuffer');
        console.log('fileData', fileData.byteLength, Date.now() - start, 'ms');
        // init the file and path to it
        // Cut out the data piece .. remove 'data:...;base64,'
        if (global.isIOS) {
            // decode the base64 piece
            // const data = android.util.Base64.decode(tempData, android.util.Base64.DEFAULT);
            // const data = NSData.alloc().initWithBase64EncodedStringOptions(tempData, 1);
            // write to the file
            // write to the file
            const data = NSData.dataWithData(fileData as any);
            await pdfFile.write(data);
        } else {
            // write to the file
            const u8 = new Uint8Array(fileData);
            const length = u8.length;
            const result = Array.create('byte', length);
            for (let i = 0; i < length; i++) {
                result[i] = u8[i];
            }
            await pdfFile.write(result);
        }
        console.log('pdfFile', Date.now() - start, 'ms');
        return pdfFile;
    }
}

export const documentsService = new DocumentsService();
