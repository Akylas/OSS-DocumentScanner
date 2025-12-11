declare namespace com {
    export namespace nativescript {
        export namespace zip {
            export namespace Zip {
                export namespace ZipCallback {
                    export enum Mode {
                        ZIP,
                        UNZIP
                    }
                }
                export class ZipCallback {
                    constructor(implementation: {
                        onStart: (worker: string, mode: ZipCallback.Mode, totalEntries: number, totalBytes: number) => void;

                        onUnzipComplete: (worker: string, extractedFolder: string) => void;
                        onZipComplete: (worker: string, zipFile: string) => void;
                        onError: (worker: string, e: java.io.Exception, mode: ZipCallback.Mode) => void;
                        onProgress: (
                            worker: string,
                            mode: ZipCallback.Mode,
                            entryIndex: number,
                            totalEntries: number,
                            entryName: string,
                            entryBytesProcessed: number,
                            entrySize: number,
                            totalBytesProcessed: number,
                            totalBytes: number
                        ) => void;
                    });
                    // totalEntries: total number of entries in the archive (files + dirs)
                    // totalBytes: total bytes across entries if known (-1 if unknown)
                    onStart(worker: string, mode: ZipCallback.Mode, totalEntries: number, totalBytes: number): void;

                    onUnzipComplete(worker: string, extractedFolder: string): void;
                    onZipComplete(worker: string, zipFile: string): void;
                    onError(worker: string, e: java.io.Exception, mode: ZipCallback.Mode): void;

                    // entryIndex: current entry index (starting at 1)
                    // totalEntries: total number of entries in the zip/archive
                    // entryName: current entry name (file path)
                    // entryBytesProcessed: bytes written/read for current entry
                    // entrySize: entry size if known (-1 if unknown)
                    // totalBytesProcessed: total bytes written/read so far across all entries
                    // totalBytes: total archive byte size if known (-1 if unknown)
                    onProgress(
                        worker: string,
                        mode: ZipCallback.Mode,
                        entryIndex: number,
                        totalEntries: number,
                        entryName: string,
                        entryBytesProcessed: number,
                        entrySize: number,
                        totalBytesProcessed: number,
                        totalBytes: number
                    ): void;
                }
            }
            export class Zip {
                static unzip(context: globalAndroid.content.Context, zipFile: string, destinationFolder: string, workerIdentifier: string, callback: Zip.ZipCallback): void;
                static zip(
                    context: globalAndroid.content.Context,
                    inputPaths: java.util.List<string>,
                    destinationZip: string,
                    workerIdentifier: string,
                    keepParent: boolean,
                    callback: Zip.ZipCallback
                ): void;
            }
        }
    }
}
