---
id: settings
title: Settings
sidebar_position: 6
slug: /settings
---

# Settings

Configure OSS Document Scanner and OSS CardWallet to match your preferences and workflow.

![Settings Screen](/img/settings-1.png)

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

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Theme | `theme.title` | Choose Light, Dark, Black, or Auto (system) |
| Color Theme | `color_theme.title` | Default, Dynamic colors, or E-ink |
| Auto Black | `auto_black` | Use true black for auto-dark theme |
| Columns | `nb_columns` | Number of columns in documents lists (1-7) |
| Columns (Landscape) | `nb_columns_landscape` | Number of columns to use in landscape |
| Document View Columns | `nb_columns_view` | Number of columns in document view |
| Document View Columns (Landscape) | `nb_columns_view_landscape` | Number of columns in document view while in landscape |

**CardWallet-specific:**

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Force White Background QRCode | `force_white_background_qrcode` | Some readers can't read black QRCode on white background |

## Security Settings
<!-- Translation keys: security, security_settings -->

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Allow App Screenshot | `allow_app_screenshot` | Allow screenshots of the app (Android only) |
| Biometric Lock | `biometric_lock` | Lock the application using biometrics / PIN code |
| Biometric Auto Lock | `biometric_auto_lock` | If enabled the app will lock whenever the app goes to background |

## Data Settings
<!-- Translation keys: data, data_settings -->
Storage and data settings.

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Storage Location | `storage_location` | Choose between Internal Storage or SD Card |

:::warning
Moving data between storage locations will restart the app and move all your documents.
:::

## Camera Settings
<!-- Translation keys: camera, camera_settings -->

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Use System Camera | `use_system_camera` | Use system camera instead of app view (Android only). When enabled some features like batch or auto-scan will be disabled |
| Start App on Camera | `start_app_on_cam` | The app will always start on camera. Changing this setting requires an app restart |

## Document Detection Settings
<!-- Translation keys: document_detection, document_detection_settings -->

| Setting | Translation Key | Description | Default |
|---------|----------------|-------------|---------|
| Crop Enabled | `crop_enabled` | Detect document edges and crop | Enabled |
| Always Prompt Crop Edit | `always_prompt_crop_edit` | When capturing from camera without batch mode, always prompt to confirm/edit the document region before creating the document | Disabled |
| Preview Resize Threshold | `preview_resize_threshold` | Size to which camera image is resized to detect documents. Bigger means better detection but slower | - |
| Document Not Detected Margin | `document_not_detected_margin` | If no document is found, corners are set to image size with a slight margin | - |
| Magnifier Sensitivity | `magnifier_sensitivity` | Sensitivity of the dragging of corners. 1 means as fast as your finger moves | 0.5 |

## Auto Scan Settings
<!-- Translation keys: autoscan, autoscan_settings -->

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Auto Scan | `auto_scan` | Discover and add documents automatically |
| Distance Threshold | `auto_scan_distance_threshold` | When the camera moves auto scan needs to determine if we are still seeing the same document. This is the distance threshold |
| Auto Scan Duration | `auto_scan_duration` | Duration in milliseconds before the document is added |
| Auto Scan Delay | `auto_scan_delay` | Delay before starting auto scan on a discovered document |

## Document Naming Settings
<!-- Translation keys: document_naming_template, document_naming_settings -->
Settings related to name of document and exported images/PDF.

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Document Name Date Format | `document_name_date_format` | Document name is created based on date of creation. This allows you to change the format |
| Use Document Name | `filename_use_document_name` | Use document name when possible for exported files |
| Filename Date Format | `filename_date_format` | Exported filename is based on current time. This allows you to change the format |

### Date Format Syntax

