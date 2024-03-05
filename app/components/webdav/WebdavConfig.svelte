<script lang="ts">
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { lc } from '~/helpers/locale';
    import { syncService } from '~/services/sync';
    import { showError } from '~/utils/error';
    import { colors } from '~/variables';
    import { AuthType } from '~/webdav';
    // technique for only specific properties to get updated on store change
    $: ({ colorError, colorSecondary, colorOnError, colorOnSurfaceVariant } = $colors);

    let remoteURL = syncService.remoteURL;
    let username = syncService.username;
    let password = username ? 'fakepassworddata' : undefined;
    let remoteFolder = syncService.remoteFolder;
    let testing = false;
    let testConnectionSuccess = 0;
    const variant = 'filled';

    function focusTextfield(id: string) {}

    async function testConnection() {
        try {
            testing = true;
            const result = await syncService.testConnection({ username, password, remoteURL, remoteFolder });
            testConnectionSuccess = result ? 1 : -1;
        } catch (error) {
            console.error('error');
            showError(error);
        } finally {
            testing = false;
        }
    }
    async function save() {
        // if (testConnectionSuccess > 0) {
        syncService.saveData({ username, password, remoteURL, remoteFolder, authType: AuthType.Digest });
        closeBottomSheet();
        // }
    }
</script>

<gesturerootview id="webdavConfig" margin={10} {...$$restProps} rows="auto">
    <stacklayout>
        <label class="sectionHeader" fontSize={19} text={lc('webdav_config')} />
        <textfield
            autocapitalizationType="none"
            hint={lc('server_address')}
            keyboardType="url"
            margin={5}
            placeholder={lc('server_address') + ' https://...'}
            returnKeyType="next"
            text={remoteURL}
            {variant}
            on:returnPress={() => focusTextfield('username')}
            on:textChange={(e) => (remoteURL = e['value'])} />
        <textfield
            autocapitalizationType="none"
            autocorrect={false}
            hint={lc('username')}
            margin={5}
            placeholder={lc('username')}
            returnKeyType="next"
            row={1}
            text={username}
            {variant}
            on:returnPress={() => focusTextfield('password')}
            on:textChange={(e) => (username = e['value'])} />
        <textfield
            autocapitalizationType="none"
            autocorrect={false}
            hint={lc('password_not_saved')}
            margin={5}
            placeholder={lc('password')}
            placeholderColor="gray"
            returnKeyType="next"
            row={2}
            secure={true}
            text={password}
            {variant}
            on:returnPress={() => focusTextfield('remote_folder')}
            on:textChange={(e) => (password = e['value'])} />
        <gridlayout columns="*" margin={5} row={3} rows="auto">
            <textfield
                autocapitalizationType="none"
                autocorrect={false}
                hint={lc('remote_folder_desc')}
                paddingRight={100}
                placeholder={lc('remote_folder')}
                returnKeyType="done"
                text={remoteFolder}
                {variant}
                on:returnPress={testConnection}
                on:textChange={(e) => (remoteFolder = e['value'])} />
            <mdbutton class="icon-btn" color={colorOnSurfaceVariant} horizontalAlignment="right" text="mdi-folder-open" variant="text" verticalAlignment="middle" />
        </gridlayout>
        <gridlayout columns="*,*" row={4} rows="auto">
            <mdbutton text={lc('save')} verticalAlignment="middle" on:tap={save} />
            <gridlayout col={1} columns="auto" horizontalAlignment="right" rows="auto" verticalAlignment="middle">
                <mdbutton
                    backgroundColor={testConnectionSuccess < 0 ? colorError : testConnectionSuccess > 0 ? 'lightgreen' : colorSecondary}
                    color={colorOnError}
                    text={testConnectionSuccess < 0 ? lc('failed') : testConnectionSuccess > 0 ? lc('successful') : lc('test')}
                    verticalAlignment="middle"
                    visibility={testing ? 'hidden' : 'visible'}
                    on:tap={testConnection} />
                <activityindicator busy={testing} height={20} horizontalAlignment="center" verticalAlignment="middle" visibility={testing ? 'visible' : 'hidden'} />
            </gridlayout>
        </gridlayout>
    </stacklayout>
</gesturerootview>
