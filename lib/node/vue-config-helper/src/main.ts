/**
 * Helper functions to build the configuration file `vue.config.js`
 *
 * @module @bldr/vue-config-helper
 */

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { buildStyleResourcesLoaderConfig } from './style-resources-loader'
import { searchForAliases } from './webpack-aliases'
import { buildDefinePluginConfig } from './define-plugin'
import { buildElectronBuilderConfig } from './electron-builder'
export { readMasterExamples } from './master-examples'

/**
 * ```js
 * {
 *   dirname: new URL('.', import.meta.url).pathname,
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
   *   dirname: new URL('.', import.meta.url).pathname
   * }
   * ```
   */
  dirname: string

  /**
   * ```js
   * {
   *   appEntry: './src/app.ts'
   * }
   * ```
   */
  appEntry?: string

  /**
   * @see https://github.com/nklayman/vue-cli-plugin-electron-builder
   */
  electronAppName?: string

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
  additionalDefinitions?: Record<string, any>

  /**
   * @see https://github.com/webpack-contrib/webpack-bundle-analyzer
   */
  analyzeBundle?: boolean

  plugins?: any[]
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

// publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',

/**
 * Usage:
 *
 * ```js
 * const { configureVue } = require('@bldr/vue-config-helper')
 *
 * module.exports = configureVue({
 *   dirname: new URL('.', import.meta.url).pathname,
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
export function configureVue (
  simpleConfig: SimpleVueConfig
): Record<string, any> {
  // pluginOptions
  const pluginOptions: Record<string, any> = {
    'style-resources-loader': buildStyleResourcesLoaderConfig()
  }
  if (simpleConfig.electronAppName != null) {
    pluginOptions.electronBuilder = buildElectronBuilderConfig(
      simpleConfig.electronAppName
    )
  }

  // configureWebpack
  const configureWebpack: Record<string, any> = {
    resolve: {
      alias: searchForAliases(simpleConfig.dirname)
    },
    plugins: [buildDefinePluginConfig(simpleConfig.additionalDefinitions)]
  }

  if (simpleConfig.plugins != null) {
    configureWebpack.plugins = [
      ...configureWebpack.plugins,
      ...simpleConfig.plugins
    ]
  }

  if (simpleConfig.analyzeBundle != null && simpleConfig.analyzeBundle) {
    configureWebpack.plugins.push(new BundleAnalyzerPlugin())
  }
  if (simpleConfig.appEntry != null) {
    configureWebpack.entry = {
      app: simpleConfig.appEntry
    }
  }

  // Assemble all
  return {
    lintOnSave: true,
    chainWebpack: buildChainWebpackConfig(),
    pluginOptions,
    configureWebpack
  }
}
