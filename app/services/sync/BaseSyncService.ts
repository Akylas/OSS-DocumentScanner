import { hasExactAlarmPermission, requestExactAlarmPermission } from '@nativescript-community/perms';
import { Color, Observable } from '@nativescript/core';
import { DocumentEvents } from '~/services/documents';

export async function checkAlarmPermission(throttleDuration) {
    if (throttleDuration > 0) {
        if (!hasExactAlarmPermission()) {
            return requestExactAlarmPermission();
        }
    }
    return true;
}

export interface BaseSyncServiceOptions {
    autoSync?: boolean;
    enabled?: boolean;
    color?: string | Color;
    syncThrottleSeconds?: number;
}

const singletons: { [k: string]: BaseSyncService } = {};
export abstract class BaseSyncService extends Observable {
    abstract type: string;
    abstract syncMask: number;
    id: number = Date.now();
    autoSync = false;
    enabled = true;
    color?: string | Color;
    syncThrottleSeconds?: number;
    static getEnabledServices() {
        return Object.values(singletons);
    }
    static start(data?: Record<string, any>) {}
    public static getOrCreateInstance<T extends BaseSyncService>(this: new () => T) {
        // we use static id because prototype.constructor.name might not be uniq when uglified
        const key = this['type'];
        DEV_LOG && console.log('BaseSyncService', 'getOrCreateInstance', key, !!singletons[key]);
        if (!singletons[key]) {
            singletons[key] = new this();
        }
        return singletons[key] as T;
    }
    public static getInstance<T extends BaseSyncService>(this: new () => T) {
        // we use static id because prototype.constructor.name might not be uniq when uglified
        return singletons[this['type']] as T;
    }
    public static destroyInstance<T extends BaseSyncService>(this: new () => T) {
        DEV_LOG && console.log('BaseSyncService', 'destroyInstance', this['type'], !!singletons[this['type']]);
        // we use static id because prototype.constructor.name might not be uniq when uglified
        delete singletons[this['type']];
    }
    abstract stop();
    abstract shouldSync(force?: boolean, event?: DocumentEvents);
}
