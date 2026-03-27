# Google Drive and OneDrive Sync Services

## Overview

This implementation adds Google Drive and OneDrive as sync service providers for the Document Scanner app. The implementation uses OAuth 2.0 authentication with PKCE through an in-app browser modal for security.

## Important: OAuth Configuration Required

**Before these services can be used, you must configure OAuth credentials:**

### Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials (type: Android/iOS app)
5. Add the redirect URI: `com.akylas.documentscanner.oauth:/oauth2redirect`
6. Update the `clientId` in `app/services/sync/GoogleDrive.ts`:
   ```typescript
   clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
   ```

### OneDrive Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure AD
3. Add a redirect URI: `com.akylas.documentscanner.oauth:/oauth2redirect`
4. Grant permissions: `Files.ReadWrite`, `offline_access`
5. Update the `clientId` in `app/services/sync/OneDrive.ts`:
   ```typescript
   clientId: 'YOUR_ONEDRIVE_CLIENT_ID',
   ```

## Architecture

The implementation follows the existing sync service pattern:

- **Base OAuth Helper** (`OAuthHelper.ts`): Handles OAuth 2.0 flows with PKCE
- **Provider APIs** (`GoogleDrive.ts`, `OneDrive.ts`): API wrappers for each cloud service
- **Sync Services**: Three sync services per provider (Data, Image, PDF)
  - Data: Syncs document metadata and structure
  - Image: Syncs document images
  - PDF: Syncs exported PDFs

## Features

- ✅ OAuth 2.0 with PKCE for security
- ✅ Token refresh handling
- ✅ In-app browser authentication
- ✅ TypeScript only with minimal dependencies
- ✅ Follows existing sync service patterns
- ✅ Supports folder structures
- ✅ .valid marker for safe sync

## Known Limitations

1. **OAuth Credentials**: Users must configure their own OAuth credentials (cannot be bundled in open-source app)
2. **Large File Uploads**: Current implementation uses simple upload (< 4MB for OneDrive). For larger files, implement resumable uploads.
3. **Rate Limiting**: No rate limiting or retry logic implemented yet
4. **Batch Operations**: Files are uploaded/downloaded sequentially. Could be optimized with batch operations.
5. **Offline Support**: Limited offline support - requires network connection

## Usage

### Configuring a Google Drive Sync Service

1. Go to Settings > Sync
2. Tap "Add Sync Service"
3. Select "Google Drive"
4. Choose sync type (Data, Image, or PDF)
5. Tap "Authenticate" to log in with Google
6. Configure remote folder path
7. Enable auto-sync if desired

### Configuring a OneDrive Sync Service

Same process as Google Drive, but select "OneDrive" instead.

## Testing

Before deploying to production, thoroughly test:

1. Authentication flow on both Android and iOS
2. File uploads and downloads
3. Folder creation and navigation
4. Token refresh after expiration
5. Error handling for network issues
6. Sync with multiple documents
7. Conflict resolution

## Security Considerations

1. **OAuth Tokens**: Stored in ApplicationSettings (encrypted on iOS, less secure on Android)
2. **PKCE**: Implemented for additional security
3. **Token Refresh**: Automatic refresh before expiration
4. **Redirect URI**: Must match exactly in OAuth configuration

## Future Improvements

- [ ] Implement resumable uploads for large files
- [ ] Add rate limiting and exponential backoff
- [ ] Implement batch operations for better performance
- [ ] Add conflict resolution UI
- [ ] Support shared folders
- [ ] Add quota monitoring
- [ ] Implement offline queue for sync operations
- [ ] Add sync progress indicators per file
- [ ] Support for other cloud providers (Dropbox, Box, etc.)

## Dependencies

Uses only existing dependencies:
- `@akylas/nativescript-inappbrowser`: For OAuth flow
- `@nativescript-community/https`: For API requests
- NativeScript core modules

## Troubleshooting

### Authentication Fails

- Verify OAuth credentials are correctly configured
- Check redirect URI matches exactly
- Ensure API permissions are granted
- Check network connectivity

### Files Not Syncing

- Check token expiration and refresh
- Verify remote folder exists
- Check file permissions
- Review logs for API errors

### Token Expired

Tokens automatically refresh if refresh token is available. If refresh fails:
- Re-authenticate from settings
- Check OAuth credentials validity

## Contributing

When extending these sync services:

1. Follow the existing pattern from WebDAV services
2. Implement all abstract methods from base classes
3. Add proper error handling
4. Include DEV_LOG statements for debugging
5. Update this README with any changes
6. Test thoroughly on both platforms

## License

Same as the main project (MIT License)
