<svelte:options accessors />

<script context="module" lang="ts">
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { openFilePicker } from '@nativescript-community/ui-document-picker';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { File, ObservableArray, Utils, View } from '@nativescript/core';
    import { debounce } from '@nativescript/core/utils';
    import { onDestroy } from 'svelte';
    import { Template } from 'svelte-native/components';
    import IconButton from '~/components/common/IconButton.svelte';
    import ListItem from '~/components/common/ListItem.svelte';
    import { lc } from '~/helpers/locale';
    import { actionBarButtonHeight, colors } from '~/variables';
    import ListItemAutoSize from './ListItemAutoSize.svelte';
    export interface OptionType {
        name: string;
        isPick?: boolean;
        boxType?: string;
        type?: string;
        [k: string]: any;
    }
</script>

<script lang="ts">
    export let showFilter = false;
    export let showBorders = false;
    export let backgroundColor = null;
    export let borderRadius = 8;
    export let rowHeight = null;
    export let width: string | number = '*';
    export let containerColumns: string = '*';
    export let autoSizeListItem: boolean = false;
    export let fontWeight = 'bold';
    export let options: OptionType[] | ObservableArray<OptionType>;
    export let onClose = null;
    export let selectedIndex = -1;
    export let height: number | string = null;
    export let fontSize = 16;
    export let iconFontSize = 24;
    export let onlyOneSelected = false;
    export let currentlyCheckedItem = null;
    export let onCheckBox: (item, value, e) => void = null;
    export let onRightIconTap: (item, e) => void = null;
    let filteredOptions: OptionType[] | ObservableArray<OptionType> = null;
    let filter: string = null;

    // technique for only specific properties to get updated on store change
    $: ({ colorOutline } = $colors);

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

    let checkboxTapTimer;
    function clearCheckboxTimer() {
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
    }
    async function onRightTap(item: OptionType, event) {
        onRightIconTap?.(item, event);
    }
    async function onTap(item: OptionType, event) {
        if (item.isPick) {
            try {
                const result = await openFilePicker({
                    extensions: ['file/*'],
                    multipleSelection: false,
                    pickerMode: 0,
                    forceSAF: true
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
        } else if (item.type === 'checkbox') {
            // we dont want duplicate events so let s timeout and see if we clicking diretly on the checkbox
            const checkboxView: CheckBox = ((event.object as View).parent as View).getViewById('checkbox');
            clearCheckboxTimer();
            checkboxTapTimer = setTimeout(() => {
                checkboxView.checked = !checkboxView.checked;
            }, 10);
        } else {
            close(item);
        }
    }
    let ignoreNextOnCheckBoxChange = false;
    function onCheckedChanged(item, event) {
        // DEV_LOG && console.log('onCheckedChanged', event.value, ignoreNextOnCheckBoxChange);
        clearCheckboxTimer();
        if (ignoreNextOnCheckBoxChange) {
            ignoreNextOnCheckBoxChange = false;
            return;
        }
        ignoreNextOnCheckBoxChange = true;
        if (onlyOneSelected && options instanceof ObservableArray) {
            if (event.value) {
                const oldSelected = currentlyCheckedItem;
                if (oldSelected === item) {
                    ignoreNextOnCheckBoxChange = false;
                    return;
                }
                DEV_LOG && console.log('onlyOneSelected', oldSelected);
                item.value = true;
                currentlyCheckedItem = item;
                if (oldSelected) {
                    const index = options.indexOf(oldSelected);
                    DEV_LOG && console.log('onlyOneSelected1', index);
                    if (index >= 0) {
                        oldSelected.value = false;
                        options.setItem(index, oldSelected);
                    }
                }
                options.setItem(options.indexOf(currentlyCheckedItem), currentlyCheckedItem);
            } else {
                // we dont allow to have none selected
                ignoreNextOnCheckBoxChange = false;
                const checkboxView: CheckBox = ((event.object as View).parent as View).getViewById('checkbox');
                checkboxView.checked = true;
                return;
            }
        }
        onCheckBox?.(item, event.value, event);
        ignoreNextOnCheckBoxChange = false;
    }
    onDestroy(() => {
        blurTextField();
    });
    function blurTextField() {
        Utils.dismissSoftInput();
    }

    function itemTemplateSelector(item) {
        if (item.type) {
            return item.type;
        }
        if (item.rightIcon) {
            return 'righticon';
        }
        return 'default';
    }
    function onDataPopulated(event) {
        if (selectedIndex !== undefined) {
            if (onlyOneSelected) {
                currentlyCheckedItem = options instanceof ObservableArray ? options.getItem(selectedIndex) : options[selectedIndex];
            }
            if (selectedIndex > 0) {
                event.object.scrollToIndex(selectedIndex, false);
            }
        }
    }
    const component = autoSizeListItem ? ListItemAutoSize : ListItem;
</script>

<gesturerootview columns={containerColumns} rows="auto">
    <gridlayout {backgroundColor} {borderRadius} columns={`${width}`} {height} rows="auto,*" {...$$restProps}>
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
        <collectionView {itemTemplateSelector} items={filteredOptions} row={1} {rowHeight} on:dataPopulated={onDataPopulated} ios:contentInsetAdjustmentBehavior={2}>
            <Template key="checkbox" let:item>
                <svelte:component
                    this={component}
                    {borderRadius}
                    color={item.color}
                    columns="auto,*,auto"
                    {fontSize}
                    fontWeight={item.fontWeight || fontWeight}
                    {iconFontSize}
                    leftIcon={item.icon}
                    mainCol={1}
                    showBottomLine={showBorders}
                    subtitle={item.subtitle}
                    title={item.name}
                    on:tap={(event) => onTap(item, event)}>
                    <checkbox
                        id="checkbox"
                        boxType={item.boxType}
                        checked={item.value}
                        col={item.boxType === 'circle' ? 0 : 2}
                        ios:marginRight={10}
                        verticalAlignment="center"
                        on:checkedChange={(e) => onCheckedChanged(item, e)} />
                </svelte:component>
            </Template>
            <Template key="righticon" let:item>
                <svelte:component
                    this={component}
                    {borderRadius}
                    color={item.color}
                    columns="*,auto"
                    {fontSize}
                    {fontWeight}
                    {iconFontSize}
                    leftIcon={item.icon}
                    showBottomLine={showBorders}
                    subtitle={item.subtitle}
                    title={item.name}
                    on:tap={(event) => onTap(item, event)}>
                    <mdbutton class="icon-btn" col={1} text={item.rightIcon} variant="text" on:tap={(event) => onRightTap(item, event)} />
                </svelte:component>
            </Template>
            <Template key="image" let:item>
                <svelte:component
                    this={component}
                    {borderRadius}
                    color={item.color}
                    columns="*,auto"
                    {fontSize}
                    {fontWeight}
                    {iconFontSize}
                    leftIcon={item.icon}
                    showBottomLine={showBorders}
                    subtitle={item.subtitle}
                    title={item.name}
                    on:tap={(event) => onTap(item, event)}>
                    <image col={1} height={45} src={item.image} />
                </svelte:component>
            </Template>
            <Template let:item>
                <svelte:component
                    this={component}
                    {borderRadius}
                    color={item.color}
                    {fontSize}
                    {fontWeight}
                    {iconFontSize}
                    leftIcon={item.icon}
                    rightIcon={item.rightIcon}
                    showBottomLine={showBorders}
                    subtitle={item.subtitle}
                    title={item.name}
                    on:rightTap={(event) => onRightTap(item, event)}
                    on:tap={(event) => onTap(item, event)}>
                </svelte:component>
            </Template>
        </collectionView>
    </gridlayout>
</gesturerootview>
