---
id: faq
title: FAQ
sidebar_position: 7
slug: /faq
---

# Frequently Asked Questions

Find answers to common questions about OSS Document Scanner and OSS CardWallet.

## General

### Are these apps really free?

Yes! Both OSS Document Scanner and OSS CardWallet are completely free and open source. There are no ads, no in-app purchases, and no premium features locked behind a paywall.

### Is my data private?

Absolutely. Both apps:
- Process all data on your device
- Never upload data to any server (unless you configure sync)
- Don't include analytics or tracking
- Are open source so you can verify yourself

### What's the difference between the two apps?

| OSS Document Scanner | OSS CardWallet |
|---------------------|----------------|
| Scan paper documents | Store loyalty/membership cards |
| Auto edge detection | Barcode scanning |
| PDF export with OCR | Multiple barcode formats |
| Document organization | Card organization |

Both apps share common features like cloud sync, backup, and privacy-first design.

### Where can I get support?

- **GitHub Issues**: [Report bugs or request features](https://github.com/Akylas/OSS-DocumentScanner/issues)
- **This Documentation**: Browse guides and tutorials
- **Source Code**: Review the [open source code](https://github.com/Akylas/OSS-DocumentScanner)

### How can I contribute?

- **Translations**: [Help translate on Weblate](https://hosted.weblate.org/engage/oss-document-scanner/)
- **Code**: Submit pull requests on GitHub
- **Bug Reports**: Report issues you find
- **Documentation**: Improve these docs
- **Sponsorship**: [Support the developer](https://github.com/sponsors/farfromrefug)

## Scanning

### Why isn't edge detection working?

Common causes and solutions:

1. **Poor lighting**: Ensure even, adequate lighting
2. **Low contrast**: Use a contrasting background (dark document on light surface or vice versa)
3. **Reflections**: Avoid glossy surfaces that create glare
4. **Dirty lens**: Clean your camera lens
5. **Complex background**: Use a plain, solid-color background

### Can I scan multi-page documents?

Yes! Use batch scanning mode:

1. Tap the camera button
2. Scan first page
3. Continue scanning without saving
4. All pages are combined into one document
5. Tap Done when finished

### What resolution should I use?

| Use Case | Recommended Resolution |
|----------|----------------------|
| Quick reference | Standard |
| General documents | High |
| Important documents | Maximum |
| OCR processing | High or Maximum |

### Can I scan in low light?

Yes, but quality may suffer. Tips for low light:

- Enable flash
- Use manual capture mode
- Hold device very steady
- Consider using additional lighting
- Enable auto-enhancement after capture

## Editing

### How do I rotate a page?

1. Open the document
2. Select the page
3. Tap the rotate button
4. Choose rotation direction

### Can I crop after scanning?

Yes:

1. Open the document
2. Select the page
3. Tap the crop/edit button
4. Adjust the crop area
5. Tap Apply

### What filters are available?

- **Original**: No processing
- **Black & White**: Pure binary, best for text
- **Grayscale**: Removes color, keeps tones
- **Enhanced**: Auto color/contrast improvement
- **Document**: Optimized for document readability

### How does OCR work?

OCR (Optical Character Recognition) extracts text from images:

1. Open a scanned page
2. Tap the OCR button
3. Select language(s)
4. Processing happens on-device
5. Text can be copied or searched

## Export

### What export formats are supported?

- **PDF**: Standard and with OCR text layer
- **JPEG**: Compressed images
- **PNG**: Lossless images
- **TIFF**: Professional archival format

### How do I reduce PDF file size?

1. Use lower quality setting
2. Apply Black & White filter
3. Use JPEG compression
4. Reduce resolution (150 DPI for email)

### Can I combine multiple documents into one PDF?

Yes:

1. Select multiple documents in list view
2. Tap Export
3. Choose "Single PDF"
4. All documents are combined

### How do I email a scan?

1. Open the document
2. Tap Share
3. Choose format (PDF recommended)
4. Select your email app
5. Document is attached to new email

## Sync & Backup

### Which cloud services are supported?

Direct sync via WebDAV:
- Nextcloud
- ownCloud
- Synology NAS
- Any WebDAV server

For other services, export and upload manually.

### How do I set up sync?

See our detailed [Sync and Backup guide](/sync-and-backup).

### What happens if I edit on multiple devices?

The most recent change typically wins. The app will:
1. Detect the conflict
2. Compare timestamps
3. Keep the newer version
4. Optionally archive the older version

### Are backups encrypted?

Backups are ZIP files that are not encrypted by default. For sensitive documents:
- Enable document encryption in app settings
- Store backups in encrypted storage
- Use encrypted cloud storage

## Troubleshooting

### The app crashes on startup

Try these steps:

1. Restart your device
2. Clear app cache (Settings > Apps > OSS Document Scanner > Clear Cache)
3. Update to latest version
4. Reinstall the app (backup first!)

### Scans are blurry

- Hold device steady during capture
- Ensure good lighting
- Wait for auto-focus
- Clean camera lens
- Try manual capture with tap-to-focus

### PDF export fails

- Check available storage space
- Try lower quality setting
- Reduce number of pages
- Restart app and try again

### Sync not working

1. Check internet connection
2. Verify server credentials
3. Test connection in settings
4. Check server is accessible
5. Review server logs for errors

### OCR gives wrong text

- Use higher capture quality
- Apply Black & White filter
- Select correct language
- Ensure text is clearly visible
- Try different threshold settings

## Technical

### What platforms are supported?

- **Android**: 7.0 (API 24) and above
- **iOS**: 13.0 and above

### How is the app built?

OSS Document Scanner is built with:
- **NativeScript**: Cross-platform framework
- **Svelte**: UI components
- **OpenCV**: Image processing
- **Tesseract**: OCR engine

### Where is source code located?

Key directories in the [GitHub repository](https://github.com/Akylas/OSS-DocumentScanner):

| Directory | Contents |
|-----------|----------|
| `app/` | Main application code |
| `app/components/` | UI components |
| `app/services/` | Business logic |
| `opencv/` | OpenCV integration |
| `plugin-nativeprocessor/` | Native processing plugin |
| `cpp/` | Native C++ code |

### How can I build from source?

See the [Building Setup section](https://github.com/Akylas/OSS-DocumentScanner#building-setup) in the main README.

## Maestro Screenshot Integration

For automated testing and documentation, OSS Document Scanner supports Maestro for generating screenshots.

### How to Generate Screenshots with Maestro

1. Install Maestro: https://maestro.mobile.dev/
2. Write Maestro flows that navigate through app features
3. Use `- takeScreenshot` command to capture screens
4. Place generated screenshots in `docs-site/static/img/`

### Screenshot Placement Script

```bash
#!/bin/bash
# copy-screenshots.sh
# Run after Maestro tests to copy screenshots to docs site

MAESTRO_OUTPUT="./maestro-screenshots"
DOCS_IMG="./docs-site/static/img"

# Copy and rename screenshots
cp "$MAESTRO_OUTPUT/capture.png" "$DOCS_IMG/capture-1.png"
cp "$MAESTRO_OUTPUT/edit.png" "$DOCS_IMG/edit-1.png"
cp "$MAESTRO_OUTPUT/export.png" "$DOCS_IMG/export-1.png"
cp "$MAESTRO_OUTPUT/sync.png" "$DOCS_IMG/sync-1.png"
cp "$MAESTRO_OUTPUT/settings.png" "$DOCS_IMG/settings-1.png"

echo "Screenshots copied to docs site"
```

### Screenshot Naming Convention

Keep these exact filenames so Maestro-generated screenshots can replace placeholders:

- `capture-1.png` - Main capture screen
- `edit-1.png` - Edit/crop screen
- `export-1.png` - Export options
- `sync-1.png` - Sync settings
- `settings-1.png` - Settings screen

## Still Have Questions?

If your question isn't answered here:

1. Search [existing GitHub issues](https://github.com/Akylas/OSS-DocumentScanner/issues)
2. [Create a new issue](https://github.com/Akylas/OSS-DocumentScanner/issues/new) with your question
3. Check the [source code](https://github.com/Akylas/OSS-DocumentScanner) for implementation details
