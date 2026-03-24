<script lang="ts">
    import { Writable, get } from 'svelte/store';
    import { lc } from '~/helpers/locale';
    import { showError } from '@shared/utils/showError';
    import { colors } from '~/variables';
    import RemoteFolderTextField from '../common/RemoteFolderTextField.svelte';
    import { performOAuthFlow, OAuthProvider, OAuthTokens } from '~/services/sync/OAuthHelper';
    import { SilentError } from '@akylas/nativescript-app-utils/error';

    $: ({ colorError, colorOnError, colorOnSurfaceVariant, colorSecondary } = $colors);

    const variant = 'outline';
    
    export let store: Writable<any>;
    export let provider: OAuthProvider;
    export let testConnection: (tokens: OAuthTokens) => Promise<boolean>;
    
    let authenticating = false;
    let testing = false;
    let testConnectionSuccess = 0;
    let isAuthenticated = false;

    $: {
        // Check if we have tokens
        isAuthenticated = !!($store.accessToken);
    }

    async function authenticate() {
        try {
            authenticating = true;
            const tokens = await performOAuthFlow(provider);
            
            $store.accessToken = tokens.accessToken;
            $store.refreshToken = tokens.refreshToken;
            $store.expiresAt = tokens.expiresAt;
            
            isAuthenticated = true;
            testConnectionSuccess = 1;
            
            setTimeout(() => {
                testConnectionSuccess = 0;
            }, 3000);
        } catch (error) {
            showError(error);
            testConnectionSuccess = -1;
            setTimeout(() => {
                testConnectionSuccess = 0;
            }, 3000);
        } finally {
            authenticating = false;
        }
    }

    async function testConnectionAction() {
        try {
            if (!$store.accessToken) {
                throw new SilentError(lc('not_authenticated'));
            }
            testing = true;
            const tokens: OAuthTokens = {
                accessToken: $store.accessToken,
                refreshToken: $store.refreshToken,
                expiresAt: $store.expiresAt
            };
            const result = await testConnection(tokens);
            testConnectionSuccess = result ? 1 : -1;
            setTimeout(() => {
                testConnectionSuccess = 0;
            }, 3000);
        } catch (error) {
            showError(error);
            testConnectionSuccess = -1;
            setTimeout(() => {
                testConnectionSuccess = 0;
            }, 3000);
        } finally {
            testing = false;
        }
    }

    export async function validateSave() {
        if (!$store.accessToken) {
            throw new SilentError(lc('not_authenticated'));
        }
        if (!$store.remoteFolder?.length) {
            throw new SilentError(lc('missing_remote_folder'));
        }
        return true;
    }
</script>

<stacklayout>
    <gridlayout columns="*,auto" rows="auto">
        <stacklayout col={0}>
            <label class="sectionHeader" text={lc('authentication')} />
            <label
                color={colorOnSurfaceVariant}
                fontSize={13}
                padding="0 16 0 16"
                text={isAuthenticated ? lc('authenticated') : lc('not_authenticated')}
                textWrap={true} />
        </stacklayout>
        <mdbutton
            col={1}
            isLoading={authenticating}
            margin="0 16 0 0"
            text={lc(isAuthenticated ? 're_authenticate' : 'authenticate')}
            variant="outline"
            verticalAlignment="center"
            on:tap={authenticate} />
    </gridlayout>

    <gridlayout columns="*,auto" margin="10 16" visibility={isAuthenticated ? 'visible' : 'collapse'}>
        <label col={0} text={lc('connection_status')} verticalAlignment="center" />
        <mdbutton
            col={1}
            isLoading={testing}
            text={lc('test_connection')}
            variant="text"
            on:tap={testConnectionAction} />
        <label
            class="mdi"
            col={1}
            color={testConnectionSuccess > 0 ? 'green' : colorError}
            fontSize={24}
            text={testConnectionSuccess > 0 ? 'mdi-check-circle' : 'mdi-alert-circle'}
            verticalAlignment="center"
            visibility={testConnectionSuccess !== 0 ? 'visible' : 'collapse'} />
    </gridlayout>

    <RemoteFolderTextField
        hint={lc('remote_folder')}
        margin="5 4"
        placeholder={lc('remote_folder_placeholder')}
        returnKeyType="done"
        text={$store.remoteFolder}
        {variant}
        on:textChange={(e) => ($store.remoteFolder = e['value'])} />
</stacklayout>