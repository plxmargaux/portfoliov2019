'use strict';

const path = require('path');
const AppManifestWebpackPlugin = require('app-manifest-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpackPlugin = require('webpack');
const fs = require('fs');


/**
 * Manage Project Configuration
 */
const configuration = {
    // Project themes
    themes: {
        portfolio: './',
    },
    paths: {
        index: 'src/index.js',
        src: './src/',
        dest: './dist/',
    },
    filename: {
        js: 'js/[name].[hash].js',
        css: 'css/[name].[hash].css',
        img: 'img/[name].[hash].[ext]',
    },

};

/**
 * Parse HTML files and put it into webpack plugins
 */
const generateHtmlPlugins = (templateDir) => {
    const templateFiles = fs.readdirSync(path.resolve(templateDir));
    return templateFiles.map(item => {
        // Split names and extension
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HTMLWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(`${templateDir}/${name}.${extension}`)
        })
    })
};

/**
 * Object to create webpack configuration
 */
const webpack = {
    watch: null,
    dev: false,

    /**
     * Default configuration
     */
    config: {
        resolve: {
            symlinks: false,
        },
        devServer: {
            overlay: true,
            proxy: {
                "/web": {
                    target: "http://localhost:8000",
                    pathRewrite: {"^/web": ""}
                }
            },
            contentBase: configuration.paths.dest,
            // CORS
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
        watch: false,
        output: {
            path: '',
            filename: configuration.filename.js,
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.scss/,
                    exclude: /(node_modules|bower_components)/,
                    use: '',
                },
                {
                    test: /\.css$/,
                    use: '',
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash].[ext]'
                    }
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                esModule: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new webpackPlugin.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            // CleanWebpackPlugin
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: configuration.filename.css,
                chunkFilename: '[id].css'
            }),
            new CopyPlugin({
                    patterns: [
                        { from: configuration.paths.src + 'images/gallery/large/', to: path.resolve('dist/img/gallery/large/') },
                    ],
                }
            ),
        ].concat(generateHtmlPlugins(configuration.paths.src + 'views/'))
        .concat( new AppManifestWebpackPlugin({
            logo: configuration.paths.src + 'images/favicon.png',
            persistentCache: true,
            output: '/img/icons-[hash:8]/',
        })),
    },

    /**
     * Initialize configuration
     * @param parameters
     */
    init(parameters) {
        this.dev = parameters.mode === 'development';
        this.watch = !!parameters.watch;
        this.getEnvConfiguration();
        this.getThemesConfiguration();
    },


    /**
     * Use Makefile parameters to select theme
     */
    getThemesConfiguration() {
        // Generate themes configuration
        const getThemes = () => {
            if (Object.entries(configuration.themes).length !== 0) {
                const themes = Object.entries(configuration.themes);
                const currentConfig = {...this.config};

                for (const [key, value] of themes) {
                    currentConfig.entry = {[key]: value + configuration.paths.index};
                    currentConfig.name = key;
                    currentConfig.output = {
                        path: path.resolve(value + configuration.paths.dest),
                        filename: configuration.filename.js,
                    };
                }

                return currentConfig;
            }
        };

        if (getThemes() === undefined) {
            this.finalConfig = this.config;
        } else {
            this.finalConfig = [getThemes()];
        }
    },


    /**
     * Add properties depending of the environment configuration
     */
    getEnvConfiguration() {
        this.config.watch = this.dev;
        this.config.devtool = this.dev ? 'cheap-module-eval-source-map' : false;
        this.config.module.rules[1].use = [...this.style.loaders, 'sass-loader'];
        this.config.module.rules[2].use = [...this.style.loaders];
    },

    /**
     * Manage style loaders
     */
    style: {
        loaders: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: './../',
            },
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1
            }
        },
        {
            loader: 'group-css-media-queries-loader',
            options: {sourceMap: false},
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    ctx: {
                        cssnano: {},
                        autoprefixer: {}
                    }
                }
            }
        }],
    },
};

module.exports = (env, parameters) => {
    webpack.init(parameters);
    console.log(webpack.finalConfig);
    return webpack.finalConfig;
};
