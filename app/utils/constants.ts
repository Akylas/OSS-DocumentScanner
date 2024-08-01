import { ApplicationSettings, Screen, knownFolders } from '@nativescript/core';

export enum PDFImportImages {
    ask = 'ask',
    never = 'never',
    always = 'always'
}

export const SETTINGS_APP_VERSION = '_app_version';
export const SETTINGS_FIRST_OPEN = '_first_open';
export const SETTINGS_DOCUMENT_NAME_FORMAT = 'document_name_format';
export const SETTINGS_FILE_NAME_USE_DOCUMENT_NAME = 'filename_use_document_name';
export const SETTINGS_FILE_NAME_FORMAT = 'filename_date_format';
export const SETTINGS_IMPORT_PDF_IMAGES = 'import_pdf_images';
export const SETTINGS_CAMERA_SETTINGS = 'camera_settings';
export const SETTINGS_CROP_ENABLED = 'cropEnabled';
export const SETTINGS_ALWAYS_PROMPT_CROP_EDIT = 'always_prompt_crop_edit';
export const SETTINGS_REMOTE_AUTO_SYNC = 'webdav_auto_sync'; // we cant rename as it was already used before
export const SETTINGS_SYNC_SERVICES = 'sync_services'; // we cant rename as it was already used before
export const SETTINGS_IMAGE_EXPORT_FORMAT = 'image_export_format';
export const SETTINGS_IMAGE_EXPORT_QUALITY = 'image_export_quality';

export const TRANSFORMS_SPLIT = '|';

export const ANDROID_CONTENT = 'content://';
export const SEPARATOR = '/';

export const IMG_FORMAT = 'jpg';
export const PDF_EXT = '.pdf';
export const CARD_RATIO = 0.629;
export const IMAGE_DECODE_HEIGHT = Math.max(Screen.mainScreen.widthPixels, Screen.mainScreen.heightPixels);

export const ALERT_OPTION_MAX_HEIGHT = Screen.mainScreen.heightDIPs * 0.47;

export const AUTO_SYNC = true;
export const DEFAULT__BATCH_CHUNK_SIZE = 10;
export const FILTER_ROW_HEIGHT = CARD_APP ? 55 : 85;
export const FILTER_COL_WIDTH = CARD_APP ? FILTER_ROW_HEIGHT / CARD_RATIO : 60;
export const IMG_COMPRESS = 80;
export const PREVIEW_RESIZE_THRESHOLD = 200;
export const AREA_SCALE_MIN_FACTOR = 0.1;
export const QRCODE_RESIZE_THRESHOLD = 900;
export const COLOR_PALETTE_RESIZE_THRESHOLD = 100;
export const DOCUMENT_NOT_DETECTED_MARGIN = 10;
export const PDF_IMPORT_IMAGES = PDFImportImages.ask;
export const USE_SYSTEM_CAMERA = false;
export const CROP_ENABLED = true;
export const ALWAYS_PROMPT_CROP_EDIT = false;
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

export function getImageExportSettings() {
    return {
        imageFormat: ApplicationSettings.getString(SETTINGS_IMAGE_EXPORT_FORMAT, IMG_FORMAT) as 'png' | 'jpeg' | 'jpg',
        imageQuality: ApplicationSettings.getNumber(SETTINGS_IMAGE_EXPORT_QUALITY, IMG_COMPRESS)
    };
}

export const EVENT_DOCUMENT_ADDED = 'documentAdded';
export const EVENT_DOCUMENT_UPDATED = 'documentUpdated';
export const EVENT_DOCUMENT_DELETED = 'documentsDeleted';
export const EVENT_DOCUMENT_PAGES_ADDED = 'documentPagesAdded';
export const EVENT_DOCUMENT_PAGE_DELETED = 'documentPageDeleted';
export const EVENT_DOCUMENT_PAGE_UPDATED = 'documentPageUpdated';
export const EVENT_STATE = 'state';
export const EVENT_SYNC_STATE = 'syncState';
