import { Paint, Style } from '@nativescript-community/ui-canvas';
import { Color, Property, Utils, View } from '@nativescript/core';
export const colorsProperty = new Property<CropView, (Color | string)[]>({ name: 'colors' });
export const strokeWidthProperty = new Property<CropView, number>({ name: 'strokeWidth' });
export const fillAlphaProperty = new Property<CropView, number>({ name: 'fillAlpha' });
export const stretchProperty = new Property<CropView, string>({ name: 'stretch' });

export enum ScaleType {
    None = 'none',
    Fill = 'fill',
    AspectFill = 'aspectFill',
    AspectFit = 'aspectFit',
    Center = 'center',
    FitCenter = 'fitCenter',
    FitEnd = 'fitEnd',
    FitStart = 'fitStart'
}

function getScaleType(scaleType: ScaleType) {
    if (__ANDROID__) {
        if (typeof scaleType === 'string') {
            switch (scaleType) {
                case ScaleType.FitCenter:
                case ScaleType.AspectFit:
                    return androidx.camera.view.PreviewView.ScaleType.FIT_CENTER;
                case ScaleType.FitEnd:
                    return androidx.camera.view.PreviewView.ScaleType.FIT_END;
                case ScaleType.FitStart:
                    return androidx.camera.view.PreviewView.ScaleType.FIT_START;
                default:
                case ScaleType.Center:
                case ScaleType.Fill:
                case ScaleType.AspectFill:
                    return androidx.camera.view.PreviewView.ScaleType.FILL_CENTER;
            }
        }

        return androidx.camera.view.PreviewView.ScaleType.FILL_CENTER;
    } else {
        if (typeof scaleType === 'string') {
            switch (scaleType) {
                case ScaleType.FitCenter:
                case ScaleType.AspectFit:
                case ScaleType.FitEnd:
                case ScaleType.FitStart:
                    return AVLayerVideoGravityResizeAspect;
                default:
                case ScaleType.Center:
                case ScaleType.Fill:
                case ScaleType.AspectFill:
                    return AVLayerVideoGravityResizeAspectFill;
            }
        }

        return AVLayerVideoGravityResizeAspectFill;
    }
}

export class CropView extends View {
    createNativeView() {
        if (__ANDROID__) {
            return new com.akylas.documentscanner.CropView(this._context);
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
    [colorsProperty.setNative](value: (Color | string)[]) {
        if (__ANDROID__) {
            const nArray = new java.util.ArrayList();
            for (let index = 0; index < value.length; index++) {
                const color: Color = value[index] instanceof Color ? (value[index] as Color) : new Color(value[index] as string);
                nArray.add(new java.lang.Integer(color.android));
            }
            this.nativeViewProtected.colors = nArray;
        } else {
            const nArray = NSMutableArray.alloc().init();
            for (let index = 0; index < value.length; index++) {
                const color: Color = value[index] instanceof Color ? (value[index] as Color) : new Color(value[index] as string);
                nArray.addObject(color.ios);
            }
            this.nativeViewProtected.colors = nArray;
        }
    }
    [strokeWidthProperty.setNative](value: number) {
        if (__ANDROID__) {
            this.nativeViewProtected.linePaint.setStrokeWidth(value);
        } else {
            this.nativeViewProtected.strokeWidth = value;
        }
    }
    [fillAlphaProperty.setNative](value: number) {
        if (__ANDROID__) {
            const paint = this.nativeViewProtected.fillPaint ? new Paint(this.nativeViewProtected.fillPaint) : new Paint();
            paint.style = Style.FILL;
            paint.setAlpha(value);
            this.nativeViewProtected.fillPaint = paint['getNative']();
        } else {
            this.nativeViewProtected.fillAlpha = value;
        }
    }

    [stretchProperty.setNative](value) {
        if (__ANDROID__) {
            this.nativeViewProtected.setScaleType(getScaleType(value));
        } else {
            this.nativeViewProtected.videoGravity = getScaleType(value);
        }
    }
}
colorsProperty.register(CropView);
strokeWidthProperty.register(CropView);
fillAlphaProperty.register(CropView);
stretchProperty.register(CropView);
