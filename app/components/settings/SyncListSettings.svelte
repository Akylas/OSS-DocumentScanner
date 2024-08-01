<script context="module" lang="ts">
    import { isPermResultAuthorized, request } from '@nativescript-community/perms';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { ObservableArray } from '@nativescript/core';
    import { SDK_VERSION } from '@nativescript/core/utils';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import ListItemAutoSize from '~/components/common/ListItemAutoSize.svelte';
    import { lc, onLanguageChanged } from '~/helpers/locale';
    import { onThemeChanged } from '~/helpers/theme';
    import { SERVICES_SYNC_TITLES, syncService } from '~/services/sync';
    import { LocalFolderImageSyncServiceOptions } from '~/services/sync/LocalFolderImageSyncService';
    import { LocalFolderPDFSyncServiceOptions } from '~/services/sync/LocalFolderPDFSyncService';
    import { createWebdavConfig } from '~/services/sync/Webdav';
    import { WebdavDataSyncOptions } from '~/services/sync/WebdavDataSyncService';
    import { WebdavImageSyncServiceOptions } from '~/services/sync/WebdavImageSyncService';
    import { WebdavPDFSyncServiceOptions } from '~/services/sync/WebdavPDFSyncService';
    import { SERVICES_SYNC_COLOR, SYNC_TYPES } from '~/services/sync/types';
    import { ALERT_OPTION_MAX_HEIGHT } from '~/utils/constants';
    import { PermissionError } from '~/utils/error';
    import { showError } from '~/utils/showError';
    import { showModal } from '~/utils/svelte/ui';
    import { getDirectoryName, hideLoading, showAlertOptionSelect } from '~/utils/ui';
    import { colors, windowInset } from '~/variables';
    type Item = (WebdavDataSyncOptions | LocalFolderImageSyncServiceOptions | LocalFolderPDFSyncServiceOptions) & { id?: number; type: SYNC_TYPES; title?: string; description?: string };
</script>

