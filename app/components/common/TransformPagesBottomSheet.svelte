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
    import { colors, navigationBarHeight, screenHeightDips, screenWidthDips, statusBarHeight } from '~/variables';
    import ListItem from './ListItem.svelte';
    import { CheckBox } from '@nativescript-community/ui-checkbox';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSurfaceContainer } = $colors);

    export let transforms = [];
    export let colorType = null;
    export let colorMatrix: number[] = null;

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
        colorMatrix = null;
        refreshCollectionView();
    }
    function onColorMatrixChange(type, value, refreshCV = false) {
        colorType = type;
        colorMatrix = getColorMatrix(colorType, value);
        if (refreshCV) {
            refreshCollectionView();
        }
    }
    async function setColorMatrixLevels(item, event) {
        if (!item.range) {
            return;
        }

        try {
            const component = (await import('~/components/common/SliderPopover.svelte')).default;
            const currentValue = 1;
            DEV_LOG && console.log('setColorMatrixLevels', currentValue, colorMatrix);
            onColorMatrixChange(item.colorType, currentValue, true);
            await showPopover({
                backgroundColor: colorSurfaceContainer,
                view: component,
                anchor: event.object,
                vertPos: VerticalPosition.ABOVE,
                horizPos: HorizontalPosition.ALIGN_LEFT,
                props: {
                    min: 0.5,
                    max: 2,
                    step: 0.1,
                    width: '80%',
                    value: currentValue,
                    onChange(value) {
                        if (colorMatrix?.[0] || 1 !== value) {
                            onColorMatrixChange(item.colorType, value);
                        }
                    }
                }
            });
        } catch (err) {
            showError(err);
        }
    }
    function isCurrentColorType(i) {
        return colorType === i.colorType;
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
        console.log('startUpdate', colorType, colorMatrix);
        closeBottomSheet({
            transforms,
            colorType,
            colorMatrix
        });
    }
    const maxHeight = 40 + Object.keys(TRANSFORMS).length * 70 + 80;
    const maxScreenHeight = screenHeightDips - $statusBarHeight - $navigationBarHeight;
    console.log('maxHeight', maxHeight, maxScreenHeight, screenHeightDips);
</script>

<gesturerootview padding="10 10 0 10" rows={maxHeight < maxScreenHeight ? 'auto,auto' : '*,auto'}>
    <scrollview>
        <stacklayout>
            <label class="sectionBigHeader" text={lc('transformations')} />
            <stacklayout>
                {#each TRANSFORMS as item}
                    <ListItem columns="*,auto" height={70} subtitle={item.subtitle} title={item.name} on:tap={(e) => onTransformTap(item, e)}>
                        <checkbox
                            id="checkbox"
                            checked={transforms.indexOf(item.id) !== -1}
                            col={2}
                            ios:marginRight={10}
                            verticalAlignment="center"
                            on:checkedChange={(e) => onCheckedChanged(item, e)} />
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
            <label class="sectionBigHeader" text={lc('filters')} />
            <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal">
                <Template let:item>
                    <gridlayout padding={2} on:tap={() => setColorType(item.colorType)} on:longPress={(event) => setColorMatrixLevels(item, event)}>
                        <image
                            borderColor={colorPrimary}
                            borderRadius={4}
                            borderWidth={isCurrentColorType(item) ? 3 : 0}
                            colorMatrix={getColorMatrix(item.colorType)}
                            src="~/assets/images/filter_color.png" />
                        <label
                            backgroundImage="linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)"
                            ios:selectable={true}
                            borderRadius="0 0 4 4"
                            color="white"
                            fontSize={11}
                            fontWeight="500"
                            text={item.text}
                            textAlignment="center"
                            verticalAlignment="bottom" />
                    </gridlayout>
                </Template>
            </collectionview>
        </stacklayout>
    </scrollview>
    <mdbutton row={1} text={lc('start')} on:tap={startUpdate} />
</gesturerootview>
