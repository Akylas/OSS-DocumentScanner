<script lang="ts">
    import { lc } from '~/helpers/locale';
    import { colors } from '~/variables';
    import { syncService } from '~/services/sync';
    import { showError } from '~/utils/error';
    import { closeBottomSheet } from '~/utils/svelte/bottomsheet';
    // technique for only specific properties to get updated on store change
    $: ({ colorError, colorSecondary, colorOnError } = $colors);

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
            DEV_LOG && console.log('testConnection', { username, password, remoteURL, remoteFolder });
            testing = true;
            const result = await syncService.testConnection({ username, password, remoteURL, remoteFolder });
            console.log('test', result);
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
        syncService.saveData({ username, password, remoteURL, remoteFolder });
        closeBottomSheet();
        // }
    }
</script>

<gesturerootview margin={10} {...$$restProps} rows="auto">
    <stacklayout>
        <label fontSize={19} fontWeight="bold" margin={5} text={lc('webdav_config')} />
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
            <mdbutton class="icon-btn" horizontalAlignment="right" text="mdi-folder-open" variant="text" verticalAlignment="middle" />
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
                <activityindicator class="activity-indicator" busy={testing} height={20} horizontalAlignment="center" verticalAlignment="middle" visibility={testing ? 'visible' : 'hidden'} />
            </gridlayout>
        </gridlayout>
    </stacklayout>
</gesturerootview>
