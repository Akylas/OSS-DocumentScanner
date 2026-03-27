# Google Drive and OneDrive Sync Services - Setup Guide

## Overview

This document explains how to set up and use the new Google Drive and OneDrive sync services that have been added to the Document Scanner app.

## ⚠️ Important: OAuth Credentials Required

The sync services use OAuth 2.0 authentication to securely access your cloud storage. Due to security best practices, OAuth client credentials **cannot** be included in the open-source repository. You must create your own OAuth applications with Google and Microsoft to use these features.

## Setting Up Google Drive Sync

### Step 1: Create Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. In the sidebar, navigate to **APIs & Services** > **Library**
4. Search for "Google Drive API" and enable it

### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Document Scanner" (or your app name)
   - User support email: Your email
   - Developer contact information: Your email
4. Add the required scope: `https://www.googleapis.com/auth/drive.file`
5. Save and continue

### Step 3: Create OAuth 2.0 Credentials

#### For Android:
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Android** as the application type
4. Enter the package name: `com.akylas.documentscanner` (or your package name)
5. Get your SHA-1 certificate fingerprint:
   ```bash
   keytool -list -v -keystore path/to/your/keystore -alias your-key-alias
   ```
6. Copy the OAuth client ID

#### For iOS:
1. Create credentials with **iOS** as the application type
2. Enter your Bundle ID
3. Copy the OAuth client ID

### Step 4: Update the Code

Edit `app/services/sync/GoogleDrive.ts`:

```typescript
export const GOOGLE_DRIVE_PROVIDER: OAuthProvider = {
    name: 'Google Drive',
    config: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace this
        redirectUri: 'com.akylas.documentscanner.oauth:/oauth2redirect',
        scope: 'https://www.googleapis.com/auth/drive.file',
        responseType: 'code'
    }
};
```

Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual client ID.

## Setting Up OneDrive Sync

### Step 1: Register Application in Azure

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Enter application details:
   - Name: "Document Scanner" (or your app name)
   - Supported account types: Choose appropriate option (usually "Accounts in any organizational directory and personal Microsoft accounts")
5. Click **Register**

### Step 2: Configure Authentication

1. In your app registration, go to **Authentication**
2. Click **Add a platform**
3. For Android:
   - Select **Android**
   - Enter package name: `com.akylas.documentscanner`
   - Enter signature hash
4. For iOS:
   - Select **iOS / macOS**
   - Enter Bundle ID
5. Add redirect URI: `com.akylas.documentscanner.oauth:/oauth2redirect`
6. Save changes

### Step 3: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Delegated permissions**
4. Add these permissions:
   - `Files.ReadWrite`
   - `offline_access`
5. Click **Add permissions**

### Step 4: Get Client ID

1. Go to **Overview** tab
2. Copy the **Application (client) ID**

### Step 5: Update the Code

Edit `app/services/sync/OneDrive.ts`:

```typescript
export const ONEDRIVE_PROVIDER: OAuthProvider = {
    name: 'OneDrive',
    config: {
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        clientId: 'YOUR_ONEDRIVE_CLIENT_ID', // Replace this
        redirectUri: 'com.akylas.documentscanner.oauth:/oauth2redirect',
        scope: 'files.readwrite offline_access',
        responseType: 'code'
    }
};
```

Replace `YOUR_ONEDRIVE_CLIENT_ID` with your actual client ID.

## Using the Sync Services

### Adding a Sync Service

1. Open the app and go to **Settings** > **Sync**
2. Tap the **Add** button (+)
3. Select your desired service type:
   - **Google Drive** (Data, Image, or PDF)
   - **OneDrive** (Data, Image, or PDF)
4. Configure the service:
   - Tap **Authenticate** to log in with your account
   - Set the remote folder path (default: "DocumentScanner")
   - Choose a color for identification
   - Enable/disable auto-sync
5. Tap **Save**

### Sync Types Explained

- **Data Sync**: Syncs document metadata and folder structures
- **Image Sync**: Syncs document images (pages)
- **PDF Sync**: Syncs exported PDF files

You can enable multiple sync types simultaneously for comprehensive backup.

### Manual Sync

To manually trigger a sync:
1. Go to **Settings** > **Sync**
2. Tap on the configured sync service
3. Use the sync options in the menu

### Auto-Sync

When enabled, changes are automatically synced when:
- A document is created or modified
- Pages are added or removed
- The app is online and connected

## Troubleshooting

### "OAuth error: invalid_client"
- Verify your client ID is correctly configured
- Ensure the redirect URI matches exactly
- Check that the app signature/bundle ID is correct

### "Authentication cancelled"
- User cancelled the login process
- Try authenticating again

### "Permission denied" or "Access denied"
- Ensure you granted the necessary permissions in your OAuth app
- For Google Drive: Check that the Drive API is enabled
- For OneDrive: Verify the Microsoft Graph permissions are added

### Files not syncing
- Check internet connectivity
- Verify the OAuth tokens haven't expired (they auto-refresh if possible)
- Check the remote folder path is correct
- Review app logs for errors

### Token expired
- Tokens automatically refresh using the refresh token
- If refresh fails, re-authenticate from settings

## Security Considerations

### OAuth 2.0 with PKCE
- The implementation uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) for enhanced security
- This prevents authorization code interception attacks

### Token Storage
- Access tokens are stored in ApplicationSettings
- On iOS: Encrypted in keychain
- On Android: Stored in SharedPreferences (consider using encrypted shared preferences for production)

### Permissions
- Google Drive: Only accesses files created by the app (`drive.file` scope)
- OneDrive: Only accesses user's files with explicit permission

## Limitations

1. **File Size**: Current implementation uses simple upload. Files over 4MB may fail on OneDrive. Consider implementing resumable uploads for production.

2. **Rate Limiting**: No rate limiting implemented. API quota may be exceeded with heavy usage.

3. **Offline Support**: Limited offline capability. Requires network connection for sync operations.

4. **Conflict Resolution**: Basic conflict handling. Newer files overwrite older ones.

## Development Notes

### Testing

Before deploying, test:
- Authentication flow on Android and iOS
- File upload/download operations
- Folder creation and navigation
- Token refresh after expiration
- Network error handling
- Multiple document sync
- Large file handling

### Production Considerations

For production deployment:

1. **Implement Resumable Uploads**: For files larger than 4MB, implement resumable upload APIs
2. **Add Rate Limiting**: Implement exponential backoff and retry logic
3. **Improve Token Storage**: Use encrypted storage for sensitive tokens
4. **Add Conflict Resolution UI**: Let users choose how to handle conflicts
5. **Implement Batch Operations**: Improve performance with batch API calls
6. **Add Quota Monitoring**: Monitor API usage and warn users
7. **Error Recovery**: Implement robust error recovery and offline queue

## Support

For issues or questions:
1. Check the logs (enable DEV_LOG in the code)
2. Review the OAuth provider's documentation
3. Check API quotas and limits
4. Open an issue on the repository with details

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Microsoft Graph Files API](https://docs.microsoft.com/en-us/graph/api/resources/onedrive)
- [OAuth 2.0 with PKCE](https://oauth.net/2/pkce/)
- [NativeScript WebView Plugin](https://docs.nativescript.org/plugins/webview)

## License

This implementation is part of the Document Scanner project and follows the same license (MIT).
