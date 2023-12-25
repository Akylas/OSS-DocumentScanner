<script context="module" lang="ts">
    import { pickFolder } from '@nativescript-community/ui-document-picker';
    import { prompt } from '@nativescript-community/ui-material-dialogs';
    import { showSnack } from '@nativescript-community/ui-material-snackbar';
    import { closePopover } from '@nativescript-community/ui-popover/svelte';
    import { ApplicationSettings, File, ImageSource, Utils, knownFolders, path } from '@nativescript/core';
    import { l, lc } from '~/helpers/locale';
    import { IMG_COMPRESS, IMG_FORMAT, OCRPage } from '~/models/OCRDocument';
    import { showError } from '~/utils/error';
    import { share } from '~/utils/share';
    import { hideLoading, showLoading } from '~/utils/ui';
    import PopoverBackgroundView from './PopoverBackgroundView.svelte';
    import { getTransformedImage } from '~/services/pdf/PDFExportCanvas.common';
    import { recycleImages } from '~/utils/utils.common';
    const isAndroid = __ANDROID__;
</script>

<script lang="ts">
    export let pages: OCRPage[];
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
            await closePopover();
            const sortedPages = pages.sort((a, b) => a.createdDate - b.createdDate);
            const imagePaths = sortedPages.map((page) => page.getImagePath());
            const canSetName = imagePaths.length === 1;
            let outputImageNames = [];
            if (canSetName) {
                const result = await prompt({
                    okButtonText: lc('ok'),
                    cancelButtonText: lc('cancel'),
                    defaultText: Date.now() + '',
                    hintText: lc('image_filename')
                });
                if (!result?.result || !result?.text?.length) {
                    return;
                }
                outputImageNames.push(result.text);
            } else {
                outputImageNames = sortedPages.map((page) => page.createdDate);
                // find duplicates and rename if any
                let lastName;
                let renameDelta = 1;
                for (let index = 0; index < outputImageNames.length; index++) {
                    const name = outputImageNames[index];
                    if (name === lastName) {
                        outputImageNames[index] = name + '_' + (renameDelta++ + '').padStart(2, '0');
                        // we dont reset lastName so that we compare to the first one found
                    } else {
                        lastName = name;
                        renameDelta = 1;
                    }
                }
            }
            DEV_LOG && console.log('outputImageNames', outputImageNames);
            showLoading(l('exporting'));
            // const destinationPaths = [];
            let finalMessagePart;
            await Promise.all(
                sortedPages.map(
                    (page, index) =>
                        new Promise<void>(async (resolve, reject) => {
                            let imageSource: ImageSource;
                            try {
                                const destinationName = outputImageNames[index] + '.' + IMG_FORMAT;
                                // const imageSource = await ImageSource.fromFile(imagePath);
                                imageSource = await getTransformedImage(page);
                                if (__ANDROID__ && exportDirectory.startsWith('content://')) {
                                    const context = Utils.android.getApplicationContext();
                                    const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(exportDirectory));
                                    const outfile = outdocument.createFile('image/jpeg', destinationName);
                                    if (!finalMessagePart) {
                                        if (canSetName) {
                                            finalMessagePart = com.nativescript.documentpicker.FilePath.getPath(context, outfile.getUri());
                                        } else {
                                            finalMessagePart = com.nativescript.documentpicker.FilePath.getPath(context, outdocument.getUri());
                                        }
                                    }
                                    const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
                                    (imageSource.android as android.graphics.Bitmap).compress(android.graphics.Bitmap.CompressFormat.JPEG, IMG_COMPRESS, stream);
                                    // destinationPaths.push(outfile.getUri().toString());
                                } else {
                                    const destinationPath = path.join(exportDirectory, destinationName);
                                    await imageSource.saveToFileAsync(destinationPath, IMG_FORMAT, IMG_COMPRESS);
                                    // destinationPaths.push(destinationPath);
                                    if (!finalMessagePart) {
                                        if (canSetName) {
                                            finalMessagePart = destinationPath;
                                        } else {
                                            finalMessagePart = exportDirectory;
                                        }
                                    }
                                }
                                resolve();
                            } catch (error) {
                                reject(error);
                            } finally {
                                recycleImages(imageSource);
                            }
                        })
                )
            );
            if (outputImageNames.length === 1) {
                await showSnack({ message: lc('image_saved', finalMessagePart) });
            } else {
                await showSnack({ message: lc('images_saved', finalMessagePart) });
            }
        } catch (error) {
            showError(error);
        } finally {
            hideLoading();
        }
    }
    async function shareImage() {
        const images = [];
        const files = [];
        try {
            for (let index = 0; index < pages.length; index++) {
                const page = pages[index];
                if (page.colorMatrix) {
                    const imageSource = await getTransformedImage(page);
                    images.push(imageSource);
                } else {
                    files.push(page.getImagePath());
                }
            }
            await share({ images, files });
        } catch (error) {
            showError(error);
        } finally {
            recycleImages(images);
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
