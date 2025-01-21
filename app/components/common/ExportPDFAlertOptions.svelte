<svelte:options accessors />

<script context="module" lang="ts">
    import SettingsSlider from '@shared/components/SettingsSlider.svelte';
    import FolderTextView from './FolderTextView.svelte';
    import { lc } from '@nativescript-community/l';
</script>

<script lang="ts">
    export let jpegQuality;
    export let folder;
    export let password;
    export let filename;

    function onFolderSelect(e) {
        folder = e.text;
    }
</script>

<gridlayout padding={10} rows="auto,auto,auto,auto">
    <FolderTextView text={folder} on:folder={onFolderSelect} />
    <textfield
        autocapitalizationType="none"
        autocorrect={false}
        hint={lc('pdf_filename')}
        margin="5 0 5 0"
        placeholder={lc('filename')}
        returnKeyType="next"
        row={1}
        text={filename}
        variant="outline"
        on:textChange={(e) => (filename = e['value'])} />
    <SettingsSlider max={100} min={0} onChange={(e) => (jpegQuality = e.value)} row={2} step={1} title={lc('jpeg_quality')} value={jpegQuality} />
    <textfield
        autocapitalizationType="none"
        autocorrect={false}
        hint={lc('optional_pdf_password')}
        margin="5 0 5 0"
        placeholder={lc('password')}
        placeholderColor="gray"
        returnKeyType="done"
        row={3}
        secure={true}
        text={password}
        variant="outline"
        on:textChange={(e) => (password = e['value'])} />
</gridlayout>
