<script lang="ts">
    import { Template } from 'svelte-native/components';
    import { openLink } from '~/utils/ui';
    import { primaryColor } from '~/variables';

    const licences = require('~/licenses.json');

    const items = licences.dependencies;

    function onTap(item) {
        if (item.moduleUrl) {
            openLink(item.moduleUrl);
        }
    }
</script>

<collectionView id="trackingScrollView" class="bottomsheet" height="300" itemIdGenerator={(item, i) => i} {items} rowHeight="60">
    <Template let:item>
        <stacklayout padding="0 16 0 16" rippleColor={primaryColor} verticalAlignment="middle" on:tap={() => onTap(item)}>
            <label fontSize={17} maxLines={1} text={item.moduleName} verticalAlignment="top" />
            <label color="#aaaaaa" fontSize={14} text={item.moduleUrl} verticalAlignment="bottom" />
        </stacklayout>
    </Template>
</collectionView>
