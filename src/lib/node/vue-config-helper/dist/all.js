"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assembleVueConfigs = void 0;
const style_resources_loader_1 = require("./style-resources-loader");
const webpack_aliases_1 = require("./webpack-aliases");
const define_plugin_1 = require("./define-plugin");
function buildChainWebpackConfig() {
    return function (config) {
        config.resolve.symlinks(false);
    };
}
/**
 * @returns For example:
 *
 * ```js
 * module.exports = {
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
function assembleVueConfigs(config) {
    const vueConfig = {
        chainWebpack: buildChainWebpackConfig(),
        pluginOptions: Object.assign({}, (0, style_resources_loader_1.buildStyleResourcesLoaderConfig)()),
        configureWebpack: {
            resolve: {
                alias: (0, webpack_aliases_1.searchForAliases)(config.dirname)
            },
            plugins: [(0, define_plugin_1.buildDefinePluginConfig)()]
        }
    };
    if (config.appEntry != null) {
        vueConfig.configureWebpack.entry = {
            app: config.appEntry
        };
    }
    return vueConfig;
}
exports.assembleVueConfigs = assembleVueConfigs;
