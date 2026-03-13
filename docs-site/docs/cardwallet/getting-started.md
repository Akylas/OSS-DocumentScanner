---
id: getting-started
title: Getting Started with CardWallet
sidebar_position: 1
slug: /cardwallet/getting-started
---

# Getting Started with OSS CardWallet

Welcome to **OSS CardWallet**, an open-source, privacy-focused app for storing and managing your loyalty cards, membership cards, tickets, and barcodes.

## Installation

### Android

You can install OSS CardWallet on Android through:

- **Google Play Store**: [Download from Play Store](https://play.google.com/store/apps/details?id=com.akylas.cardwallet)
- **IzzyOnDroid**: [Download from IzzyOnDroid](https://apt.izzysoft.de/packages/com.akylas.cardwallet)
- **GitHub Releases**: [Download APK from GitHub](https://github.com/Akylas/OSS-DocumentScanner/releases)
- **Obtainium**: Add the app for automatic updates with this [link](https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/%7B%22id%22%3A%22com.akylas.cardwallet%22%2C%22url%22%3A%22https%3A%2F%2Fgithub.com%2FAkylas%2FOSS-DocumentScanner%22%2C%22author%22%3A%22Akylas%22%2C%22name%22%3A%22OSS%20Card%20Wallet%22%2C%22preferredApkIndex%22%3A0%2C%22additionalSettings%22%3A%22%7B%5C%22includePrereleases%5C%22%3Afalse%2C%5C%22fallbackToOlderReleases%5C%22%3Atrue%2C%5C%22filterReleaseTitlesByRegEx%5C%22%3A%5C%22Card%20Wallet%5C%22%2C%5C%22filterReleaseNotesByRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22verifyLatestTag%5C%22%3Afalse%2C%5C%22dontSortReleasesList%5C%22%3Afalse%2C%5C%22useLatestAssetDateAsReleaseDate%5C%22%3Afalse%2C%5C%22trackOnly%5C%22%3Afalse%2C%5C%22versionExtractionRegEx%5C%22%3A%5C%22github%2F(.%2B)%5C%22%2C%5C%22versionDetection%5C%22%3Afalse%2C%5C%22releaseDateAsVersion%5C%22%3Afalse%2C%5C%22useVersionCodeAsOSVersion%5C%22%3Afalse%2C%5C%22apkFilterRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22invertAPKFilter%5C%22%3Afalse%2C%5C%22autoApkFilterByArch%5C%22%3Atrue%2C%5C%22appName%5C%22%3A%5C%22%5C%22%2C%5C%22shizukuPretendToBeGooglePlay%5C%22%3Afalse%2C%5C%22exemptFromBackgroundUpdates%5C%22%3Afalse%2C%5C%22skipUpdateNotifications%5C%22%3Afalse%2C%5C%22about%5C%22%3A%5C%22%5C%22%7D%22%2C%22overrideSource%22%3Anull%7D)

### iOS

- **App Store**: [Download from App Store](https://apps.apple.com/app/oss-cardwallet/id6504414362)

## What is CardWallet?

OSS CardWallet helps you:

- **Store loyalty cards or identity cards** digitally instead of carrying physical cards
- **Scan barcodes** from existing cards or create new ones
- **Scan Passbooks** from .pkpass
- **Organize cards** with custom categories and colors
- **Access quickly** with widgets and quick actions
- **Backup securely** to your own cloud storage
- **Exporting** as PDF, images, or sharing directly
- **Syncing** with cloud services (optional)

## Quick Start

### Adding Your First Card

1. **Open the app** and tap the **+** button
2. **Scan the card/bardcode** from your physical card
3. **Add card details** like name, notes, and color
4. **Save** the card to your wallet

### Supported Barcode Formats

CardWallet supports many barcode formats:

- **1D Barcodes**: CODE_128, CODE_39, EAN_13, EAN_8, UPC_A, UPC_E, ITF, CODABAR
- **2D Barcodes**: QR_CODE, DATA_MATRIX, AZTEC, PDF_417

## Key Features

| Feature | Description |
|---------|-------------|
| Barcode Scanning | Scan barcodes using your camera |
| Manual Entry | Enter barcode numbers manually |
| Passbook | import all your pkpass |
| Card Organization | Group cards by category |
| Quick Access | Widgets and brightness boost |
| Cloud Sync | Sync via WebDAV to your server |
| Privacy First | All data stays on your device |

## Permissions Required

On first launch, the app will request:

- **Camera**: Required for scanning barcodes
- **Storage** (optional): For backup/restore
- **Notifications** (android, optional): To show sync notifications

## Next Steps

- Learn about [Scanning Cards](/cardwallet/scanning-cards)
- Explore [Managing Cards](/cardwallet/managing-cards)
- Set up [Sync and Backup](/sync-and-backup)

## Getting Help

- **Issues**: [Report bugs on GitHub](https://github.com/Akylas/OSS-DocumentScanner/issues)
- **Translations**: [Help translate on Weblate](https://hosted.weblate.org/engage/oss-document-scanner/)
