<style>
    .label {
        -webkit-user-select: text;
        user-select: text;
    }
</style>

<script lang="ts">
    import Panzoom, { type PanzoomObject } from '@akylas/panzoom';
    let imgPath: string;
    let rotation: number = 0;
    let ocrData: any;
    let panzoom: PanzoomObject;
    let img = HTMLImageElement;
    let imageWidth: number;
    let imageHeight: number;
    let deltaX = 0;
    let deltaY = 0;
    function initPanzoom(node: any) {
        panzoom = Panzoom(node, { cursor: 'default', contain: 'aspectfit', excludeClass: 'label' });
        node.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
    }
    export function updateOCRData(imagePath: string, imgWidth, imgHeight, ro, data: any) {
        imgPath = imagePath;
        rotation = ro;
        ocrData = data;
        if (rotation % 180 !== 0) {
            imageWidth = imgHeight;
            imageHeight = imgWidth;
            if (imgWidth > imgHeight) {
                deltaX = (imgHeight - imgWidth) / 2;
                deltaY = -deltaX;
            } else {
                deltaX = -(imgWidth - imgHeight) / 2;
                deltaY = -deltaX;
            }
        } else {
            imageWidth = imgWidth;
            imageHeight = imgHeight;
        }
        const scale = Math.min(document.body.clientWidth / imageWidth, document.body.clientHeight / imageHeight);
        panzoom.setOptions({ minScale: scale });
        panzoom.zoom(scale);
        // the pan is there to fix the original position which is wrong
        setTimeout(() => {
            panzoom.pan(-10000, -10000);
        }, 15);
        imgPath = imagePath;
        rotation = ro;
        ocrData = data;
    }

    document['updateOCRData'] = updateOCRData;

    // let s not show blocks before image is loaded as we
    // const imageLoaded = true;
    // function onImageLoaded() {
    // if (img) {
    //     //@ts-ignore
    //     const imgWidth = img.width;
    //     //@ts-ignore
    //     const imgHeight = img.height;
    //     if (rotation % 180 !== 0) {
    //         imageWidth = imgHeight;
    //         imageHeight = imgWidth;
    //         if (imgWidth > imgHeight) {
    //             deltaX = (imgHeight - imgWidth) / 2;
    //             deltaY = -deltaX;
    //         } else {
    //             deltaX = -(imgWidth - imgHeight) / 2;
    //             deltaY = -deltaX;
    //         }
    //     } else {
    //         imageWidth = imgWidth;
    //         imageHeight = imgHeight;
    //     }
    //     const scale = Math.min(document.body.clientWidth / imageWidth, document.body.clientHeight / imageHeight);
    //     panzoom.setOptions({ minScale: scale });
    //     panzoom.zoom(scale);
    //     imageLoaded = true;
    //     // the pan is there to fix the original position which is wrong
    //     setTimeout(() => {
    //         panzoom.pan(-10000, -10000);
    //     }, 15);
    // }
    // }
    // onMount(() => {
    //     document['updateOCRData']('image.jpg', {
    //         blocks: [
    //             {
    //                 box: { height: 216, width: 1128, x: 232, y: 279 },
    //                 confidence: 91.08016967773438,
    //                 fontSize: 6,
    //                 text: '1 represent that my performance of all the terms of this Intellectual Property Agreement\nwill not breach any agreement to keep in confidence proprietary information acquired by me in\nconfidence or in trust prior to my Relationship with the Company. 1 have not entered into, and !\nagree ! will not enter into, any oral or written agreement in conflict herewith. I agree to execute\nany proper oath or verify any proper document required to carry out the terms of this Intellectual\nProperty Agreement.'
    //             },
    //             { box: { height: 29, width: 289, x: 232, y: 533 }, confidence: 91.83981323242188, fontSize: 7, text: '7. Equitable Relief' },
    //             {
    //                 box: { height: 250, width: 1119, x: 231, y: 601 },
    //                 confidence: 93.39688110351562,
    //                 fontSize: 6,
    //                 text: 'The Company and ! each agree that disputes relating to or arising out of a breach of the\ncovenants contained in this Intellectual Property Agreement may cause the Company or me, as\napplicable, to suffer irreparable harm and to have no adequate remedy at law. In the event ofany\nsuch breach or default by a party. or any threat of such breach or default, the other party will be\nentitled to injunctive relief, specific performance and other equitable relief. The parties further\nagrec that no bond or other security shall be required in obtaining such equitable relief and hereby\nconsents to the issuance of such injunction and to the ordering of specific performance.'
    //             },
    //             { box: { height: 23, width: 318, x: 231, y: 884 }, confidence: 89.63005065917969, fontSize: 6, text: '8. General Provisions' },
    //             {
    //                 box: { height: 206, width: 1110, x: 229, y: 951 },
    //                 confidence: 93.20551300048828,
    //                 fontSize: 7,
    //                 text: '(a) Governing Law; Consent to Personal Jurisdiction. This Intellectual Property\nAgreement will be governed by the laws of the State of California as they apply to contracts entered\ninto and wholly to be performed within such state. I hereby expressiy consent to the nonexclusive\npersonal jurisdiction and venue of the state and federal courts located in the federal Northern\nDistrict of California for any lawsuit filed there by either party arising from or relating to this\nIntellectual Property Agreement.'
    //             },
    //             {
    //                 box: { height: 208, width: 1106, x: 226, y: 1195 },
    //                 confidence: 94.80353546142578,
    //                 fontSize: 6,
    //                 text: '(b) Entire Agreement. This Intellectual Property Agreement sets forth the entire\nagreement and understanding between the Company and me relating to the subject matter herein\nand merges all prior discussions between us. No modification of or amendment to this Intellectual\nProperty Agreement, or any waiver of any rights under this Intellectual Property Agreement, will\nbe effective unless in writing signed by the party to be charged. Any subsequent change or changes\nin my duties, salary or compensation will not affect the validity or scope of this Intellectual'
    //             },
    //             { box: { height: 26, width: 234, x: 226, y: 1409 }, confidence: 96.54405975341797, fontSize: 6, text: 'Property Agreement.' },
    //             {
    //                 box: { height: 64, width: 1098, x: 224, y: 1473 },
    //                 confidence: 93.74375915527344,
    //                 fontSize: 6,
    //                 text: '(c) Severability. If one or more of the provisions in this Intellectual Property\nAgreement are deemed void by law, then the remaining provisions will continue in full force and'
    //             },
    //             { box: { height: 21, width: 69, x: 224, y: 1543 }, confidence: 96.6325454711914, fontSize: 6, text: 'effect.' },
    //             {
    //                 box: { height: 98, width: 1101, x: 223, y: 1607 },
    //                 confidence: 94.49688720703125,
    //                 fontSize: 6,
    //                 text: '(d) Successors and Assigns. This Intellectual Property Agreement will be binding\nupon my heirs, executors, administrators and other legal representatives and will be for the benefit\nofthe Company and its successors and assigns.'
    //             },
    //             { box: { height: 27, width: 283, x: 629, y: 1795 }, confidence: 93.89242553710938, fontSize: 6, text: '[Signature Page Follows]' },
    //             { box: { height: 16, width: 34, x: 753, y: 1886 }, confidence: 88.2135238647461, fontSize: 5, text: 'A-5' },
    //             { box: { height: 15, width: 242, x: 222, y: 1930 }, confidence: 67.42961120605469, fontSize: 4, text: '76409-0001/LEGAL20300065.1' }
    //         ],
    //         imageHeight: 2089,
    //         imageWidth: 1585,
    //         text: '1 represent that my performance of all the terms of this Intellectual Property Agreement\nwill not breach any agreement to keep in confidence proprietary information acquired by me in\nconfidence or in trust prior to my Relationship with the Company. 1 have not entered into, and !\nagree ! will not enter into, any oral or written agreement in conflict herewith. I agree to execute\nany proper oath or verify any proper document required to carry out the terms of this Intellectual\nProperty Agreement.7. Equitable ReliefThe Company and ! each agree that disputes relating to or arising out of a breach of the\ncovenants contained in this Intellectual Property Agreement may cause the Company or me, as\napplicable, to suffer irreparable harm and to have no adequate remedy at law. In the event ofany\nsuch breach or default by a party. or any threat of such breach or default, the other party will be\nentitled to injunctive relief, specific performance and other equitable relief. The parties further\nagrec that no bond or other security shall be required in obtaining such equitable relief and hereby\nconsents to the issuance of such injunction and to the ordering of specific performance.8. General Provisions(a) Governing Law; Consent to Personal Jurisdiction. This Intellectual Property\nAgreement will be governed by the laws of the State of California as they apply to contracts entered\ninto and wholly to be performed within such state. I hereby expressiy consent to the nonexclusive\npersonal jurisdiction and venue of the state and federal courts located in the federal Northern\nDistrict of California for any lawsuit filed there by either party arising from or relating to this\nIntellectual Property Agreement.(b) Entire Agreement. This Intellectual Property Agreement sets forth the entire\nagreement and understanding between the Company and me relating to the subject matter herein\nand merges all prior discussions between us. No modification of or amendment to this Intellectual\nProperty Agreement, or any waiver of any rights under this Intellectual Property Agreement, will\nbe effective unless in writing signed by the party to be charged. Any subsequent change or changes\nin my duties, salary or compensation will not affect the validity or scope of this IntellectualProperty Agreement.(c) Severability. If one or more of the provisions in this Intellectual Property\nAgreement are deemed void by law, then the remaining provisions will continue in full force andeffect.(d) Successors and Assigns. This Intellectual Property Agreement will be binding\nupon my heirs, executors, administrators and other legal representatives and will be for the benefit\nofthe Company and its successors and assigns.[Signature Page Follows]A-576409-0001/LEGAL20300065.1'
    //     });
    // });
</script>

<div style="width:100%;height:100%;padding:0;margin:0;">
    <div style:width={imageWidth + 'px'} style:height={imageHeight + 'px'} use:initPanzoom>
        <img bind:this={img} style:position="absolute" style:transform={rotation !== 0 ? `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)` : null} alt="test" src={imgPath} />
        {#if ocrData}
            {#each ocrData.blocks as block}
                <div
                    style:color="white"
                    style:background-color="#00000088"
                    style:position="absolute"
                    style:font-size={block.fontSize * 2.75 + 'pt'}
                    style:left={block.box.x + 'px'}
                    style:top={block.box.y + 'px'}
                    style:width={block.box.width + 'px'}
                    class="label">
                    {block.text}
                </div>
            {/each}
        {/if}
    </div>
</div>