<script lang="ts">
    // technique for only specific properties to get updated on store change
    let { colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant, colorSurfaceContainerHigh, colorError, colorOnError } = $colors;
    $: ({ colorPrimary, colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant, colorSurfaceContainerHigh, colorError, colorOnError } = $colors);

    let collectionView: NativeViewElementNode<CollectionView>;

    let items: ObservableArray<any>;

    export let type: 'pdf' | 'data' | 'image' = 'data';
    export let title = null;
    export let description = null;
    export let actionBarButtons = [{ icon: 'mdi-plus', id: 'add' }];

    const dataSyncServices = syncService.getStoredSyncServices();

    const options: Item[] = dataSyncServices.filter((s) => s.type.endsWith(type));

    function refresh() {
        const newItems: Item[] = options || [];

        items = new ObservableArray(newItems);
    }
    refresh();

    function updateItem(item, key = 'key') {
        const index = items.findIndex((it) => it[key] === item[key]);
        if (index !== -1) {
            items.setItem(index, item);
        }
    }
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
    async function onItemTap(item: Item, event) {
        try {
            DEV_LOG && console.log('SyncListSettings', 'onItemTap', item);
            let configToUpdate;
            switch (item.type) {
                case 'webdav_data': {
                    const page = (await import('~/components/settings/WebdavDataSyncSettings.svelte')).default;
                    const result: WebdavDataSyncOptions = await showModal({
                        page,
                        fullscreen: true,
                        props: {
                            data: item as WebdavDataSyncOptions
                        }
                    });
                    if (result) {
                        configToUpdate = createWebdavConfig(result);
                    }
                    break;
                }
                case 'webdav_pdf': {
                    const page = (await import('~/components/settings/WebdavPDFSyncSettings.svelte')).default;
                    const result: WebdavPDFSyncServiceOptions = await showModal({
                        page,
                        fullscreen: true,
                        props: {
                            data: item as WebdavPDFSyncServiceOptions
                        }
                    });
                    if (result) {
                        configToUpdate = createWebdavConfig(result);
                    }
                    break;
                }
                case 'webdav_image': {
                    const page = (await import('~/components/settings/WebdavImageSyncSettings.svelte')).default;
                    const result: WebdavImageSyncServiceOptions = await showModal({
                        page,
                        fullscreen: true,
                        props: {
                            data: item as WebdavImageSyncServiceOptions
                        }
                    });
                    if (result) {
                        configToUpdate = createWebdavConfig(result);
                    }
                    break;
                }
                case 'folder_image': {
                    const page = (await import('~/components/settings/FolderImageSyncSettings.svelte')).default;
                    const result: LocalFolderImageSyncServiceOptions = await showModal({
                        page,
                        fullscreen: true,
                        props: {
                            data: item as LocalFolderImageSyncServiceOptions
                        }
                    });
                    if (result) {
                        configToUpdate = result;
                    }
                    break;
                }
                case 'folder_pdf': {
                    const page = (await import('~/components/settings/FolderPDFSyncSettings.svelte')).default;
                    const result: LocalFolderPDFSyncServiceOptions = await showModal({
                        page,
                        fullscreen: true,
                        props: {
                            data: item as LocalFolderPDFSyncServiceOptions
                        }
                    });
                    if (result) {
                        configToUpdate = result;
                    }
                    break;
                }
            }
            if (configToUpdate) {
                syncService.updateService(configToUpdate);
                const index = items.indexOf(item);
                if (index !== -1) {
                    items.splice(index, 1, configToUpdate);
                }
            }
        } catch (err) {
            showError(err);
        }
    }
    async function deleteService(item: Item) {
        try {
            const removed = syncService.removeService(item);
            if (removed) {
                const index = items.findIndex((d) => d.id === item.id);
                if (index !== -1) {
                    items.splice(index, 1);
                }
            }
        } catch (err) {
            showError(err);
        }
    }
    async function onTap(item, event) {
        try {
            DEV_LOG && console.log('SyncListSettings', 'onItemTap', item);
            switch (item.id) {
                case 'add':
                    const options = Object.keys(SERVICES_SYNC_TITLES)
                        .filter((s) => s.endsWith(type))
                        .map((s) => ({
                            data: s,
                            name: SERVICES_SYNC_TITLES[s]
                        }));
                    const selection = await showAlertOptionSelect(
                        {
                            fontWeight: 'normal',
                            height: Math.min(options.length * 56, ALERT_OPTION_MAX_HEIGHT),
                            rowHeight: 56,
                            options
                        },
                        {
                            title: lc('select_sync_service')
                        }
                    );
                    if (selection?.data) {
                        const { id, ...data } = item;
                        let configToAdd;
                        switch (selection?.data) {
                            case 'webdav_data': {
                                const page = (await import('~/components/settings/WebdavDataSyncSettings.svelte')).default;
                                const result: WebdavDataSyncOptions = await showModal({
                                    page,
                                    fullscreen: true,
                                    props: {
                                        data
                                    }
                                });
                                if (result) {
                                    configToAdd = createWebdavConfig(result);
                                }
                                break;
                            }
                            case 'webdav_pdf': {
                                const page = (await import('~/components/settings/WebdavPDFSyncSettings.svelte')).default;
                                const result: WebdavPDFSyncServiceOptions = await showModal({
                                    page,
                                    fullscreen: true,
                                    props: {
                                        data
                                    }
                                });
                                if (result) {
                                    configToAdd = createWebdavConfig(result);
                                }
                                break;
                            }
                            case 'webdav_image': {
                                const page = (await import('~/components/settings/WebdavImageSyncSettings.svelte')).default;
                                const result: WebdavImageSyncServiceOptions = await showModal({
                                    page,
                                    fullscreen: true,
                                    props: {
                                        data
                                    }
                                });
                                if (result) {
                                    configToAdd = createWebdavConfig(result);
                                }
                                break;
                            }
                            case 'folder_image': {
                                if (__ANDROID__) {
                                    if (SDK_VERSION <= 29) {
                                        const result = await request('storage');
                                        if (!isPermResultAuthorized(result)) {
                                            throw new PermissionError(lc('storage_permission_needed'));
                                        }
                                    }
                                }
                                const page = (await import('~/components/settings/FolderImageSyncSettings.svelte')).default;
                                const result = await showModal({
                                    page,
                                    fullscreen: true,
                                    props: {
                                        data
                                    }
                                });
                                configToAdd = result;
                                break;
                            }

                            case 'folder_pdf': {
                                if (__ANDROID__) {
                                    if (SDK_VERSION <= 29) {
                                        const result = await request('storage');
                                        if (!isPermResultAuthorized(result)) {
                                            throw new PermissionError(lc('storage_permission_needed'));
                                        }
                                    }
                                }
                                const page = (await import('~/components/settings/FolderPDFSyncSettings.svelte')).default;
                                const result = await showModal({
                                    page,
                                    fullscreen: true,
                                    props: {
                                        data
                                    }
                                });
                                configToAdd = result;
                                break;
                            }
                        }
                        if (configToAdd) {
                            const data = syncService.addService(selection?.data, configToAdd);
                            items.push(data);
                        }
                    }
            }
        } catch (err) {
            showError(err);
        } finally {
            hideLoading();
        }
    }
    onLanguageChanged(refresh);

    function refreshCollectionView() {
        collectionView?.nativeView?.refresh();
    }
    onThemeChanged(refreshCollectionView);

    function getTitle(item: Item) {
        const result = SERVICES_SYNC_TITLES[item.type] + ': ';
        switch (item.type) {
            case 'webdav_data':
            case 'webdav_pdf':
            case 'webdav_image':
                let url = (item as WebdavDataSyncOptions).remoteURL;
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }
                return result + url.split('//')[1].split('/')[0];
            case 'folder_image':
            case 'folder_pdf':
                return result + getDirectoryName((item as LocalFolderImageSyncServiceOptions).localFolderPath);
            default:
                return item.title;
        }
    }
    function getDescription(item: Item) {
        switch (item.type) {
            case 'webdav_data':
                return (item as WebdavDataSyncOptions).remoteFolder;
            // case 'folder_image':
            //     return (item as LocalFolderImageSyncServiceOptions).localFolderPath;
            default:
                return item.description;
        }
    }

    function getSyncColor(item: Item) {
        return item.color || SERVICES_SYNC_COLOR[item.type];
    }

    function selectTemplate(item, index, items) {
        // if (type === 'pdf') {
        //     return 'rightIcon';
        // }
        return 'default';
    }

    function drawerTranslationFunction(side, width, value, delta, progress) {
        const result = {
            mainContent: {
                translateX: -delta
            },
            rightDrawer: {
                translateX: width - delta
            },
            backDrop: {
                translateX: -delta,
                opacity: progress * 0.1
            }
        } as any;

        return result;
    }
