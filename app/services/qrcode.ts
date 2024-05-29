import { ImageSource, Observable, PageTransition, Screen, SharedTransition } from '@nativescript/core';
import { detectQRCode, detectQRCodeFromFile, generateQRCodeImage } from 'plugin-nativeprocessor';
import { OCRDocument, OCRPage } from '~/models/OCRDocument';
import { QRCODE_RESIZE_THRESHOLD } from '~/utils/constants';
import { loadImage, recycleImages } from '~/utils/images';
import { navigate } from '~/utils/svelte/ui';

const TAG = 'QRCodeService';

const screenWidthPixels = Screen.mainScreen.widthPixels;
const screenHeightPixels = Screen.mainScreen.heightPixels;

export class QRCodeService extends Observable {
    async detectQRcode(document: OCRDocument, pageIndex: number) {
        const page = document.pages[pageIndex];
        const qrcode = await detectQRCodeFromFile(page.imagePath, {
            resizeThreshold: QRCODE_RESIZE_THRESHOLD,
            rotation: page.rotation
        });
        if (qrcode) {
            await document.updatePage(pageIndex, {
                qrcode
            });
            return qrcode;
        }
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
                refreshOnOrientationChange: true,
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
                    colorMatrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 1, 1],
                    margin: '0 10 0 10',
                    image: (orientation) => {
                        if (orientation === 'landscape') {
                            return generateQRCodeImage(qrcode.text, qrcode.format, screenHeightPixels, screenWidthPixels);
                        }
                        return generateQRCodeImage(qrcode.text, qrcode.format, screenWidthPixels, screenWidthPixels);
                    }
                })),
                startPageIndex
            }
        });
    }
}
export const qrcodeService = new QRCodeService();
