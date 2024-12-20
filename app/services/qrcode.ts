import { Observable, PageTransition, SharedTransition } from '@nativescript/core';
import { navigate, showModal } from '@shared/utils/svelte/ui';
import { QRCodeSingleData, detectQRCodeFromFile, getSVGFromQRCode } from 'plugin-nativeprocessor';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import { QRCODE_RESIZE_THRESHOLD } from '~/utils/constants';
import { screenWidthDips } from '~/variables';

const TAG = 'QRCodeService';

export function getBarcodeFallbackString(format) {
    switch (format) {
        case FORMATS.AZTEC:
            return 'AZTEC';
        case FORMATS.DATA_MATRIX:
            return 'DATA_MATRIX';
        case FORMATS.PDF_417:
            return 'PDF_417';
        case FORMATS.QR_CODE:
            return 'QR_CODE';
        case FORMATS.CODABAR:
            return 'C0C';
        case FORMATS.CODE_39:
            return 'CODE-39';
        case FORMATS.CODE_93:
            return 'CODE-93';
        case FORMATS.CODE_128:
            return 'CODE-128';
        case FORMATS.EAN_8:
            return '32123456';
        case FORMATS.EAN_13:
            return '5901234123457';
        case FORMATS.ITF:
            return '1003';
        case FORMATS.UPC_A:
            return '123456789012';
        case FORMATS.UPC_E:
            return '0123456';
        // case FORMATS.DXFILMEDGE:
        //     return '0123456';
        case FORMATS.DATABAR:
            return '12345678901231';
        case FORMATS.DATABAREXPANDED:
            return '[01]98898765432106[3202]012345[15]991231';
        default:
            return format;
    }
}

export enum FORMATS {
    QR_CODE = 'QRCode',
    EAN_8 = 'EAN-8',
    EAN_13 = 'EAN-13',
    UPC_A = 'UPC-A',
    UPC_E = 'UPC-E',
    AZTEC = 'Aztec',
    CODABAR = 'Codabar',
    CODE_39 = 'Code39',
    CODE_93 = 'Code93',
    CODE_128 = 'Code128',
    DATABAR = 'DataBar',
    DATABAREXPANDED = 'DataBarExpanded',
    DATA_MATRIX = 'DataMatrix',
    // DXFILMEDGE = 'DXFilmEdge',
    ITF = 'ITF',
    MAXICODE = 'MaxiCode',
    MICROQRCODE = 'MicroQRCode',
    PDF_417 = 'PDF417',
    RMQRCODE = 'rMQRCode'
}

export class QRCodeService extends Observable {
    async getQRCodeSVG(qrcode: QRCodeSingleData, width: number, color: string = '#000000', options?) {
        DEV_LOG && console.log('getQRCodeSVG', JSON.stringify(qrcode), width, color, !!getSVGFromQRCode);
        return getSVGFromQRCode(qrcode.text, qrcode.format, width, {
            color,
            ...(options || {})
        });
    }
    async detectQRcode(document: OCRDocument, pageIndex: number) {
        const page = document.pages[pageIndex];
        const qrcode = await detectQRCodeFromFile(page.imagePath, {
            resizeThreshold: QRCODE_RESIZE_THRESHOLD,
            rotation: page.rotation
        });
        if (qrcode?.length) {
            await document.updatePage(pageIndex, {
                qrcode: (document.pages[pageIndex].qrcode || []).concat(qrcode)
            });
            return qrcode;
        }
    }

    async createQRCode() {
        const CreateBarcode = (await import('~/components/qrcode/CreateBarcode.svelte')).default;
        return showModal({
            page: CreateBarcode,
            fullscreen: true,
            props: {}
        }) as any as Promise<{ text: string; format: string }>;
    }

    async showQRCode(pages: OCRPage[], document?: OCRDocument, startPageIndex = 0) {
        const qrcodes = pages.reduce((acc, page) => acc.concat(page.qrcode || []), []);
        const component = (await import('~/components/FullScreenImageViewer.svelte')).default;
        navigate({
            page: component,
            transition:
                __ANDROID__ && !CARD_APP
                    ? SharedTransition.custom(new PageTransition(300, undefined, 10), {
                          //   pageStart: {
                          //       sharedTransitionTags: {
                          //           [`document_${document.id}_${item.page.id}`]: {}
                          //       }
                          //   }
                      })
                    : undefined,
            // transition: { name: 'slideLeft', duration: 300, curve: 'easeOut' },
            props: {
                refreshOnOrientationChange: false,
                useSVG: true,
                labelColor: 'black',
                backgroundColor: 'white',
                statusBarStyle: 'light',
                keepScreenAwake: true,
                screenBrightness: 1,
                images: qrcodes.map((qrcode, index) => ({
                    name: document?.name,
                    subtitle: qrcode.text,
                    sharedTransitionTag: 'qrcode' + index,
                    labelSharedTransitionTag: 'qrcodelabel' + index,
                    // colorMatrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 1, 1],
                    margin: '0 10 0 10',
                    svg: async () => this.getQRCodeSVG(qrcode, screenWidthDips)
                })),
                startPageIndex
            }
        });
    }
}
export const qrcodeService = new QRCodeService();
