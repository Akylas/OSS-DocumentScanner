declare module 'svelte/internal' {
    export function get_current_component();
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-qualifier
declare namespace svelteNative.JSX {
    type Override<What, With> = Omit<What, keyof With> & With;
    type TViewAugmentedAttributes = Override<
        TViewAttributes,
        {
            disableCss?: boolean;
            rippleColor?: string;
            sharedTransitionTag?: string;
            verticalAlignment?: string;
            dynamicElevationOffset?: string | number;
            elevation?: string | number;
            'on:closingModally'?: (args: ShownModallyData) => void;
            // "on:shownModally"?: (args: ShownModallyData) => void;
        }
    >;

    type TButtonAugmentedAttributes = Override<
        TButtonAttributes,
        {
            variant?: string;
            shape?: string;
        }
    >;
    type TImageAugmentedAttributes = Override<
        TImageAttributes,
        {
            noCache?: boolean;
            imageRotation?: number;
            colorMatrix?: number[];
            blurRadius?: number;
            fadeDuration?: number;
            contextOptions?: any;
            'on:rotateAnimated'?: (args: EventData) => void;
        }
    >;
    type TLabelAugmentedAttributes = Override<
        TLabelAttributes,
        {
            autoFontSize?: boolean;
            verticalTextAlignment?: string;
            maxLines?: number;
            minFontSize?: number;
            maxFontSize?: number;
            lineBreak?: string;
            html?: string;
            selectable?: boolean;
            'ios:selectable'?: boolean;
            onlinkTap?;
            'on:linkTap'?;
        }
    >;
    interface SpanAttributes {
        verticalAlignment?: string;
        verticalTextAlignment?: string;
    }
    interface SliderAttributes {
        stepSize?: number;
        trackBackgroundColor?: string;
    }
    interface PageAttributes {
        statusBarColor?: string;
        screenOrientation?: string;
        keepScreenAwake?: boolean;
        screenBrightness?: number;
    }
    type ViewAttributes = TViewAugmentedAttributes & {
        [K in keyof TViewAugmentedAttributes as `ios:${K}`]: TViewAugmentedAttributes[k];
    } & {
        [K in keyof TViewAugmentedAttributes as `android:${K}`]: TViewAugmentedAttributes[k];
    };
    type ButtonAttributes = TButtonAugmentedAttributes & {
        [K in keyof TButtonAugmentedAttributes as `ios:${K}`]: TButtonAugmentedAttributes[k];
    } & {
        [K in keyof TButtonAugmentedAttributes as `android:${K}`]: TButtonAugmentedAttributes[k];
    };
    type ImageAttributes = TImageAugmentedAttributes & {
        [K in keyof TImageAugmentedAttributes as `ios:${K}`]: TImageAugmentedAttributes[k];
    } & {
        [K in keyof TImageAugmentedAttributes as `android:${K}`]: TImageAugmentedAttributes[k];
    };
    type LabelAttributes = TLabelAugmentedAttributes & {
        [K in keyof TLabelAugmentedAttributes as `ios:${K}`]: TLabelAugmentedAttributes[k];
    } & {
        [K in keyof TLabelAugmentedAttributes as `android:${K}`]: TLabelAugmentedAttributes[k];
    };
}
