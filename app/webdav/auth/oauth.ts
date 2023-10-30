import { AuthHeader, OAuthToken } from '../types';

export function generateTokenAuthHeader(token: OAuthToken): AuthHeader {
    return `${token.token_type} ${token.access_token}`;
}
