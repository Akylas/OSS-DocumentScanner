import { request } from '@nativescript-community/perms';
import { ApplicationSettings, Folder, knownFolders, path } from '@nativescript/core';
import { Observable } from '@nativescript/core/data/observable';
import SqlQuery from 'kiss-orm/dist/Queries/SqlQuery';
import CrudRepository from 'kiss-orm/dist/Repositories/CrudRepository';
import { Document, OCRDocument, OCRPage, Page, Tag } from '~/models/OCRDocument';
import NSQLDatabase from './NSQLDatabase';
const sql = SqlQuery.createFromTemplateString;

let dataFolder: Folder;

function cleanUndefined(obj) {
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'undefined') {
            delete obj[key];
        }
    });
    return obj;
}

export class BaseRepository<T, U = T, V = any> extends CrudRepository<T, U, V> {
    constructor(data) {
        super(data);
    }
    migrations = {
        // addGroupName: sql`ALTER TABLE Groups ADD COLUMN name TEXT`,
        // addGroupOnMap: sql`ALTER TABLE Groups ADD COLUMN onMap INTEGER`
    };
    async applyMigrations() {
        const migrations = this.migrations;
        if (!migrations) {
            return;
        }

        // For now disable it as we could have a issue if db is deleted while setting is kept
        // const settingsKey = `SQLITE_${this.table}_migrations`;
        // const appliedMigrations = JSON.parse(ApplicationSettings.getString(settingsKey, '[]'));

        // const actualMigrations = { ...migrations };
        // for (let index = 0; index < appliedMigrations.length; index++) {
        //     delete actualMigrations[appliedMigrations[index]];
        // }

        // const migrationKeys = Object.keys(migrations).filter((k) => appliedMigrations.indexOf(k) === -1);
        // for (let index = 0; index < migrationKeys.length; index++) {
        try {
            await this.database.migrate(migrations);
            // appliedMigrations.push(...Object.keys(migrations));
        } catch (error) {
            console.error(error, error.stack);
        }
        // }
        // ApplicationSettings.setString(settingsKey, JSON.stringify(appliedMigrations));
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
    migrations = Object.assign(
        {
            addPageName: sql`ALTER TABLE Page ADD COLUMN name TEXT`,
            transformsSplit: sql`UPDATE Page SET transforms = replace( transforms, ',', '|' )`,
            removeDataPath: () => sql`UPDATE Page SET imagePath = replace( imagePath, ${dataFolder.path}, '' ), sourceImagePath = replace( sourceImagePath, ${dataFolder.path}, '' )`
        },
        CARD_APP
            ? {
                  addQRCode: sql`ALTER TABLE Page ADD COLUMN qrcode TEXT`,
                  addColors: sql`ALTER TABLE Page ADD COLUMN colors TEXT`
                  // addGroupOnMap: sql`ALTER TABLE Groups ADD COLUMN onMap INTEGER`
              }
            : {}
    );
    async createTables() {
        await this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "Page" (
            id TEXT PRIMARY KEY NOT NULL,
            createdDate BIGINT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
            modifiedDate NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
            pageIndex INTEGER,
            colorType TEXT,
            colorMatrix TEXT,
            transforms TEXT,
            rotation INTEGER DEFAULT 0,
            scale INTEGER DEFAULT 1,
            crop TEXT,
            ocrData TEXT,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            size INTEGER NOT NULL,
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
        const dataFolder = documentsService.dataFolder.path;
        return this.create({
            ...cleanUndefined(page),
            imagePath: page.imagePath.replace(dataFolder, ''),
            sourceImagePath: page.sourceImagePath.replace(dataFolder, ''),
            createdDate,
            pageindex: -1, // we are stuck with this as we cant migrate to remove pageIndex
            modifiedDate: createdDate,
            rotation: page.rotation && !isNaN(page.rotation) ? page.rotation : 0,
            scale: page.scale ?? 1,
            crop: page._crop || (JSON.stringify(page.crop) as any),
            colorMatrix: page._colorMatrix || (JSON.stringify(page.colorMatrix) as any),
            ocrData: page._ocrData || (JSON.stringify(page.ocrData) as any),
            ...(CARD_APP
                ? {
                      qrcode: page._qrcode || (JSON.stringify(page.qrcode) as any),
                      colors: page._colors || (JSON.stringify(page.colors) as any)
                  }
                : {})
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

        await super.update(page, toUpdate);
        Object.assign(page, toSave);
        return page;
    }
    async createModelFromAttributes(attributes: Required<any> | OCRPage): Promise<OCRPage> {
        const { id, document_id, imagePath, sourceImagePath, ...other } = attributes;
        const model = new OCRPage(id, document_id);
        Object.assign(model, {
            ...other,
            // imagePath,
            // sourceImagePath,
            imagePath: dataFolder.path + imagePath,
            sourceImagePath: dataFolder.path + sourceImagePath,
            _crop: other.crop,
            crop: other.crop ? JSON.parse(other.crop) : undefined,
            _colorMatrix: other.colorMatrix,
            colorMatrix: other.colorMatrix ? JSON.parse(other.colorMatrix) : undefined,
            _ocrData: other.ocrData,
            ocrData: other.ocrData ? JSON.parse(other.ocrData) : undefined,
            ...(CARD_APP
                ? {
                      _qrcode: other.qrcode,
                      qrcode: other.qrcode ? JSON.parse(other.qrcode) : undefined,
                      _colors: other.colors,
                      colors: other.colors ? JSON.parse(other.colors) : undefined
                  }
                : {})
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
        await Promise.all([
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
        return this.applyMigrations();
    }

    migrations = Object.assign({
        addPagesOrder: sql`ALTER TABLE Document ADD COLUMN pagesOrder TEXT`
    });

    async createDocument(document: Document) {
        document.createdDate = document.modifiedDate = Date.now();
        document._synced = 0;
        return this.create(cleanUndefined(document));
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
        // DEV_LOG && console.log('update doc', toSave, document._synced, new Error().stack);
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

    async getItem(itemId: string) {
        const element = await this.get(itemId);
        return element;
    }
    async search(args: { postfix?: SqlQuery; select?: SqlQuery; where?: SqlQuery; orderBy?: SqlQuery }) {
        const result = await super.search({ ...args /* , postfix: sql`d LEFT JOIN PAGE p on p.document_id = d.id` */ });

        // remove all documents with no Page, it is a bug and should never happen

        return result.filter((d) => d.pages?.length > 0);
    }
    async createModelFromAttributes(attributes: Required<any> | OCRDocument): Promise<OCRDocument> {
        const document = new OCRDocument(attributes.id);
        Object.assign(document, {
            ...attributes,
            _pagesOrder: attributes.pagesOrder,
            pagesOrder: attributes.pagesOrder ? JSON.parse(attributes.pagesOrder) : undefined
        });

        let pages = await this.pagesRepository.search({ where: sql`document_id = ${document.id}` });
        if (pages.length) {
            const pagesOrder = document.pagesOrder;
            if (pagesOrder) {
                pages = pages.sort(function (a, b) {
                    return pagesOrder.indexOf(a.id) - pagesOrder.indexOf(b.id);
                });
                document.pages = pages;
            } else {
                // pagesOrder was not existing before let s create it.
                pages = pages.sort(function (a, b) {
                    return a['pageIndex'] - b['pageIndex'];
                });
                document.pages = pages;
                await document.save({}, true);
            }
        }

        return document;
    }
}

export class DocumentsService extends Observable {
    static DB_NAME = 'db.sqlite';
    rootDataFolder: string;
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
        let rootDataFolder = ApplicationSettings.getString('root_data_folder');
        DEV_LOG && console.log('DocumentsService', 'start', rootDataFolder);
        if (!rootDataFolder) {
            rootDataFolder = knownFolders.externalDocuments().path;
            ApplicationSettings.setString('root_data_folder', rootDataFolder);
        }
        this.rootDataFolder = rootDataFolder;
        dataFolder = this.dataFolder = Folder.fromPath(rootDataFolder).getFolder('data');
        const filePath = path.join(rootDataFolder, DocumentsService.DB_NAME);

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
    async deleteDocuments(documents: OCRDocument[]) {
        // await this.documentRepository.delete(model);
        await Promise.all(documents.map((d) => this.documentRepository.delete(d)));
        // await OCRDocument.delete(docs.map((d) => d.id));
        documents.forEach((doc) => doc.removeFromDisk());
        this.notify({ eventName: 'documentsDeleted', documents });
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
}
export const documentsService = new DocumentsService();
