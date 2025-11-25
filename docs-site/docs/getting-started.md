---
id: getting-started
title: Getting Started
sidebar_position: 1
slug: /getting-started
---

# Getting Started with OSS Document Scanner

Welcome to **OSS Document Scanner**, an open-source, privacy-focused document scanning application for Android and iOS. This guide will help you get started with scanning, organizing, and exporting your documents.

## Installation

### Android

You can install OSS Document Scanner on Android through:

- **Google Play Store**: [Download from Play Store](https://play.google.com/store/apps/details?id=com.akylas.documentscanner)
- **IzzyOnDroid**: [Download from IzzyOnDroid](https://apt.izzysoft.de/packages/com.akylas.documentscanner)
- **GitHub Releases**: [Download APK from GitHub](https://github.com/Akylas/OSS-DocumentScanner/releases)
- **Obtainium**: Add the app for automatic updates

### iOS

- **App Store**: [Download from App Store](https://apps.apple.com/us/app/oss-document-scanner/id6472918564)

## App Overview

![App Overview](/img/capture-1.png)

OSS Document Scanner provides a streamlined workflow for:

1. **Capturing** documents using your device's camera
2. **Editing** scans with cropping, rotation, and filters
3. **Organizing** documents into folders
4. **Exporting** as PDF, images, or sharing directly
5. **Syncing** with cloud services (optional)

## Quick Start

### Your First Scan

1. **Open the app** and tap the camera button
2. **Position your document** within the viewfinder
3. **Auto-capture** will detect edges and take the photo, or tap manually
4. **Review and edit** the captured image
5. **Save** to your document library

### Permissions Required

On first launch, the app will request the following permissions:

- **Camera**: Required for scanning documents
- **Storage**: Required for saving scanned documents
- **Location** (optional): For geotagging documents

## Source Code Reference

OSS Document Scanner is fully open source. Here's where to find key functionality:

| Feature | Location |
|---------|----------|
| UI Components | `app/components/` |
| Camera/Capture | `app/components/camera/` |
| Document Services | `app/services/documents.ts` |
| Image Processing | `opencv/` and `cpp/src/` |
| Native Processing Plugin | `plugin-nativeprocessor/` |
| OCR Service | `app/services/ocr.ts` |
| Sync Services | `app/services/sync/` |

:::tip
Use GitHub's search functionality to find specific features: press <kbd>T</kbd> on the repository page to quickly search for files.
:::

## Next Steps

- Learn about [Capture modes and options](/capture)
- Discover [Editing and enhancement features](/edit-and-enhance)
- Explore [Export options](/export)
- Set up [Sync and backup](/sync-and-backup)

## Getting Help

- **Issues**: [Report bugs on GitHub](https://github.com/Akylas/OSS-DocumentScanner/issues)
- **Translations**: [Help translate on Weblate](https://hosted.weblate.org/engage/oss-document-scanner/)
- **FAQ**: Check out our [Frequently Asked Questions](/faq)
