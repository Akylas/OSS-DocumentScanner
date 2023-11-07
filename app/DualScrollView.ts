import { ScrollView, Utils } from '@nativescript/core';

export class DualScrollView extends ScrollView {
    createNativeView() {
        if (__ANDROID__) {
            //@ts-ignore
            return new com.akylas.documentscanner.DualScrollView(this._context);
        }
        return super.createNativeView();
    }

    //@ts-ignore
    get scrollableWidth(): number {
        const nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return 0;
        }

        return nativeView.getScrollableLength() / Utils.layout.getDisplayDensity();
    }

    //@ts-ignore
    get scrollableHeight(): number {
        const nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return 0;
        }

        return nativeView.getScrollableLength() / Utils.layout.getDisplayDensity();
    }
}
