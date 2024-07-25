import { ApplicationSettings, EventData, Observable } from '@nativescript/core';
import { time } from '@nativescript/core/profiling';
import { debounce } from '@nativescript/core/utils';
import { writable } from 'svelte/store';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import {
    EVENT_DOCUMENT_ADDED,
    EVENT_DOCUMENT_DELETED,
    EVENT_DOCUMENT_PAGES_ADDED,
    EVENT_DOCUMENT_PAGE_UPDATED,
    EVENT_DOCUMENT_UPDATED,
    EVENT_STATE,
    EVENT_SYNC_STATE,
    SETTINGS_SYNC_SERVICES
} from '~/utils/constants';
import { CustomError } from '~/utils/error';
import { showError } from '~/utils/showError';
import SyncWorker, { WorkerEventType } from '~/workers/SyncWorker';
import { DocumentAddedEventData, DocumentDeletedEventData, DocumentEvents, DocumentPageUpdatedEventData, DocumentPagesAddedEventData, DocumentUpdatedEventData, documentsService } from './documents';
import { SYNC_TYPES, SyncType, getRemoteDeleteDocumentSettingsKey } from './sync/types';
import { WebdavDataSyncOptions } from './sync/WebdavDataSyncService';
import { lc } from '@nativescript-community/l';

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

