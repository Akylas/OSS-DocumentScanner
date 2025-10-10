import { ApplicationSettings } from '@nativescript/core';
import { prefs } from '@shared/services/preferences';
import { createGlobalEventListener, globalObservable } from '@shared/utils/svelte/ui';
import { writable } from 'svelte/store';
import { DEFAULT_DRAW_FOLDERS_BACKGROUND, SETTINGS_DRAW_FOLDERS_BACKGROUND, SETTINGS_START_ON_CAM } from './utils/constants';

export * from '@shared/variables';

import { deviceHasCamera } from '@nativescript-community/ui-cameraview';
import { initVariables } from '@shared/variables';

initVariables({
    onInitRootView: () => {
        hasCamera.set(deviceHasCamera());
    },
    getTheme: (colorTheme) => `~/themes/${__APP_ID__}/${colorTheme}.json`
});

export const startOnCam = ApplicationSettings.getBoolean(SETTINGS_START_ON_CAM, START_ON_CAM);

export const hasCamera = writable(true);

export const orientationDegrees = writable(0);
export const shouldListenForSensorOrientation = writable(false);

export const folderBackgroundColor = writable(DEFAULT_DRAW_FOLDERS_BACKGROUND);
prefs.on(`key:${SETTINGS_DRAW_FOLDERS_BACKGROUND}`, () => {
    const newValue = ApplicationSettings.getBoolean(SETTINGS_DRAW_FOLDERS_BACKGROUND, DEFAULT_DRAW_FOLDERS_BACKGROUND);
    folderBackgroundColor.set(newValue);
    globalObservable.notify({ eventName: SETTINGS_DRAW_FOLDERS_BACKGROUND, data: newValue });
});
export const onFolderBackgroundColorChanged = createGlobalEventListener(SETTINGS_DRAW_FOLDERS_BACKGROUND);
