<script lang="ts">
    import { openUrl } from '@nativescript/core/utils/utils';
    import { Template } from 'svelte-native/components';
    import SettingLabelIcon from './SettingLabelIcon.svelte';
    import { openLink } from '~/utils/ui';
    let licences = require(`~/${gVars.platform}/licenses.json`);

    let items = licences.dependencies;
    function onShownInBottomSheet() {}
    function onTap(item) {
        if (item.moduleUrl) {
            openLink(item.moduleUrl);
        }
    }
</script>

<gridLayout class="bottomsheet" on:shownInBottomSheet={onShownInBottomSheet}>
    <collectionView id="trackingScrollView" {items} rowHeight="60" itemIdGenerator={(item, i) => i}>
        <Template let:item>
            <SettingLabelIcon title={item.moduleName} subtitle={item.moduleUrl} on:tap={() => onTap(item)} />
        </Template>
    </collectionView>
</gridLayout>
