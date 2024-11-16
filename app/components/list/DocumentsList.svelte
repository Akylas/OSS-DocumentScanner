<script context="module" lang="ts">
    import { colorTheme } from '~/helpers/theme';
    import MainList, { Item } from './MainList.svelte';
    import { Template } from 'svelte-native/components';
    import { colors, fontScale, hasCamera, windowInset } from '~/variables';
    import { LayoutAlignment, Paint, StaticLayout } from '@nativescript-community/ui-canvas';
    import dayjs from 'dayjs';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { ObservableArray, StackLayout, Utils } from '@akylas/nativescript';
    import { filesize } from 'filesize';
    import { createNativeAttributedString } from '@nativescript-community/text';
    import RotableImageView from '../common/RotableImageView.svelte';
    import SelectedIndicator from '../common/SelectedIndicator.svelte';
    import SyncIndicator from '../common/SyncIndicator.svelte';
    import PageIndicator from '../common/PageIndicator.svelte';
    import { throttle } from '@akylas/nativescript/utils';
    import { importImageFromCamera } from '~/utils/ui';
    import { showError } from '@shared/utils/showError';
    import { DocFolder } from '~/models/OCRDocument';
    import { l, lc } from '@nativescript-community/l';
    import { CollectionView } from '@nativescript-community/ui-collectionview';

    const textPaint = new Paint();
    const IMAGE_DECODE_WIDTH = Utils.layout.toDevicePixels(200);
</script>

<script lang="ts">
    let { colorOnBackground, colorOnSurfaceVariant } = $colors;
    $: ({ colorOnBackground, colorOnSurfaceVariant } = $colors);
    export let title = l('documents');
    export let folder: DocFolder;
    let fabHolder: NativeViewElementNode<StackLayout>;
    let collectionView: NativeViewElementNode<CollectionView>;
    let viewStyle: string;
    let syncEnabled: boolean;
    let folderItems: ObservableArray<Item>;
    let documents: ObservableArray<Item>;
    let onItemLongPress: (item: Item, event?) => Promise<void>;
    let onItemTap: (item: Item) => Promise<void>;
    let importDocument: (importPDFs?: boolean) => Promise<void>;
    let refreshCollectionView: () => void;
    $: condensed = viewStyle === 'condensed';
    function getItemRowHeight(viewStyle) {
        return condensed ? 80 : 150;
    }
    function getImageMargin(viewStyle) {
        return 10;
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
</script>

<MainList
    defaultViewStyle="expanded"
    {title}
    viewStyles={{
        default: { name: lc('expanded'), boxType: 'circle', type: 'checkbox' },
        condensed: { name: lc('condensed'), boxType: 'circle', type: 'checkbox' }
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
    <Template let:item>
        <canvasview
            class="card"
            borderWidth={colorTheme === 'eink' ? 1 : 0}
            height={getItemRowHeight(viewStyle) * $fontScale}
            on:tap={() => onItemTap(item)}
            on:longPress={(e) => onItemLongPress(item, e)}
            on:draw={(e) => onCanvasDraw(item, e)}>
            <RotableImageView
                id="imageView"
                borderRadius={12}
                decodeWidth={IMAGE_DECODE_WIDTH}
                horizontalAlignment="left"
                item={item.doc.pages[0]}
                marginBottom={getImageMargin(viewStyle)}
                marginLeft={10}
                marginTop={getImageMargin(viewStyle)}
                sharedTransitionTag={`document_${item.doc.id}_${item.doc.pages[0]?.id}`}
                stretch="aspectFill"
                width={getItemImageHeight(viewStyle)} />
            <SelectedIndicator horizontalAlignment="left" margin={10} selected={item.selected} />
            <SyncIndicator synced={item.doc._synced} visible={syncEnabled} />
            <PageIndicator horizontalAlignment="right" margin={10} text={item.doc.pages.length} />
        </canvasview>
    </Template>

    <stacklayout bind:this={fabHolder} slot="fab" horizontalAlignment="right" marginBottom={Math.min(60, $windowInset.bottom + 16)} orientation="horizontal" row={1} verticalAlignment="bottom">
        {#if __IOS__}
            <mdbutton class="small-fab" horizontalAlignment="center" text="mdi-image-plus-outline" verticalAlignment="center" on:tap={throttle(() => importDocument(false), 500)} />
        {/if}
        <mdbutton
            class={$hasCamera ? 'small-fab' : 'fab'}
            horizontalAlignment="center"
            text="mdi-file-document-plus-outline"
            verticalAlignment="center"
            on:tap={throttle(() => importDocument(), 500)} />
        {#if $hasCamera}
            <mdbutton id="fab" class="fab" margin="0 16 0 16" text="mdi-camera" verticalAlignment="center" on:tap={throttle(() => onStartCam(), 500)} on:longPress={() => onStartCam(true)} />
        {/if}
    </stacklayout>
</MainList>
