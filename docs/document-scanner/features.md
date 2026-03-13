# Features

OSS Document Scanner comes with a comprehensive set of features to help you digitize and manage your documents.

## Document Scanning

### Camera Scanning
- **Real-time Detection**: See document boundaries detected in real-time as you position your camera
- **Auto-capture**: Automatically capture when document is properly positioned
- **Manual Capture**: Take photos manually when needed
- **Flash Support**: Use device flash for low-light conditions

### Document Import
- Import images from your photo library
- Support for various image formats (JPEG, PNG, etc.)
- Import from other apps
- Bulk import multiple documents

## Image Processing

### Automatic Document Detection
The app uses OpenCV to detect document boundaries:
- Works with documents at any angle
- Handles perspective distortion
- Detects rectangular shapes automatically
- Manual corner adjustment available

### Image Enhancements
- **Filters**: Apply various filters (color, grayscale, black & white)
- **Brightness/Contrast**: Adjust image brightness and contrast
- **Crop & Rotate**: Manual cropping and rotation tools
- **Perspective Correction**: Automatic perspective correction
- **Image Quality**: Configurable compression and quality settings

## OCR (Optical Character Recognition)

Extract text from your scanned documents:
- **Multiple Languages**: Support for various languages
- **High Accuracy**: Uses Tesseract OCR engine
- **Copy Text**: Copy extracted text to clipboard
- **Search**: Search through extracted text
- **Export Text**: Export text alongside PDFs

### OCR Configuration
- Select specific regions for OCR
- Choose OCR language
- Copy text with or without line breaks
- Run OCR on sync for cloud-stored documents

## Document Organization

### Folders
- Create folders to organize documents
- Move documents between folders
- Rename folders
- Nested folder support

### Document Management
- Rename documents
- Add tags and labels
- Sort by date, name, or custom order
- Search documents by name or content
- Bulk operations (select multiple documents)

## Export & Sharing

### PDF Export
- **Single Document**: Export individual documents as PDF
- **Multiple Documents**: Combine multiple documents into one PDF
- **Page Selection**: Choose specific pages to export
- **Quality Settings**: Adjust PDF quality and compression
- **OCR in PDF**: Include OCR text layer in PDFs

### Sharing Options
- Share via email, messaging apps, cloud storage
- Direct printing from your device
- Export as images (JPEG, PNG)
- Batch sharing multiple documents

## Cloud Synchronization

### WebDAV Support
Synchronize your documents with WebDAV servers:
- **Nextcloud**: Full Nextcloud integration
- **ownCloud**: Compatible with ownCloud
- **Generic WebDAV**: Works with any WebDAV server

### Sync Features
- **Automatic Sync**: Background synchronization
- **Conflict Resolution**: Handle sync conflicts intelligently
- **Selective Sync**: Choose what to sync
- **Sync Status**: View sync progress and status
- **Manual Sync**: Trigger sync manually when needed

## Security & Privacy

### Biometric Protection
- Fingerprint authentication
- Face unlock (on supported devices)
- PIN code protection
- Auto-lock after inactivity

### Data Privacy
- **Local First**: All data stored locally by default
- **No Tracking**: No analytics or tracking
- **Open Source**: Fully auditable code
- **Optional Cloud**: You control where data is stored

## Customization

### Settings
- **Image Format**: Choose between JPEG and PNG
- **Compression**: Adjust image compression levels
- **Document Naming**: Customize document naming format
- **Camera Settings**: Configure camera behavior
- **View Style**: Vertical or grid layout
- **Theme**: Light and dark mode support

### Shortcuts
- Quick access to recently used documents
- Create device shortcuts for specific documents
- One-time scan via system intents

## Additional Features

### Import Documents into Another
Merge documents by importing pages from one document into another.

### QR Code Support
- Force QR codes on white background for better scanning
- Create cards from barcodes without scanning images

### Batch Operations
- Process multiple documents at once
- Apply filters to multiple pages
- Export multiple documents simultaneously

### Advanced Options
- Start app in camera mode
- Customize scan behavior
- Configure export settings
- Set default folders
