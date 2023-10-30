import { request } from '@nativescript-community/perms';
import { ColorMatrixColorFilter, Paint } from '@nativescript-community/ui-canvas';
import { Folder, ImageSource, knownFolders, path } from '@nativescript/core';
import { Observable } from '@nativescript/core/data/observable';
import SqlQuery from 'kiss-orm/dist/Queries/SqlQuery';
import CrudRepository from 'kiss-orm/dist/Repositories/CrudRepository';
import { Document, OCRDocument, OCRPage, Page, Tag } from '~/models/OCRDocument';
import { getColorMatrix } from '~/utils/ui';
import NSQLDatabase from './NSQLDatabase';
import { loadImage, recycleImages } from '~/utils/utils';
const sql = SqlQuery.createFromTemplateString;

export class BaseRepository<T, U = T, V = any> extends CrudRepository<T, U, V> {
    constructor(data) {
        super(data);
    }
    static migrations = {
        // addGroupName: sql`ALTER TABLE Groups ADD COLUMN name TEXT`,
        // addGroupOnMap: sql`ALTER TABLE Groups ADD COLUMN onMap INTEGER`
    };
    async applyMigrations() {
        const migrations = this.constructor.prototype.migrations;
        if (!migrations) {
            return;
        }
        const migrationKeys = Object.keys(migrations);
        for (let index = 0; index < migrationKeys.length; index++) {
            const key = migrationKeys[index];
            try {
                await this.database.migrate({
                    [key]: migrations[key]
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export class TagRepository extends BaseRepository<Tag, Tag> {
    constructor(database: NSQLDatabase) {
        super({
            database,
            table: 'Tag',
            primaryKey: 'id',
            model: Tag
        });
    }

    async createTables() {
        await this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "Tag" (
            id BIGINT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
        );
        `);
        return this.applyMigrations();
    }
}
export class PageRepository extends BaseRepository<OCRPage, Page> {
    constructor(database: NSQLDatabase) {
        super({
            database,
            table: 'Page',
            primaryKey: 'id',
            model: OCRPage
        });
    }

    async createTables() {
        await this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "Page" (
            id TEXT PRIMARY KEY NOT NULL,
            createdDate BIGINT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
            modifiedDate NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
            pageIndex INTEGER NOT NULL,
            colorType TEXT,
            colorMatrix TEXT,
            transforms TEXT,
            rotation INTEGER DEFAULT 0,
            scale INTEGER DEFAULT 1,
            crop TEXT,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            sourceImagePath TEXT NOT NULL,
            imagePath TEXT NOT NULL,
            document_id TEXT,
            FOREIGN KEY(document_id) REFERENCES Document(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
        `);
        return this.applyMigrations();
    }

    async createPage(page: OCRPage) {
        const createdDate = Date.now();
        return this.create({
            id: page.id,
            createdDate,
            modifiedDate: createdDate,
            document_id: page.document_id,
            pageIndex: page.pageIndex,
            width: page.width,
            height: page.height,
            rotation: page.rotation ?? 0,
            scale: page.scale ?? 1,
            imagePath: page.imagePath,
            colorType: page.colorType,
            sourceImagePath: page.sourceImagePath,
            crop: page._crop || (JSON.stringify(page.crop) as any),
            colorMatrix: page._colorMatrix || (JSON.stringify(page.colorMatrix) as any)
        });
    }
    async update(page: OCRPage, data?: Partial<OCRPage>) {
        if (!data) {
            const toUpdate = {
                modifiedDate: Date.now()
            };
            await this.update(page, toUpdate);
            return page;
        }
        data.modifiedDate = Date.now();
        const toSave: Partial<Document> = {};
        const toUpdate: any = {};
        Object.keys(data).forEach((k) => {
            const value = data[k];
            toSave[k] = value;
            if (typeof value === 'object' || Array.isArray(value)) {
                toUpdate[k] = JSON.stringify(value);
            } else {
                toUpdate[k] = value;
            }
        });

        console.log('OCRPage update', page, toUpdate, toSave);
        await super.update(page, toUpdate);
        console.log('OCRPage update done', toUpdate, toSave);
        Object.assign(page, toSave);
        return page;
    }
    async createModelFromAttributes(attributes: Required<any> | OCRPage): Promise<OCRPage> {
        const { id, document_id, ...other } = attributes;
        const model = new OCRPage(id, document_id);
        Object.assign(model, {
            ...other,
            _crop: other.crop,
            crop: other.crop ? JSON.parse(other.crop) : other.crop,
            _colorMatrix: other.colorMatrix,
            colorMatrix: other.colorMatrix ? JSON.parse(other.colorMatrix) : undefined
        });
        return model;
    }
}

export class DocumentRepository extends BaseRepository<OCRDocument, Document> {
    constructor(
        database: NSQLDatabase,
        public pagesRepository: PageRepository,
        public tagsRepository: TagRepository
    ) {
        super({
            database,
            table: 'Document',
            primaryKey: 'id',
            model: OCRDocument
        });
    }

    async createTables() {
        return Promise.all([
            this.database.query(sql`
            CREATE TABLE IF NOT EXISTS "Document" (
                id TEXT PRIMARY KEY NOT NULL,
                createdDate BIGINT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
                modifiedDate BIGINT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
                name TEXT,
                _synced INTEGER DEFAULT 0
                );
        `),
            this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "DocumentsTags" (
            document_id TEXT,
            tag_id TEXT,
            PRIMARY KEY(document_id, tag_id),
            FOREIGN KEY(document_id) REFERENCES Document(id) ON DELETE CASCADE,
            FOREIGN KEY(tag_id) REFERENCES Tag(id) ON DELETE CASCADE
        );
    `)
        ]);
    }

    async createDocument(document: Document) {
        document.createdDate = document.modifiedDate = Date.now();
        document._synced = 0;
        return this.create(document);
    }

    async loadTagsRelationship(document: OCRDocument): Promise<OCRDocument> {
        const tags = await this.tagsRepository.search({
            where: sql`
            "id" IN (
                SELECT "tag_id"
                FROM "DocumentsTags"
                WHERE "document_id" = ${document.id}
            )
        `
        });
        document.tags = tags.map((g) => g.id);
        return document;
    }

    async update(document: OCRDocument, data?: Partial<OCRDocument>, updateModifiedDate = true) {
        if (!data) {
            const toUpdate: Partial<OCRDocument> = {
                _synced: 0
            };
            if (updateModifiedDate) {
                toUpdate.modifiedDate = Date.now();
            }
            await this.update(document, toUpdate);
            return document;
        }
        if (updateModifiedDate && !data.modifiedDate) {
            data.modifiedDate = Date.now();
        }
        if (data._synced === undefined) {
            data._synced = 0;
        }
        const toSave: Partial<Document> = {};
        const toUpdate: any = {};
        Object.keys(data).forEach((k) => {
            const value = data[k];
            toSave[k] = value;
            if (typeof value === 'object' || Array.isArray(value)) {
                toUpdate[k] = JSON.stringify(value);
            } else {
                toUpdate[k] = value;
            }
        });

        await super.update(document, toUpdate);
        Object.assign(document, toSave);
        return document;
    }
    async addTag(document: OCRDocument, tagId: string) {
        try {
            let tag;
            try {
                tag = await this.tagsRepository.get(tagId);
            } catch (error) {}
            // console.log('addGroupToItem', group);
            if (!tag) {
                tag = await this.tagsRepository.create({ id: tagId, name: tagId });
            }
            const relation = await this.database.query(sql` SELECT * FROM DocumentsTags WHERE "document_id" = ${document.id} AND "tag_id" = ${tagId}`);
            if (relation.length === 0) {
                await this.database.query(sql` INSERT INTO DocumentsTags ( document_id, tag_id ) VALUES(${document.id}, ${tagId})`);
            }
            document.tags = document.tags || [];
            document.tags.push(tagId);
        } catch (error) {
            console.error(error);
        }
    }

    async getPages(document: OCRDocument) {
        return this.pagesRepository.search({ where: sql`document_id = ${document.id}`, orderBy: sql`pageIndex ASC` });
    }

    async getItem(itemId: string) {
        const element = await this.get(itemId);
        return element;
    }
    async search(args: { postfix?: SqlQuery; select?: SqlQuery; where?: SqlQuery; orderBy?: SqlQuery }) {
        const result = await super.search({ ...args /* , postfix: sql`d LEFT JOIN PAGE p on p.document_id = d.id` */ });
        for (let index = 0; index < result.length; index++) {
            const doc = result[index];
            doc.pages = (await this.getPages(doc)) as any;
        }
        return result;
    }

    async createModelFromAttributes(attributes: Required<any> | OCRDocument): Promise<OCRDocument> {
        const model = new OCRDocument(attributes.id);
        Object.assign(model, {
            ...attributes
        });
        return model;
    }
}

export class DocumentsService extends Observable {
    dataFolder: Folder;
    // connection: Connection;
    started = false;
    db: NSQLDatabase;
    pageRepository: PageRepository;
    tagRepository: TagRepository;
    documentRepository: DocumentRepository;
    async start() {
        if (this.started) {
            return;
        }
        await request('storage');
        this.dataFolder = knownFolders.externalDocuments().getFolder('data');
        const filePath = path.join(knownFolders.externalDocuments().path, 'db.sqlite');
        DEV_LOG && console.log('DocumentsService', 'start', filePath);

        this.db = new NSQLDatabase(filePath, {
            // for now it breaks
            // threading: true,
            transformBlobs: false
        } as any);
        this.pageRepository = new PageRepository(this.db);
        this.tagRepository = new TagRepository(this.db);
        this.documentRepository = new DocumentRepository(this.db, this.pageRepository, this.tagRepository);
        await this.documentRepository.createTables();
        await this.pageRepository.createTables();
        await this.tagRepository.createTables();

        this.notify({ eventName: 'started' });
        this.started = true;
    }
    async deleteDocuments(docs: OCRDocument[]) {
        // await this.documentRepository.delete(model);
        await Promise.all(docs.map((d) => this.documentRepository.delete(d)));
        // await OCRDocument.delete(docs.map((d) => d.id));
        docs.forEach((doc) => doc.removeFromDisk());
        this.notify({ eventName: 'documentsDeleted', docs });
    }
    stop() {
        DEV_LOG && console.log('DocumentsService stop');
        if (!this.started) {
            return;
        }
        this.started = false;
        this.db && this.db.disconnect();
    }

    async saveDocument(doc: OCRDocument) {
        this.documentRepository.update(doc);
        // doc.save();
    }

    async exportPDF(document: OCRDocument) {
        const start = Date.now();
        if (__ANDROID__) {
            const pdfDocument = new android.graphics.pdf.PdfDocument();
            const pages = document.pages;
            let page: OCRPage;
            let imagePath: string;
            for (let index = 0; index < pages.length; index++) {
                page = pages[index];
                imagePath = page.getImagePath();
                let width = page.width;
                let height = page.height;
                if (page.rotation % 180 !== 0) {
                    width = page.height;
                    height = page.width;
                }
                width *= page.scale;
                height *= page.scale;
                const pageInfo = new android.graphics.pdf.PdfDocument.PageInfo.Builder(width * page.scale, height * page.scale, index + 1).create();
                const pdfpage = pdfDocument.startPage(pageInfo);
                const pageCanvas = pdfpage.getCanvas();
                const imageSource = await loadImage(imagePath);
                let bitmapPaint: Paint = null;
                if (page.colorType || page.colorMatrix) {
                    if (!bitmapPaint) {
                        bitmapPaint = new Paint();
                    }
                    bitmapPaint.setColorFilter(new ColorMatrixColorFilter(page.colorMatrix || getColorMatrix(page.colorType)));
                }
                pageCanvas.translate(width / 2, height / 2);
                pageCanvas.rotate(page.rotation, 0, 0);
                pageCanvas.scale(page.scale, page.scale, 0, 0);
                pageCanvas.drawBitmap(imageSource.android, -page.width / 2, -page.height / 2, bitmapPaint?.['getNative']());
                recycleImages(imageSource);
                pdfDocument.finishPage(pdfpage);
            }
            const pdfFile = knownFolders.temp().getFile(Date.now() + '.pdf');
            const newFile = new java.io.File(pdfFile.path);
            const fos = new java.io.FileOutputStream(newFile);
            pdfDocument.writeTo(fos);
            pdfDocument.close();
            DEV_LOG && console.log('pdfFile', java.nio.file.Files.size(newFile.toPath()), Date.now() - start, 'ms');
            return pdfFile;
        }
    }
}
export const documentsService = new DocumentsService();
