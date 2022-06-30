import dayjs from 'dayjs';

// import required dayjs locales
// import utc from 'dayjs/plugin/utc';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

// export function localize(s: string, ...args) {
//     return l(s, ...args);
// }
// dayjs.extend(utc);
// const dayjs: (...args) => Dayjs = require('dayjs');
// const Duration = require('duration');

// const supportedLanguages = ['en', 'fr'];

export function convertTime(date: number | string | dayjs.Dayjs, formatStr: string) {
    if (date) {
        if (!date['format']) {
            date = dayjs(date);
        }
        return (date as dayjs.Dayjs).format(formatStr);
    }
    return '';
}
