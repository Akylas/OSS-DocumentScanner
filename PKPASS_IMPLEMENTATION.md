# PKPass Support Implementation

This document describes the PKPass (Apple Wallet Pass) support implementation in the Card Wallet app.

## Overview

The implementation adds support for importing and displaying .pkpass files (Apple Wallet passes) in the Card Wallet app. Users can import boarding passes, tickets, loyalty cards, and other pass types.

## Architecture

### Data Models

#### PKPass Model (`app/models/PKPass.ts`)
- Represents a PKPass with all its data and metadata
- Supports all standard PKPass types: boardingPass, coupon, eventTicket, storeCard, generic
- Includes fields, barcodes, images, and styling information

### Database

#### PKPass Table
A new table stores PKPass data:
- `id`: Unique identifier
- `document_id`: Link to the associated document
- `passData`: JSON string with pass.json contents
- `images`: JSON string with image file paths
- `passJsonPath`: Path to extracted pass.json
- `imagesPath`: Path to extracted images folder

#### PKPassRepository (`app/services/documents.ts`)
- CRUD operations for PKPass entities
- `createPKPass()`: Store a new pass
- `getByDocumentId()`: Retrieve pass by document ID

### Utilities

#### PKPass Parser (`app/utils/pkpass.ts`)
- `parsePKPassFile()`: Extract and parse .pkpass files (ZIP archives)
- `getPKPassDisplayName()`: Get display name from pass data
- `getPKPassPrimaryImage()`: Get primary image for list display
- `isPKPassFile()`: Validate if file is a .pkpass file

#### PKPass Importer (`app/utils/pkpass-import.ts`)
- `importPKPassFile()`: Full import workflow
  1. Parse .pkpass file
  2. Create document
  3. Extract and store images
  4. Save pass data to database
- `getPKPassForDocument()`: Load PKPass for a document
- `hasPKPassData()`: Check if document has PKPass

### UI Components

#### PKPassView (`app/components/view/PKPassView.svelte`)
Renders PKPass data with:
- Header with logo and organization name
- Strip image (if available)
- Primary fields (large display)
- Secondary fields (medium display)
- Auxiliary fields (small display)
- Barcode/QR code
- Back fields (additional information)
- Expiration/voided status

#### CardView Integration
- Detects documents with PKPass data
- Loads and displays PKPass in extra items section
- Seamlessly integrates with existing card display

## Usage

### Importing a PKPass

```typescript
import { importPKPassFile } from '~/utils/pkpass-import';
import { DocFolder } from '~/models/OCRDocument';

// Import a .pkpass file
const pkpassPath = '/path/to/pass.pkpass';
const folder: DocFolder = ...; // optional

try {
    const document = await importPKPassFile(pkpassPath, folder);
    console.log('PKPass imported:', document.id);
} catch (error) {
    console.error('Import failed:', error);
}
```

### Checking for PKPass Data

```typescript
import { hasPKPassData, getPKPassForDocument } from '~/utils/pkpass-import';
import { OCRDocument } from '~/models/OCRDocument';

const document: OCRDocument = ...;

if (hasPKPassData(document)) {
    const pkpass = await getPKPassForDocument(document);
    if (pkpass) {
        console.log('Pass:', pkpass.passData.organizationName);
    }
}
```

### Rendering PKPass

The PKPassView component automatically renders when integrated into CardView:

```svelte
<PKPassView pkpass={pkpass} />
```

## File Storage

PKPass data is stored in the document's folder structure:

```
data/
  {document_id}/
    pkpass/
      pass.json          # Pass data
      icon.png           # Icon images
      icon@2x.png
      logo.png           # Logo images
      logo@2x.png
      strip.png          # Strip images (if available)
      strip@2x.png
      background.png     # Background images (if available)
      background@2x.png
      # ... other images
```

## Sample PKPass

A sample PKPass file is included for testing:
- Location: `app/assets/samples/sample-loyalty-card.pkpass`
- Type: Store Card (Loyalty Card)
- Features: Balance, member info, tier, QR code barcode

## Testing

To test PKPass support:

1. Copy the sample .pkpass file to a device
2. Use the app's import functionality to select the .pkpass file
3. Verify that a new document is created
4. Open the document to view the PKPass data
5. Verify all fields and barcode display correctly

## Future Enhancements

Potential improvements:
- Support for pass updates via webServiceURL
- Push notification integration
- Location-based pass display
- Pass sharing functionality
- Multiple pass templates/themes
- Bulk import of multiple passes

## Technical Notes

### PKPass Format
- PKPass files are ZIP archives with .pkpass extension
- Contains pass.json with all pass data
- Includes PNG images at various resolutions (@2x, @3x)
- Signed with manifest and signature files (not validated in this implementation)

### Compatibility
- Supports all standard PKPass types (Apple Wallet specification)
- Parses pass.json according to Apple's PassKit schema
- Handles multiple barcode formats: QR, PDF417, Aztec, Code128

### Security Considerations
- PKPass signature validation not implemented (read-only use case)
- Extracted files stored in app's private data folder
- No network calls to webServiceURL (offline mode)
