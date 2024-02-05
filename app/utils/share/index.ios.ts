import { Application, Color } from '@nativescript/core';
import { Content, Options } from '.';

export async function share(content: Content, options: Options = {}) {
    if (content == null) {
        throw new Error('missing_content');
    }

    return new Promise((resolve, reject) => {
        const items = [];
        if (content.url) {
            const url = NSURL.URLWithString(content.url);
            if (url.scheme.toLowerCase() === 'data') {
                const data = NSData.dataWithContentsOfURLOptionsError(url, 0 as any);
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
        if (content.images) {
            content.images.forEach((image) => items.push(image.ios));
        }
        if (content.file) {
            items.push(content.file);
        }
        if (content.files) {
            content.files.forEach((file) => items.push(file));
        }
        const shareController = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(items, null);
        if (options.subject) {
            shareController.setValueForKey(options.subject, 'subject');
        }
        if (options.excludedActivityTypes) {
            shareController.excludedActivityTypes = NSArray.arrayWithArray(options.excludedActivityTypes);
        }
        const presentingController = Application.ios.rootController;
        shareController.completionWithItemsHandler = (activityType, completed, error) => {
            if (error) {
                reject(error);
            } else if (completed || activityType == null) {
                resolve(true);
            }
        };

        shareController.modalPresentationStyle = UIModalPresentationStyle.Popover;

        const appearance = options.appearance || Application.ios.systemAppearance;
        if (appearance === 'dark') {
            shareController.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
        } else if (appearance === 'light') {
            shareController.overrideUserInterfaceStyle = UIUserInterfaceStyle.Light;
        }

        let sourceView = presentingController.view;

        if (options.anchor) {
            sourceView = options.anchor.nativeViewProtected;
        } else if (shareController.popoverPresentationController) {
            shareController.popoverPresentationController.permittedArrowDirections = 0 as any;
        }
        if (shareController.popoverPresentationController) {
            shareController.popoverPresentationController.sourceView = sourceView;
            shareController.popoverPresentationController.sourceRect = sourceView.bounds;
        }
        if (options.tintColor) {
            const color = options.tintColor instanceof Color ? options.tintColor : new Color(options.tintColor);
            shareController.view.tintColor = color.ios;
        }
        presentingController.presentViewControllerAnimatedCompletion(shareController, true, null);
    });
}
