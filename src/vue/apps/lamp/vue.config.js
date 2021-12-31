const {
  searchForAliases,
  buildStyleResourcesLoaderConfig,
  readMasterExamples,
  buildDefinePluginConfig
} = require('@bldr/vue-config-helper')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const { exportSassAsJson } = require('@bldr/themes')
const packageJson = require('./package.json')

module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    // https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
    // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false)
  },

  configureWebpack: {
    resolve: {
      alias: searchForAliases(__dirname)
    },
    plugins: [
      buildDefinePluginConfig({
        defaultThemeSassVars: exportSassAsJson(),
        lampVersion: packageJson.version,
        rawYamlExamples: readMasterExamples()
      })
      // new BundleAnalyzerPlugin()
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
  pluginOptions: {
    ...buildStyleResourcesLoaderConfig(),
    electronBuilder: {
      preload: 'src/preload.js',
      mainProcessFile: 'src/lib/electron-background',
      // nodeIntegration: true,
      builderOptions: {
        appId: 'rocks.friedrich.baldr',
        productName: 'baldr-lamp',
        asar: true,
        linux: {
          target: 'deb',
          category: 'Education',
          executableName: 'baldr-lamp',
          icon: './icon.svg'
        },
        extraMetadata: {
          name: 'baldr-lamp'
        }
      }
    }
  }
}
