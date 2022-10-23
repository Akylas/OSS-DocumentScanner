import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@nativescript-community/typeorm/browser';
import { Imgproc, Mat, imageFromMat, matFromImage } from 'nativescript-opencv';
import { toBlackAndWhite } from '~/workers/contours';
import { EventData, File, ImageSource, Observable, ObservableArray, path } from '@nativescript/core';
// import { documentsService } from '~/services/documents';
import { EventEmitter, applyMixins } from '~/utils/decorators';
import { addWeakEventListener, removeWeakEventListener } from '@nativescript/core/ui/core/weak-event-listener';
import { documentsService } from '~/services/documents';
import * as BitmapFactory from 'nativescript-bitmap-factory';

export interface ImageConfig {
    colorType?: ColorType;
    colorMatrix?: number[];
    rotation?: number;
    crop?: number[];
}

// export const observableArrayTransformer = {
//     // lastValue: undefined as any[],
//     from(val: any[]) {
//         console.log('from', val);
//         return new ObservableArray(val);
//     },
//     to(w: ObservableArray<any>) {
//         console.log('to', w);
//         return w['_array'];
//     }
// };

const IMG_FORMAT = 'jpg';
// @EventEmitter
@Entity()
class OCRDocument extends BaseEntity {
    _observers: any;
    _observables: ObservableArray<OCRPage>;

    @PrimaryColumn()
    id: string;
    @CreateDateColumn()
    createdDate: Date;
    @Column({ nullable: true })
    name?: string;
    // @Column({ nullable: true, transformer:observableArrayTransformer })
    // @JoinTable()
    @OneToMany((type) => OCRPage, (page) => page.document, { cascade: ['insert', 'update'], eager: true })
    @JoinTable()
    pages: OCRPage[];

    constructor(id: string) {
        super();
        this._observers = {};
        this.id = id;
    }

    static async createDocument(name?: string, pagesData?: { mat; bitmap; transformedMat }[], setRaw = false) {
        const docId = Date.now() + '';
        const doc = new OCRDocument(docId);
        if (name) {
            doc.name = name;
        }
        await doc.addPages(pagesData);
        return doc;
    }

    async addPages(pagesData) {
        if (pagesData) {
            const docId = this.id;
            const docData = documentsService.dataFolder.getFolder(docId);
            const length = pagesData.length;
            const currentDocPagesLength = this.pages?.length || 0;
            const pages = [];
            for (let index = 0; index < length; index++) {
                const pageId = docId + '_' + (index + currentDocPagesLength);
                const page = new OCRPage(pageId);
                const { mat, ...pageData } = pagesData[index];
                const size = mat.size();
                Object.assign(page, { ...pageData, width: size.width, height: size.height });

                const rawimage = new OCRRawImage(pageId + '_2');
                rawimage.imagePath = path.join(docData.path, rawimage.id + '.' + IMG_FORMAT);
                // rawimage.width = size.width;
                // rawimage.height = size.height;
                // const time = Date.now();
                const matImageSource = new ImageSource(imageFromMat(mat));
                // console.log('create image', Date.now() - time, 'ms');
                await matImageSource.saveToFileAsync(rawimage.imagePath, IMG_FORMAT, 100);
                // console.log('saveToFileAsync', Date.now() - time, 'ms');

                // const image = new OCRImage(pageId + '_1');
                // image.imagePath = path.join(docData.path, image.id +  '.' + IMG_FORMAT);
                // image.width = size.width;
                // image.height = size.height;
                // if (transformedMat) {
                //     const transformedMatImageSource = new ImageSource(imageFromMat(transformedMat));
                //     await transformedMatImageSource.saveToFileAsync(image.imagePath, IMG_FORMAT, 80);
                //     transformedMatImageSource.android.recycle();
                // } else {
                //     await matImageSource.saveToFileAsync(image.imagePath, IMG_FORMAT, 80);
                // }
                matImageSource.android.recycle();
                // image.mat = transformedMat || mat;
                // if (bitmap) {
                //     image._imageSource = new ImageSource(bitmap);
                // }
                // console.log('test', mat, image._imageSource, image._mat);
                // rawimage.mat = mat;

                // rawimage.width = image.width = size.width;
                // rawimage.height = image.height = size.height;

                // page.image = Promise.resolve(image);
                page.rawimage = Promise.resolve(rawimage);

                pages.push(page);
            }
            if (this.pages) {
                this.pages.push(...pages);
            } else {
                this.pages = pages;
            }
            if (this._observables) {
                this._observables.push(...pages);
            }
            this.notify({ eventName: 'pagesAdded', pages });
        }
    }

