import { toBase64 } from '../tools/encode';
import { AuthHeader } from '../types';

export function generateBasicAuthHeader(username: string, password: string): AuthHeader {
    const encoded = toBase64(`${username}:${password}`);
    return `Basic ${encoded}`;
}
