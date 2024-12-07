import { AppUtilsAndroid, restartApp } from '@akylas/nativescript-app-utils';
import Theme from '@nativescript-community/css-theme';
import { confirm } from '@nativescript-community/ui-material-dialogs';
import { closePopover } from '@nativescript-community/ui-popover/svelte';
import { Application, ApplicationSettings, SystemAppearanceChangedEventData, Utils } from '@nativescript/core';
import { getBoolean, getString, setString } from '@nativescript/core/application-settings';
import { SDK_VERSION } from '@nativescript/core/utils';
import { setCustomCssRootClass } from '@shared/utils';
import { showError } from '@shared/utils/showError';
import { createGlobalEventListener, globalObservable } from '@shared/utils/svelte/ui';
import { writable } from 'svelte/store';
import { lc } from '~/helpers/locale';
import { prefs } from '~/services/preferences';
import { ALERT_OPTION_MAX_HEIGHT, DEFAULT_COLOR_THEME, SETTINGS_COLOR_THEME } from '~/utils/constants';
import { showAlertOptionSelect } from '~/utils/ui';
import { updateThemeColors } from '~/variables';

export type Themes = 'auto' | 'light' | 'dark' | 'black';
export type ColorThemes = 'default' | 'eink' | 'dynamic';

export const onThemeChanged = createGlobalEventListener('theme');
export let theme: Themes;
export let colorTheme: ColorThemes;
export const currentTheme = writable('auto');
export const currentRealTheme = writable('auto');
export const currentColorTheme = writable(DEFAULT_COLOR_THEME);

let started = false;
let autoDarkToBlack = getBoolean('auto_black', false);
colorTheme = getString(SETTINGS_COLOR_THEME, DEFAULT_COLOR_THEME) as ColorThemes;
const ThemeBlack = 'ns-black';
export let useDynamicColors = colorTheme === 'dynamic';
export let isEInk = colorTheme === 'eink';

Application.on(Application.systemAppearanceChangedEvent, (event: SystemAppearanceChangedEventData) => {
    try {
        DEV_LOG && console.log('systemAppearanceChangedEvent', theme, event.newValue, autoDarkToBlack);
        if (theme === 'auto') {
            event.cancel = true;
            let realTheme = event.newValue as Themes;
            if (autoDarkToBlack && realTheme === 'dark') {
                realTheme = 'black';
            }
            if (__ANDROID__) {
                const activity = Application.android.startActivity;
                if (activity) {
                    AppUtilsAndroid.applyDayNight(activity, useDynamicColors);
                }
            }
            Theme.setMode(Theme.Auto, undefined, realTheme, false);
            updateThemeColors(realTheme, colorTheme);
            //close any popover as they are not updating with theme yet
            closePopover();
            currentRealTheme.set(realTheme);
            DEV_LOG && console.log('systemAppearanceChangedEvent notify', realTheme);
            globalObservable.notify({ eventName: 'theme', data: realTheme });
        }
    } catch (error) {
        showError(error);
    }
});

export function getThemeDisplayName(toDisplay = theme) {
    switch (toDisplay) {
        case 'auto':
            return lc('theme.auto');
        case 'dark':
            return lc('theme.dark');
        case 'black':
            return lc('theme.black');
        case 'light':
            return lc('theme.light');
    }
}
export function getColorThemeDisplayName(toDisplay = colorTheme) {
    switch (toDisplay) {
        case 'default':
            return lc('color_theme.default');
        case 'dynamic':
            return lc('color_theme.dynamic');
        case 'eink':
            return lc('color_theme.eink');
    }
}

