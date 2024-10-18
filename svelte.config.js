const sveltePreprocess = require('svelte-preprocess');
const { existsSync } = require('fs');

let customPreprocess;
if (existsSync('./svelte.config.custom.js')) {
    customPreprocess = require('./svelte.config.custom.js');
}
// this can be called either through svelte-loader where we want either __ANDROID__ or __IOS__ to be defined but not both
// or through svelte-check where we want both so everything is checked
const webpack_env = process.env['NATIVESCRIPT_WEBPACK_ENV']
    ? JSON.parse(process.env['NATIVESCRIPT_WEBPACK_ENV'])
    : {
          android: true,
          ios: true
      };

module.exports = {
    compilerOptions: {
        namespace: 'foreign'
    },
    preprocess: [
        sveltePreprocess({
            replace: [
                [/__ANDROID__/g, !!webpack_env.android],
                [/__IOS__/g, !!webpack_env.ios]
            ].concat(customPreprocess?.replace || []),
            typescript: {
                compilerOptions: {
                    target: 'es2020'
                }
            }
        })
        // svelteNativePreprocessor()
    ]
};
