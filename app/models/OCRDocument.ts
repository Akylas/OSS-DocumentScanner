import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn } from '@nativescript-community/typeorm/browser';
import { EventData, File, ImageSource, Observable, ObservableArray, path } from '@nativescript/core';
// import { documentsService } from '~/services/documents';
import { documentsService } from '~/services/documents';
import { applyMixins } from '~/utils/decorators';
import { ColorMatricesType } from '~/utils/ui';

export interface ImageConfig {
    colorType?: ColorMatricesType;
    colorMatrix?: number[];
    rotation?: number;
}

export interface Page {
    width: number;
    crop: number[];
    height: number;
    imagePath: string;
    sourceImagePath: string;
    transformedImagePath?: string;
}

export interface PageData extends ImageConfig, Partial<Page> {
    bitmap?;
    image?;
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

export const IMG_FORMAT = 'jpg';
// @EventEmitter
@Entity()
class OCRDocument extends BaseEntity {
    // _observers: any;
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
        this['_observers'] = {};
        this.id = id;
    }

    static async createDocument(name?: string, pagesData?: PageData[], setRaw = false) {
        const docId = Date.now() + '';
        const doc = new OCRDocument(docId);
        if (name) {
            doc.name = name;
        }
        await doc.addPages(pagesData);
        return doc;
    }

    async addPages(pagesData?: PageData[]) {
        console.log('addPages', pagesData);
        if (pagesData) {
            const docId = this.id;
            const docData = documentsService.dataFolder.getFolder(docId);
            const length = pagesData.length;
            const pages = [];
            const pageStartId = Date.now();
            for (let index = 0; index < length; index++) {
                const pageId = pageStartId + '_' + index;
                const page = new OCRPage(pageId);
                const pageFileData = docData.getFolder(pageId);
                const { imagePath, sourceImagePath, image, ...pageData } = pagesData[index];
                page.imagePath = path.join(pageFileData.path, 'image' + '.' + IMG_FORMAT);
                console.log('add page', page.imagePath, imagePath, sourceImagePath, image, page, pageData);
                if (imagePath) {
                    const file = File.fromPath(imagePath);
                    await file.copy(page.imagePath);
                } else if (image) {
                    await new ImageSource(image).saveToFileAsync(page.imagePath, IMG_FORMAT, 100);
                } else {
                    continue;
                }
                if (sourceImagePath) {
                    const baseName = sourceImagePath.split('/').slice(-1)[0];
                    const actualSourceImagePath = path.join(pageFileData.path, baseName);
                    const file = File.fromPath(sourceImagePath);
                    await file.copy(actualSourceImagePath);
                    page.sourceImagePath = actualSourceImagePath;
                }
                Object.assign(page, { ...pageData });

                //using saved image to disk
                pages.push(page);

                // using OpenCV
                // const size = mat.size();

                // const rawimage = new OCRRawImage(pageId + '_2');
                // rawimage.imagePath = path.join(docData.path, rawimage.id + '.' + IMG_FORMAT);
                // const matImageSource = new ImageSource(imageFromMat(mat));
                // await matImageSource.saveToFileAsync(rawimage.imagePath, IMG_FORMAT, 100);

                // matImageSource.android.recycle();
                // page.rawimage = Promise.resolve(rawimage);
                // pages.push(page);
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

    async removeFromDisk() {
        const docData = documentsService.dataFolder.getFolder(this.id);
        console.log('OCRDocument', 'removeFromDisk');
        return docData.remove();
    }

    async deletePage(pageIndex: number) {
        const removed = this.pages.splice(pageIndex, 1);
        if (this._observables) {
            this._observables.splice(pageIndex, 1);
        }
        const result = await this.save();
        const docData = documentsService.dataFolder.getFolder(this.id);
        for (let index = 0; index < removed.length; index++) {
            const removedPage = removed[index];
            await docData.getFolder(removedPage.id).remove();
        }
        documentsService.notify({ eventName: 'documentPageDeleted', object: this, pageIndex });
        return result;
    }

    async updateImageConfig(pageIndex, imageConfig: Partial<ImageConfig>) {
        const page = this.pages[pageIndex];
        if (page) {
            // console.log('updateImageConfig',pageIndex, imageConfig)
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
        type: 'text',
        nullable: true
    })
    colorType?: string;

    @Column('text', { nullable: true, transformer: ArrayTransformer })
    colorMatrix?: number[];

    @Column('int', { nullable: false, default: 0 })
    rotation: number = 0;

    @Column('text', { nullable: false, transformer: ArrayTransformer })
    crop: number[];

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @ManyToOne((type) => OCRDocument, (document) => document.pages, { onDelete: 'CASCADE' })
    document: OCRDocument;

    @Column('text', { nullable: false })
    sourceImagePath: string;

    @Column('text', { nullable: false })
    imagePath: string;

    @Column('text', { nullable: true })
    transformedImagePath: string;

    getImagePath() {
        return this.transformedImagePath || this.imagePath;
    }
    // newRotation?: number;

    // @OneToOne((type) => OCRImage, { cascade: true })
    // @JoinColumn()
    // image: Promise<OCRImage>;

    constructor(id: string) {
        super();
        this['_observers'] = {};
        this.id = id;
    }
}
applyMixins(OCRPage, [Observable]);
interface OCRPage extends Observable {}

export { OCRDocument, OCRPage };