export function toggleTheme(autoDark = false) {
    const newTheme = theme === 'dark' ? (autoDark ? 'auto' : 'light') : 'dark';
    setString('theme', newTheme);
}
export async function selectTheme() {
    try {
        const actions: Themes[] = ['auto', 'light', 'dark', 'black'];
        const result = await showAlertOptionSelect(
            {
                height: Math.min(actions.length * 56, ALERT_OPTION_MAX_HEIGHT),
                rowHeight: 56,
                options: actions
                    .map((k) => ({ name: getThemeDisplayName(k), data: k }))
                    .map((d) => ({
                        ...d,
                        boxType: 'circle',
                        type: 'checkbox',
                        value: theme === d.data
                    }))
            },
            {
                title: lc('select_theme')
            }
        );
        if (result && actions.indexOf(result.data) !== -1) {
            setString('theme', result.data);
        }
    } catch (err) {
        showError(err);
    }
}

export async function selectColorTheme() {
    try {
        const actions: ColorThemes[] = ['default', 'eink'];
        if (__ANDROID__ && SDK_VERSION >= 31) {
            actions.push('dynamic');
        }
        const result = await showAlertOptionSelect(
            {
                height: Math.min(actions.length * 56, ALERT_OPTION_MAX_HEIGHT),
                rowHeight: 56,
                options: actions
                    .map((k) => ({ name: getColorThemeDisplayName(k), data: k }))
                    .map((d) => ({
                        ...d,
                        boxType: 'circle',
                        type: 'checkbox',
                        value: colorTheme === d.data
                    }))
            },
            {
                title: lc('select_color_theme')
            }
        );
        if (result && actions.indexOf(result.data) !== -1) {
            setString('color_theme', result.data);
        }
    } catch (err) {
        showError(err);
    }
}

const AppCompatDelegate = __ANDROID__ ? androidx.appcompat.app.AppCompatDelegate : undefined;
export function applyTheme(theme: Themes) {
    try {
        switch (theme) {
            case 'auto':
                Theme.setMode(Theme.Auto);
                if (__ANDROID__) {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                } else {
                    if (Application.ios.window) {
                        Application.ios.window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Unspecified;
                    }
                }
                break;
            case 'light':
                Theme.setMode(Theme.Light);
                if (__ANDROID__) {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                } else {
                    if (Application.ios.window) {
                        Application.ios.window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Light;
                    }
                }
                break;
            case 'dark':
                Theme.setMode(Theme.Dark);
                if (__ANDROID__) {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                } else {
                    if (Application.ios.window) {
                        Application.ios.window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
                    }
                }
                break;
            case 'black':
                Theme.setMode(ThemeBlack);
                if (__ANDROID__) {
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                } else {
                    if (Application.ios.window) {
                        Application.ios.window.overrideUserInterfaceStyle = UIUserInterfaceStyle.Dark;
                    }
                }
                break;
        }
    } catch (error) {
        console.error('applyTheme', error, error.stack);
    }
}

function getSystemAppearance() {
    if (typeof Application.systemAppearance === 'function') {
        return Application.systemAppearance();
    }

    return Application.systemAppearance;
}

export function getRealTheme(th = theme) {
    if (th === 'auto') {
        try {
            th = getSystemAppearance() as any;
            if (autoDarkToBlack && th === 'dark') {
                th = 'black';
            }
        } catch (err) {
            console.error('getRealTheme', err, err.stack);
        }
    }
    return th;
}

export function isDarkTheme(th: string = getRealTheme(theme)) {
    return th === 'dark' || th === 'black';
}

export function getRealThemeAndUpdateColors() {
    const realTheme = getRealTheme(theme);
    updateThemeColors(realTheme, colorTheme);
}

