import { Application, Device, ImageSource, knownFolders, path } from '@nativescript/core';
import { Content, Options } from './share';

let numberOfImagesCreated = 0;
export async function share(content: Content, options: Options = {}) {
    if (content == null) {
        throw new Error('missing_content');
    }
    const Intent = android.content.Intent;

    const intent = new Intent(Intent.ACTION_SEND);
    intent.setTypeAndNormalize('text/plain');

    if (content.title) {
        intent.putExtra(Intent.EXTRA_SUBJECT, content.title);
    }

    if (content.message) {
        intent.putExtra(Intent.EXTRA_TEXT, content.message);
    }
    const currentActivity: android.app.Activity = Application.android.foregroundActivity || Application.android.startActivity;

    if (content.image) {
        intent.setTypeAndNormalize('image/jpeg');
        const imageFileName = 'share_image_' + numberOfImagesCreated++ + '.jpg';
        const dir = currentActivity.getExternalCacheDir();
        const filePath = path.join(dir.toString(), imageFileName);
        await content.image.saveToFileAsync(filePath, 'jpg');
        const sdkVersionInt = parseInt(Device.sdkVersion, 10);
        const newFile = new java.io.File(filePath);
        let shareableFileUri;
        if (sdkVersionInt >= 21) {
            shareableFileUri = androidx.core.content.FileProvider.getUriForFile(currentActivity, Application.android.nativeApp.getPackageName() + '.provider', newFile);
        } else {
            shareableFileUri = android.net.Uri.fromFile(newFile);
        }
        intent.putExtra(android.content.Intent.EXTRA_STREAM, shareableFileUri);
    }

    const chooser = Intent.createChooser(intent, options.dialogTitle);
    chooser.addCategory(Intent.CATEGORY_DEFAULT);

    if (currentActivity !== null) {
        currentActivity.startActivity(chooser);
    } else {
        Application.android.context.startActivity(chooser);
    }
    return true;
}
