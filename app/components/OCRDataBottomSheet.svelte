<script lang="ts">
    import { createNativeAttributedString } from '@nativescript-community/ui-label';
    import { OCRData } from 'plugin-nativeprocessor';

    export let ocrData: OCRData;
    // ocrData.blocks.forEach((b) => {
    //     console.log(b.bold, b.pointsize, b.text);
    // });
    const text = createNativeAttributedString({
        spans: ocrData.blocks.map((b) => ({
            text: b.text + '\n',
            fontSize: (b.fontSize * ocrData.imageHeight) / 100, //in pixels in image size
            fontWeight: b.fontWeight,
            fontStyle: b.fontStyle,
            textDecoration: b.textDecoration
        }))
    });
</script>

<textview editable={false} height="100%" {text} />