</script>

<page id="settingsPage" actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <collectionview bind:this={collectionView} itemTemplateSelector={selectTemplate} {items} row={1} android:paddingBottom={$windowInset.bottom}>
            <Template let:item>
                <swipemenu
                    gestureHandlerOptions={{
                        failOffsetYStart: -40,
                        failOffsetYEnd: 40,
                        minDist: 50
                    }}
                    rightSwipeDistance={0}
                    rows="*"
                    startingSide={item.startingSide}
                    translationFunction={drawerTranslationFunction}>
                    <ListItemAutoSize
                        prop:mainContent
                        borderLeftColor={getSyncColor(item)}
                        borderLeftWidth={5}
                        fontSize={20}
                        rightValue={item.rightValue}
                        showBottomLine={false}
                        subtitle={getDescription(item)}
                        title={getTitle(item)}
                        on:tap={(event) => onItemTap(item, event)} />
                    <label
                        class="mdi"
                        prop:rightDrawer
                        backgroundColor={colorError}
                        color={colorOnError}
                        fontSize={24}
                        rippleColor={colorOnError}
                        text="mdi-trash-can"
                        textAlignment="center"
                        verticalTextAlignment="middle"
                        width={80}
                        on:tap={(e) => deleteService(item)} />
                </swipemenu>
            </Template>
        </collectionview>
        <CActionBar canGoBack {title}>
            {#each actionBarButtons as button}
                <mdbutton class="actionBarButton" text={button.icon} variant="text" on:tap={(event) => onTap({ id: button.id }, event)} />
            {/each}
        </CActionBar>
    </gridlayout>
</page>
