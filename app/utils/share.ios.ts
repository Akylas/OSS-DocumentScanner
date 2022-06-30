import { Color, View } from '@nativescript/core';
import { ios as iosApp } from '@nativescript/core/application';
import { Content, Options } from './share';

export async function share(content: Content, options: Options = {}) {
    if (content == null) {
        throw new Error('missing_content');
    }

    return new Promise((resolve, reject) => {
        const items = [];
        if (content.url) {
            //@ts-ignore
            const url = NSURL.URLWithString(content.url);
            if (url.scheme.toLowerCase() === 'data') {
                //@ts-ignore
                const data = NSData.dataWithContentsOfURLOptionsError(url, 0);
                if (!data) {
                    throw new Error('cant_share_url');
                }
                items.push(data);
            } else {
                items.push(url);
            }
        }
        if (content.message) {
            items.push(content.message);
        }
        if (content.image) {
            items.push(content.image.ios);
        }
        //@ts-ignore
        const shareController = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(items, null);
        if (options.subject) {
            shareController.setValueForKey(options.subject, 'subject');
        }
        if (options.excludedActivityTypes) {
            //@ts-ignore
            shareController.excludedActivityTypes = NSArray.arrayWithArray(options.excludedActivityTypes);
        }
        //@ts-ignore
        const presentingController = iosApp.rootController as UIViewController;
        shareController.completionWithItemsHandler = (activityType, completed, error) => {
            if (error) {
                reject(error);
            } else if (completed || activityType == null) {
                //@ts-ignore
                resolve(kCFBooleanTrue);
            }
        };

        //@ts-ignore
        shareController.modalPresentationStyle = UIModalPresentationStyle.Popover;

        const appearance = options.appearance || iosApp.systemAppearance;
        if (appearance === 'dark') {
            //@ts-ignore
            shareController.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
        } else if (appearance === 'light') {
            //@ts-ignore
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
