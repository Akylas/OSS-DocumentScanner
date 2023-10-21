import { ImageAsset, ImageSource } from '@akylas/nativescript';

// type Many<T> = T | T[];
export function pick<T extends object, U extends keyof T>(object: T, ...props: U[]): Pick<T, U> {
    return props.reduce((o, k) => ((o[k] = object[k]), o), {} as any);
}
export function omit<T extends object, U extends keyof T>(object: T, ...props: U[]): Omit<T, U> {
    return Object.keys(object)
        .filter((key) => (props as string[]).indexOf(key) < 0)
        .reduce((newObj, key) => Object.assign(newObj, { [key]: object[key] }), {} as any);
}

export async function loadImage(sourceImagePath) {
    if (__ANDROID__) {
        // we need to use ImageAsset to correctly load images with content:
        // we also need it cause it loads the image "rotated"
        const asset = new ImageAsset(sourceImagePath);
        const bitmap = await new Promise((resolve, reject) => {
            asset.getImageAsync((image, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(image);
                }
            });
        });
        return new ImageSource(bitmap);
    } else {
        return ImageSource.fromFile(sourceImagePath);
    }
}
