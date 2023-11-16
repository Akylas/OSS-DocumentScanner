<script lang="ts">
    import ThirdPartySoftwareBottomSheet from './ThirdPartySoftwareBottomSheet.svelte';
    import { share } from '~/utils/share';
    import { l } from '~/helpers/locale';
    import { openLink } from '~/utils/ui';
    import CActionBar from './CActionBar.svelte';
    import SettingLabelIcon from './SettingLabelIcon.svelte';
    import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { openUrl } from '@nativescript/core/utils';

    const appVersion = __APP_VERSION__ + '.' + __APP_BUILD_NUMBER__;

    function onTap(command) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
                return;
            }
            case 'github':
                openLink(GIT_URL);
                break;
            case 'share':
                share({
                    message: STORE_LINK
                });
                break;
            case 'review':
                openUrl(STORE_REVIEW_LINK);
                break;
            case 'third_party':
                showBottomSheet({
                    parent: this,
                    view: ThirdPartySoftwareBottomSheet,
                    ignoreTopSafeArea: true,
                    trackingScrollView: 'trackingScrollView'
                });
                break;
        }
    }
</script>

<!-- <frame backgroundColor="transparent"> -->
<page actionBarHidden={true}>
    <gridlayout rows="auto,*">
        <CActionBar canGoBack modalWindow title={l('about')} />
        <scrollView row={1}>
            <stacklayout>
                <SettingLabelIcon subtitle={appVersion} title={l('version')} />
                <SettingLabelIcon rightIcon="mdi-chevron-right" title={l('share_application')} on:tap={() => onTap('share')} />
                <SettingLabelIcon rightIcon="mdi-chevron-right" subtitle="obtenir le code source de l'application sur Github" title={l('source_code')} on:tap={() => onTap('github')} />
                <SettingLabelIcon rightIcon="mdi-chevron-right" subtitle="les logiciels que nous aimons et utilisons" title={l('third_parties')} on:tap={() => onTap('third_party')} />
                <SettingLabelIcon rightIcon="mdi-chevron-right" title={l('share_application')} on:tap={() => onTap('share')} />
                <SettingLabelIcon rightIcon="mdi-chevron-right" title={l('review_application')} on:tap={() => onTap('review')} />
            </stacklayout>
        </scrollView>
    </gridlayout>
</page>
<!-- </frame> -->
