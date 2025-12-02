import { l, lc } from '@nativescript-community/l';
import { MultiResult, Permissions, Status, isPermResultAuthorized, openSettings, request } from '@nativescript-community/perms';
import { confirm } from '@nativescript-community/ui-material-dialogs';
import { ApplicationSettings } from '@nativescript/core';
import { SDK_VERSION } from '@nativescript/core/utils';
import { IgnoreError, PermissionError } from '@shared/utils/error';
import dayjs from 'dayjs';
import { OCRDocument } from '~/models/OCRDocument';
import { FILENAME_DATE_FORMAT, FILENAME_USE_DOCUMENT_NAME, SETTINGS_FILE_NAME_FORMAT, SETTINGS_FILE_NAME_USE_DOCUMENT_NAME } from '~/utils/constants';
export { restartApp } from '@akylas/nativescript-app-utils';

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}

export function cleanFilename(str) {
    return str.replace(/[|?*<\":>+\[\]'"]+/g, '').replace(/[\\\s\t\n\/]+/g, '_');
}
export function getFormatedDateForFilename(value?: number, dateFormat = ApplicationSettings.getString(SETTINGS_FILE_NAME_FORMAT, FILENAME_DATE_FORMAT), clean = true) {
    const now = dayjs(value);

    // DEV_LOG && console.log('getFormatedDateForFilename', value, now, dateFormat, now.valueOf(), now.toISOString(), now.format(dateFormat));
    let result: string;
    switch (dateFormat.trim()) {
        case 'timestamp':
            result = now.valueOf() + '';
            break;
        case 'iso':
            result = now.toISOString();
            break;
        default:
            result = now.format(dateFormat);
            break;
    }
    return clean ? cleanFilename(result) : result;
}

export function getFileNameForDocument(
    document?: OCRDocument,
    useDocumentName = ApplicationSettings.getBoolean(SETTINGS_FILE_NAME_USE_DOCUMENT_NAME, FILENAME_USE_DOCUMENT_NAME),
    date?: number,
    dateFormat?: string
) {
    if (useDocumentName === true && document?.name) {
        return cleanFilename(document.name);
    }
    return getFormatedDateForFilename(date, dateFormat);
}

export function getRealPath(src: string) {
    return src;
}

export function isPermResultNeverAskAgain(r: MultiResult | Status) {
    const statusCheck = __IOS__ ? Status.Denied : Status.NeverAskAgain;
    if (typeof r === 'object') {
        const denied = Object.keys(r).some((s) => r[s] === statusCheck);
        return denied;
    }
    return r === statusCheck;
}

export async function requestPermission(perm: Permissions, errorMessage: string) {
    const result = await request(perm);
    if (isPermResultNeverAskAgain(result)) {
        const showSetting = await confirm({
            title: lc('permission_denied'),
            message: errorMessage,
            iosForceClosePresentedViewController: true, //ensure error popup is always showing
            okButtonText: l('open_settings'),
            cancelButtonText: l('cancel')
        });
        if (showSetting) {
            await openSettings();
        } else {
            throw new IgnoreError();
        }
    } else if (!isPermResultAuthorized(result)) {
        throw new PermissionError(errorMessage);
    }
}

export async function requestCameraPermission() {
    return requestPermission('camera', lc('camera_permission_needed'));
}

export async function requestStoragePermission() {
    if (__ANDROID__ && SDK_VERSION <= 29) {
        return requestPermission('storage', lc('storage_permission_needed'));
    }
}

export async function requestPhotoPermission() {
    return requestPermission('photo', lc('media_library_permission_needed'));
}
export async function requestGalleryPermission() {
    return requestPermission('mediaLibrary', lc('media_library_permission_needed'));
}
