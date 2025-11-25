---
id: managing-cards
title: Managing Cards
sidebar_position: 3
slug: /cardwallet/managing-cards
---

# Managing Cards

Learn how to organize, edit, and use your digital cards effectively.

## Card Details

Each card can include:

- **Name**: The card or store name
- **Barcode**: The scanned or entered barcode
- **Notes**: Additional information, member numbers, etc.
- **Color**: Custom color for easy identification
- **Category**: Group cards by type

## Editing Cards

### Modify Card Information

1. Open the card you want to edit
2. Tap the **Edit** button
3. Update the card details
4. Save your changes

### Change Card Color

1. Edit the card
2. Tap on the color picker
3. Select a new color
4. The card background will update

### Add Notes

Store useful information with your cards:

- Member numbers
- Account IDs
- Reward points
- Expiration dates
- Store locations

## Organizing Cards

### Categories

Organize cards into categories:

- **Loyalty Cards**: Store reward programs
- **Membership**: Gym, club memberships
- **Gift Cards**: Store credit and gift cards
- **Tickets**: Events, transit passes
- **Other**: Miscellaneous cards

### Sorting Options

Sort your cards by:

- **Name**: Alphabetically
- **Recently Used**: Most used first
- **Recently Added**: Newest first
- **Custom Order**: Drag and drop

### Search

Quickly find cards using the search feature:

1. Tap the search icon
2. Type the card name or store
3. Results filter as you type

## Using Cards

### Display a Card

1. Tap on the card in your list
2. The barcode is displayed full screen
3. Adjust brightness if needed
4. Present to the scanner

### Quick Access

For frequently used cards:

- **Widgets**: Add cards to your home screen (Android)
- **Favorites**: Star cards for quick access
- **Recent**: Recently used cards appear first

### Brightness Boost

When displaying a barcode:

- The screen brightness automatically increases
- This helps barcode scanners read the code
- Brightness returns to normal when you exit

## Bulk Operations

### Select Multiple Cards

1. Long-press on a card to start selection
2. Tap additional cards to add to selection
3. Use the action bar for bulk operations

### Bulk Actions

- **Delete**: Remove multiple cards at once
- **Move**: Change category for multiple cards
- **Export**: Export selected cards

## Backup and Restore

### Local Backup

1. Go to Settings > Backup
2. Tap **Create Backup**
3. Choose save location
4. Backup file is created

### Restore from Backup

1. Go to Settings > Backup
2. Tap **Restore Backup**
3. Select your backup file
4. Cards are restored

### Cloud Sync

For automatic backup, see [Sync and Backup](/sync-and-backup).

## Sharing Cards

### Share a Card

1. Open the card
2. Tap the **Share** button
3. Choose how to share:
   - As image
   - As text (barcode number)

### Import Shared Cards

1. Receive shared card data
2. Open in CardWallet
3. Review and save the card

## Privacy and Security

### Data Storage

- All card data is stored locally on your device
- No data is sent to external servers
- Cloud sync is optional and uses your own server

### Sensitive Cards

For cards containing sensitive information:

- Use the app lock feature
- Don't store PINs or passwords in notes
- Be cautious when sharing

## Source Code Reference

Card management is implemented in:

| Feature | Location |
|---------|----------|
| Card List UI | `app/components/list/CardsList.svelte` |
| Card Cell | `app/components/list/CardListCell.svelte` |
| QR Code Service | `app/services/qrcode.ts` |
| Storage | `app/services/documents.ts` |

## Tips and Tricks

### Organize by Color

Use consistent colors for card types:
- 🔵 Blue for groceries
- 🟢 Green for coffee shops
- 🔴 Red for restaurants
- 🟡 Yellow for entertainment

### Quick Add

Double-tap the + button to quickly scan without confirmation dialogs.

### Backup Regularly

Set up cloud sync or create regular backups to avoid losing your cards.
