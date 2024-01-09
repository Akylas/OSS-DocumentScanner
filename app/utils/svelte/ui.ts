import { Observable } from '@nativescript/core';
import { onDestroy } from 'svelte';
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
