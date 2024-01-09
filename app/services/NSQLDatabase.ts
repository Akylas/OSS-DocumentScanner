import SqlQuery from 'kiss-orm/dist/Queries/SqlQuery';
import DatabaseInterface from 'kiss-orm/dist/Databases/DatabaseInterface';
import migrate from 'kiss-orm/dist/Databases/Common/migrate';
import { SQLiteDatabase, openOrCreate } from '@nativescript-community/sqlite';

function formatIdentifier(i: string): string {
    return i;
}

export default class NSQLDatabase implements DatabaseInterface {
    db: SQLiteDatabase;
    constructor(
        filePath: string,
        options?: {
            threading?: boolean;
            flags?: number;
        }
    ) {
        this.db = openOrCreate(filePath, options);
    }

    async disconnect(): Promise<void> {
        return this.db.close();
    }

    indexToPlaceholder(i: number): string {
        return '?';
    }

    async query(query: SqlQuery): Promise<any[]> {
        const compiledQuery = query.compile(this.indexToPlaceholder, formatIdentifier);
        const sqlQuery = compiledQuery.sql.trim();
        const result = await this.db.select(sqlQuery, compiledQuery.params);
        return result as any[];
    }
    async sequence<T>(sequence: (sequenceDb: NSQLDatabase) => Promise<T>): Promise<T> {
        return sequence(this);
    }

    async migrate(migrations: { [key: string]: SqlQuery }) {
        await migrate(this, migrations);
    }

    async insertAndGet(standardInsertQuery: SqlQuery): Promise<number[] | string[] | any[]> {
        const compiledQuery = standardInsertQuery.compile(this.indexToPlaceholder, formatIdentifier);
        const sqlQuery = compiledQuery.sql.trim();
        let result = await this.db.execute(sqlQuery, compiledQuery.params);
        // console.info('insertAndGet', sqlQuery, compiledQuery.params, result);
        if (!result) {
            // create await an array result.
            result = [undefined];
        }
        return result as any[];
    }

    async updateAndGet(standardUpdateQuery: SqlQuery): Promise<null | any[]> {
        return this.insertAndGet(standardUpdateQuery);
    }
}
