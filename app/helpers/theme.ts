import Theme from '@nativescript-community/css-theme';
import { Application } from '@nativescript/core';
import { getString, setString } from '@nativescript/core/application-settings';
import { SDK_VERSION } from '@nativescript/core/utils';
import { writable } from 'svelte/store';
import { prefs } from '~/services/preferences';
import { createGlobalEventListener, globalObservable, updateThemeColors } from '~/variables';

export type Themes = 'auto' | 'light' | 'dark';

export const onThemeChanged = createGlobalEventListener('theme');

export let theme: Themes;
export const currentTheme = writable('auto');
export const sTheme = writable('auto');

Application.on(Application.systemAppearanceChangedEvent, (event) => {
    if (theme === 'auto') {
        currentTheme.set(event.newValue);
        updateThemeColors(event.newValue);
        globalObservable.notify({ eventName: 'theme', data: event.newValue });
    }
});

// export function getThemeDisplayName(toDisplay = theme) {
//     switch (toDisplay) {
//         case 'auto':
//             return lc('auto');
//         case 'dark':
//             return lc('dark');
//         case 'light':
//             return lc('light');
//     }
// }

// export async function selectTheme() {
//     try {
//         const actions: Themes[] = ['auto', 'light', 'dark'];
//         const OptionSelect = (await import('~/components/OptionSelect.svelte')).default;
//         const result = await showBottomSheet<any>({
//             view: OptionSelect,
//             parent: null,
//             props: {
//                 title: lc('select_language'),
//                 options: actions.map((k) => ({ name: getThemeDisplayName(k), data: k }))
//             },
//             trackingScrollView: 'collectionView'
//         });
//         if (result && actions.indexOf(result.data) !== -1) {
//             ApplicationSettings.setString('theme', result.data);
//         }
//     } catch (err) {
//         this.showError(err);
//     }
// }

export function applyTheme(theme: Themes) {
    const AppCompatDelegate = __ANDROID__ ? androidx.appcompat.app.AppCompatDelegate : undefined;
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
    }
}

export function toggleTheme(autoDark = false) {
    const newTheme = theme === 'dark' ? (autoDark ? 'auto' : 'light') : 'dark';
    setString('theme', newTheme);
}
export function isDark() {
    return theme === 'dark';
}

let started = false;
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
    prefs.on('key:theme', () => {
        let newTheme = getString('theme') as Themes;
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
        updateThemeColors(newTheme, newTheme !== 'auto');
        globalObservable.notify({ eventName: 'theme', data: theme });
    });
    const force = theme !== 'auto';
    if (__ANDROID__) {
        applyTheme(theme);
        if (Application.android && Application.android.context) {
            updateThemeColors(theme, force);
        } else {
            Application.on(Application.launchEvent, () => {
                updateThemeColors(theme, force);
            });
        }
    } else {
        if (Application.ios && Application.ios.window) {
            applyTheme(theme);
            updateThemeColors(theme, force);
        } else {
            Application.on(Application.displayedEvent, () => {
                applyTheme(theme);
                updateThemeColors(theme, force);
            });
        }
    }
}
