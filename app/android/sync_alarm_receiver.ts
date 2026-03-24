import { Application, Utils } from '@nativescript/core';
import { SYNC_ALARM_ACTION, SYNC_THROTTLE_ALARM, syncService } from '../services/sync.android';
import { start } from '~/startHandler';

/**
 * BroadcastReceiver for handling sync alarms on Android
 */
@NativeClass()
@JavaProxy('__PACKAGE__.SyncAlarmReceiver')
export class SyncAlarmReceiver extends android.content.BroadcastReceiver {
    async onReceive(context: android.content.Context, intent: android.content.Intent) {
        const action = intent.getAction();

        // Check if this is our sync alarm action
        if (action !== SYNC_ALARM_ACTION) {
            return;
        }

        const serviceId = intent.getLongExtra('serviceId', -1);
        if (serviceId === -1) {
            return;
        }

        DEV_LOG && console.log('SyncAlarmReceiver', 'onReceive', action, serviceId, Application.servicesStarted);
        function handleIntent() {
            syncService.triggerThrottledSync(serviceId).catch((error) => {
                console.error('SyncAlarmReceiver', 'failed to trigger sync', error);
            });
        }
        try {
            await start();
            handleIntent();
        } catch (error) {
            console.error(error, error.stack);
        }
    }
}
