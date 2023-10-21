import { EventData, File, ImageSource, Observable, ObservableArray, path } from '@nativescript/core';
import { documentsService } from '~/services/documents';
import { ColorMatricesType } from '~/utils/ui';

export interface ImageConfig {
    colorType?: ColorMatricesType;
    colorMatrix?: number[];
    rotation?: number;
}

export class Tag {
    public readonly id!: string;
    public name: string;
}

export const IMG_FORMAT = 'jpg';

export interface Document {
    id: string;
    createdDate: number;
    modifiedDate: number;
    name?: string;
    tags: string[];
}

export class OCRDocument extends Observable implements Document {
    id: string;
    createdDate: number;
    modifiedDate: number;
    name?: string;
    tags: string[];

    _observables: ObservableArray<OCRPage>;
    pages: OCRPage[];

    constructor(id: string) {
        super();
        console.log('OCRDocument', id);
        this.id = id;
    }

    static async createDocument(name?: string, pagesData?: PageData[], setRaw = false) {
        const docId = Date.now() + '';
        const doc = await documentsService.documentRepository.createDocument({ id: docId, name } as any);
        console.log('createDocument', doc);
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
                // const page = new OCRPage(pageId, docId);
                const pageFileData = docData.getFolder(pageId);
                const { imagePath, sourceImagePath, image, ...pageData } = pagesData[index];
                const attributes = { ...pageData, id: pageId, document_id: docId } as OCRPage;
                attributes.imagePath = path.join(pageFileData.path, 'image' + '.' + IMG_FORMAT);
                DEV_LOG && console.log('add page', attributes.imagePath, imagePath, sourceImagePath, image, pageData);
                if (imagePath) {
                    const file = File.fromPath(imagePath);
                    await file.copy(attributes.imagePath);
                } else if (image) {
                    await new ImageSource(image).saveToFileAsync(attributes.imagePath, IMG_FORMAT, 100);
                } else {
                    continue;
                }
                if (sourceImagePath) {
                    const baseName = sourceImagePath.split('/').slice(-1)[0];
                    const actualSourceImagePath = path.join(pageFileData.path, baseName);
                    const file = File.fromPath(sourceImagePath);
                    await file.copy(actualSourceImagePath);
                    attributes.sourceImagePath = actualSourceImagePath;
                }
                // we add 1000 to each pageIndex so that we can reorder them
                attributes.pageIndex = pages.length + 1000;
                // Object.assign(pageData, { ...pageData, pageIndex: pages.length + 1000 });

                //using saved image to disk
                pages.push(await documentsService.pageRepository.createPage(attributes));
            }
            console.log('addPages done', pages);
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
        await documentsService.pageRepository.delete(removed[0]);
        const docData = documentsService.dataFolder.getFolder(this.id);
        for (let index = 0; index < removed.length; index++) {
            const removedPage = removed[index];
            await docData.getFolder(removedPage.id).remove();
        }
        documentsService.notify({ eventName: 'documentPageDeleted', object: this, pageIndex });
        return this;
    }

    async updatePage(pageIndex, data: Partial<Page>) {
        const page = this.pages[pageIndex];
        console.log('updatePage', pageIndex, data);
        if (page) {
            await documentsService.pageRepository.update(page, data);
            // await this.save();
            this.onPageUpdated(pageIndex, page);
        }
    }
    async movePage(oldIndex: any, newIndex: any) {
        // first we need to find the new pageIndex
        let pageIndex;
        if (newIndex === 0) {
            pageIndex = this.pages[0].pageIndex - 1;
        } else {
            pageIndex = this.pages[newIndex].pageIndex + 1;
        }
        await this.updatePage(oldIndex, {
            pageIndex
        });

        const item = this.pages[oldIndex];
        this.pages.splice(oldIndex, 1);
        this.pages.splice(newIndex, 0, item);
        if (this._observables) {
            const item = this._observables.getItem(oldIndex);
            this._observables.splice(oldIndex, 1);
            this._observables.splice(newIndex, 0, item);
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
            this._observables = new ObservableArray(pages);
            const handler = (event: EventData & { pageIndex: number }) => {
                this._observables.setItem(event.pageIndex, this._observables.getItem(event.pageIndex));
            };
            this._observablesListeners.push(handler);
            this.on('pageUpdated', handler);
        }
        return this._observables;
    }

    async save() {
        return documentsService.documentRepository.update(this);
    }
}

export interface Page {
    id: string;
    createdDate: number;
    modifiedDate?: number;
    document_id: string;

    colorType?: string;
    colorMatrix?: number[];
    rotation: number;
    crop: number[];
    pageIndex: number;
    scale: number;
    width: number;
    height: number;
    sourceImagePath: string;
    imagePath: string;
    transformedImagePath?: string;
}

export interface PageData extends ImageConfig, Partial<Page> {
    bitmap?;
    image?;
}

export class OCRPage extends Observable implements Page {
    id: string;
    createdDate: number;
    modifiedDate?: number;
    document_id: string;

    colorType?: string;
    colorMatrix?: number[];
    _colorMatrix?: string;

    rotation: number = 0;
    scale: number = 1;

    crop: number[];
    _crop: string;

    pageIndex: number;
    width: number;
    height: number;
    sourceImagePath: string;
    imagePath: string;
    transformedImagePath?: string;

    getImagePath() {
        return this.transformedImagePath || this.imagePath;
    }
    constructor(id: string, docId: string) {
        super();
        this.id = id;
        this.document_id = docId;
    }
}
