import { Utils } from '@nativescript/core';

/**
 * BroadcastReceiver for handling sync alarms on Android
 */
@NativeClass()
@JavaProxy('__PACKAGE__.SyncAlarmReceiver')
export class SyncAlarmReceiver extends android.content.BroadcastReceiver {
    onReceive(context: android.content.Context, intent: android.content.Intent): void {
        DEV_LOG && console.log('SyncAlarmReceiver', 'onReceive', intent.getAction());
        
        const serviceId = intent.getIntExtra('serviceId', -1);
        if (serviceId === -1) {
            return;
        }

        // Send broadcast to trigger sync in the app
        const syncIntent = new android.content.Intent(`${__APP_ID__}.SYNC_THROTTLE_ALARM`);
        syncIntent.putExtra('serviceId', serviceId);
        context.sendBroadcast(syncIntent);
    }
}
