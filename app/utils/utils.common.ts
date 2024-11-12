import { ApplicationSettings } from '@nativescript/core';
import dayjs from 'dayjs';
import { OCRDocument } from '~/models/OCRDocument';
import { DEFAULT__BATCH_CHUNK_SIZE, FILENAME_DATE_FORMAT, FILENAME_USE_DOCUMENT_NAME, SETTINGS_FILE_NAME_FORMAT, SETTINGS_FILE_NAME_USE_DOCUMENT_NAME } from '~/utils/constants';
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
