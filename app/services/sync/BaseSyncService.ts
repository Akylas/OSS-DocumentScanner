import { ApplicationSettings, Color, Observable } from '@nativescript/core';
import type { DocumentEvents } from '~/services/documents';
import { SYNC_TYPES, SyncTypes } from '~/services/sync/types';
import { SETTINGS_SYNC_SERVICES } from '~/utils/constants';

export interface BaseSyncServiceOptions {
    id?: number;
    type: SyncTypes;
    autoSync?: boolean;
    enabled?: boolean;
    color?: string | Color;
}

export function getStoredSyncServices() {
    return JSON.parse(ApplicationSettings.getString(SETTINGS_SYNC_SERVICES, '[]')) as (BaseSyncServiceOptions & { id?: number; type: SyncTypes })[];
}

const singletons: { [k: string]: BaseSyncService } = {};
export abstract class BaseSyncService extends Observable {
    abstract type: string;
    abstract syncMask: number;
    id: number = Date.now();
    autoSync = false;
    enabled = true;
    color?: string | Color;
    static getEnabledServices() {
        return Object.values(singletons);
    }
    static start(data?: Record<string, any>) {}
    public static getOrCreateInstance<T extends BaseSyncService>(this: new () => T) {
        // we use static id because prototype.constructor.name might not be uniq when uglified
        const key = this['type'];
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
        // we use static id because prototype.constructor.name might not be uniq when uglified
        delete singletons[this['type']];
    }
    abstract stop();
    abstract shouldSync(force?: boolean, event?: DocumentEvents);

    updateSettings(data) {
        Object.assign(this, data);
        const syncServices = getStoredSyncServices();
        const index = syncServices.findIndex((s) => s.id === this.id);
        // DEV_LOG && console.log('BaseSyncService', 'updateSettings', index, JSON.stringify(data));
        if (index !== -1) {
            const currentSettins = syncServices[index];
            Object.assign(currentSettins, data);
            // syncServices.splice(index, 1, currentSettins);
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
    }
}
