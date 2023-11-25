import Theme from '@nativescript-community/css-theme';
import { Application, Device, EventData, Utils } from '@nativescript/core';
import { getBoolean, getString, setString } from '@nativescript/core/application-settings';
import { prefs } from '~/services/preferences';
import { showError } from '~/utils/error';
import { showBottomSheet } from '@nativescript-community/ui-material-bottomsheet/svelte';
import { colors, createGlobalEventListener, globalObservable, updateThemeColors } from '~/variables';
import { lc } from '~/helpers/locale';
import { get, writable } from 'svelte/store';
import { SDK_VERSION } from '@nativescript/core/utils';

export type Themes = 'auto' | 'light' | 'dark' | 'black';

export const onThemeChanged = createGlobalEventListener('theme');
export let theme: Themes;
export const sTheme = writable('auto');
export const currentTheme = writable('auto');

let started = false;
let autoDarkToBlack = getBoolean('auto_black', false);
const ThemeBlack = 'ns-black';

Application.on(Application.systemAppearanceChangedEvent, (event: EventData & { newValue }) => {
    DEV_LOG && console.log('systemAppearanceChangedEvent', theme, event.newValue, autoDarkToBlack);
    if (theme === 'auto') {
        let theme = event.newValue;
        if (autoDarkToBlack && theme === 'dark') {
            theme = 'black';
        }
        if (__ANDROID__) {
            // const activity = Application.android.startActivity;
            com.akylas.documentscanner.Utils.applyDayNight(Application.android.startActivity);
            // try {
            //     activity.getDelegate().applyDayNight();
            // } catch (error) {
            //     console.error(error, error.stack);
            // }
            // com.google.android.material.color.DynamicColors.applyIfAvailable(activity);
        }
        // no need to do it on android as we re create the activity (if configChanges:uiMode is missing)
        // if (__IOS__) {
        updateThemeColors(theme);
        // }

        globalObservable.notify({ eventName: 'theme', data: { theme, colors: get(colors) } });
    }
});

export function getThemeDisplayName(toDisplay = theme) {
    switch (toDisplay) {
        case 'auto':
            return lc('system');
        case 'dark':
            return lc('dark');
        case 'light':
            return lc('light');
    }
}

export function toggleTheme(autoDark = false) {
    const newTheme = theme === 'dark' ? (autoDark ? 'auto' : 'light') : 'dark';
    setString('theme', newTheme);
}
export async function selectTheme() {
    try {
        const actions: Themes[] = ['auto', 'light', 'dark'];
        const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
        const result = await showBottomSheet<{ data; name }>({
            parent: null,
            view: OptionSelect,
            props: {
                title: lc('select_language'),
                options: actions.map((k) => ({ name: getThemeDisplayName(k), data: k }))
            },
            trackingScrollView: 'collectionView'
        });
        if (result && actions.indexOf(result.data) !== -1) {
            setString('theme', result.data);
        }
    } catch (err) {
        showError(err);
    }
}

const AppCompatDelegate = __ANDROID__ ? androidx.appcompat.app.AppCompatDelegate : undefined;
export function applyTheme(theme: Themes) {
    try {
        DEV_LOG && console.log('applyTheme', theme);
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return Application.systemAppearance;
}

export function getRealTheme(theme) {
    DEV_LOG && console.log('getRealTheme', theme);
    if (theme === 'auto') {
        try {
            theme = getSystemAppearance();
            if (autoDarkToBlack && theme === 'dark') {
                theme = 'black';
            }
        } catch (err) {
            console.error('getRealTheme', err, err.stack);
        }
    }
    return theme;
}

export function getRealThemeAndUpdateColors() {
    const realTheme = getRealTheme(theme);
    updateThemeColors(realTheme);
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
            updateThemeColors(realTheme);
            globalObservable.notify({ eventName: 'theme', data: { theme: realTheme, colors: get(colors) } });
        }
    });

    prefs.on('key:theme', () => {
        let newTheme = getString('theme') as Themes;
        DEV_LOG && console.log('key:theme', theme, newTheme, autoDarkToBlack);
        if (__IOS__ && SDK_VERSION < 13) {
            newTheme = 'light';
        }
        // on pref change we are updating
        if (newTheme === theme) {
            return;
        }

        theme = newTheme;
        sTheme.set(newTheme);
        applyTheme(newTheme);
        const realTheme = getRealTheme(newTheme);
        currentTheme.set(realTheme);
        updateThemeColors(realTheme);
        setTimeout(() => {
            globalObservable.notify({ eventName: 'theme', data: { theme: realTheme, colors: get(colors) } });
        }, 100);
        // if (__ANDROID__) {
        //     // we recreate the activity to get the change
        //     const activity = Application.android.startActivity as androidx.appcompat.app.AppCompatActivity;
        //     activity.recreate();
        //     if (Application.android.foregroundActivity !== activity) {
        //         (Application.android.foregroundActivity as androidx.appcompat.app.AppCompatActivity).recreate();
        //     }
        // }
    });
    const realTheme = getRealTheme(theme);
    currentTheme.set(realTheme);
    if (__ANDROID__) {
        const context = Utils.android.getApplicationContext();
        if (context) {
            applyTheme(theme);
        } else {
            Application.on(Application.launchEvent, () => {
                applyTheme(theme);
                updateThemeColors(realTheme);
            });
        }
        // we need to update the theme on every activity start
        Application.on('activity_started', () => {
            DEV_LOG && console.log('activity_started');
            if (Application.getRootView()) {
                getRealThemeAndUpdateColors();
            }
        });
        // no need to update colors now will be done later
        // updateThemeColors(realTheme);
    } else {
        if (Application.ios && Application.ios.window) {
            applyTheme(theme);
            updateThemeColors(realTheme);
        } else {
            updateThemeColors(realTheme);
            Application.on(Application.displayedEvent, () => {
                applyTheme(theme);
                updateThemeColors(realTheme);
            });
        }
    }
}
