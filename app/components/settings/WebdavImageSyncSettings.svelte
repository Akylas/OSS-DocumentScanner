<script lang="ts">
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { pickFolder } from '@nativescript-community/ui-document-picker';
    import { Label } from '@nativescript-community/ui-label';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { TextFieldProperties } from '@nativescript-community/ui-material-textfield';
    import { ApplicationSettings, Color, ObservableArray, Utils, View } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { get, writable } from 'svelte/store';
    import { l, lc } from '~/helpers/locale';
    import { getPDFDefaultExportOptions } from '~/services/pdf/PDFCanvas';
    import { SERVICES_SYNC_COLOR } from '~/services/sync/types';
    import { WebdavImageSyncServiceOptions } from '~/services/sync/WebdavImageSyncService';
    import { ALERT_OPTION_MAX_HEIGHT, ANDROID_CONTENT, FILENAME_DATE_FORMAT, SEPARATOR, SETTINGS_FILE_NAME_FORMAT, getImageExportSettings } from '~/utils/constants';
    import { showError } from '~/utils/showError';
    import { closeModal } from '~/utils/svelte/ui';
    import { createView, getNameFormatHTMLArgs, openLink, pickColor, showAlertOptionSelect, showSliderPopover } from '~/utils/ui';
    import { colors, windowInset } from '~/variables';
    import CActionBar from '../common/CActionBar.svelte';
    import ListItemAutoSize from '../common/ListItemAutoSize.svelte';
    import WebdavSettingsView from './WebdavSettingsView.svelte';
    // technique for only specific properties to get updated on store change
    $: ({ colorOutline, colorPrimary, colorOnSurfaceVariant } = $colors);

    const imageExportSettings = getImageExportSettings();
    const pdfExportSettings = getPDFDefaultExportOptions();
    export let data: WebdavImageSyncServiceOptions = null;

    let collectionView: NativeViewElementNode<CollectionView>;
    const store = writable(
        Object.assign(
            {
                exportOptions: pdfExportSettings,
                ...imageExportSettings,
                autoSync: false,
                enabled: true,
                fileNameFormat: ApplicationSettings.getString(SETTINGS_FILE_NAME_FORMAT, FILENAME_DATE_FORMAT),
                color: SERVICES_SYNC_COLOR['folder_image'] as string | Color
            },
            data
        )
    );
    DEV_LOG && console.log('FolderImageSyncSettings', JSON.stringify(data), JSON.stringify(get(store)));
    // let folderPathName = data.folderPathName;
    const variant = 'filled';

    let webdavView: WebdavSettingsView;

    async function save() {
        if (webdavView?.validateSave()) {
            const result = get(store);
            closeModal(result);
        }
    }
    function updateDirectoryName(folderPath: string) {
        let exportDirectoryName = folderPath;
        if (__ANDROID__ && folderPath.startsWith(ANDROID_CONTENT)) {
            const context = Utils.android.getApplicationContext();
            const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(folderPath));
            exportDirectoryName = com.nativescript.documentpicker.FilePath.getPath(Utils.android.getApplicationContext(), outdocument.getUri());
        }
        return exportDirectoryName
            .split(SEPARATOR)
            .filter((s) => s.length)
            .pop();
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
            id: 'setting',
            key: 'imageFormat',
            title: lc('image_format'),
            currentValue: () => $store.imageFormat,
            description: lc('image_format_desc'),
            rightValue: () => ($store.imageFormat || imageExportSettings.imageFormat).toUpperCase(),
            valueType: 'string',
            values: [
                { value: null, title: lc('default_value') },
                { value: 'jpg', title: 'JPEG' },
                { value: 'png', title: 'PNG' }
            ]
        },
        {
            id: 'setting',
            key: 'imageQuality',
            min: 10,
            max: 100,
            step: 1,
            title: lc('image_quality'),
            description: lc('image_quality_desc'),
            type: 'slider',
            rightValue: () => $store.imageQuality,
            currentValue: () => $store.imageQuality
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
        DEV_LOG && console.log('onCheckBox', item.id, value);
        try {
            ignoreNextOnCheckBoxChange = true;
            DEV_LOG && console.log('updating setting for checkbox', item.id, item.key, value);
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

    async function changeColor(item) {
        try {
            const newColor = await pickColor($store.color);
            if (newColor) {
                $store.color = newColor.hex;
                updateItem(item, 'type');
            }
            updateItem(item, 'type');
        } catch (error) {
            showError(error);
        }
    }
    // store.subscribe(() => {
    //     updateItem({ type: 'webdav' }, 'type');
    // });
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <collectionview bind:this={collectionView} itemTemplateSelector={selectTemplate} {items} row={1} android:paddingBottom={$windowInset.bottom}>
            <Template key="color" let:item>
                <ListItemAutoSize fontSize={20} subtitle={lc('sync_service_color_desc')} title={lc('color')} on:tap={() => changeColor(item)}>
                    <absolutelayout backgroundColor={$store.color} borderColor={colorOutline} borderRadius="50%" borderWidth={2} col={1} height={40} marginLeft={10} width={40} />
                </ListItemAutoSize>
            </Template>
            <Template key="webdav" let:item>
                <WebdavSettingsView bind:this={webdavView} {store} />
            </Template>
            <Template key="textfield" let:item>
                <gridlayout columns="*" margin={5} row={3} rows="auto" on:tap={(e) => item.onTap(item, e)}>
                    <textfield text={item.text} {...item.textFieldProperties} />
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
                    <switch id="checkbox" checked={item.value} col={1} marginLeft={10} on:checkedChange={(e) => onCheckBox(item, e)} ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
            </Template>
            <Template let:item>
                <ListItemAutoSize fontSize={20} rightValue={item.rightValue} showBottomLine={false} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                </ListItemAutoSize>
            </Template>
        </collectionview>
        <CActionBar canGoBack modalWindow={true} title={lc('image_sync_settings')}>
            <mdbutton text={lc('save')} variant="text" verticalAlignment="middle" on:tap={save} />
            <!-- <mdbutton class="actionBarButton" text={lc('save')} variant="text" on:tap={save} /> -->
        </CActionBar>
    </gridlayout>
</page>
