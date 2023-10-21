module.exports = {
    ignoredNativeDependencies: ['@nativescript-community/sentry'],
    id: 'com.akylas.documentscanner',
    appResourcesPath: 'App_Resources',
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
