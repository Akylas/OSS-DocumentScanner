import { translateDiskSpace } from './dav';
import { DAVResult, DiskQuota } from '../types';

export function parseQuota(result: DAVResult): DiskQuota | null {
    try {
        const [responseItem] = result.multistatus.response;
        const {
            propstat: {
                prop: { 'quota-used-bytes': quotaUsed, 'quota-available-bytes': quotaAvail }
            }
        } = responseItem;
        return typeof quotaUsed !== 'undefined' && typeof quotaAvail !== 'undefined'
            ? {
                  used: parseInt(quotaUsed, 10),
                  available: translateDiskSpace(quotaAvail)
              }
            : null;
    } catch (err) {
        /* ignore */
    }
    return null;
}
