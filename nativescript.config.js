module.exports = {
    ignoredNativeDependencies: ['@nativescript-community/sentry', '@nativescript/detox'],
    id: process.env['APP_ID'] || 'com.akylas.documentscanner',
    appResourcesPath: process.env['APP_RESOURCES'] || 'App_Resources/documentscanner',
    buildPath: process.env['APP_BUILD_PATH'] || 'build/documentscanner',
    webpackConfigPath: 'app.webpack.config.js',
    appPath: 'app',
    i18n: {
        defaultLanguage: 'en'
    },
    android: {
        gradleVersion: '8.3',
        markingMode: 'none',
        codeCache: true,
        enableMultithreadedJavascript: false
    },
    cssParser: 'rework',
    hooks: [
        {
            type: 'after-prepareNativeApp',
            script: 'scripts/after-prepareNativeApp.js'
        }
    ]
};
