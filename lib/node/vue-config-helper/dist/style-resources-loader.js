import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
function stylePath(themeName) {
    return path.join(path.dirname(require.resolve('@bldr/themes')), `${themeName}.scss`);
}
/**
 * ```js
 * 'style-resources-loader': {
 *   patterns: [
 *     '.../baldr/src/vue/plugins/themes/src/default.scss',
 *     '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *   ]
 * }
 * ```
 */
function getStylePaths() {
    return [stylePath('default'), stylePath('handwriting')];
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
export function buildStyleResourcesLoaderConfig() {
    return {
        preProcessor: 'scss',
        patterns: getStylePaths()
    };
}
