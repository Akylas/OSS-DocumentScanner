import { View } from '@nativescript/core';
import { writable, type Readable } from 'svelte/store';

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
 * Transition action that works with {#if} blocks
 * Handles intro animation automatically
 * 
 * For outro animations, wrap your condition with withTransition():
 * const showWithTransition = withTransition(() => show, 300);
 * {#if $showWithTransition}
 *   <element use:slideVertical={{ duration: 300 }}>
 * {/if}
 */
export function transition(
    node: any,
    params: {
        type?: 'slideVertical' | 'fade' | 'custom';
        config?: SlideVerticalConfig | TransitionConfig | any;
        customTransition?: CustomTransitionConfig;
        onIntroStart?: () => void;
        onIntroEnd?: () => void;
    } = {}
) {
    const manager = new TransitionManager();
    const type = params.type || 'slideVertical';
    const config = params.config || {};

    if (!node?.nativeView) {
        return { destroy: () => {} };
    }

    const view = node.nativeView as View;

    // Set initial hidden state to prevent flash
    if (type === 'slideVertical') {
        view.opacity = 0;
        const distance = (config as SlideVerticalConfig).distance || 100;
        view.translateY = distance;
    } else if (type === 'fade') {
        view.opacity = 0;
    }

    // Run intro animation on next tick (after component is mounted)
    setTimeout(async () => {
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
    }, 0);

    return {
        destroy: () => {
            // Note: Svelte actions can't delay destruction
            // Use withTransition() wrapper for the {#if} condition to handle outro
        }
    };
}

/**
 * Wraps a reactive getter to automatically delay unmounting for transitions
 * This hooks into Svelte's reactivity system to manage component lifecycle
 * 
 * Usage (works just like Svelte transitions):
 * const showWithTransition = withTransition(() => show, 300);
 * 
 * {#if $showWithTransition}
 *   <element use:slideVertical={{ duration: 300 }}>
 * {/if}
 * 
 * The element will:
 * - Mount immediately when show becomes true
 * - Animate in via use:slideVertical
 * - Animate out when show becomes false
 * - Unmount after animation completes (300ms + buffer)
 */
export function withTransition(getter: () => boolean, duration: number = 300): Readable<boolean> {
    const delayedStore = writable(getter());
    let timeout: any = null;
    let currentValue = getter();

    // Create a reactive subscription by checking the getter regularly
    const checkInterval = setInterval(() => {
        const newValue = getter();
        if (newValue === currentValue) {
            return;
        }
        
        currentValue = newValue;

        if (newValue) {
            // Showing: update immediately
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            delayedStore.set(true);
        } else {
            // Hiding: delay the update
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                delayedStore.set(false);
                timeout = null;
            }, duration + 50);
        }
    }, 16); // Check ~60fps

    // Cleanup function
    const unsubscribe = () => {
        clearInterval(checkInterval);
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    return {
        subscribe: (run) => {
            const unsubStore = delayedStore.subscribe(run);
            return () => {
                unsubStore();
                unsubscribe();
            };
        }
    };
}

/**
 * Pre-made transition functions that work like Svelte's built-in transitions
 * 
 * Usage:
 * const showWithTransition = withTransition(() => show, 300);
 * 
 * {#if $showWithTransition}
 *   <element use:slideVertical={{ duration: 300, distance: 100 }}>
 * {/if}
 */
export function slideVertical(node: any, params: SlideVerticalConfig = {}) {
    return transition(node, { type: 'slideVertical', config: params });
}

export function fade(node: any, params: TransitionConfig = {}) {
    return transition(node, { type: 'fade', config: params });
}

/**
 * Helper to create custom transitions
 * 
 * Usage:
 * const myTransition = customTransition({
 *   inTransition: async (view, params, entering) => { ... },
 *   outTransition: async (view, params, entering) => { ... },
 *   config: { duration: 300 }
 * });
 * 
 * const showWithTransition = withTransition(() => show, 300);
 * {#if $showWithTransition}
 *   <element use:myTransition>
 * {/if}
 */
export function customTransition(config: CustomTransitionConfig) {
    return (node: any, params: any = {}) => {
        return transition(node, {
            type: 'custom',
            customTransition: config,
            config: { ...config.config, ...params }
        });
    };
}
