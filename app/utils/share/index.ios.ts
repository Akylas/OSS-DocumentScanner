import { Application, Color } from '@nativescript/core';
import { Content, Options } from '.';

@NativeClass
class ItemSource extends NSObject implements UIActivityItemSource {
    static ObjCProtocols = [UIActivityItemSource];
    data;
    placeholder;
    subject;
    metadata?: { title: string; image?; icon?; originalURL? };
    static initWithData(data, placeholder, subject, metadata) {
        const delegate = ItemSource.new() as ItemSource;
        delegate.data = data;
        delegate.placeholder = placeholder;
        delegate.subject = subject;
        delegate.metadata = metadata;
        return delegate;
    }

    // activityViewControllerDataTypeIdentifierForActivityType?(activityViewController: UIActivityViewController, activityType: string): string {
    //     throw new Error('Method not implemented.');
    // }
    activityViewControllerItemForActivityType(activityViewController: UIActivityViewController, activityType: string) {
        return this.data;
    }
    activityViewControllerLinkMetadata?(activityViewController: UIActivityViewController) {
        if (this.metadata) {
            const metadata = LPLinkMetadata.new();
            metadata.title = this.metadata.title;
            if (this.metadata.image) {
                metadata.imageProvider = NSItemProvider.alloc().initWithObject(this.metadata.image);
                metadata.iconProvider = metadata.imageProvider;
            }
            if (this.metadata.icon) {
                metadata.iconProvider = NSItemProvider.alloc().initWithObject(this.metadata.icon);
            }
            if (this.metadata.originalURL) {
                metadata.originalURL = NSURL.alloc().initWithString(this.metadata.originalURL);
            }
            return metadata;
        }
        return null;
    }
    activityViewControllerPlaceholderItem(activityViewController: UIActivityViewController) {
        return this.placeholder;
    }
    activityViewControllerSubjectForActivityType?(activityViewController: UIActivityViewController, activityType: string): string {
        return this.subject;
    }
    // activityViewControllerThumbnailImageForActivityTypeSuggestedSize?(activityViewController: UIActivityViewController, activityType: string, size: any): UIImage {
    // }
}

export async function share(content: Content, options: Options = {}) {
    if (content == null) {
        throw new Error('missing_content');
    }

    return new Promise((resolve, reject) => {
        let metadata;
        if (content.title) {
            metadata = { title: content.title };
        }
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
            items.push(NSURL.fileURLWithPath(content.file));
        }
        if (content.files) {
            content.files.forEach((file) => items.push(NSURL.fileURLWithPath(file)));
        }
        const shareController = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(items, null);
        // should we use UIActivityItemSource?
        // const shareController = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities(
        //     items.map((i) => ItemSource.initWithData(i, i, options.subject, metadata)),
        //     null
        // );
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
