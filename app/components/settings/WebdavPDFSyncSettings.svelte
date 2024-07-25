<script lang="ts">
    import { lc, slc } from '~/helpers/locale';
    import { WebdavDataSyncOptions, WebdavDataSyncService } from '~/services/sync/WebdavDataSyncService';
    import { showError } from '~/utils/showError';

    import { pickColor, showPopoverMenu } from '~/utils/ui';
    import { colors, windowInset } from '~/variables';
    import { AuthType } from '~/webdav';
    import CActionBar from '../common/CActionBar.svelte';
    import ListItemAutoSize from '../common/ListItemAutoSize.svelte';
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { ApplicationSettings, Color, View } from '@nativescript/core';
    import { get, writable } from 'svelte/store';
    import WebdavSettingsView from './WebdavSettingsView.svelte';
    import PdfSyncSettingsView from './PDFSyncSettingsView.svelte';
    import { WebdavPDFSyncServiceOptions } from '~/services/sync/WebdavPDFSyncService';
    import { FILENAME_DATE_FORMAT, FILENAME_USE_DOCUMENT_NAME, SETTINGS_FILE_NAME_FORMAT, SETTINGS_FILE_NAME_USE_DOCUMENT_NAME } from '~/utils/constants';
    import { getPDFDefaultExportOptions } from '~/services/pdf/PDFCanvas';
    import { SERVICES_SYNC_COLOR } from '~/services/sync/types';
    import { closeModal } from '~/utils/svelte/ui';
    // technique for only specific properties to get updated on store change
    $: ({ colorOutline, colorPrimary } = $colors);

    const pdfExportSettings = getPDFDefaultExportOptions();
    export let data: WebdavPDFSyncServiceOptions = null;
    const store = writable(
        Object.assign(
            {
                exportOptions: pdfExportSettings,
                autoSync: false,
                enabled: true,
                fileNameFormat: ApplicationSettings.getString(SETTINGS_FILE_NAME_FORMAT, FILENAME_DATE_FORMAT),
                useDocumentName: ApplicationSettings.getBoolean(SETTINGS_FILE_NAME_USE_DOCUMENT_NAME, FILENAME_USE_DOCUMENT_NAME),

                color: SERVICES_SYNC_COLOR['webdav_data'] as string | Color
            },
            data
        )
    );

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
                <label class="sectionHeader" text={lc('webdav_config')} />
                <WebdavSettingsView bind:this={webdavView} {store} />
                <label class="sectionHeader" text={lc('pdf_export_settings')} />
                <PdfSyncSettingsView {store} />
            </stacklayout>
        </scrollview>
        <CActionBar canGoBack modalWindow={true} title={lc('webdav_config')}>
            <mdbutton text={lc('save')} variant="text" verticalAlignment="middle" on:tap={save} />
            <!-- <mdbutton class="actionBarButton" text={lc('save')} variant="text" on:tap={save} /> -->
        </CActionBar>
    </gridlayout>
</page>
