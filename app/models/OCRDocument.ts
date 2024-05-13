import { getImagePipeline } from '@nativescript-community/ui-image';
import { ApplicationSettings, EventData, File, ImageSource, Observable, ObservableArray, path } from '@nativescript/core';
import dayjs from 'dayjs';
import { ColorPaletteData, OCRData, QRCodeData, cropDocument, cropDocumentFromFile } from 'plugin-nativeprocessor';
import { documentsService } from '~/services/documents';
import { ColorMatricesType } from '~/utils/matrix';
import { loadImage, recycleImages } from '~/utils/images';
import { DOCUMENT_NAME_FORMAT, IMG_COMPRESS, IMG_FORMAT, SETTINGS_DOCUMENT_NAME_FORMAT } from './constants';
import { doInBatch } from '~/utils/ui';
import { getFormatedDateForFilename } from '~/utils/utils.common';
import type { MatricesTypes, Matrix } from '~/utils/color_matrix';

export interface ImportImageData {
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageRotation?: number;
    quads?: [number, number][][];
    qrcode?: QRCodeData;
}

export interface ImageConfig {
    colorType?: MatricesTypes;
    colorMatrix?: Matrix;
    rotation?: number;
}

export class Tag {
    public readonly id!: string;
    public name: string;
}

export interface Document {
    id: string;
    createdDate: number;
    modifiedDate: number;
    name?: string;
    tags: string[];
    _synced: number;
    pagesOrder: string[];
}

export class OCRDocument extends Observable implements Document {
    // id: string;
    createdDate: number;
    modifiedDate: number;
    name?: string;
    tags: string[];
    _synced: number;

    pagesOrder: string[];
    _pagesOrder?: string;

    #observables: ObservableArray<OCRPage>;
    pages: OCRPage[];

    constructor(public id: string) {
        super();
        // this.id = id;
    }

    static async createDocument(pagesData?: PageData[], setRaw = false) {
        const date = dayjs();
        const docId = date.valueOf() + '';
        const name = getFormatedDateForFilename(date.valueOf(), ApplicationSettings.getString(SETTINGS_DOCUMENT_NAME_FORMAT, DOCUMENT_NAME_FORMAT), false);
        // DEV_LOG && console.log('createDocument', docId);
        const doc = await documentsService.documentRepository.createDocument({ id: docId, name } as any);
        await doc.addPages(pagesData);
        // DEV_LOG && console.log('createDocument pages added');
        // no need to notify on create. Will be done in documentAdded
        await doc.save({}, false, false);
        documentsService.notify({ eventName: 'documentAdded', doc });
        return doc;
    }

    get folderPath() {
        return documentsService.dataFolder.getFolder(this.id);
    }

    async addPage(pageData: PageData, index: number = this.pages.length) {
        const docId = this.id;
        const docData = documentsService.dataFolder.getFolder(docId);
        const { id, imagePath, sourceImagePath, image, ...otherPageData } = pageData;
        const pageId = id || Date.now() + '_' + index;
        // const page = new OCRPage(pageId, docId);
        const pageFileData = docData.getFolder(pageId);
        const attributes = { ...otherPageData, id: pageId, document_id: docId } as OCRPage;
        attributes.imagePath = path.join(pageFileData.path, 'image' + '.' + IMG_FORMAT);
        if (imagePath) {
            const file = File.fromPath(imagePath);
            await file.copy(attributes.imagePath);
        } else if (image) {
            const compressFormat = ApplicationSettings.getString('image_export_format', IMG_FORMAT) as 'png' | 'jpeg' | 'jpg';
            const compressQuality = ApplicationSettings.getNumber('image_export_quality', IMG_COMPRESS);
            await new ImageSource(image).saveToFileAsync(attributes.imagePath, compressFormat, compressQuality);
        } else {
            return;
        }
        attributes.size = File.fromPath(attributes.imagePath).size;
        // DEV_LOG && console.log('add1 page', attributes.imagePath, imagePath, sourceImagePath, image, attributes.size, otherPageData);
        if (sourceImagePath) {
            let baseName = sourceImagePath
                .split('/')
                .pop()
                .replace(/%[a-zA-Z\d]{2}/, '');
            if (!baseName.endsWith(IMG_FORMAT)) {
                baseName += '.' + IMG_FORMAT;
            }
            const actualSourceImagePath = path.join(pageFileData.path, baseName);
            const file = File.fromPath(sourceImagePath);
            await file.copy(actualSourceImagePath);
            attributes.sourceImagePath = actualSourceImagePath;
        }
        // we add 1000 to each pageIndex so that we can reorder them
        // if (!attributes.pageIndex) {
        //     attributes.pageIndex = index + 1000;
        // }
        const addedPage = await documentsService.pageRepository.createPage(attributes);
        // Object.assign(pageData, { ...pageData, pageIndex: pages.length + 1000 });

        //using saved image to disk
        if (this.pages) {
            this.pages.splice(index, 0, addedPage);
        } else {
            this.pages = [addedPage];
        }
        if (this.#observables) {
            this.#observables.splice(index, 0, addedPage);
        }
        this.notify({ eventName: 'pagesAdded', pages: [addedPage] });
    }

