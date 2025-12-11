export interface ZipOptions {
    directory: string;
    archive?: string;
    onProgress?: (progress: number) => void;
    keepParent?: boolean;
    password?: string;
}

export interface UnZipOptions {
    archive: string;
    directory: string;
    onProgress?: (progress: number) => void;
    overwrite?: boolean;
    password?: string;
}
export * from './index.android';
