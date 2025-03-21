<script context="module" lang="ts">
    import { Color, Utils, View } from '@akylas/nativescript';

    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { navigate } from '@shared/utils/svelte/ui';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { Writable } from 'svelte/store';
    import { colorTheme, isEInk } from '~/helpers/theme';
    import { CARD_RATIO } from '~/utils/constants';
    import { colors, isLandscape, screenHeightDips, screenWidthDips } from '~/variables';
    import RotableImageView from '../common/RotableImageView.svelte';
    import SelectedIndicator from '../common/SelectedIndicator.svelte';
    import SyncIndicator from '../common/SyncIndicator.svelte';
    import { Item } from './MainList.svelte';
    const rowMargin = 8;
</script>

<script lang="ts">
    let { colorOnPrimary, colorSurface } = $colors;
    $: ({ colorOnPrimary, colorSurface } = $colors);

    export let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    export let itemWidth: number;
    export let itemHeight: number;
    export let height: number;
    export let nbColumns: Writable<number>;
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

    function getItemHolderParams(layout, item: Item, nbColumns) {
        const page = item.doc.pages[0];
        const color = isEInk ? null : new Color(page.colors?.[0] || item.doc.extra?.color || colorOnPrimary);
        const result = {
            backgroundColor: color
        };
        switch (layout) {
            case 'cardholder':
                Object.assign(result, {
                    boxShadow: isEInk ? 0 : `0 0 ${8 / nbColumns} rgba(0, 0, 0, 0.8)`,
                    margin: 16 / nbColumns
                });
                break;
            case 'full':
                Object.assign(result, {
                    boxShadow: isEInk ? 0 : `0 0 ${8 / nbColumns} rgba(0, 0, 0, 0.8)`,
                    margin: 16 / nbColumns
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
    function getLabelParams(layout, item: Item, height, itemHeight) {
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
                    verticalTextAlignment: 'bottom',
                    marginBottom: height - itemHeight - 10,
                    maxFontSize: 40,
                    maxLines: 2
                });
                break;
            case 'full':
                Object.assign(result, {
                    verticalTextAlignment: 'top',
                    maxFontSize: 40,
                    maxLines: 2
                });
                break;
            case 'columns':
                Object.assign(result, {
                    verticalTextAlignment: 'center',
                    textAlignment: 'center',
                    maxFontSize: 35,
                    maxLines: 3
                });
                break;
            case 'list':
                Object.assign(result, {
                    verticalTextAlignment: 'center',
                    maxFontSize: 40,
                    textAlignment: 'center',
                    maxLines: 3
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
    {height}
    openAnimationDuration={100}
    rightSwipeDistance={0}
    startingSide={item.startingSide}
    translationFunction={fullCardDrawerTranslationFunction}
    width="100%"
    {...$$restProps}
    on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
    on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
    <gridlayout id="cardItemTemplate" class="cardItemTemplate" prop:mainContent {...getItemHolderParams(layout, item, $nbColumns)} on:tap on:longPress>
        <RotableImageView {...getItemRotableImageParams(item)} />
        <label
            autoFontSize={true}
            autoFontSizeStep={10}
            fontSize={30}
            fontWeight="bold"
            lineBreak="end"
            maxFontSize={35}
            minFontSize={20}
            padding={16}
            text={item.doc.name}
            textWrap={false}
            visibility={itemHasImage(item) ? 'hidden' : 'visible'}
            {...getLabelParams(layout, item, height, itemHeight)} />
        <!-- <gridlayout borderRadius={12}> -->
        <SelectedIndicator selected={item.selected} />
        <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
        <!-- </gridlayout> -->
    </gridlayout>
    <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />
</swipemenu>
