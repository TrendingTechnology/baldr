interface VueSimplifiedConfig {
    dirname: string;
    appEntry?: string;
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
export declare function assembleVueConfigs(config: VueSimplifiedConfig): Record<string, any>;
export {};
