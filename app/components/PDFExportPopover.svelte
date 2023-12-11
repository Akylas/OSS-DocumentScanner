<script context="module" lang="ts">
    import { OCRDocument } from '~/models/OCRDocument';
    import PopoverBackgroundView from './PopoverBackgroundView.svelte';
    import { ApplicationSettings, path } from '@nativescript/core';
    import ListItem from './ListItem.svelte';
    import { l, lc } from '~/helpers/locale';
    import { pickFolder } from '@nativescript-community/ui-document-picker';
    import { showError } from '~/utils/error';
    import { documentsService } from '~/services/documents';
    import { hideLoading, showLoading } from '~/utils/ui';
    import { openFile } from '@nativescript/core/utils';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { closePopover } from '@nativescript-community/ui-popover/svelte';
    import { DismissReasons, SnackBarAction, showSnack } from '@nativescript-community/ui-material-snackbar';
</script>

<script lang="ts">
    export let document: OCRDocument;
    let exportDirectory = ApplicationSettings.getString('pdf_export_directory', android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());

    async function pickExportFolder() {
        try {
            const result = await pickFolder({
                multipleSelection: false,
                permissions: { write: true, persistable: true }
            });
            if (result.folders.length) {
                exportDirectory = result.folders[0];
                ApplicationSettings.setString('pdf_export_directory',exportDirectory);
            }
        } catch (error) {
            showError(error);
        }
    }

    async function openPDF() {
        try {
            closePopover();
            showLoading(l('exporting'));
            const file = await documentsService.exportPDF(document);
            hideLoading();
            openFile(file.path);
        } catch (error) {
            showError(error);
        }
    }
    async function exportPDF() {
        try {
            closePopover();
            const result = await prompt({
                okButtonText: lc('ok'),
                cancelButtonText: lc('cancel'),
                defaultText: Date.now() + '.pdf',
                hintText: lc('pdf_filename')
            });
            if (result?.text?.length) {
                showLoading(l('exporting'));
                DEV_LOG && console.log('exportPDF', exportDirectory, result.text);
                await documentsService.exportPDF(document, exportDirectory, result.text);
                hideLoading();
                const filePath = path.join(exportDirectory, result.text);
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
</script>

<PopoverBackgroundView rows="auto,auto,auto,auto">
    <textfield variant="outline" hint={lc('export_folder')} placeholder={lc('export_folder')} text={exportDirectory} on:tap={pickExportFolder} />
    <!-- <ListItem height={58} subtitle={exportDirectory} title={lc('export_folder')} on:tap={pickExportFolder} /> -->
    <mdbutton row={1} text={lc('open')} on:tap={openPDF} />
    <mdbutton row={2} text={lc('export')} on:tap={exportPDF} />
</PopoverBackgroundView>
