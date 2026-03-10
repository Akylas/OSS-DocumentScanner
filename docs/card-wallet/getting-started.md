# Getting Started with OSS Card Wallet

This guide will help you get started with OSS Card Wallet and digitize your physical cards.

## Installation

### From App Stores

1. **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=com.akylas.cardwallet) or [IzzyOnDroid](https://apt.izzysoft.de/packages/com.akylas.cardwallet)
2. **iOS**: Download from [Apple App Store](https://apps.apple.com/app/oss-cardwallet/id6504414362)
3. **Direct APK**: Download from [GitHub Releases](https://github.com/Akylas/OSS-DocumentScanner/releases)

### First Launch

When you first open the app, you'll see an empty card list. The app is ready to use immediately - no registration required!

## Scanning Your First Card

### Using Camera

1. Tap the **camera button** (usually at the bottom right)
2. Point your camera at a card
3. The app will automatically detect:
   - Card boundaries
   - Barcodes and QR codes
4. Once detected, tap capture or wait for auto-capture
5. Review the detected information
6. Add a name for your card
7. Tap **Save**

**Tips:**
- Ensure good lighting
- Place card on a flat surface
- Keep the barcode clearly visible
- Use a contrasting background for best results

### Manual Barcode Entry

You can create a card without scanning:

1. Tap **menu** → **New Card**
2. Select **Manual Entry**
3. Enter card name
4. Choose barcode type (QR, EAN, Code 128, etc.)
5. Enter barcode value
6. Optionally add an image
7. Tap **Save**

### Importing from Gallery

1. Tap **menu** → **Import**
2. Select an image from your gallery
3. The app will detect card and barcode
4. Review and edit if needed
5. Save the card

## Working with Cards

### Viewing a Card

- Tap any card to open it
- View card details
- See barcode/QR code
- Swipe for multiple pages (if applicable)

### Displaying Barcode for Scanning

1. Open the card
2. Tap the barcode to enter full-screen mode
3. The screen brightness will increase automatically
4. Present to scanner
5. Tap again or press back to exit

**Tips:**
- Hold device steady
- Ensure screen is clean
- Use white background option if scanner has trouble reading

### Editing a Card

1. Open the card
2. Tap **edit icon** or **menu**
3. Available options:
   - **Edit Image**: Crop, rotate, apply filters
   - **Edit Barcode**: Change barcode type or value
   - **Add Fields**: Add custom fields
   - **Rename**: Change card name
   - **Delete**: Remove the card

## Adding Extra Information

### Custom Fields

Add additional information to your cards:

1. Open a card
2. Tap **menu** → **Add Field**
3. Choose field type:
   - Text (card number, name, etc.)
   - Date (expiration date)
   - Phone number
   - Email
   - Note
4. Enter field value
5. Save

**Examples:**
- Card number: `1234 5678 9012 3456`
- Expiration: `12/2025`
- Customer ID: `CUS123456`
- Phone: `1-800-555-0123`

### Using OCR

Extract text from your card image:

1. Open a card
2. Tap **OCR** button
3. Wait for text recognition
4. Select detected text to copy
5. Add to custom fields if desired

## Organizing Cards

### Creating Folders

Organize cards by type:

1. Tap **menu** → **New Folder**
2. Name your folder (e.g., "Loyalty Cards", "Insurance", "Tickets")
3. Tap **Create**

**Suggested Folders:**
- Loyalty Programs
- Insurance Cards
- Memberships
- Gift Cards
- Event Tickets
- Library Cards

### Moving Cards

1. Long press on a card
2. Tap **Move**
3. Select destination folder
4. Tap **Confirm**

### Searching Cards

Use the search function to quickly find cards:
1. Tap the **search icon**
2. Type card name, barcode, or any text
3. Results appear instantly

## Using Quick Access

### Recent Cards

Recently used cards appear at the top of your list for easy access.

### Creating Shortcuts

Create device shortcuts for frequently used cards:

1. Open a card
2. Tap **menu** → **Create Shortcut**
3. A shortcut appears on your home screen
4. Tap the shortcut to instantly open the card

### Favorites

Mark cards as favorites:
1. Open a card
2. Tap the **star icon**
3. Favorites appear prominently in your list

## Exporting & Sharing

### Share Single Card

1. Open a card
2. Tap **share** button
3. Choose format:
   - **PDF**: Include card image and barcode
   - **Image**: Just the card image
   - **Barcode**: Just the barcode
4. Select destination app

### Export Multiple Cards

1. Long press to enter selection mode
2. Select multiple cards
3. Tap **export** or **share**
4. Choose format and destination

### Printing Cards

1. Open a card (or select multiple)
2. Tap **menu** → **Print**
3. Select printer
4. Configure settings
5. Print

## Security Setup

### Enable Biometric Lock

Protect your cards with fingerprint or face:

1. Go to **Settings** → **Security**
2. Enable **Biometric Authentication**
3. Confirm with your biometric
4. App will now require authentication

### Configure Auto-Lock

Set timeout for automatic locking:

1. **Settings** → **Security** → **Auto-lock**
2. Choose timeout:
   - Immediately
   - After 1 minute
   - After 5 minutes
   - After 30 minutes

## Cloud Sync (WebDAV)

### Setting Up Sync

Backup and sync cards across devices:

1. Go to **Settings** → **Synchronization**
2. Tap **Add Server**
3. Enter WebDAV details:
   - Server URL
   - Username  
   - Password
4. Test connection
5. Save

**Nextcloud Example:**
```
URL: https://your-nextcloud.com/remote.php/webdav/
Username: your-username
Password: app-password
```

### Sync Options

- **Auto Sync**: Enable for automatic background sync
- **Manual Sync**: Tap sync button when needed
- **Sync Conflicts**: App handles conflicts intelligently

## Customizing Settings

### Display Settings

- **View Style**: Choose grid or list view
- **Card Size**: Adjust card preview size
- **Theme**: Switch between light and dark mode
- **Sort Order**: By name, date, or custom

### Card Settings

- **Image Format**: JPEG (smaller) or PNG (higher quality)
- **Compression**: Adjust quality vs. size
- **Default Folder**: Where new cards are saved
- **Naming Format**: How cards are named

### Barcode Settings

- **White Background**: Force white background for QR codes
- **Barcode Size**: Adjust display size
- **Full Screen Brightness**: Auto-brightness boost

## Tips & Tricks

### Scanning Best Practices

- Clean your camera lens
- Use good lighting or flash
- Hold device steady
- Ensure barcode is clearly visible
- Try different angles if detection fails

### Organization Tips

- Create folders before adding many cards
- Use meaningful names
- Add extra fields for important info
- Regular backups via WebDAV or export

### Quick Access Strategies

- Create shortcuts for most-used cards
- Use recent cards feature
- Star your important cards
- Keep active cards at the top

### Barcode Display Tips

- Enable white background for difficult scanners
- Increase brightness manually if auto-boost insufficient
- Clean your screen before scanning
- Hold device steady at scanner

## Troubleshooting

### Barcode Not Detected

- Ensure barcode is clear and visible
- Try better lighting
- Manually enter barcode as fallback
- Check barcode isn't damaged

### Scanner Can't Read Barcode

- Enable "force white background" option
- Increase screen brightness
- Clean your screen
- Try different display sizes
- Ensure barcode format is correct

### Sync Issues

- Verify server credentials
- Check internet connection
- Confirm server URL is correct
- Try manual sync first
- Check sync status in settings

## Common Use Cases

### Loyalty Cards at Checkout

1. Open app (biometric unlock)
2. Card appears in recent list
3. Tap card to open
4. Tap barcode for full-screen
5. Present to scanner

### Event Tickets

1. Screenshot or save ticket email
2. Import into Card Wallet
3. Create shortcut on home screen
4. At event, tap shortcut → instant access

### Insurance Cards

1. Scan front and back of card
2. Add to "Insurance" folder
3. Use OCR to add policy number
4. Export PDF for sharing with providers

### Gift Cards

1. Scan card and barcode
2. Use OCR or add field for balance
3. Update balance in notes after use
4. Delete when depleted

## Getting Help

- **Report Issues**: [GitHub Issues](https://github.com/Akylas/OSS-DocumentScanner/issues)
- **Feature Requests**: Submit via GitHub
- **Contribute**: The app is open source!

## Support Development

If you find Card Wallet useful, consider [sponsoring the developer](https://github.com/sponsors/farfromrefug) to support continued development!
