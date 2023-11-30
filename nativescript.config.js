module.exports = {
    ignoredNativeDependencies: ['@nativescript-community/sentry'],
    id: process.env['APP_ID'] || 'com.akylas.documentscanner',
    appResourcesPath: process.env['APP_RESOURCES'] || 'App_Resources',
    buildPath: process.env['APP_BUILD_PATH'] || 'platforms',
    webpackConfigPath: 'app.webpack.config.js',
    appPath: 'app',
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
