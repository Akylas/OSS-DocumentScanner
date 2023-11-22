import { asSvelteTransition, easings } from 'svelte-native/transitions';
export function fade(node, { delay = 0, duration = 400, easing = easings.easeInOutQuart }) {
    const opacity = node.nativeView.opacity;
    console.log('asSvelteTransition')
    return asSvelteTransition(node, delay, duration, easing, (t) => ({
        opacity: t * opacity
    }));
}
