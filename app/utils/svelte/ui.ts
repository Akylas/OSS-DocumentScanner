import { asSvelteTransition, easings } from 'svelte-native/transitions';
import { get_current_component } from 'svelte/internal';
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
