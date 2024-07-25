<script lang="ts">
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { Color, View } from '@nativescript/core';
    import { get, writable } from 'svelte/store';
    import { lc } from '~/helpers/locale';
    import { WebdavDataSyncOptions } from '~/services/sync/WebdavDataSyncService';
    import { showError } from '~/utils/showError';
    import { closeModal } from '~/utils/svelte/ui';
    import { pickColor } from '~/utils/ui';
    import { colors, windowInset } from '~/variables';
    import CActionBar from '../common/CActionBar.svelte';
    import ListItemAutoSize from '../common/ListItemAutoSize.svelte';
    import WebdavSettingsView from './WebdavSettingsView.svelte';
    import { SERVICES_SYNC_COLOR } from '~/services/sync/types';
    // technique for only specific properties to get updated on store change
    $: ({ colorError, colorOutline, colorPrimary, colorSecondary, colorOnError, colorOnSurfaceVariant } = $colors);

    export let data: WebdavDataSyncOptions = null;
    const store = writable(Object.assign({ autoSync: false, enabled: true, color: SERVICES_SYNC_COLOR['webdav_data'] as string | Color }, data));

    let webdavView: WebdavSettingsView;

    async function save() {
        if (webdavView?.validateSave()) {
            const result = get(store);
            closeModal(result);
            // WebdavDataSyncService.saveData({ username, password, remoteURL, remoteFolder, authType, token });
            // closeBottomSheet(true);
        }
    }

    let checkboxTapTimer;
    function clearCheckboxTimer() {
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
    }
    let ignoreNextOnCheckBoxChange = false;
    async function onCheckBox(event, onUpdate) {
        if (ignoreNextOnCheckBoxChange) {
            return;
        }
        const value = event.value;
        clearCheckboxTimer();
        try {
            ignoreNextOnCheckBoxChange = true;
            onUpdate(event);
        } catch (error) {
            showError(error);
        } finally {
            ignoreNextOnCheckBoxChange = false;
        }
    }
    function unCheckBoxItemTap(event) {
        // we dont want duplicate events so let s timeout and see if we clicking diretly on the checkbox
        const checkboxView: CheckBox = ((event.object as View).parent as View).getViewById('checkbox');
        clearCheckboxTimer();
        checkboxTapTimer = setTimeout(() => {
            checkboxView.checked = !checkboxView.checked;
        }, 10);
    }

    async function changeColor() {
        try {
            const newColor = await pickColor($store.color);
            if (newColor) {
                $store.color = newColor.hex;
            }
        } catch (error) {
            showError(error);
        }
    }
</script>

<page id="webdavsyncsettings" actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <scrollview row={1}>
            <stacklayout android:paddingBottom={$windowInset.bottom}>
                <ListItemAutoSize fontSize={20} subtitle={lc('sync_service_color_desc')} title={lc('color')} on:tap={changeColor}>
                    <absolutelayout backgroundColor={$store.color} borderColor={colorOutline} borderRadius="50%" borderWidth={2} col={1} height={40} marginLeft={10} width={40} />
                </ListItemAutoSize>
                <ListItemAutoSize fontSize={20} title={lc('enabled')} on:tap={unCheckBoxItemTap}>
                    <switch
                        id="checkbox"
                        checked={$store.enabled}
                        col={1}
                        marginLeft={10}
                        on:checkedChange={(e) =>
                            onCheckBox(e, (e) => {
                                $store.enabled = e.value;
                            })}
                        ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
                <ListItemAutoSize fontSize={20} subtitle={lc('remote_data_auto_sync')} title={lc('auto_sync')} on:tap={unCheckBoxItemTap}>
                    <switch
                        id="checkbox"
                        checked={$store.autoSync}
                        col={1}
                        marginLeft={10}
                        on:checkedChange={(e) =>
                            onCheckBox(e, (e) => {
                                $store.autoSync = e.value;
                            })}
                        ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
                <WebdavSettingsView bind:this={webdavView} {store} />
            </stacklayout>
        </scrollview>
        <CActionBar canGoBack modalWindow={true} title={lc('webdav_config')}>
            <mdbutton text={lc('save')} variant="text" verticalAlignment="middle" on:tap={save} />
            <!-- <mdbutton class="actionBarButton" text={lc('save')} variant="text" on:tap={save} /> -->
        </CActionBar>
    </gridlayout>
</page>
