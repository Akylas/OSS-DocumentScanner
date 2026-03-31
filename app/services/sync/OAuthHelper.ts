import { ApplicationSettings } from '@nativescript/core';
import { request } from '~/services/api';

export interface OAuthConfig {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scope: string;
    prompt?: string;
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
 * Exchanges authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(provider: OAuthProvider, code: string, codeVerifier: string): Promise<OAuthTokens> {
    const { clientId, clientSecret, redirectUri, tokenUrl } = provider.config;

    const data = await (
        await request({
            url: tokenUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: {
                grant_type: 'authorization_code',
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            }
        })
    ).json();
    if (data.error) {
        throw new Error(data.error_description);
    }
    DEV_LOG && console.warn('exchangeCodeForTokens got tokens', JSON.stringify(data));

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
    const { clientId, clientSecret, tokenUrl } = provider.config;
    const body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: clientSecret,
        client_id: clientId
    };

    const data = await (
        await request({
            url: tokenUrl,
            method: 'POST',
            responseOnMainThread: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        })
    ).json();
    // DEV_LOG && console.warn('refreshAccessToken got tokens', JSON.stringify(data));
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
export function generateCodeVerifier(): string {
    return generateRandomString(128);
}

/**
 * Generate a random string for state/verifier
 */
export function generateRandomString(length: number): string {
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
