const webpackConfig = require('./webpack.config.js');
const svelteNativePreprocessor = require('svelte-native-preprocessor');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const { existsSync, mkdirSync, readFileSync } = require('fs');
const { dirname, join, relative, resolve, sep } = require('path');
const nsWebpack = require('@nativescript/webpack');
const nativeClassTransformer = require('@nativescript/webpack/transformers/ns-transform-native-classes').default;
const preprocessConfig = require('./svelte.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = (env, params = {}) => {
    const {
        appPath = 'app',
        appResourcesPath = 'app/App_Resources',
        hmr, // --env.hmr
        production, // --env.production
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        inlineSourceMap, // --env.inlineSourceMap
        sentry, // --env.sentry
        verbose, // --env.verbose
        devlog, // --env.devlog
        adhoc, // --env.adhoc
    } = env;

    if (adhoc) {
        env = Object.assign({}, env, {
            production: true,
            sentry: true,
            sourceMap: true,
            uglify: true,
        });
    }
    const config = webpackConfig(env, params);
    const mode = production ? 'production' : 'development';
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const tsconfig = 'tsconfig.json';
    const projectRoot = params.projectRoot || __dirname;
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    Object.assign(config.resolve.alias, {
        '../driver/oracle/OracleDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './oracle/OracleDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/cockroachdb/CockroachDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cockroachdb/CockroachDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './react-native/ReactNativeDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/react-native/ReactNativeDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './nativescript/NativescriptDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/nativescript/NativescriptDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './mysql/MysqlDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/mysql/MysqlDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './postgres/PostgresDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/postgres/PostgresDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './expo/ExpoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './aurora-data-api/AuroraDataApiDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/aurora-data-api/AuroraDataApiDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqlite/SqliteDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/sqljs/SqljsDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqljs/SqljsDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/sqlserver/SqlServerDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqlserver/SqlServerDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './mongodb/MongoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/mongodb/MongoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
    });

    const package = require('./package.json');
    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const APP_STORE_ID = process.env.IOS_APP_ID;
    const defines = {
        PRODUCTION: !!production,
        process: 'global.process',
        'global.TNS_WEBPACK': 'true',
        'global.platform': `"${platform}"`,
        'global.isIOS': platform === 'ios',
        'global.isAndroid': platform === 'android',
        'global.isIOS': platform === 'ios',
        'global.isAndroid': platform === 'android',
        TNS_ENV: JSON.stringify(mode),
        'gVars.sentry': !!sentry,
        SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
        SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
        LOG_LEVEL: devlog ? '"full"' : '""',
        TEST_LOGS: adhoc || !production,
        GIT_URL: `"${package.repository}"`,
        STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${package.nativescript.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
        STORE_REVIEW_LINK: `"${
            isIOS
                ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
                : `market://details?id=${package.nativescript.id}`
        }"`,
    };

    const itemsToClean = [`${dist}/**/*`];
    if (platform === 'android') {
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'snapshots/**/*')}`);
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'build', 'configurations', 'nativescript-android-snapshot')}`);
        console.log('itemsToClean', itemsToClean);
    }

    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);

    const scssPrepend = `$lato-fontFamily: ${platform === 'android' ? 'res/lato' : 'Lato'};
    $mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};`;

    // config.resolve.mainFields = ['module', 'main'];
    config.resolve.extensions = ['.svelte', '.ts', '.mjs', '.js', '.scss', '.css'];

    // insert the mjs loader after ts-loader
    const css2jsonLoaderRuleIndex = config.module.rules.findIndex((r) => r.use.loader === 'css-loader');
    const scssLoaderRuleIndex = config.module.rules.findIndex((r) => Array.isArray(r.use) && r.use.indexOf('sass-loader') !== -1);
    config.module.rules.splice(scssLoaderRuleIndex, 1);
    config.module.rules.splice(
        css2jsonLoaderRuleIndex,
        0,
        {
            test: /\.scss$/,
            exclude: /\.module\.scss$/,
            use: [
                {
                    loader: '@nativescript/webpack/helpers/css2json-loader',
                    options: { useForImports: true },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend,
                    },
                },
            ],
        },
        {
            test: /\.module\.scss$/,
            use: [
                { loader: 'css-loader', options: { url: false } },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend,
                    },
                },
            ],
        }
    );
    // console.log(config.module.rules);
    const indexOfTsLoaderRule = config.module.rules.findIndex((r) => r.use.loader === 'ts-loader');

    config.module.rules[indexOfTsLoaderRule].use.options.getCustomTransformers = (program) => ({
        before: [nativeClassTransformer],
    });
    const mjsRule = {
        test: /\.mjs$/,
        type: 'javascript/auto',
    };
    // const mjsRule = {
    //     test: /\.m?js$/,
    //     use: {
    //         loader: 'babel-loader',
    //         options: {
    //             presets: [
    //                 [
    //                     '@babel/preset-env',
    //                     {
    //                         useBuiltIns: 'entry',
    //                         exclude: ['@babel/plugin-transform-regenerator'],
    //                         modules:'commonjs',
    //                     },
    //                 ],
    //             ],
    //         },
    //     },
    // };
    config.module.rules.splice(indexOfTsLoaderRule + 1, 0, {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'svelte-loader-hot',
                options: {
                    preprocess: [preprocessConfig.preprocess, svelteNativePreprocessor],
                    hotReload: hmr,
                    hotOptions: {
                        native: hmr,
                    },
                },
            },
        ],
    });
    config.module.rules.splice(indexOfTsLoaderRule, 0, mjsRule);
    config.module.rules.splice(1, 0, {
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|svelte)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z-]+)',
                    replace: (match, p1, offset, string) => {
                        if (mdiIcons[p1]) {
                            return String.fromCharCode(parseInt(mdiIcons[p1], 16));
                        }
                        return match;
                    },
                    flags: 'g',
                },
            },
        ],
    });

    // // we remove default rules
    config.plugins = config.plugins.filter((p) => ['DefinePlugin', 'CleanWebpackPlugin', 'CopyWebpackPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    config.plugins.unshift(
        new CopyWebpackPlugin({
            patterns: [
                { from: 'fonts/!(ios|android)/**/*', to: 'fonts', flatten: true, noErrorOnMissing: true },
                { from: 'fonts/*', to: 'fonts', flatten: true, noErrorOnMissing: true },
                { from: `fonts/${platform}/**/*`, to: 'fonts', flatten: true, noErrorOnMissing: true },
                {
                    from: '**/*.+(jpg|png)',
                    globOptions: {
                        ignore: [`${relative(appPath, appResourcesFullPath)}/**`],
                    },
                    noErrorOnMissing: true,
                },
                { from: 'assets/**/*', noErrorOnMissing: true },
                {
                    from: '../node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
                    to: 'fonts',
                    noErrorOnMissing: true,
                },
            ],
        })
    );
    config.plugins.unshift(
        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
            verbose: true,
            cleanOnceBeforeBuildPatterns: itemsToClean,
        })
    );
    config.plugins.unshift(new webpack.DefinePlugin(defines));
    config.plugins.push(
        new webpack.EnvironmentPlugin(
            ({
                NODE_ENV: JSON.stringify(mode), // use 'development' unless process.env.NODE_ENV is defined
                DEBUG: false,
            },
            params.environmentPlugin || {})
        )
    );

    if (hiddenSourceMap || sourceMap) {
        if (!!sentry) {
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    append: `\n//# sourceMappingURL=${process.env.SENTRY_PREFIX}[name].js.map`,
                    filename: join(process.env.SOURCEMAP_REL_DIR, '[name].js.map'),
                })
            );
            let appVersion;
            let buildNumber;
            if (platform === 'android') {
                appVersion = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionName "((?:[0-9]+\.?)+)"/)[1];
                buildNumber = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionCode ([0-9]+)/)[1];
            } else if (platform === 'ios') {
                appVersion = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
                buildNumber = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
            }
            console.log('appVersion', appVersion, buildNumber);

            config.plugins.push(
                new SentryCliPlugin({
                    release: appVersion,
                    urlPrefix: 'app:///',
                    rewrite: true,
                    dist: `${buildNumber}.${platform}`,
                    ignore: ['tns-java-classes', 'hot-update'],
                    include: [dist, join(dist, process.env.SOURCEMAP_REL_DIR)],
                })
            );
        } else {
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    noSources: true,
                })
            );
        }
    }
    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                tsconfig: resolve(tsconfig),
                async: false,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                memoryLimit: 4096,
                workers: 1,
            })
        );
    }
    return config;
};
