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
    import ListItem from '../common/ListItem.svelte';
    import { CheckBox } from '@nativescript-community/ui-checkbox';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorSurfaceContainer } = $colors);
    const isAndroid = __ANDROID__;

    const textFieldWidth = (screenWidthDips - 20 - 22 - 16) / 2;

    export let transforms = [];
    export let cameraOptionsStore: Writable<{ aspectRatio: string; stretch: string; viewsize: string; pictureSize: string }>;
    export let colorType;
    export let resolutions: { pictureSize: string; aspectRatio: string }[] = null;
    export let currentResolution: { pictureSize: string; aspectRatio: string } = null;

    DEV_LOG && console.log('resolutions', resolutions);
    DEV_LOG && console.log('currentResolutions', currentResolution);

    // $: ({ aspectRatio, stretch, viewsize, pictureSize } = $cameraOptionsStore);

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
        DEV_LOG && console.log('addOrRemoveTransform', transforms);
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

    function updateOption(option: string, value, item) {
        DEV_LOG && console.log(updateOption,option, value, item);
        cameraOptionsStore.update((state) => {
            state[option] = value;
            if (option === 'pictureSize') {
                state['aspectRatio'] = item.aspectRatio;
            } else if (option === 'aspectRatio') {
                state['pictureSize'] = null;
            }

            return state;
        });
    }
    // const OPTIONS = {
    //     stretch: {
    //         aspectFit: { name: lc('aspect_fit') },
    //         aspectFill: { name: lc('aspect_fill') }
    //     },
    //     aspectRatio: {
    //         '4:3': { name: '4:3' },
    //         '16:9': { name: '16:9' }
    //     },
    //     viewsize: {
    //         full: { name: lc('full') },
    //         limited: { name: lc('limited') }
    //     }
    // };

    const OPTIONS: any[] = [
        {
            id: 'stretch',
            title: lc('camera_preview_stretch'),
            options: {
                aspectFit: { name: lc('aspect_fit') },
                aspectFill: { name: lc('aspect_fill') }
            }
        },
        {
            id: 'viewsize',
            title: lc('camera_view_size'),
            options: {
                full: { name: lc('full') },
                limited: { name: lc('limited') }
            }
        }
    ].concat(
        __ANDROID__
            ? [
                  {
                      id: 'aspectRatio',
                      title: lc('aspect_ratio'),
                      options: {
                          '4:3': { name: '4:3' },
                          '16:9': { name: '16:9' }
                      }
                  },
                  {
                      id: 'pictureSize',
                      title: lc('picture_size'),
                      default: currentResolution.pictureSize,
                      options: resolutions.reduce((acc, current) => {
                          acc[current.pictureSize] = { ...current, name: `${current.pictureSize} (${current.aspectRatio})` };
                          return acc;
                      }, {})
                  }
              ]
            : ([] as any)
    );

    async function selectOption(item, event, valueTransformer?, fullRefresh = true) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(item.options).map((k) => ({ ...item.options[k], id: k }));
            await showPopoverMenu({
                options,
                anchor: event.object,
                onClose: (value) => {
                    updateOption(item.id, valueTransformer ? valueTransformer(value.id) : value.id, value);
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
            //         rowHeight: 58 * $fontScale,
            //         height: Math.min(58 * options.length * $fontScale + 8, 300),
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
</script>

<gesturerootview padding="10 10 0 10" rows="auto">
    <stacklayout>
        <label class="sectionHeader" text={lc('camera_settings')} />
        <wraplayout padding="10 0 10 0">
            {#each OPTIONS as item}
                <textfield
                    editable={false}
                    hint={item.title}
                    margin="4 8 4 8"
                    text={$cameraOptionsStore[item.id] || item.default}
                    variant="outline"
                    width={textFieldWidth}
                    on:tap={(e) => selectOption(item, e)} />
            {/each}
            <!-- <mdbutton class="icon-btn" color="white" fontSize={14} text={aspectRatio} variant="text" on:tap={toggleAspectRatio} /> -->
            <!-- <textfield editable={false} hint={lc('camera_preview_stretch')} marginLeft={16} text={stretch} variant="outline" width={textFieldWidth} on:tap={(e) => selectOption('stretch', e)} />
            {#if isAndroid}
                <textfield editable={false} hint={lc('aspect_ratio')} text={aspectRatio} variant="outline" width={textFieldWidth} on:tap={(e) => selectOption('aspectRatio', e)} />
            {/if} -->
        </wraplayout>
        <label class="sectionHeader" text={lc('transformations')} />
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
        <label class="sectionHeader" text={lc('filters')} />
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
