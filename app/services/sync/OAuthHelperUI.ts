import { showModal } from '@shared/utils/svelte/ui';
import { ApplicationSettings } from '@nativescript/core';
import { lc } from '~/helpers/locale';
import { SilentError } from '@akylas/nativescript-app-utils/error';
import { queryString } from '~/services/api';
import { toBase64 } from '~/webdav/tools/encode';
import { generateCodeChallenge } from '~/utils/utils';
import { request } from '@nativescript-community/https';
import { OAuthProvider, OAuthTokens, exchangeCodeForTokens, generateCodeVerifier, generateRandomString } from '~/services/sync/OAuthHelper';

/**
 * Performs OAuth 2.0 authentication flow using a modal webview
 * @param provider OAuth provider configuration
 * @returns OAuth tokens
 */
export async function performOAuthFlow(provider: OAuthProvider): Promise<OAuthTokens> {
    const { authUrl, redirectUri, responseType = 'code' } = provider.config;

    try {
        // Build authorization URL with PKCE for security
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        const state = generateRandomString(32);

        const params = {
            client_id: provider.config.clientId,
            redirect_uri: redirectUri,
            response_type: responseType,
            scope: provider.config.scope,
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        };

        const authUrlWithParams = queryString(params, authUrl);

        DEV_LOG && console.log('OAuth: Opening auth URL:', authUrlWithParams);

        // Open modal webview for authentication
        const OAuthWebViewModal = (await import('~/components/OAuthWebViewModal.svelte')).default;
        const result: { url?: string; cancelled?: boolean } = await showModal({
            page: OAuthWebViewModal,
            fullscreen: true,
            props: {
                url: authUrlWithParams,
                redirectUri
            }
        });

        if (result?.cancelled) {
            throw new SilentError(lc('authentication_cancelled'));
        }

        // Parse the callback URL
        const url = new URL(result.url);
        const urlParams = new URLSearchParams(url.search);

        const returnedState = urlParams.get('state');
        if (returnedState !== state) {
            throw new Error('State parameter mismatch - potential CSRF attack');
        }

        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            throw new Error(`OAuth error: ${error} - ${urlParams.get('error_description')}`);
        }

        if (!code) {
            throw new Error('No authorization code received');
        }

        // Exchange authorization code for tokens
        const tokens = await exchangeCodeForTokens(provider, code, codeVerifier);

        return tokens;
    } catch (error) {
        DEV_LOG && console.error('OAuth flow error:', error);
        throw error;
    }
}
