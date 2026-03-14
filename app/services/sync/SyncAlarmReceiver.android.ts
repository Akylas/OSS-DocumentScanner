import { Utils } from '@nativescript/core';
import { SYNC_ALARM_ACTION, SYNC_THROTTLE_ALARM } from '../sync.android';

/**
 * BroadcastReceiver for handling sync alarms on Android
 * Note: __PACKAGE__ is a build-time constant that gets replaced with the app package name
 * This must match the package name in AndroidManifest.xml
 */
@NativeClass()
@JavaProxy('__PACKAGE__.SyncAlarmReceiver')
export class SyncAlarmReceiver extends android.content.BroadcastReceiver {
    onReceive(context: android.content.Context, intent: android.content.Intent): void {
        const action = intent.getAction();
        DEV_LOG && console.log('SyncAlarmReceiver', 'onReceive', action);
        
        // Check if this is our sync alarm action
        if (action !== SYNC_ALARM_ACTION) {
            return;
        }
        
        const serviceId = intent.getIntExtra('serviceId', -1);
        if (serviceId === -1) {
            return;
        }

        // Send broadcast to trigger sync in the app
        const syncIntent = new android.content.Intent(SYNC_THROTTLE_ALARM);
        syncIntent.putExtra('serviceId', serviceId);
        context.sendBroadcast(syncIntent);
    }
}
