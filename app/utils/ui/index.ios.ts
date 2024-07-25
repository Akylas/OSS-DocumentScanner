import { Color, IOSHelper, View } from '@nativescript/core';
import { showSnack } from './index.common';

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

export async function pickColor(color: Color | string, { alpha, anchor }: { alpha?: boolean; anchor?: View } = {}) {
    return new Promise<Color>((resolve, reject) => {
        try {
            if (!(color instanceof Color)) {
                color = new Color(color as any);
            }
            this._doneResolve = resolve;
            //@ts-ignore
            const colorSelectionController = new MSColorSelectionViewController(null);
            colorSelectionController.color = color.ios;

            const controller = UINavigationController.alloc().initWithRootViewController(colorSelectionController);
            controller.modalPresentationStyle = UIModalPresentationStyle.Popover;
            controller.popoverPresentationController.sourceView = anchor.nativeViewProtected;
            const bounds = anchor.nativeViewProtected.bounds;
            const width = bounds.size.width;
            const height = bounds.size.height;
            const deltaX = 0;
            const deltaY = 0;
            controller.popoverPresentationController.sourceRect = CGRectOffset(bounds, Math.min(deltaX, width / 2), Math.min(deltaY, height / 2));

            function _onDismiss() {
                //@ts-ignore
                const color = controller.popoverPresentationController.delegate.color;
                controller.popoverPresentationController.delegate = null;
                resolve(color);
            }
            const delegate = (NSObject as any)
                .extend(
                    {
                        colorViewControllerDidChangeColor(colorViewCntroller, color) {
                            const components = CGColorGetComponents(color.CGColor);
                            const red = Math.round(components[0] * 255);
                            const green = Math.round(components[1] * 255);
                            const blue = Math.round(components[2] * 255);
                            const alpha = Math.round(components[3] * 255);
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
            colorSelectionController.delegate = delegate;

            //   const doneBtn = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(
            //     lc('done'),
            //     UIBarButtonItemStyle.Done,
            //     this._impl,
            //     'dismissViewController'
            //   );
            //   colorSelectionController.navigationItem.rightBarButtonItem = doneBtn;
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
