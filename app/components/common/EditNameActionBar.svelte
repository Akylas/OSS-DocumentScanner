<script lang="ts">
    import { NativeViewElementNode } from 'svelte-native/dom';
    import CActionBar from './CActionBar.svelte';
    import { TextField } from '@nativescript-community/ui-material-textfield';
    import { OCRDocument } from '~/models/OCRDocument';
    import { shortcutService } from '~/services/shortcuts';
    import { showError } from '~/utils/showError';
    import { colors } from '~/variables';

    let { colorBackground } = $colors;
    $: ({ colorBackground } = $colors);

    export let document: OCRDocument;
    export let editingTitle = false;
    export let labelsDefaultVisualState = null;
    export let buttonsDefaultVisualState = null;
    let editingTitleTextField: NativeViewElementNode<TextField>;

    $: if (!editingTitle) {
    }

    async function saveDocumentTitle(event) {
        try {
            DEV_LOG && console.log('saveDocumentTitle', editingTitleTextField.nativeElement.text);
            await document.save({
                name: editingTitleTextField.nativeElement.text
            });
            if (CARD_APP) {
                shortcutService.updateShortcuts(document);
            }
            editingTitle = false;
        } catch (error) {
            showError(error);
        }
    }
    async function onTextFieldFocus(event) {
        try {
            const textField = event.object as TextField;
            textField.setSelection(textField.text.length);
            textField.requestFocus();
        } catch (error) {
            showError(error);
        }
    }
</script>

<CActionBar {buttonsDefaultVisualState} forceCanGoBack={true} {labelsDefaultVisualState} onGoBack={() => (editingTitle = false)} title={null} {...$$restProps}>
    <textfield
        bind:this={editingTitleTextField}
        slot="center"
        backgroundColor="transparent"
        col={1}
        defaultVisualState={labelsDefaultVisualState}
        android:padding="4 0 4 0"
        text={document.name}
        verticalTextAlignment="center"
        on:layoutChanged={onTextFieldFocus} />
    <mdbutton class="actionBarButton" defaultVisualState={buttonsDefaultVisualState} text="mdi-content-save" variant="text" on:tap={saveDocumentTitle} />
</CActionBar>
