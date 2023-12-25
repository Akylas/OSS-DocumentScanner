<svelte:options accessors />

<script lang="ts">
    import { Color } from '@nativescript/core';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { lc } from '~/helpers/locale';
    import { ColorMatricesTypes, getColorMatrix, showPopoverMenu } from '~/utils/ui';
    import { colors, screenWidthDips, systemFontScale } from '~/variables';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { closePopover, showPopover } from '@nativescript-community/ui-popover/svelte';
    import { showError } from '~/utils/error';
    import { Writable } from 'svelte/store';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSurfaceContainer } = $colors);
    const isAndroid = __ANDROID__;

    const textFieldWidth = (screenWidthDips - 20 - 22 - 16) / 2;

    export let transforms = [];
    export let cameraOptionsStore: Writable<{ aspectRatio: string; stretch: string; viewsize: string }>;
    export let colorType;

    $: ({ aspectRatio, stretch, viewsize } = $cameraOptionsStore);

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

    function updateOption(option: string, value, fullRefresh = false) {
        cameraOptionsStore.update((state) => {
            state[option] = value;
            return state;
        });
    }
    const OPTIONS = {
        stretch: {
            aspectFit: { name: lc('aspect_fit') },
            aspectFill: { name: lc('aspect_fill') }
        },
        aspectRatio: {
            '4:3': { name: '4:3' },
            '16:9': { name: '16:9' }
        },
        viewsize: {
            full: { name: lc('full') },
            limited: { name: lc('limited') }
        }
    };
    async function selectOption(option: string, event, valueTransformer?, fullRefresh = true) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(OPTIONS[option]).map((k) => ({ ...OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                options,
                anchor: event.object,
                onClose: (item) => {
                    updateOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
                }
            });
            // await showPopover({
            //     backgroundColor: colorSurfaceContainer,
            //     view: OptionSelect,
            //     anchor: event.object,
            //     horizPos: HorizontalPosition.ALIGN_LEFT,
            //     vertPos: VerticalPosition.CENTER,
            //     props: {
            //         borderRadius: 10,
            //         elevation: 4,
            //         margin: 4,
            //         backgroundColor: colorSurfaceContainer,
            //         containerColumns: 'auto',
            //         rowHeight: 58 * $systemFontScale,
            //         height: Math.min(58 * options.length * $systemFontScale + 8, 300),
            //         width: 150,
            //         options,
            //         onClose: (item) => {
            //             closePopover();
            //             updateOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
            //         }
            //     }
            // });
        } catch (error) {
            showError(error);
        }
    }

    // function toggleAspectRatio() {
    //     updateOption('aspectRatio', aspectRatio === '4:3' ? '16:9' : '4:3');
    // }
</script>

<gesturerootview padding="10 10 0 10" rows="auto">
    <stacklayout>
        <label fontSize={19} fontWeight="bold" margin={5} text={lc('camera_settings')} />
        <wraplayout padding="10">
            <!-- <mdbutton class="icon-btn" color="white" fontSize={14} text={aspectRatio} variant="text" on:tap={toggleAspectRatio} /> -->
            <textfield editable={false} hint={lc('camera_view_size')} text={viewsize} variant="outline" width={textFieldWidth} on:tap={(e) => selectOption('viewsize', e)} />
            <textfield editable={false} hint={lc('camera_preview_stretch')} marginLeft={16} text={stretch} variant="outline" width={textFieldWidth} on:tap={(e) => selectOption('stretch', e)} />
            {#if isAndroid}
                <textfield editable={false} hint={lc('aspect_ratio')} text={aspectRatio} variant="outline" width={textFieldWidth} on:tap={(e) => selectOption('aspectRatio', e)} />
            {/if}
        </wraplayout>
        <label fontSize={19} fontWeight="bold" margin={5} text={lc('transformations')} />
        <stacklayout horizontalAlignment="left" orientation="horizontal" padding="10">
            <checkbox checked={transforms.indexOf('enhance') !== -1} marginLeft={4} text={lc('enhance')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('enhance')} />
            <checkbox
                checked={transforms.indexOf('whitepaper') !== -1}
                marginLeft={4}
                text={lc('whitepaper')}
                verticalAlignment="middle"
                on:checkedChange={(e) => addOrRemoveTransform('whitepaper')} />
            <checkbox checked={transforms.indexOf('color') !== -1} marginLeft={4} text={lc('color')} verticalAlignment="middle" on:checkedChange={(e) => addOrRemoveTransform('color')} />
            <!-- <mdbutton variant="text" class="icon-btn" text="mdi-invert-colors" on:tap={() => setColorType((colorType + 1) % 3)} on:longPress={setBlackWhiteLevel} /> -->
        </stacklayout>
        <label fontSize={19} fontWeight="bold" margin={5} text={lc('filters')} />
        <collectionview bind:this={collectionView} colWidth={60} height={85} items={filters} orientation="horizontal" row={1}>
            <Template let:item>
                <gridlayout backgroundColor={getBackgroundColor(item)} padding={4} rows="*,25" on:tap={() => setColorType(item.colorType)}>
                    <image colorMatrix={getColorMatrix(item.colorType)} src="~/assets/images/filter_color.png" />
                    <label fontSize={10} row={1} text={item.text} textAlignment="center" />
                </gridlayout>
            </Template>
        </collectionview>
    </stacklayout>
</gesturerootview>