    async addPages(pagesData?: PageData[]) {
        DEV_LOG && console.log('addPages', JSON.stringify(pagesData));
        if (pagesData) {
            const docId = this.id;
            const docData = this.folderPath;
            const length = pagesData.length;
            const pageStartId = Date.now();
            const compressFormat = ApplicationSettings.getString('image_export_format', IMG_FORMAT) as 'png' | 'jpeg' | 'jpg';
            const compressQuality = ApplicationSettings.getNumber('image_export_quality', IMG_COMPRESS);
            const pages = await doInBatch(pagesData, async (data, index) => {
                const { id, imagePath, sourceImage, sourceImagePath, image, ...pageData } = data;
                const pageId = id || pageStartId + '_' + index;
                // const page = new OCRPage(pageId, docId);
                const pageFileData = docData.getFolder(pageId);
                const attributes = { ...pageData, id: pageId, document_id: docId } as OCRPage;
                attributes.imagePath = path.join(pageFileData.path, 'image' + '.' + compressFormat);
                DEV_LOG && console.log('add page', pageId, attributes.imagePath, imagePath, sourceImagePath, image, JSON.stringify(pageData));
                if (imagePath) {
                    const file = File.fromPath(imagePath);
                    await file.copy(attributes.imagePath);
                } else if (image) {
                    const imageSource = new ImageSource(image);
                    await imageSource.saveToFileAsync(attributes.imagePath, compressFormat, compressQuality);
                } else {
                    return;
                }
                attributes.size = File.fromPath(attributes.imagePath).size;
                if (sourceImage) {
                    const baseName = dayjs().format('yyyyMMddHHmmss') + '.' + compressFormat;
                    // }
                    const actualSourceImagePath = path.join(pageFileData.path, baseName);

                    const imageSource = new ImageSource(sourceImage);
                    await imageSource.saveToFileAsync(actualSourceImagePath, compressFormat, compressQuality);
                    attributes.sourceImagePath = actualSourceImagePath;
                } else if (sourceImagePath) {
                    let baseName = sourceImagePath
                        .replace(/%252F/g, '/') // for Android content:// paths
                        .split('/')
                        .pop()
                        .replace(/%[a-zA-Z\d]{2}/, '');
                    if (!baseName.endsWith(compressFormat)) {
                        baseName += '.' + compressFormat;
                    }
                    const actualSourceImagePath = path.join(pageFileData.path, baseName);
                    const file = File.fromPath(sourceImagePath);
                    await file.copy(actualSourceImagePath);
                    DEV_LOG && console.log('add page source image copied', actualSourceImagePath, File.exists(actualSourceImagePath), File.fromPath(actualSourceImagePath).size);
                    attributes.sourceImagePath = actualSourceImagePath;
                }
                if (id) {
                    try {
                        const page = await documentsService.pageRepository.get(id);
                        if (page) {
                            const { id, ...toUpdate } = attributes;
                            return documentsService.pageRepository.update(page, toUpdate);
                        }
                    } catch (error) {}
                }
                return documentsService.pageRepository.createPage(attributes);
            });
            // for (let index = 0; index < length; index++) {}
            // DEV_LOG && console.log('addPages done', JSON.stringify(pages));
            if (this.pages) {
                this.pages.push(...pages);
            } else {
                this.pages = pages;
            }
            // this.save();
            if (this.#observables) {
                this.#observables.push(...pages);
            }
            this.notify({ eventName: 'pagesAdded', pages });
        }
    }

