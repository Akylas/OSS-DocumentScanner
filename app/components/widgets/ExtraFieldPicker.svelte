<script context="module" lang="ts">
    import { lc } from '@nativescript-community/l';
    import { SilentError } from '@shared/utils/error';
    import { showError } from '@shared/utils/showError';
    import dayjs from 'dayjs';
    import { formatDate } from '~/helpers/locale';
    import { ExtraFieldType } from '~/models/OCRDocument';
    import { pickDate, showPopoverMenu } from '~/utils/ui';
    import { colors } from '~/variables';
</script>

<script lang="ts">
    let { colorOnBackground, colorOnSurfaceVariant, colorOutlineVariant } = $colors;
    $: ({ colorOnBackground, colorOnSurfaceVariant, colorOutlineVariant } = $colors);

    export let editing = false;
    export let name = null;
    export let value = null;
    export let type: ExtraFieldType = ExtraFieldType.Date;
    let currentTime = value ? dayjs(value) : dayjs();
    let currentValue = value;
    let currentName = name;
    let currentType = type;
    let rootView;
    const tMargin = '4 0 4 0';

    async function selectDate(e) {
        try {
            DEV_LOG && console.log('selectDate', currentTime);
            if (currentType === ExtraFieldType.Date) {
                const dayStart = currentTime.startOf('d');
                const date = await pickDate(currentTime);
                if (date && dayStart.valueOf() !== date) {
                    currentTime = dayjs(date);
                }
            }
        } catch (error) {
            showError(error);
        }
    }

    async function selectType(event) {
        try {
            DEV_LOG && console.log('selectType');
            // const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
            const options = Object.keys(ExtraFieldType).map((k) => ({ name: lc(ExtraFieldType[k]), id: k }));
            DEV_LOG && console.log('options', options);
            await showPopoverMenu({
                options,
                anchor: event.object,
                onClose: (item) => {
                    currentType = ExtraFieldType[item.id];
                }
            });
        } catch (error) {
            showError(error);
        }
    }

    async function add() {
        try {
            if (!currentName || (!currentValue && currentType !== ExtraFieldType.Date)) {
                throw new SilentError(lc('need_fill_fields'));
            }
            rootView.nativeView.bindingContext.closeCallback({
                type: currentType,
                name: currentName,
                value: currentType === ExtraFieldType.Date ? currentTime.valueOf() : currentType === ExtraFieldType.Number ? parseFloat(currentValue) : currentValue
            });
        } catch (error) {
            showError(error);
        }
    }
</script>

<gesturerootview bind:this={rootView} padding={16} rows="auto,auto,auto,auto,auto">
    <label color={colorOnBackground} fontSize={20} fontWeight="bold" marginBottom={16} text={editing ? lc('edit_extra_field') : lc('add_extra_field')} />
    <textfield editable={false} hint={lc('type')} margin={tMargin} row={1} text={lc(currentType)} textTransform="uppercase" variant="outline" on:tap={(e) => selectType(e)} />
    <textfield hint={lc('name')} margin={tMargin} row={2} text={name} variant="outline" on:textChange={(e) => (currentName = e.value)} />
    <textview
        editable={currentType !== ExtraFieldType.Date}
        hint={lc('value')}
        margin={tMargin}
        row={3}
        text={currentType === ExtraFieldType.Date ? formatDate(currentTime, 'LL') : currentValue}
        variant="outline"
        on:textChange={(e) => (currentValue = e.value)}
        on:tap={(e) => selectDate(e)} />
    <mdbutton horizontalAlignment="right" row={4} text={editing ? lc('edit') : lc('add')} variant="text" on:tap={add} />
</gesturerootview>
