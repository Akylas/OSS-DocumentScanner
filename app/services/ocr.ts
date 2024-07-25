import { ApplicationSettings, File, Folder, ImageSource, Observable, knownFolders, path } from '@nativescript/core';
import { ocrDocument, ocrDocumentFromFile } from 'plugin-nativeprocessor';
import { OCRDocument } from '~/models/OCRDocument';
import { loadImage, recycleImages } from '~/utils/images';
import { HttpsRequestOptions, request } from '@nativescript-community/https';
import { networkService, wrapNativeHttpException } from './api';
import { confirm } from '@nativescript-community/ui-material-dialogs';
import { getCurrentISO3Language, getLocaleDisplayName, l, lc } from '~/helpers/locale';
import { hideLoading, hideSnackMessage, showLoading, showSnackMessage, updateLoadingProgress } from '~/utils/ui';
import { HTTPError, NoNetworkError } from '~/utils/error';
import { wrapNativeException } from '@nativescript/core/utils';

const languages = {
    afr: 'Afrikaans',
    amh: 'Amharic',
    ara: 'Arabic',
    asm: 'Assamese',
    aze: 'Azerbaijani',
    aze_cyrl: 'Azerbaijani-Cyrillic',
    bel: 'Belarusian',
    ben: 'Bengali',
    bod: 'Tibetan',
    bos: 'Bosnian',
    bul: 'Bulgarian',
    cat: 'Catalan;Valencian',
    ceb: 'Cebuano',
    ces: 'Czech',
    chi_sim: 'Chinese-Simplified',
    chi_sim_vert: 'Chinese-Simplified-Vertical',
    chi_tra: 'Chinese-Traditional',
    chi_tra_vert: 'Chinese-Traditional-Vertical',
    chr: 'Cherokee',
    cos: 'Corsican',
    cym: 'Welsh',
    dan: 'Danish',
    dan_frak: 'Danish Fraktur',
    deu: 'German',
    deu_frak: 'German Fraktur',
    div: 'Dhivehi; Divehi; Maldivian',
    dzo: 'Dzongkha',
    ell: 'Greek,Modern(1453-)',
    eng: 'English',
    enm: 'English,Modern(1453-)',
    epo: 'Esperanto',
    eqo: 'equation',
    est: 'Estonian',
    eus: 'Basque',
    fao: 'Faroese',
    fas: 'Persian',
    fil: 'Filipino:Pilipino',
    fin: 'Finnish',
    fra: 'French',
    frk: 'Frankish',
    frm: 'French,Middle(ca.1400-1600)',
    fry: 'Westtern Frisian',
    gla: 'Scottish Gaelic; Gaelic',
    gle: 'Irish',
    glg: 'Galician',
    grc: 'Greek,Ancient(-1453)',
    guj: 'Gujarati',
    hat: 'Haitian;Haitian Creole',
    heb: 'Hebrew',
    hin: 'Hindi',
    hrv: 'Croatian',
    hun: 'Hungarian',
    hye: 'Armenian',
    iku: 'Inuktitut',
    ind: 'Indonesian',
    isl: 'Icelandic',
    ita: 'Italian',
    ita_old: 'Italian-old',
    jav: 'Javanese',
    jpn: 'Japanese',
    jpn_vert: 'Japanese (vertical)',
    kan: 'Kannada',
    kat: 'Georgian',
    kat_old: 'Georgian-old',
    kaz: 'Kazakh',
    khm: 'Central Khmer',
    kir: 'Kirghiz; Kyrgyz',
    kmr: 'Northern Kurdish',
    kor: 'Korean',
    kor_vert: 'Korean (vertical)',
    kur: 'Kurdish',
    lao: 'Lao',
    lat: 'Latin',
    lav: 'Latvian',
    lit: 'Lithuanian',
    ltz: 'Luxembourgish; Letzeburgesch',
    mal: 'Malayalam',
    mar: 'Marathi',
    mkd: 'Macedonian',
    mlt: 'Maltese',
    mon: 'Mongolian',
    mri: 'Maori',
    msa: 'Malay',
    mya: 'Burmese',
    nep: 'Nepali',
    nld: 'Dutch; Flemish',
    nor: 'Norwegian',
    oci: 'Occitan (post 1500)',
    ori: 'Oriya',
    osd: 'OSD',
    pan: 'Panjabi;',
    'pdf.ttf': 'PDF',
    pol: 'Polish',
    por: 'Portuguese',
    pus: 'Pushto;',
    que: 'Quechua',
    ron: 'Romanian;Moldavian;Moldovan',
    rus: 'Russian',
    san: 'Sanskrit',
    sin: 'Sinhala; Sinhalese',
    slk: 'Slovak',
    slk_frak: 'Slovak Fraktur',
    slv: 'Slovenian',
    snd: 'Sindhi',
    spa: 'Spanish;Castilian',
    spa_old: 'Spanish; Castilian-Old',
    sqi: 'Albanian',
    srp: 'Serbian',
    srp_latn: 'Serbian-Latin',
    sun: 'Sundanese',
    swa: 'Swahili',
    swe: 'Swedish',
    syr: 'Syriac',
    tam: 'Tamil',
    tat: 'Tatar',
    tel: 'Telugu',
    tgk: 'Tajik',
    tgl: 'Tagalog',
    tha: 'Thai',
    tir: 'Tigrinya',
    ton: 'Tonga (Tonga Islands)',
    tur: 'Turkish',
    uig: 'Uighur;;Uyghur',
    ukr: 'Ukrainian',
    urd: 'Urdu',
    uzb: 'Uzbek',
    uzb_cyrl: 'Uzbek-Cyrillic',
    vie: 'Vietnamese',
    yid: 'Yiddish',
    yor: 'Yoruba'
};

