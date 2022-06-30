import { l, lc, loadLocaleJSON, lt, lu } from '@nativescript-community/l';
import { ApplicationSettings } from '@nativescript/core';
import { getString, setString } from '@nativescript/core/application-settings';
import { Device } from '@nativescript/core/platform';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { derived, writable } from 'svelte/store';
import { prefs } from '~/services/preferences';
import { showBottomSheet } from '~/utils/svelte/bottomsheet';
import { createGlobalEventListener, globalObservable } from '~/variables';
const supportedLanguages = SUPPORTED_LOCALES;

dayjs.extend(updateLocale);
// dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

export let lang;
let currentLocale = null;
export const $lang = writable(null);
export const onLanguageChanged = createGlobalEventListener('language');

$lang.subscribe((newLang: string) => {
    if (lang === newLang) {
        return;
    }
    lang = newLang;
    if (lang === null) {
        return;
    }
    // console.log('changed lang', lang, newLang, Device.region);
    try {
        require(`dayjs/locale/${newLang}`);
    } catch (err) {
        console.error('failed to load dayjs locale', lang, `dayjs/locale/${newLang}`, err);
    }
    dayjs.locale(lang); // switch back to default English locale globally
    if (lang === 'fr') {
        dayjs.updateLocale('fr', {
            calendar: {
                lastDay: '[Hier à] LT',
                sameDay: "[Aujourd'hui à] LT",
                nextDay: '[Demain à] LT',
                lastWeek: 'dddd [dernier] [à] LT',
                nextWeek: 'dddd [à] LT',
                sameElse: 'L'
            }
        });
    }

    try {
        const localeData = require(`~/i18n/${lang}.json`);
        loadLocaleJSON(localeData);
    } catch (err) {
        console.error('failed to load lang json', lang, `~/i18n/${lang}.json`, err);
    }
    globalObservable.notify({ eventName: 'language', data: lang });
});
function setLang(newLang) {
    newLang = getActualLanguage(newLang);
    if (supportedLanguages.indexOf(newLang) === -1) {
        newLang = 'en';
    }
    // console.log('changed lang', newLang, Device.region);
    currentLocale = null;
    $lang.set(newLang);
}
function getActualLanguage(language) {
    switch (language) {
        case 'en':
            return 'en';
        case 'cs':
            return 'cz';
        case 'jp':
            return 'ja';
        case 'kr':
            return 'kr';
        case 'lv':
            return 'la';
        case 'auto':
            return Device.language.split('-')[0].toLowerCase();
        default:
            return language;
    }
}

function titlecase(str: string) {
    let upper = true;
    let newStr = '';
    for (let i = 0, l = str.length; i < l; i++) {
        if (str[i] === ' ') {
            upper = true;
            newStr += ' ';
            continue;
        }
        newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
        upper = false;
    }
    return newStr;
}
export function getLocaleDisplayName(locale?) {
    if (__IOS__) {
        if (!currentLocale) {
            //@ts-ignore
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

export async function selectLanguage() {
    try {
        const actions = SUPPORTED_LOCALES;
        const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
        const result = await showBottomSheet<any>({
            view: OptionSelect,
            props: {
                title: lc('select_language'),
                options: actions.map((k) => ({ name: getLocaleDisplayName(k), data: k }))
            },
            trackingScrollView: 'collectionView'
        });
        if (result && actions.indexOf(result.data) !== -1) {
            ApplicationSettings.setString('language', result.data);
        }
    } catch (err) {
        this.showError(err);
    }
}
export function convertTime(date: number | string | dayjs.Dayjs | Date, formatStr: string) {
    if (date) {
        if (!date['format']) {
            date = dayjs(date);
        }
        return (date as dayjs.Dayjs).format(formatStr);
    }
    return '';
}

export function convertDuration(date, formatStr: string = 'H [hrs], m [min]') {
    const test = new Date(date);
    test.setTime(test.getTime() + test.getTimezoneOffset() * 60 * 1000);
    const result = dayjs(test).format(formatStr);
    return result;
}

// const rtf = new Intl.RelativeTimeFormat('es');

prefs.on('key:language', () => {
    const newLanguage = getString('language');
    // on pref change we are updating
    if (newLanguage === lang) {
        return;
    }
    setLang(newLanguage);
});

let currentLanguage = getString('language', DEFAULT_LOCALE);
if (!currentLanguage) {
    currentLanguage = Device.language.split('-')[0].toLowerCase();
    setString('language', currentLanguage);
} else {
    setLang(currentLanguage);
}

export { l, lc, lu, lt };
export const sl = derived([$lang], () => l);
export const slc = derived([$lang], () => lc);
export const slt = derived([$lang], () => lt);
export const slu = derived([$lang], () => lu);
export const sconvertDuration = derived([$lang], () => convertDuration);
export const scconvertTime = derived([$lang], () => convertTime);
export const sgetLocaleDisplayName = derived([$lang], () => getLocaleDisplayName);
