import { DEFAULT__BATCH_CHUNK_SIZE } from '~/utils/constants';

function chunk<T>(array: T[], size) {
    return Array.from<T, T[]>({ length: Math.ceil(array.length / size) }, (value, index) => array.slice(index * size, index * size + size));
}

export async function doInBatch<T, U>(array: T[], handler: (T, index: number) => Promise<U>, chunkSize: number = DEFAULT__BATCH_CHUNK_SIZE) {
    const chunks = chunk(array, chunkSize);
    const result: U[] = [];
    // we use allSettled to wait for all even if one failed
    // that way we are sure we are finished on error and we can handle things correctly
    const promises = chunks.map((s, i) => () => Promise.allSettled(s.map((value, j) => handler(value, i * chunkSize + j))));
    for (let index = 0; index < promises.length; index++) {
        const subResult = await promises[index]();
        const firstError = subResult.find((s) => s.status === 'rejected')?.['reason'];
        if (firstError) {
            throw firstError;
        }
        const values: U[] = subResult.map((s) => s['value']);
        result.push(...values);
    }
    return result;
}

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}
