import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { ApplicationSettings, ImageAsset, ImageSource } from '@nativescript/core';
import { SDK_VERSION, copyToClipboard } from '@nativescript/core/utils';
import dayjs from 'dayjs';
import { lc } from '~/helpers/locale';
import type { OCRDocument } from '~/models/OCRDocument';

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}

import { FILENAME_DATE_FORMAT, FILENAME_USE_DOCUMENT_NAME } from '~/utils/constants';

export function cleanFilename(str) {
    return str.replace(/[|?*<\":>+\[\]'"]+/g, '').replace(/[\\\s\t\n\/]+/g, '_');
}
export function getFormatedDateForFilename(value?: number, dateFormat = ApplicationSettings.getString('filename_date_format', FILENAME_DATE_FORMAT), clean = true) {
    const now = dayjs(value);

    DEV_LOG && console.log('getFormatedDateForFilename', value, now, dateFormat, now.valueOf(), now.toISOString(), now.format(dateFormat));
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
export function getFileNameForDocument(document?: OCRDocument) {
    const useDocumentName = ApplicationSettings.getBoolean('filename_use_document_name', FILENAME_USE_DOCUMENT_NAME);
    if (useDocumentName && document?.name) {
        return cleanFilename(document.name);
    }
    return getFormatedDateForFilename();
}
