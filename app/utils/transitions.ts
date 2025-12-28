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

export type TransitionFunction = (node: any, params: any, entering: boolean) => Promise<void>;

export interface CustomTransitionConfig {
    inTransition?: TransitionFunction;
    outTransition?: TransitionFunction;
    transition?: TransitionFunction; // Single transition used for both (out is reversed)
    config?: any;
}

/**
 * Custom transition manager for NativeScript Svelte components.
 * Handles animations properly with {#if} statements.
 */
export class TransitionManager {
    private isAnimating = false;
    private shouldShow = false;

    /**
     * Creates a store that manages the visibility state with animations
     */
    createAnimatedVisibility(initialValue: boolean = false) {
        const { set, subscribe } = writable(initialValue);
        const self = this;

        return {
            subscribe,
            set: async (value: boolean) => {
                if (self.isAnimating) {
                    self.shouldShow = value;
                    return;
                }

                if (value) {
                    // Show immediately, animate will happen via onLoaded
                    set(true);
                } else {
                    // Animate out, then hide
                    set(false);
                }
            },
            toggle: async () => {
                const current = get({ subscribe });
                await self.set(!current);
            }
        };
    }

    /**
     * Slide vertical transition with fade for entering/exiting
     */
    async slideVertical(node: any, params: SlideVerticalConfig = {}, entering: boolean = true): Promise<void> {
        const { delay = 0, distance = 100, duration = 300 } = params;

        if (!node?.nativeView) {
            return;
        }

        const view = node.nativeView as View;
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
    async fade(node: any, params: TransitionConfig = {}, entering: boolean = true): Promise<void> {
        const { delay = 0, duration = 300 } = params;

        if (!node?.nativeView) {
            return;
        }

        const view = node.nativeView as View;
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
    async executeTransition(
        node: any,
        customConfig: CustomTransitionConfig,
        entering: boolean
    ): Promise<void> {
        if (!node?.nativeView) {
            return;
        }

        this.isAnimating = true;

        try {
            if (entering) {
                // Use inTransition if provided, otherwise use transition
                const transitionFn = customConfig.inTransition || customConfig.transition;
                if (transitionFn) {
                    await transitionFn(node, customConfig.config, true);
                }
            } else {
                // Use outTransition if provided, otherwise use transition (reversed)
                const transitionFn = customConfig.outTransition || customConfig.transition;
                if (transitionFn) {
                    await transitionFn(node, customConfig.config, false);
                }
            }
        } finally {
            this.isAnimating = false;
        }
    }
}

/**
 * Action to handle enter/exit animations with proper timing
 * Usage: <div use:animateVisibility={{ visible: $showState, type: 'slideVertical', config: { duration: 300 } }}>
 */
export function animateVisibility(
    node: any,
    params: {
        visible: boolean;
        type?: 'slideVertical' | 'fade' | 'custom';
        config?: SlideVerticalConfig | TransitionConfig | any;
        customTransition?: CustomTransitionConfig;
        onAnimationStart?: () => void;
        onAnimationEnd?: () => void;
    }
) {
    const manager = new TransitionManager();
    let lastVisible = params.visible;
    const type = params.type || 'slideVertical';
    const config = params.config || {};

    // Set initial state based on visibility to prevent flash
    if (node?.nativeView) {
        const view = node.nativeView as View;
        if (!params.visible) {
            // Initially hidden - set starting hidden state
            view.opacity = 0;
            if (type === 'slideVertical') {
                const distance = (config as SlideVerticalConfig).distance || 100;
                view.translateY = distance;
            }
        }
    }

    // Initial setup - animate in if visible
    if (params.visible) {
        // Delay to next frame to ensure view is loaded
        setTimeout(async () => {
            params.onAnimationStart?.();
            try {
                if (type === 'custom' && params.customTransition) {
                    await manager.executeTransition(node, params.customTransition, true);
                } else if (type === 'slideVertical') {
                    await manager.slideVertical(node, config as SlideVerticalConfig, true);
                } else if (type === 'fade') {
                    await manager.fade(node, config, true);
                }
            } finally {
                params.onAnimationEnd?.();
            }
        }, 0);
    }

    return {
        update: async (newParams: typeof params) => {
            if (newParams.visible === lastVisible) {
                return;
            }

            lastVisible = newParams.visible;

            if (newParams.visible) {
                // Entering
                params.onAnimationStart?.();
                try {
                    if (type === 'custom' && params.customTransition) {
                        await manager.executeTransition(node, params.customTransition, true);
                    } else if (type === 'slideVertical') {
                        await manager.slideVertical(node, config as SlideVerticalConfig, true);
                    } else if (type === 'fade') {
                        await manager.fade(node, config, true);
                    }
                } finally {
                    params.onAnimationEnd?.();
                }
            } else {
                // Exiting - IMPORTANT: Must wait for animation to complete
                params.onAnimationStart?.();
                try {
                    if (type === 'custom' && params.customTransition) {
                        await manager.executeTransition(node, params.customTransition, false);
                    } else if (type === 'slideVertical') {
                        await manager.slideVertical(node, config as SlideVerticalConfig, false);
                    } else if (type === 'fade') {
                        await manager.fade(node, config, false);
                    }
                } finally {
                    params.onAnimationEnd?.();
                }
            }
        },
        destroy: () => {
            // Destroy is called synchronously by Svelte, so we can't await here
            // The parent component should handle visibility change before destroying
        }
    };
}

/**
 * Helper to create a transition-aware writable store
 * This ensures the component waits for animation before destruction
 */
export function createTransitionStore(initialValue: boolean = false, animationDuration: number = 300) {
    const { set: originalSet, subscribe, update } = writable(initialValue);
    let isTransitioning = false;
    let pendingValue: boolean | null = null;

    const set = async (value: boolean) => {
        if (isTransitioning) {
            pendingValue = value;
            return;
        }

        const previousValue = get({ subscribe });

        // If going from true to false, we need to wait for animation
        if (previousValue && !value) {
            isTransitioning = true;
            // Wait for animation to complete
            await new Promise((resolve) => setTimeout(resolve, animationDuration + 50));
            originalSet(value);
            isTransitioning = false;
        } else {
            // If going from false to true, set immediately
            originalSet(value);
        }

        // Handle any pending value
        if (pendingValue !== null) {
            const next = pendingValue;
            pendingValue = null;
            await set(next);
        }
    };

    return {
        subscribe,
        set,
        update: (fn: (value: boolean) => boolean) => {
            const current = get({ subscribe });
            const next = fn(current);
            set(next);
        }
    };
}
