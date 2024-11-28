<script lang="ts">
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from './CActionBar.svelte';
    import { TextField } from '@nativescript-community/ui-material-textfield';
    import { DocFolder, OCRDocument } from '~/models/OCRDocument';
    import { shortcutService } from '~/services/shortcuts';
    import { showError } from '@shared/utils/showError';
    import { colors } from '~/variables';

    export let document: OCRDocument = null;
    export let folder: DocFolder = null;
    export let editingTitle = false;
    export let labelsDefaultVisualState = null;
    export let buttonsDefaultVisualState = null;
    export let onSave = null;
    export let onGoBack = null;
    export let autoFocus = true;
    let editingTitleTextField: NativeViewElementNode<TextField>;

    async function saveDocumentTitle(event) {
        try {
            if (onSave) {
                onSave(editingTitleTextField.nativeElement.text);
            } else {
                editingTitleTextField.nativeElement.clearFocus();
                await (document || folder).save(
                    {
                        name: editingTitleTextField.nativeElement.text
                    },
                    true,
                    true
                );
                if (CARD_APP && document) {
                    shortcutService.updateShortcuts(document);
                }
            }
            editingTitle = false;
        } catch (error) {
            showError(error);
        }
    }
    async function onTextFieldFocus(event) {
        try {
            if (!autoFocus) {
                return;
            }
            const textField = event.object as TextField;
            textField.setSelection(textField.text.length);
            textField.requestFocus();
        } catch (error) {
            showError(error);
        }
    }

    function onInnerGoBack() {
        onGoBack?.();
        editingTitle = false;
    }
</script>

<CActionBar {buttonsDefaultVisualState} {labelsDefaultVisualState} modalWindow={true} onGoBack={onInnerGoBack} orceCanGoBack={true} title={null} {...$$restProps}>
    <textfield
        bind:this={editingTitleTextField}
        slot="center"
        backgroundColor="transparent"
        col={1}
        defaultVisualState={labelsDefaultVisualState}
        android:padding="4 0 4 0"
        text={(document || folder).name}
        verticalTextAlignment="center"
        on:returnPress={saveDocumentTitle}
        on:layoutChanged={onTextFieldFocus} />
    <mdbutton class="actionBarButton" defaultVisualState={buttonsDefaultVisualState} text="mdi-content-save" variant="text" on:tap={saveDocumentTitle} />
    <slot />
</CActionBar>
