import { View } from '@nativescript/core';
import { get, writable } from 'svelte/store';

export interface TransitionConfig {
    duration?: number;
    delay?: number;
    easing?: string;
}

export interface SlideVerticalConfig extends TransitionConfig {
    distance?: number;
}

export type TransitionFunction = (view: View, params: any, entering: boolean) => Promise<void>;

export interface CustomTransitionConfig {
    inTransition?: TransitionFunction;
    outTransition?: TransitionFunction;
    transition?: TransitionFunction; // Single transition used for both (out is reversed)
    config?: any;
}

/**
 * Custom transition manager for NativeScript Svelte components.
 * Complete replacement for Svelte transition system.
 */
export class TransitionManager {
    private isAnimating = false;
    private shouldDestroy = false;
    private node: any = null;
    private destroyCallback: (() => void) | null = null;

    /**
     * Slide vertical transition with fade for entering/exiting
     */
    async slideVertical(view: View, params: SlideVerticalConfig = {}, entering: boolean = true): Promise<void> {
        const { delay = 0, distance = 100, duration = 300 } = params;

        this.isAnimating = true;

        try {
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            if (entering) {
                // Enter: slide up from bottom with fade
                view.opacity = 0;
                view.translateY = distance;

                await view.animate({
                    opacity: 1,
                    translate: { x: 0, y: 0 },
                    duration
                });
            } else {
                // Exit: slide down with fade
                await view.animate({
                    opacity: 0,
                    translate: { x: 0, y: distance },
                    duration
                });
            }
        } finally {
            this.isAnimating = false;
        }
    }

    /**
     * Fade transition for entering/exiting
     */
    async fade(view: View, params: TransitionConfig = {}, entering: boolean = true): Promise<void> {
        const { delay = 0, duration = 300 } = params;

        this.isAnimating = true;

        try {
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            if (entering) {
                view.opacity = 0;
                await view.animate({
                    opacity: 1,
                    duration
                });
            } else {
                await view.animate({
                    opacity: 0,
                    duration
                });
            }
        } finally {
            this.isAnimating = false;
        }
    }

    /**
     * Execute a custom transition
     */
    async executeTransition(view: View, customConfig: CustomTransitionConfig, entering: boolean): Promise<void> {
        this.isAnimating = true;

        try {
            if (entering) {
                // Use inTransition if provided, otherwise use transition
                const transitionFn = customConfig.inTransition || customConfig.transition;
                if (transitionFn) {
                    await transitionFn(view, customConfig.config, true);
                }
            } else {
                // Use outTransition if provided, otherwise use transition (reversed)
                const transitionFn = customConfig.outTransition || customConfig.transition;
                if (transitionFn) {
                    await transitionFn(view, customConfig.config, false);
                }
            }
        } finally {
            this.isAnimating = false;
        }
    }
}

/**
 * Transition directive - manages component lifecycle with animations
 * This is a complete replacement for Svelte's transition system
 */
export function transition(
    node: any,
    params: {
        show: boolean;
        type?: 'slideVertical' | 'fade' | 'custom';
        config?: SlideVerticalConfig | TransitionConfig | any;
        customTransition?: CustomTransitionConfig;
        onIntroStart?: () => void;
        onIntroEnd?: () => void;
        onOutroStart?: () => void;
        onOutroEnd?: () => void;
    }
) {
    const manager = new TransitionManager();
    let lastShow = params.show;
    let isComponentMounted = params.show;
    let pendingDestroy = false;
    const type = params.type || 'slideVertical';
    const config = params.config || {};

    // Set initial hidden state for slideVertical to prevent flash
    if (node?.nativeView) {
        const view = node.nativeView as View;
        if (type === 'slideVertical' && !params.show) {
            view.opacity = 0;
            const distance = (config as SlideVerticalConfig).distance || 100;
            view.translateY = distance;
        } else if (type === 'fade' && !params.show) {
            view.opacity = 0;
        }
    }

    // Run intro animation if initially showing
    if (params.show && node?.nativeView) {
        setTimeout(async () => {
            params.onIntroStart?.();
            try {
                const view = node.nativeView as View;
                if (type === 'custom' && params.customTransition) {
                    await manager.executeTransition(view, params.customTransition, true);
                } else if (type === 'slideVertical') {
                    await manager.slideVertical(view, config as SlideVerticalConfig, true);
                } else if (type === 'fade') {
                    await manager.fade(view, config, true);
                }
            } finally {
                params.onIntroEnd?.();
            }
        }, 0);
    }

    return {
        update: async (newParams: typeof params) => {
            if (newParams.show === lastShow) {
                return;
            }

            lastShow = newParams.show;

            if (!node?.nativeView) {
                return;
            }

            const view = node.nativeView as View;

            if (newParams.show) {
                // Intro animation
                isComponentMounted = true;
                pendingDestroy = false;
                params.onIntroStart?.();
                try {
                    if (type === 'custom' && params.customTransition) {
                        await manager.executeTransition(view, params.customTransition, true);
                    } else if (type === 'slideVertical') {
                        await manager.slideVertical(view, config as SlideVerticalConfig, true);
                    } else if (type === 'fade') {
                        await manager.fade(view, config, true);
                    }
                } finally {
                    params.onIntroEnd?.();
                }
            } else {
                // Outro animation - run animation then hide component
                params.onOutroStart?.();
                pendingDestroy = true;
                try {
                    if (type === 'custom' && params.customTransition) {
                        await manager.executeTransition(view, params.customTransition, false);
                    } else if (type === 'slideVertical') {
                        await manager.slideVertical(view, config as SlideVerticalConfig, false);
                    } else if (type === 'fade') {
                        await manager.fade(view, config, false);
                    }
                } finally {
                    params.onOutroEnd?.();
                    // Signal that component should be unmounted
                    isComponentMounted = false;
                }
            }
        },
        destroy: () => {
            // Synchronous destroy - nothing to do here
        }
    };
}

/**
 * Creates a transition-aware store that controls component mounting/unmounting
 * Usage: const showStore = createTransitionStore(false);
 */
export function createTransitionStore(initialValue: boolean = false, transitionDuration: number = 300) {
    const mountedStore = writable(initialValue);
    const visibleStore = writable(initialValue);
    let isTransitioning = false;
    let pendingValue: boolean | null = null;

    const set = async (value: boolean) => {
        if (isTransitioning) {
            pendingValue = value;
            return;
        }

        const currentMounted = get(mountedStore);
        const currentVisible = get(visibleStore);

        if (value === currentVisible) {
            return;
        }

        isTransitioning = true;

        if (value) {
            // Showing: mount immediately, then make visible
            mountedStore.set(true);
            // Small delay to ensure component is mounted before animation
            await new Promise((resolve) => setTimeout(resolve, 10));
            visibleStore.set(true);
            isTransitioning = false;
        } else {
            // Hiding: make invisible, wait for animation, then unmount
            visibleStore.set(false);
            // Wait for animation to complete
            await new Promise((resolve) => setTimeout(resolve, transitionDuration + 50));
            mountedStore.set(false);
            isTransitioning = false;
        }

        // Handle any pending value
        if (pendingValue !== null) {
            const next = pendingValue;
            pendingValue = null;
            await set(next);
        }
    };

    return {
        mounted: { subscribe: mountedStore.subscribe },
        visible: { subscribe: visibleStore.subscribe },
        set,
        update: (fn: (value: boolean) => boolean) => {
            const current = get(visibleStore);
            const next = fn(current);
            set(next);
        }
    };
}
