import { ApplicationSettings, Device } from '@nativescript/core';
import { DEFAULT_LOCALE, SETTINGS_LANGUAGE } from '@shared/constants';

const supportedLanguages = SUPPORTED_LOCALES;
export const deviceLanguage = ApplicationSettings.getString(SETTINGS_LANGUAGE, DEFAULT_LOCALE);
export function getActualLanguage(language: string = deviceLanguage) {
    if (language === 'auto') {
        if (__ANDROID__) {
            // N Device.language reads app config which thus does return locale app language and not device language
            language = java.util.Locale.getDefault().toLanguageTag();
        } else {
            language = Device.language;
        }
    }

    if (supportedLanguages.indexOf(language) === -1) {
        language = language.split('-')[0].toLowerCase();
        if (supportedLanguages.indexOf(language) === -1) {
            language = 'en';
        }
    }

    switch (language) {
        // case 'cs':
        //     language = 'cz';
        //     break;
        case 'jp':
            language = 'ja';
            break;
        case 'lv':
            language = 'la';
            break;
    }
    return language;
}
