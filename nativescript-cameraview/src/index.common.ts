import { View } from '@nativescript/core/ui/core/view';
import { Image } from '@nativescript/core/ui/image';
import { CssProperty, Property } from '@nativescript/core/ui/core/properties';
import { booleanConverter } from '@nativescript/core/ui/core/view-base';

export class CameraViewBase extends View {
    static FRAME_EVENT = 'frame';
    flashMode = 'off';
}
export const flashModeProperty = new Property<CameraViewBase, string | number>({
    name: 'flashMode',
    defaultValue: 'off'
});
export const enablePinchZoomProperty = new Property<CameraViewBase,boolean>({
    name: 'enablePinchZoom',
    defaultValue: false,
    valueConverter: booleanConverter
});
export const autoFocusProperty = new Property<CameraViewBase,boolean>({
    name: 'autoFocus',
    defaultValue: false,
    valueConverter: booleanConverter
});
export const saveToGalleryProperty = new Property<CameraViewBase,boolean>({
    name: 'saveToGallery',
    defaultValue: false,
    valueConverter: booleanConverter
});
flashModeProperty.register(CameraViewBase);
autoFocusProperty.register(CameraViewBase);
enablePinchZoomProperty.register(CameraViewBase);
saveToGalleryProperty.register(CameraViewBase);
