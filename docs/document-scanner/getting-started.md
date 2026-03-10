# Getting Started with OSS Document Scanner

This guide will help you get started with OSS Document Scanner and make the most of its features.

## Installation

### From App Stores

1. **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=com.akylas.documentscanner) or [IzzyOnDroid](https://apt.izzysoft.de/packages/com.akylas.documentscanner)
2. **iOS**: Download from [Apple App Store](https://apps.apple.com/us/app/oss-document-scanner/id6472918564)
3. **Direct APK**: Download from [GitHub Releases](https://github.com/Akylas/OSS-DocumentScanner/releases)

### First Launch

When you first open the app, you'll be greeted with the main document list. The app is ready to use immediately - no account or registration required!

## Scanning Your First Document

### Using Camera

1. Tap the **camera button** (usually at the bottom right)
2. Point your camera at a document
3. The app will automatically detect the document boundaries (shown as a colored overlay)
4. Once detected, the app can auto-capture, or you can tap the capture button
5. Review the detected boundaries and adjust if needed
6. Tap **Save** or **✓** to save the document

**Tips:**
- Ensure good lighting for best results
- Place the document on a contrasting background
- Keep the document flat and the camera steady
- The entire document should be visible in the frame

### Importing from Gallery

1. Tap the **menu button** or **+** button
2. Select **Import from Gallery**
3. Choose one or more images
4. The app will automatically detect and crop the document
5. Review and adjust if needed
6. Save the document

## Working with Documents

### Viewing a Document

- Tap any document in the list to open it
- Swipe left/right to navigate between pages (if multiple pages)
- Pinch to zoom in/out
- Double-tap to fit to screen

### Editing a Document

1. Open the document
2. Tap the **edit icon** or **menu**
3. Available options:
   - **Crop**: Adjust document boundaries
   - **Rotate**: Rotate the page
   - **Filters**: Apply color, grayscale, or black & white filters
   - **Brightness/Contrast**: Adjust image settings
   - **Delete Page**: Remove current page

### Adding More Pages

1. Open the document
2. Tap the **+ page button**
3. Choose to scan with camera or import from gallery
4. The new page will be added to the current document

### Reordering Pages

1. Open the document
2. Long press on the page indicator/thumbnail
3. Drag to reorder pages

## Using OCR (Text Recognition)

1. Open a document
2. Tap the **OCR button** (usually looks like "Aa" or text icon)
3. Wait for text recognition to complete
4. View extracted text
5. Options:
   - **Copy**: Copy text to clipboard
   - **Share**: Share text via other apps
   - **Search**: Search within the text

**OCR Tips:**
- Works best with clear, well-lit images
- Higher resolution = better accuracy
- Select document language in settings for best results
- Use black & white filter for text-heavy documents

## Organizing Documents

### Creating Folders

1. Tap **menu** → **New Folder**
2. Enter folder name
3. Tap **Create**

### Moving Documents to Folders

1. Long press on a document
2. Tap **Move**
3. Select destination folder

### Renaming Documents

1. Long press on a document
2. Tap **Rename**
3. Enter new name
4. Tap **Save**

## Exporting & Sharing

### Export as PDF

1. Open a document (or select multiple documents)
2. Tap **Share** or **Export** button
3. Select **PDF**
4. Choose export settings:
   - Quality
   - Include OCR text layer (if OCR was performed)
   - Page range
5. Select destination (email, cloud storage, etc.)

### Printing

1. Open a document
2. Tap **menu** → **Print**
3. Select printer
4. Configure print settings
5. Tap **Print**

## Cloud Synchronization (WebDAV)

### Setting Up Sync

1. Go to **Settings** → **Synchronization**
2. Tap **Add WebDAV Server**
3. Enter server details:
   - Server URL (e.g., `https://nextcloud.example.com/remote.php/webdav/`)
   - Username
   - Password
4. Tap **Test Connection**
5. If successful, tap **Save**

### Using Sync

- **Manual Sync**: Tap sync button in settings
- **Auto Sync**: Enable in settings for background sync
- **Sync Status**: View sync status in notification/settings

**Nextcloud Setup Example:**
```
URL: https://your-nextcloud.com/remote.php/webdav/
Username: your-username
Password: your-password or app-password
```

## Security Settings

### Enable Biometric Lock

1. Go to **Settings** → **Security**
2. Enable **Biometric Authentication**
3. Confirm with your fingerprint/face
4. The app will now require authentication to open

### Auto-Lock

Configure the app to auto-lock after inactivity:
1. **Settings** → **Security** → **Auto-lock**
2. Choose timeout period

## Customizing Settings

### Camera Settings

- **Auto-capture**: Enable/disable automatic capture
- **Flash**: Configure flash behavior
- **Start in Camera Mode**: Launch directly to camera

### Document Settings

- **Default Format**: JPEG or PNG
- **Image Quality**: Compression level
- **Naming Format**: Customize document names
- **Default Folder**: Set default save location

### Display Settings

- **View Style**: Grid or vertical list
- **Theme**: Light or dark mode
- **Language**: Change app language

## Tips & Tricks

### Quick Document Access
- Long press on a document to see quick actions
- Use shortcuts for frequently accessed documents

### Batch Operations
- Long press and select multiple documents
- Apply actions to all selected documents at once

### Scanning Tips
- Use the black & white filter for text documents
- Use color filter for photos and colored documents
- Clean the camera lens for best results
- Use good lighting or enable flash in low light

### Organization
- Use meaningful folder names
- Regularly export important documents as backup
- Use WebDAV sync for automatic backups

## Troubleshooting

### Document Not Detected
- Ensure good lighting
- Use a contrasting background
- Try manual corner adjustment
- Check if document is fully visible

### OCR Not Working
- Ensure text is clear and readable
- Try applying black & white filter first
- Check OCR language settings
- Higher resolution images work better

### Sync Issues
- Verify server URL and credentials
- Check internet connection
- Look for sync errors in settings
- Try manual sync first

## Getting Help

- **Report Issues**: [GitHub Issues](https://github.com/Akylas/OSS-DocumentScanner/issues)
- **Feature Requests**: Submit via GitHub
- **Contribute**: The app is open source on [GitHub](https://github.com/Akylas/OSS-DocumentScanner)

## Support Development

If you find this app useful, consider [sponsoring the developer](https://github.com/sponsors/farfromrefug) to support continued development and maintenance.
