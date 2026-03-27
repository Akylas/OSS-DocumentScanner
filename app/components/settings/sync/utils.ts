import { SyncTypes } from '~/services/sync/types';
import type FolderImageSyncSettings__SvelteComponent_ from '~/components/settings/sync/local/FolderImageSyncSettings.svelte';
import type FolderPDFSyncSettings__SvelteComponent_ from '~/components/settings/sync/local/FolderPDFSyncSettings.svelte';
import type WebdavImageSyncSettings__SvelteComponent_ from '~/components/settings/sync/webdav/WebdavImageSyncSettings.svelte';
import type WebdavPDFSyncSettings__SvelteComponent_ from '~/components/settings/sync/webdav/WebdavPDFSyncSettings.svelte';
import type WebdavDataSyncSettings__SvelteComponent_ from '~/components/settings/sync/webdav/WebdavDataSyncSettings.svelte';
import type OneDriveDataSyncSettings__SvelteComponent_ from '~/components/settings/sync/onedrive/OneDriveDataSyncSettings.svelte';
import type OneDrivePDFSyncSettings__SvelteComponent_ from '~/components/settings/sync/onedrive/OneDrivePDFSyncSettings.svelte';
import type OneDriveImageSyncSettings__SvelteComponent_ from '~/components/settings/sync/onedrive/OneDriveImageSyncSettings.svelte';
import type GoogleDriveImageSyncSettings__SvelteComponent_ from '~/components/settings/sync/gdrive/GoogleDriveImageSyncSettings.svelte';
import type GoogleDrivePDFSyncSettings__SvelteComponent_ from '~/components/settings/sync/gdrive/GoogleDrivePDFSyncSettings.svelte';
import type GoogleDriveDataSyncSettings__SvelteComponent_ from '~/components/settings/sync/gdrive/GoogleDriveDataSyncSettings.svelte';

interface SettingsComponentReturnType {
        [SyncTypes.folder_image]: typeof FolderImageSyncSettings__SvelteComponent_;
        [SyncTypes.folder_pdf]: typeof FolderPDFSyncSettings__SvelteComponent_;
        [SyncTypes.webdav_data]: typeof WebdavDataSyncSettings__SvelteComponent_;
        [SyncTypes.webdav_image]: typeof WebdavImageSyncSettings__SvelteComponent_;
        [SyncTypes.webdav_pdf]: typeof WebdavPDFSyncSettings__SvelteComponent_;
        [SyncTypes.onedrive_data]: typeof OneDriveDataSyncSettings__SvelteComponent_;
        [SyncTypes.onedrive_image]: typeof OneDriveImageSyncSettings__SvelteComponent_;
        [SyncTypes.onedrive_pdf]: typeof OneDrivePDFSyncSettings__SvelteComponent_;
        [SyncTypes.gdrive_data]: typeof GoogleDriveDataSyncSettings__SvelteComponent_;
        [SyncTypes.gdrive_image]: typeof GoogleDriveImageSyncSettings__SvelteComponent_;
        [SyncTypes.gdrive_pdf]: typeof GoogleDrivePDFSyncSettings__SvelteComponent_;
    }
    async function getSettingsComponent<T extends SyncTypes>(syncType: T): Promise<SettingsComponentReturnType[T]> {
        switch (syncType) {
            case SyncTypes.folder_image:
                return (await import('~/components/settings/sync/local/FolderImageSyncSettings.svelte')).default as any;
            case 'folder_pdf':
                return (await import('~/components/settings/sync/local/FolderPDFSyncSettings.svelte')).default;
            case 'webdav_data':
                return (await import('~/components/settings/sync/webdav/WebdavDataSyncSettings.svelte')).default;
            case 'webdav_image':
                return (await import('~/components/settings/sync/webdav/WebdavImageSyncSettings.svelte')).default;
            case 'webdav_pdf':
                return (await import('~/components/settings/sync/webdav/WebdavPDFSyncSettings.svelte')).default;
            case 'onedrive_data':
                return (await import('~/components/settings/sync/onedrive/OneDriveDataSyncSettings.svelte')).default;
            case 'onedrive_image':
                return (await import('~/components/settings/sync/onedrive/OneDriveImageSyncSettings.svelte')).default;
            case 'onedrive_pdf':
                return (await import('~/components/settings/sync/onedrive/OneDrivePDFSyncSettings.svelte')).default;
            case 'gdrive_data':
                return (await import('~/components/settings/sync/gdrive/GoogleDriveDataSyncSettings.svelte')).default;
            case 'gdrive_image':
                return (await import('~/components/settings/sync/gdrive/GoogleDriveImageSyncSettings.svelte')).default;
            case 'gdrive_pdf':
                return (await import('~/components/settings/sync/gdrive/GoogleDrivePDFSyncSettings.svelte')).default;
        }
    }