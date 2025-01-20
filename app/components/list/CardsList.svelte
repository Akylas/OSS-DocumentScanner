<script context="module" lang="ts">
    import { lc } from '@nativescript-community/l';
    import { createNativeAttributedString } from '@nativescript-community/text';
    import { LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import { CollectionViewWithSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { onDestroy, onMount } from 'svelte';
    import { ApplicationSettings, ObservableArray, StackLayout } from '@nativescript/core';
    import { throttle } from '@nativescript/core/utils';
    import { showError } from '@shared/utils/showError';
    import dayjs from 'dayjs';
    import { filesize } from 'filesize';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { DocFolder, OCRDocument } from '~/models/OCRDocument';
    import { CARD_RATIO, DEFAULT_NB_COLUMNS, DEFAULT_NB_COLUMNS_LANDSCAPE, SETTINGS_NB_COLUMNS, SETTINGS_NB_COLUMNS_LANDSCAPE } from '~/utils/constants';
    import { goToDocumentAfterScan, importImageFromCamera } from '~/utils/ui';
    import { colors, fontScale, hasCamera, isLandscape, orientation, screenHeightDips, screenWidthDips, windowInset } from '~/variables';
    import MainList, { Item } from './MainList.svelte';

    const textPaint = new Paint();
    const rowMargin = 8;
</script>

<script lang="ts">
    import CardListCell from './CardListCell.svelte';

    let { colorOnBackground, colorOnPrimary, colorOnSurfaceVariant, colorSurface } = $colors;
    $: ({ colorOnBackground, colorOnPrimary, colorOnSurfaceVariant, colorSurface } = $colors);
    let fabHolder: NativeViewElementNode<StackLayout>;
    let collectionView: NativeViewElementNode<CollectionViewWithSwipeMenu>;
    let viewStyle: string;
    let nbColumns: number;
    let syncEnabled: boolean;
    export let folder: DocFolder;
    let onItemLongPress: (item: Item, event?) => Promise<void>;
    let onItemTap: (item: Item) => Promise<void>;
    let importDocument: (importPDFs?: boolean) => Promise<void>;
    let refreshCollectionView: () => void;

    $: condensed = viewStyle === 'condensed';

    const title = lc('cards');
    DEV_LOG && console.log('screenHeightDips', screenHeightDips, screenWidthDips);
    let itemWidth = ($isLandscape ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - 2 * rowMargin - $windowInset.left - $windowInset.right;
    let itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;

    let folderItems: ObservableArray<Item>;
    let documents: ObservableArray<Item>;
    $: itemWidth = ($isLandscape ? screenHeightDips / 2 : screenWidthDips) - 2 * rowMargin - $windowInset.left - $windowInset.right;
    $: {
        itemHeight = itemWidth * CARD_RATIO + 2 * rowMargin;
        DEV_LOG && console.log('refreshing collection view for orientation', orientation);
        refreshCollectionView?.();
    }
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
                )
                .concat([
                    {
                        id: 'create',
                        name: lc('create'),
                        icon: 'mdi-plus'
                    }
                ]);
            const height = Math.min(rowHeight * options.length, 400);
            const option = await showBottomSheet({
                parent: this,
                view: OptionSelect,
                ignoreTopSafeArea: true,
                peekHeight: height,
                props: {
                    rowHeight,
                    height,
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
                    case 'create':
                        const CreateCard = (await import('~/components/widgets/CreateCard.svelte')).default;
                        const result = await showBottomSheet({
                            parent: this,
                            view: CreateCard,
                            ignoreTopSafeArea: true
                        });
                        DEV_LOG && console.log('CreateCard', result);
                        if (result) {
                            const document = await OCRDocument.createDocument(
                                [
                                    {
                                        qrcode: result.code?.length
                                            ? [
                                                  {
                                                      text: result.code,
                                                      format: result.codeFormat
                                                  }
                                              ]
                                            : undefined
                                    }
                                ],
                                folder,
                                {
                                    name: result.name,
                                    ...(result.color ? { extra: { color: result.color } } : {})
                                }
                            );
                            await goToDocumentAfterScan(document, -1, true);
                        }
                        break;
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    function getItemOverlap(viewStyle) {
        switch (viewStyle) {
            case 'full':
                return (item, position) => {
                    const foldersCount = folderItems?.length;
                    const firstIndex = foldersCount ? 1 : 0;
                    if (position <= firstIndex || ($isLandscape && position <= firstIndex + 1)) {
                        return [0, 0, 0, 0];
                    }
                    return [-0.71 * itemHeight, 0, 0, 0];
                };
            case 'cardholder':
                return (item, position) => {
                    const foldersCount = folderItems?.length;
                    const firstIndex = foldersCount ? 1 : 0;
                    if (position <= firstIndex || ($isLandscape && position <= firstIndex + 1)) {
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
                if ($isLandscape) {
                    return 'columns';
                }
                return viewStyle;
            default:
                return viewStyle;
        }
    }
    function itemTemplateSpanSize(viewStyle, item: Item) {
        if (item.type !== 'folders' && (viewStyle === 'columns' || $isLandscape)) {
            return 1;
        }
        return 1;
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
    function updateColumns(isLandscape) {
        nbColumns = isLandscape
            ? ApplicationSettings.getNumber(SETTINGS_NB_COLUMNS_LANDSCAPE, DEFAULT_NB_COLUMNS_LANDSCAPE)
            : ApplicationSettings.getNumber(SETTINGS_NB_COLUMNS, viewStyle === 'columns' ? 2 : DEFAULT_NB_COLUMNS);
        DEV_LOG && console.log('updateColumns cards list', isLandscape, viewStyle, nbColumns);
    }
    onMount(() => {
        DEV_LOG && console.log('CardsList', 'onMount', viewStyle);
        updateColumns($isLandscape);
    });
</script>

<MainList
    collectionViewOptions={{
        // spanSize: (item) => itemTemplateSpanSize(viewStyle, item),
        swipeMenuId: 'swipeMenu',
        itemOverlap: getItemOverlap(viewStyle),
        'on:swipeMenuClose': (e) => handleTouchAction(e.index, { action: 'up' })
    }}
    {itemTemplateSelector}
    {title}
    {updateColumns}
    viewStyleChanged={(oldValue, newValue) => itemTemplateSelector(oldValue !== itemTemplateSelector(newValue))}
    viewStyles={{
        cardholder: { name: lc('cardholder'), icon: 'mdi-view-agenda' },
        full: { name: lc('full'), icon: 'mdi-view-split-horizontal' },
        columns: { name: lc('columns'), icon: 'mdi-view-grid' },
        list: { name: lc('list'), icon: 'mdi-view-day' }
    }}
    bind:nbColumns
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
            <CardListCell
                {collectionView}
                {item}
                {itemHeight}
                {itemWidth}
                layout="cardholder"
                {onFullCardItemTouch}
                {syncEnabled}
                on:tap={() => onItemTap(item)}
                on:longPress={(e) => onItemLongPress(item, e)} />
            <absolutelayout boxShadow="0 -1 8 rgba(0, 0, 0, 0.8)" height={3} top={150} width="100%" />
        </absolutelayout>
    </Template>
    <Template key="full" let:item>
        <CardListCell
            {collectionView}
            {item}
            {itemHeight}
            {itemWidth}
            layout="full"
            {onFullCardItemTouch}
            {syncEnabled}
            on:tap={() => onItemTap(item)}
            on:longPress={(e) => onItemLongPress(item, e)} />
    </Template>
    <Template key="list" let:item>
        <CardListCell
            {collectionView}
            {item}
            {itemHeight}
            {itemWidth}
            layout="list"
            {onFullCardItemTouch}
            {syncEnabled}
            on:tap={() => onItemTap(item)}
            on:longPress={(e) => onItemLongPress(item, e)} />
    </Template>
    <Template key="columns" let:item>
        <CardListCell
            {collectionView}
            {item}
            {itemHeight}
            {itemWidth}
            layout="columns"
            {onFullCardItemTouch}
            {syncEnabled}
            on:tap={() => onItemTap(item)}
            on:longPress={(e) => onItemLongPress(item, e)} />
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
