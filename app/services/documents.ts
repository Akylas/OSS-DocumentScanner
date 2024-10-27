import { ApplicationSettings, EventData, File, Folder, Observable, knownFolders, path } from '@nativescript/core';
import NSQLDatabase from '@shared/db/NSQLDatabase';
import SqlQuery from 'kiss-orm/dist/Queries/SqlQuery';
import CrudRepository from 'kiss-orm/dist/Repositories/CrudRepository';
import { DocFolder, Document, IDocFolder, OCRDocument, OCRPage, Page, Tag } from '~/models/OCRDocument';
import { EVENT_DOCUMENT_DELETED } from '~/utils/constants';
export const sql = SqlQuery.createFromTemplateString;

let dataFolder: Folder;

export const FOLDERS_SEPARATOR = '&&&';
export const FOLDER_COLOR_SEPARATOR = '&&';

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
        const { migrations } = this;
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
export class FolderRepository extends BaseRepository<DocFolder, IDocFolder> {
    constructor(database: NSQLDatabase) {
        super({
            database,
            table: 'Folder',
            primaryKey: 'id',
            model: DocFolder
        });
    }

    async createTables() {
        await this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "Folder" (
            id BIGINT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            color TEXT
        );
        `);
        return this.applyMigrations();
    }

    findFolders() {
        return this.search({
            select: sql`f.*, 
COUNT(df.document_id) AS count`,
            from: sql`Folder f`,
            postfix: sql`
LEFT JOIN DocumentsFolders df ON f.id = df.folder_id
GROUP BY f.id;`
        });
    }
    findFolder(name: string) {
        return this.search({
            select: sql`f.*, 
COUNT(pf.pack_id) AS count`,
            from: sql`Folder f`,
            where: sql`f.name = ${name}`,
            postfix: sql`
LEFT JOIN PacksFolders pf ON f.id = pf.folder_id`
        });
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
            addPageBrightness: sql`ALTER TABLE Page ADD COLUMN brightness INTEGER`,
            addPageContrasts: sql`ALTER TABLE Page ADD COLUMN contrast INTEGER`,
            transformsSplit: sql`UPDATE Page SET transforms = replace( transforms, ',', '|' )`,
            removeDataPath: () => sql`UPDATE Page SET imagePath = replace( imagePath, ${dataFolder.path}, '' ), sourceImagePath = replace( sourceImagePath, ${dataFolder.path}, '' )`,
            addSourceImageWidth: sql`ALTER TABLE Page ADD COLUMN sourceImageWidth INTEGER`,
            addSourceImageHeight: sql`ALTER TABLE Page ADD COLUMN sourceImageHeight INTEGER`,
            addSourceImageRotation: sql`ALTER TABLE Page ADD COLUMN sourceImageRotation INTEGER`
        },
        CARD_APP
            ? {
                  addQRCode: sql`ALTER TABLE Page ADD COLUMN qrcode TEXT`,
                  addColors: sql`ALTER TABLE Page ADD COLUMN colors TEXT`
              }
            : {}
    );

    async createTables() {
        await this.database.query(
            CARD_APP
                ? sql`
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
            width INTEGER,
            height INTEGER,
            size INTEGER,
            sourceImagePath TEXT,
            imagePath TEXT,
            document_id TEXT,
            FOREIGN KEY(document_id) REFERENCES Document(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
        `
                : sql`
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
        `
        );
        return this.applyMigrations();
    }

    async createPage(page: OCRPage, dataFolder: string) {
        const createdDate = Date.now();
        return this.create(
            cleanUndefined({
                ...page,
                imagePath: page.imagePath.replace(dataFolder, ''),
                sourceImagePath: page.sourceImagePath.replace(dataFolder, ''),
                createdDate,
                pageIndex: -1, // we are stuck with this as we cant migrate to remove pageIndex
                modifiedDate: createdDate,
                rotation: page.rotation && !isNaN(page.rotation) ? page.rotation : 0,
                scale: page.scale ?? 1,
                crop: page.crop ? JSON.stringify(page.crop) : undefined,
                colorMatrix: page.colorMatrix ? JSON.stringify(page.colorMatrix) : undefined,
                ocrData: page.ocrData ? JSON.stringify(page.ocrData) : undefined,
                ...(CARD_APP
                    ? {
                          qrcode: page.qrcode ? JSON.stringify(page.qrcode) : undefined,
                          colors: page.colors ? JSON.stringify(page.colors) : undefined
                      }
                    : {})
            })
        );
    }
    async update(page: OCRPage, data?: Partial<OCRPage>, updateModifiedDate = true) {
        if (!data) {
            const toUpdate: Partial<OCRPage> = {};
            if (updateModifiedDate) {
                toUpdate.modifiedDate = Date.now();
            }
            await this.update(page, toUpdate);
            return page;
        }

        if (updateModifiedDate && !data.modifiedDate) {
            data.modifiedDate = Date.now();
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

        await super.update(page, toUpdate);
        Object.assign(page, toSave);
        return page;
    }
    async createModelFromAttributes(attributes: OCRPage): Promise<any> {
        const { colorMatrix, colors, crop, document_id, id, imagePath, ocrData, qrcode, sourceImagePath, ...other } = attributes as any;
        const model = new OCRPage(id, document_id);
        Object.assign(model, {
            ...other,
            // imagePath,
            // sourceImagePath,
            imagePath: dataFolder.path + imagePath,
            sourceImagePath: dataFolder.path + sourceImagePath,

            crop: typeof crop === 'string' ? JSON.parse(crop) : crop,
            colorMatrix: typeof colorMatrix === 'string' ? JSON.parse(colorMatrix) : colorMatrix,
            ocrData: typeof ocrData === 'string' ? JSON.parse(ocrData) : ocrData,
            ...(CARD_APP
                ? {
                      qrcode: typeof qrcode === 'string' ? JSON.parse(qrcode) : qrcode,
                      colors: typeof colors === 'string' ? JSON.parse(colors) : colors
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
        public tagsRepository: TagRepository,
        public foldersRepository: FolderRepository
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
    `),
            this.database.query(sql`
        CREATE TABLE IF NOT EXISTS "DocumentsFolders" (
            document_id TEXT,
            folder_id TEXT,
            PRIMARY KEY(document_id, folder_id),
            FOREIGN KEY(document_id) REFERENCES Document(id) ON DELETE CASCADE,
            FOREIGN KEY(folder_id) REFERENCES Folder(id) ON DELETE CASCADE
        );
    `)
        ]);
        return this.applyMigrations();
    }

    migrations = Object.assign({
        addPagesOrder: sql`ALTER TABLE Document ADD COLUMN pagesOrder TEXT`
    });

    async createDocument(document: Document) {
        const { folders, ...others } = document;
        others.createdDate = others.modifiedDate = Date.now();
        others._synced = 0;
        const doc = await this.create(cleanUndefined({ ...others, pagesOrder: others.pagesOrder ? JSON.stringify(others.pagesOrder) : undefined }));
        if (folders) {
            for (let index = 0; index < folders.length; index++) {
                await doc.setFolder({ folderId: folders[index], notify: false });
            }
            doc.folders = folders;
        }
        return doc;
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
    async loadFoldersRelationship(document: OCRDocument): Promise<OCRDocument> {
        const folders = await this.foldersRepository.search({
            where: sql`
            "id" IN (
                SELECT "folder_id"
                FROM "DocumentsFolders"
                WHERE "document_id" = ${document.id}
            )
        `
        });
        document.folders = folders.map((g) => g.id);
        return document;
    }

    async update(document: OCRDocument, data?: Partial<OCRDocument>, updateModifiedDate = true) {
        // DEV_LOG && console.log('doc update', data);
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
        // DEV_LOG && console.log('update doc', toSave, document._synced);
        return document;
    }
    async addTag(document: OCRDocument, tagId: string) {
        try {
            let tag: Tag;
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
            console.error(error, error.stack);
        }
    }

    async getItem(itemId: string) {
        const element = await this.get(itemId);
        return element;
    }
    async search(args: { from?: SqlQuery; postfix?: SqlQuery; select?: SqlQuery; where?: SqlQuery; orderBy?: SqlQuery }) {
        const result = await super.search({ ...args });
        // remove all documents with no Page, it is a bug and should never happen

        return result.filter((d) => d.pages?.length > 0);
    }
    async findDocuments({ filter, folder, omitThoseWithFolders = false, order = 'id DESC' }: { filter?: string; folder?: DocFolder; omitThoseWithFolders?: boolean; order?: string }) {
        const args = {
            select: new SqlQuery([
                `d.*,
            group_concat(f.id, '${FOLDERS_SEPARATOR}') AS folders`
            ]),
            from: sql`Document d`,
            orderBy: new SqlQuery([`d.${order}`]),
            groupBy: sql`d.id`
        } as any;

        const foldersPostfix = `LEFT JOIN 
    DocumentsFolders df ON d.id = df.document_id
LEFT JOIN 
    Folder f ON df.folder_id = f.id`;
        if (filter?.length || folder) {
            if (filter?.length) {
                const where = `p.name LIKE '%${filter}%' OR d.name LIKE '%${filter}%' OR p.ocrData LIKE '%${filter}%'`;
                if (folder) {
                    args.postfix = sql` LEFT JOIN Page p ON p.document_id = d.id `;
                    args.where = new SqlQuery([`df.folder_id = ${folder.id} AND (${where})`]);
                } else {
                    args.postfix = sql` LEFT JOIN Page p ON p.document_id = d.id `;
                    args.where = new SqlQuery([where]);
                }
            } else {
                args.where = new SqlQuery([`df.folder_id = ${folder.id}`]);
            }
            args.postfix = new SqlQuery((args.postfix ? [args.postfix] : []).concat([foldersPostfix]));
        } else {
            if (omitThoseWithFolders) {
                args.select = sql`d.*`;
                args.from = sql`Document d`;
                args.where = sql`d.id NOT IN(SELECT document_id FROM DocumentsFolders)`;
            } else {
                args.postfix = new SqlQuery((args.postfix ? [args.postfix] : []).concat([foldersPostfix]));
            }
        }
        return this.search(args);
    }
    async createModelFromAttributes(attributes: Required<any> | OCRDocument): Promise<any> {
        const { folders, id, pagesOrder, ...others } = attributes;
        // DEV_LOG && console.log('createModelFromAttributes', id, folders, typeof folders);
        const document = new OCRDocument(id);
        Object.assign(document, {
            id,
            ...others,
            folders: (typeof folders === 'string' ? folders.split(FOLDERS_SEPARATOR) : folders)?.map((f) => parseInt(f, 10)),
            pagesOrder: typeof pagesOrder === 'string' && pagesOrder.length ? JSON.parse(pagesOrder) : pagesOrder
        });

        let pages = await this.pagesRepository.search({ where: sql`document_id = ${document.id}` });
        if (pages.length) {
            const { pagesOrder } = document;
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

export interface DocumentAddedEventData extends EventData {
    doc: OCRDocument;
    folder?: DocFolder;
}
export interface DocumentMovedFolderEventData extends EventData {
    object: OCRDocument;
    folder?: DocFolder;
    oldFolderId?: number;
}
export interface DocumentPagesAddedEventData extends EventData {
    object: OCRDocument;
    pages: OCRPage[];
}
export interface DocumentPageDeletedEventData extends EventData {
    object: OCRDocument;
    pageIndex: number;
}
export interface DocumentPageUpdatedEventData extends EventData {
    object: OCRDocument;
    pageIndex: number;
    imageUpdated: boolean;
}
export interface DocumentUpdatedEventData extends EventData {
    doc: OCRDocument;
    updateModifiedDate: boolean;
}
export interface FolderUpdatedEventData extends EventData {
    folder: DocFolder;
}
export interface DocumentDeletedEventData extends EventData {
    documents: OCRDocument[];
    folders: string[];
}

export type DocumentEvents = DocumentAddedEventData | DocumentDeletedEventData | DocumentUpdatedEventData | DocumentPagesAddedEventData | DocumentPageDeletedEventData | DocumentPageUpdatedEventData;

let ID = 0;
export class DocumentsService extends Observable {
    static DB_NAME = 'db.sqlite';
    static DB_VERSION = 2;
    rootDataFolder: string;
    dataFolder: Folder;
    id: number;
    // connection: Connection;
    started = false;
    db: NSQLDatabase;
    pageRepository: PageRepository;
    tagRepository: TagRepository;
    folderRepository: FolderRepository;
    documentRepository: DocumentRepository;

    constructor() {
        super();
        this.id = ID++;
    }
    async start(db?) {
        if (this.started) {
            return;
        }
        let rootDataFolder;
        if (__ANDROID__) {
            rootDataFolder = ApplicationSettings.getString('root_data_folder');
            if (rootDataFolder && !Folder.exists(rootDataFolder)) {
                rootDataFolder = null;
                ApplicationSettings.remove('root_data_folder');
            }
            if (!rootDataFolder) {
                rootDataFolder = knownFolders.externalDocuments().path;
                ApplicationSettings.setString('root_data_folder', rootDataFolder);
            }
        } else {
            // on iOS we cant store any knownFolders cause their path can change upon app upgrade
            rootDataFolder = knownFolders.externalDocuments().path;
        }
        this.rootDataFolder = rootDataFolder;
        dataFolder = this.dataFolder = Folder.fromPath(rootDataFolder).getFolder('data');
        DEV_LOG && console.info('DocumentsService', 'start', this.id, rootDataFolder, !!db, dataFolder.path);
        if (db) {
            this.db = new NSQLDatabase(db, {
                // for now it breaks
                // threading: true,
                transformBlobs: false
            } as any);
        } else {
            const filePath = path.join(rootDataFolder, DocumentsService.DB_NAME);
            DEV_LOG && console.log('DocumentsService', 'dbFileName', filePath, File.exists(filePath));

            this.db = new NSQLDatabase(filePath, {
                // for now it breaks
                // threading: true,
                transformBlobs: false
            } as any);
        }

        this.pageRepository = new PageRepository(this.db);
        this.tagRepository = new TagRepository(this.db);
        this.folderRepository = new FolderRepository(this.db);
        this.documentRepository = new DocumentRepository(this.db, this.pageRepository, this.tagRepository, this.folderRepository);
        await this.documentRepository.createTables();
        await this.pageRepository.createTables();
        await this.tagRepository.createTables();
        await this.folderRepository.createTables();

        this.notify({ eventName: 'started' });
        this.started = true;
    }
    async deleteDocuments(documents: OCRDocument[]) {
        DEV_LOG &&
            console.log(
                'deleteDocuments',
                documents.map((d) => d.id)
            );
        // await this.documentRepository.delete(model);
        await Promise.all(documents.map((d) => Promise.all(d.pages.map((p) => this.pageRepository.delete(p)).concat(this.documentRepository.delete(d), d.removeFromFolder()))));
        // await OCRDocument.delete(docs.map((d) => d.id));
        documents.forEach((doc) => doc.removeFromDisk());
        this.notify({ eventName: EVENT_DOCUMENT_DELETED, documents } as DocumentDeletedEventData);
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
