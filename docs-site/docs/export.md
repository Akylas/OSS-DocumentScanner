---
id: export
title: Export Documents
sidebar_position: 4
slug: /export
---

# Exporting Documents

OSS Document Scanner supports multiple export formats and sharing options to get your documents where you need them.

![Export Options](/img/export-1.png)

## Export Formats

### PDF Export

The most versatile format for document sharing:

#### Standard PDF

- Contains scanned images as pages
- Compact file size
- Universally compatible

#### PDF with OCR (Searchable PDF)

- Includes invisible text layer from OCR
- Text is searchable and selectable
- Best for archival purposes

#### PDF Settings

Configure PDF export options:

| Setting | Description |
|---------|-------------|
| Page Size | A4, Letter, Original size, or custom |
| Orientation | Portrait, Landscape, or Auto |
| Margins | None, Small, Medium, Large |
| Quality | Low, Medium, High, Maximum |
| Compression | JPEG, PNG, or mixed |

### Image Export

Export as individual image files:

#### JPEG

- Smaller file sizes
- Configurable quality (1-100%)
- Best for photos and color documents
- Widely compatible

#### PNG

- Lossless compression
- Larger file sizes
- Best for text documents
- Supports transparency

#### Image Settings

| Setting | Description |
|---------|-------------|
| Quality | 1-100% (JPEG only) |
| Resolution | Original, 150 DPI, 300 DPI, 600 DPI |
| Color Space | Color, Grayscale, Black & White |

### Other Formats

#### TIFF

- Professional archival format
- Lossless compression options
- Multi-page support
- Larger file sizes

## Export Methods

### Share

Use the system share sheet to send documents:

1. Open the document
2. Tap **Share**
3. Select export format
4. Choose destination app

Compatible with:
- Email apps
- Messaging apps
- Cloud storage apps
- Other document apps

### Save to Device

Save exports to local storage:

1. Open the document
2. Tap **Export**
3. Choose format and settings
4. Select save location
5. Tap **Save**

### Print

Print documents directly:

1. Open the document
2. Tap **Print**
3. Select printer
4. Configure print settings
5. Tap **Print**

:::tip Printing Tips
For best results, export as PDF first, then print. This ensures consistent formatting across different printers.
:::

## Batch Export

Export multiple documents at once:

### Selecting Documents

1. Go to the document list
2. Long-press to enter selection mode
3. Select multiple documents
4. Tap **Export**

### Batch Options

- **Single PDF**: Combine all documents into one PDF
- **Separate PDFs**: Export each document as individual PDF
- **Image Archive**: Export all as images in a ZIP file
- **Individual Images**: Export each page as separate image

## Export Quality Guide

### For Printing

- Format: PDF
- Resolution: 300 DPI minimum
- Quality: High or Maximum
- Color: Based on document type

### For Email

- Format: PDF (compressed) or JPEG
- Resolution: 150 DPI
- Quality: Medium
- Consider file size limits

### For Archival

- Format: PDF with OCR or TIFF
- Resolution: 300-600 DPI
- Quality: Maximum
- Color: Original

### For Web Upload

- Format: JPEG or PDF
- Resolution: 150 DPI or lower
- Quality: Medium
- Optimize for file size

## File Naming

### Automatic Naming

Default naming pattern: `Document_YYYY-MM-DD_HHMMSS`

### Custom Naming

Customize the naming pattern in settings:

- `{date}` - Capture date
- `{time}` - Capture time
- `{index}` - Sequential number
- `{title}` - Document title

### Batch Naming

For batch exports:
- Sequential numbering is added automatically
- Custom prefix can be specified

## Cloud Integration

Direct export to cloud services (when configured):

- Google Drive
- Dropbox
- OneDrive
- WebDAV servers
- Custom cloud storage

See [Sync and Backup](/sync-and-backup) for setup instructions.

## Source Code Reference

Export functionality is implemented in:

| Feature | Location |
|---------|----------|
| PDF Generation | `app/services/pdf/` |
| Export UI | `app/components/` |
| Document Service | `app/services/documents.ts` |
| Share Integration | Platform-specific in `app/` |

## Troubleshooting

### PDF too large

- Reduce quality setting
- Use JPEG compression
- Lower resolution
- Use Black & White for text documents

### Export failing

- Check available storage space
- Try a different format
- Reduce number of pages
- Restart the app

### Quality issues

- Use higher resolution setting
- Choose PNG for text documents
- Ensure good original capture quality
- Apply appropriate filters before export
