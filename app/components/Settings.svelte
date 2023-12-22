<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { openFilePicker, pickFolder, saveFile } from '@nativescript-community/ui-document-picker';
    import { alert, confirm, prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { ApplicationSettings, File, Folder, ObservableArray, Utils, View, path } from '@nativescript/core';
    import dayjs from 'dayjs';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { clock_24, getLocaleDisplayName, l, lc, onLanguageChanged, selectLanguage, slc } from '~/helpers/locale';
    import { getThemeDisplayName, onThemeChanged, selectTheme } from '~/helpers/theme';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { hideLoading, openLink, showLoading } from '~/utils/ui';
    import { colors, fonts, navigationBarHeight } from '~/variables';
    import CActionBar from './CActionBar.svelte';
    import { restartApp } from '~/utils/utils';
    import { syncService } from '~/services/sync';
    import ListItem from './ListItem.svelte';
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import ListItemAutoSize from './ListItemAutoSize.svelte';
    import { securityService } from '~/services/security';

    let colorOnSurfaceVariant = $colors.colorOnSurfaceVariant;
    let colorOnSurface = $colors.colorOnSurface;
    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors);

    let collectionView: NativeViewElementNode<CollectionView>;

    let items: ObservableArray<any>;

    // let nbDevModeTap = 0;
    // let devModeClearTimer;
    // function onTouch(item, event) {
    //     if (item.id !== 'version' || event.action !== 'down') {
    //         return;
    //     }
    //     nbDevModeTap += 1;
    //     if (devModeClearTimer) {
    //         clearTimeout(devModeClearTimer);
    //     }
    //     if (nbDevModeTap === 6) {
    //         const devMode = (customLayers.devMode = !customLayers.devMode);
    //         nbDevModeTap = 0;
    //         showSnack({ message: devMode ? lc('devmode_on') : lc('devmode_off') });
    //         refresh();
    //         return;
    //     }
    //     devModeClearTimer = setTimeout(() => {
    //         devModeClearTimer = null;
    //         nbDevModeTap = 0;
    //     }, 500);
    // }

    function getTitle(item) {
        switch (item.id) {
            case 'token':
                return lc(item.token);
            default:
                return item.title;
        }
    }
    function getSubtitle(item) {
        switch (item.id) {
            // case 'token':
            //     return item.value || lc('click_to_set_key');
            default:
                return item.description || '';
        }
    }
    function refresh() {
        const newItems = [
            {
                id: 'language',
                description: getLocaleDisplayName(),
                title: lc('language')
            },
            {
                id: 'dark_mode',
                description: getThemeDisplayName(),
                title: lc('theme.title')
            },

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
            },

            {
                id: 'setting',
                key: 'previewResizeThreshold',
                title: lc('preview_resize_threshold'),
                full_description: lc('preview_resize_threshold_desc'),
                default: ApplicationSettings.getNumber('previewResizeThreshold', 200),
                rightValue: () => ApplicationSettings.getNumber('previewResizeThreshold', 200),
                type: 'prompt'
            },
            {
                id: 'webdav',
                rightValue: () => (syncService.enabled ? lc('enabled') : lc('disabled')),
                title: lc('webdav_sync'),
                description: syncService.enabled ? syncService.remoteURL : lc('webdav_sync_desc')
            },
            // {
            //     id: 'test',
            //     type: 'checkbox',
            //     title: lc('webdav_sync'),
            //     value:false
            // },
            // {
            //     id: 'share',
            //     rightBtnIcon: 'mdi-chevron-right',
            //     title: lc('share_application')
            // },
            {
                id: 'version',
                title: lc('version'),
                description: __APP_VERSION__ + ' Build ' + __APP_BUILD_NUMBER__
            },
            {
                id: 'github',
                rightBtnIcon: 'mdi-chevron-right',
                title: lc('source_code'),
                description: lc('get_app_source_code')
            },
            {
                id: 'third_party',
                rightBtnIcon: 'mdi-chevron-right',
                title: lc('third_parties'),
                description: lc('list_used_third_parties')
            },
            {
                id: 'export_settings',
                title: lc('export_settings'),
                description: lc('export_settings_desc'),
                rightBtnIcon: 'mdi-chevron-right'
            },
            {
                id: 'import_settings',
                title: lc('import_settings'),
                description: lc('import_settings_desc'),
                rightBtnIcon: 'mdi-chevron-right'
            }
        ];

        items = new ObservableArray(newItems);
    }
    refresh();

    async function onLongPress(command, item?) {
        try {
            switch (command) {
                case 'version':
                    throw new Error('test error');
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
            if (item.type === 'checkbox') {
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
                    // (collectionView.nativeView as CollectionView).refreshVisibleItems();
                    break;
                case 'share':
                    share({
                        message: STORE_LINK
                    });
                    break;
                case 'webdav':
                    const WebdavConfig = (await import('~/components/WebdavConfig.svelte')).default;
                    await showBottomSheet({
                        parent: this,
                        view: WebdavConfig,
                        ignoreTopSafeArea: true
                    });
                    break;
                case 'review':
                    Utils.openUrl(STORE_REVIEW_LINK);
                    break;
                case 'third_party':
                    const ThirdPartySoftwareBottomSheet = (await import('~/components/ThirdPartySoftwareBottomSheet.svelte')).default;
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
                        const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
                        const result = await showBottomSheet<any>({
                            parent: null,
                            view: OptionSelect,
                            props: {
                                options: item.values.map((k) => ({ name: k.title, data: k.value }))
                            },
                            trackingScrollView: 'collectionView'
                        });
                        if (result) {
                            ApplicationSettings.setNumber(item.key, result.data);
                            updateItem(item);
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
        return item.type || 'default';
    }

    async function onCheckBox(item, event) {
        const value = event.value;
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
        try {
            switch (item.id) {
                case 'biometric_lock':
                    if (value) {
                        try {
                            await securityService.enableBiometric();
                        } catch (error) {
                            const checkboxView: CheckBox = event.object;
                            checkboxView.checked = item.value = false;
                            showError(error);
                        }
                    } else {
                        securityService.clear();
                        securityService.disableBiometric();
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
                    ApplicationSettings.setBoolean(item.key, value);
                    break;
            }
        } catch (error) {
            console.error(error, error.stack);
        }
    }
    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);
</script>

<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <collectionview bind:this={collectionView} itemTemplateSelector={selectTemplate} {items} row={1} android:paddingBottom={$navigationBarHeight}>
            <Template key="switch" let:item>
                <ListItemAutoSize leftIcon={item.icon} mainCol={1} showBottomLine={false} subtitle={item.description} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <switch id="checkbox" checked={item.value} col={2} on:checkedChange={(e) => onCheckBox(item, e)} />
                </ListItemAutoSize>
            </Template>
            <Template key="checkbox" let:item>
                <ListItemAutoSize leftIcon={item.icon} mainCol={1} showBottomLine={false} subtitle={item.description} title={getTitle(item)} on:tap={(event) => onTap(item, event)}>
                    <checkbox id="checkbox" checked={item.value} col={2} on:checkedChange={(e) => onCheckBox(item, e)} />
                </ListItemAutoSize>
            </Template>
            <Template let:item>
                <ListItemAutoSize
                    leftIcon={item.icon}
                    rightIcon={item.rightBtnIcon}
                    rightValue={item.rightValue}
                    showBottomLine={false}
                    subtitle={item.description}
                    title={getTitle(item)}
                    on:tap={(event) => onTap(item, event)}>
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
                            visibility={item.description?.length > 0 ? 'visible' : 'collapsed'} />
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
                        visibility={!!item.rightValue ? 'visible' : 'collapsed'} />
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
        <CActionBar canGoBack title={$slc('settings')} />
    </gridlayout>
</page>
