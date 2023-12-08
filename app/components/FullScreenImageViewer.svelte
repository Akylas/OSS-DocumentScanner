<script lang="ts">
    import { Application, OrientationChangedEventData } from '@akylas/nativescript';
    import { Img } from '@nativescript-community/ui-image';
    import { Pager } from '@nativescript-community/ui-pager';
    import { onDestroy, onMount } from 'svelte';
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
    export let statusBarStyle: any = 'dark';
    export let actionBarStyle: any = backgroundColor === 'black' ? 'black' : '';
    export let images: { image; subtitle?; sharedTransitionTag?; colorMatrix?; margin?; imageRotation? }[];
    let pager: NativeViewElementNode<Pager>;
    let imageFunctionArg = Application.orientation();

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

    function onOrientationChanged(event: OrientationChangedEventData) {
        imageFunctionArg = event.newValue;
        pager?.nativeElement.refresh();
    }

    onMount(() => {
        Application.on('orientationChanged', onOrientationChanged);
    });
    onDestroy(() => {
        Application.off('orientationChanged', onOrientationChanged);
    });
</script>

<page actionBarHidden={true} {backgroundColor} screenOrientation="all" statusBarColor={backgroundColor} {statusBarStyle}>
    <gridlayout rows="auto,*">
        <pager bind:this={pager} items={images} rowSpan={2} selectedIndex={startPageIndex} transformers="zoomOut" on:selectedIndexChange={onSelectedIndex}>
            <Template let:item>
                <gridlayout rows="*,auto" width="100%">
                    <RotableImageView id="imageView" {imageFunctionArg} {item} margin={item.margin} sharedTransitionTag={item.sharedTransitionTag} zoomable={true} />
                    <label
                        fontSize={30}
                        fontWeight="bold"
                        paddingTop={5}
                        row={1}
                        sharedTransitionTag={item.labelSharedTransitionTag}
                        text={item.subtitle}
                        textAlignment="center"
                        verticalAlignment="bottom"
                        visibility={item.subtitle ? 'visible' : 'hidden'} />
                </gridlayout>
            </Template>
        </pager>

        <CActionBar backgroundColor="transparent" buttonsDefaultVisualState={actionBarStyle} titleProps={{ autoFontSize: true, padding: 0 }} />
    </gridlayout>
</page>
