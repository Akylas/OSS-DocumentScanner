import { Utils } from '@nativescript/core';
import { wrapNativeException } from '@nativescript/core/utils';
import { BaseSyncService } from '~/services/sync.common';

// Export everything from common
export * from './sync.common';

// Import common to set platform-specific implementations

// Background task identifier for sync
const SYNC_TASK_IDENTIFIER = `com.akylas.documentscanner.syncTask`;

// Store for pending sync service IDs
const pendingSyncTasks: Map<number, Date> = new Map();

/**
 * Process all pending sync tasks
 */
async function processPendingSyncs(): Promise<void> {
    // Get all pending syncs
    const syncPromises: Promise<void>[] = [];
    pendingSyncTasks.forEach((scheduledTime, serviceId) => {
        DEV_LOG && console.log('SyncService', 'processing pending sync for service', serviceId);
        syncPromises.push(
            syncService.triggerThrottledSync(serviceId).catch((error) => {
                console.error('SyncService', 'failed to sync service', serviceId, error);
            })
        );
    });

    // Clear pending tasks
    pendingSyncTasks.clear();

    // Wait for all syncs to complete
    await Promise.all(syncPromises);
}

export class SyncService extends BaseSyncService {
    /**
     * Initialize iOS-specific sync background refresh
     */
    initThrottledSync() {
        // Register the background task handler
        BGTaskScheduler.sharedScheduler.registerForTaskWithIdentifierUsingQueueLaunchHandler(
            SYNC_TASK_IDENTIFIER,
            null, // Use main queue
            (task: BGTask) => {
                DEV_LOG && console.log('SyncService', 'iOS background task started', task.identifier);

                // Set expiration handler
                task.expirationHandler = () => {
                    DEV_LOG && console.log('SyncService', 'iOS background task expired');
                    task.setTaskCompletedWithSuccess(false);
                };

                // Process all pending syncs
                processPendingSyncs()
                    .then(() => {
                        DEV_LOG && console.log('SyncService', 'iOS background task completed successfully');
                        task.setTaskCompletedWithSuccess(true);
                    })
                    .catch((error) => {
                        console.error('SyncService', 'iOS background task failed', error);
                        task.setTaskCompletedWithSuccess(false);
                    });
            }
        );

        DEV_LOG && console.log('SyncService', 'iOS background refresh initialized');
    }

    /**
     * Request background refresh for a throttled sync
     * @param serviceId The sync service ID
     * @param delayMs Delay in milliseconds
     */
    scheduleThrottledSync(serviceId: number, delayMs: number) {
        DEV_LOG && console.log('SyncService', 'BGTaskScheduler not available, using timer fallback');
        // Fallback to regular timer for older iOS versions
        // setTimeout(() => {
        //     syncService.triggerThrottledSync(serviceId).catch((error) => {
        //         console.error('SyncService', 'failed to sync service', serviceId, error);
        //     });
        // }, delayMs);

        // Store this service as pending
        const scheduledTime = new Date(Date.now() + delayMs);

        // Cancel any existing requests first
        BGTaskScheduler.sharedScheduler.cancelTaskRequestWithIdentifier(SYNC_TASK_IDENTIFIER);

        // Find the earliest scheduled time among all pending syncs
        let earliestTime = scheduledTime;
        pendingSyncTasks.forEach((time) => {
            if (time < earliestTime) {
                earliestTime = time;
            }
        });

        // Create a new background task request
        const request = BGProcessingTaskRequest.alloc().initWithIdentifier(SYNC_TASK_IDENTIFIER);
        request.earliestBeginDate = earliestTime;
        request.requiresNetworkConnectivity = true;
        // Submit the request
        const errorRef = new interop.Reference<NSError>();
        //@ts-expect-error missing errorRef arg
        const success = BGTaskScheduler.sharedScheduler.submitTaskRequestError(request, errorRef);

        if (!success) {
            const error = errorRef.value;
            console.error('SyncService', 'Failed to schedule iOS background task:', error?.localizedDescription);

            syncService.triggerThrottledSync(serviceId);
        } else {
            pendingSyncTasks.set(serviceId, scheduledTime);
            DEV_LOG && console.log('SyncService', 'scheduled iOS background refresh for service', serviceId, 'at', earliestTime);
        }
    }

    /**
     * Cancel a scheduled background refresh for a sync service
     * @param serviceId The sync service ID
     */
    cancelThrottledSync(serviceId: number) {
        // Remove from pending tasks
        pendingSyncTasks.delete(serviceId);
        DEV_LOG && console.log('SyncService', 'cancelThrottledSync', serviceId);

        if (typeof BGTaskScheduler === 'undefined') {
            return;
        }

        // If no more pending tasks, cancel the background task
        if (pendingSyncTasks.size === 0) {
            BGTaskScheduler.sharedScheduler.cancelTaskRequestWithIdentifier(SYNC_TASK_IDENTIFIER);
            DEV_LOG && console.log('SyncService', 'cancelled iOS background refresh (no pending tasks)');
        } else {
            // Reschedule with the next earliest time
            let earliestTime: Date | null = null;
            pendingSyncTasks.forEach((time) => {
                if (!earliestTime || time < earliestTime) {
                    earliestTime = time;
                }
            });

            if (earliestTime) {
                // Cancel existing and reschedule
                BGTaskScheduler.sharedScheduler.cancelTaskRequestWithIdentifier(SYNC_TASK_IDENTIFIER);

                const request = BGAppRefreshTaskRequest.alloc().initWithIdentifier(SYNC_TASK_IDENTIFIER);
                request.earliestBeginDate = earliestTime;

                const errorRef = new interop.Reference<NSError>();
                //@ts-expect-error missing errorRef arg
                if (!BGTaskScheduler.sharedScheduler.submitTaskRequestError(request, errorRef)) {
                    throw wrapNativeException(errorRef.value);
                }
            }

            DEV_LOG && console.log('SyncService', 'rescheduled iOS background refresh for remaining tasks');
        }
    }
}
export const syncService = new SyncService();
