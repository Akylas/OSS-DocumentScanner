---
id: passbook
title: Passbook & PKPass Support
sidebar_label: Passbook (PKPass)
sidebar_position: 4
---

# Passbook & PKPass Support

OSS CardWallet fully supports Apple Passbook (PKPass) files, allowing you to import, view, and manage digital passes like boarding passes, event tickets, loyalty cards, and coupons.

## What is PKPass?

PKPass is the file format used by Apple Wallet (formerly Passbook). These digital passes are commonly used for:

- ✈️ **Boarding passes** - Airline and train tickets
- 🎫 **Event tickets** - Concerts, movies, sports events
- 🏪 **Loyalty cards** - Store reward programs
- 🎁 **Coupons** - Digital discount vouchers
- 🎟️ **Gift cards** - Prepaid cards

## Importing Passes

### From Files

1. Tap the **+** button in CardWallet
2. Select **Import PKPass**
3. Browse to your `.pkpass` file
4. The pass will be imported and displayed

### From Email or Web

When you receive a PKPass file via email or download one from a website:

1. Tap on the `.pkpass` file
2. Select **Open with OSS CardWallet**
3. The pass will be automatically imported

### From QR Code

Some services provide passes via QR codes:

1. Tap **Scan** in CardWallet
2. Scan the QR code
3. If it links to a PKPass file, it will be downloaded and imported

## Viewing Passes

Once imported, your passes display all relevant information:

- **Pass header** with logo and organization name
- **Primary information** (flight number, event name, etc.)
- **Secondary fields** (date, time, seat, etc.)
- **Barcode/QR code** for scanning at venues
- **Back of pass** with additional details

### Pass Types Display

Each pass type has a unique visual style:

| Pass Type | Display Style |
|-----------|---------------|
| Boarding Pass | Horizontal strip layout |
| Event Ticket | Ticket-style with perforations |
| Store Card | Card layout with logo |
| Coupon | Coupon-style design |
| Generic | Standard card layout |

## Managing Passes

### Organizing Passes

- **Categories**: Group passes by type (travel, entertainment, shopping)
- **Favorites**: Star important passes for quick access
- **Archive**: Move expired passes to archive

### Updating Passes

Some passes support automatic updates:

- Push notifications for gate changes
- Updated boarding times
- New coupon offers

*Note: Automatic updates require the pass issuer to support this feature.*

### Deleting Passes

1. Open the pass you want to delete
2. Tap the **⋮** menu
3. Select **Delete**
4. Confirm deletion

## Exporting Passes

### Share as PKPass

Export passes to share or backup:

1. Open the pass
2. Tap **Share**
3. Select **Export as PKPass**
4. Choose destination (email, cloud storage, etc.)

### Add to Apple Wallet

If you also use an iPhone:

1. Export the pass as PKPass
2. Send it to your iPhone
3. Open the file to add to Apple Wallet

## Barcode Support

CardWallet supports all barcode formats used in PKPass files:

- **QR Code** - Most common format
- **PDF417** - Used for boarding passes
- **Aztec** - Compact 2D barcode
- **Code 128** - Linear barcode

### Displaying Barcodes

For easy scanning at venues:

1. Open the pass
2. Tap on the barcode to enlarge
3. Adjust screen brightness if needed
4. Present to scanner

## Tips for Using Passes

### Before Travel

- ✅ Import boarding passes before arriving at the airport
- ✅ Ensure your phone is charged
- ✅ Test that the barcode displays correctly

### At Events

- ✅ Open the ticket before reaching the entrance
- ✅ Increase screen brightness for better scanning
- ✅ Have a backup (screenshot or printed copy)

### For Loyalty Cards

- ✅ Keep store cards easily accessible
- ✅ Update passes when offers change
- ✅ Check expiration dates on coupons

## Troubleshooting

### Pass Won't Import

- Ensure the file has a `.pkpass` extension
- Check that the file isn't corrupted
- Try downloading the pass again from the source

### Barcode Won't Scan

- Increase screen brightness to maximum
- Clean your screen
- Try zooming in on the barcode
- Ensure you're holding the phone steady

### Pass Information Not Displaying

- Some passes may have limited information
- Check the back of the pass for additional details
- Contact the pass issuer if information is missing

## Privacy & Security

- Passes are stored locally on your device
- No data is sent to external servers
- Sensitive information in passes is encrypted
- You control which passes to keep or delete
