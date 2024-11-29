import { Color, IOSHelper, View } from '@nativescript/core';
import { showSnack } from './index.common';
import { Dayjs } from 'dayjs';
import { lc } from '@nativescript-community/l';
import { DateTimePicker } from '@nativescript/datetimepicker';
import { lang } from '~/helpers/locale';

export * from './index.common';

export function showToast(text: string) {
    showSnack({ message: text });
}

export function showToolTip(tooltip: string, view?: View) {
    showSnack({ message: tooltip });
}
export function checkIfCaonBackButtonnGoBack(view: View, callback) {
    // Android only for now
    callback();
}

export function onAndroidNewItent() {}

@NativeClass
class UIPopoverPresentationControllerDelegateImpl extends NSObject implements UIPopoverPresentationControllerDelegate {
    static ObjCProtocols = [UIPopoverPresentationControllerDelegate];
    private _options: any;

    static initWithOptions(options) {
        const delegate = new UIPopoverPresentationControllerDelegateImpl();
        delegate._options = options;
        return delegate;
    }

    adaptivePresentationStyleForPresentationControllerTraitCollection(controller: UIPresentationController, traitCollection): UIModalPresentationStyle {
        return UIModalPresentationStyle.None;
    }

    popoverPresentationControllerDidDismissPopover(popoverPresentationController: UIPopoverPresentationController): void {
        if (this._options.onDismiss) {
            this._options.onDismiss();
        }
    }

    popoverPresentationControllerShouldDismissPopover(popoverPresentationController: UIPopoverPresentationController): any {
        return this._options?.outsideTouchable;
    }
}

@NativeClass
class ColorPickerImpl extends NSObject {
    onDone;
    public static initWithOnDone(onDone): ColorPickerImpl {
        const handler = ColorPickerImpl.new() as ColorPickerImpl;
        handler.onDone = onDone;
        return handler;
    }

    public dismissViewController(sender: any): void {
        if (this.onDone) {
            this.onDone(sender);
        }
    }

    public static ObjCExposedMethods = {
        dismissViewController: { returns: interop.types.void, params: [] }
    };
}

export async function pickColor(color: Color | string, { alpha, anchor }: { alpha?: boolean; anchor?: View } = {}) {
    return new Promise<Color>((resolve, reject) => {
        try {
            //@ts-ignore
            const colorSelectionController: UIViewController = new MSColorSelectionViewController(null);
            if (color) {
                if (!(color instanceof Color)) {
                    color = new Color(color as any);
                }
                colorSelectionController['color'] = color.ios;
            }

            const controller = UINavigationController.alloc().initWithRootViewController(colorSelectionController);
            controller.modalPresentationStyle = UIModalPresentationStyle.Popover;
            controller.popoverPresentationController.sourceView = anchor.nativeViewProtected;
            controller.popoverPresentationController.sourceRect = anchor.nativeViewProtected.bounds;
            controller.preferredContentSize = colorSelectionController.view.systemLayoutSizeFittingSize(UILayoutFittingCompressedSize);

            const delegate = (NSObject as any)
                .extend(
                    {
                        colorViewControllerDidChangeColor(colorViewCntroller, color) {
                            const components = CGColorGetComponents(color.CGColor);
                            const red = Math.round(components[0] * 255);
                            const green = Math.round(components[1] * 255);
                            const blue = Math.round(components[2] * 255);
                            const alpha = Math.round(components[3] * 255);
                            this.color = new Color(alpha, red, green, blue);
                        },
                        popoverPresentationControllerDidDismissPopover() {
                            _onDismiss();
                        }
                    },
                    {
                        //@ts-ignore
                        protocols: [MSColorSelectionViewControllerDelegate]
                    }
                )
                .alloc()
                .init();
            delegate.color = color;
            colorSelectionController['delegate'] = delegate;

            function _onDismiss() {
                //@ts-ignore
                const color = delegate.color;
                controller.popoverPresentationController.delegate = null;
                resolve(color);
            }
            if (!controller.popoverPresentationController.delegate) {
                controller.popoverPresentationController.delegate = UIPopoverPresentationControllerDelegateImpl.initWithOptions({
                    outsideTouchable: true,
                    onDismiss: _onDismiss
                });
            }
            let parentWithController = IOSHelper.getParentWithViewController(anchor);
            if (!parentWithController) {
                throw new Error('missing_parent_controller');
            }
            let parentController = parentWithController.viewController;
            // we loop to ensure we are showing from the top presented view controller
            while (parentController.presentedViewController) {
                parentController = parentController.presentedViewController;
                parentWithController = parentWithController['_modal'] || parentWithController;
            }
            parentWithController.viewController.presentModalViewControllerAnimated(controller, true);
        } catch (err) {
            reject(err);
        }
    });
}

export async function pickDate(currentDate: Dayjs, context?) {
    const result = await DateTimePicker.pickDate({
        context,
        date: currentDate.toDate(),
        // minDate: currentDate.subtract(100, 'y').toDate(),
        // maxDate: currentTime.add(100, 'y').toDate(),
        locale: lang,
        okButtonText: lc('ok'),
        cancelButtonText: lc('cancel')
    });
    if (result) {
        return result.valueOf();
    }
}
