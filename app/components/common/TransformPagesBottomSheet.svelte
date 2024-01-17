<svelte:options accessors />

<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { Color, View } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { Writable } from 'svelte/store';
    import { lc } from '~/helpers/locale';
    import { TRANSFORMS } from '~/models/localized_constant';
    import { showError } from '~/utils/error';
    import { ColorMatricesTypes, getColorMatrix, showPopoverMenu } from '~/utils/ui';
    import { colors, screenWidthDips } from '~/variables';
    import ListItem from './ListItem.svelte';
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSurfaceContainer } = $colors);

    const textFieldWidth = (screenWidthDips - 20 - 22 - 16) / 2;

    export let transforms = [];
    export let colorType = null;

    let collectionView: NativeViewElementNode<CollectionView>;

    const filters = ColorMatricesTypes.map((k) => ({
        ...k,
        text: lc(k.id),
        colorType: k.id
    }));

    function addOrRemoveTransform(transform: string) {
        const index = transforms.indexOf(transform);
        if (index !== -1) {
            transforms.splice(index, 1);
        } else {
            transforms.push(transform);
        }
        transforms = transforms.filter((s) => !!s && s.length);
    }

    function refreshCollectionView() {
        collectionView?.nativeView?.refreshVisibleItems();
    }

    function setColorType(type) {
        colorType = type;
        refreshCollectionView();
    }
    function getBackgroundColor(item) {
        const result = colorType === item.colorType ? new Color(colorPrimary).setAlpha(100).hex : undefined;
        return result;
    }

    // function toggleAspectRatio() {
    //     updateOption('aspectRatio', aspectRatio === '4:3' ? '16:9' : '4:3');
    // }

    let checkboxTapTimer;
    function onCheckedChanged(item, event) {
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
        addOrRemoveTransform(item.id);
    }
    function onTransformTap(item, event) {
        const checkboxView: CheckBox = (event.object as View).getViewById('checkbox');
        checkboxTapTimer = setTimeout(() => {
            checkboxView.checked = !checkboxView.checked;
        }, 10);
    }
    function startUpdate() {
        closeBottomSheet({
            transforms,
            colorType
        });
    }
</script>

<gesturerootview padding="10 10 0 10" rows="auto">
    <stacklayout>
        <label color={colorPrimary} fontSize={20} fontWeight="bold" marginBottom={16} text={lc('transformations')} />
        <stacklayout>
            {#each TRANSFORMS as item}
                <ListItem columns="*,auto" height={70} subtitle={item.subtitle} title={item.name} on:tap={(e) => onTransformTap(item, e)}>
                    <checkbox id="checkbox" checked={transforms.indexOf(item.id) !== -1} col={2} ios:marginRight={10} verticalAlignment="center" on:checkedChange={(e) => onCheckedChanged(item, e)} />
                </ListItem>
            {/each}
            <!-- <checkbox checked={transforms.indexOf('enhance') !== -1} marginLeft={4} text={lc('enhance')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('enhance')} />
            <checkbox
                checked={transforms.indexOf('whitepaper') !== -1}
                marginLeft={4}
                text={lc('whitepaper')}
                verticalAlignment="middle"
                on:checkedChange={(e) => addOrRemoveTransform('whitepaper')} />
            <checkbox checked={transforms.indexOf('color') !== -1} marginLeft={4} text={lc('color')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('color')} /> -->
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <label color={colorPrimary} fontSize={20} fontWeight="bold" marginBottom={16} text={lc('filters')} />
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal">
            <Template let:item>
                <gridlayout backgroundColor={getBackgroundColor(item)} padding={4} rows="*,25" on:tap={() => setColorType(item.colorType)}>
                    <image colorMatrix={getColorMatrix(item.colorType)} src="~/assets/images/filter_color.png" />
                    <label fontSize={10} row={1} text={item.text} textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
        <mdbutton text={lc('start')} on:tap={startUpdate} />
    </stacklayout>
</gesturerootview>
