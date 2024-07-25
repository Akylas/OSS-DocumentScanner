import { type BaseSyncService } from './BaseSyncService';

export type SYNC_TYPES = 'webdav_data' | 'folder_image' | 'folder_pdf' | 'webdav_image' | 'webdav_pdf';
export const SERVICES_SYNC_MASK: { [key in SYNC_TYPES]: number } = {
    webdav_data: 1 << 2,
    folder_image: 1 << 3,
    folder_pdf: 1 << 4,
    webdav_image: 1 << 5,
    webdav_pdf: 1 << 6
};
export const SERVICES_SYNC_COLOR: { [key in SYNC_TYPES]: string } = {
    webdav_pdf: '#8293CE',
    webdav_image: '#C2EF1F',
    webdav_data: '#BC768B',
    folder_image: '#C18F4E',
    folder_pdf: '#4CA49D'
};

export enum SyncType {
    DATA = 1 << 2,
    IMAGE = 1 << 3,
    PDF = 1 << 4,
    ALL = 0
}

export function getRemoteDeleteDocumentSettingsKey(s: BaseSyncService) {
    return s.type + '_docs_to_remove_remote';
}
