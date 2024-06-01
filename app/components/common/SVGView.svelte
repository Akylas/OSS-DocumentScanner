<script lang="ts">
    export let item;
    let svg;
    function getSVG(item) {
        return item.svg || item.getSVG(item);
    }
    $: svg = getSVG(item);
</script>

<svgview src={svg} stretch="aspectFit" {...$$restProps} />
