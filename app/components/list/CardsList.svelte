<script context="module" lang="ts">
    import { colorTheme } from '~/helpers/theme';
    import MainList, { Item } from './MainList.svelte';
    import { Template } from 'svelte-native/components';
    import { colors, fontScale, hasCamera, screenHeightDips, screenWidthDips, windowInset } from '~/variables';
    import { LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import dayjs from 'dayjs';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { onDestroy, onMount } from 'svelte';
    import { Application, ObservableArray, OrientationChangedEventData, StackLayout, Utils, View } from '@nativescript/core';
    import { filesize } from 'filesize';
    import { createNativeAttributedString } from '@nativescript-community/text';
    import RotableImageView from '../common/RotableImageView.svelte';
    import SelectedIndicator from '../common/SelectedIndicator.svelte';
    import SyncIndicator from '../common/SyncIndicator.svelte';
    import PageIndicator from '../common/PageIndicator.svelte';
    import { throttle } from '@nativescript/core/utils';
    import { importImageFromCamera } from '~/utils/ui';
    import { showError } from '@shared/utils/showError';
    import { DocFolder } from '~/models/OCRDocument';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { l, lc } from '@nativescript-community/l';
    import { CARD_RATIO } from '~/utils/constants';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { navigate } from '@shared/utils/svelte/ui';

    const textPaint = new Paint();
    const rowMargin = 8;
</script>

<script lang="ts">
    let { colorOnBackground, colorOnPrimary, colorOnSurfaceVariant, colorSurface } = $colors;
    $: ({ colorOnBackground, colorOnPrimary, colorOnSurfaceVariant, colorSurface } = $colors);
    let fabHolder: NativeViewElementNode<StackLayout>;
    let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    let viewStyle: string;
    let syncEnabled: boolean;
    export let folder: DocFolder;
    let onItemLongPress: (item: Item, event?) => Promise<void>;
    let onItemTap: (item: Item) => Promise<void>;
    let importDocument: (importPDFs?: boolean) => Promise<void>;
    let refreshCollectionView: () => void;
    $: condensed = viewStyle === 'condensed';

    const title = l('cards');
    let orientation = Application.orientation();
    let itemWidth = (orientation === 'landscape' ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - 2 * rowMargin - $windowInset.left - $windowInset.right;
    let itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;

    let folderItems: ObservableArray<Item>;
    let documents: ObservableArray<Item>;
    function onOrientationChanged(event: OrientationChangedEventData) {
        orientation = event.newValue;
        DEV_LOG && console.log('onOrientationChanged', itemWidth, itemHeight);
        // }, 1000);
    }
    $: itemWidth = (orientation === 'landscape' ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - $windowInset.left - $windowInset.right;
    $: {
        itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;
        refreshCollectionView?.();
    }
    onMount(() => {
        Application.on('orientationChanged', onOrientationChanged);
        // refresh();
    });
    onDestroy(() => {
        Application.off('orientationChanged', onOrientationChanged);
    });
    function getItemImageHeight(viewStyle) {
        return (condensed ? 44 : 94) * $fontScale;
    }

    $: textPaint.color = colorOnBackground || 'black';
    $: textPaint.textSize = (condensed ? 11 : 14) * $fontScale;

    function onCanvasDraw(item: Item, { canvas, object }: { canvas: Canvas; object: CanvasView }) {
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const dx = 10 + getItemImageHeight(viewStyle) + 16;
        textPaint.color = colorOnSurfaceVariant;
        const { doc } = item;
        canvas.drawText(
            filesize(
                doc.pages.reduce((acc, v) => acc + v.size, 0),
                { output: 'string' }
            ),
            dx,
            h - (condensed ? 0 : 16) - 10,
            textPaint
        );
        textPaint.color = colorOnBackground;
        const topText = createNativeAttributedString({
            spans: [
                {
                    fontSize: 16 * $fontScale,
                    fontWeight: 'bold',
                    lineBreak: 'end',
                    lineHeight: 18 * $fontScale,
                    text: doc.name
                },
                {
                    color: colorOnSurfaceVariant,
                    fontSize: 14 * $fontScale,
                    lineHeight: (condensed ? 14 : 20) * $fontScale,
                    text: '\n' + dayjs(doc.createdDate).format('L LT')
                }
            ]
        });
        const staticLayout = new StaticLayout(topText, textPaint, w - dx, LayoutAlignment.ALIGN_NORMAL, 1, 0, true);
        canvas.translate(dx, (condensed ? 0 : 10) + 10);
        staticLayout.draw(canvas);
    }

    async function onStartCam(inverseUseSystemCamera = false) {
        try {
            await importImageFromCamera({ folder, inverseUseSystemCamera });
        } catch (error) {
            showError(error);
        }
    }

    async function onAddButton() {
        DEV_LOG && console.log('onAddButton');
        try {
            const OptionSelect = (await import('~/components/common/OptionSelect.svelte')).default;
            const rowHeight = 58;
            const options = (
                $hasCamera
                    ? [
                          {
                              id: 'camera',
                              name: lc('add_from_camera'),
                              icon: 'mdi-camera'
                          }
                      ]
                    : []
            )
                .concat([
                    {
                        id: 'import',
                        name: lc('import_from_file'),
                        icon: 'mdi-file-document-plus-outline'
                    }
                ])
                .concat(
                    __IOS__
                        ? [
                              {
                                  id: 'import_image',
                                  name: lc('import_from_image'),
                                  icon: 'mdi-image-plus-outline'
                              }
                          ]
                        : []
                );
            const option = await showBottomSheet({
                parent: this,
                view: OptionSelect,
                ignoreTopSafeArea: true,
                props: {
                    rowHeight,
                    height: Math.min(rowHeight * options.length, 400),
                    options
                }
            });
            DEV_LOG && console.log('on add option', option);
            if (option) {
                switch (option.id) {
                    case 'camera':
                        await importImageFromCamera({ inverseUseSystemCamera: false });
                        break;
                    case 'import':
                        await importDocument();
                        break;
                    case 'import_image':
                        await importDocument(false);
                        break;
                }
            }
        } catch (error) {
            showError(error);
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

    function getRowHeight(viewStyle, item) {
        const width = orientation === 'landscape' ? screenHeightDips : screenWidthDips;
        switch (viewStyle) {
            case 'full':
            case 'cardholder':
            case 'list':
                return itemHeight;
            case 'columns':
                return orientation === 'landscape' ? itemHeight : (width / 2) * CARD_RATIO;
        }
    }
    function getItemOverlap(viewStyle) {
        switch (viewStyle) {
            case 'full':
                return (item, position) => {
                    const foldersCount = folderItems?.length;
                    const firstIndex = foldersCount ? 1 : 0;
                    if (position <= firstIndex || (orientation === 'landscape' && position <= firstIndex + 1)) {
                        return [0, 0, 0, 0];
                    }
                    return [-0.71 * itemHeight, 0, 0, 0];
                };
            case 'cardholder':
                return (item, position) => {
                    const foldersCount = folderItems?.length;
                    const firstIndex = foldersCount ? 1 : 0;
                    if (position <= firstIndex || (orientation === 'landscape' && position <= firstIndex + 1)) {
                        return [0, 0, 0, 0];
                    }
                    return [-0.11 * itemHeight, 0, 0, 0];
                };
            default:
                return null;
        }
    }
    function itemTemplateSelector(viewStyle, item?) {
        if (item?.type) {
            return item.type;
        }
        switch (viewStyle) {
            case 'list':
            case 'columns':
                if (orientation === 'landscape') {
                    return 'columns';
                }
                return viewStyle;
            default:
                return viewStyle;
        }
    }
    function itemTemplateSpanSize(viewStyle, item: Item) {
        if (item.type !== 'folders' && (viewStyle === 'columns' || orientation === 'landscape')) {
            return 1;
        }
        return 2;
    }
    function onItemTouch(item: Item, event) {
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
    async function showImages(item: Item) {
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        const doc = item.doc;
        navigate({
            page: component,
            // transition: __ANDROID__ ? SharedTransition.custom(new PageTransition(300, undefined, 10), {}) : undefined,
            props: {
                images: doc.pages.map((page, index) => ({
                    sharedTransitionTag: `document_${doc.id}_${page.id}`,
                    name: page.name || doc.name,
                    image: page.imagePath,
                    ...page
                })),
                startPageIndex: 0
            }
        });
        collectionView?.nativeElement.closeCurrentMenu();
    }
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
    function onFullCardItemTouch(item: Item, event) {
        const index = documents.findIndex((d) => d.doc && d.doc.id === item.doc.id);
        handleTouchAction(index, event);
    }
    function handleTouchAction(index, event) {
        // console.info('handleTouchAction', index, event.action);
        // switch (event.action) {
        //     case 'move':
        //         return;
        //     case 'down':
        //         if (menuShowingIndex !== -1) {
        //             // there is going to be a close event from the opened menu let s ignore it
        //             ignoreNextClose = true;
        //         }
        //         if (menuShowingIndex === -1) {
        //             translateCards(index);
        //         } else if (menuShowingIndex < index) {
        //             hideCards(menuShowingIndex, index - 1);
        //             translateCards(index);
        //         } else if (menuShowingIndex > index) {
        //             translateCards(index, menuShowingIndex);
        //         }
        //         menuShowingIndex = index;
        //         break;
        //     case 'up':
        //     case 'cancel':
        //         if (ignoreNextClose) {
        //             ignoreNextClose = false;
        //             return;
        //         }
        //         hideCards(index);
        //         menuShowingIndex = -1;
        //         break;
        // }
    }
</script>

<MainList
    collectionViewOptions={{
        spanSize: (item) => itemTemplateSpanSize(viewStyle, item),
        swipeMenuId: 'swipeMenu',
        itemOverlap: getItemOverlap(viewStyle),
        'on:swipeMenuClose': (e) => handleTouchAction(e.index, { action: 'up' })
    }}
    defaultOrder="id ASC"
    defaultViewStyle="full"
    {itemTemplateSelector}
    {title}
    viewStyleChanged={(oldValue, newValue) => itemTemplateSelector(oldValue !== itemTemplateSelector(newValue))}
    viewStyles={{
        cardholder: { name: lc('cardholder'), icon: 'mdi-view-agenda' },
        full: { name: lc('full'), icon: 'mdi-view-split-horizontal' },
        columns: { name: lc('columns'), icon: 'mdi-view-grid' },
        list: { name: lc('list'), icon: 'mdi-view-day' }
    }}
    bind:viewStyle
    bind:onItemTap
    bind:onItemLongPress
    bind:syncEnabled
    bind:folder
    bind:importDocument
    bind:refreshCollectionView
    bind:documents
    bind:folderItems
    bind:collectionView>
    <Template key="cardholder" let:item>
        <absolutelayout height={150}>
            <swipemenu
                id="swipeMenu"
                height={getRowHeight('cardholder', item)}
                openAnimationDuration={100}
                rightSwipeDistance={0}
                startingSide={item.startingSide}
                translationFunction={fullCardDrawerTranslationFunction}
                width="100%">
                <gridlayout
                    prop:mainContent
                    backgroundColor={item.doc.pages[0].colors?.[0]}
                    borderRadius={12}
                    boxShadow="0 0 8 rgba(0, 0, 0, 0.8)"
                    margin="50 24 0 24"
                    rippleColor={colorSurface}
                    on:touch={(e) => onItemTouch(item, e)}
                    on:tap={() => onItemTap(item)}
                    on:longPress={(e) => onItemLongPress(item, e)}>
                    <RotableImageView
                        id="imageView"
                        borderRadius={12}
                        decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                        fadeDuration={100}
                        item={item.doc.pages[0]}
                        sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                        stretch="aspectFill" />
                    <gridlayout borderRadius={12}>
                        <SelectedIndicator selected={item.selected} />
                        <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
                    </gridlayout>
                </gridlayout>
                <mdbutton prop:rightDrawer class="mdi" fontSize={40} height={60} text="mdi-fullscreen" variant="text" verticalAlignment="center" width={60} on:tap={() => showImages(item)} />
            </swipemenu>
            <absolutelayout boxShadow="0 -1 8 rgba(0, 0, 0, 0.8)" height={3} top={150} width="100%" />
        </absolutelayout>
    </Template>
    <Template key="full" let:item>
        <swipemenu
            id="swipeMenu"
            height={getRowHeight('full', item)}
            openAnimationDuration={100}
            rightDrawerMode="under"
            rightSwipeDistance={0}
            startingSide={item.startingSide}
            translationFunction={fullCardDrawerTranslationFunction}
            on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
            on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
            <gridlayout
                prop:mainContent
                backgroundColor={item.doc.pages[0].colors?.[0]}
                borderRadius={12}
                boxShadow="0 0 8 rgba(0, 0, 0, 0.8)"
                margin="16 16 16 16"
                on:tap={() => onItemTap(item)}
                on:longPress={(e) => onItemLongPress(item, e)}>
                <RotableImageView
                    id="imageView"
                    borderRadius={12}
                    decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                    decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                    fadeDuration={100}
                    item={item.doc.pages[0]}
                    sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                    stretch="aspectFill" />
                <gridlayout borderRadius={12}>
                    <SelectedIndicator selected={item.selected} />
                    <SyncIndicator selected={item.doc._synced === 1} verticalAlignment="top" visible={syncEnabled} />
                </gridlayout>
            </gridlayout>

            <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
            </stacklayout>
        </swipemenu>
    </Template>
    <Template key="list" let:item>
        <swipemenu
            id="swipeMenu"
            height={getRowHeight('list', item)}
            openAnimationDuration={100}
            rightDrawerMode="under"
            rightSwipeDistance={0}
            startingSide={item.startingSide}
            translationFunction={fullCardDrawerTranslationFunction}
            on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
            on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
            <gridlayout
                prop:mainContent
                backgroundColor={item.doc.pages[0].colors?.[0]}
                borderRadius={12}
                elevation={3}
                margin={4}
                on:tap={() => onItemTap(item)}
                on:longPress={(e) => onItemLongPress(item, e)}>
                <RotableImageView
                    id="imageView"
                    borderRadius={12}
                    decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                    decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                    fadeDuration={100}
                    item={item.doc.pages[0]}
                    sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                    stretch="aspectFill" />
                <gridlayout>
                    <SelectedIndicator selected={item.selected} />
                    <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                </gridlayout>
            </gridlayout>

            <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
            </stacklayout>
        </swipemenu>
    </Template>
    <Template key="columns" let:item>
        <swipemenu
            id="swipeMenu"
            height={getRowHeight('columns', item)}
            openAnimationDuration={100}
            rightDrawerMode="under"
            rightSwipeDistance={0}
            startingSide={item.startingSide}
            translationFunction={fullCardDrawerTranslationFunction}
            on:start={(e) => onFullCardItemTouch(item, { action: 'down' })}
            on:close={(e) => onFullCardItemTouch(item, { action: 'up' })}>
            <gridlayout
                prop:mainContent
                backgroundColor={item.doc.pages[0].colors?.[0]}
                borderRadius={12}
                elevation={3}
                margin={4}
                on:tap={() => onItemTap(item)}
                on:longPress={(e) => onItemLongPress(item, e)}>
                <RotableImageView
                    id="imageView"
                    borderRadius={12}
                    decodeHeight={Utils.layout.toDevicePixels(itemWidth)}
                    decodeWidth={Utils.layout.toDevicePixels(itemWidth) * CARD_RATIO}
                    fadeDuration={100}
                    item={item.doc.pages[0]}
                    sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0].id}`}
                    stretch="aspectFill" />
                <gridlayout>
                    <SelectedIndicator selected={item.selected} />
                    <SyncIndicator selected={item.doc._synced === 1} visible={syncEnabled} />
                </gridlayout>
            </gridlayout>

            <stacklayout prop:rightDrawer height={100} orientation="horizontal" padding={20} verticalAlignment="top">
                <mdbutton class="icon-btn" color={colorOnPrimary} elevation={2} text="mdi-fullscreen" verticalAlignment="center" on:tap={() => showImages(item)} />
            </stacklayout>
        </swipemenu>
    </Template>

    <mdbutton
        bind:this={fabHolder}
        id="fab"
        slot="fab"
        class="fab"
        horizontalAlignment="right"
        iosIgnoreSafeArea={true}
        margin={`16 16 ${Math.min(60, $windowInset.bottom + 16)} 16`}
        row={2}
        text="mdi-plus"
        verticalAlignment="bottom"
        on:tap={throttle(() => onAddButton(), 500)} />
</MainList>
