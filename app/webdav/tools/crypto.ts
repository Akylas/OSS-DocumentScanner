import { calculateMD5 } from '@nativescript-community/md5';

export function ha1Compute(algorithm: string, user: string, realm: string, pass: string, nonce: string, cnonce: string, ha1: string): string {
    DEV_LOG && console.log('ha1Compute', user, realm, pass);
    const ha1Hash = ha1 || calculateMD5(`${user}:${realm}:${pass}`);
    if (algorithm && algorithm.toLowerCase() === 'md5-sess') {
        return calculateMD5(`${ha1Hash}:${nonce}:${cnonce}`);
    }
    return ha1Hash;
}