const TAG = 'OCRService';

export class OCRService extends Observable {
    baseDataPath = ApplicationSettings.getString('tesseract_datapath_base', path.join(knownFolders.documents().path, 'tesseract'));
    currentDataPath: string;
    mLanguages: string;
    mDataType: 'best' | 'standard' | 'fast';
    mDownloadedLanguages: string[] = [];
    async start() {
        this.languages = ApplicationSettings.getString('tesseract_languages', getCurrentISO3Language());
        this.dataType = ApplicationSettings.getString('tesseract_datatype', 'best') as any;
    }

    get downloadedLanguages() {
        return this.mDownloadedLanguages;
    }

    set languages(value) {
        this.mLanguages = value;
        ApplicationSettings.setString('tesseract_languages', value);
    }
    get languages() {
        return this.mLanguages;
    }
    get languagesArray() {
        return this.mLanguages.split('+');
    }

    updateDownloadedLanguages() {
        const setting = ApplicationSettings.getString(`tesseract_data_${this.mDataType}`, null);
        if (setting === null) {
            this.mDownloadedLanguages = Folder.fromPath(this.currentDataPath)
                .getEntitiesSync()
                .map((e) => e.name.split('.').slice(0, -1).join('.'));
            ApplicationSettings.setString(`tesseract_data_${this.mDataType}`, JSON.stringify(this.mDownloadedLanguages));
        } else {
            this.mDownloadedLanguages = JSON.parse(setting);
        }
        return this.mDownloadedLanguages;
    }
    set dataType(value) {
        this.mDataType = value;
        ApplicationSettings.setString('tesseract_datatype', value);
        this.currentDataPath = path.join(this.baseDataPath, value);
        this.updateDownloadedLanguages();
    }
    get dataType() {
        return this.mDataType;
    }
    get qualities() {
        return ['standard', 'best', 'fast'];
    }

    get availableLanguages() {
        return Object.keys(languages);
    }

    localizedLanguage(key: string) {
        const result = getLocaleDisplayName(key, true);
        return result?.length && result !== key ? result : languages[key];
    }

