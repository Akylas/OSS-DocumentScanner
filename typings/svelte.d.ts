declare module 'svelte/internal' {
    export function get_current_component();
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-qualifier
declare namespace svelteNative.JSX {
    type Override<What, With> = Omit<What, keyof With> & With;
    type ViewKeys = keyof TViewAttributes;
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
    type ViewAndroidAttributes = {
        [K in keyof TViewAugmentedAttributes as `android:${K}`]: TViewAugmentedAttributes[k];
    };
    type ViewIOSAttributes = {
        [K in keyof TViewAugmentedAttributes as `ios:${K}`]: TViewAugmentedAttributes[k];
    };
    type ViewAttributes = TViewAugmentedAttributes & ViewAndroidAttributes & ViewIOSAttributes;

    interface ButtonAttributes {
        variant?: string;
        shape?: string;
    }
    interface ImageAttributes {
        noCache?: boolean;
        imageRotation?: number;
        colorMatrix?: number[];
        blurRadius?: number;
        fadeDuration?: number;
        'on:rotateAnimated'?: (args: EventData) => void;
    }
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
    interface LabelAttributes {
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
}
