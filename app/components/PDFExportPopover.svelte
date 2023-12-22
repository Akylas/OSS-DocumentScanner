<script context="module" lang="ts">
    import { pickFolder } from '@nativescript-community/ui-document-picker';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { closePopover } from '@nativescript-community/ui-popover/svelte';
    import { ApplicationSettings, knownFolders } from '@nativescript/core';
    import { openFile } from '@nativescript/core/utils';
    import { showModal } from 'svelte-native';
    import { l, lc } from '~/helpers/locale';
    import { OCRDocument } from '~/models/OCRDocument';
    import PDFExportCanvas from '~/services/pdf/PDFExportCanvas';
    import { showError } from '~/utils/error';
    import { hideLoading, showLoading } from '~/utils/ui';
    import PopoverBackgroundView from './PopoverBackgroundView.svelte';
    const isAndroid = __ANDROID__;
</script>

<script lang="ts">
    export let documents: OCRDocument[];
    let exportDirectory = ApplicationSettings.getString(
        'pdf_export_directory',
        __ANDROID__ ? android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() : knownFolders.externalDocuments().path
    );
    DEV_LOG && console.log('exportDirectory', exportDirectory);
    async function pickExportFolder() {
        DEV_LOG && console.log('pickExportFolder', exportDirectory);
        try {
            const result = await pickFolder({
                multipleSelection: false,
                permissions: { write: true, persistable: true }
            });
            if (result.folders.length) {
                exportDirectory = result.folders[0];
                ApplicationSettings.setString('pdf_export_directory', exportDirectory);
            }
        } catch (error) {
            showError(error);
        }
    }

    async function openPDF() {
        try {
            await closePopover();
            showLoading(l('exporting'));
            const exporter = new PDFExportCanvas();
            const filePath = await exporter.export(documents);

            hideLoading();
            openFile(filePath);
        } catch (error) {
            showError(error);
        }
    }
    async function exportPDF() {
        try {
            await closePopover();
            const result = await prompt({
                okButtonText: lc('ok'),
                cancelButtonText: lc('cancel'),
                defaultText: Date.now() + '.pdf',
                hintText: lc('pdf_filename')
            });
            if (result?.result && result?.text?.length) {
                showLoading(l('exporting'));
                DEV_LOG && console.log('exportPDF', exportDirectory, result.text);
                const exporter = new PDFExportCanvas();
                const filePath = await exporter.export(documents, exportDirectory, result.text);
                hideLoading();
                const onSnack = await showSnack({ message: lc('pdf_saved', filePath), actionText: lc('open') });
                DEV_LOG && console.log('onSnack', onSnack);
                if (onSnack.reason === 'action') {
                    DEV_LOG && console.log('openFile', filePath);
                    openFile(filePath);
                }
            }
        } catch (error) {
            showError(error);
        }
    }
    async function openPDFPreview() {
        try {
            await closePopover();
            const component = (await import('~/components/PDFPreview.svelte')).default;
            await showModal({
                page: component,
                animated: true,
                fullscreen: true,
                props: {
                    documents
                }
            });
        } catch (error) {
            showError(error);
        }
    }
</script>

<PopoverBackgroundView rows="auto,auto,auto,auto" width={350}>
    {#if isAndroid}
        <textfield hint={lc('export_folder')} placeholder={lc('export_folder')} text={exportDirectory} variant="outline" on:tap={pickExportFolder} />
    {/if}
    <mdbutton row={1} text={lc('open')} on:tap={openPDF} />
    <mdbutton row={2} text={lc('export')} on:tap={exportPDF} />
    <mdbutton row={3} text={lc('preview')} on:tap={openPDFPreview} />
</PopoverBackgroundView>
