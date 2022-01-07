import path from 'path'

function stylePath (themeName: 'default' | 'handwriting'): string {
  return path.join(
    path.dirname(require.resolve('@bldr/themes')),
    `${themeName}.scss`
  )
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
function getStylePaths (): string[] {
  return [stylePath('default'), stylePath('handwriting')]
}

interface StyleResourcesLoaderConfig {
  preProcessor: string
  patterns: string[]
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
export function buildStyleResourcesLoaderConfig (): StyleResourcesLoaderConfig {
  return {
    preProcessor: 'scss',
    patterns: getStylePaths()
  }
}