    // async updatePagesOrder() {
    //     this.save({
    //         pagesOrder: this.pages.map((p) => p.id)
    //     });
    // }

    async removeFromDisk() {
        const docData = documentsService.dataFolder.getFolder(this.id);
        return docData.remove();
    }

    async deletePage(pageIndex: number) {
        const removed = this.pages.splice(pageIndex, 1);
        if (this.pages.length === 0) {
            return documentsService.deleteDocuments([this]);
        }
        if (this.#observables) {
            this.#observables.splice(pageIndex, 1);
        }
        await documentsService.pageRepository.delete(removed[0]);
        const docData = documentsService.dataFolder.getFolder(this.id);
        for (let index = 0; index < removed.length; index++) {
            const removedPage = removed[index];
            await docData.getFolder(removedPage.id).remove();
        }
        documentsService.notify({ eventName: 'documentPageDeleted', object: this as any, pageIndex });
        return this;
    }

    async updatePage(pageIndex, data: Partial<Page>, imageUpdated = false) {
        const page = this.pages[pageIndex];
        DEV_LOG && console.log('updatePage', pageIndex, JSON.stringify(data), page.toString());
        if (page) {
            await documentsService.pageRepository.update(page, data);
            // we save the document so that the modifiedDate gets changed
            // no need to notify though
            await this.save({}, true);
            this.onPageUpdated(pageIndex, page, imageUpdated);
        }
    }
    async movePage(oldIndex: any, newIndex: any) {
        // first we need to find the new pageIndex
        // let pageIndex;
        // if (newIndex === 0) {
        //     pageIndex = this.pages[0].pageIndex - 1;
        // } else {
        //     pageIndex = this.pages[newIndex].pageIndex + 1;
        // }
        // await this.updatePage(oldIndex, {
        //     pageIndex
        // });

        const item = this.pages[oldIndex];
        this.pages.splice(oldIndex, 1);
        this.pages.splice(newIndex, 0, item);
        if (this.#observables) {
            const item = this.#observables.getItem(oldIndex);
            this.#observables.splice(oldIndex, 1);
            this.#observables.splice(newIndex, 0, item);
        }
        return this.save();
    }
    onPageUpdated(pageIndex: number, page: OCRPage, imageUpdated = false) {
        // page.notify({ eventName: 'updated', object: page });
        // this.notify({ eventName: 'pageUpdated', object: page, pageIndex });
        documentsService.notify({ eventName: 'documentPageUpdated', object: this as any, pageIndex, imageUpdated });
    }
    getObservablePages() {
        if (!this.#observables) {
            const pages = this.pages;
            this.#observables = new ObservableArray(pages);
            // const handler = (event: EventData & { pageIndex: number }) => {
            //     this.#observables.setItem(event.pageIndex, this.#observables.getItem(event.pageIndex));
            // };
            // this.#_observablesListeners.push(handler);
            // this.on('pageUpdated', handler);
        }
        return this.#observables;
    }

    async save(data: Partial<OCRDocument> = {}, updateModifiedDate = false, notify = true) {
        data.pagesOrder = this.pages.map((p) => p.id);
        await documentsService.documentRepository.update(this, data, updateModifiedDate);
        if (notify) {
            documentsService.notify({ eventName: 'documentUpdated', object: documentsService, doc: this, updateModifiedDate });
        }
    }

    toString() {
        return JSON.stringify(this, (key, value) => (key !== '_synced' && key.startsWith('_') ? undefined : value));
    }

    toJSONObject() {
        return JSON.parse(this.toString());
    }