    addLanguages(...languages) {
        const array = this.languagesArray;
        let needsUpdate = false;
        for (let index = 0; index < languages.length; index++) {
            const language = languages[index];
            if (array.indexOf(language) === -1) {
                needsUpdate = true;
                array.push(language);
            }
        }
        if (needsUpdate) {
            this.languages = array.join('+');
        }
    }
    removeLanguages(...languages) {
        const array = this.languagesArray;
        let needsUpdate = false;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const index = array.indexOf(language);
            if (index !== -1) {
                needsUpdate = true;
                array.splice(index, 1);
            }
        }
        if (needsUpdate) {
            this.languages = array.join('+');
        }
    }

    async ocrPage(document: OCRDocument, pageIndex: number, onProgress?: (progress: number) => void) {
        const page = document.pages[pageIndex];
        // TODO: apply colorMatrix to image before doing OCR
        const ocrData = await ocrDocumentFromFile(
            page.imagePath,
            {
                dataPath: this.currentDataPath,
                language: this.mLanguages,
                rotation: page.rotation,
                // oem: 0,
                detectContours: 0,
                trim: false
            },
            onProgress
        );
        if (ocrData?.blocks?.length) {
            await document.updatePage(pageIndex, {
                ocrData
            });
            return ocrData;
        }
    }

    async checkOrDownload(dataType: string, languages: string, hideLoading = true, showAsSnackMessage = false) {
        const langArray = languages.split('+');
        const toDownload = [];
        const destinationFolder = Folder.fromPath(this.baseDataPath).getFolder(dataType);
        for (let index = 0; index < langArray.length; index++) {
            const lang = langArray[index];
            if (!File.exists(path.join(destinationFolder.path, lang + '.traineddata'))) {
                toDownload.push(lang);
            }
        }
        if (toDownload.length) {
            const result = await confirm({
                message: lc('ocr_missing_languages', toDownload.map((l) => this.localizedLanguage(l)).join(',')),
                okButtonText: lc('download'),
                cancelButtonText: lc('cancel')
            });
            if (result) {
                if (!networkService.connected) {
                    throw new NoNetworkError();
                }
                await this.downloadLanguages(dataType, toDownload, hideLoading, showAsSnackMessage);
            } else {
                return false;
            }
        }
        return true;
    }

    async downloadLanguages(dataType: string, langArray: string[], hideLoadingDialog = true, showAsSnackMessage = false) {
        let downloadURL;
        switch (dataType) {
            case 'best':
                downloadURL = 'https://github.com/tesseract-ocr/tessdata_best/raw/4.0.0/';
                break;
            case 'standard':
                downloadURL = 'https://github.com/tesseract-ocr/tessdata/raw/4.0.0/';
                break;
            default:
                downloadURL = 'https://github.com/tesseract-ocr/tessdata_fast/raw/4.0.0/';
        }
        function updateProgress(progress) {
            if (showAsSnackMessage) {
                showSnackMessage({ text: l('downloading', progress), progress });
            } else {
                showLoading({ text: l('downloading', progress), progress });
            }
        }
        updateProgress(0);
        // TODO: show notification
        for (let index = 0; index < langArray.length; index++) {
            const lang = langArray[index];
            const url = downloadURL + lang + '.traineddata';
            const destinationFolder = Folder.fromPath(this.baseDataPath).getFolder(dataType);
            const destinationFile = path.join(destinationFolder.path, lang + '.traineddata');
            const requestParams = {
                url,
                method: 'GET'
            } as HttpsRequestOptions;
            try {
                const result = await request({
                    ...requestParams,
                    onProgress(current, total) {
                        const progress = Math.round(((index + current / total) / langArray.length) * 100);
                        updateProgress(progress);
                    }
                });
                await result.content.toFile(destinationFile);
                this.mDownloadedLanguages.push(lang);
                ApplicationSettings.setString(`tesseract_data_${this.mDataType}`, JSON.stringify(this.mDownloadedLanguages));
            } catch (error) {
                if (File.exists(destinationFile)) {
                    File.fromPath(destinationFile).remove();
                }
                throw wrapNativeHttpException(error, requestParams);
            }
        }
        if (hideLoadingDialog) {
            if (showAsSnackMessage) {
                await hideSnackMessage();
            } else {
                await hideLoading();
            }
        }
        this.updateDownloadedLanguages();
    }
}
export const ocrService = new OCRService();
