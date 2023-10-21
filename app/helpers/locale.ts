import { capitalize, l, lc, loadLocaleJSON, lt, lu, overrideNativeLocale, titlecase } from '@nativescript-community/l';
import { ApplicationSettings, Device, File, Utils } from '@nativescript/core';
import { getString } from '@nativescript/core/application-settings';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { derived, writable } from 'svelte/store';
import { prefs } from '~/services/preferences';
import { createGlobalEventListener, globalObservable } from '~/variables';
const supportedLanguages = SUPPORTED_LOCALES;
dayjs.extend(LocalizedFormat);

export let lang;
export const $lang = writable(null);
let default24Clock = false;
if (__ANDROID__) {
    default24Clock = android.text.format.DateFormat.is24HourFormat(Utils.ad.getApplicationContext());
}
export let clock_24 = ApplicationSettings.getBoolean('clock_24', default24Clock) || default24Clock;
export const clock_24Store = writable(null);

export const onLanguageChanged = createGlobalEventListener('language');
export const onTimeChanged = createGlobalEventListener('time');

$lang.subscribe((newLang: string) => {
    lang = newLang;
    if (!lang) {
        return;
    }
    // console.log('changed lang', lang, Device.region);
    try {
        require(`dayjs/locale/${newLang}.js`);
    } catch (err) {
        console.error('failed to load dayjs locale', lang, `~/dayjs/${newLang}`, err, err.stack);
    }
    dayjs.locale(lang); // switch back to default English locale globally
    try {
        const localeData = require(`~/i18n/${lang}.json`);
        loadLocaleJSON(localeData);
    } catch (err) {
        console.error('failed to load lang json', lang, `~/i18n/${lang}.json`, File.exists(`~/i18n/${lang}.json`), err, err.stack);
    }
    globalObservable.notify({ eventName: 'language', data: lang });
});
function setLang(newLang) {
    newLang = getActualLanguage(newLang);
    if (supportedLanguages.indexOf(newLang) === -1) {
        newLang = newLang.split('-')[0].toLowerCase();
        if (supportedLanguages.indexOf(newLang) === -1) {
            newLang = 'en';
        }
    }
    if (__IOS__) {
        overrideNativeLocale(newLang);
    } else {
        // Application.android.foregroundActivity?.recreate();
        try {
            const appLocale = androidx.core.os.LocaleListCompat.forLanguageTags(newLang);
            // Call this on the main thread as it may require Activity.restart()
            androidx.appcompat.app.AppCompatDelegate['setApplicationLocales'](appLocale);
        } catch (error) {
            console.error(error);
        }
    }
    $lang.set(newLang);
}

const deviceLanguage = getString('language', DEFAULT_LOCALE);
function getActualLanguage(language) {
    if (language === 'auto') {
        language = Device.language;
    }
    switch (language) {
        case 'cs':
            return 'cz';
        case 'jp':
            return 'ja';
        case 'lv':
            return 'la';
        default:
            return language;
    }
}

// const rtf = new Intl.RelativeTimeFormat('es');

export function formatDate(date: number | string | dayjs.Dayjs, formatStr: string = 'dddd LT') {
    if (date) {
        if (!date['format']) {
            date = dayjs(date);
        }

        if (clock_24 && formatStr.indexOf('LT') >= 0) {
            formatStr.replace(/LT/g, 'HH:mm');
        } else if (clock_24 && formatStr.indexOf('LTS') >= 0) {
            // formatStr = 'HH:mm:ss';
            formatStr.replace(/LTS/g, 'HH:mm:ss');
        }
        return capitalize((date as dayjs.Dayjs).format(formatStr));
    }
    return '';
}
export function formatTime(date: number | dayjs.Dayjs | string | Date, formatStr: string = 'LT') {
    if (date) {
        if (!date['format']) {
            date = dayjs(date);
        }
        if (clock_24 && formatStr === 'LT') {
            formatStr = 'HH:mm';
        } else if (clock_24 && formatStr === 'LTS') {
            formatStr = 'HH:mm:ss';
        }
        return (date as dayjs.Dayjs).format(formatStr);
    }
    return '';
}

prefs.on('key:language', () => {
    const newLanguage = getString('language');
    DEV_LOG && console.log('language changed', newLanguage);
    // on pref change we are updating
    if (newLanguage === lang) {
        return;
    }
    setLang(newLanguage);
});

prefs.on('key:clock_24', () => {
    const newValue = ApplicationSettings.getBoolean('clock_24', default24Clock);
    DEV_LOG && console.log('clock_24 changed', newValue);
    clock_24 = newValue;
    clock_24Store.set(newValue);
    // we fake a language change to update the UI
    globalObservable.notify({ eventName: 'language', data: lang });
});

let currentLocale = null;
export function getLocaleDisplayName(locale?) {
    if (__IOS__) {
        if (!currentLocale) {
            currentLocale = NSLocale.alloc().initWithLocaleIdentifier(lang);
        }
        return titlecase(currentLocale.localizedStringForLanguageCode(locale || lang));
    } else {
        if (!currentLocale) {
            currentLocale = java.util.Locale.forLanguageTag(lang);
        }
        return titlecase(java.util.Locale.forLanguageTag(locale || lang).getDisplayLanguage(currentLocale));
    }
}

setLang(deviceLanguage);

export { l, lc, lt, lu };
export const sl = derived([$lang], () => l);
export const slc = derived([$lang], () => lc);
export const slt = derived([$lang], () => lt);
export const slu = derived([$lang], () => lu);
// export const sconvertDuration = derived([$lang], () => convertDuration);
export const scformatDate = derived($lang, () => formatDate);
export const scformatTime = derived([$lang, clock_24Store], () => formatTime);
export const sgetLocaleDisplayName = derived([$lang], () => getLocaleDisplayName);
