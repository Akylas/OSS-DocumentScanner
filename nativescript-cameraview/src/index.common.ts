import { View } from '@nativescript/core/ui/core/view';
import { Image } from '@nativescript/core/ui/image';
import { CssProperty, Property } from '@nativescript/core/ui/core/properties';
import { booleanConverter } from '@nativescript/core/ui/core/view-base';

export class CameraViewBase extends View {
    static FRAME_EVENT = 'frame';
    torch = 'off';
}
export const torchProperty = new Property<CameraViewBase, string>({
    name: 'torch',
    defaultValue: 'off'
});
torchProperty.register(CameraViewBase);
