import { setWorkerContextValue } from '@akylas/nativescript-app-utils';
import { lc } from '@nativescript-community/l';
import { ApplicationSettings, EventData, Observable } from '@nativescript/core';
import { time } from '@nativescript/core/profiling';
import { debounce } from '@nativescript/core/utils';
import { CustomError } from '@shared/utils/error';
import { showError } from '@shared/utils/showError';
import { writable } from 'svelte/store';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import {
    EVENT_DOCUMENT_ADDED,
    EVENT_DOCUMENT_DELETED,
    EVENT_DOCUMENT_MOVED_FOLDER,
    EVENT_DOCUMENT_PAGES_ADDED,
    EVENT_DOCUMENT_PAGE_UPDATED,
    EVENT_DOCUMENT_UPDATED,
    EVENT_FOLDER_ADDED,
    EVENT_FOLDER_UPDATED,
    EVENT_STATE,
    EVENT_SYNC_STATE,
    SETTINGS_SYNC_SERVICES
} from '~/utils/constants';
import { timeout } from '~/utils/ui';
import Queue from '~/workers/queue';
import type SyncWorker from '~/workers/SyncWorker';
import type { WorkerEventType } from '~/workers/SyncWorker';
import { DocumentAddedEventData, DocumentDeletedEventData, DocumentEvents, DocumentPagesAddedEventData, DocumentUpdatedEventData, FolderUpdatedEventData, documentsService } from './documents';
import { SYNC_TYPES, SyncType, getRemoteDeleteDocumentSettingsKey } from './sync/types';
import { WebdavDataSyncOptions } from './sync/WebdavDataSyncService';

export const syncServicesStore = writable([]);

const SETTINGS_KEY = 'webdav_config';

export function findArrayDiffs<S, T>(array1: S[], array2: T[], compare: (a: S, b: T) => boolean) {
    const union: S[] = [];
    array1 = Array.from(array1);
    array2 = Array.from(array2);
    for (let i = 0; i < array1.length; i++) {
        const a = array1[i];
        for (let j = 0; j < array2.length; j++) {
            const b = array2[j];
            if (compare(a, b)) {
                union.push(a);
                array1.splice(i, 1);
                array2.splice(j, 1);
                i--;
                break;
            }
        }
    }
    return {
        toBeAdded: array2,
        toBeDeleted: array1,
        union
    };
}

export const SERVICES_SYNC_TITLES: { [key in SYNC_TYPES]: string } = {
    webdav_image: lc('webdav_server'),
    webdav_pdf: lc('webdav_server'),
    webdav_data: lc('webdav_server'),
    folder_image: lc('local_folder'),
    folder_pdf: lc('local_folder')
};

export interface SyncStateEventData extends EventData {
    state: 'finished' | 'running';
}
export interface SyncEnabledEventData extends EventData {
    enabled: boolean;
}

const SYNC_DELAY = 1000;

function debounceSync(fn, delay = 300, { ignoreFirstTrail = false, leading = false, trailing = true } = {}) {
    let timer;
    return (event) => {
        let noTrail = false;
        if (timer === undefined && leading) {
            noTrail = ignoreFirstTrail === true;
            fn.call(this, event);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (trailing !== false && !noTrail) {
                syncService.syncDocuments({ force: true });
            }
            timer = undefined;
        }, delay);
    };
}

