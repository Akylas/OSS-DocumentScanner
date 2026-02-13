import { ApplicationSettings, Utils } from '@nativescript/core';
import { SDK_VERSION } from '@nativescript/core/utils';
import { SETTINGS_QUICK_TOGGLE_ENABLED } from '~/utils/constants';

export function updateQuickToggle() {
    const enabled = ApplicationSettings.getBoolean(SETTINGS_QUICK_TOGGLE_ENABLED, false);
    const context = Utils.android.getApplicationContext();
    const component = new android.content.ComponentName(context, '__PACKAGE__.QuickToggleService');
    DEV_LOG && console.log('updateQuickToggle', component, '__PACKAGE__.QuickToggleService', enabled);
    const pm = context.getPackageManager();

    if (enabled) {
        pm.setComponentEnabledSetting(component, android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED, android.content.pm.PackageManager.DONT_KILL_APP);

        android.service.quicksettings.TileService.requestListeningState(context, component);
    } else {
        pm.setComponentEnabledSetting(component, android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED, android.content.pm.PackageManager.DONT_KILL_APP);
    }
}

export function toggleQuickSetting(enable: boolean) {
    ApplicationSettings.setBoolean(SETTINGS_QUICK_TOGGLE_ENABLED, enable);
    updateQuickToggle();
}

@NativeClass()
@JavaProxy('__PACKAGE__.QuickToggleService')
export class QuickToggleService extends android.service.quicksettings.TileService {
    constructor() {
        super();
        return global.__native(this);
    }

    onClick(): void {
        const context = this.getApplicationContext();

        // Get the launch intent for your app
        const pm = context.getPackageManager();
        const intent = pm.getLaunchIntentForPackage(context.getPackageName());
        DEV_LOG && console.log('quicktile onClick', context.getPackageName(), intent);

        if (!intent) {
            return;
        }
        // Set flags to bring existing activity to front if running
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if (SDK_VERSION >= 14) {
            this.startActivityAndCollapse(android.app.PendingIntent.getActivity(context, 0, intent, android.app.PendingIntent.FLAG_IMMUTABLE));
        } else {
            this.startActivityAndCollapse(intent);
        }
    }

    onStartListening(): void {
        super.onStartListening();
        // Optional: update tile state or icon dynamically
        // const tile = this.getQsTile?.();
        // if (tile) {
        //     tile.setLabel('My App');
        //     tile.updateTile();
        // }
    }

    onStopListening(): void {
        super.onStopListening();
    }
}
