<script lang="ts">
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { TextField } from '@nativescript-community/ui-material-textfield';
    import { ObservableArray } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from '~/components/common/CActionBar.svelte';
    import { lc } from '~/helpers/locale';
    import { FORMATS, getQRCodeSVG } from '~/services/qrcode';
    import { colors, windowInset } from '~/variables';
    import SvgView from '../common/SVGView.svelte';
    import { closeModal } from '~/utils/svelte/ui';

    function getFallbackString(format) {
        switch (format) {
            case FORMATS.AZTEC:
                return 'AZTEC';
            case FORMATS.DATA_MATRIX:
                return 'DATA_MATRIX';
            case FORMATS.PDF_417:
                return 'PDF_417';
            case FORMATS.QR_CODE:
                return 'QR_CODE';
            case FORMATS.CODABAR:
                return 'C0C';
            case FORMATS.CODE_39:
                return 'CODE-39';
            case FORMATS.CODE_93:
                return 'CODE-93';
            case FORMATS.CODE_128:
                return 'CODE-128';
            case FORMATS.EAN_8:
                return '32123456';
            case FORMATS.EAN_13:
                return '5901234123457';
            case FORMATS.ITF:
                return '1003';
            case FORMATS.UPC_A:
                return '123456789012';
            case FORMATS.UPC_E:
                return '0123456';
            // case FORMATS.DXFILMEDGE:
            //     return '0123456';
            case FORMATS.DATABAR:
                return '12345678901231';
            case FORMATS.DATABAREXPANDED:
                return '[01]98898765432106[3202]012345[15]991231';
            default:
                return format;
        }
    }

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorOnBackground } = $colors);

    let collectionview: NativeViewElementNode<CollectionView>;
    let textField: NativeViewElementNode<TextField>;
    let text = null;
    let items: ObservableArray<any>;
    updateItems();

    function updateItems() {
        items = new ObservableArray(
            Object.values(FORMATS).map((format) => ({
                format,
                text,
                async getSVG(item) {
                    try {
                        const result = await getQRCodeSVG({ ...item, text: text || '' }, 200, 'black', {
                            fallbackText: getFallbackString(format),
                            fallbackColor: '#aaaaaa'
                        });
                        return result;
                    } catch (error) {
                        console.error(item.format, item.text, error);
                        return null;
                    }
                }
            }))
        );
    }

    function onTextChange(event) {
        text = event.value;
        updateItems();
        // collectionview?.nativeView.refreshVisibleItems();
    }
    function focus() {
        setTimeout(() => {
            textField?.nativeView?.requestFocus();
        }, 200);
    }

    async function selectItem(item) {
        try {
            if (text){
                const  result = await getQRCodeSVG({ format: item.format, text }, 200, 'black');
                if (result?.length) {
                    closeModal({ format: item.format, text });
                }
            }
            
        } catch (error) {
        }
    }
</script>

<page id="fullscreenImage" actionBarHidden={true}>
    <gridlayout rows="auto,auto,*" android:paddingBottom={$windowInset.bottom}>
        <textfield bind:this={textField} hint={lc('barcode')} marginBottom={10} returnKeyType="search" row={1} {text} on:textChange={onTextChange} on:loaded={focus} />
        <collectionview bind:this={collectionview} {items} row={2} rowHeight={150}>
            <Template let:item>
                <gridlayout rows="*,auto" on:tap={() => selectItem(item)}>
                    <SvgView backgroundColor="white" {item} rippleColor={colorPrimary} stretch="aspectFit" />
                    <label fontSize={24} fontWeight="bold" maxLines={2} paddingBottom={15} row={1} text={item.format} textAlignment="center" verticalAlignment="bottom" />
                </gridlayout>
            </Template>
        </collectionview>

        <CActionBar modalWindow={true} title={lc('create_barcode')} />
    </gridlayout>
</page>
