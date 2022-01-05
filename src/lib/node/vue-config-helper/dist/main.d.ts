/**
 * Helper functions to build the configuration file `vue.config.js`
 *
 * @module @bldr/vue-config-helper
 */
export { readMasterExamples } from './master-examples';
/**
 * ```js
 * {
 *   dirname: __dirname,
 *   appEntry: './src/app.ts'
 *   additionalDefinitions: {
 *     defaultThemeSassVars: exportSassAsJson(),
 *     lampVersion: packageJson.version,
 *     rawYamlExamples: readMasterExamples()
 *   },
 *   electronAppName: 'lamp',
 *   analyzeBundle: true
 * }
 * ```
 */
interface SimpleVueConfig {
    /**
     * ```js
     * {
     *   dirname: __dirname
     * }
     * ```
     */
    dirname: string;
    /**
     * ```js
     * {
     *   appEntry: './src/app.ts'
     * }
     * ```
     */
    appEntry?: string;
    /**
     * @see https://github.com/nklayman/vue-cli-plugin-electron-builder
     */
    electronAppName?: string;
    /**
     * ```js
     * {
     *   additionalDefinitions: {
     *     defaultThemeSassVars: exportSassAsJson(),
     *     lampVersion: packageJson.version,
     *     rawYamlExamples: readMasterExamples()
     *   }
     * }
     * ```
     */
    additionalDefinitions?: Record<string, any>;
    /**
     * @see https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    analyzeBundle?: boolean;
    plugins?: Array<any>;
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
export declare function configureVue(simpleConfig: SimpleVueConfig): Record<string, any>;
