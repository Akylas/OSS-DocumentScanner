import { AndroidActivityResultEventData, Application, ApplicationSettings, File, Folder, ImageSource, Utils, path } from '@nativescript/core';
import { SDK_VERSION } from '@nativescript/core/utils';
import { ANDROID_CONTENT, SETTINGS_QUICK_TOGGLE_ENABLED } from './constants';

export * from './utils.common';

export async function saveImage(
    imageSource: ImageSource,
    {
        exportDirectory,
        fileName,
        imageFormat,
        imageQuality,
        overwrite = true,
        reportName,
        toGallery = false
    }: { toGallery?: boolean; imageFormat: 'png' | 'jpeg' | 'jpg'; imageQuality; fileName: string; exportDirectory: string; reportName?: boolean; overwrite?: boolean }
) {
    let destinationName = fileName;
    if (!destinationName.endsWith(imageFormat)) {
        destinationName += '.' + imageFormat;
    }
    DEV_LOG && console.info('saveImage', imageSource, toGallery, destinationName);
    if (toGallery) {
        com.akylas.documentscanner.utils.ImageUtil.Companion.saveBitmapToGallery(Utils.android.getApplicationContext(), imageSource.android, imageFormat, imageQuality, fileName);
    } else if (exportDirectory.startsWith(ANDROID_CONTENT)) {
        const context = Utils.android.getApplicationContext();
        const outdocument = androidx.documentfile.provider.DocumentFile.fromTreeUri(context, android.net.Uri.parse(exportDirectory));
        let outfile: androidx.documentfile.provider.DocumentFile;
        if (overwrite) {
            outfile = outdocument.findFile(destinationName) || outdocument.createFile('image/' + imageFormat, destinationName);
        } else {
            outfile = outdocument.createFile('image/' + imageFormat, destinationName) || outdocument.findFile(destinationName);
        }
        if (!outfile) {
            throw new Error(`error creating file "${destinationName}" in "${exportDirectory}"`);
        }

        const stream = Utils.android.getApplicationContext().getContentResolver().openOutputStream(outfile.getUri());
        (imageSource.android as android.graphics.Bitmap).compress(
            imageFormat === 'png' ? android.graphics.Bitmap.CompressFormat.PNG : android.graphics.Bitmap.CompressFormat.JPEG,
            imageQuality,
            stream
        );
        stream.close();
        if (reportName !== undefined) {
            if (reportName) {
                return com.nativescript.documentpicker.FilePath.getPath(context, outfile.getUri());
            } else {
                return com.nativescript.documentpicker.FilePath.getPath(context, outdocument.getUri());
            }
        }
    } else {
        const destinationPath = path.join(exportDirectory, destinationName);

        if (overwrite && File.exists(destinationPath)) {
            await File.fromPath(destinationPath).remove();
        }
        await imageSource.saveToFileAsync(destinationPath, imageFormat, imageQuality);
        // destinationPaths.push(destinationPath);
        if (reportName !== undefined) {
            if (reportName) {
                return destinationPath;
            } else {
                return exportDirectory;
            }
        }
    }
}

function _checkManagePermission() {
    return SDK_VERSION >= 30 && android.os.Environment.isExternalStorageManager();
}

let _hasManagePermission: boolean = _checkManagePermission();
export function hasManagePermission() {
    return !!_hasManagePermission;
}
export function checkManagePermission() {
    if (_hasManagePermission === undefined) {
        _hasManagePermission = _checkManagePermission();
    }
    return _hasManagePermission;
}
export async function askForManagePermission() {
    const activity = Application.android.startActivity;

    //If the draw over permission is not available open the settings screen
    //to grant the permission.
    return new Promise<boolean>((resolve, reject) => {
        const REQUEST_CODE = 6646;
        const onActivityResultHandler = (data: AndroidActivityResultEventData) => {
            if (data.requestCode === REQUEST_CODE) {
                Application.android.off(Application.android.activityResultEvent, onActivityResultHandler);
                _hasManagePermission = _checkManagePermission();
                resolve(_hasManagePermission);
            }
        };
        Application.android.on(Application.android.activityResultEvent, onActivityResultHandler);
        const intent = new android.content.Intent(android.provider.Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, android.net.Uri.parse('package:' + __APP_ID__));
        activity.startActivityForResult(intent, REQUEST_CODE);
    });
}
export async function requestManagePermission() {
    if (!PLAY_STORE_BUILD && SDK_VERSION >= 30) {
        if (checkManagePermission()) {
            return true;
        }
        return askForManagePermission();
    }
    return true;
}

export function getRealPath(src: string, force = false) {
    DEV_LOG && console.log('getRealPath', src, _hasManagePermission, force);
    if (!force && !_hasManagePermission) {
        return src;
    }
    if (!src.startsWith(ANDROID_CONTENT)) {
        return src;
    }
    return com.nativescript.documentpicker.FilePath.getPathFromString(Utils.android.getApplicationContext(), src);
}

export function updateQuickToggle() {
    const enabled = ApplicationSettings.getBoolean(SETTINGS_QUICK_TOGGLE_ENABLED, false);
    const context = Utils.android.getApplicationContext();
    const component = new android.content.ComponentName(context, '__PACKAGE__.QuickToggleService');
    DEV_LOG && console.log('updateQuickToggle', component, '__PACKAGE__.QuickToggleService', enabled);
    const pm = context.getPackageManager();

    if (enabled) {
        pm.setComponentEnabledSetting(component, android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED, android.content.pm.PackageManager.DONT_KILL_APP);

        android.service.quicksettings.TileService.requestListeningState(context, component);
    } else {
        pm.setComponentEnabledSetting(component, android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED, android.content.pm.PackageManager.DONT_KILL_APP);
    }
}

export function toggleQuickSetting(enable: boolean) {
    ApplicationSettings.setBoolean(SETTINGS_QUICK_TOGGLE_ENABLED, enable);
    updateQuickToggle();
}
