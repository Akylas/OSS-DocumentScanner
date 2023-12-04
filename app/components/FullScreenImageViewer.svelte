<script lang="ts">
    import { Img } from '@nativescript-community/ui-image';
    import { Pager } from '@nativescript-community/ui-pager';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/CActionBar.svelte';
    import RotableImageView from '~/components/RotableImageView.svelte';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { colors } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary } = $colors);

    export let startPageIndex: number = 0;
    export let backgroundColor = 'black';
    export let images: { image; subtitle?; sharedTransitionTag?; colorMatrix?; margin? }[];
    let pager: NativeViewElementNode<Pager>;

    let currentIndex = startPageIndex;
    const firstItem = images[currentIndex];

    function onSelectedIndex(event) {
        currentIndex = event.object.selectedIndex;
        const item = images[currentIndex];
    }
    // function onFirstLayout(item, e) {
    //     console.log('onFirstLayout');
    //     if (item.rotation % 180 === 90) {
    //         const currentWidth = layout.toDeviceIndependentPixels(e.object.getMeasuredWidth());
    //         const currentHeight = layout.toDeviceIndependentPixels(e.object.getMeasuredHeight());
    //         const delta = item.rotation % 180 === 0 ? 0 : (currentWidth - currentHeight) / 2;
    //         Object.assign(e.object, {
    //             translateX: delta,
    //             translateY: -delta,
    //             width: currentHeight,
    //             height: currentWidth
    //         });
    //     }
    // }

    // $: {
    //     colorType = document.pages[currentIndex].colorType || 0;
    // }
    // async function setColorType(type: number) {
    //     colorType = type;
    //     try {
    //         await document.updatePage(currentIndex, {
    //             colorType: type
    //             // colorMatrix: getColorMatrix(type)
    //         });
    //         // pages.setItem(currentIndex, current);
    //     } catch (err) {
    //         showError(err);
    //     }
    // }

    function getCurrentImageView() {
        return pager?.nativeView?.getChildView(currentIndex)?.getViewById<Img>('imageView');
    }

    async function shareItem(item) {
        try {
            await share({ file: await item.getImagePath() });
        } catch (error) {
            showError(error);
        }
    }
</script>

<page actionBarHidden={true} {backgroundColor} statusBarStyle="light">
    <gridlayout rows="auto,*">
        <pager bind:this={pager} items={images} row={1} selectedIndex={startPageIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <gridlayout width="100%">
                    <RotableImageView id="imageView" {item} margin={item.margin} sharedTransitionTag={item.sharedTransitionTag} zoomable={true} />
                </gridlayout>
            </Template>
        </pager>

        <CActionBar backgroundColor="transparent" titleProps={{ autoFontSize: true, padding: 0 }}></CActionBar>
    </gridlayout>
</page>
