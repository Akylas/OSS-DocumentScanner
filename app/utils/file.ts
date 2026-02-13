import { File, Folder } from '@nativescript/core';
import { doInBatch } from '@shared/utils/batch';

export async function copyFolderContent(src: string, dst: string) {
    // TODO: native!
    // ensure we create the folder
    const dstFolder = Folder.fromPath(dst);
    if (!Folder.exists(dst)) {
        throw new Error('failed copying folder ' + dst);
    }
    const folder = Folder.fromPath(src, false);
    // DEV_LOG && console.log('copyFolderContent ', src, dst, Folder.exists(dst));
    await doInBatch(
        await folder.getEntities(),
        async (e, index) => {
            // DEV_LOG && console.log('doInBatch ', e.path, e.isFolder);
            if (e.isFolder === true && Folder.exists(e.path)) {
                const newDstFolder = dstFolder.getFolder(e.name, false);
                // DEV_LOG && console.log('copyFolder ', e.name, newDstFolder.path, Folder.exists(e.path));
                await copyFolderContent(e.path, newDstFolder.path);
            } else {
                const dstFile = dstFolder.getFile(e.name, false).path;
                // DEV_LOG && console.log('copyFile ', e.path, dstFile);
                const r = await File.fromPath(e.path).copy(dstFile);
                // DEV_LOG && console.info('copyFile done ', e.path, dstFile, r, File.exists(dstFile));
                if (!File.exists(dstFile)) {
                    throw new Error('failed copying file ' + dstFile);
                }
            }
            // DEV_LOG && console.log('doInBatch done ', src, index);
        },
        2
    );
}
export async function removeFolderContent(src: string, removeTopFolder = false) {
    const folder = Folder.fromPath(src);
    await Promise.all((await folder.getEntities()).map((e) => e.remove()));
    if (removeTopFolder) {
        await folder.remove();
    }
}
