// Node packages.
const path = require('path')

// Third party packages.
const { DefinePlugin } = require('webpack')

// Project packages
const { gitHead } = require('@bldr/core-node')

const config = require('@bldr/config')

const themePath = path.dirname(require.resolve('@bldr/themes'))

module.exports = {
  chainWebpack: (config) => {
    // https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
    // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        gitHead: JSON.stringify(gitHead())
      })
    ]
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.join(themePath, 'default.scss')
      ]
    }
  }
}
