<script lang="ts">
    import { VerticalPosition } from '@nativescript-community/ui-popover';
    import { Screen } from '@nativescript/core';
    import { Writable } from 'svelte/store';
    import { lc } from '~/helpers/locale';
    import { PDFExportBaseOptions } from '~/services/pdf/PDFCanvas';
    import { PDF_OPTIONS } from '~/utils/localized_constant';
    import { showError } from '~/utils/showError';
    import { createEventDispatcher } from '~/utils/svelte/ui';
    import { showPopoverMenu, showSliderPopover } from '~/utils/ui';
    const dispatch = createEventDispatcher();

    export let store: Writable<{ exportOptions: PDFExportBaseOptions }>;
    export let variant = 'filled';
    export let textFieldHeight = 'auto';
    export let textFieldPadding = '24 16 8 16'; // '10 20 10 20'

    const tMargin = '4 10 4 10';
    const tWidth = (Screen.mainScreen.widthDIPs - 41) / 2;

    async function selectPDFOption(option: string, event, valueTransformer?, fullRefresh = true) {
        try {
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(PDF_OPTIONS[option]).map((k) => ({ ...PDF_OPTIONS[option][k], id: k }));
            await showPopoverMenu({
                options,
                anchor: event.object,
                onClose: (item) => {
                    updatePDFOption(option, valueTransformer ? valueTransformer(item.id) : item.id, fullRefresh);
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    function updatePDFOption(option: string, value, fullRefresh = false) {
        try {
            clearCheckboxTimer();
            // DEV_LOG && console.log('updateOption', option, value, fullRefresh);
            $store.exportOptions[option] = value;
            // if (fullRefresh) {
            //     refresh();
            // } else {
            //     requestPagesRedraw();
            // }
            dispatch('update');
        } catch (error) {
            showError(error);
        }
    }
    async function selectSilderPDFOption(option: string, event, fullRefresh = false) {
        try {
            await showSliderPopover({
                debounceDuration: 0,
                anchor: event.object,
                vertPos: VerticalPosition.BELOW,
                value: $store.exportOptions[option],
                onChange(value) {
                    updatePDFOption(option, Math.round(value), fullRefresh);
                }
            });
        } catch (error) {
            showError(error);
        }
    }
    let checkboxTapTimer;
    function clearCheckboxTimer() {
        if (checkboxTapTimer) {
            clearTimeout(checkboxTapTimer);
            checkboxTapTimer = null;
        }
    }
    let ignoreNextOnCheckBoxChange = false;
    async function onCheckBox(event, pdfOption?: string) {
        if (ignoreNextOnCheckBoxChange || $store.exportOptions[pdfOption] === event.value) {
            return;
        }
        const value = event.value;
        clearCheckboxTimer();
        try {
            ignoreNextOnCheckBoxChange = true;
            $store.exportOptions[pdfOption] = value;
        } catch (error) {
            showError(error);
        } finally {
            ignoreNextOnCheckBoxChange = false;
        }
    }
</script>

<wraplayout>
    <textfield
        editable={false}
        height={textFieldHeight}
        hint={lc('orientation')}
        margin={tMargin}
        padding={textFieldPadding}
        text={PDF_OPTIONS['orientation'][$store.exportOptions.orientation].name}
        {variant}
        width={tWidth}
        on:tap={(e) => selectPDFOption('orientation', e)} />
    <textfield
        editable={false}
        height={textFieldHeight}
        hint={lc('paper_size')}
        margin={tMargin}
        padding={textFieldPadding}
        text={PDF_OPTIONS['paper_size'][$store.exportOptions.paper_size].name}
        {variant}
        width={tWidth}
        on:tap={(e) => selectPDFOption('paper_size', e)} />

    <textfield
        editable={false}
        height={textFieldHeight}
        hint={lc('color')}
        margin={tMargin}
        padding={textFieldPadding}
        text={PDF_OPTIONS['color'][$store.exportOptions.color].name}
        {variant}
        width={tWidth}
        on:tap={(e) => selectPDFOption('color', e)} />
    <textfield
        editable={false}
        height={textFieldHeight}
        hint={lc('items_per_page')}
        margin={tMargin}
        padding={textFieldPadding}
        text={PDF_OPTIONS['items_per_page'][$store.exportOptions.items_per_page].name}
        {variant}
        width={tWidth}
        on:tap={(e) => selectPDFOption('items_per_page', e, parseInt)} />
    <textfield
        editable={false}
        height={textFieldHeight}
        hint={lc('page_padding')}
        margin={tMargin}
        padding={textFieldPadding}
        text={$store.exportOptions.page_padding}
        {variant}
        width={tWidth}
        on:tap={(e) => selectSilderPDFOption('page_padding', e)} />
    <stacklayout orientation="horizontal" width={tWidth}>
        <checkbox
            id="checkbox"
            checked={$store.exportOptions.draw_ocr_text}
            height={textFieldHeight}
            margin={tMargin}
            verticalAlignment="center"
            on:checkedChange={(e) => updatePDFOption('draw_ocr_text', e.value)}
            ios:margin={14} />
        <label fontSize={14} text={lc('draw_ocr_text')} textWrap={true} verticalAlignment="center" on:tap={(e) => onCheckBox(e, 'draw_ocr_text')} />
    </stacklayout>
</wraplayout>
