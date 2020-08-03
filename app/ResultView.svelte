<script lang="ts">
    import { openUrl } from '@nativescript/core/utils/utils';
    import ThirdPartySoftwareBottomSheet from './ThirdPartySoftwareBottomSheet.svelte';
    import { share } from '~/utils/share';
    import { mdiFontFamily, primaryColor } from '~/variables';
    import * as EInfo from 'nativescript-extendedinfo';
    import { l } from '~/helpers/locale';
    import { openLink } from '~/utils/ui';
    import CActionBar from './CActionBar.svelte';
    import SettingLabelIcon from './SettingLabelIcon.svelte';
    import { showBottomSheet } from '~/bottomsheet';

    const appVersion = EInfo.getVersionNameSync() + '.' + EInfo.getBuildNumberSync();

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
                    message: STORE_LINK,
                });
                break;
            case 'review':
                openUrl(STORE_REVIEW_LINK);
                break;
            case 'third_party':
                showBottomSheet({
                    parent:this,
                    view:ThirdPartySoftwareBottomSheet,
                    ignoreTopSafeArea: true,
                    trackingScrollView: 'trackingScrollView',
                });
                break;
        }
    }
</script>

<frame backgroundColor="transparent">
    <page actionBarHidden="true">
        <gridlayout rows="auto,*">
            <CActionBar canGoBack modalWindow title={l('about')}/>
            <scrollView row="1">
                <stackLayout>
                <SettingLabelIcon title={l('version')} subtitle={appVersion} />
                <SettingLabelIcon title={l('share_application')} icon="mdi-chevron-right" on:tap={()=>onTap('share')} />
                <SettingLabelIcon title={l('source_code')} subtitle="obtenir le code source de l'application sur Github" icon="mdi-chevron-right" on:tap={()=>onTap('github')} />
                <SettingLabelIcon title={l('third_parties')} subtitle="les logiciels que nous aimons et utilisons" icon="mdi-chevron-right" on:tap={()=>onTap('third_party')} />
                <SettingLabelIcon title={l('share_application')} icon="mdi-chevron-right" on:tap={()=>onTap('share')} />
                <SettingLabelIcon title={l('review_application')} icon="mdi-chevron-right" on:tap={()=>onTap('review')} />
                </stackLayout>
            </scrollView>
        </gridlayout>
    </page>
</frame>
