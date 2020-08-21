// import InAppBrowser from 'nativescript-inappbrowser';
import { primaryColor } from '~/variables';
import { openUrl } from '@nativescript/core/utils/utils';
import { Label } from '@nativescript-community/ui-label';
import { AlertDialog } from '@nativescript-community/ui-material-dialogs';
import { ActivityIndicator } from '@nativescript-community/ui-material-activityindicator';
import { StackLayout } from '@nativescript/core';
import { l } from 'nativescript-l';

export async function openLink(url) {
    try {
        // const available = await InAppBrowser.isAvailable();
        // if (available) {
        //     const result = await InAppBrowser.open(url, {
        //         // iOS Properties
        //         dismissButtonStyle: 'close',
        //         preferredBarTintColor: primaryColor,
        //         preferredControlTintColor: 'white',
        //         readerMode: false,
        //         animated: true,
        //         enableBarCollapsing: false,
        //         // Android Properties
        //         showTitle: true,
        //         toolbarColor: primaryColor,
        //         secondaryToolbarColor: 'white',
        //         enableUrlBarHiding: true,
        //         enableDefaultShare: true,
        //         forceCloseOnRedirection: false,
        //     });
        // } else {
        openUrl(url);
        // }
    } catch (error) {
        alert({
            title: 'Error',
            message: error.message,
            okButtonText: 'Ok',
        });
    }
}
let loadingIndicator: AlertDialog & { label?: Label };
let showLoadingStartTime: number = null;
function getLoadingIndicator() {
    if (!loadingIndicator) {
        const stack = new StackLayout();
        stack.padding = 10;
        stack.orientation = 'horizontal';
        const activityIndicator = new ActivityIndicator();
        activityIndicator.className = 'activity-indicator';
        activityIndicator.busy = true;
        stack.addChild(activityIndicator);
        const label = new Label();
        label.paddingLeft = 15;
        label.textWrap = true;
        label.verticalAlignment = 'middle';
        label.fontSize = 16;
        stack.addChild(label);
        loadingIndicator = new AlertDialog({
            view: stack,
            cancelable: false,
        });
        loadingIndicator.label = label;
    }
    return loadingIndicator;
}
export function showLoading(msg: string) {
    const loadingIndicator = getLoadingIndicator();
    // log('showLoading', msg, !!loadingIndicator);
    loadingIndicator.label.text = msg + '...';
    showLoadingStartTime = Date.now();
    loadingIndicator.show();
}
export function hideLoading() {
    const delta = showLoadingStartTime ? Date.now() - showLoadingStartTime : -1;
    if (delta >= 0 && delta < 1000) {
        setTimeout(() => hideLoading(), 1000 - delta);
        return;
    }
    // log('hideLoading', !!loadingIndicator);
    if (loadingIndicator) {
        loadingIndicator.hide();
    }
}