    async deletePage(pageIndex: number) {
        this.pages.splice(pageIndex, 1);
        if (this._observables) {
            this._observables.splice(pageIndex, 1);
        }
        const result = await this.save();
        documentsService.notify({ eventName: 'documentPageUpdated', object: this, pageIndex });
        return result;
    }

    getFirstImage() {}

    async updateImageConfig(pageIndex, imageConfig: Partial<ImageConfig>) {
        const page = this.pages[pageIndex];
        if (page) {
            // let needsSavingImage = false;
            // const imgPath = (await page.rawimage).imagePath
            // const rawMat = matFromImage(rawImageSource);
            // const imageSource = await ImageSource.fromFile((await page.image).imagePath);
            // let currentMat = matFromImage(imageSource);
            // const keys = Object.keys(imageConfig);
            // for (let index = 0; index < keys.length; index++) {
            //     const k = keys[index];

            //     switch (k) {
            //         case 'rotation':
            //             if (page[k] === imageConfig[k]) {
            //                 return;
            //             }
            //             needsSavingImage = true;
            //             const b = BitmapFactory.asBitmap(BitmapFactory.makeMutable(
            //                 await ImageSource.fromFile(imgPath),
            //                     {
            //                     }
            //                 )).rotate(90);
            //             console.log('image rotated')
            //             await b.toImageSource().saveToFileAsync(
            //                 imgPath,
            //                 IMG_FORMAT
            //             );
            //             console.log('image savedd')
            //             b.dispose()
            //             break;
            //     }
            // }
            Object.assign(page, imageConfig);
            // const docFolder = documentsService.dataFolder.getFolder(this.id);

            // if (needsSavingImage) {
            //     const transformedMatImageSource = new ImageSource(imageFromMat(currentMat));
            //     await transformedMatImageSource.saveToFileAsync((await page.image).imagePath, 'png');
            //     transformedMatImageSource.android.recycle();
            // }
            // imageSource.android.recycle();
            // rawImageSource.android.recycle();
            await this.save();
            this.onPageUpdated(pageIndex, page);

            // this.notify({
            //     eventName: 'imageUpdated',
            //     object: this,
            //     data: {
            //         index: pageIndex,
            //         config: imageConfig,
            //     },
            // });
            // await this.saveConfig();
        }
    }
    onPageUpdated(pageIndex: number, page: OCRPage) {
        page.notify({ eventName: 'updated', object: page });
        this.notify({ eventName: 'pageUpdated', object: page, pageIndex });
        documentsService.notify({ eventName: 'documentPageUpdated', object: this, pageIndex });
    }
    _observablesListeners: Function[] = [];
    getObservablePages() {
        if (!this._observables) {
            const pages = this.pages;
            // await Promise.all(pages.map((p) => p.getImageSource()));
            this._observables = new ObservableArray(pages);
            const handler = (event: EventData & { pageIndex: number }) => {
                this._observables.setItem(event.pageIndex, this._observables.getItem(event.pageIndex));
            };
            this._observablesListeners.push(handler);
            this.on('pageUpdated', handler);
        }
        return this._observables;
    }
    // clearObservableArray(array: ObservableArray<OCRPage>) {
    //     const index = this._observables.indexOf(array);
    //     if (this._observables) {
    //         this._observables.splice(index, 1);
    //         this._observablesListeners.splice(index, 1);
    //     }
    // }
}
applyMixins(OCRDocument, [Observable]);
interface OCRDocument extends Observable {}

export enum ColorType {
    NONE,
    GRAY,
    BLACK_WHITE
}

namespace ArrayTransformer {
    export function to(value: number[]): string {
        if (!value) {
            return null;
        }
        return JSON.stringify(value);
    }

    export function from(value: string): number[] {
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }
}

