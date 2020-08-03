import { locals } from '~/variables.module.scss';
import { Screen } from '@nativescript/core/platform';
import { ad } from '@nativescript/core/utils/utils';
import { prefs } from '~/services/preferences';
import { getString } from '@nativescript/core/application-settings';

export const primaryColor: string = locals.primaryColor;
export const accentColor: string = locals.accentColor;
export const darkColor: string = locals.darkColor;
export const backgroundColor: string = locals.backgroundColor;
export const latoFontFamily: string = locals.latoFontFamily;
export const mdiFontFamily: string = locals.mdiFontFamily;
export const forecastFontFamily: string = locals.forecastFontFamily;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const statusBarHeight: number = parseFloat(locals.statusBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export const screenScale = Screen.mainScreen.scale;
export let navigationBarHeight: number = parseFloat(locals.navigationBarHeight);

if (global.isAndroid) {
    const context: android.content.Context = ad.getApplicationContext();
    const hasPermanentMenuKey = android.view.ViewConfiguration.get(context).hasPermanentMenuKey();
    if (hasPermanentMenuKey) {
        navigationBarHeight = 0;
    }
} else {
    navigationBarHeight = 0;
}

export let textColor;
export let borderColor;
export let textLightColor;

export let subtitleColor;
export let iconColor;

let theme;
function updateThemeColors() {
    theme = getString('theme', 'dark');
    if (theme === 'light') {
        textColor = '#000000';
        textLightColor = '#444444';
        borderColor = '#444444';
        subtitleColor = '#444444';
        iconColor = '#444444';
    } else {
        textColor = '#ffffff';
        textLightColor = '#aaaaaa';
        borderColor = '#55cccccc';
        subtitleColor = '#aaaaaa';
        iconColor = '#aaaaaa';
    }
}

updateThemeColors();
prefs.on('key:theme', updateThemeColors);
