const timelineEnabled = !!process.env['NS_TIMELINE'];
const sentryEnabled = !!process.env['NS_SENTRY'];
const loggingEnabled = !!process.env['NS_LOGGING'];
const id = process.env['APP_ID'];
const CARD_APP = id === 'com.akylas.cardwallet';
module.exports = {
    ignoredNativeDependencies: [].concat(sentryEnabled ? [] : ['@nativescript-community/sentry']),
    id: id || 'com.akylas.documentscanner',
    appResourcesPath: process.env['APP_RESOURCES'] || 'App_Resources/documentscanner',
    buildPath: process.env['APP_BUILD_PATH'] || 'build/documentscanner',
    webpackPackageName: '@akylas/nativescript-webpack',
    webpackConfigPath: 'app.webpack.config.js',
    appPath: 'app',
    forceLog: loggingEnabled,
    profiling: timelineEnabled ? 'timeline' : undefined,
    i18n: {
        defaultLanguage: 'en'
    },
    ios: {
        runtimePackageName: '@akylas/nativescript-ios-runtime'
    },
    android: {
        plugins: {
            'plugin-nativeprocessor': {
                // based on the app the plugin is built with our without qrcode.
                // so both apps cant use the same aar. we use a suffix to differentiate them
                aarSuffix: CARD_APP ? '-cardwallet' : '-documentscanner'
            }
        },
        runtimePackageName: '@akylas/nativescript-android-runtime',
        gradleVersion: '8.6',
        markingMode: 'none',
        codeCache: true,
        // for cardwallet we enable qrcode. and then we filter aar to only use the one we want
        gradleArgs: CARD_APP ? ['-PwithQRCode', '-PaarIgnoreFilter=**/*documentscanner*'] : ['-PaarIgnoreFilter=**/*cardwallet*'],
        enableMultithreadedJavascript: false,
        handleTimeZoneChanges: true,
        ...(loggingEnabled
            ? {
                  forceLog: true,
                  maxLogcatObjectSize: 40096
              }
            : {})
    },
    cssParser: 'rework',
    hooks: [
        {
            type: 'after-prepareNativeApp',
            script: 'scripts/after-prepareNativeApp.js'
        }
    ]
};
