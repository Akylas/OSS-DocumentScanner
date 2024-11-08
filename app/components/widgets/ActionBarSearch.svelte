<script context="module" lang="ts">
    import { TextField } from '@nativescript-community/ui-material-textfield';
    import { Utils } from '@nativescript/core';
    import { onDestroy } from 'svelte';
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { lc } from '~/helpers/locale';
    import { colors } from '~/variables';
</script>

<script lang="ts">
    let { colorBackground } = $colors;
    $: ({ colorBackground } = $colors);

    export let refresh: (force?: boolean, filter?: string) => void;
    let searchTF: NativeViewElementNode<TextField>;
    let filter: string = null;
    export let visible = false;

    export function showSearch() {
        visible = true;
        searchTF?.nativeView?.requestFocus();
    }
    export function hideSearch() {
        clearSearch();
    }
    function blurTextField() {
        Utils.dismissSoftInput();
    }
    export function unfocusSearch() {
        if (searchAsTypeTimer) {
            clearTimeout(searchAsTypeTimer);
            searchAsTypeTimer = null;
        }
        blurTextField();
    }
    let searchAsTypeTimer;
    function clearSearch(clearQuery = true, hideSearch = true) {
        // DEV_LOG && console.log('clearSearch', clearQuery, hideSearch);
        if (searchAsTypeTimer) {
            clearTimeout(searchAsTypeTimer);
            searchAsTypeTimer = null;
        }

        if (clearQuery) {
            if (filter?.length) {
                filter = null;
            }
            searchTF.nativeView.text = '';
        }
        if (hideSearch) {
            searchTF?.nativeView?.clearFocus();
            visible = false;
        }
        refresh(false, undefined);
    }
    function onTextChanged(text: string) {
        const query = text.toLowerCase();
        DEV_LOG && console.log('onTextChanged', query, filter);
        if (query !== filter) {
            if (query) {
                if (searchAsTypeTimer) {
                    clearTimeout(searchAsTypeTimer);
                    searchAsTypeTimer = null;
                }
                if (query && query.length > 1) {
                    searchAsTypeTimer = setTimeout(() => {
                        searchAsTypeTimer = null;
                        refresh(false, query);
                    }, 500);
                } else {
                    // the timeout is to allow svelte to see changes with $:
                    setTimeout(() => {
                        clearSearch(false, false);
                    }, 0);

                    if (query.length === 0 && filter?.length > 0) {
                        unfocusSearch();
                    }
                }
            }
            filter = query;
        }
    }
    onDestroy(() => {
        blurTextField();
    });
</script>

<!-- <gridlayout backgroundColor={colorBackground} col={1} colSpan={2} visibility={visible ? 'visible' : 'hidden'}> -->
<textfield
    bind:this={searchTF}
    autocapitalizationType="none"
    backgroundColor={colorBackground}
    col={1}
    colSpan={2}
    hint={lc('search')}
    paddingRight={45}
    placeholder={lc('search')}
    returnKeyType="search"
    variant="outline"
    visibility={visible ? 'visible' : 'hidden'}
    on:returnPress={blurTextField}
    on:textChange={(e) => onTextChanged(e['value'])} />
<!-- <mdbutton
        class="actionBarButton"
        height={40}
        horizontalAlignment="right"
        marginTop={8}
        text="mdi-close"
        variant="text"
        visibility={filter?.length > 0 ? 'visible' : 'hidden'}
        width={40}
        on:tap={() => clearSearch()} /> -->
<!-- </gridlayout> -->
