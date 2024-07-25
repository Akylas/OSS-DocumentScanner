<script lang="ts">
    import { View } from '@nativescript/core';
    import { CollectionView } from '@nativescript-community/ui-collectionview';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { HorizontalPosition, VerticalPosition } from '@nativescript-community/ui-popover';
    import { showPopover } from '@nativescript-community/ui-popover/svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { lc } from '~/helpers/locale';
    import { showError } from '~/utils/showError';
    import { colors, fonts } from '~/variables';
    import { ocrService } from '~/services/ocr';

    // technique for only specific properties to get updated on store change
    $: ({ colorPrimary, colorOnSurface, colorOnPrimary, colorOutline, colorSurfaceContainer } = $colors);

    let collectionView: NativeViewElementNode<CollectionView>;
    let downloaded = ocrService.downloadedLanguages;
    let languages = ocrService.languagesArray;
    let dataType = ocrService.dataType;
    async function addLanguages(event) {
        try {
            const SearchModal = (await import('~/components/ocr/SelectOCRLanguaguesModal.svelte')).default;
            // const result: any = await showModal({ page: Settings, fullscreen: true, props: { position } });
            const anchorView = event.object as View;
            const result: any = await showPopover({
                backgroundColor: colorSurfaceContainer,
                vertPos: VerticalPosition.ALIGN_BOTTOM,
                horizPos: HorizontalPosition.ALIGN_RIGHT,
                view: SearchModal,
                anchor: anchorView,
                props: {
                    selectedLanguages: languages
                }
            });
            if (result) {
                ocrService.addLanguages(result);
                languages.push(result);
                languages = languages;
            }
        } catch (error) {
            showError(error);
        }
    }

    async function removeLanguage(key: string) {
        try {
            ocrService.removeLanguages(key);
            languages.splice(languages.indexOf(key), 1);
            languages = languages;
        } catch (error) {
            showError(error);
        }
    }
    const qualities = ocrService.qualities;

    async function setDataType(value) {
        dataType = value;
        ocrService.dataType = dataType;
        downloaded = ocrService.downloadedLanguages;
        languages = languages;
    }

    function startOCR() {
        closeBottomSheet(true);
    }
</script>

<gesturerootview id="ocrSettingsBottomSheet" rows="auto">
    <stacklayout padding={16} rows="auto,auto">
        <label color={colorPrimary} fontSize={20} fontWeight="bold" marginBottom={16} text={lc('quality')} />
        <stacklayout orientation="horizontal">
            {#each qualities as quality}
                <gridlayout
                    backgroundColor={dataType === quality ? colorPrimary : undefined}
                    borderColor={colorOutline}
                    borderRadius={8}
                    borderWidth={dataType === quality ? 0 : 1}
                    columns="auto,auto"
                    height={32}
                    margin={4}
                    paddingLeft={dataType === quality ? 8 : 12}
                    paddingRight={12}
                    rippleColor={colorPrimary}
                    on:tap={() => setDataType(quality)}>
                    <label
                        color={dataType === quality ? colorOnPrimary : colorOnSurface}
                        fontFamily={$fonts.mdi}
                        fontSize={16}
                        marginRight={4}
                        text="mdi-check"
                        verticalAlignment="middle"
                        visibility={dataType === quality ? 'visible' : 'collapse'} />
                    <label
                        col={1}
                        color={dataType === quality ? colorOnPrimary : colorOnSurface}
                        fontSize={14}
                        fontWeight={dataType === quality ? 'bold' : 'normal'}
                        text={lc(quality)}
                        verticalAlignment="middle" />
                </gridlayout>
            {/each}
        </stacklayout>
        <gridlayout columns="*,auto" marginBottom={16} marginTop={15} rows="auto">
            <label color={colorPrimary} fontSize={20} fontWeight="bold" text={lc('languages')} verticalAlignment="middle" />
            <mdbutton class="icon-btn" col={1} padding={0} text="mdi-plus" variant="text" on:tap={addLanguages} />
        </gridlayout>
        <wraplayout row={1}>
            {#each languages as language}
                <gridlayout
                    borderColor={colorOutline}
                    borderRadius={8}
                    borderWidth={1}
                    columns="auto,auto,auto"
                    height={32}
                    margin={4}
                    paddingLeft={downloaded.indexOf(language) !== -1 ? 8 : 12}
                    paddingRight={8}>
                    <label
                        color={colorOnSurface}
                        fontFamily={$fonts.mdi}
                        fontSize={16}
                        marginRight={4}
                        text="mdi-download"
                        verticalAlignment="middle"
                        visibility={downloaded.indexOf(language) !== -1 ? 'visible' : 'collapse'} />

                    <label col={1} fontSize={14} paddingBottom={2} text={ocrService.localizedLanguage(language)} verticalAlignment="middle" />
                    <mdbutton
                        col={2}
                        color={colorOnSurface}
                        fontFamily={$fonts.mdi}
                        fontSize={16}
                        marginLeft={4}
                        padding={0}
                        text="mdi-close"
                        variant="text"
                        verticalAlignment="middle"
                        width={20}
                        on:tap={() => removeLanguage(language)} />
                </gridlayout>
            {/each}
        </wraplayout>
        <!-- <gridlayout , backgroundColor="" borderRadius="50%" columns="*,auto">
            <textfield hint={lc('languages')} placeholder={lc('languages')} returnKeyType="search" variant="none" verticalTextAlignment="center" />
        </gridlayout> -->
        <mdbutton id="start" horizontalAlignment="right" padding="10 16 10 16" row={1} text={lc('start')} on:tap={startOCR} />
    </stacklayout>
</gesturerootview>
