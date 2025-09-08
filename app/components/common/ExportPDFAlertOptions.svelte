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

    $: DEV_LOG && console.log('jpegQuality', jpegQuality);

    function onFolderSelect(e) {
        folder = e.text;
    }
</script>

<gesturerootview padding="10 0 10 0">
    <scrollview>
        <stacklayout>
            <label class={'sectionBigHeader'} margin={10} text={lc('export_settings')} />
            <FolderTextView text={folder} on:folder={onFolderSelect} />
            <textfield
                autocapitalizationType="none"
                autocorrect={false}
                hint={lc('pdf_filename')}
                margin="5 10 5 10"
                placeholder={lc('filename')}
                returnKeyType="next"
                text={filename}
                variant="outline"
                on:textChange={(e) => (filename = e['value'])} />
            <SettingsSlider margin="5 10 5 10" max={100} min={0} onChange={(value) => (jpegQuality = value)} step={1} title={lc('jpeg_quality')} value={jpegQuality} />
            <textfield
                autocapitalizationType="none"
                autocorrect={false}
                hint={lc('optional_pdf_password')}
                margin="5 10 5 10"
                placeholder={lc('password')}
                placeholderColor="gray"
                returnKeyType="done"
                secure={true}
                text={password}
                variant="outline"
                on:textChange={(e) => (password = e['value'])} />
        </stacklayout>
    </scrollview>
</gesturerootview>