export class SyncService extends Observable {
    services: any[] = [];
    onDocumentAdded(event: DocumentAddedEventData) {
        DEV_LOG && console.log('SYNC', 'onDocumentAdded');
        this.syncDocumentsInternal({ event, type: SyncType.DATA | SyncType.PDF, fromEvent: event.eventName });
    }
    onDocumentDeleted(event: DocumentDeletedEventData) {
        DEV_LOG && console.log('SYNC', 'onDocumentDeleted');

        this.getStoredSyncServices()
            // .filter((s) => s instanceof BaseDataSyncService)
            .forEach(async (service) => {
                const key = getRemoteDeleteDocumentSettingsKey(service as any);
                const documentsToDeleteOnRemote = JSON.parse(ApplicationSettings.getString(key, '[]'));
                documentsToDeleteOnRemote.push(...event.documents.map((d) => d.id));
                ApplicationSettings.setString(key, JSON.stringify(documentsToDeleteOnRemote));
            });
        this.sendDataEvent(event);
    }
    onDocumentUpdated(event: DocumentUpdatedEventData) {
        // only used for data sync
        DEV_LOG && console.log('SYNC', 'onDocumentUpdated', event.updateModifiedDate);
        if (event.updateModifiedDate !== false) {
            this.syncDocumentsInternal({ event, type: SyncType.DATA | SyncType.PDF, fromEvent: event.eventName });
        }
    }
    sendImageEvent(event: DocumentPagesAddedEventData) {
        DEV_LOG && console.log('Sync', 'sendImageEvent');
        // only used for image sync
        this.syncDocumentsInternal({ event, type: SyncType.IMAGE, fromEvent: event.eventName });
    }
    sendDataEvent(event: FolderUpdatedEventData) {
        this.syncDocumentsInternal({ event, type: SyncType.DATA, fromEvent: event.eventName });
    }
    get enabled() {
        return this.services?.length > 0;
    }

    getStoredSyncServices() {
        return JSON.parse(ApplicationSettings.getString(SETTINGS_SYNC_SERVICES, '[]')) as (WebdavDataSyncOptions & { id?: number; type: SYNC_TYPES })[];
    }

