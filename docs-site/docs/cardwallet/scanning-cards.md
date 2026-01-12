---
id: scanning-cards
title: Scanning Cards
sidebar_position: 2
slug: /cardwallet/scanning-cards
---

# Scanning Cards

OSS CardWallet makes it easy to digitize your physical cards by scanning their barcodes.

## Scanning a Barcode

### Using the Camera

1. Tap the **+** button to add a new card
2. Select **Scan Barcode**
3. Point your camera at the barcode
4. The app will automatically detect and scan the barcode
5. Review the detected information and add card details

### Tips for Better Scanning

- **Good lighting**: Ensure adequate lighting on the barcode
- **Steady hands**: Hold your device steady while scanning
- **Clean barcode**: Make sure the barcode isn't damaged or obscured
- **Correct distance**: Hold your device 4-6 inches from the barcode
- **Avoid glare**: Tilt the card to avoid reflections on laminated cards

## Manual Entry

If scanning doesn't work, you can enter barcode data manually:

1. Tap the **+** button
2. Select **Manual Entry**
3. Choose the barcode format
4. Enter the barcode number
5. Add card details and save

## Supported Barcode Formats

### 1D Barcodes (Linear)

| Format | Common Use |
|--------|------------|
| CODE_128 | General purpose, shipping |
| CODE_39 | Industrial, automotive |
| EAN_13 | Retail products (Europe) |
| EAN_8 | Small retail products |
| UPC_A | Retail products (North America) |
| UPC_E | Small packages |
| ITF | Shipping, logistics |
| CODABAR | Libraries, blood banks |

### 2D Barcodes

| Format | Common Use |
|--------|------------|
| QR_CODE | URLs, loyalty cards, tickets |
| DATA_MATRIX | Electronics, small items |
| AZTEC | Tickets, boarding passes |
| PDF_417 | IDs, driver's licenses |

## Scanning from Images

You can also scan barcodes from existing images:

1. Tap the **+** button
2. Select **Import from Gallery**
3. Choose an image containing a barcode
4. The app will detect and extract the barcode

## Batch Scanning

To add multiple cards quickly:

1. Enable **Batch Mode** in scan settings
2. Scan each card in succession
3. The app will queue cards for you to add details later
4. Review and save each card when done

## Troubleshooting

### Barcode Not Detected

- Ensure the barcode is fully visible in the frame
- Try moving closer or further from the barcode
- Improve lighting conditions
- Check if the barcode format is supported

### Wrong Barcode Format Detected

- Manually select the correct format in settings
- Use manual entry to specify the exact format

### Blurry Camera

- Clean your camera lens
- Ensure adequate lighting
- Hold the device steady

## Source Code Reference

The barcode scanning functionality is implemented in:

| Component | Location |
|-----------|----------|
| Barcode Scanner | `app/components/qrcode/` |
| Barcode Processing | `zxingcpp/` |
| Card Service | `app/services/qrcode.ts` |

:::tip
CardWallet uses the ZXing library for barcode scanning, which supports a wide variety of formats and works offline.
:::
