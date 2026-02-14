import { SDK_VERSION } from '@nativescript/core/utils';

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
