interface StyleResourcesLoaderConfig {
    preProcessor: string;
    patterns: string[];
}
/**
 * Usage:
 *
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': buildStyleResourcesLoaderConfig()
 * }
 * ```
 *
 * @see https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
 *
 * @returns For example:
 *
 *  * ```js
 * {
 *   preProcessor: 'scss',
 *   patterns: [
 *     '.../baldr/src/vue/plugins/themes/src/default.scss',
 *     '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *   ]
 * }
 * ```
 */
export declare function buildStyleResourcesLoaderConfig(): StyleResourcesLoaderConfig;
export {};
