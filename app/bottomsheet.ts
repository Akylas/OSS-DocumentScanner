import { PageSpec } from 'svelte-native/dom/navigation';
import { NativeViewElementNode, createElement } from 'svelte-native/dom';
import { Frame } from '@nativescript/core/ui/frame';
import { View } from '@nativescript/core/ui/core/view';
import { ViewBase } from '@nativescript/core/ui/core/view-base';
import { BottomSheetOptions } from '@nativescript-community/ui-material-bottomsheet';

export interface ShowBottomSheetOptions extends Omit<BottomSheetOptions, 'view'> {
    view: PageSpec;
    parent: NativeViewElementNode<View>;
    props?: any;
}
interface ComponentInstanceInfo {
    element: NativeViewElementNode<View>;
    viewInstance: SvelteComponent;
}

const modalStack: ComponentInstanceInfo[] = [];

function resolveComponentElement(viewSpec: PageSpec, props?: any): ComponentInstanceInfo {
    const dummy = createElement('fragment');
    const viewInstance = new viewSpec({ target: dummy, props });
    const element = dummy.firstElement() as NativeViewElementNode<View>;
    return { element, viewInstance };
}
export function showBottomSheet<T>(modalOptions: ShowBottomSheetOptions): Promise<T> {
    const { view, parent, props = {}, ...options } = modalOptions;
    // Get this before any potential new frames are created by component below
    const modalLauncher = parent?.nativeView || Frame.topmost().currentPage;

    const componentInstanceInfo = resolveComponentElement(view, props);
    const modalView: ViewBase = componentInstanceInfo.element.nativeView;

    return new Promise((resolve, reject) => {
        let resolved = false;
        const closeCallback = (result: T) => {
            if (resolved) return;
            resolved = true;
            resolve(result);
            componentInstanceInfo.viewInstance.$destroy(); // don't let an exception in destroy kill the promise callback
        };
        modalStack.push(componentInstanceInfo);
        modalLauncher.showBottomSheet({ view: modalView, ...options, context: {}, closeCallback });
    });
}

export function closeBottomSheet(result?: any): void {
    const modalPageInstanceInfo = modalStack.pop();
    (modalPageInstanceInfo.element.nativeView as any).closeBottomSheet(result);
}
