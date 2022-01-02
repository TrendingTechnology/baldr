interface StyleResourcesLoaderConfig {
    'style-resources-loader': {
        preProcessor: string;
        patterns: string[];
    };
}
/**
 * Usage:
 *
 * ```js
 * pluginOptions: {
 *   ...buildStyleResourcesLoaderConfig()
 * }
 * ```
 *
 * @see https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
 *
 * @returns For example:
 *
 *  * ```js
 * {
 *   'style-resources-loader': {
 *     preProcessor: 'scss',
 *     patterns: [
 *       '.../baldr/src/vue/plugins/themes/src/default.scss',
 *       '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *     ]
 *   }
 * }
 * ```
 */
export declare function buildStyleResourcesLoaderConfig(): StyleResourcesLoaderConfig;
export {};
