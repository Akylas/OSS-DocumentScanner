---
id: settings
title: Settings
sidebar_position: 6
slug: /settings
---

# Settings

Configure OSS Document Scanner and OSS CardWallet to match your preferences and workflow.

:::tip Translation Keys
Settings names and descriptions use translation keys from the app's i18n system (`app/i18n/`). This ensures documentation stays in sync with the app interface.
:::

## General Settings

### Language
<!-- Translation key: language -->
Change the app interface language.

1. Go to **Settings** > **Language**
2. Select your preferred language
3. App restarts with new language

Supported languages include English, French, German, Spanish, and [many more contributed via Weblate](https://hosted.weblate.org/engage/oss-document-scanner/).

### Appearance
<!-- Translation keys: appearance, appearance_settings -->
Theme and other appearance settings.

| Setting | Description |
|---------|----------------|-------------|
| Theme | Choose Light, Dark, Black, or Auto (system) |
| Color Theme| Default, Dynamic colors, or E-ink |
| Auto Black | Use true black for auto-dark theme |
| Columns | Number of columns in documents lists (1-7) |
| Columns (Landscape) | Number of columns to use in landscape |
| Document View Columns | Number of columns in document view |
| Document View Columns (Landscape) | Number of columns in document view while in landscape |

**Android-specific:**

| Setting | Description |
|---------|----------------|-------------|
| Show Quick Settings Tile | Show Quick Settings tile to open the app directly from the notification shade |

## Security Settings

| Setting | Description |
|---------|----------------|-------------|
| Allow App Screenshot | Allow screenshots of the app (Android only) |
| Biometric Lock | Lock the application using biometrics / PIN code |
| Biometric Auto Lock | If enabled the app will lock whenever the app goes to background |

## Data Settings
Storage and data settings.

| Setting | Description |
|---------|----------------|-------------|
| Storage Location | Choose between Internal Storage or SD Card |

:::warning
Moving data between storage locations will restart the app and move all your documents.
:::

## Camera Settings

| Setting | Description |
|---------|----------------|-------------|
| Use System Camera | Use system camera instead of app view (Android only). When enabled some features like batch or auto-scan will be disabled |
| Start App on Camera | The app will always start on camera. Changing this setting requires an app restart |
| Front Camera Mirrored | Whether the front camera preview should be mirrored |

## Document Detection Settings

| Setting | Description | Default |
|---------|----------------|-------------|---------|
| Crop Enabled | Detect document edges and crop | Enabled |
| Always Prompt Crop Edit | When capturing from camera without batch mode, always prompt to confirm/edit the document region before creating the document | Disabled |
| Preview Resize Threshold | Size to which camera image is resized to detect documents. Bigger means better detection but slower | - |
| Document Not Detected Margin | If no document is found, corners are set to image size with a slight margin | - |
| Magnifier Sensitivity | Sensitivity of the dragging of corners. 1 means as fast as your finger moves | 0.5 |

## Auto Scan Settings

| Setting | Description |
|---------|----------------|-------------|
| Auto Scan | Discover and add documents automatically |
| Distance Threshold | When the camera moves auto scan needs to determine if we are still seeing the same document. This is the distance threshold |
| Auto Scan Duration | Duration in milliseconds before the document is added |
| Auto Scan Delay | Delay before starting auto scan on a discovered document |

## OCR Settings
Optical Character Recognition settings for text detection in scanned documents.

| Setting | Description |
|---------|----------------|-------------|
| OCR Enabled | OCR will be triggered on every document change using the languages you select |
| OCR Languages | Select which languages to use for text detection. Download language models as needed |

### OCR Features

- **Detect Text**: Automatically detect and extract text from scanned documents
- **Detect and Copy**: Quickly detect text and copy it to clipboard
- **Transparent OCR Text in PDF**: Add searchable text layer in exported PDFs

:::info
OCR models need to be downloaded before use. The app will prompt you to download missing language models when needed.
:::

## Document Naming Settings
Settings related to name of document and exported images/PDF.

| Setting | Description |
|---------|----------------|-------------|
| Document Name Date Format | Document name is created based on date of creation. This allows you to change the format |
| Use Document Name | Use document name when possible for exported files |
| Filename Date Format | Exported filename is based on current time. This allows you to change the format |

### Date Format Syntax

You can use:
- `ISO` for ISO 8601 format
- `timestamp` for epoch (duration in ms since 1970)
- Custom format using [Day.js format](https://day.js.org/docs/en/display/format)

## PDF Import Settings

| Setting | Description |
|---------|----------------|-------------|
| PDF Images Import Mode | Choose how to import images from a PDF |

**Import Modes:**
- **Ask Everytime** - Prompt for each PDF
- **Page as Image** - Each page as an image
- **Find PDF Images** - Find PDF images and import them (other data like text won't be imported)

## PDF Export Settings

### General PDF Options

| Setting | Description |
|---------|----------------|-------------|
| Export Folder | Folder where to write exported files (Android only) |
| PDF Password | Optional password protection for exported PDFs |

### Page Layout Options

| Setting | Options |
|---------|----------------|---------|
| Paper Size | A4, A3, Letter, Full |
| Page Orientation | Portrait, Landscape, Auto |
| Items Per Page | Number of pages per sheet (1, 2, 4, etc.) |
| Page Padding | Margins around pages |

### Image Settings in PDF

| Setting | Description |
|---------|----------------|-------------|
| Image Size Threshold | Images inserted in PDF with width/height higher will be resized |
| Image Load Scale | Scale applied to image inserted in PDF (0.5 - 10) |
| JPEG Quality | JPG compression level for exported PDF (0-100). Set to 0 to disable JPG compression |
| Draw OCR Text | Add transparent OCR text layer in PDF |

## Image Settings
All image related settings.

| Setting | Description | Options |
|---------|----------------|-------------|---------|
| Image Format | Image format to use throughout the app | PNG (better quality, bigger size), JPEG |
| Image Quality | Compression quality (0-100) used for JPG images | 0-100 |

## Operations Settings
Settings related to operations applied on images.

| Setting | Description |
|---------|----------------|-------------|
| Parallel Operations | Number of images to transform in parallel (1-10). More is faster but could crash the app because of memory usage |
| Image Processing Settings | Set transforms, brightness, contrast which will be applied on every new scan |

## Folders Settings

| Setting | Description |
|---------|----------------|-------------|
| Use Color for Background | When enabled the folder color will be used as background color. Otherwise it will be used for the small folder icon |

## Sync Settings
Synchronization settings.

| Setting | Description |
|---------|----------------|-------------|
| Sync on Start | Should the application try to sync documents on start |

### Sync Services

| Service | Description |
|---------|----------------|-------------|
| App Data Sync | Sync app data so that you can use the app on multiple devices |
| Image Sync | Sync documents images with applied filters, transformations |
| PDF Sync | Sync documents PDFs with applied settings, filters, transforms |

See [Sync and Backup](/sync-and-backup) for detailed setup instructions.

## Backup / Restore

| Action | Description |
|--------|----------------|-------------|
| Export Settings | Export all application settings so that you can import them later |
| Import Settings | Import all settings from a previous backup |

## Other Settings

### Third Party Libraries
View list of third party libraries used in the app.

### Review Application
Leave a review on the app store (Play Store builds only).

## Translation Key Reference

All settings use translation keys from `app/i18n/en.json`. When contributing to documentation, reference these keys to ensure accuracy:

```json
{
  "auto_scan": "discover and add documents automatically",
  "crop_enabled": "detect document edges and crop",
  "biometric_lock": "Biometric security",
  "sync_on_start": "sync on start",
  "image_format": "image format",
  "image_quality": "image quality",
  "pdf_export": "PDF export",
  "transformer_batch_size": "parallel operations",
  "front_cam_mirrored": "front camera mirrored",
  "show_quicksettings_tile": "show Quick Settings tile",
  "ocr_enabled": "OCR Enabled",
  "ocr_copy_text": "Detect and copy"
}
```

This helps keep documentation synchronized with the actual app interface.
