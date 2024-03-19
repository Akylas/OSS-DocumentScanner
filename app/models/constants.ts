import { Screen, knownFolders } from '@nativescript/core';

export const TRANSFORMS_SPLIT = '|';

export const IMG_FORMAT = 'jpg';
export const CARD_RATIO = 0.629;
export const IMAGE_DECODE_HEIGHT = Math.max(Screen.mainScreen.widthPixels, Screen.mainScreen.heightPixels);

export const FILTER_ROW_HEIGHT = CARD_APP ? 55 : 85;
export const FILTER_COL_WIDTH = CARD_APP ? FILTER_ROW_HEIGHT / CARD_RATIO : 60;
export const IMG_COMPRESS = 80;
export const PREVIEW_RESIZE_THRESHOLD = 200;
export const QRCODE_RESIZE_THRESHOLD = 900;
export const DOCUMENT_NOT_DETECTED_MARGIN = 100;
export const CROP_ENABLED = true;
export const AUTO_SCAN_ENABLED = true;
export const AUTO_SCAN_DISTANCETHRESHOLD = 50;
export const AUTO_SCAN_DURATION = 1000;
export const AUTO_SCAN_DELAY = 1000;
export const DEFAULT_PDF_OPTIONS = {
    pagerPagePaddingHorizontal: 16,
    pagerPagePaddingVertical: 8,
    paper_size: 'full',
    color: 'color',
    orientation: 'portrait',
    page_padding: 10,
    jpegQuality: 80,
    items_per_page: 1,
    dpi: 96,
    imageSizeThreshold: 1500,
    imageLoadScale: 1,
    draw_ocr_text: true,
    draw_ocr_overlay: false
};
export const DEFAULT_PDF_OPTIONS_STRING = JSON.stringify(DEFAULT_PDF_OPTIONS);
export const DEFAULT_EXPORT_DIRECTORY = __ANDROID__
    ? android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath()
    : knownFolders.externalDocuments().path;
