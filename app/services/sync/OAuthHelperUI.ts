import { showModal } from '@shared/utils/svelte/ui';
import { ApplicationSettings } from '@nativescript/core';
import { lc } from '~/helpers/locale';
import { SilentError } from '@akylas/nativescript-app-utils/error';
import { queryString } from '~/services/api';
import { toBase64 } from '~/webdav/tools/encode';
import { generateCodeChallenge } from '~/utils/utils';
import { request } from '@nativescript-community/https';
import { OAuthProvider, OAuthTokens, exchangeCodeForTokens, generateCodeVerifier, generateRandomString } from '~/services/sync/OAuthHelper';

interface ParsedUrl {
    baseUrl: string;
    path: string;
    query: Record<string, string>;
    hash?: string;
}

export function parseUrl(input: string): ParsedUrl {
    let url = input.trim();

    // Extract hash (#...)
    let hash = '';
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
        hash = url.slice(hashIndex + 1);
        url = url.slice(0, hashIndex);
    }

    // Extract query (?...)
    let queryString = '';
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
        queryString = url.slice(queryIndex + 1);
        url = url.slice(0, queryIndex);
    }

    // Extract base + path
    let baseUrl = '';
    let path = '';

    const protoMatch = url.match(/^(https?:\/\/[^/]+)/);
    if (protoMatch) {
        baseUrl = protoMatch[1];
        path = url.slice(baseUrl.length) || '/';
    } else {
        path = url || '/';
    }

    // Parse query into object
    const query: Record<string, string> = {};

    if (queryString) {
        const pairs = queryString.split('&');

        for (const pair of pairs) {
            if (!pair) continue;

            const eqIndex = pair.indexOf('=');
            if (eqIndex === -1) {
                query[decodeURIComponent(pair)] = '';
            } else {
                const key = pair.slice(0, eqIndex);
                const value = pair.slice(eqIndex + 1);

                query[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
    }

    return { baseUrl, path, query, hash };
}

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
            access_type: 'offline',
            prompt: provider.config.prompt ?? 'consent',
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

        if (!result || result?.cancelled) {
            return;
        }

        // Parse the callback URL
        const urlData = parseUrl(result.url);

        const returnedState = urlData.query['state'];
        if (returnedState !== state) {
            throw new Error('State parameter mismatch - potential CSRF attack');
        }

        const code = urlData.query['code'];
        const error = urlData.query['error'];

        if (error) {
            throw new Error(`OAuth error: ${error} - ${urlData.query['error_description']}`);
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
