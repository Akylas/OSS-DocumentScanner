import { Matrix, Paint, Style } from '@nativescript-community/ui-canvas';
import { AbsoluteLayout, Color, Property, Utils, View } from '@nativescript/core';
export const matrixProperty = new Property<AbsoluteLayoutWithMatrix, Matrix>({ name: 'matrix' });

export class AbsoluteLayoutWithMatrix extends AbsoluteLayout {
    createNativeView() {
        if (__ANDROID__) {
            const view = new com.akylas.documentscanner.AbsoluteLayoutWithMatrix(this._context);
            view.setStaticTransformationsEnabled(true);
            return view;
        } else if (__IOS__) {
            return NSCropView.alloc().init();
        }
        return null;
    }
    set quads(value) {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.quads = null;
            if (__ANDROID__) {
                (nativeView as android.view.View).invalidate();
            } else {
                (nativeView as UIView).setNeedsDisplay();
            }
        }
    }
    [matrixProperty.setNative](value: Matrix) {
        if (__ANDROID__) {
            const nativeView = this.nativeViewProtected as com.akylas.documentscanner.AbsoluteLayoutWithMatrix;
            nativeView.setChildrenMatrix(value as any);
            for (let index = 0; index < nativeView.getChildCount(); index++) {
                nativeView.getChildAt(index).invalidate();
            }
        } else {
        }
    }
}
matrixProperty.register(AbsoluteLayoutWithMatrix);
