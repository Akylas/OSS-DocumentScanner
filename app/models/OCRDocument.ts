import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@nativescript-community/typeorm/browser';
import { Imgproc, Mat, imageFromMat, matFromImage } from 'nativescript-opencv';
import { toBlackAndWhite } from '~/workers/contours';
import { EventData, ImageSource, Observable, ObservableArray } from '@nativescript/core';
// import { documentsService } from '~/services/documents';
import { EventEmitter, applyMixins } from '~/utils/decorators';
import { addWeakEventListener, removeWeakEventListener } from '@nativescript/core/ui/core/weak-event-listener';

export interface ImageConfig {
    colorType?: ColorType;
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

// @EventEmitter
@Entity()
class OCRDocument extends BaseEntity {
    @PrimaryColumn()
    id: string;
    @CreateDateColumn()
    createdDate: Date;
    @Column({ nullable: true })
    name?: string;
    // @Column({ nullable: true, transformer:observableArrayTransformer })
    // @JoinTable()
    @OneToMany((type) => OCRPage, (page) => page.document, { cascade: true, eager: true })
    @JoinTable()
    pages: OCRPage[];

    constructor(id: string) {
        super();
        this['_observers'] = {};
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
            const length = pagesData.length;
            console.log('addPages', length);
            const pages = [];
            for (let index = 0; index < length; index++) {
                const pageId = docId + '_' + index;
                const page = new OCRPage(pageId);
                const { mat, bitmap, transformedMat, ...pageData } = pagesData[index];
                const size = mat.size();
                console.log('addPage', mat, bitmap, transformedMat);
                Object.assign(page, pageData);

                const image = new OCRImage(pageId + '_1');
                image.mat = transformedMat || mat;
                if (bitmap) {
                    image._imageSource = new ImageSource(bitmap);
                }
                // console.log('test', mat, image._imageSource, image._mat);
                const rawimage = new OCRRawImage(pageId + '_2');
                rawimage.mat = mat;

                rawimage.width = image.width = size.width;
                rawimage.height = image.height = size.height;

                page.image = Promise.resolve(image);
                page.rawimage = Promise.resolve(rawimage);

                pages.push(page);
            }
            if (this.pages) {
                this.pages.push(...pages);
                if (this._observables) {
                    this._observables.push(...pages);
                }
            } else {
                this.pages = pages;
            }
            return this.save();
        }
    }

    getFirstImage() {}

    async updateImageConfig(pageIndex, imageConfig: Partial<ImageConfig>) {
        const page = this.pages[pageIndex];
        if (page) {
            let needsSavingImage = false;
            let currentMat = (await page.image).mat;
            const keys = Object.keys(imageConfig);
            for (let index = 0; index < keys.length; index++) {
                const k = keys[index];

                switch (k) {
                    case 'colorType':
                        if (page[k] === imageConfig[k]) {
                            return;
                        }
                        const rawMat = (await page.rawimage).mat;
                        needsSavingImage = true;
                        switch (imageConfig.colorType) {
                            case ColorType.NONE:
                                currentMat.release();
                                currentMat = rawMat.clone();
                                break;
                            case ColorType.GRAY:
                                if (rawMat.channels() === 4) {
                                    Imgproc.cvtColor(rawMat, currentMat, Imgproc.COLOR_RGBA2GRAY);
                                } else if (rawMat.channels() === 3) {
                                    Imgproc.cvtColor(rawMat, currentMat, Imgproc.COLOR_RGB2GRAY);
                                }
                                break;
                            case ColorType.BLACK_WHITE:
                                toBlackAndWhite(rawMat, currentMat);
                                break;
                        }
                        break;
                }
            }
            Object.assign(page, imageConfig);
            // const docFolder = documentsService.dataFolder.getFolder(this.id);

            if (needsSavingImage) {
                const image = await page.image;
                image.mat = currentMat;
                page._imageSource = image.imageSource;
                // documentsService.saveImage(docFolder, currentMat, pageIndex);
            }
            this.onPageUpdated(pageIndex, page);
            await this.save();

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
        // documentsService.notify({ eventName: 'documentPageUpdated', object: this, pageIndex });
    }
    _observables: ObservableArray<OCRPage>;
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

    @Column('int', { nullable: false, default: 0 })
    rotation?: number;

    @Column('int', { nullable: true, array: true })
    crop?: number[];

    @ManyToOne((type) => OCRDocument, (document) => document.pages)
    @JoinColumn()
    document: OCRDocument;

    @OneToOne((type) => OCRRawImage, { cascade: true })
    @JoinColumn()
    rawimage: Promise<OCRRawImage>;

    @OneToOne((type) => OCRImage, { cascade: true })
    @JoinColumn()
    image: Promise<OCRImage>;
    constructor(id: string) {
        super();
        this['_observers'] = {};
        this.id = id;
    }
    _imageSource: ImageSource;
    get imageSource() {
        return this._imageSource;
    }
    async getImageSource() {
        if (!this._imageSource) {
            const image = await this.image;
            if (image) {
                this._imageSource = image.imageSource;
            }
        }
        return this._imageSource;
    }
}
applyMixins(OCRPage, [Observable]);
interface OCRPage extends Observable {}

@Entity()
export class OCRImage extends BaseEntity {
    @PrimaryColumn()
    id: string;
    @Column('blob', { nullable: false })
    data: any;

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @OneToOne((type) => OCRPage, (page) => page.image)
    page: Promise<OCRPage>;

    constructor(id: string) {
        super();
        this.id = id;
    }
    _imageSource: ImageSource;
    get imageSource() {
        if (!this._imageSource) {
            const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
            this._imageSource = new ImageSource(bmp);
        }
        return this._imageSource;
    }
    _mat: Mat;
    get mat() {
        if (!this._mat) {
            if (global.isAndroid) {
                this._mat = matFromImage(this.imageSource.android);
            } else {
                this._mat = matFromImage(this.imageSource.ios);
            }
        }
        return this._mat;
    }

    set mat(value: Mat) {
        this._mat = value;
        const nimage = imageFromMat(value);
        // if (!this._imageSource) {
        this._imageSource = new ImageSource(nimage);
        // } else {
        //     this._imageSource.setNativeSource(nimage);
        // }
        const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
        nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        this.data = byteArrayOutputStream.toByteArray();
    }
}

@Entity()
export class OCRRawImage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column('blob', { nullable: false })
    data: any;

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @OneToOne((type) => OCRPage, (page) => page.rawimage)
    page: Promise<OCRPage>;
    constructor(id: string) {
        super();
        this.id = id;
    }
    _imageSource: ImageSource;
    get imageSource() {
        if (!this._imageSource) {
            const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
            this._imageSource = new ImageSource(bmp);
        }
        return this._imageSource;
    }
    _mat: Mat;
    get mat() {
        if (!this._mat) {
            if (global.isAndroid) {
                this._mat = matFromImage(this.imageSource.android);
            } else {
                this._mat = matFromImage(this.imageSource.ios);
            }
        }
        return this._mat;
    }
    set mat(value: Mat) {
        this._mat = value;
        const nimage = imageFromMat(value);
        this._imageSource = new ImageSource(nimage);
        const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
        nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        this.data = byteArrayOutputStream.toByteArray();
    }
}

export { OCRDocument, OCRPage };
