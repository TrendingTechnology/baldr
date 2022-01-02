import { buildStyleResourcesLoaderConfig } from './style-resources-loader'
import { searchForAliases } from './webpack-aliases'
import { buildDefinePluginConfig } from './define-plugin'

interface VueSimplifiedConfig {
  dirname: string
  appEntry?: string
}

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
function buildChainWebpackConfig () {
  return function (config: any): void {
    config.resolve.symlinks(false)
  }
}

/**
 * Usage:
 *
 * ```js
 * const { assembleVueConfigs } = require('@bldr/vue-config-helper')
 *
 * module.exports = assembleVueConfigs({
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
export function assembleVueConfigs (
  config: VueSimplifiedConfig
): Record<string, any> {
  const vueConfig: Record<string, any> = {
    chainWebpack: buildChainWebpackConfig(),
    pluginOptions: {
      ...buildStyleResourcesLoaderConfig()
    },
    configureWebpack: {
      resolve: {
        alias: searchForAliases(config.dirname)
      },
      plugins: [buildDefinePluginConfig()]
    }
  }

  if (config.appEntry != null) {
    vueConfig.configureWebpack.entry = {
      app: config.appEntry
    }
  }

  return vueConfig
}
