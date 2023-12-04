const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PathsPlugin = require('tsconfig-paths-webpack-plugin').default;

const sveltePreprocess = require('svelte-preprocess');
const SRC_FOLDER = path.resolve(__dirname, 'src/');
const DIST_FOLDER = path.resolve(__dirname, '../app/assets/webpdfviewer');
const ASSETS_FOLDER = path.resolve(__dirname, 'public/');

const ENTRY = path.resolve(SRC_FOLDER, 'main.ts');
module.exports = (env, params = {}) => ({
    mode: !!env.production ? 'production' : 'development',
    entry: ENTRY,
    stats: 'none',
    resolve: {
        conditionNames: ['svelte'],
        alias: {
            // svelte: path.resolve(__dirname, '../node_modules/svelte')
        },
        extensions: ['.mjs', '.js', '`.ts', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
        // plugins: [
        //     new PathsPlugin({
        //         extensions: ['.mjs', '.js', '.ts', '.svelte']
        //     })
        // ]
    },
    output: {
        path: DIST_FOLDER,
        // publicPath: DIST_FOLDER,
        filename: '[contenthash].[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.svelte$/,
                loader: 'svelte-loader',
                options: {
                    preprocess: sveltePreprocess(),
                    hotReload: true
                    // hotOptions: {
                    //     noPreserveState: true,
                    //     noReload: false,
                    //     optimistic: false
                    // }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                //Required to prevent errors from Svelte on Webpack 5+
                test: /..\/node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'initial'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[contenthash].[name].css'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            title: 'Svelte App'
        })
    ],
    devtool: false
});
