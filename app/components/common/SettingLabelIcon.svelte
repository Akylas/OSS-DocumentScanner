<script lang="ts">
    import { colors, fonts } from '~/variables';

    // technique for only specific properties to get updated on store change
    $: ({ colorOutlineVariant, colorOnSurface, colorOnSurfaceVariant } = $colors);

    export let title: string = null;
    export let subtitle: string = null;
    export let icon: string = null;
    export let rightIcon: string = null;
    export let rightValue: Function = null;
    export let height = 70;
    export let subtitleColor = colorOnSurfaceVariant;
    export let subtitleMaxLines = 2;
</script>

<gridlayout columns="auto,*,auto" {height} rippleColor={colorOnSurface} on:tap on:longPress>
    <label fontFamily={$fonts.mdi} fontSize={36} marginLeft="-10" text={icon} verticalAlignment="middle" visibility={icon ? 'visible' : 'hidden'} width={40} />
    <stacklayout col={1} marginLeft="10" verticalAlignment="middle">
        <label fontSize={17} lineBreak="end" maxLines={1} text={title} textWrap="true" verticalTextAlignment="top" />
        <label
            color={colorOnSurfaceVariant}
            fontSize={14}
            lineBreak="end"
            maxLines={subtitleMaxLines}
            text={subtitle}
            verticalTextAlignment="top"
            visibility={subtitleColor?.length > 0 ? 'visible' : 'collapse'} />
    </stacklayout>

    <label col={2} color={colorOnSurfaceVariant} marginLeft={16} marginRight={16} text={rightValue?.()} verticalAlignment="middle" visibility={!!rightValue ? 'visible' : 'collapse'} />
    <label
        col={2}
        color={colorOutlineVariant}
        fontFamily={$fonts.mdi}
        fontSize={30}
        horizontalAlignment="right"
        marginLeft={16}
        marginRight={16}
        text={rightIcon}
        visibility={!!rightIcon ? 'visible' : 'hidden'}
        width={25} />
    <!-- <absolutelayout backgroundColor={colorOutlineVariant} col={1} colSpan={3} height={1} marginLeft={20} row={2} verticalAlignment="bottom" /> -->
</gridlayout>
