import { Screen, knownFolders } from '@nativescript/core';

export enum PDFImportImages {
    ask = 'ask',
    never = 'never',
    always = 'always'
}

export const SETTINGS_DOCUMENT_NAME_FORMAT = 'document_name_format';
export const SETTINGS_IMPORT_PDF_IMAGES = 'import_pdf_images';

export const TRANSFORMS_SPLIT = '|';

export const IMG_FORMAT = 'jpg';
export const CARD_RATIO = 0.629;
export const IMAGE_DECODE_HEIGHT = Math.max(Screen.mainScreen.widthPixels, Screen.mainScreen.heightPixels);

export const DEFAULT__BATCH_CHUNK_SIZE = 10;
export const FILTER_ROW_HEIGHT = CARD_APP ? 55 : 85;
export const FILTER_COL_WIDTH = CARD_APP ? FILTER_ROW_HEIGHT / CARD_RATIO : 60;
export const IMG_COMPRESS = 80;
export const PREVIEW_RESIZE_THRESHOLD = 200;
export const AREA_SCALE_MIN_FACTOR = 0.1;
export const QRCODE_RESIZE_THRESHOLD = 900;
export const DOCUMENT_NOT_DETECTED_MARGIN = 10;
export const PDF_IMPORT_IMAGES = PDFImportImages.ask;
export const USE_SYSTEM_CAMERA = false;
export const CROP_ENABLED = true;
export const MAGNIFIER_SENSITIVITY = 0.8;
export const AUTO_SCAN_ENABLED = true;
export const FILENAME_USE_DOCUMENT_NAME = true;
export const FILENAME_DATE_FORMAT = 'timestamp';
export const DOCUMENT_NAME_FORMAT = 'L LTS';
export const AUTO_SCAN_DISTANCETHRESHOLD = 50;
export const AUTO_SCAN_DURATION = 1000;
export const AUTO_SCAN_DELAY = 1000;
export const DEFAULT_PDF_OPTIONS = {
    paper_size: 'full',
    color: 'color',
    orientation: 'portrait',
    page_padding: 10,
    jpegQuality: 80,
    items_per_page: 1,
    dpi: 96,
    imageSizeThreshold: 1500,
    imageLoadScale: 2,
    draw_ocr_text: true,
    draw_ocr_overlay: false
};
export const IMAGE_CONTEXT_OPTIONS = {
    originalQueryCacheType: 0,
    originalStoreCacheType: 0,
    imageEncodeOptions: {
        encodeCompressionQuality: IMG_COMPRESS / 100
    }
};
export const DEFAULT_PDF_OPTIONS_STRING = JSON.stringify(DEFAULT_PDF_OPTIONS);
export const DEFAULT_EXPORT_DIRECTORY = __ANDROID__
    ? android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath()
    : knownFolders.externalDocuments().path;
