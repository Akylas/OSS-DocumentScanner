import { createDigestContext } from './digest';
import { generateBasicAuthHeader } from './basic';
import { generateTokenAuthHeader } from './oauth';
import { AuthType, ErrorCode, OAuthToken, WebDAVClientContext } from '../types';

export function setupAuth(context: WebDAVClientContext, username: string, password: string, oauthToken: OAuthToken, ha1: string): void {
    switch (context.authType) {
        case AuthType.Digest:
            context.digest = createDigestContext(username, password, ha1);
            break;
        case AuthType.None:
            // Do nothing
            break;
        case AuthType.Password:
            context.headers.Authorization = generateBasicAuthHeader(username, password);
            break;
        case AuthType.Token:
            context.headers.Authorization = generateTokenAuthHeader(oauthToken);
            break;
        default:
            throw new Error(`Invalid auth type: ${context.authType}`);
    }
}
