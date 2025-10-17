<script lang="ts">
    import { showError } from '@shared/utils/showError';
    import { l, lc } from '~/helpers/locale';

    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Label } from '@nativescript-community/ui-label';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { TextFieldProperties } from '@nativescript-community/ui-material-textfield';
    import { ApplicationSettings, Color, ObservableArray, Page, View } from '@nativescript/core';
    import { closeModal } from '@shared/utils/svelte/ui';
    import { createView } from '@shared/utils/ui';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { get, writable } from 'svelte/store';
    import { getPDFDefaultExportOptions } from '~/services/pdf/PDFCanvas';
    import { SERVICES_SYNC_COLOR } from '~/services/sync/types';
    import { WebdavPDFSyncServiceOptions } from '~/services/sync/WebdavPDFSyncService';
    import { ALERT_OPTION_MAX_HEIGHT, FILENAME_DATE_FORMAT, FILENAME_USE_DOCUMENT_NAME, SETTINGS_FILE_NAME_FORMAT, SETTINGS_FILE_NAME_USE_DOCUMENT_NAME } from '~/utils/constants';
    import { checkOrDownloadOCRLanguages, getNameFormatHTMLArgs, openLink, pickColor, showAlertOptionSelect, showSliderPopover, showSnack } from '~/utils/ui';
    import { colors, windowInset } from '~/variables';
    import CActionBar from '../common/CActionBar.svelte';
    import ListItemAutoSize from '../common/ListItemAutoSize.svelte';
    import OcrSettingsBottomSheet from '../ocr/OCRSettingsBottomSheet.svelte';
    import PdfSyncSettingsView from './PDFSyncSettingsView.svelte';
    import WebdavSettingsView from './WebdavSettingsView.svelte';
    // technique for only specific properties to get updated on store change
    let { colorOnSurfaceVariant, colorOutline, colorPrimary } = $colors;
    $: ({ colorOnSurfaceVariant, colorOutline, colorPrimary } = $colors);

    const tMargin = '4 10 4 10';
    let page: NativeViewElementNode<Page>;
    let collectionView: NativeViewElementNode<CollectionView>;

    const pdfExportSettings = getPDFDefaultExportOptions();
    export let data: WebdavPDFSyncServiceOptions = null;
    const store = writable(
        Object.assign(
            {
                exportOptions: pdfExportSettings,
                autoSync: false,
                enabled: true,
                OCREnabled: false,
                useFoldersStructure: false,
                OCRDataType: 'best',
                OCRLanguages: [],
                fileNameFormat: ApplicationSettings.getString(SETTINGS_FILE_NAME_FORMAT, FILENAME_DATE_FORMAT),
                useDocumentName: ApplicationSettings.getBoolean(SETTINGS_FILE_NAME_USE_DOCUMENT_NAME, FILENAME_USE_DOCUMENT_NAME),

                color: SERVICES_SYNC_COLOR['webdav_data'] as string | Color
            },
            data
        )
    );
    const variant = 'outline';

    let webdavView: WebdavSettingsView;

    async function save() {
        if (await webdavView?.validateSave()) {
            const result = get(store);
            if (result.OCREnabled && result.OCRLanguages.length) {
                await checkOrDownloadOCRLanguages({
                    dataType: result.OCRDataType,
                    languages: result.OCRLanguages,
                    shouldConfirm: false
                });
            }
            closeModal(result);
        } else {
            showSnack({
                message: lc('need_fill_fields'),
                view: page.nativeView
            });
        }
    }

    const items = new ObservableArray([
        {
            type: 'color'
        },
        {
            type: 'switch',
            id: 'enabled',
            title: lc('enabled'),
            value: $store.enabled
        },
        {
            type: 'header',
            title: lc('webdav_config')
        },
        {
            type: 'webdav'
        },
        {
            type: 'switch',
            id: 'autoSync',
            title: lc('auto_sync'),
            description: lc('local_auto_sync_desc'),
            value: $store.autoSync
        },
        {
            id: 'setting',
            key: 'fileNameFormat',
            useHTML: true,
            title: lc('filename_date_format'),
            description: lc('filename_date_format_desc'),
            full_description: lc('filename_date_format_fulldesc', ...getNameFormatHTMLArgs()),
            onLinkTap: ({ link }) => {
                openLink(link);
            },
            valueType: 'string',
            textFieldProperties: {
                autocapitalizationType: 'none',
                autocorrect: false
            } as TextFieldProperties,
            rightValue: () => $store.fileNameFormat,
            type: 'prompt'
        },
        {
            type: 'switch',
            id: 'useFoldersStructure',
            title: lc('use_folder_structure'),
            description: lc('use_folder_structure_desc'),
            value: $store.useFoldersStructure
        },
        {
            type: 'header',
            title: lc('pdf_export_settings')
        },
        {
            type: 'pdf_export_settings'
        },
        {
            type: 'header',
            title: lc('ocr_settings')
        },
        {
            type: 'switch',
            id: 'OCREnabled',
            title: lc('ocr_enabled'),
            description: lc('ocr_enabled_desc'),
            value: $store.OCREnabled
        },
        {
            type: 'ocr_settings'
        }
    ]);

    function getTitle(item) {
        return item.title;
    }
    function getDescription(item) {
        return typeof item.description === 'function' ? item.description(item) : item.description;
    }
    function updateItem(item, key = 'key') {
        const index = items.findIndex((it) => it[key] === item[key]);
        if (index !== -1) {
            items.setItem(index, item);
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
    async function onCheckBox(item, event) {
        if (ignoreNextOnCheckBoxChange || item.value === event.value) {
            return;
        }
        const value = event.value;
        item.value = value;
        clearCheckboxTimer();
        try {
            ignoreNextOnCheckBoxChange = true;
            $store[item.key || item.id] = value;
        } catch (error) {
            showError(error);
        } finally {
            ignoreNextOnCheckBoxChange = false;
        }
    }
    async function onTap(item, event) {
        try {
            if (item.type === 'checkbox' || item.type === 'switch') {
                // we dont want duplicate events so let s timeout and see if we clicking diretly on the checkbox
                const checkboxView: CheckBox = ((event.object as View).parent as View).getViewById('checkbox');
                clearCheckboxTimer();
                checkboxTapTimer = setTimeout(() => {
                    checkboxView.checked = !checkboxView.checked;
                }, 10);
                return;
            }
            switch (item.id) {
                case 'store_setting':
                case 'setting': {
                    if (item.type === 'prompt') {
                        const result = await prompt({
                            title: getTitle(item),
                            message: item.useHTML ? item.description : item.full_description || item.description,
                            okButtonText: l('save'),
                            cancelButtonText: l('cancel'),
                            autoFocus: true,
                            textFieldProperties: item.textFieldProperties,
                            defaultText: (typeof item.rightValue === 'function' ? item.rightValue() : item.default) + '',
                            view: item.useHTML
                                ? createView(
                                      Label,
                                      {
                                          padding: '10 20 0 20',
                                          textWrap: true,
                                          color: colorOnSurfaceVariant as any,
                                          html: item.full_description || item.description
                                      },
                                      item.onLinkTap
                                          ? {
                                                linkTap: item.onLinkTap
                                            }
                                          : undefined
                                  )
                                : undefined
                        });
                        DEV_LOG && console.log('prompt result', item.key, item.valueType, result);
                        if (result && !!result.result && result.text.length > 0) {
                            if (item.valueType === 'string') {
                                $store[item.key] = result.text;
                            } else {
                                $store[item.key] = parseInt(result.text, 10);
                            }
                            updateItem(item);
                        }
                    } else if (item.type === 'slider') {
                        DEV_LOG && console.log('showSlidersPopover', event.object, item.currentValue());
                        await showSliderPopover({
                            anchor: event.object,
                            value: item.currentValue(),
                            ...item,
                            onChange(value) {
                                if (item.transformValue) {
                                    value = item.transformValue(value, item);
                                } else {
                                    value = Math.round(value / item.step) * item.step;
                                }
                                if (item.valueType === 'string') {
                                    $store[item.key] = value + '';
                                } else {
                                    $store[item.key] = value;
                                }
                                updateItem(item);
                            }
                        });
                    } else {
                        const result = await showAlertOptionSelect(
                            {
                                height: Math.min(item.values.length * 56, ALERT_OPTION_MAX_HEIGHT),
                                rowHeight: item.autoSizeListItem ? undefined : 56,
                                ...item,
                                options: item.values.map((k) => ({
                                    name: k.title || k.name,
                                    data: k.value,
                                    boxType: 'circle',
                                    type: 'checkbox',
                                    value: (item.currentValue?.() ?? item.currentValue) === k.value
                                }))
                            },
                            {
                                title: item.title,
                                message: item.full_description
                            }
                        );
                        DEV_LOG && console.log('result?.data', result?.data);
                        if (result?.data !== undefined) {
                            if (item.onResult) {
                                item.onResult(result.data);
                            } else {
                                if (item.valueType === 'string') {
                                    $store[item.key] = result?.data;
                                } else {
                                    $store[item.key] = parseInt(result?.data, 10);
                                }
                            }
                            updateItem(item);
                        }
                    }

                    break;
                }
            }
        } catch (err) {
            showError(err);
        }
    }

    function selectTemplate(item, index, items) {
        if (item.type) {
            if (item.type === 'prompt' || item.type === 'slider') {
                return 'default';
            }
            return item.type;
        }
        if (item.icon) {
            return 'leftIcon';
        }
        return 'default';
    }

    async function changeColor(item, event) {
        try {
            const newColor = await pickColor($store.color, { anchor: event.object });
            if (newColor) {
                $store.color = newColor.hex;
                updateItem(item, 'type');
            }
            updateItem(item, 'type');
        } catch (error) {
            showError(error);
        }
    }
</script>

<page bind:this={page} id="webdavsyncsettings" actionBarHidden={true}>
    <gridlayout class="pageContent" rows="auto,*">
        <collectionview bind:this={collectionView} itemTemplateSelector={selectTemplate} {items} row={1} android:paddingBottom={$windowInset.bottom}>
            <Template key="color" let:item>
                <ListItemAutoSize fontSize={20} subtitle={lc('sync_service_color_desc')} title={lc('color')} on:tap={(e) => changeColor(item, e)}>
                    <absolutelayout backgroundColor={$store.color} borderColor={colorOutline} borderRadius="50%" borderWidth={2} col={1} height={40} marginLeft={10} width={40} />
                </ListItemAutoSize>
            </Template>
            <Template key="header" let:item>
                <label class="sectionHeader" text={item.title} />
            </Template>
            <Template key="webdav" let:item>
                <WebdavSettingsView bind:this={webdavView} {store} />
            </Template>
            <Template key="pdf_export_settings" let:item>
                <PdfSyncSettingsView {store} />
            </Template>
            <Template key="ocr_settings" let:item>
                <OcrSettingsBottomSheet onlySettings={true} bind:dataType={$store.OCRDataType} bind:languages={$store.OCRLanguages} />
            </Template>
            <Template key="textfield" let:item>
                <gridlayout columns="*" margin={tMargin} row={3} rows="auto" on:tap={(e) => item.onTap(item, e)}>
                    <textfield text={item.text} {variant} {...item.textFieldProperties} />
                    <mdbutton
                        class="icon-btn"
                        color={colorOnSurfaceVariant}
                        horizontalAlignment="right"
                        text={item.icon}
                        variant="text"
                        verticalAlignment="middle"
                        visibility={item.icon ? 'visible' : 'hidden'} />
                </gridlayout>
            </Template>
            <Template key="switch" let:item>
                <ListItemAutoSize fontSize={20} leftIcon={item.icon} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <switch id="checkbox" checked={item.value} col={1} marginLeft={10} verticalAlignment="center" on:checkedChange={(e) => onCheckBox(item, e)} />
                </ListItemAutoSize>
            </Template>
            <Template let:item>
                <ListItemAutoSize fontSize={20} rightValue={item.rightValue} showBottomLine={false} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                </ListItemAutoSize>
            </Template>
        </collectionview>
        <!-- <scrollview row={1}>
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
                <label class="sectionHeader" text={lc('ocr_settings')} />
                <ListItemAutoSize fontSize={20} subtitle={lc('ocr_enabled_desc')} title={lc('ocr_enabled')} on:tap={unCheckBoxItemTap}>
                    <switch
                        id="checkbox"
                        checked={$store.OCREnabled}
                        col={1}
                        marginLeft={10}
                        on:checkedChange={(e) =>
                            onCheckBox(e, (e) => {
                                $store.OCREnabled = e.value;
                            })}
                        ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
                <OcrSettingsBottomSheet onlySettings={true} bind:dataType={$store.OCRDataType} bind:languages={$store.OCRLanguages} />
            </stacklayout>
        </scrollview> -->
        <CActionBar canGoBack modalWindow={true} title={lc('webdav_config')}>
            <mdbutton text={lc('save')} variant="text" verticalAlignment="middle" on:tap={save} />
            <!-- <mdbutton class="actionBarButton" text={lc('save')} variant="text" on:tap={save} /> -->
        </CActionBar>
    </gridlayout>
</page>