    async updatePageCrop(pageIndex: number, quad: any) {
        const page = this.pages[pageIndex];
        DEV_LOG && console.log('updatePageCrop', this.id, pageIndex, quad, page.imagePath);
        const file = File.fromPath(page.imagePath);
        const compressFormat = ApplicationSettings.getString('image_export_format', IMG_FORMAT) as 'png' | 'jpeg' | 'jpg';
        const compressQuality = ApplicationSettings.getNumber('image_export_quality', IMG_COMPRESS);
        const images = await cropDocumentFromFile(page.sourceImagePath, [quad], {
            transforms: page.transforms,
            saveInFolder: file.parent.path,
            fileName: file.name,
            compressFormat,
            compressQuality
        });
        const image = images[0];
        DEV_LOG && console.log('updatePageCrop done', image);
        // const croppedImagePath = page.imagePath;
        // await new ImageSource(images[0]).saveToFileAsync(croppedImagePath, IMG_FORMAT, IMG_COMPRESS);
        // if (__IOS__) {
        //     // TODO: fix why do we need to clear the whole cache? wrong cache key?
        //     getImagePipeline().clearCaches();
        // } else {
        //     getImagePipeline().evictFromCache(croppedImagePath);
        // }
        await this.updatePage(
            pageIndex,
            {
                crop: quad,
                width: image.width,
                height: image.height,
                size: file.size
            },
            true
        );
        //we remove from cache so that everything gets updated
        // recycleImages(images);
    }
    async updatePageTransforms(pageIndex: number, transforms: string, optionalUpdates = {}) {
        const page = this.pages[pageIndex];
        const file = File.fromPath(page.imagePath);
        DEV_LOG && console.log('updatePageTransforms', this.id, pageIndex, page.imagePath, transforms, file.parent.path, file.name);
        DEV_LOG && console.log('updatePageTransforms2', page.sourceImagePath, File.exists(page.sourceImagePath), File.fromPath(page.sourceImagePath).size);
        const compressFormat = ApplicationSettings.getString('image_export_format', IMG_FORMAT) as 'png' | 'jpeg' | 'jpg';
        const compressQuality = ApplicationSettings.getNumber('image_export_quality', IMG_COMPRESS);
        const images = await cropDocumentFromFile(page.sourceImagePath, [page.crop], {
            transforms,
            saveInFolder: file.parent.path,
            fileName: file.name,
            compressFormat,
            compressQuality
        });
        const image = images[0];
        DEV_LOG && console.log('updatePageTransforms done', image);

        await this.updatePage(
            pageIndex,
            {
                transforms,
                width: image.width,
                height: image.height,
                size: file.size,
                ...optionalUpdates
            },
            true
        );
    }
}

export interface Page {
    id: string;
    createdDate: number;
    modifiedDate?: number;
    name?: string;
    document_id: string;

    transforms?: string;
    colorType?: MatricesTypes;
    colorMatrix?: Matrix;
    brightness?: number;
    contrast?: number;
    rotation: number;
    crop: [number, number][];
    // pageIndex: number;
    scale: number;
    width: number;
    height: number;
    size: number;
    sourceImagePath: string;
    sourceImageWidth: number;
    sourceImageHeight: number;
    sourceImageRotation: number;
    imagePath: string;

    ocrData: OCRData;
    qrcode: QRCodeData;
    colors: ColorPaletteData;
}

export interface PageData extends ImageConfig, Partial<Page> {
    bitmap?;
    image?;
    sourceImage?;
}

export class OCRPage extends Observable implements Page {
    id: string;
    createdDate: number;
    modifiedDate?: number;
    name?: string;
    document_id: string;

    colorType?: MatricesTypes;
    colorMatrix?: Matrix;

    brightness?: number;
    contrast?: number;

    rotation: number = 0;
    scale: number = 1;

    crop: [number, number][];

    transforms?: string;

    // pageIndex: number;
    width: number;
    height: number;
    size: number;

    sourceImagePath: string;
    sourceImageWidth: number;
    sourceImageHeight: number;
    sourceImageRotation: number;

    imagePath: string;

    ocrData: OCRData;
    qrcode: QRCodeData;
    colors: ColorPaletteData;

    constructor(id: string, docId: string) {
        super();
        this.id = id;
        this.document_id = docId;
    }
    toString() {
        return JSON.stringify(this, (key, value) => (key !== '_synced' && key.startsWith('_') ? undefined : value));
    }

    toJSONObject() {
        return JSON.parse(this.toString());
    }
}
