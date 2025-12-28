import { View } from '@nativescript/core';
import { writable, get } from 'svelte/store';

export interface TransitionConfig {
    duration?: number;
    delay?: number;
    easing?: string;
}

export interface SlideVerticalConfig extends TransitionConfig {
    distance?: number;
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
        const { subscribe, set } = writable(initialValue);
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
    async slideVertical(
        node: any,
        params: SlideVerticalConfig = {},
        entering: boolean = true
    ): Promise<void> {
        const {
            duration = 300,
            delay = 0,
            distance = 100
        } = params;

        if (!node?.nativeView) {
            return;
        }

        const view = node.nativeView as View;
        this.isAnimating = true;

        try {
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
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
    async fade(
        node: any,
        params: TransitionConfig = {},
        entering: boolean = true
    ): Promise<void> {
        const {
            duration = 300,
            delay = 0
        } = params;

        if (!node?.nativeView) {
            return;
        }

        const view = node.nativeView as View;
        this.isAnimating = true;

        try {
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
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
}

/**
 * Action to handle enter/exit animations with proper timing
 * Usage: <div use:animateVisibility={{ visible: $showState, config: { duration: 300 } }}>
 */
export function animateVisibility(
    node: any,
    params: {
        visible: boolean;
        type?: 'slideVertical' | 'fade';
        config?: SlideVerticalConfig | TransitionConfig;
        onAnimationStart?: () => void;
        onAnimationEnd?: () => void;
    }
) {
    const manager = new TransitionManager();
    let lastVisible = params.visible;
    const type = params.type || 'slideVertical';
    const config = params.config || {};

    // Initial setup
    if (params.visible) {
        // Entering
        setTimeout(async () => {
            params.onAnimationStart?.();
            if (type === 'slideVertical') {
                await manager.slideVertical(node, config as SlideVerticalConfig, true);
            } else {
                await manager.fade(node, config, true);
            }
            params.onAnimationEnd?.();
        }, 0);
    } else {
        // Initially hidden
        if (node?.nativeView) {
            node.nativeView.opacity = 0;
        }
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
                if (type === 'slideVertical') {
                    await manager.slideVertical(node, config as SlideVerticalConfig, true);
                } else {
                    await manager.fade(node, config, true);
                }
                params.onAnimationEnd?.();
            } else {
                // Exiting
                params.onAnimationStart?.();
                if (type === 'slideVertical') {
                    await manager.slideVertical(node, config as SlideVerticalConfig, false);
                } else {
                    await manager.fade(node, config, false);
                }
                params.onAnimationEnd?.();
            }
        },
        destroy: async () => {
            if (lastVisible && node?.nativeView) {
                // Animate out before destroying
                params.onAnimationStart?.();
                if (type === 'slideVertical') {
                    await manager.slideVertical(node, config as SlideVerticalConfig, false);
                } else {
                    await manager.fade(node, config, false);
                }
                params.onAnimationEnd?.();
            }
        }
    };
}

/**
 * Helper to create a transition-aware writable store
 * This ensures the component waits for animation before destruction
 */
export function createTransitionStore(initialValue: boolean = false) {
    const { subscribe, set: originalSet, update } = writable(initialValue);
    let isTransitioning = false;
    let pendingValue: boolean | null = null;

    const set = async (value: boolean) => {
        if (isTransitioning) {
            pendingValue = value;
            return;
        }

        isTransitioning = true;
        originalSet(value);

        // Give time for animation
        await new Promise(resolve => setTimeout(resolve, 350)); // Slightly longer than animation
        
        isTransitioning = false;

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
            update((current) => {
                const next = fn(current);
                set(next);
                return next;
            });
        }
    };
}
