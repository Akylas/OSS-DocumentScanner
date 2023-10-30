import { path } from '@nativescript/core';
import { normalisePath } from './path';

// export function FextractURLPath(fullURL: string): string {
//     const url = new URL(fullURL);
//     let urlPath = url.pathname;
//     if (urlPath.length <= 0) {
//         urlPath = '/';
//     }
//     return normalisePath(urlPath);
// }

// export function joinURL(...parts: string[]): string {
//     return path.join.apply(
//         this,
//         parts.reduce((output, nextPart, partIndex) => {
//             if (partIndex === 0 || nextPart !== '/' || (nextPart === '/' && output[output.length - 1] !== '/')) {
//                 output.push(nextPart);
//             }
//             return output;
//         }, [])
//     );
// }

export function normaliseHREF(href: string): string {
    try {
        const normalisedHref = href.replace(/^https?:\/\/[^\/]+/, '');
        return normalisedHref;
    } catch (err) {
        throw err;
    }
}