// @EventEmitter
@Entity()
class OCRPage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'simple-enum',
        enum: ColorType,
        nullable: false,
        default: ColorType.NONE
    })
    colorType?: ColorType;

    @Column('text', { nullable: true, transformer: ArrayTransformer })
    colorMatrix?: number[];

    @Column('int', { nullable: false, default: 0 })
    rotation?: number;

    @Column('text', { nullable: true, transformer: ArrayTransformer })
    crop?: number[];

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @ManyToOne((type) => OCRDocument, (document) => document.pages, { onDelete: 'CASCADE' })
    document: OCRDocument;

    @OneToOne((type) => OCRRawImage, { cascade: true })
    @JoinColumn()
    rawimage: Promise<OCRRawImage>;

    newRotation?: number;

    // @OneToOne((type) => OCRImage, { cascade: true })
    // @JoinColumn()
    // image: Promise<OCRImage>;

    constructor(id: string) {
        super();
        this['_observers'] = {};
        this.id = id;
    }

    async getImagePath() {
        return (await this.rawimage).imagePath;
    }
    async getFileSize() {
        const result = File.fromPath((await this.rawimage).imagePath).size;
        console.log('getFileSize', result);
        return result;
    }
    // _imageSource: ImageSource;
    // get imageSource() {
    //     return this._imageSource;
    // }
    // async getImageSource() {
    //     // if (!this._imageSource) {
    //     //     const image = await this.image;
    //     //     if (image) {
    //     //         this._imageSource = image.imageSource;
    //     //     }
    //     // }
    //     return (await this.image).getImageSource();
    // }
}
applyMixins(OCRPage, [Observable]);
interface OCRPage extends Observable {}

@Entity()
export class OCRImage extends BaseEntity {
    @PrimaryColumn()
    id: string;
    // @Column('blob', { nullable: false })
    // data: any;

    @Column('text', { nullable: false })
    imagePath: string;

    // @OneToOne((type) => OCRPage, (page) => page.image)
    // page: Promise<OCRPage>;

    constructor(id: string) {
        super();
        this.id = id;
    }
    // _imageSource: ImageSource;
    // get imageSource() {
    //     if (!this._imageSource) {
    //         const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
    //         this._imageSource = new ImageSource(bmp);
    //     }
    //     return this._imageSource;
    // }
    // getImageSource() {
    //     // if (!this._imageSource) {
    //     const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
    //     return new ImageSource(bmp, true);
    //     // }
    //     // return this._imageSource;
    // }
    // _mat: Mat;
    // get mat() {
    // if (!this._mat) {
    // if (global.isAndroid) {
    //     this._mat = matFromImage(this.imageSource.android);
    // } else {
    //     this._mat = matFromImage(this.imageSource.ios);
    // }
    // }
    // return this._mat;
    // if (global.isAndroid) {
    //     return matFromImage(this.getImageSource().android);
    // } else {
    //     return matFromImage(this.getImageSource().ios);
    // }
    // }

    // set mat(value: Mat) {
    // this._mat = value;
    // const nimage = imageFromMat(value);
    // if (!this._imageSource) {
    // this._imageSource = new ImageSource(nimage);
    // } else {
    //     this._imageSource.setNativeSource(nimage);
    // }
    // const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
    // nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
    // this.data = byteArrayOutputStream.toByteArray();
    // }
}

@Entity()
export class OCRRawImage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    // @Column('blob', { nullable: false })
    // data: any;

    @Column('text', { nullable: false })
    imagePath: string;

    @OneToOne((type) => OCRPage, (page) => page.rawimage)
    page: Promise<OCRPage>;
    constructor(id: string) {
        super();
        this.id = id;
    }
    // _imageSource: ImageSource;
    // get imageSource() {
    //     // if (!this._imageSource) {
    //     const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
    //     //     this._imageSource = new ImageSource(bmp, true);
    //     // }
    //     // return this._imageSource;
    //     return new ImageSource(bmp, true);
    // }
    // _mat: Mat;
    // get mat() {
    //     if (!this._mat) {
    //         if (global.isAndroid) {
    //             this._mat = matFromImage(this.imageSource.android);
    //         } else {
    //             this._mat = matFromImage(this.imageSource.ios);
    //         }
    //     }
    //     return this._mat;
    // }
    // set mat(value: Mat) {
    //     this._mat = value;
    //     const nimage = imageFromMat(value) as android.graphics.Bitmap;
    //     // this._imageSource = new ImageSource(nimage);
    //     const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
    //     nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
    //     this.data = byteArrayOutputStream.toByteArray();
    //     nimage.recycle();
    // }
}

export { OCRDocument, OCRPage };