You can use:
- `ISO` for ISO 8601 format
- `timestamp` for epoch (duration in ms since 1970)
- Custom format using [Day.js format](https://day.js.org/docs/en/display/format)

## PDF Import Settings
<!-- Translation keys: pdf_import, pdf_import_settings -->

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| PDF Images Import Mode | `import_pdf_images` | Choose how to import images from a PDF |

**Import Modes:**
- **Ask Everytime** (`ask_everytime`) - Prompt for each PDF
- **Page as Image** (`pdf_one_image_per_page`) - Each page as an image
- **Find PDF Images** (`pdf_one_image_per_pdf_image`) - Find PDF images and import them (other data like text won't be imported)

## PDF Export Settings
<!-- Translation keys: pdf_export, pdf_export_settings -->

### General PDF Options

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Export Folder | `export_folder` | Folder where to write exported files (Android only) |
| PDF Password | `optional_pdf_password` | Optional password protection for exported PDFs |

### Page Layout Options

| Setting | Translation Key | Options |
|---------|----------------|---------|
| Paper Size | `paper_size` | A4, A3, Letter, Full |
| Page Orientation | `orientation` | Portrait, Landscape, Auto |
| Items Per Page | `items_per_page` | Number of pages per sheet (1, 2, 4, etc.) |
| Page Padding | `page_padding` | Margins around pages |

### Image Settings in PDF

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Image Size Threshold | `image_size_threshold` | Images inserted in PDF with width/height higher will be resized |
| Image Load Scale | `image_load_scale` | Scale applied to image inserted in PDF (0.5 - 10) |
| JPEG Quality | `jpeg_quality` | JPG compression level for exported PDF (0-100). Set to 0 to disable JPG compression |
| Draw OCR Text | `draw_ocr_text` | Add transparent OCR text layer in PDF |

## Image Settings
<!-- Translation keys: image_settings, image_settings_desc -->
All image related settings.

| Setting | Translation Key | Description | Options |
|---------|----------------|-------------|---------|
| Image Format | `image_format` | Image format to use throughout the app | PNG (better quality, bigger size), JPEG |
| Image Quality | `image_quality` | Compression quality (0-100) used for JPG images | 0-100 |

## Operations Settings
<!-- Translation keys: operations, operations_settings_desc -->
Settings related to operations applied on images.

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Parallel Operations | `transformer_batch_size` | Number of images to transform in parallel (1-10). More is faster but could crash the app because of memory usage |
| Image Processing Settings | `image_processing_settings` | Set transforms, brightness, contrast which will be applied on every new scan |

## Folders Settings
<!-- Translation keys: folders, folders_settings_desc -->

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Use Color for Background | `folder_color_as_background` | When enabled the folder color will be used as background color. Otherwise it will be used for the small folder icon |

## Sync Settings
<!-- Translation keys: sync, sync_settings_desc -->
Synchronization settings.

| Setting | Translation Key | Description |
|---------|----------------|-------------|
| Sync on Start | `sync_on_start` | Should the application try to sync documents on start |

### Sync Services

| Service | Translation Key | Description |
|---------|----------------|-------------|
| App Data Sync | `data_sync` | Sync app data so that you can use the app on multiple devices |
| Image Sync | `image_sync` | Sync documents images with applied filters, transformations |
| PDF Sync | `pdf_sync` | Sync documents PDFs with applied settings, filters, transforms |

See [Sync and Backup](/sync-and-backup) for detailed setup instructions.

## Backup / Restore
<!-- Translation keys: backup_restore -->

| Action | Translation Key | Description |
|--------|----------------|-------------|
| Export Settings | `export_settings` | Export all application settings so that you can import them later |
| Import Settings | `import_settings` | Import all settings from a previous backup |

## Other Settings

### Third Party Libraries
<!-- Translation key: third_parties -->
View list of third party libraries used in the app.

### Review Application
<!-- Translation key: review_application -->
Leave a review on the app store (Play Store builds only).

## Source Code Reference

Settings implementation can be found at:

| Feature | Location |
|---------|----------|
| Main Settings UI | `app/components/settings/Settings.svelte` (main settings component with all categories) |
| Security Service | `app/services/security.ts` |
| Documents Service | `app/services/documents.ts` |
| Translation Files | `app/i18n/*.json` |
| Constants | `app/utils/constants.ts` |

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
  "transformer_batch_size": "parallel operations"
}
```

This helps keep documentation synchronized with the actual app interface.
