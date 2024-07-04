import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { Application, File, Folder, Utils, View, path } from '@nativescript/core';

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

export async function getImageSize(imagePath: string) {
    return new Promise<{ width: number; height: number; rotation: number }>((resolve, reject) => {
        com.akylas.documentscanner.utils.ImageUtil.Companion.getImageSize(
            Utils.android.getApplicationContext(),
            imagePath,
            new com.akylas.documentscanner.utils.FunctionCallback({
                onResult(e, result) {
                    if (e) {
                        reject(e);
                    } else {
                        resolve({ width: result[0], height: result[1], rotation: result[2] });
                    }
                }
            })
        );
    });
    // const result = com.akylas.documentscanner.utils.ImageUtil.Companion.getImageSize(Utils.android.getApplicationContext(), imagePath);
    // return { width: result[0], height: result[1], rotation: result[2] };
}
