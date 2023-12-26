<script context="module" lang="ts">
    let index = 0;
</script>

<script lang="ts">
    import { showModal } from 'svelte-native';
    import CActionBar from './CActionBar.svelte';
    import { showLoading, timeout } from '~/utils/ui';
    import { AlertDialog, alert } from '@nativescript-community/ui-material-dialogs';
    const title = `Page ${index++}`;
    async function showModalTest() {
        try {
            const TestPage = (await import('~/components/TestPage.svelte')).default;
            const document = await showModal({
                page: TestPage,
                fullscreen: true
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showLoadingTest() {
        try {
            // const alertDialog = new AlertDialog({
            //     message: 'test',
            //     okButtonText: 'ok'
            // });
            // alertDialog.show((r) => console.log(r))
            alert({
                message: `test modal ${index}`,
                okButtonText: 'ok'
            }).then((r) => console.log(r));
            await timeout(1000);
            showModalTest();
        } catch (error) {
            console.error(error);
        }
    }
</script>

<page
    actionBarHidden={true}
    backgroundColor="black"
    statusBarStyle="dark"
    on:showingModally={(e) => console.log(e.eventName, e.object)}
    on:shownModally={(e) => console.log(e.eventName, e.object)}
    on:closingModally={(e) => console.log(e.eventName, e.object)}>
    <gridlayout rows="auto,*">
        <mdbutton row="1" text="showModal" verticalAlignment="bottom" on:tap={showModalTest} />
        <mdbutton row="1" text="showLoading" verticalAlignment="top" on:tap={showLoadingTest} />
        <CActionBar backgroundColor="red" modalWindow={true} {title} />
    </gridlayout>
</page>
>
