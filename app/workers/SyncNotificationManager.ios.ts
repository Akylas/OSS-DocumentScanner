export class SyncNotificationManager {
    constructor() {}

    public showSyncStarted(): void {}

    public updateProgress(current: number, total: number, documentName?: string): void {}

    public showSyncComplete(): void {}

    public showSyncError(error: string): void {}

    public dismissNotification(): void {}
}
