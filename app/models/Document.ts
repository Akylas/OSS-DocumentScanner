import { ChangeType, ChangedData, ImageSource, Observable, ObservableArray, addWeakEventListener } from '@nativescript/core';
import { Imgcodecs, Imgproc, Mat, imageFromMat } from 'nativescript-opencv';
import { ImageOptions } from 'jspdf';
import { documentsService } from '~/services/documents';
import { toBlackAndWhite } from '~/workers/contours';
export interface ImageConfig extends Omit<ImageOptions, 'imageData' | 'x' | 'y' | 'width' | 'height'> {
    colorType?: number;
    crop?: number[];
}
export default class OCRDocument extends Observable {
    constructor(id?: string, name?: string, mats?: any, setRaw = false) {
        super();
        if (id) {
            this.id = id;
        }
        if (name) {
            this.name = name;
        }
        if (mats) {
            const length = mats.length;
            this.pages = new ObservableArray(
                Array.apply(null, Array(length)).map((i, index) => ({
                    config: {
                        colorType: 0,
                        rotation: 0,
                    },
                    rawmat: mats[index],
                    mat: mats[index].clone(),

                    image: new ImageSource(imageFromMat(mats[index])),
                }))
            );
            // addWeakEventListener(this.pages, this.on)
            // this.rawmats = mats;

            // this.imagesConfig = Array.apply(null, Array(length)).map((v) => ({
            //     colorType: 0,
            //     rotation: 0,
            // }));
        }
    }
    id: string;

    name?: string;

    pages: ObservableArray<{ image: ImageSource; config: ImageConfig; mat: Mat; rawmat?: Mat }>;

    // images: ObservableArray<ImageSource>;

    // _mats: ObservableArray<Mat>;

    // onMatChanged(event: ChangedData<Mat>) {
    //     console.log('onMatChanged', event);
    //     switch (event.action) {
    //         case ChangeType.Delete: {
    //             this.images.splice(event.index, event.removed.length);
    //             this.imagesConfig.splice(event.index, event.removed.length);
    //             break;
    //         }
    //         case ChangeType.Add: {
    //             if (event.addedCount > 0) {
    //             }
    //             // Reload the items to avoid duplicate Load on Demand indicators:
    //             return;
    //         }
    //         case ChangeType.Update: {
    //             if (event.addedCount > 0) {
    //                 for (let index = event.index; index < event.index + event.addedCount; index++) {
    //                     const docFolder = documentsService.dataFolder.getFolder(this.id);
    //                     const mat = this._mats.getItem(index);
    //                     const image = imageFromMat(mat);
    //                     this.images.setItem(index, new ImageSource(image));
    //                     documentsService.saveImage(docFolder, this._mats.getItem(index), index);
    //                 }
    //             }
    //             // if (event.removed && event.removed.length > 0) {
    //             //     this.images.splice(event.index, event.removed.length);
    //             //     this.imagesConfig.splice(event.index, event.removed.length);
    //             // }
    //             break;
    //         }
    //         case ChangeType.Splice: {
    //             if (event.addedCount > 0) {
    //             }
    //             if (event.removed && event.removed.length > 0) {
    //                 this.images.splice(event.index, event.removed.length);
    //                 this.imagesConfig.splice(event.index, event.removed.length);
    //             }
    //         }
    //     }
    // }
    // set mats(value: ObservableArray<Mat>) {
    //     const mats = [];
    //     const images: ImageSource[] = [];
    //     for (let index = 0; index < value.length; index++) {
    //         images[index] = new ImageSource(imageFromMat(value[index]));
    //         mats[index] = value[index];
    //     }
    //     this._mats = new ObservableArray(mats as any);
    //     addWeakEventListener(this._mats, ObservableArray.changeEvent, this.onMatChanged, this);

    //     this.images = new ObservableArray(images);
    // }
    // get mats(): ObservableArray<Mat> {
    //     return this._mats;
    // }
    // _rawmats: ObservableArray<Mat>;
    // set rawmats(value: any) {
    //     const mats = [];
    //     const rawmats = [];
    //     const images: ImageSource[] = [];
    //     for (let index = 0; index < value.length; index++) {
    //         images[index] = new ImageSource(imageFromMat(value[index]));
    //         rawmats[index] = value[index];
    //         mats[index] = value[index].clone();
    //     }
    //     this._rawmats = new ObservableArray(rawmats as any);
    //     this._mats = new ObservableArray(mats as any);
    //     this.images = new ObservableArray(images);
    //     addWeakEventListener(this._mats, ObservableArray.changeEvent, this.onMatChanged, this);
    // }
    // get rawmats() {
    //     return this._mats;
    // }

    imagesConfig: ImageConfig[];

    getRawMat(pageIndex) {
        const page = this.pages.getItem(pageIndex);
        if (page) {
            if (page.rawmat) {
                return page.rawmat;
            } else {
                const docFolder = documentsService.dataFolder.getFolder(this.id);
                page.rawmat = Imgcodecs.imread(docFolder.getFile(`raw_${pageIndex}.jpg`).path);
                return page.rawmat;
            }
        }
    }

    async updateImageConfig(pageIndex, imageConfig: Partial<ImageConfig>) {
        const page = this.pages.getItem(pageIndex);
        if (page) {
            let needsSavingImage = false;
            const currentConfig = page.config;
            let currentMat = page.mat;
            Object.keys(imageConfig).forEach((k: keyof ImageConfig) => {
                switch (k) {
                    case 'colorType':
                        if (currentConfig[k] === imageConfig[k]) {
                            return;
                        }
                        const rawMat = this.getRawMat(pageIndex);
                        console.log('updating colorType', imageConfig.colorType, rawMat);
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
            });
            Object.assign(currentConfig, imageConfig);
            const docFolder = documentsService.dataFolder.getFolder(this.id);

            if (needsSavingImage) {
                console.log('updating bitmap');
                page.image= new ImageSource(imageFromMat(currentMat));
                documentsService.saveImage(docFolder, currentMat, pageIndex);
            }

            this.notify({
                eventName: 'imageUpdated',
                object: this,
                data: {
                    index: pageIndex,
                    config: imageConfig,
                },
            });
            await this.saveConfig();
        }
    }

    async saveConfig() {
        const docFolder = documentsService.dataFolder.getFolder(this.id);
        const configFile = docFolder.getFile('config.json');
        const data = JSON.stringify({
            id: this.id,
            name: this.name,
            imagesConfig: this.pages.map((p) => p.config),
        });
        console.log('saveConfig', data);
        await configFile.writeText(data);
    }

    async save() {
        const start = Date.now();
        const dataFolder = documentsService.dataFolder;
        const docFolder = dataFolder.getFolder(this.id);
        this.pages.forEach((p, pageIndex) => {
            if (p.mat) {
                documentsService.saveImage(docFolder, p.mat, pageIndex);
            }
            if (p.rawmat) {
                documentsService.saveImage(docFolder, p.rawmat, pageIndex, 'raw');
            }
        });
        await this.saveConfig();
        console.log('saveDocument done', this, Date.now() - start, 'ms');
    }
}
