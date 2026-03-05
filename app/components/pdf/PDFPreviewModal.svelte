<script context="module" lang="ts">
    import PDFPreview from '~/components/pdf/PDFPreview.svelte';
    import { OCRDocument, OCRPage } from '~/models/OCRDocument';
</script>

<script lang="ts">
    export let pages: { page: OCRPage; document: OCRDocument }[];
    export let document: OCRDocument = null;
</script>

<frame id="modal-frame">
    <PDFPreview {document} {pages} {...$$restProps} />
</frame>
