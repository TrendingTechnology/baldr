/**
 * Helper functions to build the configuration file `vue.config.js`
 *
 * @module @bldr/vue-config-helper
 */
export { readMasterExamples } from './master-examples';
interface VueSimplifiedConfig {
    dirname: string;
    appEntry?: string;
    electronAppName?: string;
    additionalDefinitions?: Record<string, any>;
    analyzeBundle?: boolean;
}
/**
 * Usage:
 *
 * ```js
 * const { configureVue } = require('@bldr/vue-config-helper')
 *
 * module.exports = configureVue({
 *   dirname: __dirname,
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
export declare function configureVue(simpleConfig: VueSimplifiedConfig): Record<string, any>;