function debounceSync(fn, delay = 300, { leading = false, trailing = true, ignoreFirstTrail = false } = {}) {
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
    // autoSync = AUTO_SYNC;

    // syncServices: BaseDataSyncService[];
    services: any[] = [];
    onDocumentAdded(event: DocumentAddedEventData) {
        // only used for data sync
        DEV_LOG && console.log('SYNC', 'onDocumentAdded');
        this.syncDocumentsInternal({ event, type: SyncType.DATA | SyncType.PDF, fromEvent: EVENT_DOCUMENT_ADDED });
    }
    onDocumentDeleted(event: DocumentDeletedEventData) {
        DEV_LOG && console.log('SYNC', 'onDocumentDeleted');
        // only used for data sync

        this.getStoredSyncServices()
            // .filter((s) => s instanceof BaseDataSyncService)
            .forEach(async (service) => {
                const key = getRemoteDeleteDocumentSettingsKey(service as any);
                const documentsToDeleteOnRemote = JSON.parse(ApplicationSettings.getString(key, '[]'));
                documentsToDeleteOnRemote.push(...event.documents.map((d) => d.id));
                ApplicationSettings.setString(key, JSON.stringify(documentsToDeleteOnRemote));
            });
        this.syncDocumentsInternal({ event, type: SyncType.DATA, fromEvent: EVENT_DOCUMENT_DELETED });
    }
    onDocumentUpdated(event: DocumentUpdatedEventData) {
        // only used for data sync
        DEV_LOG && console.log('SYNC', 'onDocumentUpdated', event.updateModifiedDate);
        if (event.updateModifiedDate !== false) {
            this.syncDocumentsInternal({ event, type: SyncType.DATA | SyncType.PDF, fromEvent: EVENT_DOCUMENT_UPDATED });
        }
    }
    onDocumentPageUpdated(event: DocumentPageUpdatedEventData) {
        // only used for image sync
        DEV_LOG && console.log('SYNC', 'onDocumentPageUpdated');
        this.syncDocumentsInternal({ event, type: SyncType.IMAGE, fromEvent: EVENT_DOCUMENT_PAGE_UPDATED });
    }
    onDocumentPagesAdded(event: DocumentPagesAddedEventData) {
        // only used for image sync
        DEV_LOG && console.log('SYNC', 'onDocumentPagesAdded');
        this.syncDocumentsInternal({ event, type: SyncType.IMAGE, fromEvent: EVENT_DOCUMENT_PAGES_ADDED });
    }
    // onAutoSyncPrefChanged() {
    //     this.autoSync = ApplicationSettings.getBoolean(SETTINGS_REMOTE_AUTO_SYNC, AUTO_SYNC);
    //     DEV_LOG && console.log('onAutoSyncPrefChanged', this.autoSync);
    // }
    get enabled() {
        return this.services?.length > 0;
    }
    // services: BaseSyncService[];

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
            // SERVICES_TYPE_MAP[type].start(data);
            this.onServiceChanged();
        }
        return dataToAdd;
    }
    removeService(data) {
        // const serviceToRemoveIndex = this.services.findIndex((s) => s.id === data.id);
        // if (serviceToRemoveIndex !== -1) {
        const syncServices = this.getStoredSyncServices();
        const index = syncServices.findIndex((s) => s.id === data.id);
        DEV_LOG && console.log('Sync', 'removeService', index, JSON.stringify(data));
        if (index !== -1) {
            syncServices.splice(index, 1);
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
        // this.services[serviceToRemoveIndex].stop();
        // (this.services[serviceToRemoveIndex].constructor as any).destroyInstance();
        this.onServiceChanged();
        return true;
        // }
    }
    updateService(data) {
        // const serviceToUpdateIndex = this.services.findIndex((s) => s.id === data.id);
        // if (serviceToUpdateIndex !== -1) {
        const syncServices = this.getStoredSyncServices();
        const index = syncServices.findIndex((s) => s.id === data.id);
        DEV_LOG && console.log('Sync', 'updateService', index, JSON.stringify(data));
        if (index !== -1) {
            syncServices.splice(index, 1, data);
            ApplicationSettings.setString(SETTINGS_SYNC_SERVICES, JSON.stringify(syncServices));
        }
        //we recreate the service to ensure everything is good
        // this.services[serviceToUpdateIndex].stop();
        // (this.services[serviceToUpdateIndex].constructor as any).destroyInstance();
        // SERVICES_TYPE_MAP[data.type].start(data);
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
        // syncServices.map((data) => SERVICES_TYPE_MAP[data.type].start(data));
        // AVAILABLE_SYNC_SERVICES.forEach((sClass) => sClass.start());
        // this.services = BaseSyncService.getEnabledServices();
        DEV_LOG && console.log('Sync', 'start', /* this.services.length,  */ this.enabled);
        if (this.enabled) {
            this.notify({ eventName: EVENT_STATE, enabled: this.enabled } as SyncEnabledEventData);
            documentsService.on(EVENT_DOCUMENT_ADDED, this.onDocumentAdded, this);
            documentsService.on(EVENT_DOCUMENT_UPDATED, this.onDocumentUpdated, this);
            documentsService.on(EVENT_DOCUMENT_DELETED, this.onDocumentDeleted, this);
            documentsService.on(EVENT_DOCUMENT_PAGE_UPDATED, this.onDocumentPageUpdated, this);
            documentsService.on(EVENT_DOCUMENT_PAGES_ADDED, this.onDocumentPagesAdded, this);
            // prefs.on(`key:${SETTINGS_REMOTE_AUTO_SYNC}`, this.onAutoSyncPrefChanged);
            // this.onAutoSyncPrefChanged();
            DEV_LOG && console.log('SyncService', 'start');
        }
    }
    async stop() {
        // prefs.off(`key:${SETTINGS_REMOTE_AUTO_SYNC}`, this.onAutoSyncPrefChanged);
        documentsService.off(EVENT_DOCUMENT_ADDED, this.onDocumentAdded, this);
        documentsService.off(EVENT_DOCUMENT_UPDATED, this.onDocumentUpdated, this);
        documentsService.off(EVENT_DOCUMENT_DELETED, this.onDocumentDeleted, this);
        documentsService.off(EVENT_DOCUMENT_PAGE_UPDATED, this.onDocumentPageUpdated, this);
        documentsService.off(EVENT_DOCUMENT_PAGES_ADDED, this.onDocumentPagesAdded, this);
        if (this.syncRunning) {
            // if sync is running wait for it to be finished
            await new Promise((resolve) => this.once(EVENT_SYNC_STATE, resolve));
        }
        // this.services.forEach((service) => service.stop());
    }
    onServiceChanged(force = false) {
        const services = this.getStoredSyncServices().filter((s) => s.enabled !== false);
        this.services = services;
        syncServicesStore.set(services);
        // const newServices = this.getEnabledServices();
        // const delta = newServices.length - this.services.length;
        // DEV_LOG && console.log('onServiceChanged', force, delta);
        // if (force || delta !== 0) {
        //     this.services = newServices;
        //     if (delta !== 0) {
        //         this.notify({ eventName: EVENT_STATE, enabled: this.enabled } as SyncEnabledEventData);
        //     }
        //     if (delta > 0) {
        //         syncService.syncDocuments();
        //     } else if (newServices.length === 0) {
        //         this.stop();
        //     }
        // }
    }

    syncRunning = false;

    syncDocuments = debounce(
        async ({
            force = true,
            bothWays = false,
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
                    // if (isError) {
                    // executor.reject(createErrorFromMessage(message));
                    // } else {
                    // const id = data.id;
                    // if (data.nativeDataKeys.length > 0) {
                    //     const nativeDatas: { [k: string]: any } = {};
                    //     if (__ANDROID__) {
                    //         data.nativeDataKeys.forEach((k) => {
                    //             nativeDatas[k] = com.akylas.documentscanner.WorkersContext.getValue(`${id}_${k}`);
                    //             com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, null);
                    //         });
                    //         data.nativeDatas = nativeDatas;
                    //     }
                    // }

                    executor.resolve(messageData);
                    // }
                });
                delete this.messagePromises[id];
            }
            const eventData = messageData as any;
            switch (data.type) {
                case 'event':
                    // DEV_LOG && console.log('worker event', eventData.eventName, eventData.target, !!eventData.object, Object.keys(eventData));
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
                        if (eventData.object) {
                            eventData.object = OCRDocument.fromJSON(eventData.doc);
                        }
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
        }
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
                if (__ANDROID__) {
                    keys.forEach((k) => {
                        com.akylas.documentscanner.WorkersContext.Companion.setValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
                    });
                } else {
                    keys.forEach((k) => {
                        WorkerContext.setValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
                    });
                }
                const data = {
                    error: !!error ? JSON.stringify(error.toJSON() ? error.toJSON() : { message: error.toString(), ...error }) : undefined,
                    id,
                    nativeDataKeysPrefix,
                    messageData: !!messageData ? JSON.stringify(messageData) : undefined,
                    nativeData: keys.map((k) => nativeDataKeysPrefix + k),
                    type
                };
                // DEV_LOG && console.info('Sync', 'postMessage', JSON.stringify(data));

                this.worker.postMessage(data);
            });
        } else {
            // DEV_LOG && console.info('Sync', 'postMessage', 'test');
            const keys = Object.keys(nativeData);
            const nativeDataKeysPrefix = Date.now() + '$$$';
            if (__ANDROID__) {
                keys.forEach((k) => {
                    com.akylas.documentscanner.WorkersContext.Companion.setValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
                });
            } else {
                keys.forEach((k) => {
                    WorkerContext.setValue(nativeDataKeysPrefix + k, nativeData[k]._native || nativeData[k]);
                });
            }
            const data = {
                error: !!error ? JSON.stringify({ message: error.toString(), ...error }) : undefined,
                id,
                nativeDataKeysPrefix,
                messageData: !!messageData ? JSON.stringify(messageData) : undefined,
                nativeData: keys.map((k) => nativeDataKeysPrefix + k),
                type
            };
            // DEV_LOG && console.info('Sync', 'postMessage', JSON.stringify(data));
            this.worker.postMessage(data);
        }
    }
    async syncDocumentsInternal({
        force = false,
        bothWays = false,
        event,
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
            if (!this.enabled) {
                return;
            }
            // send syncState event right now for the UI to be updated as soon as possible
            this.notify({ eventName: EVENT_SYNC_STATE, state: 'running' } as SyncStateEventData);
            DEV_LOG && console.warn('syncDocumentsInternal', type, fromEvent);
            if (!this.worker) {
                const worker = (this.worker = new Worker('~/workers/SyncWorkerBootstrap') as any);
                worker.onmessage = this.onWorkerMessage.bind(this);
            }
            DEV_LOG && console.warn('syncDocumentsInternal1', type, fromEvent);
            let eventData;
            if (event) {
                const { object, ...otherProps } = event;
                if (object?.['toJSONObject']) {
                    eventData = { ...otherProps, object: event.object['toJSONObject']?.() };
                } else {
                    eventData = otherProps;
                }
            }
            // if (event) {
            //     const { object, ...otherProps } = event;
            //     eventData = otherProps;
            // }
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
            // this.notify({ eventName: EVENT_SYNC_STATE, state: 'running' } as SyncStateEventData);
            // TEST_LOG && console.log('syncDocuments', bothWays, event?.eventName);
            // this.syncRunning = true;
            // await this.syncDataDocuments({ force, bothWays, type, event });
            // await this.syncImageDocuments({ force, event, type });
        } catch (error) {
            DEV_LOG && console.error(error);
            showError(error);
        } finally {
            // console.warn('sync done');
            // this.syncRunning = false;
            // this.notify({ eventName: EVENT_SYNC_STATE, state: 'finished' } as SyncStateEventData);
        }
    }

    //     async syncDataDocuments({ force = false, bothWays = false, event, type }: { force; bothWays; type: 'pdf' | 'data' | 'image'; event: DocumentEvents }) {
    //         if (event?.eventName === EVENT_DOCUMENT_PAGES_ADDED || event?.eventName === EVENT_DOCUMENT_PAGE_UPDATED || event?.eventName === EVENT_DOCUMENT_PAGE_DELETED) {
    //             // we ignore this event
    //             // pages will be updated independently
    //             return;
    //         }
    //         const localDocuments = event?.['doc'] ? [event['doc'] as OCRDocument] : (event?.['documents'] as OCRDocument[]) ?? (await documentsService.documentRepository.search({}));

    //         TEST_LOG &&
    //             console.log(
    //                 'Sync',
    //                 'syncDataDocuments',
    //                 event?.eventName,
    //                 localDocuments.map((d) => d.id)
    //             );
    //         await Promise.all(
    //             this.services
    //                 .filter((s) => s instanceof BaseDataSyncService)
    //                 .map(async (service) => {
    //                     TEST_LOG && console.log('syncDataDocuments', 'handling service', service.type, service.id, service.autoSync, force);
    //                     if (!service.shouldSync(force)) {
    //                         return;
    //                     }
    //                     const deleteKey = getRemoteDeleteDocumentSettingsKey(service);
    //                     const documentsToDeleteOnRemote: string[] = JSON.parse(ApplicationSettings.getString(deleteKey, '[]'));
    //                     if (bothWays) {
    //                         await service.ensureRemoteFolder();
    //                         const remoteDocuments = await service.getRemoteFolderDirectories('');
    //                         TEST_LOG && console.log('remoteDocuments', JSON.stringify(remoteDocuments));
    //                         const {
    //                             toBeAdded: missingLocalDocuments,
    //                             toBeDeleted: missingRemoteDocuments,
    //                             union: toBeSyncDocuments
    //                         } = findArrayDiffs(localDocuments, remoteDocuments, (a, b) => a.id === b.basename);

    //                         TEST_LOG &&
    //                             console.log(
    //                                 'missingRemoteDocuments',
    //                                 missingRemoteDocuments.map((d) => d.id)
    //                             );
    //                         TEST_LOG &&
    //                             console.log(
    //                                 'missingLocalDocuments',
    //                                 missingLocalDocuments.map((d) => d.basename)
    //                             );
    //                         TEST_LOG &&
    //                             console.log(
    //                                 'toBeSyncDocuments',
    //                                 toBeSyncDocuments.map((d) => d.id)
    //                             );

    //                         for (let index = 0; index < documentsToDeleteOnRemote.length; index++) {
    //                             const id = documentsToDeleteOnRemote[index];
    //                             const missingLocalIndex = missingLocalDocuments.findIndex((d) => d.basename === id);
    //                             if (missingLocalIndex !== -1) {
    //                                 missingLocalDocuments.splice(missingLocalIndex, 1);
    //                                 await service.removeDocumentFromRemote(id);
    //                             }
    //                         }
    //                         ApplicationSettings.remove(deleteKey);
    //                         for (let index = 0; index < missingRemoteDocuments.length; index++) {
    //                             const doc = missingRemoteDocuments[index];
    //                             await service.addDocumentToRemote(doc);
    //                             doc.save({ _synced: doc._synced | service.syncMask }, false);
    //                         }
    //                         for (let index = 0; index < missingLocalDocuments.length; index++) {
    //                             const doc = await service.importDocumentFromRemote(missingLocalDocuments[index]);
    //                             await doc.save({ _synced: doc._synced | service.syncMask }, true, false);
    //                             TEST_LOG && console.log('importFolderFromWebdav done');
    //                             documentsService.notify({ eventName: EVENT_DOCUMENT_ADDED, object: documentsService, doc });
    //                         }
    //                         for (let index = 0; index < toBeSyncDocuments.length; index++) {
    //                             await this.syncDocumentOnRemote(toBeSyncDocuments[index], service);
    //                         }
    //                     } else {
    //                         // just test if we have local document marked as needing update
    //                         const documentsToSync = localDocuments.filter((d) => (d._synced & service.syncMask) === 0).concat(documentsToDeleteOnRemote as any[]);
    //                         if (documentsToSync.length) {
    //                             await service.ensureRemoteFolder();
    //                             const remoteDocuments = await service.getRemoteFolderDirectories('');
    //                             TEST_LOG && console.log('remoteDocuments', JSON.stringify(remoteDocuments));
    //                             const {
    //                                 toBeAdded: missingLocalDocuments,
    //                                 toBeDeleted: missingRemoteDocuments,
    //                                 union: toBeSyncDocuments
    //                             } = findArrayDiffs(localDocuments, remoteDocuments, (a, b) => a.id === b.basename);
    //                             TEST_LOG &&
    //                                 console.log(
    //                                     'missingRemoteDocuments',
    //                                     missingRemoteDocuments.map((d) => d.id)
    //                                 );
    //                             TEST_LOG &&
    //                                 console.log(
    //                                     'missingLocalDocuments',
    //                                     missingLocalDocuments.map((d) => d.basename)
    //                                 );
    //                             TEST_LOG &&
    //                                 console.log(
    //                                     'toBeSyncDocuments',
    //                                     toBeSyncDocuments.map((d) => d.id)
    //                                 );
    //                             if (service.allowToRemoveOnRemote) {
    //                                 for (let index = 0; index < documentsToDeleteOnRemote.length; index++) {
    //                                     const id = documentsToDeleteOnRemote[index];
    //                                     const missingLocalIndex = missingLocalDocuments.findIndex((d) => d.basename === id);
    //                                     if (missingLocalIndex !== -1) {
    //                                         missingLocalDocuments.splice(missingLocalIndex, 1);
    //                                         await service.removeDocumentFromRemote(id);
    //                                     }
    //                                 }
    //                             }
    //                             for (let index = 0; index < missingRemoteDocuments.length; index++) {
    //                                 await service.addDocumentToRemote(missingRemoteDocuments[index]);
    //                             }
    //                             // for (let index = 0; index < missingLocalDocuments.length; index++) {
    //                             //     await this.importDocumentFromWebdav(missingLocalDocuments[index]);
    //                             // }
    //                             for (let index = 0; index < toBeSyncDocuments.length; index++) {
    //                                 await this.syncDocumentOnRemote(toBeSyncDocuments[index], service);
    //                             }
    //                         }
    //                     }
    //                     ApplicationSettings.remove(deleteKey);
    //                 })
    //         );
    //         TEST_LOG && console.log('syncDataDocuments done');
    //     }

    //     async syncDocumentOnRemote(document: OCRDocument, service: BaseDataSyncService) {
    //         TEST_LOG && console.log('syncDocumentOnWebdav', document.id);
    //         const dataJSON = JSON.parse(await service.getFileFromRemote(document, 'data.json')) as OCRDocument;
    //         const docDataFolder = documentsService.dataFolder.getFolder(document.id);
    //         DEV_LOG && console.log('syncDocumentOnWebdav', document.id, document.modifiedDate, dataJSON.modifiedDate);
    //         if (dataJSON.modifiedDate > document.modifiedDate) {
    //             let needsRemoteDocUpdate = false;
    //             const { pages: docPages, ...docProps } = document.toJSONObject();
    //             const { pages: remotePages, ...remoteProps } = dataJSON;
    //             const toUpdate = {};
    //             Object.keys(remoteProps).forEach((k) => {
    //                 if (k.startsWith('_')) {
    //                     return;
    //                 }
    //                 if (remoteProps[k] !== docProps[k]) {
    //                     toUpdate[k] = remoteProps[k];
    //                 }
    //             });
    //             const { toBeAdded: missingLocalPages, toBeDeleted: removedRemotePages, union: toBeSyncPages } = findArrayDiffs(docPages as OCRPage[], remotePages, (a, b) => a.id === b.id);

    //             TEST_LOG &&
    //                 console.log(
    //                     'document need to be synced FROM webdav!',
    //                     toUpdate,
    //                     missingLocalPages,
    //                     removedRemotePages,
    //                     toBeSyncPages.map((p) => p.id)
    //                 );
    //             TEST_LOG &&
    //                 console.log(
    //                     'missingLocalPages',
    //                     missingLocalPages.map((p) => p.id)
    //                 );
    //             TEST_LOG &&
    //                 console.log(
    //                     'removedRemotePages',
    //                     removedRemotePages.map((p) => p.id)
    //                 );
    //             TEST_LOG &&
    //                 console.log(
    //                     'toBeSyncPages',
    //                     toBeSyncPages.map((p) => p.id)
    //                 );
    //             for (let index = 0; index < removedRemotePages.length; index++) {
    //                 const pageToRemove = removedRemotePages[index];
    //                 const pageIndex = (docPages as OCRPage[]).findIndex((p) => p.id === pageToRemove.id);
    //                 if (pageIndex !== -1) {
    //                     document.deletePage(pageIndex);
    //                 }
    //             }
    //             for (let index = 0; index < missingLocalPages.length; index++) {
    //                 const missingLocalPage = missingLocalPages[index];
    //                 const pageDataFolder = docDataFolder.getFolder(missingLocalPage.id);
    //                 missingLocalPage.sourceImagePath = path.join(pageDataFolder.path, basename(missingLocalPage.sourceImagePath));
    //                 missingLocalPage.imagePath = path.join(pageDataFolder.path, basename(missingLocalPage.imagePath));
    //                 await service.importFolderFromRemote(path.join(document.id, missingLocalPage.id), pageDataFolder);

    //                 // we insert page one by one because of the index
    //                 await document.addPage(
    //                     missingLocalPage,
    //                     remotePages.findIndex((p) => p.id === missingLocalPage.id)
    //                 );
    //                 // await document.save();
    //             }
    //             for (let index = 0; index < toBeSyncPages.length; index++) {
    //                 const localPage = toBeSyncPages[index];
    //                 const localPageIndex = (docPages as OCRPage[]).findIndex((p) => p.id === localPage.id);
    //                 const remotePageIndex = remotePages.findIndex((p) => p.id === localPage.id);
    //                 const remotePageToSync = remotePages[remotePageIndex];
    //                 TEST_LOG && console.log('sync page', remotePageToSync.id, remotePageToSync.modifiedDate, localPage.modifiedDate);
    //                 if (remotePageToSync.modifiedDate > localPage.modifiedDate) {
    //                     //we need to update the data and then recreate the image if necessary
    //                     const { imagePath: localImagePath, sourceImagePath: localSourceImagePath, ...pageProps } = localPage;
    //                     const { imagePath: remoteImagePath, sourceImagePath: remoteSourceImagePath, ...remotePageProps } = remotePageToSync;
    //                     const pageToUpdate: Partial<OCRPage> = {};
    //                     Object.keys(remotePageProps).forEach((k) => {
    //                         if (k.startsWith('_')) {
    //                             return;
    //                         }
    //                         if (remotePageProps[k] !== pageProps[k] && JSON.stringify(remotePageProps[k]) !== JSON.stringify(pageProps[k])) {
    //                             pageToUpdate[k] = remotePageProps[k];
    //                         }
    //                     });
    //                     // check if we need to recreate the image
    //                     let imageChanged = false;
    //                     TEST_LOG && console.log('sync page FROM webdav!', remotePageToSync.id, JSON.stringify(pageToUpdate));
    //                     if (pageToUpdate.crop || pageToUpdate.transforms) {
    //                         const file = File.fromPath(localPage.imagePath);
    //                         const crop = pageToUpdate.crop || localPage.crop;
    //                         const transforms = pageToUpdate.transforms || localPage.transforms;
    //                         imageChanged = true;
    //                         DEV_LOG && console.log('page sync needed size update', file.size, transforms, crop);

    //                         await cropDocumentFromFile(localPage.sourceImagePath, [crop], {
    //                             saveInFolder: file.parent.path,
    //                             fileName: file.name,
    //                             compressFormat: IMG_FORMAT,
    //                             compressQuality: IMG_COMPRESS,
    //                             transforms
    //                         });
    //                         pageToUpdate.size = file.size;
    //                     } else if (pageToUpdate.size === 0) {
    //                         const file = File.fromPath(localPage.imagePath);
    //                         pageToUpdate.size = file.size;
    //                     }
    //                     await document.updatePage(localPageIndex, pageToUpdate, imageChanged);
    //                 } else if (remotePageToSync.modifiedDate < localPage.modifiedDate) {
    //                     //we need to update the data and then recreate the image if necessary
    //                     const { imagePath: localImagePath, sourceImagePath: localSourceImagePath, ...pageProps } = localPage;
    //                     const { imagePath: remoteImagePath, sourceImagePath: remoteSourceImagePath, ...remotePageProps } = remotePageToSync;
    //                     const pageTooUpdate: Partial<OCRPage> = {};
    //                     Object.keys(pageProps).forEach((k) => {
    //                         if (k.startsWith('_')) {
    //                             return;
    //                         }
    //                         if (remotePageProps[k] !== pageProps[k]) {
    //                             pageTooUpdate[k] = pageProps[k];
    //                         }
    //                     });
    //                     // check if we need to upload the image
    //                     TEST_LOG && console.log('sync page FROM local!', remotePageToSync.id, JSON.stringify(pageTooUpdate));
    //                     if (pageTooUpdate.crop || pageTooUpdate.transforms) {
    //                         await service.putFileContents(path.join(document.id, basename(localImagePath)), localImagePath);
    //                     }
    //                     needsRemoteDocUpdate = true;
    //                 }
    //             }
    //             TEST_LOG && console.log('update document', toUpdate);
    //             // mark the document as synced
    //             await document.save({ _synced: document._synced | service.syncMask, ...toUpdate });

    //             if (needsRemoteDocUpdate) {
    //                 await service.putFileContents(path.join(document.id, 'data.json'), document.toString());
    //             }
    //         } else if (dataJSON.modifiedDate < document.modifiedDate) {
    //             // DEV_LOG && console.log('syncDocumentOnWebdav', document.id, document.modifiedDate, dataJSON.modifiedDate);
    //             const { pages: docPages, ...docProps } = document.toJSONObject();
    //             const { pages: remotePages, ...remoteProps } = dataJSON;
    //             // const toUpdate = {};
    //             // Object.keys(remoteProps).forEach((k) => {
    //             //     if (k.startsWith('_')) {
    //             //         return;
    //             //     }
    //             //     if (remoteProps[k] !== docProps[k]) {
    //             //         toUpdate[k] = remoteProps[k];
    //             //     }
    //             // });
    //             const { toBeAdded: missingRemotePages, toBeDeleted: removedRemotePages, union: toBeSyncPages } = findArrayDiffs(remotePages, docPages as OCRPage[], (a, b) => a.id === b.id);
    //             TEST_LOG && console.log('document need to be synced FROM local!', document.pages.length);
    //             TEST_LOG &&
    //                 console.log(
    //                     'missingRemotePages',
    //                     missingRemotePages.map((p) => p.id)
    //                 );
    //             TEST_LOG &&
    //                 console.log(
    //                     'removedRemotePages',
    //                     removedRemotePages.map((p) => p.id)
    //                 );
    //             TEST_LOG &&
    //                 console.log(
    //                     'toBeSyncPages',
    //                     toBeSyncPages.map((p) => p.id)
    //                 );
    //             for (let index = 0; index < missingRemotePages.length; index++) {
    //                 const missingRemotePage = missingRemotePages[index];
    //                 const pageDataFolder = docDataFolder.getFolder(missingRemotePage.id);
    //                 await service.sendFolderToRemote(pageDataFolder, path.join(document.id, missingRemotePage.id));
    //             }
    //             for (let index = 0; index < removedRemotePages.length; index++) {
    //                 const removedRemotePage = removedRemotePages[index];
    //                 await service.deleteFile(path.join(document.id, removedRemotePage.id));
    //             }

    //             for (let index = 0; index < toBeSyncPages.length; index++) {
    //                 const remotePage = toBeSyncPages[index];
    //                 const remotePageIndex = remotePages.findIndex((p) => p.id === remotePage.id);
    //                 const localPageIndex = (docPages as OCRPage[]).findIndex((p) => p.id === remotePage.id);
    //                 const localPageToSync = docPages[localPageIndex];
    //                 TEST_LOG && console.log('sync page', localPageToSync.id, localPageToSync.modifiedDate, remotePage.modifiedDate);
    //                 if (remotePage.modifiedDate > localPageToSync.modifiedDate) {
    //                     //we need to update the data and then recreate the image if necessary
    //                     const { imagePath: localImagePath, sourceImagePath: localSourceImagePath, ...pageProps } = localPageToSync;
    //                     const { imagePath: remoteImagePath, sourceImagePath: remoteSourceImagePath, ...remotePageProps } = remotePage;
    //                     const pageToUpdate: Partial<OCRPage> = {};
    //                     Object.keys(remotePageProps).forEach((k) => {
    //                         if (k.startsWith('_')) {
    //                             return;
    //                         }
    //                         if (remotePageProps[k] !== pageProps[k] && JSON.stringify(remotePageProps[k]) !== JSON.stringify(pageProps[k])) {
    //                             pageToUpdate[k] = remotePageProps[k];
    //                         }
    //                     });
    //                     // check if we need to recreate the image
    //                     TEST_LOG && console.log('sync page FROM webdav!', localPageToSync.id, JSON.stringify(pageToUpdate));
    //                     let imageChanged = false;
    //                     if (pageToUpdate.crop || pageToUpdate.transforms) {
    //                         const file = File.fromPath(localPageToSync.imagePath);

    //                         const crop = pageToUpdate.crop || localPageToSync.crop;
    //                         const transforms = pageToUpdate.transforms || localPageToSync.transforms;
    //                         DEV_LOG && console.log('page sync needed size update', file.size, transforms, crop);
    //                         await cropDocumentFromFile(localPageToSync.sourceImagePath, [crop], {
    //                             saveInFolder: file.parent.path,
    //                             fileName: file.name,
    //                             compressFormat: IMG_FORMAT,
    //                             compressQuality: IMG_COMPRESS,
    //                             transforms
    //                         });
    //                         pageToUpdate.size = file.size;
    //                         imageChanged = true;
    //                     } else if (pageToUpdate.size === 0) {
    //                         const file = File.fromPath(localPageToSync.imagePath);
    //                         pageToUpdate.size = file.size;
    //                     }
    //                     await document.updatePage(localPageIndex, pageToUpdate, imageChanged);
    //                 } else if (remotePage.modifiedDate < localPageToSync.modifiedDate) {
    //                     //we need to update the data and then recreate the image if necessary
    //                     const { imagePath: localImagePath, sourceImagePath: localSourceImagePath, ...pageProps } = localPageToSync;
    //                     const { imagePath: remoteImagePath, sourceImagePath: remoteSourceImagePath, ...remotePageProps } = remotePage;
    //                     const pageTooUpdate: Partial<OCRPage> = {};
    //                     Object.keys(pageProps).forEach((k) => {
    //                         if (k.startsWith('_')) {
    //                             return;
    //                         }
    //                         if (remotePageProps[k] !== pageProps[k]) {
    //                             pageTooUpdate[k] = pageProps[k];
    //                         }
    //                     });
    //                     // check if we need to upload the image
    //                     TEST_LOG && console.log('sync page FROM local!', localPageToSync.id, JSON.stringify(pageTooUpdate));
    //                     if (pageTooUpdate.crop || pageTooUpdate.transforms) {
    //                         await service.putFileContents(path.join(document.id, basename(localImagePath)), localImagePath);
    //                     }
    //                 }
    //             }
    //             await service.putFileContents(path.join(document.id, 'data.json'), document.toString(), { overwrite: true });
    //             return document.save({ _synced: document._synced | service.syncMask });
    //         } else if ((document._synced & service.syncMask) === 0) {
    //             TEST_LOG && console.log('syncDocumentOnWebdav just changing sync state');
    //             return document.save({ _synced: document._synced | service.syncMask });
    //         }
    //     }

    //     async syncImageDocuments({ force = false, event, type }: { force; type: 'pdf' | 'data' | 'image'; event: DocumentEvents }) {
    //         if (event?.eventName === EVENT_DOCUMENT_UPDATED || event?.eventName === EVENT_DOCUMENT_ADDED || event?.eventName === EVENT_DOCUMENT_PAGE_DELETED) {
    //             // we ignore this event
    //             // pages will be updated independently
    //             return;
    //         }
    //         const localDocuments = event?.['pages']
    //             ? [{ document: event.object as OCRDocument, pages: event['pages'] as OCRPage[] }]
    //             : event?.['pageIndex'] !== undefined
    //               ? [{ document: event.object as OCRDocument, pages: [event.object['pages'][event['pageIndex']]] as OCRPage[] }]
    //               : (await documentsService.documentRepository.search({})).map((d) => ({ document: d, pages: d.pages }));

    //         TEST_LOG &&
    //             console.log(
    //                 'Sync',
    //                 'syncImageDocuments',
    //                 event?.eventName,
    //                 localDocuments.map((d) => d.document.id)
    //             );

    //         const defaultExportSettings = getImageExportSettings();
    //         await Promise.all(
    //             this.services
    //                 .filter((s) => s instanceof BaseImageSyncService)
    //                 .map(async (service) => {
    //                     TEST_LOG && console.log('syncImageDocuments', 'handling service', service.type, service.id, service.autoSync, force);
    //                     if (!service.shouldSync(force, event)) {
    //                         return;
    //                     }
    //                     const exportFormat = service.imageFormat || defaultExportSettings.imageFormat;
    //                     const exportQuality = service.imageQuality || defaultExportSettings.imageQuality;
    //                     const deleteKey = getRemoteDeleteDocumentSettingsKey(service);
    //                     const documentsToDeleteOnRemote: string[] = JSON.parse(ApplicationSettings.getString(deleteKey, '[]'));

    //                     // just test if we have local document marked as needing update
    //                     const documentsToSync = localDocuments.filter((d) => (d.document._synced & service.syncMask) === 0).concat(documentsToDeleteOnRemote as any[]);
    //                     TEST_LOG && console.log('syncImageDocuments', 'documentsToSync', documentsToSync.length);
    //                     if (documentsToSync.length) {
    //                         await service.ensureRemoteFolder();
    //                         const remoteFiles = await service.getRemoteFolderFiles('');
    //                         for (let index = 0; index < localDocuments.length; index++) {
    //                             const doc = localDocuments[index];
    //                             for (let j = 0; j < doc.pages.length; j++) {
    //                                 const page = doc.pages[j];
    //                                 const name = service.getImageName(doc.document, page, j, exportFormat);
    //                                 const existing = remoteFiles.find((r) => r.basename === name);
    //                                 DEV_LOG && console.log('syncImageDocuments', 'test', doc.document.id, j, existing, existing?.lastmod, page.modifiedDate);
    //                                 if (!existing || dayjs(existing.lastmod).valueOf() < page.modifiedDate) {
    //                                     // we need to create the image on remote
    //                                     const imageSource = await getTransformedImage(page, {
    //                                         colorMatrix: service.colorMatrix,
    //                                         brightness: service.brightness,
    //                                         contrast: service.contrast
    //                                     });
    //                                     try {
    //                                         await service.writeImage(imageSource, name, exportFormat, exportQuality, true);
    //                                     } finally {
    //                                         recycleImages(imageSource);
    //                                     }
    //                                     // const filePath = path.join(knownFolders.temp().path, name);
    //                                     // await imageSource.saveToFileAsync(filePath, exportFormat, exportQuality);
    //                                     // await service.putFileContents(name, filePath);
    //                                 }
    //                             }
    //                             await doc.document.save({ _synced: doc.document._synced | service.syncMask });
    //                         }
    //                     }
    //                     ApplicationSettings.remove(deleteKey);
    //                 })
    //         );
    //         TEST_LOG && console.log('syncImageDocuments done ');
    //     }
}
export const syncService = new SyncService();
