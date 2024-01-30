<script lang="ts">
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { openFilePicker, saveFile } from '@nativescript-community/ui-document-picker';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { alert, confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { ApplicationSettings, File, ObservableArray, Utils, View, knownFolders, path } from '@nativescript/core';
    import dayjs from 'dayjs';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
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
    import { DOCUMENT_NOT_DETECTED_MARGIN, PREVIEW_RESIZE_THRESHOLD } from '~/models/constants';

    // technique for only specific properties to get updated on store change
    let { colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors;
    $: ({ colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors);

    const version = __APP_VERSION__ + ' Build ' + __APP_BUILD_NUMBER__;

    let collectionView: NativeViewElementNode<CollectionView>;

    let items: ObservableArray<any>;

    function getTitle(item) {
        switch (item.id) {
            case 'token':
                return lc(item.token);
            default:
                return item.title;
        }
    }
    function getDescription(item) {
        return typeof item.description === 'function' ? item.description() : item.description;
    }
    function refresh() {
        const newItems: any[] = [
            {
                type: 'header',
                title: lc('donate')
            },
            {
                id: 'language',
                description: getLocaleDisplayName,
                title: lc('language')
            },
            {
                id: 'dark_mode',
                description: getThemeDisplayName,
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
                securityService.biometricsAvailable
                    ? [
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
            .concat([
                {
                    id: 'setting',
                    key: 'previewResizeThreshold',
                    title: lc('preview_resize_threshold'),
                    full_description: lc('preview_resize_threshold_desc'),
                    default: ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD),
                    rightValue: () => ApplicationSettings.getNumber('previewResizeThreshold', PREVIEW_RESIZE_THRESHOLD),
                    type: 'prompt'
                },
                {
                    id: 'setting',
                    key: 'documentNotDetectedMargin',
                    title: lc('document_not_detected_margin'),
                    full_description: lc('document_not_detected_margin_desc'),
                    default: ApplicationSettings.getNumber('documentNotDetectedMargin', DOCUMENT_NOT_DETECTED_MARGIN),
                    rightValue: () => ApplicationSettings.getNumber('documentNotDetectedMargin', DOCUMENT_NOT_DETECTED_MARGIN),
                    type: 'prompt'
                },
                {
                    id: 'webdav',
                    rightValue: () => (syncService.enabled ? lc('on') : lc('off')),
                    title: lc('webdav_sync'),
                    description: syncService.enabled ? syncService.remoteURL : lc('webdav_sync_desc')
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
                              id: 'review',
                              rightBtnIcon: 'mdi-chevron-right',
                              title: lc('review_application')
                          }
                      ]
                    : ([] as any)
            )
            .concat([
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
                    id: 'third_party',
                    // rightBtnIcon: 'mdi-chevron-right',
                    title: lc('third_parties'),
                    description: lc('list_used_third_parties')
                },
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

    async function onLongPress(item, event) {
        try {
            switch (item.id) {
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
                case 'export_settings':
                    const jsonStr = ApplicationSettings.getAllJSON();
                    DEV_LOG && console.log('export_settings', jsonStr);
                    if (jsonStr) {
                        await saveFile({
                            name: `${__APP_ID__}_settings_${dayjs().format('YYYY-MM-DD')}.json`,
                            data: jsonStr
                        });
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
                    if (__IOS__) {
                        refresh();
                    }
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
                        view: ThirdPartySoftwareBottomSheet,
                        ignoreTopSafeArea: true,
                        trackingScrollView: 'trackingScrollView'
                    });
                    break;

                case 'setting': {
                    if (item.type === 'prompt') {
                        const result = await prompt({
                            title: getTitle(item),
                            message: item.full_description || item.description,
                            okButtonText: l('save'),
                            cancelButtonText: l('cancel'),
                            autoFocus: true,
                            defaultText: ApplicationSettings.getNumber(item.key, item.default) + ''
                        });
                        Utils.dismissSoftInput();
                        if (result && !!result.result && result.text.length > 0) {
                            if (item.valueType === 'string') {
                                ApplicationSettings.setString(item.key, result.text);
                            } else {
                                ApplicationSettings.setNumber(item.key, parseInt(result.text, 10));
                            }
                            updateItem(item);
                        }
                    } else {
                        const component = (await import('~/components/common/OptionSelect.svelte')).default;
                        const result = await showAlertOptionSelect(
                            component,
                            {
                                height: Math.min(item.values.length * 56, 400),
                                rowHeight: 56,
                                options: item.values.map((k) => ({
                                    name: k.title,
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
                        if (result?.data) {
                            if (item.onResult) {
                                item.onResult(result.data);
                            } else {
                                if (item.valueType === 'string') {
                                    ApplicationSettings.setString(item.key, result.data);
                                } else {
                                    ApplicationSettings.setNumber(item.key, parseInt(result.data, 10));
                                }
                                updateItem(item);
                            }
                        }
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
        if (item.type === 'prompt') {
            return 'default';
        }
        return item.type || 'default';
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
    // onThemeChanged(refresh);
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
                        <label fontSize={13} marginTop={4} text={version} />
                    </stacklayout>
                </gridlayout>
            </Template>
            <Template key="switch" let:item>
                <ListItemAutoSize leftIcon={item.icon} mainCol={1} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <switch id="checkbox" checked={item.value} col={2} on:checkedChange={(e) => onCheckBox(item, e)} ios:backgroundColor={colorPrimary} />
                </ListItemAutoSize>
            </Template>
            <Template key="checkbox" let:item>
                <ListItemAutoSize leftIcon={item.icon} mainCol={1} subtitle={getDescription(item)} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <checkbox id="checkbox" checked={item.value} col={2} on:checkedChange={(e) => onCheckBox(item, e)} />
                </ListItemAutoSize>
            </Template>
            <Template let:item>
                <ListItemAutoSize
                    leftIcon={item.icon}
                    rightIcon={item.rightBtnIcon}
                    rightValue={item.rightValue}
                    showBottomLine={false}
                    subtitle={getDescription(item)}
                    title={getTitle(item)}
                    on:tap={(event) => onTap(item, event)}
                    on:longPress={(event) => onLongPress(item, event)}>
                </ListItemAutoSize>
            </Template>
            <!-- <Template key="switch" let:item>
                <gridlayout columns="*,auto" padding="10 16 10 16">
                    <stacklayout verticalAlignment="middle" on:tap={(event) => onTap(item, event)}>
                        <label fontSize={17} fontWeight="bold" lineBreak="end" maxLines={1} text={getTitle(item)} verticalTextAlignment="top" />
                        <label
                            color={colorOnSurfaceVariant}
                            fontSize={14}
                            lineBreak="end"
                            text={item.description}
                            verticalTextAlignment="top"
                            visibility={item.description?.length > 0 ? 'visible' : 'collapse'} />
                    </stacklayout>
                    <checkbox id="checkbox" checked={item.value} col={1} on:checkedChange={(e) => onCheckBox(item, e.value)} />
                </gridlayout>
            </Template>
            <Template let:item>
                <gridlayout columns="auto,*,auto" padding="10 16 10 16" rippleColor={colorOnSurface} on:tap={(event) => onTap(item, event)} on:longPress={(event) => onLongPress(item.id, item)}>
                    <label fontFamily={$fonts.mdi} fontSize={36} marginLeft="-10" text={item.icon} verticalAlignment="middle" visibility={!!item.icon ? 'visible' : 'hidden'} width={40} />
                    <stacklayout col={1} height={item.description?.length > 0 ? 'auto' : 50} marginLeft="10" verticalAlignment="middle">
                        <label color={colorOnSurface} fontSize={17} fontWeight="bold" lineBreak="end" maxLines={1} text={getTitle(item)} textWrap="true" verticalTextAlignment="top" />
                        <label color={colorOnSurfaceVariant} fontSize={14} lineBreak="end" text={item.description} verticalTextAlignment="top" />
                    </stacklayout>

                    <label
                        col={2}
                        color={colorOnSurfaceVariant}
                        marginLeft={16}
                        marginRight={16}
                        text={item.rightValue && item.rightValue()}
                        verticalAlignment="center"
                        visibility={!!item.rightValue ? 'visible' : 'collapse'} />
                    <label
                        col={2}
                        color={colorOutlineVariant}
                        fontFamily={$fonts.mdi}
                        fontSize={30}
                        horizontalAlignment="right"
                        marginLeft={16}
                        marginRight={16}
                        text={item.rightBtnIcon}
                        verticalAlignment="center"
                        visibility={!!item.rightBtnIcon ? 'visible' : 'hidden'}
                        width={25} />
                </gridlayout>
            </Template> -->
        </collectionview>
        <CActionBar canGoBack title={$slc('settings.title')}>
            <mdbutton class="actionBarButton" text="mdi-share-variant" variant="text" on:tap={(event) => onTap({ id: 'share' }, event)} />
            <mdbutton class="actionBarButton" text="mdi-github" variant="text" on:tap={(event) => onTap({ id: 'github' }, event)} />
        </CActionBar>
    </gridlayout>
</page>
