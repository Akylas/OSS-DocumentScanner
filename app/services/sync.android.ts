import { Application, Utils } from '@nativescript/core';

let alarmManager: android.app.AlarmManager = null;
let alarmReceiverRegistered = false;

/**
 * Initialize Android-specific sync alarm functionality
 */
export function initAndroidSyncAlarms() {
    if (alarmReceiverRegistered) {
        return;
    }

    const context = Utils.android.getApplicationContext();
    alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE) as android.app.AlarmManager;

    // Register broadcast receiver for sync alarms
    const filter = new android.content.IntentFilter(`${__APP_ID__}.SYNC_THROTTLE_ALARM`);
    const receiver = new android.content.BroadcastReceiver({
        onReceive(context: android.content.Context, intent: android.content.Intent) {
            const serviceId = intent.getIntExtra('serviceId', -1);
            DEV_LOG && console.log('SyncAlarmReceiver', 'received alarm for service', serviceId);
            
            // Import dynamically to avoid circular dependency
            import('../sync').then(({ syncService }) => {
                // Trigger sync for this service
                syncService.triggerThrottledSync(serviceId);
            });
        }
    });

    context.registerReceiver(receiver, filter);
    alarmReceiverRegistered = true;

    DEV_LOG && console.log('SyncService', 'Android alarm receiver registered');
}

/**
 * Schedule an alarm for a throttled sync
 * @param serviceId The sync service ID
 * @param delayMs Delay in milliseconds
 */
export function scheduleAndroidSyncAlarm(serviceId: number, delayMs: number) {
    if (!alarmManager) {
        initAndroidSyncAlarms();
    }

    const context = Utils.android.getApplicationContext();
    const intent = new android.content.Intent(context, (com as any).tns.SyncAlarmReceiver.class);
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
        alarmManager.setExactAndAllowWhileIdle(
            android.app.AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            pendingIntent
        );
    } else {
        alarmManager.setExact(
            android.app.AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            pendingIntent
        );
    }

    DEV_LOG && console.log('SyncService', 'scheduled Android alarm for service', serviceId, 'in', delayMs, 'ms');
}

/**
 * Cancel a scheduled alarm for a sync service
 * @param serviceId The sync service ID
 */
export function cancelAndroidSyncAlarm(serviceId: number) {
    if (!alarmManager) {
        return;
    }

    const context = Utils.android.getApplicationContext();
    const intent = new android.content.Intent(context, (com as any).tns.SyncAlarmReceiver.class);
    const pendingIntent = android.app.PendingIntent.getBroadcast(
        context,
        serviceId,
        intent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE
    );

    alarmManager.cancel(pendingIntent);
    pendingIntent.cancel();

    DEV_LOG && console.log('SyncService', 'cancelled Android alarm for service', serviceId);
}
