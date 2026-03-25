import { Application, Utils } from '@nativescript/core';
import { BaseSyncService } from '~/services/sync.common';

// Export everything from common
export * from './sync.common';

// Constants for intent actions
// __APP_ID__ is a build-time constant representing the application package ID
export const SYNC_ALARM_ACTION = `${__APP_ID__}.SYNC_ALARM_ACTION`;
export const SYNC_THROTTLE_ALARM = `${__APP_ID__}.SYNC_THROTTLE_ALARM`;

let alarmManager: android.app.AlarmManager = null;
// const alarmReceiverRegistered = false;

/**
 * Initialize Android-specific sync alarm functionality
 */
// function initAndroidSyncAlarmImpl() {
//     if (alarmReceiverRegistered) {
//         return;
//     }

//     const context = Utils.android.getApplicationContext();
//     alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE) as android.app.AlarmManager;

//     // Register broadcast receiver for sync alarms
//     const filter = new android.content.IntentFilter(SYNC_THROTTLE_ALARM);
//     const receiver = new android.content.BroadcastReceiver({
//         onReceive(context: android.content.Context, intent: android.content.Intent) {
//             const serviceId = intent.getIntExtra('serviceId', -1);
//             DEV_LOG && console.log('SyncAlarmReceiver', 'received alarm for service', serviceId);

//             // Import syncService from common to trigger the sync
//             syncService.triggerThrottledSync(serviceId).catch((error) => {
//                 console.error('SyncAlarmReceiver', 'failed to trigger sync', error);
//             });
//         }
//     });

//     context.registerReceiver(receiver, filter);
//     alarmReceiverRegistered = true;

//     DEV_LOG && console.log('SyncService', 'Android alarm receiver registered');
// }

export class SyncService extends BaseSyncService {
    initThrottledSync() {
        const context = Utils.android.getApplicationContext();
        alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE) as android.app.AlarmManager;
    }
    /**
     * Schedule an alarm for a throttled sync
     * @param serviceId The sync service ID
     * @param delayMs Delay in milliseconds
     */
    scheduleThrottledSync(serviceId: number, delayMs: number) {
        try {
            DEV_LOG && console.log('scheduleThrottledSync', serviceId, delayMs);
            // if (!alarmManager) {
            //     initAndroidSyncAlarmImpl();
            // }

            const context = Utils.android.getApplicationContext();

            // Create intent for the SyncAlarmReceiver
            // Note: The receiver class must be in the same package as the main application
            const intent = new android.content.Intent(SYNC_ALARM_ACTION);
            intent.setPackage(context.getPackageName());
            intent.putExtra('serviceId', serviceId);

            const pendingIntent = android.app.PendingIntent.getBroadcast(
                context,
                serviceId, // Use serviceId as request code to allow cancellation
                intent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE
            );

            const triggerAtMillis = Date.now() + delayMs;

            // Use setExactAndAllowWhileIdle for reliable delivery even in Doze mode
            if (android.os.Build.VERSION.SDK_INT >= 23) {
                alarmManager.setExactAndAllowWhileIdle(android.app.AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
            } else {
                alarmManager.setExact(android.app.AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
            }

            DEV_LOG && console.log('SyncService', 'scheduled Android alarm for service', serviceId, 'in', delayMs, 'ms');
        } catch (error) {
            DEV_LOG && console.error('failed to schedule alarm sync', error, error.stack);
        }
    }

    /**
     * Cancel a scheduled alarm for a sync service
     * @param serviceId The sync service ID
     */
    cancelThrottledSync(serviceId: number) {
        if (!alarmManager) {
            return;
        }

        const context = Utils.android.getApplicationContext();
        const intent = new android.content.Intent(SYNC_ALARM_ACTION);
        intent.setPackage(context.getPackageName());

        const pendingIntent = android.app.PendingIntent.getBroadcast(context, serviceId, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);

        alarmManager.cancel(pendingIntent);
        pendingIntent.cancel();

        DEV_LOG && console.log('SyncService', 'cancelled Android alarm for service', serviceId);
    }
}
export const syncService = new SyncService();
