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
  'style-resources-loader': {
    preProcessor: string
    patterns: string[]
  }
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
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': {
 *     preProcessor: 'scss',
 *     patterns: [
 *       '.../baldr/src/vue/plugins/themes/src/default.scss',
 *       '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *     ]
 *   }
 * }
 * ```
 *
 * @see https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
 */
export function buildStyleResourcesLoaderConfig (): StyleResourcesLoaderConfig {
  return {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: getStylePaths()
    }
  }
}
