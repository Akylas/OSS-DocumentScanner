<script context="module" lang="ts">
    import { navigate } from '@shared/utils/svelte/ui';
    import Camera from '~/components/camera/Camera.svelte';
    import { OCRDocument, OCRPage, PageData } from '~/models/OCRDocument';
    import { PDFExportBaseOptions } from '~/services/pdf/PDFCanvas';
    import { exportPDFAsync } from '~/services/pdf/PDFExporter';
</script>

<script lang="ts">
    export let outputFolderPath: string;
    export let outputFilename: string;
    export let onDone: (result?) => void;
    let pagesToAdd: PageData[] = [];

    let saveCurrentDocument = async () => {
        // there we same
        const document: OCRDocument = null;
        const pages = pagesToAdd.map((p) => ({ page: p as OCRPage, document }));
        const component = (await import('~/components/pdf/PDFPreview.svelte')).default;
        navigate({
            page: component,
            props: {
                pages,
                saveFunction: async (options: PDFExportBaseOptions) => {
                    const filePath = await exportPDFAsync({ pages, document, folder: outputFolderPath, filename: outputFilename, options });
                    onDone(filePath);
                }
            }
        });
    };

    function onClose() {
        onDone();
    }
</script>

<!-- <gesturerootview height="100%"> -->
<frame id="scanneractivity" backgroundColor="blue">
    <Camera {onClose} bind:saveCurrentDocument bind:pagesToAdd />
</frame>
<!-- </gesturerootview> -->
