<script context="module" lang="ts">
    import { Color, CoreTypes, Utils, View, verticalAlignmentProperty } from '@akylas/nativescript';

    import { Item } from './MainList.svelte';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { colors, isLandscape, screenHeightDips, screenWidthDips, windowInset } from '~/variables';
    import { CARD_RATIO } from '~/utils/constants';
    import RotableImageView from '../common/RotableImageView.svelte';
    import SelectedIndicator from '../common/SelectedIndicator.svelte';
    import SyncIndicator from '../common/SyncIndicator.svelte';
    import { navigate } from '@shared/utils/svelte/ui';
    import { textAlignmentConverter, verticalTextAlignmentConverter } from '@nativescript-community/text';
    import { colorTheme, isEInk } from '~/helpers/theme';
    const rowMargin = 8;
</script>

<script lang="ts">
    let { colorOnPrimary, colorSurface } = $colors;
    $: ({ colorOnPrimary, colorSurface } = $colors);

    export let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    export let itemWidth: number;
    export let itemHeight: number;
    export let item: Item;
    export let syncEnabled: boolean;
    export let onFullCardItemTouch;
    export let layout: string;

    function animateCards(animOptions, startIndex, endIndex = -1) {
        let index = startIndex;
        const startView = collectionView?.nativeElement.getViewForItemAtIndex(startIndex);

        let foundFirst = false;
        collectionView?.nativeElement.eachChild((child: View) => {
            if (foundFirst) {
                if (endIndex === -1 || index <= endIndex) {
                    child.animate(animOptions);
                    index++;
                }
            } else {
                if (child === startView) {
                    foundFirst = true;
                }
            }
            return true;
        });
    }
    function translateCards(startIndex, endIndex = -1) {
        animateCards(
            {
                duration: 100,
                translate: {
                    x: 0,
                    y: 160
                }
            },
            startIndex,
            endIndex
        );
    }
    function hideCards(startIndex, endIndex = -1) {
        animateCards(
            {
                duration: 100,
                translate: {
                    x: 0,
                    y: 0
                }
            },
            startIndex,
            endIndex
        );
    }

    function getRowHeight(viewStyle, item) {
        const width = $isLandscape ? screenHeightDips : screenWidthDips;
        switch (viewStyle) {
            case 'full':
            case 'cardholder':
            case 'list':
                return itemHeight;
            case 'columns':
                return $isLandscape ? itemHeight : (width / 2) * CARD_RATIO;
        }
    }
    function fullCardDrawerTranslationFunction(side, width, value, delta, progress) {
        const result = {
            mainContent: {
                translateX: side === 'right' ? -delta : delta
            },
            rightDrawer: {
                // translateX: width + (side === 'right' ? -delta : delta)
            },
            leftDrawer: {
                // translateX: (side === 'right' ? -delta : delta) - width
            },
            backDrop: {
                translateX: side === 'right' ? -delta : delta.dev,
                opacity: progress * 0.01
            }
        };

        return result;
    }
    function getItemBackgroundColor(item) {
        return item.doc.pages[0].colors?.[0] || item.doc.extra?.color;
    }
    function getItemRotableImageParams(item: Item) {
        return {
            id: 'imageView',
            document: item.doc,
            // backgroundColor: item.doc.pages[0].colors?.[0] || item.doc.extra?.color,
            borderRadius: 12,
            decodeWidth: Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO,
            fadeDuration: 100,
            item: item.doc.pages[0],
            sharedTransitionTag: `document_${item.doc.id}_${item.doc.pages[0].id}`,
            stretch: 'aspectFill'
        };
    }

    function getItemHolderParams(layout, item: Item) {
        const page = item.doc.pages[0];
        const color = isEInk ? null : new Color(page.colors?.[0] || item.doc.extra?.color || colorOnPrimary);
        const result = {
            backgroundColor: color
        };
        switch (layout) {
            case 'cardholder':
                Object.assign(result, {
                    boxShadow: colorTheme === null ? 0 : '0 0 8 rgba(0, 0, 0, 0.8)',
                    margin: '50 24 0 24'
                });
                break;
            case 'full':
                Object.assign(result, {
                    boxShadow: colorTheme === null ? 0 : '0 0 8 rgba(0, 0, 0, 0.8)',
                    margin: '16 16 16 16'
                });
                break;
            case 'columns':
            case 'list':
                Object.assign(result, {
                    elevation: isEInk ? 0 : 3,
                    margin: 4
                });
                break;
        }
        return result;
    }
    function getLabelParams(layout, item: Item) {
        const page = item.doc.pages[0];
        if (page.imagePath) {
            return {};
        }
        const color = new Color(page.colors?.[0] || item.doc.extra?.color || colorOnPrimary);
        const result = {
            color: isEInk ? null : color.getBrightness() < 145 ? 'white' : 'black'
        };
        switch (layout) {
            case 'cardholder':
                Object.assign(result, {
                    verticalTextAlignment: 'top',
                    maxLines: 2
                });
                break;
            case 'full':
                Object.assign(result, {
                    verticalTextAlignment: 'top',
                    maxLines: 2
                });
                break;
            case 'columns':
                Object.assign(result, {
                    maxFontSize: $isLandscape ? 30 : 20,
                    verticalTextAlignment: 'center',
                    textAlignment: 'center'
                });
                break;
            case 'list':
                Object.assign(result, {
                    verticalTextAlignment: 'center',
                    textAlignment: 'center'
                });
                break;
        }
        return result;
    }

    async function showImages(item: Item) {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        const doc = item.doc;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: doc.pages.map((page, index) => ({
                    sharedTransitionTag: `document_${doc.id}_${page.id}`,
                    name: doc.name,
                    image: page.imagePath,
                    ...page
                })),
                startPageIndex: 0
            }
        });
        collectionView?.nativeElement.closeCurrentMenu();
    }

    function onItemTouch(item: Item, event) {
        if (layout !== 'cardholder') {
            return;
        }
        if (__ANDROID__) {
            // const index = documents.findIndex((d) => d.doc.id === item.doc.id);
            switch (event.action) {
                case 'down':
                    (event.object as View).animate({
                        duration: 100,
                        translate: {
                            x: 0,
                            y: -40
                        }
                    });
                    break;

                case 'up':
                case 'cancel':
                    (event.object as View).animate({
                        duration: 100,
                        translate: {
                            x: 0,
                            y: 0
                        }
                    });
                    break;
            }
        }
    }

    function itemHasImage(item: Item) {
        return !!item.doc.pages[0].imagePath;
    }
</script>

<swipemenu
    id="swipeMenu"
    height={getRowHeight(layout, item)}
    openAnimationDuration={100}
    rightSwipeDistance={0}
    startingSide={item.startingSide}
    translationFunction={fullCardDrawerTranslationFunction}
    width="100%"
    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
    <gridlayout class="cardItemTemplate" prop:mainContent {...getItemHolderParams(layout, item)} on:touch={(e) => onItemTouch(item, e)} on:tap on:longPress>
        <RotableImageView {...getItemRotableImageParams(item)} />
        <label
            autoFontSize={true}
            fontSize={40}
            fontWeight="bold"
            lineBreak="end"
            margin={16}
            maxFontSize={40}
            text={item.doc.name}
            visibility={itemHasImage(item) ? 'hidden' : 'visible'}
            {...getLabelParams(layout, item)} />
        <!-- <gridlayout borderRadius={12}> -->
        <SelectedIndicator selected={item.selected} />
        <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
        <!-- </gridlayout> -->
    </gridlayout>
    <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />
</swipemenu>
