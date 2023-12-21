import { asSvelteTransition, easings } from 'svelte-native/transitions';
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
