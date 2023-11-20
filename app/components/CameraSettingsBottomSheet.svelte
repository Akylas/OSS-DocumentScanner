<svelte:options accessors />

<script lang="ts">
    import { Color } from '@nativescript/core';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { lc } from '~/helpers/locale';
    import { ColorMatricesTypes, getColorMatrix } from '~/utils/ui';
    import { colors } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary } = $colors);

    export let transforms = [];
    export let colorType;
    let collectionView: NativeViewElementNode<CollectionView>;

    const filters = ColorMatricesTypes.map((k) => ({
        id: k,
        text: lc(k),
        colorType: k
    }));

    function addOrRemoveTransform(transform: string) {
        const index = transforms.indexOf(transform);
        if (index !== -1) {
            transforms.splice(index, 1);
        } else {
            transforms.push(transform);
        }
        transforms = transforms;
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
</script>

<gesturerootview rows="auto,auto">
    <stacklayout horizontalAlignment="right" orientation="horizontal" padding="16">
        <checkbox checked={transforms.indexOf('enhance') !== -1} marginLeft={4} text={lc('enhance')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('enhance')} />
        <checkbox checked={transforms.indexOf('whitepaper') !== -1} marginLeft={4} text={lc('whitepaper')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('whitepaper')} />
        <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
    </stacklayout>
    <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={1}>
        <Template let:item>
            <gridlayout backgroundColor={getBackgroundColor(item)} padding={4} rows="*,25" on:tap={() => setColorType(item.colorType)}>
                <image colorMatrix={getColorMatrix(item.colorType)} src="~/assets/images/filter_color.png" />
                <label fontSize={10} row={1} text={item.text} textAlignment="center" />
            </gridlayout>
        </Template>
    </collectionview>
</gesturerootview>
