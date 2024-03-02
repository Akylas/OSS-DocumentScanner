import { throttle } from '@akylas/nativescript/utils/common';
import { Frame, Observable, View } from '@nativescript/core';
import { onDestroy } from 'svelte';
import { closeModal as sCloseModal, goBack as sGoBack, navigate as sNavigate, showModal as sShowModal } from 'svelte-native';
import { BackNavigationOptions, NavigationOptions, ShowModalOptions } from 'svelte-native/dom';
import { asSvelteTransition, easings } from 'svelte-native/transitions';
import { get_current_component } from 'svelte/internal';

export const globalObservable = new Observable();

const callbacks = {};
export function createGlobalEventListener(eventName: string) {
    return function (callback: Function, once = false) {
        callbacks[eventName] = callbacks[eventName] || {};
        let cleaned = false;

        function clean() {
            if (!cleaned) {
                cleaned = true;
                delete callbacks[eventName][callback];
                globalObservable.off(eventName, eventCallack);
            }
        }
        const eventCallack = (event) => {
            if (once) {
                clean();
            }
            if (Array.isArray(event.data)) {
                event.result = callback(...event.data, event);
            } else {
                event.result = callback(event.data, event);
            }
        };
        callbacks[eventName][callback] = eventCallack;
        globalObservable.on(eventName, eventCallack);

        onDestroy(() => {
            clean();
        });
        return clean;
    };
}
export function createUnregisterGlobalEventListener(eventName: string) {
    return function (callback: Function) {
        if (callbacks[eventName] && callbacks[eventName][callback]) {
            globalObservable.off(eventName, callbacks[eventName][callback]);
            delete callbacks[eventName][callback];
        }
    };
}

export function fade(node, { delay = 0, duration = 400, easing = easings.easeInOutQuart }) {
    const opacity = node.nativeView.opacity;
    return asSvelteTransition(node, delay, duration, easing, (t) => ({
        opacity: t * opacity
    }));
}

export function conditionalEvent(node, { condition, event, callback }) {
    let toRemove;
    if (condition) {
        toRemove = callback;
        node.addEventListener(event, callback);
    }

    return {
        destroy() {
            if (toRemove) {
                node.removeEventListener(event, toRemove);
            }
        }
    };
}

export function createEventDispatcher<T>() {
    const component = get_current_component();
    return (type, event?: T) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            callbacks.slice().forEach((fn) => {
                fn.call(component, event);
            });
        }
        return true;
    };
}

export function goBack(options?: BackNavigationOptions) {
    const frame = Frame.topmost();
    // this means the frame is animating
    // doing goBack would mean boing back up 2 levels because
    // the animating context is not yet in the backStack
    if (frame['_executingContext']) {
        return;
    }
    return sGoBack(options);
}
type NavigateFunc = <T>(options: NavigationOptions<T>) => SvelteComponent<T>;
const throttledSNavigate = throttle(sNavigate, 500) as NavigateFunc;
export function navigate<T>(options: NavigationOptions<T>): SvelteComponent<T> {
    return throttledSNavigate<T>(options);
}

export function closeModal(result: any, parent?: View) {
    return sCloseModal(result, parent);
}

export function showModal<T, U>(modalOptions: ShowModalOptions<U>): Promise<T> {
    return sShowModal(modalOptions);
}
