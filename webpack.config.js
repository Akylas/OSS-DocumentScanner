const webpack = require('@nativescript/webpack');
module.exports = (env) => {
    webpack.init(env);
    webpack.chainWebpack((config, env) => {
        // turns out this isn't enough now. svelte uses "node" of which "electron-main" is a subset in its export map forcing imports
        // for 'svelte' to 'ssr.mjs'. We define an alias here to force it back.
        config.resolve.alias.set('svelte$', 'svelte/internal');

        config.when(env.production, (config) => {
            config.module
                .rule('svelte')
                .use('string-replace-loader')
                .loader('string-replace-loader')
                .before('svelte-loader')
                .options({
                    search: 'createElementNS\\("https:\\/\\/svelte\\.dev\\/docs#svelte_options"',
                    replace: 'createElementNS(svN',
                    flags: 'gm'
                })
                .end();
        });

        return config;
    });
    // return webpack.resolveChainableConfig();
    return webpack.resolveConfig();
};
