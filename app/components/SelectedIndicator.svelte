<script lang="ts">
    import { primaryColor } from '~/variables';
    export let selected: boolean = false;
</script>

<label
    class="mdi"
    backgroundColor={primaryColor}
    borderRadius={10}
    color="white"
    fontSize={16}
    height={20}
    horizontalAlignment="right"
    margin={10}
    rowSpan={2}
    text="mdi-check"
    textAlignment="center"
    verticalAlignment="top"
    verticalTextAlignment="center"
    visibility={selected ? 'visible' : 'hidden'}
    width={20}
    {...$$restProps}
/>
