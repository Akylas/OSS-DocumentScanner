import { Application, File, Folder, Utils, path } from '@nativescript/core';

export * from './utils.common';

export function restartApp() {
    com.akylas.documentscanner.Utils.Companion.restartApp(Utils.android.getApplicationContext(), Application.android.startActivity);
}

export async function copyFolderContent(src: string, dst: string) {
    const folder = Folder.fromPath(src);
    // ensure we create the folder
    Folder.fromPath(dst);
    if (!Folder.exists(dst)) {
        throw new Error('failed copying folder ' + dst);
    }
    DEV_LOG && console.log('copyFolderContent ', src, dst, Folder.exists(dst));
    return Promise.all(
        (await folder.getEntities()).map((e) => {
            if (e instanceof File) {
                const dstFile = path.join(dst, e.name);
                DEV_LOG && console.log('copyFile ', e.path, dstFile);
                return e.copy(dstFile).then((r) => {
                    if (!File.exists(dstFile)) {
                        throw new Error('failed copying file ' + dstFile);
                    }
                });
            } else {
                const dstFolder = path.join(dst, e.name);
                return copyFolderContent(path.join(src, e.name), dstFolder);
            }
        })
    );
}
export async function removeFolderContent(src: string) {
    const folder = Folder.fromPath(src);
    return Promise.all((await folder.getEntities()).map((e) => e.remove()));
}
