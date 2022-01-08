"use strict";
/**
 * Helper functions to build the configuration file `vue.config.js`
 *
 * @module @bldr/vue-config-helper
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureVue = exports.readMasterExamples = void 0;
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const style_resources_loader_1 = require("./style-resources-loader");
const webpack_aliases_1 = require("./webpack-aliases");
const define_plugin_1 = require("./define-plugin");
const electron_builder_1 = require("./electron-builder");
var master_examples_1 = require("./master-examples");
Object.defineProperty(exports, "readMasterExamples", { enumerable: true, get: function () { return master_examples_1.readMasterExamples; } });
/**
 * @see https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
 * @see https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
 *
 * @returns For example:
 *
 * ```js
 * config => {
 *   config.resolve.symlinks(false)
 * },
 * ```
 */
function buildChainWebpackConfig() {
    return function (config) {
        config.resolve.symlinks(false);
    };
}
// publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
/**
 * Usage:
 *
 * ```js
 * const { configureVue } = require('@bldr/vue-config-helper')
 *
 * module.exports = configureVue({
 *   dirname: new URL('.', import.meta.url).pathname,
 *   appEntry: './src/app.ts'
 * })
 * ```
 *
 * @returns For example:
 *
 * ```js
 * module.exports = {
 *   chainWebpack: config => {
 *     config.resolve.symlinks(false)
 *   },
 *   pluginOptions: {
 *     'style-resources-loader': {
 *       preProcessor: 'scss',
 *       patterns: [
 *         '.../baldr/src/vue/plugins/themes/src/default.scss',
 *         '.../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *       ]
 *     }
 *   },
 *   configureWebpack: {
 *     resolve: {
 *       alias: {
 *         ...
 *         '@bldr/yaml$': '.../baldr/src/vue/apps/lamp/node_modules/@bldr/yaml',
 *         'vue$': '.../baldr/src/vue/apps/lamp/node_modules/vue',
 *         'vuex$': '.../baldr/src/vue/apps/lamp/node_modules/vuex',
 *         ...
 *       }
 *     },
 *     plugins: [
 *       new DefinePlugin({
 *         config: JSON.stringify(config)
 *       })
 *     ],
 *     entry: {
 *       app: './src/app.ts'
 *     }
 *   }
 * }
 * ```
 */
function configureVue(simpleConfig) {
    // pluginOptions
    const pluginOptions = {
        'style-resources-loader': (0, style_resources_loader_1.buildStyleResourcesLoaderConfig)()
    };
    if (simpleConfig.electronAppName != null) {
        pluginOptions.electronBuilder = (0, electron_builder_1.buildElectronBuilderConfig)(simpleConfig.electronAppName);
    }
    // configureWebpack
    const configureWebpack = {
        resolve: {
            alias: (0, webpack_aliases_1.searchForAliases)(simpleConfig.dirname)
        },
        plugins: [(0, define_plugin_1.buildDefinePluginConfig)(simpleConfig.additionalDefinitions)]
    };
    if (simpleConfig.plugins != null) {
        configureWebpack.plugins = [
            ...configureWebpack.plugins,
            ...simpleConfig.plugins
        ];
    }
    if (simpleConfig.analyzeBundle != null && simpleConfig.analyzeBundle) {
        configureWebpack.plugins.push(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
    }
    if (simpleConfig.appEntry != null) {
        configureWebpack.entry = {
            app: simpleConfig.appEntry
        };
    }
    // Assemble all
    return {
        lintOnSave: true,
        chainWebpack: buildChainWebpackConfig(),
        pluginOptions,
        configureWebpack
    };
}
exports.configureVue = configureVue;
