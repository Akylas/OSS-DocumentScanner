<script context="module" lang="ts">
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { openFilePicker, pickFolder, saveFile } from '@nativescript-community/ui-document-picker';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { alert, confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { ApplicationSettings, File, ObservableArray, Utils, View, knownFolders, path } from '@nativescript/core';
    import dayjs from 'dayjs';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode, navigate } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import ListItemAutoSize from '~/components/common/ListItemAutoSize.svelte';
    import { getLocaleDisplayName, l, lc, onLanguageChanged, selectLanguage, slc } from '~/helpers/locale';
    import { getThemeDisplayName, onThemeChanged, selectTheme } from '~/helpers/theme';
    import { securityService } from '~/services/security';
    import { syncService } from '~/services/sync';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { hideLoading, openLink, showLoading } from '~/utils/ui';
    import { showAlertOptionSelect } from '~/utils/ui';
    import { copyFolderContent, removeFolderContent, restartApp } from '~/utils/utils';
    import { colors, fonts, navigationBarHeight } from '~/variables';
    import { DocumentsService, documentsService } from '~/services/documents';
    import {
        AUTO_SCAN_DELAY,
        AUTO_SCAN_DISTANCETHRESHOLD,
        AUTO_SCAN_DURATION,
        AUTO_SCAN_ENABLED,
        CROP_ENABLED,
        DEFAULT_EXPORT_DIRECTORY,
        DEFAULT_PDF_OPTIONS,
        DOCUMENT_NOT_DETECTED_MARGIN,
        PREVIEW_RESIZE_THRESHOLD
    } from '~/models/constants';
    import { PDF_OPTIONS } from '~/models/localized_constant';
    import { TextFieldProperties } from '@nativescript-community/ui-material-textfield';
    import IconButton from '../common/IconButton.svelte';
    const version = __APP_VERSION__ + ' Build ' + __APP_BUILD_NUMBER__;
    const storeSettings = {};
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    let { colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors;
    $: ({ colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors);

    let collectionView: NativeViewElementNode<CollectionView>;

    let items: ObservableArray<any>;

    export let title = $slc('settings.title');
    export let actionBarButtons = [
        { icon: 'mdi-share-variant', id: 'share' },
        { icon: 'mdi-github', id: 'github' }
    ];
    export let options: any[] = null;

    function getTitle(item) {
        switch (item.id) {
            case 'token':
                return lc(item.token);
            default:
                return item.title;
        }
    }
    function getDescription(item) {
        return typeof item.description === 'function' ? item.description(item) : item.description;
    }

    function getStoreSetting(k: string, defaultValue) {
        if (!storeSettings[k]) {
            storeSettings[k] = JSON.parse(ApplicationSettings.getString(k, defaultValue));
        }
        return storeSettings[k];
    }
    function refresh() {
        const newItems: any[] =
            options ||
            [
                {
                    type: 'header',
                    title: lc('donate')
                },
                {
                    type: 'sectionheader',
                    title: lc('general')
                },
                {
                    id: 'language',
                    description: () => getLocaleDisplayName(),
                    title: lc('language')
                },
                {
                    id: 'dark_mode',
                    description: () => getThemeDisplayName(),
                    title: lc('theme.title')
                },
                {
                    type: 'switch',
                    id: 'auto_black',
                    title: lc('auto_black'),
                    value: ApplicationSettings.getBoolean('auto_black', false)
                }
            ]
                .concat(
                    __ANDROID__
                        ? [
                              {
                                  type: 'switch',
                                  key: 'allow_screenshot',
                                  title: lc('allow_app_screenshot'),
                                  value: ApplicationSettings.getBoolean('allow_screenshot', true)
                              }
                          ]
                        : ([] as any)
                )
                .concat(
                    __ANDROID__ && android.os.Environment.getExternalStorageState() === 'mounted'
                        ? [
                              {
                                  id: 'setting',
                                  key: 'data_location',
                                  title: lc('data_location'),
                                  currentValue: () => (documentsService.rootDataFolder === knownFolders.externalDocuments().path ? 'sdcard' : 'internal'),
                                  description: () => (documentsService.rootDataFolder === knownFolders.externalDocuments().path ? lc('sdcard') : lc('internal_storage')),
                                  values: [
                                      { value: 'internal', title: lc('internal_storage') },
                                      { value: 'sdcard', title: lc('sdcard') }
                                  ],
                                  onResult: async (data) => {
                                      try {
                                          const current = documentsService.rootDataFolder === knownFolders.externalDocuments().path ? 'sdcard' : 'internal';
                                          if (current !== data) {
                                              const confirmed = await confirm({
                                                  title: lc('move_data'),
                                                  message: lc('move_data_desc'),
                                                  okButtonText: lc('ok'),
                                                  cancelButtonText: lc('cancel')
                                              });
                                              if (confirmed) {
                                                  const srcFolder = documentsService.rootDataFolder;
                                                  let dstFolder: string;
                                                  if (data === 'sdcard') {
                                                      dstFolder = knownFolders.externalDocuments().path;
                                                  } else {
                                                      dstFolder = knownFolders.documents().path;
                                                  }
                                                  DEV_LOG && console.log('confirmed move data to', srcFolder, dstFolder);
                                                  showLoading(lc('moving_files'));
                                                  const srcDbPath = path.join(srcFolder, DocumentsService.DB_NAME);
                                                  await File.fromPath(srcDbPath).copy(path.join(dstFolder, DocumentsService.DB_NAME));
                                                  await copyFolderContent(path.join(srcFolder, 'data'), path.join(dstFolder, 'data'));
                                                  ApplicationSettings.setString('root_data_folder', dstFolder);
                                                  await File.fromPath(srcDbPath).remove();
                                                  await removeFolderContent(path.join(srcFolder, 'data'));
                                                  await alert({
                                                      cancelable: false,
                                                      message: lc('restart_app'),
                                                      okButtonText: lc('restart')
                                                  });
                                                  restartApp();
                                              }
                                          }
                                      } catch (error) {
                                          showError(error);
                                      } finally {
                                          hideLoading();
                                      }
                                  }
                              }
                          ]
                        : ([] as any)
                )
                .concat([
                    {
                        id: 'third_party',
                        // rightBtnIcon: 'mdi-chevron-right',
                        title: lc('third_parties'),
                        description: lc('list_used_third_parties')
                    }
                ] as any)
                .concat(
                    PLAY_STORE_BUILD
                        ? [
                              //   {
                              //       id: 'share',
                              //       rightBtnIcon: 'mdi-chevron-right',
                              //       title: lc('share_application')
                              //   },
                              {
                                  type: 'rightIcon',
                                  id: 'review',
                                  rightBtnIcon: 'mdi-chevron-right',
                                  title: lc('review_application')
                              }
                          ]
                        : ([] as any)
                )
                .concat(
                    securityService.biometricsAvailable
                        ? [
                              {
                                  id: 'sub_settings',
                                  icon: 'mdi-fingerprint',
                                  title: lc('security'),
                                  description: lc('security_settings'),
                                  options: () => [
                                      {
                                          type: 'switch',
                                          id: 'biometric_lock',
                                          title: lc('biometric_lock'),
                                          description: lc('biometric_lock_desc'),
                                          value: securityService.biometricEnabled
                                      },
                                      {
                                          type: 'switch',
                                          id: 'biometric_auto_lock',
                                          title: lc('biometric_auto_lock'),
                                          description: lc('biometric_auto_lock_desc'),
                                          enabled: securityService.biometricEnabled,
                                          value: securityService.biometricEnabled && securityService.autoLockEnabled
                                      }
                                  ]
                              }
                          ]
                        : ([] as any)
                )
                .concat([
                    {
                        id: 'sub_settings',
                        title: lc('document_detection'),
                        description: lc('document_detection_settings'),
                        icon: 'mdi-text-box-search',
                        options: () => [
                            {
                                type: 'switch',
                                id: 'cropEnabled',
                                title: lc('crop_enabled'),
                                value: ApplicationSettings.getBoolean('cropEnabled', CROP_ENABLED)
                            },
                            {
                                id: 'setting',
                                key: 'previewResizeThreshold',
                                title: lc('preview_resize_threshold'),
                                full_description: lc('preview_resize_threshold_desc'),
                                rightValue: () => ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD),
                                type: 'prompt'
                            },
                            {
                                id: 'setting',
                                key: 'documentNotDetectedMargin',
                                title: lc('document_not_detected_margin'),
                                full_description: lc('document_not_detected_margin_desc'),
                                rightValue: () => ApplicationSettings.getNumber('documentNotDetectedMargin', DOCUMENT_NOT_DETECTED_MARGIN),
                                type: 'prompt'
                            }
                        ]
                    }
                ] as any)
                .concat([
                    {
                        id: 'sub_settings',
                        icon: 'mdi-file-star-four-points',
                        title: lc('autoscan'),
                        description: lc('autoscan_settings'),
                        options: () => [
                            {
                                type: 'switch',
                                id: 'autoScan',
                                title: lc('auto_scan'),
                                value: ApplicationSettings.getBoolean('autoScan', AUTO_SCAN_ENABLED)
                            },
                            {
                                id: 'setting',
                                key: 'autoScan_distanceThreshold',
                                title: lc('auto_scan_distance_threshold'),
                                full_description: lc('auto_scan_distance_threshold_desc'),
                                rightValue: () => ApplicationSettings.getNumber('autoScan_distanceThreshold', AUTO_SCAN_DISTANCETHRESHOLD),
                                type: 'prompt'
                            },
                            {
                                id: 'setting',
                                key: 'autoScan_autoScanDuration',
                                title: lc('auto_scan_duration'),
                                full_description: lc('auto_scan_duration_desc'),
                                rightValue: () => ApplicationSettings.getNumber('autoScan_autoScanDuration', AUTO_SCAN_DURATION),
                                type: 'prompt'
                            },
                            {
                                id: 'setting',
                                key: 'autoScan_preAutoScanDelay',
                                title: lc('auto_scan_delay'),
                                full_description: lc('auto_scan_delay_desc'),
                                rightValue: () => ApplicationSettings.getNumber('autoScan_preAutoScanDelay', AUTO_SCAN_DELAY),
                                type: 'prompt'
                            }
                        ]
                    }
                ] as any)
                .concat([
                    {
                        id: 'sub_settings',
                        icon: 'mdi-file-pdf-box',
                        title: lc('pdf_export'),
                        description: lc('pdf_export_settings'),
                        options: () =>
                            [
                                {
                                    type: 'rightIcon',
                                    key: 'pdf_export_directory',
                                    title: lc('export_folder'),
                                    defaultValue: DEFAULT_EXPORT_DIRECTORY,
                                    description: (item) => ApplicationSettings.getString(item.key, item.defaultValue),
                                    rightBtnIcon: 'mdi-restore',
                                    onTap: async (item) => {
                                        DEV_LOG && console.log('onTap', item);
                                        const result = await pickFolder({
                                            multipleSelection: false,
                                            permissions: { write: true, persistable: true }
                                        });
                                        if (result.folders.length) {
                                            const exportDirectory = result.folders[0];
                                            ApplicationSettings.setString(item.key, exportDirectory);
                                            return true;
                                        }
                                    },
                                    onRightIconTap: (item) => {
                                        DEV_LOG && console.log('onRightIconTap', item);
                                        ApplicationSettings.remove(item.key);
                                        return true;
                                    }
                                }
                            ]
                                .concat(
                                    Object.keys(PDF_OPTIONS).map((option) => ({
                                        id: 'store_setting',
                                        storeKey: 'default_export_options',
                                        storeDefault: DEFAULT_PDF_OPTIONS,
                                        key: option,
                                        valueType: typeof getStoreSetting('default_export_options', DEFAULT_PDF_OPTIONS)[option],
                                        title: lc(option),
                                        rightValue: () => PDF_OPTIONS[option][getStoreSetting('default_export_options', DEFAULT_PDF_OPTIONS)[option]].name,
                                        currentValue: () => getStoreSetting('default_export_options', DEFAULT_PDF_OPTIONS)[option],
                                        values: Object.keys(PDF_OPTIONS[option]).map((k) => ({ ...PDF_OPTIONS[option][k], value: k }))
                                    })) as any
                                )
                                .concat([
                                    {
                                        id: 'store_setting',
                                        storeKey: 'default_export_options',
                                        storeDefault: DEFAULT_PDF_OPTIONS,
                                        key: 'page_padding',
                                        title: lc('page_padding'),
                                        type: 'prompt',
                                        textFieldProperties: {
                                            keyboardType: 'integer'
                                        } as TextFieldProperties,
                                        rightValue: () => getStoreSetting('default_export_options', DEFAULT_PDF_OPTIONS)['page_padding'],
                                        currentValue: () => getStoreSetting('default_export_options', DEFAULT_PDF_OPTIONS)['page_padding']
                                    }
                                ] as any)
                    }
                ] as any)
                .concat([
                    {
                        type: 'sectionheader',
                        title: lc('sync')
                    },
                    {
                        id: 'webdav',
                        rightValue: () => (syncService.enabled ? lc('on') : lc('off')),
                        title: lc('webdav_sync'),
                        description: syncService.enabled ? syncService.remoteURL : lc('webdav_sync_desc')
                    }
                ] as any)
                .concat([
                    {
                        type: 'sectionheader',
                        title: lc('backup_restore')
                    },
                    // {
                    //     id: 'version',
                    //     title: lc('version'),
                    //     description: __APP_VERSION__ + ' Build ' + __APP_BUILD_NUMBER__
                    // },
                    // {
                    //     id: 'github',
                    //     rightBtnIcon: 'mdi-chevron-right',
                    //     title: lc('source_code'),
                    //     description: lc('get_app_source_code')
                    // },
                    {
                        id: 'export_settings',
                        title: lc('export_settings'),
                        description: lc('export_settings_desc')
                        // rightBtnIcon: 'mdi-chevron-right'
                    },
                    {
                        id: 'import_settings',
                        title: lc('import_settings'),
                        description: lc('import_settings_desc')
                        // rightBtnIcon: 'mdi-chevron-right'
                    }
                ] as any);

        items = new ObservableArray(newItems);
    }
    refresh();

    async function onLongPress(id, event) {
        try {
            switch (id) {
                case 'version':
                    if (SENTRY_ENABLED) {
                        throw new Error('test error');
                    }
            }
        } catch (error) {
            showError(error);
        }
    }
    function updateItem(item, key = 'key') {
        const index = items.findIndex((it) => it[key] === item[key]);
        if (index !== -1) {
            items.setItem(index, item);
        }
    }
    let checkboxTapTimer;
    async function onRightIconTap(item, event) {
        try {
            const needsUpdate = await item.onRightIconTap?.(item, event);
            if (needsUpdate) {
                updateItem(item);
            }
        } catch (error) {
            showError(error);
        }
    }
    async function onTap(item, event) {
        try {
            if (item.type === 'checkbox' || item.type === 'switch') {
                // we dont want duplicate events so let s timeout and see if we clicking diretly on the checkbox
                const checkboxView: CheckBox = ((event.object as View).parent as View).getViewById('checkbox');
                checkboxTapTimer = setTimeout(() => {
                    checkboxView.checked = !checkboxView.checked;
                }, 10);
                return;
            }
            switch (item.id) {
                case 'sub_settings': {
                    const component = (await import('~/components/settings/Settings.svelte')).default;
                    navigate({
                        page: component,
                        props: {
                            title: item.title,
                            options: item.options(),
                            actionBarButtons: item.actionBarButtons?.() || []
                        }
                    });

                    break;
                }
                case 'export_settings':
                    const jsonStr = ApplicationSettings.getAllJSON();
                    if (jsonStr) {
                        const result = await saveFile({
                            name: `${__APP_ID__}_settings_${dayjs().format('YYYY-MM-DD')}.json`,
                            data: jsonStr
                        });
                        DEV_LOG && console.log('export_settings done', result, jsonStr);
                    }
                    break;
                case 'import_settings':
                    const result = await openFilePicker({
                        extensions: ['application/json'],
                        multipleSelection: false,
                        pickerMode: 0
                    });
                    const filePath = result.files[0];
                    if (filePath && File.exists(filePath)) {
                        showLoading();
                        const json = JSON.parse(await File.fromPath(filePath).readText());
                        const nativePref = ApplicationSettings.getNative();
                        if (__ANDROID__) {
                            const editor = (nativePref as android.content.SharedPreferences).edit();
                            editor.clear();
                            Object.keys(json).forEach((k) => {
                                if (k.startsWith('_')) {
                                    return;
                                }
                                const value = json[k];
                                const type = typeof value;
                                switch (type) {
                                    case 'boolean':
                                        editor.putBoolean(k, value);
                                        break;
                                    case 'number':
                                        editor.putLong(k, java.lang.Double.doubleToRawLongBits(double(value)));
                                        break;
                                    case 'string':
                                        editor.putString(k, value);
                                        break;
                                }
                            });
                            editor.apply();
                        } else {
                            const userDefaults = nativePref as NSUserDefaults;
                            const domain = NSBundle.mainBundle.bundleIdentifier;
                            userDefaults.removePersistentDomainForName(domain);
                            Object.keys(json).forEach((k) => {
                                if (k.startsWith('_')) {
                                    return;
                                }
                                const value = json[k];
                                const type = typeof value;
                                switch (type) {
                                    case 'boolean':
                                        userDefaults.setBoolForKey(value, k);
                                        break;
                                    case 'number':
                                        userDefaults.setDoubleForKey(value, k);
                                        break;
                                    case 'string':
                                        userDefaults.setObjectForKey(value, k);
                                        break;
                                }
                            });
                        }
                        hideLoading();
                        const result = await confirm({
                            message: lc('restart_app'),
                            okButtonText: lc('restart'),
                            cancelButtonText: lc('later')
                        });
                        if (result) {
                            restartApp();
                        }
                    }
                    break;
                case 'github':
                    openLink(GIT_URL);
                    break;
                case 'language':
                    await selectLanguage();
                    break;
                case 'dark_mode':
                    await selectTheme();
                    break;
                case 'share':
                    await share({
                        message: GIT_URL
                    });
                    break;
                case 'webdav':
                    const WebdavConfig = (await import('~/components/webdav/WebdavConfig.svelte')).default;
                    await showBottomSheet({
                        parent: this,
                        view: WebdavConfig,
                        ignoreTopSafeArea: true
                    });
                    break;
                case 'review':
                    openLink(STORE_REVIEW_LINK);
                    break;
                case 'sponsor':
                    openLink(SPONSOR_URL);
                    break;
                case 'third_party':
                    const ThirdPartySoftwareBottomSheet = (await import('~/components/settings/ThirdPartySoftwareBottomSheet.svelte')).default;
                    showBottomSheet({
                        parent: this,
                        view: ThirdPartySoftwareBottomSheet
                    });
                    break;

                case 'store_setting':
                case 'setting': {
                    if (item.type === 'prompt') {
                        const result = await prompt({
                            title: getTitle(item),
                            message: item.full_description || item.description,
                            okButtonText: l('save'),
                            cancelButtonText: l('cancel'),
                            autoFocus: true,
                            textFieldProperties: item.textFieldProperties,
                            defaultText: (typeof item.rightValue === 'function' ? item.rightValue() : item.default) + ''
                        });
                        Utils.dismissSoftInput();
                        if (result && !!result.result && result.text.length > 0) {
                            if (item.id === 'store_setting') {
                                const store = getStoreSetting(item.storeKey, item.storeDefault);
                                if (item.valueType === 'string') {
                                    store[item.key] = result.text;
                                } else {
                                    store[item.key] = parseInt(result.text, 10);
                                }
                                ApplicationSettings.setString(item.storeKey, JSON.stringify(store));
                            } else {
                                if (item.valueType === 'string') {
                                    ApplicationSettings.setString(item.key, result.text);
                                } else {
                                    ApplicationSettings.setNumber(item.key, parseInt(result.text, 10));
                                }
                            }
                            updateItem(item);
                        }
                    } else {
                        const component = (await import('~/components/common/OptionSelect.svelte')).default;
                        DEV_LOG && console.log('OptionSelect', item);
                        const result = await showAlertOptionSelect(
                            component,
                            {
                                height: Math.min(item.values.length * 56, 400),
                                rowHeight: 56,
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
                        if (result?.data !== undefined) {
                            if (item.onResult) {
                                item.onResult(result.data);
                            } else {
                                if (item.id === 'store_setting') {
                                    const store = getStoreSetting(item.storeKey, item.storeDefault);
                                    if (item.valueType === 'string') {
                                        store[item.key] = result.data;
                                    } else {
                                        store[item.key] = parseInt(result.data, 10);
                                    }
                                    ApplicationSettings.setString(item.storeKey, JSON.stringify(store));
                                } else {
                                    if (item.valueType === 'string') {
                                        ApplicationSettings.setString(item.key, result.data);
                                    } else {
                                        ApplicationSettings.setNumber(item.key, parseInt(result.data, 10));
                                    }
                                }
                                updateItem(item);
                            }
                        }
                    }

                    break;
                }
                default: {
                    const needsUpdate = await item.onTap?.(item, event);
                    if (needsUpdate) {
                        updateItem(item);
                    }
                    break;
                }
            }
        } catch (err) {
            showError(err);
        } finally {
            hideLoading();
        }
    }
    onLanguageChanged(refresh);

    function selectTemplate(item, index, items) {
        if (item.type) {
            if (item.type === 'prompt') {
                return 'default';
            }
            return item.type;
        }
        if (item.icon) {
            return 'leftIcon';
        }
        return 'default';
    }

    async function onCheckBox(item, event) {
        if (item.value === event.value) {
            return;
        }
        const value = event.value;
        item.value = value;
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
        DEV_LOG && console.log('onCheckBox', item.id, value);
        try {
            switch (item.id) {
                case 'biometric_lock':
                    if (value) {
                        try {
                            await securityService.enableBiometric();
                        } catch (error) {
                            console.error('enableBiometric error', error);
                            const checkboxView: CheckBox = event.object;
                            checkboxView.checked = item.value = false;
                            // showError(error);
                        }
                    } else {
                        try {
                            securityService.clear();
                            await securityService.disableBiometric();
                        } catch (error) {
                            const checkboxView: CheckBox = event.object;
                            checkboxView.checked = item.value = true;
                            // showError(error);
                        }
                    }
                    break;
                case 'biometric_auto_lock':
                    // if (value) {
                    //     if (securityService.biometricEnabled) {
                    //         const checkboxView: CheckBox = event.object;
                    //         checkboxView.checked = item.value = false;
                    //     } else {
                    securityService.autoLockEnabled = value;
                    // }
                    // } else {
                    //     securityService.clear();
                    //     securityService.disableBiometric();
                    // }
                    break;

                default:
                    DEV_LOG && console.log('updating setting for checkbox', item.id, item.key, value);
                    ApplicationSettings.setBoolean(item.key || item.id, value);
                    break;
            }
        } catch (error) {
            showError(error);
        }
    }
    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <collectionview bind:this={collectionView} accessibilityValue="settingsCV" itemTemplateSelector={selectTemplate} {items} row={1} android:paddingBottom={$navigationBarHeight}>
            <Template key="header" let:item>
                <gridlayout rows="auto,auto">
                    <stacklayout
                        backgroundColor="#ea4bae"
                        borderRadius={10}
                        horizontalAlignment="center"
                        margin="10 16 0 16"
                        orientation="horizontal"
                        padding={10}
                        rippleColor="white"
                        verticalAlignment="center"
                        on:tap={(event) => onTap({ id: 'sponsor' }, event)}>
                        <label color="white" fontFamily={$fonts.mdi} fontSize={26} marginRight={10} text="mdi-heart" verticalAlignment="center" />
                        <label color="white" fontSize={12} text={item.title} textWrap={true} verticalAlignment="center" />
                    </stacklayout>

                    <stacklayout horizontalAlignment="center" marginBottom={0} marginTop={20} row={1} verticalAlignment="center">
                        <image borderRadius="50%" height={50} horizontalAlignment="center" src="res://icon" width={50} />
                        <label fontSize={13} marginTop={4} text={version} on:longPress={(event) => onLongPress('version', event)} />
                    </stacklayout>
                </gridlayout>
            </Template>
            <Template key="sectionheader" let:item>
                <label class="sectionHeader" text={item.title} />
            </Template>
            <Template key="switch" let:item>
                <ListItemAutoSize fontSize={20} leftIcon={item.icon} mainCol={1} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <switch id="checkbox" checked={item.value} col={2} marginLeft={10} on:checkedChange={(e) => onCheckBox(item, e)} ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
            </Template>
            <Template key="checkbox" let:item>
                <ListItemAutoSize fontSize={20} leftIcon={item.icon} mainCol={1} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <checkbox id="checkbox" checked={item.value} col={2} marginLeft={10} on:checkedChange={(e) => onCheckBox(item, e)} />
                </ListItemAutoSize>
            </Template>
            <Template key="rightIcon" let:item>
                <ListItemAutoSize fontSize={20} rightValue={item.rightValue} showBottomLine={false} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <IconButton col={2} text={item.rightBtnIcon} on:tap={(event) => onRightIconTap(item, event)} />
                </ListItemAutoSize>
            </Template>
            <Template key="leftIcon" let:item>
                <ListItemAutoSize
                    fontSize={20}
                    leftIcon={item.icon}
                    rightValue={item.rightValue}
                    showBottomLine={false}
                    subtitle={getDescription(item)}
                    title={getTitle(item)}
                    on:tap={(event) => onTap(item, event)}>
                    <label col={0} fontFamily={$fonts.mdi} fontSize={24} padding="0 10 0 0" text={item.icon} verticalAlignment="center" />
                </ListItemAutoSize>
            </Template>
            <Template let:item>
                <ListItemAutoSize fontSize={20} rightValue={item.rightValue} showBottomLine={false} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                </ListItemAutoSize>
            </Template>
        </collectionview>
        <CActionBar canGoBack {title}>
            {#each actionBarButtons as button}
                <mdbutton class="actionBarButton" text={button.icon} variant="text" on:tap={(event) => onTap({ id: button.id }, event)} />
            {/each}
        </CActionBar>
    </gridlayout>
</page>
