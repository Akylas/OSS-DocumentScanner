import { WebDAVClientContext, WebDAVMethodOptions } from '../types';
import { getStat } from './stat';

export async function exists(context: WebDAVClientContext, remotePath: string, options: WebDAVMethodOptions = {}): Promise<boolean> {
    try {
        await getStat(context, remotePath, options);
        return true;
    } catch (err) {
        if (err.statusCode === 404) {
            return false;
        }
        throw err;
    }
}
