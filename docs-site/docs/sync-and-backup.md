---
id: sync-and-backup
title: Sync and Backup
sidebar_position: 5
slug: /sync-and-backup
---

# Sync and Backup

Keep your documents safe and accessible across devices with OSS Document Scanner's sync and backup features.

![Sync Settings](/img/sync-1.png)

## Sync Options

### WebDAV Sync

Connect to any WebDAV-compatible server:

#### Supported Services

- Nextcloud
- ownCloud
- Synology NAS
- QNAP NAS
- Any WebDAV server

#### Setup WebDAV

1. Go to **Settings** > **Sync**
2. Select **WebDAV**
3. Enter your server details:
   - **Server URL**: Your WebDAV endpoint
   - **Username**: Your account username
   - **Password**: Your account password
4. Tap **Test Connection**
5. Select sync folder
6. Enable sync

#### WebDAV Configuration

| Setting | Description |
|---------|-------------|
| Server URL | Full WebDAV URL (e.g., `https://cloud.example.com/remote.php/webdav/`) |
| Username | Account username |
| Password | Account password or app token |
| Sync Folder | Remote folder for documents |

### Local Backup

Create backups on device storage:

1. Go to **Settings** > **Backup**
2. Select **Create Backup**
3. Choose backup location
4. Backup is created as ZIP archive

### Restore from Backup

1. Go to **Settings** > **Backup**
2. Select **Restore Backup**
3. Choose backup file
4. Confirm restore (existing documents may be overwritten)

## Sync Behavior

### Automatic Sync

When enabled, documents sync automatically:

- On document creation
- On document modification
- On app launch (configurable)
- Periodically in background (if permitted)

### Manual Sync

Trigger sync manually:

1. Pull down on document list to refresh
2. Or go to **Settings** > **Sync** > **Sync Now**

### Sync Direction

Configure sync behavior:

| Mode | Description |
|------|-------------|
| Two-way | Changes sync both directions |
| Upload only | Only send changes to server |
| Download only | Only receive changes from server |

## Conflict Handling

When the same document is modified on multiple devices:

### Automatic Resolution

The app attempts to resolve conflicts automatically:

1. Compare modification timestamps
2. Most recent change wins
3. Older version may be archived

### Manual Resolution

For complex conflicts:

1. Notification appears about conflict
2. View both versions
3. Choose which to keep:
   - **Keep Local**: Use your device's version
   - **Keep Remote**: Use the server's version
   - **Keep Both**: Create a copy of each

### Preventing Conflicts

- Sync frequently
- Avoid editing same document on multiple devices simultaneously
- Use different folders for different devices

## Cloud Storage Setup

### Nextcloud

1. Log into your Nextcloud instance
2. Go to **Settings** > **Security** > **Devices & sessions**
3. Create an app password for OSS Document Scanner
4. In the app, enter:
   - URL: `https://your-nextcloud.com/remote.php/webdav/`
   - Use app password instead of main password

### Synology NAS

1. Enable WebDAV Server package on your NAS
2. Configure HTTPS (recommended)
3. In the app, enter:
   - URL: `https://your-nas-ip:5006/` (or custom port)
   - Use your Synology account credentials

### Generic WebDAV

1. Ensure WebDAV is enabled on your server
2. Note the WebDAV endpoint URL
3. Create credentials if needed
4. Test connection in app settings

## Backup Best Practices

### Regular Backups

- Schedule regular local backups
- Store backups in multiple locations
- Test restore process periodically

### What's Included

Backups contain:

- All scanned documents (images)
- Document metadata
- Folder structure
- App settings (optional)
- OCR data (optional)

### What's NOT Included

- Cache files
- Temporary files
- Sync credentials (for security)

## Data Security

### Encryption

- Credentials are stored securely using platform keychain
- Data in transit uses HTTPS (when configured)
- Local storage uses device encryption

### Privacy

- No data sent to third parties
- Sync only to servers you configure
- All processing happens on-device

## Source Code Reference

Sync functionality is implemented in:

| Feature | Location |
|---------|----------|
| Sync Service | `app/services/sync/` |
| WebDAV Client | `app/webdav/` |
| Backup Logic | `app/services/` |
| Sync UI | `app/components/settings/` |

## Troubleshooting

### Connection Failed

- Verify server URL is correct
- Check username and password
- Ensure server is accessible
- Try disabling VPN if active
- Check firewall settings

### Sync Not Starting

- Check internet connection
- Verify sync is enabled
- Check background app restrictions
- Review battery optimization settings

### Conflicts Keep Occurring

- Sync more frequently
- Check device clocks are correct
- Avoid simultaneous edits
- Use upload-only mode on secondary devices

### Backup Restore Issues

- Ensure backup file is not corrupted
- Check available storage space
- Try restoring to a fresh install
- Verify backup was created successfully
