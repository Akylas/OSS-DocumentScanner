import { lc } from '@nativescript-community/l';
import { Utils } from '@nativescript/core';
import { SDK_VERSION } from '@nativescript/core/utils';

export class SyncNotificationManager {
    private static CHANNEL_ID = 'document_sync_channel';
    private static NOTIFICATION_ID = 1001;
    private notificationManager: android.app.NotificationManager;
    private notificationBuilder: androidx.core.app.NotificationCompat.Builder;
    private context: android.content.Context;

    constructor() {
        this.context = Utils.android.getApplicationContext();
        this.notificationManager = this.context.getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager;
        this.createNotificationChannel();
    }

    private createNotificationChannel(): void {
        if (SDK_VERSION < 26) {
            return;
        }

        const name = lc('sync_channel');
        const description = lc('sync_channel_desc');
        const importance = android.app.NotificationManager.IMPORTANCE_LOW;
        const channel = new android.app.NotificationChannel(SyncNotificationManager.CHANNEL_ID, name, importance);
        channel.setDescription(description);
        this.notificationManager.createNotificationChannel(channel);
    }

    public showSyncStarted(): void {
        this.notificationBuilder = new androidx.core.app.NotificationCompat.Builder(this.context, SyncNotificationManager.CHANNEL_ID)
            .setSmallIcon(17301628 /* Utils.android.resources.getDrawableId('stat_sync_animated') */)
            .setContentTitle(lc('syncing_documents'))
            .setContentText(lc('syncing_documents') + '...')
            .setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW)
            .setTicker(lc('syncing_documents') + '...')
            .setOngoing(true)
            .setProgress(0, 0, true); // Indeterminate progress

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());
    }

    public updateProgress(current: number, total: number, documentName?: string): void {
        if (!this.notificationBuilder) {
            return;
        }

        const contentText = documentName ? lc('syncing', documentName) : lc('syncing_documents') + '...';

        this.notificationBuilder.setContentText(contentText).setProgress(total, current, false);

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());
    }

    public showSyncComplete(): void {
        this.dismissNotification();
    }

    public showSyncError(error: string): void {
        this.dismissNotification();
    }

    public dismissNotification(): void {
        this.notificationManager.cancel(SyncNotificationManager.NOTIFICATION_ID);
        this.notificationBuilder = null;
    }
}
