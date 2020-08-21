import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@akylas/typeorm/browser';
import OCRImage from './OCRImage';
import OCRPage, { ColorType } from './OCRPage';
import { Imgproc, Mat, imageFromMat } from 'nativescript-opencv';
import { toBlackAndWhite } from '~/workers/contours';
import { EventData, ImageSource, Observable, ObservableArray } from '@nativescript/core';
import OCRRawImage from './OCRRawImage';
import { documentsService } from '~/services/documents';
import { EventEmitter, applyMixins } from '~/utils/decorators';
import { addWeakEventListener, removeWeakEventListener } from '@nativescript/core/ui/core/weak-event-listener';

export interface ImageConfig {
    colorType?: ColorType;
    rotation?: number;
    crop?: number[];
}

export const observableArrayTransformer = {
    // lastValue: undefined as any[],
    from(val: any[]) {
        console.log('from', val);
        return new ObservableArray(val);
    },
    to(w: ObservableArray<any>) {
        console.log('to', w);
        return w['_array'];
    },
};

function createArrayBuffer(length: number, useInts = true) {
    let bb: java.nio.ByteBuffer;
    if (useInts) {
        bb = java.nio.ByteBuffer.allocateDirect(length);
    } else {
        bb = java.nio.ByteBuffer.allocateDirect(length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN);
    }
    // var bb = java.nio.ByteBuffer.allocateDirect(length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN);
    const result = (ArrayBuffer as any).from(bb);
    // result.bb = bb;
    return result;
}
export function arrayoNativeArray(array, useInts = true) {
    if (!Array.isArray(array)) {
        return array;
    }
    const length = array.length;
    const buffer = createArrayBuffer(length, useInts);
    const arrayBuffer = useInts ? new Int8Array(buffer) : new Float32Array(buffer);
    arrayBuffer.set(array);

    return arrayBuffer;
}

@Entity()
@EventEmitter
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
        this.id = id;
    }

    static async createDocument(name?: string, mats?: Mat[], setRaw = false) {
        const docId = Date.now() + '';
        let doc = new OCRDocument(docId);
        if (name) {
            doc.name = name;
        }
        if (mats) {
            const length = mats.length;
            const pages = [];
            for (let index = 0; index < length; index++) {
                const pageId = docId + '_' + index;
                const page = new OCRPage(pageId);
                const mat = mats[index];
                const size = mat.size();

                const image = new OCRImage(pageId + '_1');
                image.mat = mat;
                console.log('test', mat, image._imageSource, image._mat);
                const rawimage = new OCRRawImage(pageId + '_2');
                rawimage._imageSource = image._imageSource;
                rawimage._mat = image._mat;
                rawimage.data = image.data;

                rawimage.width = image.width = size.width;
                rawimage.height = image.height = size.height;

                page.image = Promise.resolve(image);
                page.rawimage = Promise.resolve(rawimage);

                pages.push(page);
            }
            doc.pages = pages;
            doc = await doc.save();
        }
        return doc;
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
                            case 0:
                                currentMat.release();
                                currentMat = rawMat.clone();
                                break;
                            case 1:
                                if (rawMat.channels() === 4) {
                                    Imgproc.cvtColor(rawMat, currentMat, Imgproc.COLOR_RGBA2GRAY);
                                } else if (rawMat.channels() === 3) {
                                    Imgproc.cvtColor(rawMat, currentMat, Imgproc.COLOR_RGB2GRAY);
                                }
                                break;
                            case 2:
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
        console.log('onPageUpdated', pageIndex);
        page.notify({ eventName: 'updated', object: page });
        this.notify({ eventName: 'pageUpdated', object: page, pageIndex });
    }
    _observables: ObservableArray<OCRPage>[] = [];
    _observablesListeners: Function[] = [];
    async getObservablePages() {
        const pages = this.pages;
        await Promise.all(pages.map((p) => p.getImageSource()));
        const result = new ObservableArray(pages);
        this._observables.push(result);
        const handler = (event: EventData & { pageIndex: number }) => {
            result.setItem(event.pageIndex, result.getItem(event.pageIndex));
        };
        this._observablesListeners.push(handler);
        this.on('pageUpdated', handler);

        return result;
    }
    clearObservableArray(array: ObservableArray<OCRPage>) {
        const index = this._observables.indexOf(array);
        if (index >= 0) {
            this._observables.splice(index, 1);
            this._observablesListeners.splice(index, 1);
        }
    }
}

interface OCRDocument extends Observable {}

// applyMixins(OCRDocument, [Observable]);
export default OCRDocument;
