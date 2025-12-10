export interface BackupService {
    createBackup(): Promise<string>;
    restoreBackup(zipPath: string): Promise<void>;
}
