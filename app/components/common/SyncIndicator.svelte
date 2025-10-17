<script context="module" lang="ts">
    import { Canvas, CanvasView, Paint } from '@nativescript-community/ui-canvas';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { syncServicesStore } from '~/services/sync';
    import { SERVICES_SYNC_COLOR, SERVICES_SYNC_MASK } from '~/services/sync/types';
    import { colors } from '~/variables';
    const paint = new Paint();
</script>

<script lang="ts">
    export let visible: boolean = false;
    export let size = 6;
    export let synced = 0;
    let canvas: NativeViewElementNode<CanvasView>;
    // technique for only specific properties to get updated on store change
    $: requestDraw(synced);
    $: requestDraw($syncServicesStore);
    function requestDraw(...args) {
        canvas?.nativeElement.redraw();
    }
    function onDraw({ canvas }: { canvas: Canvas }) {
        let deltaX = 20;
        // DEV_LOG && console.log('SyncIndicator', synced , $syncServicesStore);
        $syncServicesStore.forEach((d) => {
            const mask = SERVICES_SYNC_MASK[d.type];
            const color = d.color || SERVICES_SYNC_COLOR[d.type];
            if (synced === 1 || (synced & mask) !== 0) {
                paint.color = color;
                canvas.drawRoundRect(deltaX, size / 2, deltaX + 24, size, size / 2, size / 2, paint);
                deltaX += 30;
            }
        });
    }
</script>

<canvasview bind:this={canvas} height={size} verticalAlignment="bottom" visibility={visible ? 'visible' : 'hidden'} width="100%" {...$$restProps} on:draw={onDraw} />
