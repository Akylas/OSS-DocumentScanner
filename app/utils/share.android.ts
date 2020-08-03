import { android as androidApp } from '@nativescript/core/application';
import { Device } from '@nativescript/core/platform';
import { ImageSource } from '@nativescript/core';

export async function share(
    content: {
        image?: ImageSource;
        title?: string;
        message?: string;
        url?: string;
    },
    options: {
        dialogTitle?: string;
        excludedActivityTypes?: string[];
        tintColor?: string;
        subject?: string;
        appearance?: 'light' | 'dark';
    } = {}
) {
    if (content == null) {
        throw new Error('missing_content');
    }
    try {
        const Intent = android.content.Intent;
        const currentActivity = androidApp.foregroundActivity || (androidApp.startActivity as android.app.Activity);

        const intent = new Intent(Intent.ACTION_SEND);
        if (content.image) {
            console.log('SHRING IMAGe');
            intent.setTypeAndNormalize('image/jpeg');

            const stream = new java.io.ByteArrayOutputStream();
            content.image.android.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);

            const imageFileName = `sharedimage_${Date.now()}.jpg`;
            const newFile = new java.io.File(currentActivity.getExternalFilesDir(null), imageFileName);

            const fos = new java.io.FileOutputStream(newFile);
            fos.write(stream.toByteArray());

            fos.flush();
            fos.close();
            let shareableFileUri;
            const sdkVersionInt = parseInt(Device.sdkVersion, 10);
            if (sdkVersionInt >= 21) {
                shareableFileUri = global.androidx.core.content.FileProvider.getUriForFile(currentActivity, androidApp.nativeApp.getPackageName() + '.provider', newFile);
            } else {
                shareableFileUri = android.net.Uri.fromFile(newFile);
            }
            intent.putExtra(android.content.Intent.EXTRA_STREAM, shareableFileUri);
        } else {
            intent.setTypeAndNormalize('text/plain');

            if (content.title) {
                intent.putExtra(Intent.EXTRA_SUBJECT, content.title);
            }

            if (content.message) {
                intent.putExtra(Intent.EXTRA_TEXT, content.message);
            }
        }

        const chooser = Intent.createChooser(intent, options.dialogTitle);
        chooser.addCategory(Intent.CATEGORY_DEFAULT);
        chooser.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        if (currentActivity !== null) {
            currentActivity.startActivity(chooser);
        } else {
            androidApp.context.startActivity(chooser);
        }
        return true;
    } catch (err) {
        console.error('error sharing', err);
    }
}
