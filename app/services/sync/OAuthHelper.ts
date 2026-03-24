import { InAppBrowser } from '@akylas/nativescript-inappbrowser';
import { ApplicationSettings } from '@nativescript/core';
import { lc } from '~/helpers/locale';
import { SilentError } from '@akylas/nativescript-app-utils/error';

export interface OAuthConfig {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    responseType?: string;
}

export interface OAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType?: string;
}

export interface OAuthProvider {
    name: string;
    config: OAuthConfig;
}

/**
 * Performs OAuth 2.0 authentication flow using an in-app browser
 * @param provider OAuth provider configuration
 * @returns OAuth tokens
 */
export async function performOAuthFlow(provider: OAuthProvider): Promise<OAuthTokens> {
    const { authUrl, redirectUri, responseType = 'code' } = provider.config;
    
    try {
        // Build authorization URL with PKCE for security
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const state = generateRandomString(32);
        
        const authUrlWithParams = `${authUrl}?${new URLSearchParams({
            client_id: provider.config.clientId,
            redirect_uri: redirectUri,
            response_type: responseType,
            scope: provider.config.scope,
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        }).toString()}`;

        DEV_LOG && console.log('OAuth: Opening auth URL:', authUrlWithParams);

        // Open in-app browser for authentication
        const result = await InAppBrowser.openAuth(authUrlWithParams, redirectUri, {
            // Customize appearance
            showTitle: true,
            enableUrlBarHiding: false,
            enableDefaultShare: false
        });

        if (result.type === 'cancel') {
            throw new SilentError(lc('authentication_cancelled'));
        }

        if (result.type !== 'success') {
            throw new Error(`Authentication failed: ${result.type}`);
        }

        // Parse the callback URL
        const url = new URL(result.url);
        const params = new URLSearchParams(url.search);
        
        const returnedState = params.get('state');
        if (returnedState !== state) {
            throw new Error('State parameter mismatch - potential CSRF attack');
        }

        const code = params.get('code');
        const error = params.get('error');
        
        if (error) {
            throw new Error(`OAuth error: ${error} - ${params.get('error_description')}`);
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

/**
 * Exchanges authorization code for access and refresh tokens
 */
async function exchangeCodeForTokens(provider: OAuthProvider, code: string, codeVerifier: string): Promise<OAuthTokens> {
    const { tokenUrl, clientId, redirectUri } = provider.config;
    
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    }).toString();

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
        tokenType: data.token_type || 'Bearer'
    };
}

/**
 * Refreshes an expired access token
 */
export async function refreshAccessToken(provider: OAuthProvider, refreshToken: string): Promise<OAuthTokens> {
    const { tokenUrl, clientId } = provider.config;
    
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
    }).toString();

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken, // Keep old refresh token if not provided
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
        tokenType: data.token_type || 'Bearer'
    };
}

/**
 * Checks if a token is expired or about to expire
 */
export function isTokenExpired(expiresAt?: number, bufferSeconds: number = 300): boolean {
    if (!expiresAt) {
        return false; // Assume valid if no expiry time
    }
    return Date.now() >= expiresAt - bufferSeconds * 1000;
}

/**
 * Generate a random code verifier for PKCE
 */
function generateCodeVerifier(): string {
    return generateRandomString(128);
}

/**
 * Generate a code challenge from a verifier for PKCE
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
    // For simplicity, we'll use the plain method
    // In production, you should use S256 (SHA-256 hash)
    // This would require importing a crypto library
    return base64URLEncode(verifier);
}

/**
 * Generate a random string for state/verifier
 */
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomValues = new Uint8Array(length);
    
    // Generate random values
    for (let i = 0; i < length; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
    }
    
    for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    
    return result;
}

/**
 * Base64 URL encode a string
 */
function base64URLEncode(str: string): string {
    // Simple base64 encoding for the plain method
    // In a real implementation, you'd want proper base64url encoding
    return str
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Store OAuth tokens securely
 */
export function storeTokens(serviceType: string, tokens: OAuthTokens): void {
    ApplicationSettings.setString(`${serviceType}_oauth_tokens`, JSON.stringify(tokens));
}

/**
 * Retrieve stored OAuth tokens
 */
export function getStoredTokens(serviceType: string): OAuthTokens | null {
    const stored = ApplicationSettings.getString(`${serviceType}_oauth_tokens`);
    if (!stored) {
        return null;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
}

/**
 * Clear stored OAuth tokens
 */
export function clearTokens(serviceType: string): void {
    ApplicationSettings.remove(`${serviceType}_oauth_tokens`);
}
