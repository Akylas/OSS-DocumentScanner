export * from './utils.common';

export function restartApp() {
    throw new Error('not possible on iOS');
}

export async function copyFolderContent(src: string, dst: string) {
    throw new Error('not implemented on iOS');
}
export async function removeFolderContent(src: string, dst: string) {
    throw new Error('not implemented on iOS');
}
