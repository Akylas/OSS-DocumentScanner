import { File, Folder, ImageSource, ObservableArray, knownFolders, path } from '@nativescript/core';
import { Observable } from '@nativescript/core/data/observable';
// import { createPDF } from '~/utils/pdf';
import { installMixins } from '@nativescript-community/sqlite/typeorm';
import { Imgcodecs, Mat } from 'nativescript-opencv';
import { Connection, createConnection } from '@nativescript-community/typeorm/browser';
import { OCRDocument, OCRImage, OCRPage, OCRRawImage } from '~/models/OCRDocument';
import { ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
// import OCRDocument, { ImageConfig } from '~/models/Document';

export class DocumentsService extends Observable {
    dataFolder: Folder;
    connection: Connection;
    started = false;
    async start() {
        if (this.started) {
            return;
        }
        if (DEV_LOG) {
            console.log('DocumentsService start');
        }
        this.dataFolder = knownFolders.documents().getFolder('data');
        const filePath = path.join(knownFolders.documents().path, 'db.sqlite');
        // this.log('DBHandler', 'start', filePath);
        installMixins();
        // return Promise.resolve().then(() => {

        this.connection = await createConnection({
            database: filePath,
            type: '@nativescript-community/sqlite' as any,
            entities: [OCRPage, OCRImage, OCRRawImage, OCRDocument],
            logging: DEV_LOG,
            extra: {
                threading: false,
                transformBlobs: false
            }
        });
        if (DEV_LOG) {
            console.log('Connection Created');
        }

        await this.connection.synchronize(false);
        this.notify({ eventName: 'started' });
        this.started = true;
    }
    stop() {
        if (DEV_LOG) {
            console.log('DocumentsService stop');
        }
        if (!this.started) {
            return;
        }
        this.started = false;
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
        const start = Date.now();
        if (__ANDROID__) {
            const pdfDocument = new android.graphics.pdf.PdfDocument();
            const pages = document.pages;
            let page: OCRPage;
            let imagePath: string;
            const bitmapPaint: Paint = null;
            for (let index = 0; index < pages.length; index++) {
                page = pages[index];
                imagePath = await page.getImagePath();
                let width = page.width;
                let height = page.height;
                if (page.rotation % 180 === 90) {
                    width = page.height;
                    height = page.width;
                }
                const pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(width, height, index + 1).create();
                const pdfpage = pdfDocument.startPage(pageInfo);
                const pageCanvas = pdfpage.getCanvas();
                const imageSource = ImageSource.fromFileSync(imagePath);
                let bitmapPaint: Paint = null;
                if (page.colorType !== 0) {
                    if (!bitmapPaint) {
                        bitmapPaint = new Paint();
                    }
                    bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix));
                }
                pageCanvas.translate(width / 2, height / 2);
                pageCanvas.rotate(page.rotation, 0, 0);
                pageCanvas.drawBitmap(imageSource.android, -page.width / 2, -page.height / 2, bitmapPaint?.['getNative']());
                imageSource.android.recycle();
                pdfDocument.finishPage(pdfpage);
            }
            const pdfFile = knownFolders.temp().getFile(Date.now() + '.pdf');
            const newFile = new java.io.File(pdfFile.path);
            const fos = new java.io.FileOutputStream(newFile);
            pdfDocument.writeTo(fos);
            pdfDocument.close();
            console.log('pdfFile', Date.now() - start, 'ms');
            return pdfFile;
        }
    }
}

export const documentsService = new DocumentsService();
