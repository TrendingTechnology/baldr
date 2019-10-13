// Node packages.
const path = require('path')

// Third party packages.
const { DefinePlugin } = require('webpack')

// Project packages
const { utils } = require('@bldr/core')

function stylePath (packageName) {
  return path.join(path.dirname(require.resolve(packageName)), 'styles.scss')
}

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(utils.bootstrapConfig()),
        gitHead: JSON.stringify(utils.gitHead())
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        stylePath('@bldr/theme-default'),
        stylePath('@bldr/theme-handwriting')
      ]
    }
  }
}
