import { Headers as HeadersSimple } from '../types';

// export function convertResponseHeaders(headers: Headers): HeadersSimple {
//     const output: HeadersSimple = {};
//     for (const key of headers.keys()) {
//         output[key] = headers.get(key);
//     }
//     return output;
// }

export function mergeHeaders(...headerPayloads: HeadersSimple[]): HeadersSimple {
    if (headerPayloads.length === 0) return {};
    const headerKeys = {};
    return headerPayloads.reduce((output: HeadersSimple, headers: HeadersSimple) => {
        Object.keys(headers).forEach((header) => {
            const lowerHeader = header.toLowerCase();
            if (headerKeys.hasOwnProperty(lowerHeader)) {
                output[headerKeys[lowerHeader]] = headers[header];
            } else {
                headerKeys[lowerHeader] = header;
                output[header] = headers[header];
            }
        });
        return output;
    }, {});
}
