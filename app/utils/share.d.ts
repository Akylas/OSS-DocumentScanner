export function share(
    content: {
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
