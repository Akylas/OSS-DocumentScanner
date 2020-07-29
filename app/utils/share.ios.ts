import { ios as iosApp } from '@nativescript/core/application';
import { View } from '@nativescript/core/ui/core/view';
import { Color } from '@nativescript/core/color';

export async function share(
    content: {
        title?: string;
        message?: string;
        url?: string;
    },
    options: {
        dialogTitle?: string;
        excludedActivityTypes?: string[];
        tintColor?: string | Color;
        subject?: string;
        anchor?: View;
        appearance?: 'light' | 'dark';
    } = {}
) {
    if (content == null) {
        throw new Error('missing_content');
    }

    return new Promise((resolve, reject) => {
        const items = [];
        if (content.message) {
            items.push(content.message);
        }
        if (content.url) {
            const url = NSURL.URLWithString(content.url);
            if (url.scheme.toLowerCase() === 'data') {
                const data = NSData.dataWithContentsOfURLOptionsError(url, 0);
                if (!data) {
                    throw new Error('cant_share_url');
                }
                items.push(data);
            } else {
                items.push(url);
            }
            items.push(content.message);
        }
        const shareController = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(items, null);
        if (options.subject) {
            shareController.setValueForKey(options.subject, 'subject');
        }
        if (options.excludedActivityTypes) {
            shareController.excludedActivityTypes = NSArray.arrayWithArray(options.excludedActivityTypes);
        }
        const presentingController = iosApp.rootController as UIViewController;
        shareController.completionWithItemsHandler = (activityType, completed, error) => {
            if (error) {
                reject(error);
            } else if (completed || activityType == null) {
                resolve(kCFBooleanTrue);
            }
        };

        shareController.modalPresentationStyle = UIModalPresentationStyle.Popover;

        const appearance = options.appearance || iosApp.systemAppearance;
        if (appearance === 'dark') {
            shareController.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
        } else if (appearance === 'light') {
            shareController.overrideUserInterfaceStyle = UIUserInterfaceStyle.Light;
        }

        let sourceView = presentingController.view;

        if (options.anchor) {
            sourceView = options.anchor.nativeViewProtected;
        } else {
            shareController.popoverPresentationController.permittedArrowDirections = 0;
        }
        shareController.popoverPresentationController.sourceView = sourceView;
        shareController.popoverPresentationController.sourceRect = sourceView.bounds;
        if (options.tintColor) {
            const color = options.tintColor instanceof Color ? options.tintColor : new Color(options.tintColor);
            shareController.view.tintColor = color.ios;
        }
        presentingController.presentViewControllerAnimatedCompletion(shareController, true, null);
    });
}
