import { isArrayBuffer } from '../compat/arrayBuffer';
import { isBuffer } from '../compat/buffer';
import { Headers, RequestDataPayload } from '../types';

export function requestDataToFetchBody(data: RequestDataPayload): [any, Headers] {

    if (typeof data === 'string') {
        return [data, {}];
    } else if (isBuffer(data)) {
        return [data as Buffer, {}];
    } else if (isArrayBuffer(data)) {
        return [data as ArrayBuffer, {}];
    } else if (data && typeof data === 'object') {
        return [
            JSON.stringify(data as Record<string, any>),
            {
                'content-type': 'application/json'
            }
        ];
    }
    throw new Error(`Unable to convert request body: Unexpected body type: ${typeof data}`);
}
