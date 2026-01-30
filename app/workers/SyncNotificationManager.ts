import { Utils } from '@nativescript/core';

export class SyncNotificationManager {
    private static CHANNEL_ID = 'document_sync_channel';
    private static NOTIFICATION_ID = 1001;
    private notificationManager: android.app.NotificationManager;
    private notificationBuilder: androidx.core.app.NotificationCompat.Builder;
    private context: android.content.Context;

    constructor() {
        if (!__ANDROID__) {
            return;
        }
        this.context = Utils.android.getApplicationContext();
        this.notificationManager = this.context.getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager;
        this.createNotificationChannel();
    }

    private createNotificationChannel(): void {
        if (!__ANDROID__ || android.os.Build.VERSION.SDK_INT < 26) {
            return;
        }

        const name = 'Document Sync';
        const description = 'Notifications for document synchronization progress';
        const importance = android.app.NotificationManager.IMPORTANCE_LOW;
        const channel = new android.app.NotificationChannel(SyncNotificationManager.CHANNEL_ID, name, importance);
        channel.setDescription(description);
        channel.setSound(null, null);
        this.notificationManager.createNotificationChannel(channel);
    }

    public showSyncStarted(): void {
        if (!__ANDROID__) {
            return;
        }

        this.notificationBuilder = new androidx.core.app.NotificationCompat.Builder(this.context, SyncNotificationManager.CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setContentTitle('Syncing documents')
            .setContentText('Preparing to sync...')
            .setPriority(androidx.core.app.NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .setProgress(0, 0, true); // Indeterminate progress

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());
    }

    public updateProgress(current: number, total: number, documentName?: string): void {
        if (!__ANDROID__ || !this.notificationBuilder) {
            return;
        }

        const contentText = documentName ? `Syncing: ${documentName}` : 'Syncing documents...';
        
        this.notificationBuilder
            .setContentText(contentText)
            .setProgress(total, current, false);

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());
    }

    public showSyncComplete(): void {
        if (!__ANDROID__ || !this.notificationBuilder) {
            return;
        }

        this.notificationBuilder
            .setContentTitle('Sync complete')
            .setContentText('All documents synced successfully')
            .setProgress(0, 0, false)
            .setOngoing(false);

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());

        // Auto-dismiss after 2 seconds
        setTimeout(() => this.dismissNotification(), 2000);
    }

    public showSyncError(error: string): void {
        if (!__ANDROID__ || !this.notificationBuilder) {
            return;
        }

        this.notificationBuilder
            .setContentTitle('Sync failed')
            .setContentText(error || 'An error occurred during sync')
            .setProgress(0, 0, false)
            .setOngoing(false);

        this.notificationManager.notify(SyncNotificationManager.NOTIFICATION_ID, this.notificationBuilder.build());

        // Auto-dismiss after 5 seconds
        setTimeout(() => this.dismissNotification(), 5000);
    }

    public dismissNotification(): void {
        if (!__ANDROID__) {
            return;
        }
        this.notificationManager.cancel(SyncNotificationManager.NOTIFICATION_ID);
        this.notificationBuilder = null;
    }
}
