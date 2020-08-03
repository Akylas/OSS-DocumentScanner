import { ImageSource } from '@nativescript/core';

export function share(
    content: {
        image?: ImageSource;
        title?: string;
        message?: string;
        url?: string;
    },
    options?: {
        dialogTitle?: string;
        excludedActivityTypes?: string[];
        tintColor?: string;
        subject?: string;
        appearance?: 'light' | 'dark';
    }
): Promise<boolean>;
