<script context="module" lang="ts">
    import { openFilePicker } from '@nativescript-community/ui-document-picker';
    import { File, Utils } from '@nativescript/core';
    import { debounce } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import { lc } from '~/helpers/locale';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { actionBarButtonHeight, colors, fonts } from '~/variables';
    import IconButton from './IconButton.svelte';
    export interface OptionType {
        name: string;
        isPick?: boolean;
        [k: string]: any;
    }
</script>

<script lang="ts">
    export let showFilter = false;
    export let showBorders = false;
    export let backgroundColor = null;
    export let rowHeight = 72;
    export let width: string | number = '*';
    export let containerColumns: string = '*';
    export let fontWeight = 'normal';
    export let options: OptionType[];
    export let onClose = null;
    export let height: number | string = 350;
    export let fontSize = 16;
    export let iconFontSize = 16;
    export let onCheckBox: (item, value, e) => void = null;
    let filteredOptions: OptionType[] = null;
    let filter: string = null;

    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurface, colorOutline } = $colors);

    function updateFiltered(filter) {
        if (filter) {
            filteredOptions = options.filter((d) => d.name.indexOf(filter) !== -1);
        } else {
            filteredOptions = options;
        }
    }
    const updateFilteredDebounce = debounce(updateFiltered, 500);
    updateFiltered(filter);
    $: updateFilteredDebounce(filter);

    function close(value?: OptionType) {
        (onClose || closeBottomSheet)(value);
    }

    async function onTap(item: OptionType, args) {
        if (item.isPick) {
            try {
                const result = await openFilePicker({
                    extensions: ['file/*'],
                    multipleSelection: false,
                    pickerMode: 0
                });
                if (File.exists(result.files[0])) {
                    const file = File.fromPath(result.files[0]);
                    close({ name: file.name, data: { url: file.path }, isPick: true });
                } else {
                    close(null);
                }
            } catch (err) {
                close(null);
            }
        } else {
            close(item);
        }
    }
    onDestroy(() => {
        blurTextField();
    });
    function blurTextField() {
        Utils.dismissSoftInput();
    }
</script>

<gesturerootview columns={containerColumns} rows="auto">
    <gridlayout {backgroundColor} columns={`${width}`} {height} rows="auto,*" {...$$restProps}>
        {#if showFilter}
            <gridlayout borderColor={colorOutline} margin="10 10 0 10">
                <textfield
                    autocapitalizationType="none"
                    backgroundColor="transparent"
                    height={$actionBarButtonHeight}
                    hint={lc('search')}
                    padding="0 30 0 20"
                    placeholder={lc('search')}
                    returnKeyType="search"
                    text={filter}
                    variant="outline"
                    verticalTextAlignment="center"
                    on:returnPress={blurTextField}
                    on:textChange={(e) => (filter = e['value'])} />

                <IconButton
                    col={1}
                    gray={true}
                    horizontalAlignment="right"
                    isHidden={!filter || filter.length === 0}
                    size={40}
                    text="mdi-close"
                    verticalAlignment="middle"
                    on:tap={() => (filter = null)} />
            </gridlayout>
        {/if}
        <collectionView itemTemplateSelector={(item) => item.type || 'default'} items={filteredOptions} paddingBottom={8} paddingTop={8} row={1} {rowHeight}>
            <Template key="checkbox" let:item>
                <checkbox checked={item.value} text={item.name} on:checkedChange={(e) => onCheckBox(item, e.value, e)} />
            </Template>
            <Template let:item>
                <canvaslabel color={item.color || colorOnSurface} paddingLeft={16} paddingRight={16} rippleColor={item.color || colorOnSurface} on:tap={(event) => onTap(item, event)}>
                    <cspan fontFamily={$fonts.mdi} fontSize={iconFontSize} text={item.icon} textAlignment="left" verticalAlignment="middle" visibility={item.icon ? 'visible' : 'hidden'} />
                    <cspan {fontSize} {fontWeight} paddingLeft={item.icon ? 48 : 0} text={item.name} textAlignment="left" verticalAlignment="middle" />
                    {#if showBorders}
                        <line color={colorOutlineVariant} height={1} startX={20} startY={0} stopX="100%" stopY={0} strokeWidth={1} verticalAlignment="bottom" />
                    {/if}
                </canvaslabel>
            </Template>
        </collectionView>
    </gridlayout>
</gesturerootview>
