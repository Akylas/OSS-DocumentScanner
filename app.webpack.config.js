const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
const { readFileSync, readdirSync } = require('fs');
const { dirname, join, relative, resolve } = require('path');
const nsWebpack = require('@nativescript/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const IgnoreNotFoundExportPlugin = require('./scripts/IgnoreNotFoundExportPlugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const Fontmin = require('@akylas/fontmin');

function fixedFromCharCode(codePt) {
    if (codePt > 0xffff) {
        codePt -= 0x10000;
        return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
    } else {
        return String.fromCharCode(codePt);
    }
}
module.exports = (env, params = {}) => {
    Object.keys(env).forEach((k) => {
        if (env[k] === 'false' || env[k] === '0') {
            env[k] = false;
        } else if (env[k] === 'true' || env[k] === '1') {
            env[k] = true;
        }
    });
    if (env.adhoc_sentry) {
        env = Object.assign(
            {},
            {
                production: env.production !== false,
                sentry: true,
                uploadSentry: true,
                testlog: true,
                noconsole: false,
                sourceMap: true,
                uglify: env.production !== false
            },
            env
        );
    } else if (env.adhoc) {
        env = Object.assign(
            {},
            {
                production: true,
                noconsole: true,
                sentry: false,
                uploadSentry: false,
                apiKeys: true,
                sourceMap: false,
                uglify: true
            },
            env
        );
    } else if (env.timeline) {
        env = Object.assign(
            {},
            {
                production: true,
                sentry: false,
                noconsole: false,
                uploadSentry: false,
                keep_classnames_functionnames: true,
                sourceMap: false,
                uglify: true
            },
            env
        );
    }
    const nconfig = require('./nativescript.config');
    const {
        appPath = nconfig.appPath,
        appResourcesPath = nconfig.appResourcesPath,
        production,
        sourceMap,
        hiddenSourceMap,
        inlineSourceMap,
        sentry,
        uploadSentry,
        uglify,
        profile,
        noconsole,
        timeline,
        cartoLicense = false,
        devlog,
        testlog,
        fork = true,
        startOnCam = false,
        keep_classnames_functionnames = false,
        locale = 'auto',
        theme = 'auto',
        adhoc
    } = env;
    console.log('env', env);
    env.appPath = appPath;
    env.appResourcesPath = appResourcesPath;
    env.appComponents = env.appComponents || [];

    nsWebpack.chainWebpack((config, env) => {
        config.when(env.production, (config) => {
            config.module
                .rule('svelte')
                .use('string-replace-loader')
                .loader('string-replace-loader')
                .before('svelte-loader')
                .options({
                    search: 'createElementNS\\("https:\\/\\/svelte.dev\\/docs#template-syntax-svelte-options"',
                    replace: 'createElementNS(svN',
                    flags: 'gm'
                })
                .end();
        });

        return config;
    });
    const config = webpackConfig(env, params);
    const mode = production ? 'production' : 'development';
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const projectRoot = params.projectRoot || __dirname;
    const dist = nsWebpack.Utils.platform.getDistPath();
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    if (profile) {
        const StatsPlugin = require('stats-webpack-plugin');

        config.plugins.unshift(
            new StatsPlugin(resolve(join(projectRoot, 'webpack.stats.json')), {
                preset: 'minimal',
                chunkModules: true,
                modules: true,
                usedExports: true
            })
        );
        // config.profile = true;
        // config.parallelism = 1;
        // config.stats = { preset: 'minimal', chunkModules: true, modules: true, usedExports: true };
    }

    config.externals.push('~/licenses.json');
    config.externals.push(function ({ context, request }, cb) {
        if (/i18n$/i.test(context)) {
            return cb(null, './i18n/' + request.slice(2));
        }
        cb();
    });

    const coreModulesPackageName = fork ? '@akylas/nativescript' : '@nativescript/core';
    if (fork) {
        config.resolve.modules = [resolve(__dirname, `node_modules/${coreModulesPackageName}`), resolve(__dirname, 'node_modules'), `node_modules/${coreModulesPackageName}`, 'node_modules'];
        Object.assign(config.resolve.alias, {
            '@nativescript/core': `${coreModulesPackageName}`,
            'tns-core-modules': `${coreModulesPackageName}`
        });
    }
    let appVersion;
    let buildNumber;
    if (platform === 'android') {
        const gradlePath = resolve(projectRoot, appResourcesPath, 'Android/app.gradle');
        const gradleData = readFileSync(gradlePath, 'utf8');
        appVersion = gradleData.match(/versionName "((?:[0-9]+\.?)+)"/)[1];
        buildNumber = gradleData.match(/versionCode ([0-9]+)/)[1];
    } else if (platform === 'ios') {
        const plistPath = resolve(projectRoot, appResourcesPath, 'iOS/Info.plist');
        const plistData = readFileSync(plistPath, 'utf8');
        appVersion = plistData.match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
        buildNumber = plistData.match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
    }

    Object.assign(config.resolve.alias, {
        '../driver/oracle/OracleDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './oracle/OracleDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/cockroachdb/CockroachDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './cockroachdb/CockroachDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/cordova/CordovaDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './cordova/CordovaDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './react-native/ReactNativeDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/react-native/ReactNativeDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './nativescript/NativescriptDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/nativescript/NativescriptDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './mysql/MysqlDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/mysql/MysqlDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './postgres/PostgresDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/postgres/PostgresDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './expo/ExpoDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './aurora-data-api/AuroraDataApiDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/aurora-data-api/AuroraDataApiDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './sqlite/SqliteDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/sqljs/SqljsDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './sqljs/SqljsDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/sqlserver/SqlServerDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './sqlserver/SqlServerDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './mongodb/MongoDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/mongodb/MongoDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './sap/SapDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/sap/SapDriver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        './better-sqlite3/BetterSqlite3Driver': '@nativescript-community/sqlite/typeorm/NativescriptDriver',
        '../driver/better-sqlite3/BetterSqlite3Driver': '@nativescript-community/sqlite/typeorm/NativescriptDriver'
    });

    config.externalsPresets = { node: false };
    config.resolve.fallback = config.resolve.fallback || {};
    // config.resolve.fallback.buffer = require.resolve('buffer/');
    config.resolve.fallback.buffer = false;
    config.resolve.fallback.util = require.resolve('util/');
    config.resolve.fallback.path = false;
    config.resolve.fallback.fs = false;
    config.resolve.fallback.assert = false;
    config.resolve.fallback.tty = false;
    config.resolve.fallback.os = false;

    const package = require('./package.json');
    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const APP_STORE_ID = process.env.IOS_APP_ID;
    const supportedLocales = readdirSync(join(projectRoot, appPath, 'i18n'))
        .filter((s) => s.endsWith('.json'))
        .map((s) => s.replace('.json', ''));
    const defines = {
        PRODUCTION: !!production,
        process: 'global.process',
        'global.TNS_WEBPACK': 'true',
        'gVars.platform': `"${platform}"`,
        __UI_LABEL_USE_LIGHT_FORMATTEDSTRING__: true,
        __UI_USE_EXTERNAL_RENDERER__: true,
        __UI_USE_XML_PARSER__: false,
        'global.__AUTO_REGISTER_UI_MODULES__': false,
        __IOS__: isIOS,
        __ANDROID__: isAndroid,
        'global.autoLoadPolyfills': false,
        'gVars.internalApp': false,
        TNS_ENV: JSON.stringify(mode),
        __APP_ID__: `"${nconfig.id}"`,
        __APP_VERSION__: `"${appVersion}"`,
        __APP_BUILD_NUMBER__: `"${buildNumber}"`,
        __CARTO_PACKAGESERVICE__: cartoLicense,
        SUPPORTED_LOCALES: JSON.stringify(supportedLocales),
        DEFAULT_LOCALE: `"${locale}"`,
        DEFAULT_THEME: `"${theme}"`,
        START_ON_CAM: startOnCam,
        SENTRY_ENABLED: !!sentry,
        NO_CONSOLE: noconsole,
        SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
        SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
        GIT_URL: `"${package.repository}"`,
        // SUPPORT_URL: `"${package.bugs.url}"`,
        STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${nconfig.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
        STORE_REVIEW_LINK: `"${
            isIOS
                ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
                : `market://details?id=${nconfig.id}`
        }"`,
        DEV_LOG: !!devlog,
        TEST_LOG: !!devlog || !!testlog
    };
    Object.assign(config.plugins.find((p) => p.constructor.name === 'DefinePlugin').definitions, defines);

    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);

    const scssPrepend = `$mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};
    `;
    const scssLoaderRuleIndex = config.module.rules.findIndex((r) => r.test && r.test.toString().indexOf('scss') !== -1);
    config.module.rules.splice(
        scssLoaderRuleIndex,
        1,
        {
            test: /app\.scss$/,
            use: [
                { loader: 'apply-css-loader' },
                {
                    loader: 'css2json-loader',
                    options: { useForImports: true }
                }
            ]
                .concat(
                    !!production
                        ? [
                              {
                                  loader: 'postcss-loader',
                                  options: {
                                      postcssOptions: {
                                          plugins: [
                                              [
                                                  'cssnano',
                                                  {
                                                      preset: 'advanced'
                                                  }
                                              ],
                                              ['postcss-combine-duplicated-selectors', { removeDuplicatedProperties: true }]
                                          ]
                                      }
                                  }
                              }
                          ]
                        : []
                )
                .concat([
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            additionalData: scssPrepend
                        }
                    }
                ])
        },
        {
            test: /\.module\.scss$/,
            use: [
                { loader: 'css-loader', options: { url: false } },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        }
    );

    const usedMDIICons = [];
    config.module.rules.push({
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|svelte)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z0-9-_]+)',
                    replace: (match, p1, offset, str) => {
                        if (mdiIcons[p1]) {
                            const unicodeHex = mdiIcons[p1];
                            const numericValue = parseInt(unicodeHex, 16);
                            const character = fixedFromCharCode(numericValue);
                            usedMDIICons.push(numericValue);
                            return character;
                        }
                        return match;
                    },
                    flags: 'g'
                }
            }
        ]
    });
    // we remove default rules
    config.plugins = config.plugins.filter((p) => ['CopyPlugin', 'ForkTsCheckerWebpackPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    const globOptions = { dot: false, ignore: [`**/${relative(appPath, appResourcesFullPath)}/**`] };

    const context = nsWebpack.Utils.platform.getEntryDirPath();
    const copyPatterns = [
        { context, from: 'fonts/!(ios|android)/**/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: 'fonts/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: `fonts/${platform}/**/*`, to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.jpg', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.png', noErrorOnMissing: true, globOptions },
        { context, from: 'assets/**/*', noErrorOnMissing: true, globOptions },
        { context, from: 'i18n/**/*', globOptions },
        {
            from: 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
            to: 'fonts',
            globOptions,
            transform: !!production
                ? {
                      transformer(content, path) {
                          return new Promise((resolve, reject) => {
                              new Fontmin()
                                  .src(content)
                                  .use(Fontmin.glyph({ subset: usedMDIICons }))
                                  .run(function (err, files) {
                                      if (err) {
                                          reject(err);
                                      } else {
                                          resolve(files[0].contents);
                                      }
                                  });
                          });
                      }
                  }
                : undefined
        }
    ];
    config.plugins.unshift(new CopyPlugin({ patterns: copyPatterns }));

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            svN: '~/svelteNamespace'
        })
    );

    config.plugins.push(new SpeedMeasurePlugin());

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            setTimeout: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'setTimeout'],
            clearTimeout: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'clearTimeout'],
            setInterval: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'setInterval'],
            clearInterval: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'clearInterval'],
            // FormData: [require.resolve(coreModulesPackageName + '/polyfills/formdata'), 'FormData'],
            requestAnimationFrame: [require.resolve(coreModulesPackageName + '/animation-frame'), 'requestAnimationFrame'],
            cancelAnimationFrame: [require.resolve(coreModulesPackageName + '/animation-frame'), 'cancelAnimationFrame']
        })
    );
    config.plugins.push(new webpack.ContextReplacementPlugin(/dayjs[\/\\]locale$/, new RegExp(`(${supportedLocales.join('|')}).\js`)));

    config.optimization.splitChunks.cacheGroups.defaultVendor.test = /[\\/](node_modules|ui-carto|ui-chart|NativeScript[\\/]dist[\\/]packages[\\/]core)[\\/]/;
    config.plugins.push(new IgnoreNotFoundExportPlugin());

    const nativescriptReplace = '(NativeScript[\\/]dist[\\/]packages[\\/]core|@nativescript/core)';
    config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/http$/, (resource) => {
            if (resource.context.match(nativescriptReplace) || resource.request === '@nativescript/core/http') {
                resource.request = '@nativescript-community/https';
            }
        })
    );
    if (fork) {
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/accessibility$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/accessibility';
                }
            })
        );
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/action-bar$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/action-bar';
                }
            })
        );
    }
    // save as long as we dont use calc in css
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /reduce-css-calc$/ }));
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /punnycode$/ }));
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^url$/ }));

    if (!!production && !timeline) {
        console.log('removing N profiling');
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/profiling$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/profile';
                }
            })
        );
        if (!sentry) {
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(/trace$/, (resource) => {
                    if (resource.context.match(nativescriptReplace)) {
                        resource.request = '~/shims/trace';
                    }
                })
            );
        }
        config.module.rules.push(
            {
                // rules to replace mdi icons and not use nativescript-font-icon
                test: /\.(js)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: /__decorate\(\[((\s|\t|\n)*?)([a-zA-Z]+\.)?profile((\s|\t|\n)*?)\],.*?,.*?,.*?\);?/gm,
                            replace: (match, p1, offset, str) => '',
                            flags: 'gm'
                        }
                    }
                ]
            },
            {
                // rules to replace mdi icons and not use nativescript-font-icon
                test: /\.(ts)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '@profile',
                            replace: (match, p1, offset, str) => '',
                            flags: ''
                        }
                    }
                ]
            },
            // rules to clean up all Trace in production
            // we must run it for all files even node_modules
            {
                test: /\.(ts|js)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: /if\s*\(\s*Trace.isEnabled\(\)\s*\)/gm,
                            replace: (match, p1, offset, str) => 'if (false)',
                            flags: 'g'
                        }
                    }
                ]
            }
        );
    }
    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                async: false
            })
        );
    }

    if (hiddenSourceMap || sourceMap) {
        if (!!sentry && !!uploadSentry) {
            config.devtool = false;
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    append: `\n//# sourceMappingURL=${process.env.SENTRY_PREFIX}[name].js.map`,
                    filename: join(process.env.SOURCEMAP_REL_DIR, '[name].js.map')
                })
            );
            config.plugins.push(
                new sentryWebpackPlugin({
                    release: {
                        name: `${nconfig.id}@${appVersion}+${buildNumber}`,
                        dist: `${buildNumber}.${platform}`
                    },
                    sourcemaps: {
                        assets: [dist, join(dist, process.env.SOURCEMAP_REL_DIR)],
                        ignore: ['tns-java-classes', 'hot-update']
                    }
                })
            );
        } else {
            config.devtool = 'inline-nosources-cheap-module-source-map';
        }
    } else {
        config.devtool = false;
    }

    config.experiments = {
        topLevelAwait: true
    };

    config.externalsPresets = { node: false };
    config.resolve.fallback = config.resolve.fallback || {};
    // config.resolve.fallback.timers = require.resolve('timers/');
    config.resolve.fallback.stream = false;
    config.resolve.fallback.timers = false;
    // config.optimization.usedExports = true;
    config.optimization.minimize = uglify !== undefined ? !!uglify : production;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap || !!inlineSourceMap;
    const actual_keep_classnames_functionnames = keep_classnames_functionnames || platform !== 'android';
    config.optimization.usedExports = true;
    config.optimization.minimizer = [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: isAndroid ? 2020 : 2020,
                module: true,
                toplevel: false,
                keep_classnames: actual_keep_classnames_functionnames,
                keep_fnames: actual_keep_classnames_functionnames,
                output: {
                    comments: false,
                    semicolons: !isAnySourceMapEnabled
                },
                mangle: {
                    properties: {
                        reserved: ['__metadata'],
                        regex: /^(m[A-Z])/
                    }
                },
                compress: {
                    booleans_as_integers: false,
                    // The Android SBG has problems parsing the output
                    // when these options are enabled
                    collapse_vars: platform !== 'android',
                    sequences: platform !== 'android',
                    passes: 3,
                    drop_console: production && noconsole
                }
            }
        })
    ];
    return config;
};
