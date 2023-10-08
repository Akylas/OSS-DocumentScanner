<script lang="ts" context="module">
    export interface OptionType {
        name: string;
        isPick?: boolean;
        [k: string]: any;
    }
</script>

<script lang="ts">
    import { openFilePicker } from '@nativescript-community/ui-document-picker';
    import { closeBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
    import { File } from '@nativescript/core';
    import { Template } from 'svelte-native/components';
    import ListItem from '~/components/ListItem.svelte';

    export let options: OptionType[];

    export let height: number = 350;

    function close(value?: OptionType) {
        closeBottomSheet(value);
    }

    async function onTap(item: OptionType, args) {
        if (item.isPick) {
            try {
                const result = await openFilePicker({
                    extensions: ['file/*'],
                    multipleSelection: false,
                    pickerMode: 0
                });
                if (File.exists(result.files[0])) {
                    const file = File.fromPath(result.files[0]);
                    close({ name: file.name, data: { url: file.path }, isPick: true });
                } else {
                    close(null);
                }
            } catch (err) {
                close(null);
            }
        } else {
            close(item);
        }
    }
</script>

<collectionView row={1} items={options} {height} rowHeight="72">
    <Template let:item>
        <ListItem title={item.name} on:tap={(event) => onTap(item, event)} />
    </Template>
</collectionView>
