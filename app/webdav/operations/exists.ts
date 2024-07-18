import { getStat } from './stat';
import { WebDAVClientContext, WebDAVMethodOptions } from '../types';

export async function exists(context: WebDAVClientContext, remotePath: string, options: WebDAVMethodOptions = {}): Promise<boolean> {
    DEV_LOG && console.log('exists');
    try {
        await getStat(context, remotePath, options);
        DEV_LOG && console.log('exists done');
        return true;
    } catch (err) {
        DEV_LOG && console.log('exists error', err, Object.keys(err));
        if (err.statusCode === 404) {
            return false;
        }
        throw err;
    }
}