    addService(type: SYNC_TYPES, data) {
        const syncServices = this.getStoredSyncServices();
        const dataToAdd = { type, id: Date.now(), ...data };
        syncServices.push(dataToAdd);
        ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        DEV_LOG && console.log('Sync', 'addService', type, JSON.stringify(data));
        if (!this.enabled) {
            this.start();
        } else {
            this.onServiceChanged();
        }
        return dataToAdd;
    }
    removeService(data) {
        const syncServices = this.getStoredSyncServices();
        const index = syncServices.findIndex((s) => s.id === data.id);
        DEV_LOG && console.log('Sync', 'removeService', index, JSON.stringify(data));
        if (index !== -1) {
            syncServices.splice(index, 1);
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
        this.onServiceChanged();
        return true;
    }
    updateService(data) {
        const syncServices = this.getStoredSyncServices();
        const index = syncServices.findIndex((s) => s.id === data.id);
        DEV_LOG && console.log('Sync', 'updateService', index, JSON.stringify(data));
        if (index !== -1) {
            syncServices.splice(index, 1, data);
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
        this.onServiceChanged(true);
        return true;
        // }
    }
    async start() {
        if (this.enabled) {
            return;
        }
        const syncServices = (this.services = this.getStoredSyncServices().filter((s) => s.enabled !== false));
        DEV_LOG && console.log('Sync', 'start', syncServices);
        // bring back old data config
        const configStr = ApplicationSettings.getString(SETTINGS_KEY);
        if (configStr) {
            // TODO: remove this after a few releases
            ApplicationSettings.remove(SETTINGS_KEY);
            syncServices.push({ type: 'webdav_data', id: Date.now(), ...JSON.parse(configStr) });
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
        syncServicesStore.set(syncServices);
        DEV_LOG && console.log('Sync', 'start', /* this.services.length,  */ this.enabled);
        if (this.enabled) {
            this.notify({ eventName: EVENT_STATE, enabled: this.enabled } as SyncEnabledEventData);
            documentsService.on(EVENT_DOCUMENT_ADDED, this.onDocumentAdded, this);
            documentsService.on(EVENT_DOCUMENT_UPDATED, this.onDocumentUpdated, this);
            documentsService.on(EVENT_DOCUMENT_DELETED, this.onDocumentDeleted, this);
            documentsService.on(EVENT_DOCUMENT_PAGE_UPDATED, this.sendImageEvent, this);
            documentsService.on(EVENT_DOCUMENT_PAGES_ADDED, this.sendImageEvent, this);
            documentsService.on(EVENT_DOCUMENT_MOVED_FOLDER, this.sendDataEvent, this);
            documentsService.on(EVENT_FOLDER_UPDATED, this.sendDataEvent, this);
            documentsService.on(EVENT_FOLDER_ADDED, this.sendDataEvent, this);
            DEV_LOG && console.log('SyncService', 'start');
        }
    }
    async stop() {
        DEV_LOG && console.log('Sync', 'stop');
        documentsService.off(EVENT_DOCUMENT_ADDED, this.onDocumentAdded, this);
        documentsService.off(EVENT_DOCUMENT_UPDATED, this.onDocumentUpdated, this);
        documentsService.off(EVENT_DOCUMENT_DELETED, this.onDocumentDeleted, this);
        documentsService.off(EVENT_DOCUMENT_PAGE_UPDATED, this.sendImageEvent, this);
        documentsService.off(EVENT_DOCUMENT_PAGES_ADDED, this.sendImageEvent, this);
        documentsService.off(EVENT_DOCUMENT_MOVED_FOLDER, this.sendDataEvent, this);
        documentsService.off(EVENT_FOLDER_UPDATED, this.sendDataEvent, this);
        documentsService.off(EVENT_FOLDER_ADDED, this.sendDataEvent, this);
        if (this.syncRunning) {
            // if sync is running wait for it to be finished
            await new Promise((resolve) => this.once(EVENT_SYNC_STATE, resolve));
        }
    }
    onServiceChanged(force = false) {
        const services = this.getStoredSyncServices().filter((s) => s.enabled !== false);
        this.services = services;
        syncServicesStore.set(services);
    }

    syncRunning = false;

    syncDocuments = debounce(
        async ({
            bothWays = false,
            force = true,
            type = SyncType.ALL
        }: {
            force?;
            bothWays?;
            type?: number;
        } = {}) => {
            this.syncDocumentsInternal({ force, bothWays, type });
        },
        SYNC_DELAY
    );
    worker: SyncWorker;
    messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: number }[] } = {};

    async onWorkerMessage(event: {
        data: {
            id?: number;
            type: WorkerEventType;
            messageData?: string;
            nativeDatas?: { [k: string]: any };
        };
    }) {
        // DEV_LOG && console.log('onWorkerMessage', event);
        const data = event.data;
        const id = data.id;
        try {
            let messageData = data.messageData;
            if (typeof messageData === 'string') {
                try {
                    messageData = JSON.parse(messageData);
                } catch (error) {}
            }
            // DEV_LOG && console.error(TAG, 'onWorkerMessage', id, data.type, id && this.messagePromises.hasOwnProperty(id), Object.keys(this.messagePromises), messageData);
            if (id && this.messagePromises.hasOwnProperty(id)) {
                this.messagePromises[id].forEach(function (executor) {
                    executor.timeoutTimer && clearTimeout(executor.timeoutTimer);
                    executor.resolve(messageData);
                });
                delete this.messagePromises[id];
            }
            const eventData = messageData as any;
            switch (data.type) {
                case 'event':
                    // DEV_LOG && console.info('worker event', documentsService.id, eventData.eventName, eventData.target, !!eventData.object, Object.keys(eventData));
                    if (eventData.target === 'documentsService') {
                        if (eventData.doc) {
                            eventData.doc = OCRDocument.fromJSON(eventData.doc);
                        }
                        if (eventData.documents) {
                            eventData.documents = eventData.documents.map((d) => OCRDocument.fromJSON(d));
                        }
                        if (eventData.pages) {
                            eventData.pages = eventData.pages.map((d) => OCRPage.fromJSON(d));
                        }
                        if (eventData.object?.id === eventData.doc?.id) {
                            eventData.object = eventData.doc;
                        } else {
                            delete eventData.object;
                        }
                        // DEV_LOG && console.info('worker notifying event', documentsService.id, eventData.eventName, documentsService.notify);
                        documentsService.notify({ ...eventData, object: eventData.object || documentsService });
                    } else {
                        this.notify({ ...eventData });
                    }
                    break;

                case 'error':
                    showError(CustomError.fromObject(eventData.error));
                    break;

                case 'terminate':
                    DEV_LOG && console.info('worker stopped');
                    this.worker = null;
                    break;
            }
        } catch (error) {
            console.error(error, error.stack);
            showError(error);
        }
    }
    queue = new Queue();
    async internalSendMessageToWorker(data) {
        this.queue.add(async () => {
            if (!this.worker) {
                const worker = (this.worker = new Worker('~/workers/SyncWorkerBootstrap') as any);
                worker.onmessage = this.onWorkerMessage.bind(this);
            }
            // DEV_LOG && console.log('internalSendMessageToWorker', Date.now());
            this.worker.postMessage(data);
            // it seems that without the timeout consecutive send does not work
            await timeout(150);
        });
    }
    async sendMessageToWorker<T = any>(type: string, messageData?, id?: number, error?, isResponse = false, timeout = 0, nativeData?): Promise<T> {
        // DEV_LOG && console.info('Sync', 'sendMessageToWorker', type, id, timeout, isResponse, !isResponse && (id || timeout), messageData, nativeData, this.worker);
        if (!isResponse && (id || timeout)) {
            return new Promise((resolve, reject) => {
                // const id = Date.now().valueOf();
                id = id || time();
                this.messagePromises[id] = this.messagePromises[id] || [];
                let timeoutTimer;
                if (timeout > 0) {
                    timeoutTimer = setTimeout(() => {
                        // we need to try catch because the simple fact of creating a new Error actually throws.
                        // so we will get an uncaughtException
                        try {
                            reject(new Error('timeout'));
                        } catch {}
                        delete this.messagePromises[id];
                    }, timeout);
                }
                this.messagePromises[id].push({ reject, resolve, timeoutTimer });
                const keys = Object.keys(nativeData);
                const nativeDataKeysPrefix = Date.now() + '$$$';
                keys.forEach((k) => {
                    setWorkerContextValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
                });
                const data = {
                    error: !!error ? JSON.stringify(error.toJSON() ? error.toJSON() : { message: error.toString(), ...error }) : undefined,
                    id,
                    nativeDataKeysPrefix,
                    messageData: !!messageData ? JSON.stringify(messageData) : undefined,
                    nativeData: keys.map((k) => nativeDataKeysPrefix + k),
                    type
                };
                // DEV_LOG && console.info('Sync', 'postMessage', JSON.stringify(data));

                this.internalSendMessageToWorker(data);
            });
        } else {
            // DEV_LOG && console.info('Sync', 'postMessage', 'test');
            const keys = Object.keys(nativeData);
            const nativeDataKeysPrefix = Date.now() + '$$$';
            keys.forEach((k) => {
                setWorkerContextValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
            });
            const data = {
                error: !!error ? JSON.stringify({ message: error.toString(), ...error }) : undefined,
                id,
                nativeDataKeysPrefix,
                messageData: !!messageData ? JSON.stringify(messageData) : undefined,
                nativeData: keys.map((k) => nativeDataKeysPrefix + k),
                type
            };
            // DEV_LOG && console.info('Sync', 'postMessage', JSON.stringify(data));
            this.internalSendMessageToWorker(data);
        }
    }
    async syncDocumentsInternal({
        bothWays = false,
        event,
        force = false,
        fromEvent,
        type
    }: {
        force?;
        bothWays?;
        type?: number;
        fromEvent?: string;
        event?: DocumentEvents;
    } = {}) {
        try {
            const db = documentsService.db?.db?.db;
            if (!this.enabled || !db) {
                return;
            }
            // send syncState event right now for the UI to be updated as soon as possible
            this.notify({ eventName: EVENT_SYNC_STATE, state: 'running' } as SyncStateEventData);
            // DEV_LOG && console.warn('syncDocumentsInternal', type, fromEvent);
            let eventData;
            if (event) {
                const { object, ...otherProps } = event;
                if (object?.['toJSONObject']) {
                    eventData = { ...otherProps, object: event.object['toJSONObject']?.() };
                } else {
                    eventData = otherProps;
                }
            }
            await this.sendMessageToWorker(
                'sync',
                {
                    force,
                    bothWays,
                    type,
                    event: eventData
                },
                undefined,
                undefined,
                false,
                0,
                { db: documentsService.db.db.db }
            );
        } catch (error) {
            DEV_LOG && console.error(error);
            showError(error);
        }
    }
}
export const syncService = new SyncService();
