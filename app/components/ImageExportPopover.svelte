<script context="module" lang="ts">
    import { IMG_COMPRESS, IMG_FORMAT, OCRDocument, OCRPage } from '~/models/OCRDocument';
    import PopoverBackgroundView from './PopoverBackgroundView.svelte';
    import { ApplicationSettings, File, ImageSource, Utils, knownFolders, path } from '@nativescript/core';
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
    import { showModal } from 'svelte-native';
    import { share } from '~/utils/share';
    const isAndroid = __ANDROID__;
</script>

<script lang="ts">
    export let page: OCRPage;
    let exportDirectory = ApplicationSettings.getString(
        'image_export_directory',
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
                ApplicationSettings.setString('image_export_directory', exportDirectory);
            }
        } catch (error) {
            showError(error);
        }
    }

    async function exportImage() {
        try {
            const imagePath = page.getImagePath();
            const file = File.fromPath(imagePath);
            await closePopover();
            const result = await prompt({
                okButtonText: lc('ok'),
                cancelButtonText: lc('cancel'),
                defaultText: Date.now() + '.jpg',
                hintText: lc('image_filename')
            });
            if (result?.result && result?.text?.length) {
                showLoading(l('exporting'));
                if (__ANDROID__ && exportDirectory.startsWith('content://')) {
                    const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(Utils.android.getApplicationContext(), android.net.Uri.parse(exportDirectory));
                    const outfile = outdocument.createFile('image/jpeg', result.text);
                    const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
                    const imageSource = await ImageSource.fromFile(imagePath);
                    (imageSource.android as android.graphics.Bitmap).compress(android.graphics.Bitmap.CompressFormat.JPEG, IMG_COMPRESS, stream);
                    hideLoading();
                    await showSnack({ message: lc('image_saved', outfile.getUri().toString()) });
                    // } else if (__ANDROID__) {
                    //     const destinationPath = path.join(exportDirectory, result.text);

                    //     const nativeFile = new java.io.File(destinationPath);
                    //     DEV_LOG && console.log('export image', nativeFile.getPath());
                    //     const stream = new java.io.FileOutputStream(nativeFile);
                    //     const imageSource = await ImageSource.fromFile(imagePath);
                    //     (imageSource.android as android.graphics.Bitmap).compress(android.graphics.Bitmap.CompressFormat.JPEG, IMG_COMPRESS, stream);
                    //     hideLoading();
                    //     await showSnack({ message: lc('image_saved', destinationPath) });
                } else {
                    const destinationPath = path.join(exportDirectory, result.text);
                    await (await ImageSource.fromFile(imagePath)).saveToFileAsync(destinationPath, IMG_FORMAT, IMG_COMPRESS);
                    hideLoading();
                    await showSnack({ message: lc('image_saved', destinationPath) });
                }
                // if (onSnack.reason === 'action') {
                //     DEV_LOG && console.log('openFile', filePath);
                //     openFile(filePath);
                // }
            }
        } catch (error) {
            hideLoading();
            showError(error);
        }
    }
    async function shareImage() {
        try {
            await share({ file: page.getImagePath() });
        } catch (error) {
            showError(error);
        }
    }
</script>

<PopoverBackgroundView rows="auto,auto,auto,auto" width={350}>
    {#if isAndroid}
        <textfield hint={lc('export_folder')} placeholder={lc('export_folder')} text={exportDirectory} variant="outline" on:tap={pickExportFolder} />
    {/if}
    <mdbutton row={1} text={lc('share')} on:tap={shareImage} />
    <mdbutton row={2} text={lc('export')} on:tap={exportImage} />
</PopoverBackgroundView>