export function start() {
    if (started) {
        return;
    }
    started = true;
    if (__IOS__ && SDK_VERSION < 13) {
        theme = 'light';
    } else {
        theme = getString('theme', DEFAULT_THEME) as Themes;
    }
    if (theme.length === 0) {
        theme = DEFAULT_THEME as Themes;
    }

    prefs.on('key:auto_black', () => {
        autoDarkToBlack = getBoolean('auto_black');
        DEV_LOG && console.log('key:auto_black', theme, autoDarkToBlack);
        if (theme === 'auto') {
            const realTheme = getRealTheme(theme);
            currentTheme.set(realTheme);
            updateThemeColors(realTheme, colorTheme);
            globalObservable.notify({ eventName: 'theme', data: realTheme });
        }
    });

    prefs.on(`key:${SETTINGS_COLOR_THEME}`, async () => {
        const newColorTheme = getString(SETTINGS_COLOR_THEME) as ColorThemes;
        const oldColorTheme = colorTheme;
        colorTheme = newColorTheme;
        useDynamicColors = colorTheme === 'dynamic';
        isEInk = colorTheme === 'eink';
        currentColorTheme.set(colorTheme);
        if (__ANDROID__) {
            if (colorTheme !== DEFAULT_COLOR_THEME) {
                const context = Utils.android.getApplicationContext();
                let nativeTheme;
                switch (colorTheme) {
                    case 'eink':
                        nativeTheme = 'AppTheme.EInk';
                        break;
                }
                if (nativeTheme) {
                    const themeId = context.getResources().getIdentifier(nativeTheme, 'style', context.getPackageName());
                    DEV_LOG && console.log(SETTINGS_COLOR_THEME, nativeTheme, themeId);
                    ApplicationSettings.setNumber('SET_THEME_ON_LAUNCH', themeId);
                } else {
                    ApplicationSettings.remove('SET_THEME_ON_LAUNCH');
                }
            } else {
                ApplicationSettings.remove('SET_THEME_ON_LAUNCH');
            }
            const result = await confirm({
                message: lc('restart_app'),
                okButtonText: lc('restart'),
                cancelButtonText: lc('later')
            });
            if (result) {
                restartApp();
            }
        } else {
            setCustomCssRootClass(colorTheme, oldColorTheme);
        }
        updateThemeColors(getRealTheme(theme), colorTheme);
        globalObservable.notify({ eventName: 'color_theme', data: colorTheme });
    });

    prefs.on('key:theme', () => {
        let newTheme = getString('theme', DEFAULT_THEME) as Themes;
        DEV_LOG && console.log('key:theme', theme, newTheme, autoDarkToBlack);
        if (__IOS__ && SDK_VERSION < 13) {
            newTheme = 'light';
        }
        // on pref change we are updating
        if (newTheme === theme) {
            return;
        }

        theme = newTheme;

        const realTheme = getRealTheme(newTheme);
        currentTheme.set(realTheme);

        applyTheme(newTheme);
        updateThemeColors(realTheme, colorTheme);
        if (__ANDROID__) {
            const activity = Application.android.startActivity;
            if (activity) {
                AppUtilsAndroid.applyDayNight(activity, useDynamicColors);
            }
        }
        currentRealTheme.set(realTheme);
        setTimeout(() => {
            globalObservable.notify({ eventName: 'theme', data: realTheme });
        }, 0);
    });

    function onReady() {
        setCustomCssRootClass(colorTheme);
        DEV_LOG && console.log('onReady', theme, colorTheme);
        applyTheme(theme);
        const realTheme = getRealTheme(theme);
        currentTheme.set(realTheme);
        currentRealTheme.set(realTheme);
        if (__IOS__) {
            updateThemeColors(realTheme, colorTheme);
        }
    }
    if (__ANDROID__) {
        const context = Utils.android.getApplicationContext();
        if (context) {
            onReady();
        } else {
            Application.once(Application.launchEvent, onReady);
        }

        // we need to update the theme on every activity start
        // to get dynamic colors
        Application.android.on(Application.android.activityStartedEvent, (event) => {
            if (event.activity['isNativeScriptActivity'] === true) {
                if (useDynamicColors) {
                    AppUtilsAndroid.applyDynamicColors(event.activity);
                }
                getRealThemeAndUpdateColors();
            }
        });
    } else {
        // without rootController systemAppearance will be null
        if (Application.ios?.rootController) {
            onReady();
        } else {
            Application.once(Application.initRootViewEvent, onReady);
        }
    }
}
