const {
  searchForAliases,
  getStylePaths,
  readMasterExamples
} = require('@bldr/vue-config-helper')

const { DefinePlugin } = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const { gitHead } = require('@bldr/core-node')
const { exportSassAsJson } = require('@bldr/themes')
const packageJson = require('./package.json')
const { getConfig } = require('@bldr/config')

const config = getConfig()

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
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        defaultThemeSassVars: JSON.stringify(exportSassAsJson()),
        gitHead: JSON.stringify(gitHead()),
        lampVersion: JSON.stringify(packageJson.version),
        rawYamlExamples: JSON.stringify(readMasterExamples())
      })
      // new BundleAnalyzerPlugin()
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: getStylePaths()
    },
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
