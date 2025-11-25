---
id: settings
title: Settings
sidebar_position: 6
slug: /settings
---

# Settings

Configure OSS Document Scanner to match your preferences and workflow.

![Settings Screen](/img/settings-1.png)

## General Settings

### Language

Change the app interface language:

1. Go to **Settings** > **Language**
2. Select your preferred language
3. App restarts with new language

Supported languages include English, French, German, Spanish, and [many more contributed via Weblate](https://hosted.weblate.org/engage/oss-document-scanner/).

### Theme

Choose your visual preference:

| Theme | Description |
|-------|-------------|
| Light | Bright interface |
| Dark | Dark interface, easier on eyes |
| System | Follows device theme setting |

### Storage Location

Configure where documents are saved:

- **Internal Storage**: Default app storage
- **Custom Folder**: Choose specific folder
- **External SD Card**: Save to SD card (Android)

## Camera Settings

### Capture Quality

| Quality | Resolution | Use Case |
|---------|------------|----------|
| Standard | 1080p | Quick scans, small files |
| High | 4K | Good quality, moderate files |
| Maximum | Sensor max | Best quality, large files |

### Auto Capture

Configure automatic capture behavior:

- **Sensitivity**: How quickly to capture when document is detected
- **Stability Requirement**: Motion blur prevention level
- **Edge Detection Threshold**: How strictly edges must be detected

### Flash Default

Set default flash mode:

- Auto (recommended)
- On
- Off

### Grid Overlay

Show alignment grid in viewfinder:

- Off
- Rule of thirds
- Document guides

## Document Settings

### Default Filter

Set the filter applied to new scans:

- Original (no processing)
- Black & White
- Grayscale
- Enhanced
- Document

### Auto-Enhancement

Enable automatic image enhancement:

- Shadow removal
- Brightness optimization
- Contrast adjustment

### OCR Language

Set default language(s) for text recognition:

1. Go to **Settings** > **OCR**
2. Download required language packs
3. Select default languages

## Export Settings

### Default PDF Settings

| Setting | Options |
|---------|---------|
| Page Size | A4, Letter, Original |
| Quality | Low, Medium, High |
| Include OCR | Yes/No |

### Default Image Format

- JPEG (smaller files)
- PNG (lossless)

### Image Quality

Set default JPEG quality (1-100%)

### File Naming Pattern

Customize exported file names:

```
Document_{date}_{time}
Scan_{index}
{title}_{date}
```

## Sync Settings

### Sync Service

- None (disabled)
- WebDAV

### Sync Frequency

| Option | Behavior |
|--------|----------|
| Manual | Only sync when requested |
| On Change | Sync after each document edit |
| Hourly | Automatic sync every hour |
| Daily | Automatic sync once per day |

### Sync Options

- **Sync on WiFi only**: Save mobile data
- **Sync in background**: Continue syncing when app is closed
- **Show notifications**: Alert when sync completes

See [Sync and Backup](/sync-and-backup) for detailed setup instructions.

## Privacy & Security

### App Lock

Secure the app with biometric or PIN:

1. Go to **Settings** > **Security**
2. Enable **App Lock**
3. Set up PIN or enable biometric
4. App requires authentication on launch

### Document Encryption

Encrypt stored documents:

- Requires password to access documents
- Cannot be recovered if password is lost
- Optional per-document encryption

### Clear Data

Remove all app data:

1. Go to **Settings** > **Privacy**
2. Select **Clear All Data**
3. Confirm deletion
4. All documents and settings are removed

:::warning
Clear Data is irreversible. Make a backup first!
:::

## Advanced Settings

### Storage Management

View and manage storage usage:

- Total documents
- Storage used
- Cache size
- Clear cache option

### Debug Mode

Enable detailed logging for troubleshooting:

1. Go to **Settings** > **Advanced**
2. Enable **Debug Mode**
3. Reproduce the issue
4. Export logs from **Settings** > **Export Logs**

### Reset Settings

Restore default settings:

1. Go to **Settings** > **Advanced**
2. Select **Reset to Defaults**
3. Confirm reset
4. Settings are restored (documents preserved)

## Permissions

### Required Permissions

| Permission | Purpose |
|------------|---------|
| Camera | Scanning documents |
| Storage | Saving documents |

### Optional Permissions

| Permission | Purpose |
|------------|---------|
| Location | Geotagging documents |
| Notifications | Sync status alerts |
| Background | Background sync |

### Managing Permissions

1. Go to device **Settings**
2. Find OSS Document Scanner
3. Select **Permissions**
4. Enable/disable as needed

## Source Code Reference

Settings implementation:

| Feature | Location |
|---------|----------|
| Preferences Service | `app/services/preferences.ts` |
| Settings UI | `app/components/settings/` |
| Security Service | `app/services/security.ts` |
| Platform Settings | `app/android/` and `app/ios/` |

## Tips

### Optimize for Speed

- Use Standard quality capture
- Disable auto-enhancement
- Use JPEG format exports
- Disable OCR for non-text documents

### Optimize for Quality

- Use Maximum quality capture
- Enable auto-enhancement
- Use PDF with OCR for archival
- Use 300 DPI for exports

### Optimize for Storage

- Use Black & White filter
- Enable compression
- Use Standard quality
- Clear cache regularly
