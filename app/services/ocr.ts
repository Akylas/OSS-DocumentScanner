import { ApplicationSettings, Folder, ImageSource, Observable, knownFolders, path } from '@nativescript/core';
import { ocrDocument } from 'plugin-nativeprocessor';
import { OCRDocument } from '~/models/OCRDocument';
import { loadImage, recycleImages } from '~/utils/utils';
import { request } from '@nativescript-community/https';

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
    frm: 'French,Middle(ca.1400–1600)',
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
    currentLanguage: string;
    async start() {
        DEV_LOG && console.log(TAG, 'start');
        this.currentDataPath = ApplicationSettings.getString('tesseract_datapath', path.join(knownFolders.currentApp().path, 'assets', 'tesseract', 'standard'));
        this.currentLanguage = 'fra';
    }

    async ocrPage(document: OCRDocument, pageIndex: number) {
        let ocrImage: ImageSource;
        try {
            const page = document.pages[pageIndex];
            ocrImage = await loadImage(page.imagePath);
            // TODO: apply colorMatrix to image before doing OCR
            const ocrData = await ocrDocument(ocrImage, {
                dataPath: this.currentDataPath,
                language: this.currentLanguage,
                // oem: 0,
                detectContours: 0
            });
            if (ocrData?.blocks?.length) {
                await document.updatePage(pageIndex, {
                    ocrData
                });
                return ocrData;
            }
            return null;
        } catch (error) {
            throw error;
        } finally {
            recycleImages(ocrImage);
        }
    }

    async downloadLanguages(dataType: string, languages: string) {
        const langArray = languages.split('+');
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
        for (let index = 0; index < langArray.length; index++) {
            const lang = langArray[index];
            const url = downloadURL + lang + '.traineddata';
            const destinationFolder = Folder.fromPath(this.baseDataPath).getFolder(dataType);
            const result = await request({ url, method: 'GET' });
            await result.content.toFile(path.join(destinationFolder.path, lang + '.traineddata'));
        }
    }
}
export const ocrService = new OCRService();
