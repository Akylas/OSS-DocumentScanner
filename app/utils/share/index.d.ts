import { Color } from '@nativescript/core';

export interface Content {
    title?: string;
    message?: string;
    image?: ImageSource;
    images?: ImageSource[];
    file?: string;
    files?: string[];
    url?: string;
}
export interface Options {
    mimetype?: string;
    dialogTitle?: string;
    excludedActivityTypes?: string[];
    tintColor?: string | Color;
    subject?: string;
    anchor?: View; //ios only
    appearance?: 'light' | 'dark';
}
export function share(content: Content, options?: Options): Promise<boolean>;
